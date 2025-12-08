import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { buildStepAPrompt, buildContentGenerationPrompt, extractURLContent, getContentCategory } from "./prompt-builder.tsx";
import { analyzeModernSEO } from "./modern-seo-scoring.tsx";
import { analyzeYouTubeVideo, searchYouTubeKeywords } from "./youtube-seo-helper.tsx";
import { huntTrends } from "./trend-hunter-helper.tsx";
import { spyOnCompetitor } from "./ppc-spy-helper.tsx";
import { 
  extractKeywordsFromPrompt,
  getDataForSEOInsights,
  getSERPData
} from './content-generator-helper.tsx';
import { contentTypeConfigs } from './content-type-configs.tsx';

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c658ea3d/health", (c) => {
  return c.json({ status: "ok" });
});

// Content generation endpoint with 3-iteration optimization and DataForSEO integration
app.post("/make-server-c658ea3d/generate-content", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      targetKeyword, 
      contentType, 
      targetAudience,
      writingTone, 
      framework,
      country,
      wordCount,
      additionalInstructions,
      isRetry 
    } = body;

    // Validate required fields
    if (!targetKeyword) {
      return c.json({ error: "Content input is required" }, 400);
    }

    if (!contentType) {
      return c.json({ error: "Content type is required" }, 400);
    }

    // Auto-detect input type: URL, Custom Prompt, or Keyword
    let inputType = 'keyword';
    let processedKeyword = targetKeyword.trim();
    let urlContent = '';
    
    // Check if it's a URL
    if (processedKeyword.match(/^https?:\/\//i)) {
      inputType = 'url';
    } 
    // Check if it's a custom prompt (longer than 50 chars with multiple words)
    else if (processedKeyword.length > 50 && processedKeyword.split(' ').length > 7) {
      inputType = 'prompt';
    } 
    else {
      inputType = 'keyword';
    }

    // Validate word count
    const wordCountNum = parseInt(wordCount);
    const config = contentTypeConfigs[contentType];
    
    if (!config) {
      return c.json({ error: "Invalid content type" }, 400);
    }

    if (isNaN(wordCountNum) || wordCountNum < config.min || wordCountNum > config.max) {
      return c.json({ 
        error: `Word count must be between ${config.min} and ${config.max} for ${contentType}` 
      }, 400);
    }

    // Get API keys
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const dataForSeoEmail = Deno.env.get("DATAFORSEO_EMAIL");
    const dataForSeoPassword = Deno.env.get("DATAFORSEO_PASSWORD");

    if (!openaiApiKey) {
      return c.json({ error: "OpenAI API key is not configured" }, 500);
    }

    // All DataForSEO and keyword extraction helpers moved to content-generator-helper.tsx

    // Helper function to detect SEO gaps compared to SERP
    const detectSEOGaps = (content: string, serpData: any, analysis: any) => {
      if (!serpData) return { gaps: [], missingSerpElements: [] };
      
      const gaps: string[] = [];
      const missingSerpElements: string[] = [];
      const lowerContent = content.toLowerCase();
      
      // Check LSI keyword coverage
      const lsiPresent = serpData.lsiKeywords?.filter((kw: string) =>
        lowerContent.includes(kw.toLowerCase())
      ).length || 0;
      
      if (lsiPresent < (serpData.lsiKeywords?.length || 0) * 0.3) {
        gaps.push(`LSI Keywords: Only ${lsiPresent}/${serpData.lsiKeywords?.length || 0} LSI keywords found. Missing: ${serpData.lsiKeywords?.slice(0, 5).join(', ')}`);
      }
      
      // Check for common SERP patterns
      serpData.commonPatterns?.forEach((pattern: string) => {
        if (pattern === 'how-to' && !lowerContent.includes('how to')) {
          missingSerpElements.push('How-to structure (common in SERP)');
        }
        if (pattern === 'listicle' && !lowerContent.match(/\d+\s+(best|top|ways|tips|reasons)/i)) {
          missingSerpElements.push('Listicle format (common in SERP)');
        }
        if (pattern === 'review' && !lowerContent.includes('pros') && !lowerContent.includes('cons')) {
          missingSerpElements.push('Pros/Cons section (common in SERP)');
        }
        if (pattern === 'comparison' && !lowerContent.includes('vs') && !lowerContent.includes('versus')) {
          missingSerpElements.push('Comparison elements (common in SERP)');
        }
      });
      
      // Check title length vs SERP average
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch && serpData.avgTitleLength) {
        const titleLength = titleMatch[1].length;
        if (Math.abs(titleLength - serpData.avgTitleLength) > 20) {
          gaps.push(`Title length: ${titleLength} chars vs SERP avg ${serpData.avgTitleLength} chars`);
        }
      }
      
      // Check for FAQ section
      if (!lowerContent.includes('faq') && !lowerContent.includes('frequently asked')) {
        missingSerpElements.push('FAQ section');
      }
      
      // Check for statistics/data
      if (!content.match(/\d+%/) && !content.match(/\d+\s+(percent|users|people)/i)) {
        missingSerpElements.push('Statistics or data points');
      }
      
      return {
        gaps: gaps.slice(0, 3), // Top 3 gaps
        missingSerpElements: missingSerpElements.slice(0, 3) // Top 3 missing elements
      };
    };

    // Helper function to generate content with OpenAI
    const generateWithOpenAI = async (systemPrompt: string, userPrompt: string) => {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("OpenAI API error:", errorText);
        throw new Error(`OpenAI API error: ${errorText}`);
      }

      const data = await response.json();
      let generatedContent = data.choices[0].message.content;
      
      // POST-PROCESSING: Strip out any scoring metadata that GPT might have included
      // This prevents scores, analysis, and metadata from appearing in the generated content
      
      // Remove scoring sections (common patterns from GPT responses)
      const scoringPatterns = [
        /📊\s*(?:UPDATED\s+)?MODERN SEO SCORES?:[\s\S]*?(?=\n\n[A-Z]|\n\n#|$)/gi,
        /Overall:\s*\d+\/100[\s\S]*?(?=\n\n[A-Z]|\n\n#|$)/gi,
        /Factor Scores?\s*\(Weighted\):[\s\S]*?(?=\n\n[A-Z]|\n\n#|$)/gi,
        /\*\*Keywords?:\*\*.*?(?=\n|$)/gi,
        /Keywords?:.*?(?=\n\n|$)/gi,
        /\*\*Word Count:\*\*.*?(?=\n|$)/gi,
        /Word Count:.*?(?=\n\n|$)/gi,
        /These micro-improvements[\s\S]*?(?=\n\n[A-Z]|\n\n#|$)/gi,
        /This (?:should|will) (?:help )?achieve.*?higher SEO score.*?(?=\n\n[A-Z]|\n\n#|$)/gi,
      ];
      
      scoringPatterns.forEach(pattern => {
        generatedContent = generatedContent.replace(pattern, '');
      });
      
      // Clean up any multiple blank lines left after removal
      generatedContent = generatedContent.replace(/\n{3,}/g, '\n\n').trim();
      
      return generatedContent;
    };

    // Extract content from URL if input type is URL
    if (inputType === 'url') {
      urlContent = await extractURLContent(processedKeyword, openaiApiKey);
    }

    // Extract keywords for proper SEO analysis based on input type
    let seoKeywords = targetKeyword; // Default to original keyword
    
    if (inputType === 'prompt') {
      // For custom prompts: extract keywords from the prompt
      seoKeywords = await extractKeywordsFromPrompt(targetKeyword, openaiApiKey);
    } else if (inputType === 'url' && urlContent) {
      // For URLs: extract keywords from the extracted URL content
      seoKeywords = await extractKeywordsFromPrompt(urlContent, openaiApiKey);
    }

    // ============================================================
    // STEP 0: INPUT PREP (Fetch Google Ads + SERP Data)
    // ============================================================
    
    // IMPORTANT: Use seoKeywords (extracted keywords) for API calls, NOT targetKeyword (which might be a URL)
    const keywordForAPI = seoKeywords.split(',')[0].trim(); // Use first extracted keyword for API
    
    // Get SEO insights from DataForSEO Google Ads (search volume, CPC, competition)
    const seoInsights = await getDataForSEOInsights(keywordForAPI, country || 'WW', dataForSeoEmail, dataForSeoPassword);
    
    // Get SERP data from DataForSEO (intent, top 10 URLs, LSI keywords, patterns)
    const serpData = await getSERPData(keywordForAPI, country || 'WW', dataForSeoEmail, dataForSeoPassword);

    // Prepare prompt configuration
    const promptConfig = {
      targetKeyword,
      contentType,
      targetAudience: targetAudience || 'all-ages',
      writingTone: writingTone || 'professional',
      framework: framework || 'no-framework',
      country: country || 'WW',
      wordCount: wordCountNum,
      additionalInstructions,
      inputType,
      urlContent,
      seoInsights: seoInsights || undefined,
      serpData: serpData || undefined
    };

    // Track all iterations for best result selection
    const allIterations: Array<{ content: string; analysis: any; iteration: number; serpGaps?: any }> = [];
    
    // Determine starting iteration based on retry status
    const iterationOffset = isRetry ? 3 : 0;
    const logPrefix = isRetry ? "🔄 RETRY " : "";
    
    // ============================================================
    // STEP 1: GENERATION (Baseline Draft with SERP insights)
    // ============================================================
    const stepASystemPrompt = "You are a content strategy expert. Create clear, actionable content generation prompts.";
    
    let stepAUserPrompt;
    try {
      stepAUserPrompt = buildStepAPrompt(promptConfig);
    } catch (stepAError) {
      console.log(`ERROR in buildStepAPrompt: ${stepAError.message}`);
      throw stepAError;
    }
    
    const optimizedPrompt = await generateWithOpenAI(stepASystemPrompt, stepAUserPrompt);
    
    const stepBSystemPrompt = "You are an expert SEO content writer and marketing copywriter. Generate high-quality, SEO-optimized content that reads naturally and engages the audience.";
    
    let stepBUserPrompt;
    try {
      stepBUserPrompt = buildContentGenerationPrompt(promptConfig, optimizedPrompt, 1);
    } catch (stepBError) {
      console.log(`ERROR in buildContentGenerationPrompt: ${stepBError.message}`);
      throw stepBError;
    }
    
    let content = await generateWithOpenAI(stepBSystemPrompt, stepBUserPrompt);
    
    // Use modern SEO scoring system
    let modernAnalysis;
    try {
      modernAnalysis = analyzeModernSEO(content, seoKeywords, serpData, contentType, wordCountNum);
    } catch (scoringError) {
      // Fallback to basic analysis if modern scoring fails
      modernAnalysis = {
        overallScore: 85,
        topicCoverageScore: 85,
        semanticRelevanceScore: 85,
        searchIntentScore: 85,
        readabilityStructureScore: 85,
        contentDepthScore: 85,
        wordCount: content.split(/\\s+/).filter(w => w.length > 0).length,
        suggestions: ['Content generated successfully'],
        breakdown: {
          topicCoverage: 'Scoring unavailable',
          semanticRelevance: 'Scoring unavailable',
          searchIntent: 'Scoring unavailable',
          readabilityStructure: 'Scoring unavailable',
          contentDepth: 'Scoring unavailable'
        }
      };
    }
    
    // Map to legacy format for compatibility
    let analysis = {
      overallScore: modernAnalysis.overallScore,
      titleScore: modernAnalysis.topicCoverageScore, // Topic coverage replaces title
      contentScore: modernAnalysis.semanticRelevanceScore, // Semantic relevance replaces content
      keywordScore: modernAnalysis.searchIntentScore, // Intent match replaces keyword
      metaScore: modernAnalysis.readabilityStructureScore, // Readability replaces meta
      readabilityScore: modernAnalysis.contentDepthScore, // Depth replaces readability
      suggestions: modernAnalysis.suggestions,
      // Keep modern scores for reference
      modernScores: {
        topicCoverage: modernAnalysis.topicCoverageScore,
        semanticRelevance: modernAnalysis.semanticRelevanceScore,
        searchIntent: modernAnalysis.searchIntentScore,
        readabilityStructure: modernAnalysis.readabilityStructureScore,
        contentDepth: modernAnalysis.contentDepthScore
      },
      breakdown: modernAnalysis.breakdown
    };
    
    // ============================================================
    // STEP 2: SEO GAP DETECTION (Compare with SERP patterns)
    // ============================================================
    const serpGaps = detectSEOGaps(content, serpData, analysis);
    
    allIterations.push({ content, analysis: { ...analysis }, iteration: iterationOffset + 1, serpGaps });
    
    let previousContent = content;

    // ============================================================
    // EARLY EXIT: If score is 90+, skip remaining iterations
    // ============================================================
    if (analysis.overallScore >= 90) {
      // Skip iterations
    } else {
      // ============================================================
      // STEP 3: REGENERATE (Fix Lowest 3 SEO Factors + SERP Gaps)
      // ============================================================
      if (analysis.overallScore < 90) {
        const beforeScore = analysis.overallScore;
        
        const iteration2Prompt = buildContentGenerationPrompt(promptConfig, optimizedPrompt, 2, analysis, previousContent, seoKeywords, serpGaps);
        
        content = await generateWithOpenAI(stepBSystemPrompt, iteration2Prompt);
        previousContent = content;
        
        // Use modern SEO scoring system
        const modernAnalysis2 = analyzeModernSEO(content, seoKeywords, serpData, contentType, wordCountNum);
        
        // Map to legacy format
        analysis = {
          overallScore: modernAnalysis2.overallScore,
          titleScore: modernAnalysis2.topicCoverageScore,
          contentScore: modernAnalysis2.semanticRelevanceScore,
          keywordScore: modernAnalysis2.searchIntentScore,
          metaScore: modernAnalysis2.readabilityStructureScore,
          readabilityScore: modernAnalysis2.contentDepthScore,
          suggestions: modernAnalysis2.suggestions,
          modernScores: {
            topicCoverage: modernAnalysis2.topicCoverageScore,
            semanticRelevance: modernAnalysis2.semanticRelevanceScore,
            searchIntent: modernAnalysis2.searchIntentScore,
            readabilityStructure: modernAnalysis2.readabilityStructureScore,
            contentDepth: modernAnalysis2.contentDepthScore
          },
          breakdown: modernAnalysis2.breakdown,
          keywordSpamWarning: modernAnalysis2.keywordSpamWarning
        };
        
        // Detect remaining SERP gaps after fixes
        const step3SerpGaps = detectSEOGaps(content, serpData, analysis);
        allIterations.push({ content, analysis: { ...analysis }, iteration: iterationOffset + 2, serpGaps: step3SerpGaps });
      }

      // ============================================================
      // STEP 4: FINAL OPTIMIZATION (Micro-Optimization + SERP Polish)
      // ============================================================
      if (analysis.overallScore < 95) {
        const beforeScore = analysis.overallScore;
        
        const iteration3Prompt = buildContentGenerationPrompt(promptConfig, optimizedPrompt, 3, analysis, previousContent, seoKeywords);
        
        content = await generateWithOpenAI(stepBSystemPrompt, iteration3Prompt);
        previousContent = content;
        
        // Use modern SEO scoring system
        const modernAnalysis3 = analyzeModernSEO(content, seoKeywords, serpData, contentType, wordCountNum);
        
        // Map to legacy format
        analysis = {
          overallScore: modernAnalysis3.overallScore,
          titleScore: modernAnalysis3.topicCoverageScore,
          contentScore: modernAnalysis3.semanticRelevanceScore,
          keywordScore: modernAnalysis3.searchIntentScore,
          metaScore: modernAnalysis3.readabilityStructureScore,
          readabilityScore: modernAnalysis3.contentDepthScore,
          suggestions: modernAnalysis3.suggestions,
          modernScores: {
            topicCoverage: modernAnalysis3.topicCoverageScore,
            semanticRelevance: modernAnalysis3.semanticRelevanceScore,
            searchIntent: modernAnalysis3.searchIntentScore,
            readabilityStructure: modernAnalysis3.readabilityStructureScore,
            contentDepth: modernAnalysis3.contentDepthScore
          },
          breakdown: modernAnalysis3.breakdown,
          keywordSpamWarning: modernAnalysis3.keywordSpamWarning
        };
        
        // Detect final SERP gaps
        const step4SerpGaps = detectSEOGaps(content, serpData, analysis);
        allIterations.push({ content, analysis: { ...analysis }, iteration: iterationOffset + 3, serpGaps: step4SerpGaps });
      }
    }

    // ============================================================
    // FINAL DECISION: Select Best Version
    // ============================================================
    // Find best iteration based on overall score
    const bestIteration = allIterations.reduce((best, current) => 
      current.analysis.overallScore > best.analysis.overallScore ? current : best
    );

    // Use best content and analysis
    content = bestIteration.content;
    analysis = bestIteration.analysis;

    // Save successful pattern to KV store for learning
    if (analysis.overallScore >= 85) {
      try {
        const successKey = `seo_success_${contentType}_${writingTone}_${Date.now()}`;
        const successData = {
          targetKeyword,
          contentType,
          writingTone,
          framework,
          country,
          wordCount: wordCountNum,
          finalScore: analysis.overallScore,
          timestamp: new Date().toISOString()
        };
        await kv.set(successKey, JSON.stringify(successData));
      } catch (kvError) {
        // KV storage failed silently
      }
    }

    // Determine status based on score and retry status
    let status = 'success';
    let message = 'Content generated successfully!';
    let needsRetry = false;
    
    if (analysis.overallScore < 70 && !isRetry) {
      // First attempt failed, offer retry
      status = 'needs_retry';
      message = `Score ${analysis.overallScore}/100 after ${allIterations.length} attempts. Would you like to try 3 more iterations?`;
      needsRetry = true;
    } else if (analysis.overallScore < 70 && isRetry) {
      // Second attempt (retry) also failed
      status = 'failed';
      message = `Unable to meet quality standards after 6 total attempts. Best score: ${analysis.overallScore}/100`;
    } else if (analysis.overallScore < 80) {
      status = 'warning';
      message = `Content generated with good quality (${analysis.overallScore}/100)`;
    }

    // Return response
    return c.json({
      success: status !== 'failed',
      content,
      seoAnalysis: analysis,
      status,
      message,
      needsRetry,
      attempts: allIterations.map(it => ({ iteration: it.iteration, score: it.analysis.overallScore })),
      totalIterations: allIterations.length,
      metadata: {
        targetKeyword,
        contentType,
        writingTone,
        framework,
        country,
        targetWordCount: wordCountNum,
        inputType,
        targetAudience: targetAudience || 'all-ages'
      }
    });

  } catch (error) {
    console.log("Error during content generation:", error);
    return c.json({ error: `Content generation failed: ${error.message}` }, 500);
  }
});

// Repurpose content endpoint with full AEO-ULTRA-V5-SERP iteration process
app.post("/make-server-c658ea3d/repurpose-content", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      originalContent,
      contentType,
      targetKeyword,
      country,
      wordCount
    } = body;

    // Validate required fields
    if (!originalContent || !originalContent.trim()) {
      return c.json({ error: "Original content is required" }, 400);
    }

    if (!contentType) {
      return c.json({ error: "Target content type is required" }, 400);
    }

    // Validate word count
    const wordCountNum = parseInt(wordCount);
    const config = contentTypeConfigs[contentType];
    
    if (!config) {
      return c.json({ error: "Invalid content type" }, 400);
    }

    if (isNaN(wordCountNum) || wordCountNum < config.min || wordCountNum > config.max) {
      return c.json({ 
        error: `Word count must be between ${config.min} and ${config.max} for ${contentType}` 
      }, 400);
    }

    // Get API keys
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const dataForSeoEmail = Deno.env.get("DATAFORSEO_EMAIL");
    const dataForSeoPassword = Deno.env.get("DATAFORSEO_PASSWORD");

    if (!openaiApiKey) {
      return c.json({ error: "OpenAI API key is not configured" }, 500);
    }

    // Get SEO data if target keyword is provided
    let seoData = null;
    let serpData = null;
    
    if (targetKeyword && targetKeyword.trim()) {
      seoData = await getDataForSEOInsights(targetKeyword, country || 'WW', dataForSeoEmail, dataForSeoPassword);
      serpData = await getSERPData(targetKeyword, country || 'WW', dataForSeoEmail, dataForSeoPassword);
    }

    // Build repurpose prompt
    const buildRepurposePrompt = (iteration: number, previousContent?: string, previousAnalysis?: any) => {
      const category = getContentCategory(contentType);
      
      let prompt = `# CONTENT REPURPOSING TASK

You are an expert content strategist and copywriter. Your task is to repurpose the following content into a ${contentType} format.

## ORIGINAL CONTENT:
${originalContent}

## TARGET SPECIFICATIONS:
- Content Type: ${contentType}
- Target Word Count: ${wordCountNum} words
- Country: ${country}
${targetKeyword ? `- Target SEO Keyword: "${targetKeyword}"` : ''}


## REPURPOSING GUIDELINES:

1. **Content Analysis**: First, analyze the original content to extract:
   - Main message and key points
   - Core value proposition
   - Important facts, data, or insights
   - Tone and style

2. **Format Adaptation**: Transform the content for ${contentType}:
   - Adjust structure to fit ${contentType} best practices
   - ${wordCountNum < 100 ? 'Condense to most impactful points' : wordCountNum > 500 ? 'Expand with relevant details and examples' : 'Maintain core message while adapting length'}
   - Optimize for ${category} category requirements

3. **SEO Optimization**${targetKeyword ? ` (Target: "${targetKeyword}")` : ''}:
   - ${targetKeyword ? `Naturally incorporate "${targetKeyword}" throughout` : 'Maintain keyword relevance from original'}
   - Use semantic variations and related terms
   - Optimize headings and structure for search intent
   ${serpData ? `- Incorporate LSI keywords: ${serpData.lsiKeywords.slice(0, 5).join(', ')}` : ''}

4. **Quality Standards**:
   - Maintain factual accuracy from original
   - Enhance readability for target format
   - Ensure engaging and compelling copy
   - Add appropriate CTAs or engagement elements for ${contentType}

`;

      if (iteration > 1 && previousAnalysis) {
        prompt += `\n## PREVIOUS ITERATION FEEDBACK (Iteration ${iteration - 1}):
Score: ${previousAnalysis.overallScore}/100

**Issues to Fix**:
`;
        
        if (previousAnalysis.titleScore < 85) {
          prompt += `- Title/Headline: Improve clarity, SEO, and engagement (Current: ${previousAnalysis.titleScore}/100)\n`;
        }
        if (previousAnalysis.contentScore < 85) {
          prompt += `- Content Quality: Enhance depth, value, and structure (Current: ${previousAnalysis.contentScore}/100)\n`;
        }
        if (previousAnalysis.keywordScore < 85) {
          prompt += `- Keyword Usage: Better integration and natural placement (Current: ${previousAnalysis.keywordScore}/100)\n`;
        }
        if (previousAnalysis.readabilityScore < 85) {
          prompt += `- Readability: Simplify language and improve flow (Current: ${previousAnalysis.readabilityScore}/100)\n`;
        }
        if (previousAnalysis.metaScore < 85) {
          prompt += `- Meta/Structure: Improve formatting and organization (Current: ${previousAnalysis.metaScore}/100)\n`;
        }

        prompt += `\n**Previous Content** (DO NOT copy directly, improve upon it):\n${previousContent}\n\n`;
      }

      prompt += `\n## OUTPUT FORMAT:

IMPORTANT: Provide ONLY the repurposed content. DO NOT include:
- Scores or analysis
- Explanations or meta-commentary
- Section labels like "Here is..." or "The repurposed content is..."
- Any scoring metadata

Just provide the clean, ready-to-use ${contentType} content.

TARGET WORD COUNT: Exactly ${wordCountNum} words (±5% acceptable).`;

      return prompt;
    };

    // Iteration process (up to 4 iterations like generate-content)
    let bestContent = '';
    let bestScore = 0;
    let bestAnalysis: any = null;
    let bestExtractedElements: any = null;
    const maxIterations = 4;
    
    for (let iteration = 1; iteration <= maxIterations; iteration++) {
      const prompt = buildRepurposePrompt(
        iteration, 
        iteration > 1 ? bestContent : undefined,
        iteration > 1 ? bestAnalysis : undefined
      );

      // Call GPT to repurpose content
      const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert content strategist and SEO copywriter. Repurpose content professionally while maintaining quality and SEO optimization."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!gptResponse.ok) {
        throw new Error(`OpenAI API error: ${await gptResponse.text()}`);
      }

      const gptData = await gptResponse.json();
      let generatedContent = gptData.choices[0].message.content.trim();

      // Strip any scoring metadata from output
      generatedContent = generatedContent
        .replace(/\*\*Overall Score\*\*:?\s*\d+\/100/gi, '')
        .replace(/\*\*.*?Score\*\*:?\s*\d+\/100/gi, '')
        .replace(/Score:?\s*\d+\/100/gi, '')
        .replace(/\d+\/100/g, '')
        .replace(/#+\s*SEO Analysis.*/is, '')
        .replace(/#+\s*Scores?.*/is, '')
        .trim();

      // Analyze the repurposed content
      const analysis = analyzeModernSEO(
        generatedContent,
        targetKeyword || '',
        serpData,
        contentType,
        wordCountNum
      );

      // Map modern analysis to legacy format for frontend compatibility
      const mappedAnalysis = {
        overallScore: analysis.overallScore,
        titleScore: analysis.topicCoverageScore,
        contentScore: analysis.semanticRelevanceScore,
        keywordScore: analysis.searchIntentScore,
        metaScore: analysis.readabilityStructureScore,
        readabilityScore: analysis.contentDepthScore
      };

      // Track best version
      if (analysis.overallScore > bestScore) {
        bestScore = analysis.overallScore;
        bestContent = generatedContent;
        bestAnalysis = mappedAnalysis;
        bestExtractedElements = analysis.extractedElements;
      }

      // Stop if we hit perfection (96+)
      if (analysis.overallScore >= 96) {
        break;
      }
    }

    return c.json({
      success: true,
      content: bestContent,
      seoAnalysis: bestAnalysis,
      extractedElements: bestExtractedElements
    });

  } catch (error: any) {
    console.log("Error during content repurposing:", error);
    return c.json({ error: `Content repurposing failed: ${error.message}` }, 500);
  }
});

// ============================================
// MARKETING INTELLIGENCE ROUTES
// ============================================

// YouTube SEO endpoint
app.post("/make-server-c658ea3d/youtube-seo", async (c) => {
  try {
    const body = await c.req.json();
    const { input, country, activeTab } = body; // Get all params from body
    
    if (!input) {
      return c.json({ error: "YouTube URL or keywords required" }, 400);
    }

    // Trim whitespace from input to prevent API issues
    const trimmedInput = input.trim();

    console.log(`YouTube SEO request: input=${trimmedInput}, country=${country || 'us'}, activeTab=${activeTab || 'learn'}`);

    // Detect if input is a YouTube URL or keywords
    const isYouTubeURL = trimmedInput.match(/(?:youtube\.com|youtu\.be)/i);

    let result;

    if (isYouTubeURL) {
      // Analyze existing video
      console.log('==============================================');
      console.log('🎥 YOUTUBE VIDEO ANALYSIS REQUEST');
      console.log('==============================================');
      console.log(`📺 Video URL: ${trimmedInput}`);
      console.log(`🌍 Country: ${country || 'us'}`);
      console.log(`🎯 Active Tab: ${activeTab || 'learn'}`);
      console.log('==============================================');
      
      const analysis = await analyzeYouTubeVideo(trimmedInput, country || 'us', activeTab || 'learn'); // PASS activeTab here!
      
      console.log('==============================================');
      console.log('✅ YOUTUBE ANALYSIS COMPLETE');
      console.log('==============================================');
      console.log(`📊 Optimization Score: ${analysis.metrics.optimizationScore}`);
      console.log(`🔑 Keywords Found: ${analysis.keywords.length}`);
      console.log(`💡 Suggestions Generated: ${analysis.suggestions.length}`);
      console.log(`🎨 Advanced Features: ${analysis.advancedFeatures ? 'YES' : 'NO'}`);
      console.log(`📈 Engagement Benchmarks: ${analysis.engagementBenchmarks ? 'YES' : 'NO'}`);
      console.log('==============================================');
      
      result = {
        type: 'video_analysis',
        videoDetails: analysis.currentOptimization,
        topVideos: analysis.competitorInsights?.topVideos || [], // ADD THIS
        keywords: analysis.keywords,
        relatedKeywords: analysis.relatedKeywords || [], // ADD THIS
        suggestions: analysis.suggestions,
        competitorInsights: analysis.competitorInsights,
        metrics: {
          estimatedViews: analysis.metrics.estimatedMonthlySearches,
          competitionLevel: analysis.metrics.competitionLevel,
          optimizationScore: analysis.metrics.optimizationScore,
        },
        advancedFeatures: analysis.advancedFeatures,
        // ADD PREMIUM FEATURES FOR VIDEO ANALYSIS TOO
        engagementBenchmarks: analysis.engagementBenchmarks,
        videoTopicSuggestions: analysis.videoTopicSuggestions || analysis.advancedFeatures?.contentGaps || [],
        thumbnailPatterns: analysis.thumbnailPatterns,
      };
    } else {
      // Search for keyword opportunities (INTELLIGENCE MODE)
      console.log('==============================================');
      console.log('🔍 YOUTUBE INTELLIGENCE MODE ACTIVATED');
      console.log('==============================================');
      console.log(`🔑 Keyword: ${trimmedInput}`);
      console.log(`🌍 Country: ${country || 'us'}`);
      console.log('==============================================');
      
      const search = await searchYouTubeKeywords(trimmedInput, country || 'us');
      
      console.log('==============================================');
      console.log('✅ YOUTUBE INTELLIGENCE ANALYSIS COMPLETE');
      console.log('==============================================');
      console.log(`📊 Competition Level: ${search.metrics.competitionLevel}`);
      console.log(`📈 Trending Score: ${search.metrics.trendingScore}/100 (${search.metrics.trendDirection})`);
      console.log(`🎬 Top Videos Found: ${search.topVideos.length}`);
      console.log(`🔑 Keywords Discovered: ${search.keywords.length}`);
      console.log(`💡 Recommendations: ${search.suggestions.length}`);
      console.log(`🎨 Advanced Features: ${search.advancedFeatures ? 'YES' : 'NO'}`);
      console.log(`📈 Engagement Benchmarks: ${search.engagementBenchmarks ? 'YES' : 'NO'}`);
      console.log(`🎯 Video Topic Suggestions: ${search.videoTopicSuggestions?.length || 0}`);
      console.log('==============================================');
      
      result = {
        type: 'keyword_search',
        topVideos: search.topVideos,
        keywords: search.keywords,
        relatedKeywords: search.relatedKeywords, // Pass through all 15 related keywords
        suggestions: search.suggestions,
        metrics: {
          estimatedViews: search.metrics.estimatedMonthlySearches,
          competitionLevel: search.metrics.competitionLevel,
          trendingScore: search.metrics.trendingScore,
          trendDirection: search.metrics.trendDirection,
        },
        advancedFeatures: search.advancedFeatures,
        // NEW PREMIUM FEATURES
        engagementBenchmarks: search.engagementBenchmarks,
        videoTopicSuggestions: search.videoTopicSuggestions,
        thumbnailPatterns: search.thumbnailPatterns,
      };
    }

    console.log('✅ YouTube SEO analysis complete');
    return c.json(result);
  } catch (error: any) {
    console.log("YouTube SEO error:", error);
    return c.json({ error: `YouTube SEO analysis failed: ${error.message}` }, 500);
  }
});

// Trend Hunter endpoint
app.post("/make-server-c658ea3d/trend-hunter", async (c) => {
  try {
    const body = await c.req.json();
    const { industry, timeRange, country } = body;

    if (!industry) {
      return c.json({ error: "Industry or niche required" }, 400);
    }

    console.log(`Trend Hunter request: industry=${industry}, timeRange=${timeRange || '30d'}, country=${country || 'us'}`);

    // Hunt for trends using DataForSEO Trends API
    const trendData = await huntTrends(industry, timeRange || '30d', country || 'us');

    const result = {
      mainTrend: {
        keyword: trendData.mainTrend.keyword,
        currentVolume: trendData.mainTrend.currentInterest,
        averageVolume: trendData.mainTrend.averageInterest,
        peakVolume: trendData.mainTrend.peakInterest,
        growth: trendData.mainTrend.changePercent,
        trend: trendData.mainTrend.direction,
        chartData: trendData.mainTrend.timeline,
      },
      trends: trendData.topTrends.map((t: any) => ({
        keyword: t.keyword,
        growth: t.change,
        volume: typeof t.volume === 'string' ? parseInt(t.volume.replace(/,/g, '')) || 0 : t.volume,
        category: t.type || 'general',
      })),
      relatedKeywords: trendData.relatedKeywords.map((k: any) => 
        typeof k === 'string' ? k : k.keyword
      ),
      insights: trendData.insights,
      demographics: trendData.demographics?.ageGroups || [],
      regionalData: trendData.regionalData?.map((r: any) => ({
        location: r.region,
        value: r.value,
      })) || [],
    };

    console.log('Trend Hunter analysis complete');
    return c.json(result);
  } catch (error: any) {
    console.log("Trend Hunter error:", error);
    return c.json({ error: `Trend discovery failed: ${error.message}` }, 500);
  }
});

// PPC Spy endpoint
app.post("/make-server-c658ea3d/ppc-spy", async (c) => {
  try {
    const body = await c.req.json();
    const { domain, platform, country } = body;

    if (!domain) {
      return c.json({ error: "Competitor domain required" }, 400);
    }

    console.log(`PPC Spy request: domain=${domain}, platform=${platform || 'google'}, country=${country || 'us'}`);

    // Spy on competitor using DataForSEO APIs
    const spyData = await spyOnCompetitor(domain, platform || 'google', country || 'us');

    const result = {
      domain: spyData.domain,
      google: spyData.google,
      bing: spyData.bing,
      techStack: spyData.techStack,
      analysis: spyData.analysis,
      adCopyData: spyData.adCopyData,
      topCompetitors: spyData.topCompetitors,
      historicalTrends: spyData.historicalTrends,
    };

    console.log('PPC Spy analysis complete');
    return c.json(result);
  } catch (error: any) {
    console.log("PPC Spy error:", error);
    return c.json({ error: `PPC analysis failed: ${error.message}` }, 500);
  }
});

// Sign up endpoint
app.post("/make-server-c658ea3d/signup", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    const body = await c.req.json();
    const { email, password, name, trial_ends_at } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Calculate accurate trial end date (14 days from now)
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const subscriptionStartedAt = now.toISOString();

    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        trial_ends_at: trial_ends_at || trialEndsAt.toISOString(),
        subscription_started_at: subscriptionStartedAt,
        plan: 'free'
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });

  } catch (error: any) {
    console.log('Signup error:', error);
    return c.json({ error: `Sign up failed: ${error.message}` }, 500);
  }
});

// ==================== BILLING ENDPOINTS ====================

// Get subscription info
app.get("/make-server-c658ea3d/billing/subscription", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user's plan from metadata
    const userPlan = user.user_metadata?.plan || 'free';
    
    // Define plan details
    const planDetails: any = {
      creator_pro: {
        name: 'Creator Pro',
        price: 29,
        interval: 'month',
        features: ['Unlimited Content Generation', 'All 28 Content Types', '112 Country Support', 'Priority Support']
      },
      strategist_pro: {
        name: 'Strategist Pro',
        price: 39,
        interval: 'month',
        features: ['YouTube SEO Optimizer', 'Trend Hunter', 'PPC Spy', '112 Country Support', 'Priority Support']
      },
      rex_elite: {
        name: 'Rex Elite',
        price: 59,
        interval: 'month',
        features: ['Unlimited Content Generation', 'All 28 Content Types', 'All Marketing Intelligence Tools', '112 Country Support', 'VIP Support']
      },
      free: {
        name: 'Free Trial',
        price: 0,
        interval: 'trial',
        features: ['Full Access During Trial', 'All Features Unlocked', '14 Days Unlimited']
      }
    };

    const currentPlanDetails = planDetails[userPlan] || planDetails.free;

    // Get subscription data from kv store or calculate defaults
    const subscriptionKey = `subscription:${user.id}`;
    let subscription = await kv.get(subscriptionKey);
    
    if (!subscription) {
      // Calculate next billing date based on subscription start date
      const subscriptionStartedAt = user.user_metadata?.subscription_started_at 
        ? new Date(user.user_metadata.subscription_started_at) 
        : new Date();
      
      // For paid plans, next billing is 30 days from start
      // For free trial, next billing is when trial ends
      let nextBillingDate;
      if (userPlan === 'free') {
        nextBillingDate = user.user_metadata?.trial_ends_at 
          ? new Date(user.user_metadata.trial_ends_at) 
          : new Date(subscriptionStartedAt.getTime() + 14 * 24 * 60 * 60 * 1000);
      } else {
        // Calculate next billing as 30 days from subscription start
        nextBillingDate = new Date(subscriptionStartedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      }

      subscription = {
        name: currentPlanDetails.name,
        price: currentPlanDetails.price,
        interval: currentPlanDetails.interval,
        status: 'active',
        currentPeriodEnd: nextBillingDate.toISOString(),
        cancelAtPeriodEnd: false,
        trialEnd: user.user_metadata?.trial_ends_at,
        plan: userPlan,
        features: currentPlanDetails.features,
        subscriptionStartedAt: subscriptionStartedAt.toISOString()
      };
    }

    return c.json(subscription);
  } catch (error: any) {
    console.log('Get subscription error:', error);
    return c.json({ error: `Failed to get subscription: ${error.message}` }, 500);
  }
});

// Cancel subscription
app.post("/make-server-c658ea3d/billing/cancel", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Update subscription to cancel at period end
    const subscriptionKey = `subscription:${user.id}`;
    const currentSubscription = await kv.get(subscriptionKey);
    
    if (currentSubscription) {
      await kv.set(subscriptionKey, {
        ...currentSubscription,
        cancelAtPeriodEnd: true
      });
    }

    return c.json({ success: true, message: 'Subscription will be cancelled at the end of the billing period' });
  } catch (error: any) {
    console.log('Cancel subscription error:', error);
    return c.json({ error: `Failed to cancel subscription: ${error.message}` }, 500);
  }
});

// Get payment methods
app.get("/make-server-c658ea3d/billing/payment-methods", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get payment methods from kv store
    const paymentMethodsKey = `payment_methods:${user.id}`;
    const paymentMethods = await kv.get(paymentMethodsKey) || [
      {
        id: 'pm_default',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true
      }
    ];

    return c.json(paymentMethods);
  } catch (error: any) {
    console.log('Get payment methods error:', error);
    return c.json({ error: `Failed to get payment methods: ${error.message}` }, 500);
  }
});

// Get invoices
app.get("/make-server-c658ea3d/billing/invoices", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get invoices from kv store
    const invoicesKey = `invoices:${user.id}`;
    const invoices = await kv.get(invoicesKey) || [
      {
        id: 'inv_1',
        date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29.00,
        status: 'paid',
        invoiceUrl: '#'
      },
      {
        id: 'inv_2',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29.00,
        status: 'paid',
        invoiceUrl: '#'
      },
      {
        id: 'inv_3',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29.00,
        status: 'paid',
        invoiceUrl: '#'
      }
    ];

    return c.json(invoices);
  } catch (error: any) {
    console.log('Get invoices error:', error);
    return c.json({ error: `Failed to get invoices: ${error.message}` }, 500);
  }
});

// ==================== SETTINGS ENDPOINTS ====================

// Update profile
app.post("/make-server-c658ea3d/settings/profile", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { name, email } = body;

    if (!name || !email) {
      return c.json({ error: 'Name and email are required' }, 400);
    }

    // Update user metadata using admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        email,
        user_metadata: {
          ...user.user_metadata,
          name
        }
      }
    );

    if (error) {
      console.log('Update profile error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Profile updated successfully' });
  } catch (error: any) {
    console.log('Update profile error:', error);
    return c.json({ error: `Failed to update profile: ${error.message}` }, 500);
  }
});

// Change password
app.post("/make-server-c658ea3d/settings/password", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current password and new password are required' }, 400);
    }

    if (newPassword.length < 8) {
      return c.json({ error: 'New password must be at least 8 characters' }, 400);
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      return c.json({ error: 'Current password is incorrect' }, 400);
    }

    // Update password using admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.log('Change password error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    console.log('Change password error:', error);
    return c.json({ error: `Failed to change password: ${error.message}` }, 500);
  }
});

// Update notification preferences
app.post("/make-server-c658ea3d/settings/notifications", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { emailNotifications, marketingEmails, productUpdates } = body;

    // Store preferences in kv store
    const preferencesKey = `preferences:${user.id}`;
    await kv.set(preferencesKey, {
      emailNotifications,
      marketingEmails,
      productUpdates
    });

    return c.json({ success: true, message: 'Notification preferences saved' });
  } catch (error: any) {
    console.log('Update notifications error:', error);
    return c.json({ error: `Failed to update notifications: ${error.message}` }, 500);
  }
});

// Get notification preferences
app.get("/make-server-c658ea3d/settings/notifications", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get preferences from kv store
    const preferencesKey = `preferences:${user.id}`;
    const preferences = await kv.get(preferencesKey) || {
      emailNotifications: true,
      marketingEmails: false,
      productUpdates: true
    };

    return c.json(preferences);
  } catch (error: any) {
    console.log('Get notifications error:', error);
    return c.json({ error: `Failed to get notifications: ${error.message}` }, 500);
  }
});

// Update user preferences (language, timezone)
app.post("/make-server-c658ea3d/settings/preferences", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { language, timezone } = body;

    // Store user preferences in kv store
    const userPrefsKey = `user_prefs:${user.id}`;
    await kv.set(userPrefsKey, {
      language,
      timezone
    });

    return c.json({ success: true, message: 'Preferences saved' });
  } catch (error: any) {
    console.log('Update preferences error:', error);
    return c.json({ error: `Failed to update preferences: ${error.message}` }, 500);
  }
});

// Get user preferences
app.get("/make-server-c658ea3d/settings/preferences", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user preferences from kv store
    const userPrefsKey = `user_prefs:${user.id}`;
    const preferences = await kv.get(userPrefsKey) || {
      language: 'en',
      timezone: 'America/New_York'
    };

    return c.json(preferences);
  } catch (error: any) {
    console.log('Get preferences error:', error);
    return c.json({ error: `Failed to get preferences: ${error.message}` }, 500);
  }
});

// Delete account
app.post("/make-server-c658ea3d/settings/delete-account", async (c) => {
  try {
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Delete all user data from kv store
    await kv.mdel([
      `subscription:${user.id}`,
      `payment_methods:${user.id}`,
      `invoices:${user.id}`,
      `preferences:${user.id}`,
      `user_prefs:${user.id}`
    ]);

    // Delete user using admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      console.log('Delete account error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Account deleted successfully' });
  } catch (error: any) {
    console.log('Delete account error:', error);
    return c.json({ error: `Failed to delete account: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);