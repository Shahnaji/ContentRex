// Advanced Prompt Building with Content Category Intelligence and Audience-Tone Optimization
import { getMasterPrompt } from './master-prompt.tsx';

// ✅ NEW HELPER: Fix escaped newlines without regex complications
const fixPromptFormatting = (prompt: string): string => {
  // The file has literal \n characters (backslash + n) instead of actual newlines
  // We need to replace them with real newlines
  let fixed = '';
  for (let i = 0; i < prompt.length; i++) {
    if (prompt[i] === '\\' && prompt[i + 1] === 'n') {
      fixed += '\n';
      i++; // Skip the 'n'
    } else if (prompt[i] === '\\' && prompt[i + 1] === '"') {
      fixed += '"';
      i++; // Skip the quote
    } else {
      fixed += prompt[i];
    }
  }
  return fixed;
};

export interface PromptConfig {
  targetKeyword: string;
  contentType: string;
  targetAudience: string;
  writingTone: string;
  framework: string;
  country: string;
  wordCount: number;
  additionalInstructions?: string;
  inputType: string;
  urlContent?: string;
  seoInsights?: string;
  serpData?: any;
}

// Get audience-tone compatibility insights
export const getAudienceToneInsights = (audience: string, tone: string): string => {
  const insights: Record<string, Record<string, string>> = {
    'gen-z': {
      'casual': 'Perfect match! Use trendy language, memes, and internet slang.',
      'humorous': 'Great choice! Gen Z loves witty, self-aware humor.',
      'motivational': 'Excellent! Use inspiring, empowering language.',
      'professional': 'Use modern professional style, avoid being too formal or corporate.',
      'authoritative': 'Balance authority with relatability - avoid sounding preachy.',
      'persuasive': 'Focus on authenticity and social proof over hard sells.'
    },
    'millennials': {
      'casual': 'Ideal! Use conversational, authentic tone.',
      'persuasive': 'Great fit! Millennials respond well to data-driven persuasion.',
      'direct': 'Perfect! Value their time with clear, straightforward messaging.',
      'professional': 'Good match - professional but personable.',
      'humorous': 'Works well! Use smart, relatable humor.',
      'authoritative': 'Effective with backed-up claims and expertise.',
      'motivational': 'Strong choice! Focus on personal growth and achievement.'
    },
    'gen-x': {
      'professional': 'Excellent match! Direct, no-nonsense professional tone.',
      'direct': 'Perfect! Gen X appreciates straight talk.',
      'persuasive': 'Great choice! Use facts and practical benefits.',
      'authoritative': 'Strong fit! They respect expertise and experience.',
      'casual': 'Keep it authentic but avoid trying too hard to be cool.',
      'humorous': 'Use dry, clever humor - avoid forced jokes.',
      'motivational': 'Focus on practical results over inspiration.'
    },
    'baby-boomers': {
      'professional': 'Perfect match! Use respectful, polished tone.',
      'authoritative': 'Excellent! Boomers value expertise and credentials.',
      'persuasive': 'Strong choice! Use proven results and testimonials.',
      'direct': 'Works well! Clear communication without too much jargon.',
      'casual': 'Be personable but maintain respect and formality.',
      'humorous': 'Light, tasteful humor is appreciated.'
    },
    'all-ages': {
      'professional': 'Safe, universal choice. Clear and credible.',
      'friendly': 'Great! Warm but not too casual.',
      'direct': 'Effective across demographics. Clear and concise.',
      'persuasive': 'Works well - blend logic and emotion.',
      'casual': 'Keep it balanced - not too formal, not too slang-heavy.',
      'motivational': 'Universal appeal with positive, uplifting tone.'
    }
  };
  
  const audienceKey = audience.toLowerCase().replace(/\s+/g, '-');
  const toneKey = tone.toLowerCase();
  
  return insights[audienceKey]?.[toneKey] || 'This combination can work - adapt your language carefully.';
};

// Helper: Get content category based on type
export const getContentCategory = (contentType: string): string => {
  const categories: Record<string, string> = {
    // Long-form content (blog, articles, guides)
    'Blog Post': 'blog',
    'blog-post': 'blog',
    'article': 'blog',
    'Listicle': 'blog',
    'listicle': 'blog',
    'How-To Guide': 'blog',
    'how-to-guide': 'blog',
    'tutorial': 'blog',
    'Case Study': 'blog',
    'case-study': 'blog',
    'White Paper': 'blog',
    'whitepaper': 'blog',
    
    // E-commerce (product descriptions)
    'Product Description': 'ecommerce',
    'product-description': 'ecommerce',
    'Amazon Product Description': 'ecommerce',
    'amazon-listing': 'ecommerce',
    'Shopify Product Description': 'ecommerce',
    'shopify-listing': 'ecommerce',
    'Etsy Product Listing': 'ecommerce',
    'etsy-listing': 'ecommerce',
    'eBay Product Listing': 'ecommerce',
    'ebay-listing': 'ecommerce',
    'category-page-description': 'ecommerce',
    
    // Landing pages and web pages
    'Landing Page': 'landing',
    'landing-page-copy': 'landing',
    'landing-page-headline': 'landing',
    'About Page': 'landing',
    'about-us': 'landing',
    'Service Page': 'landing',
    'service-page': 'landing',
    'FAQ Page': 'landing',
    'cta-generator': 'landing',
    
    // Ads
    'Facebook Ad': 'email-ad',
    'facebook-ad': 'email-ad',
    'Instagram Ad': 'email-ad',
    'instagram-ad': 'email-ad',
    'TikTok Ad': 'email-ad',
    'tiktok-ad': 'email-ad',
    'Google Search Ad': 'email-ad',
    'google-search-ad': 'email-ad',
    'LinkedIn Ad': 'email-ad',
    'linkedin-ad': 'email-ad',
    
    // Email
    'Email Newsletter': 'email-ad',
    'newsletter': 'email-ad',
    'Promotional Email': 'email-ad',
    'promo-email': 'email-ad',
    
    // Social media
    'Facebook Post': 'social',
    'facebook-caption': 'social',
    'Instagram Caption': 'social',
    'instagram-caption': 'social',
    'TikTok Caption': 'social',
    'tiktok-caption': 'social',
    'Twitter/X Post': 'social',
    'twitter-post': 'social',
    'Twitter/X Thread': 'social',
    'twitter-thread': 'social',
    'LinkedIn Post': 'social',
    'linkedin-post': 'social',
    'hashtag-generator': 'social',
    
    // Video (YouTube)
    'YouTube Title': 'youtube',
    'YouTube Description': 'youtube',
    'youtube-title-description': 'youtube',
  };
  
  return categories[contentType] || 'general';
};

// STEP A Prompt Builder: Creates the optimized content strategy
export const buildStepAPrompt = (config: PromptConfig): string => {
  const { targetKeyword, contentType, targetAudience, writingTone, framework, country, wordCount, additionalInstructions, inputType, urlContent } = config;
  
  const category = getContentCategory(contentType);
  const audienceToneInsight = getAudienceToneInsights(targetAudience, writingTone);
  
  let prompt = `Create an optimized content strategy for the following:\\n\\n`;
  prompt += `INPUT TYPE: ${inputType}\\n`;
  
  if (inputType === 'url' && urlContent) {
    prompt += `URL CONTENT SUMMARY: ${urlContent}\\n`;
  } else if (inputType === 'prompt') {
    prompt += `CUSTOM PROMPT: ${targetKeyword}\\n`;
  } else {
    prompt += `KEYWORD/TOPIC: ${targetKeyword}\\n`;
  }
  
  prompt += `CONTENT TYPE: ${contentType} (Category: ${category})\\n`;
  prompt += `TARGET AUDIENCE: ${targetAudience}\\n`;
  prompt += `WRITING TONE: ${writingTone}\\n`;
  prompt += `COPYWRITING FRAMEWORK: ${framework}\\n`;
  prompt += `TARGET COUNTRY: ${country}\\n`;
  prompt += `WORD COUNT: ${wordCount} words\\n`;
  
  if (additionalInstructions) {
    prompt += `ADDITIONAL INSTRUCTIONS: ${additionalInstructions}\\\\\\\\n`;
  }
  
  prompt += `\\\\\\\\nAUDIENCE-TONE COMPATIBILITY: ${audienceToneInsight}\\\\\\\\n\\\\\\\\n`;
  prompt += `Generate a clear, optimized prompt that will guide the content creation. Focus on:\\\\\\\\n`;
  prompt += `1. The specific angle or approach for this ${contentType}\\\\\\\\n`;
  prompt += `2. Key points or sections to cover\\\\\\\\n`;
  prompt += `3. How to apply the ${framework} framework (if applicable)\\\\\\\\n`;
  prompt += `4. Tone and style specifics for ${targetAudience}\\\\\\\\n`;
  prompt += `5. Any country-specific considerations for ${country}\\\\\\\\n\\\\\\\\n`;
  prompt += `Return ONLY the optimized content prompt - no explanations.`;
  
  // FIX: Replace double-escaped newlines with actual newlines
  prompt = prompt.replace(/\\\\\\\\n/g, '\\n');
  
  const fixed = fixPromptFormatting(prompt);
  
  return fixed;
};

// Main content generation prompt builder with SERP integration
export const buildContentGenerationPrompt = (
  config: PromptConfig,
  optimizedPrompt: string,
  iteration: number = 1,
  previousAnalysis?: any,
  previousContent?: string,
  seoKeywords?: string,
  serpGaps?: any
): string => {
  const {
    targetKeyword,
    contentType,
    targetAudience,
    writingTone,
    framework,
    country,
    wordCount,
    additionalInstructions,
    inputType,
    urlContent,
    seoInsights,
    serpData
  } = config;
  
  // Use seoKeywords for SEO instructions, fallback to targetKeyword
  const keywordsForSEO = seoKeywords || targetKeyword;

  const category = getContentCategory(contentType);
  
  // Get base master prompt with V5 parameters
  const masterPromptText = getMasterPrompt({
    content_input: inputType === 'url' && urlContent ? urlContent : targetKeyword,
    content_type: contentType,
    audience: targetAudience || 'All Ages',
    tone: writingTone,
    framework: framework || 'No Framework',
    country: country || 'Worldwide',
    word_count: wordCount,
    seoKeywords: seoKeywords || undefined,
    googleAdsData: seoInsights || undefined,  // Map seoInsights to googleAdsData
    serpData: serpData ? JSON.stringify(serpData) : undefined
  });

  let finalPrompt = '';

  // ITERATION 1: Master Prompt + Optimized Prompt + SERP Insights
  if (iteration === 1) {
    finalPrompt = `${masterPromptText}\\n\\n`;
    finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n`;
    finalPrompt += `📋 OPTIMIZED CONTENT STRATEGY:\\n`;
    finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n`;
    finalPrompt += `${optimizedPrompt}\\n\\n`;
    
    // Add SERP-specific insights if available
    if (serpData) {
      finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n`;
      finalPrompt += `🔍 SERP COMPETITIVE INSIGHTS:\\n`;
      finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n`;
      
      if (serpData.searchIntent) {
        finalPrompt += `Search Intent: ${serpData.searchIntent}\\n`;
        finalPrompt += `→ Your content MUST match this intent\\n\\n`;
      }
      
      if (serpData.commonPatterns && serpData.commonPatterns.length > 0) {
        finalPrompt += `Top-ranking content patterns:\\n`;
        serpData.commonPatterns.forEach((pattern: string) => {
          finalPrompt += `  • ${pattern}\\n`;
        });
        finalPrompt += `→ Consider following these successful patterns\\n\\n`;
      }
      
      if (serpData.lsiKeywords && serpData.lsiKeywords.length > 0) {
        finalPrompt += `LSI Keywords found in top results:\\n`;
        finalPrompt += `${serpData.lsiKeywords.slice(0, 10).join(', ')}\\n`;
        finalPrompt += `→ Integrate these naturally throughout your content\\n\\n`;
      }
      
      if (serpData.avgTitleLength) {
        finalPrompt += `Average title length of top results: ${serpData.avgTitleLength} characters\\n`;
        finalPrompt += `→ Aim for similar length for better SERP performance\\n\\n`;
      }
    }
    
    finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n`;
    finalPrompt += `🎯 YOUR TASK:\\n`;
    finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n`;
    finalPrompt += `Generate the complete ${contentType} following ALL instructions above.\\n`;
    finalPrompt += `Target word count: ${wordCount} words (±5% acceptable)\\n`;
    finalPrompt += `Primary keywords: \"${keywordsForSEO}\"\\n\\n`;
    
    if (additionalInstructions) {
      finalPrompt += `ADDITIONAL REQUIREMENTS:\\n${additionalInstructions}\\n\\n`;
    }
    
    finalPrompt += `Return ONLY the final content - no meta-commentary.`;
  }
  
  // ITERATION 2: Regenerate with SEO fixes + SERP gap fixes
  else if (iteration === 2 && previousAnalysis && previousContent) {
    const analysis = previousAnalysis;
    
    // Use MODERN scores if available, otherwise fall back to legacy
    const modernScores = analysis.modernScores || {
      topicCoverage: analysis.titleScore || 85,
      semanticRelevance: analysis.contentScore || 85,
      searchIntent: analysis.keywordScore || 85,
      readabilityStructure: analysis.metaScore || 85,
      contentDepth: analysis.readabilityScore || 85
    };
    
    // Identify the 3 lowest-scoring MODERN SEO factors
    const scores = [
      { name: 'Topic Coverage', score: modernScores.topicCoverage, key: 'topicCoverage', 
        description: 'Coverage of topics found in top-ranking SERP results' },
      { name: 'Semantic Relevance', score: modernScores.semanticRelevance, key: 'semanticRelevance',
        description: 'Use of LSI keywords and related terms' },
      { name: 'Search Intent Match', score: modernScores.searchIntent, key: 'searchIntent',
        description: 'How well content matches user search intent' },
      { name: 'Readability & Structure', score: modernScores.readabilityStructure, key: 'readabilityStructure',
        description: 'Flesch score, heading hierarchy, paragraph structure' },
      { name: 'Content Depth', score: modernScores.contentDepth, key: 'contentDepth',
        description: 'Comprehensiveness vs competitors' },
    ];
    
    scores.sort((a, b) => a.score - b.score);
    const lowestThree = scores.slice(0, 3);
    
    finalPrompt = `You previously generated this content:\\n\\n`;
    finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n`;
    finalPrompt += `${previousContent}\\n`;
    finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n`;
    
    finalPrompt += `📊 MODERN SEO ANALYSIS (Based on Google Ranking Factors):\\n\\n`;
    finalPrompt += `Overall Score: ${analysis.overallScore}/100\\n\\n`;
    finalPrompt += `Factor Scores (Weighted):\\n`;
    finalPrompt += `• Topic Coverage (30%): ${modernScores.topicCoverage}/100\\n`;
    finalPrompt += `  ${analysis.breakdown?.topicCoverage || 'Analysis unavailable'}\\n\\n`;
    finalPrompt += `• Semantic Relevance (25%): ${modernScores.semanticRelevance}/100\\n`;
    finalPrompt += `  ${analysis.breakdown?.semanticRelevance || 'Analysis unavailable'}\\n\\n`;
    finalPrompt += `• Search Intent Match (20%): ${modernScores.searchIntent}/100\\n`;
    finalPrompt += `  ${analysis.breakdown?.searchIntent || 'Analysis unavailable'}\\n\\n`;
    finalPrompt += `• Readability & Structure (15%): ${modernScores.readabilityStructure}/100\\n`;
    finalPrompt += `  ${analysis.breakdown?.readabilityStructure || 'Analysis unavailable'}\\n\\n`;
    finalPrompt += `• Content Depth (10%): ${modernScores.contentDepth}/100\\n`;
    finalPrompt += `  ${analysis.breakdown?.contentDepth || 'Analysis unavailable'}\\n\\n`;
    
    finalPrompt += `🎯 REGENERATION TASK:\\n\\n`;
    finalPrompt += `Fix these 3 WEAKEST ranking factors:\\n\\n`;
    
    lowestThree.forEach((item, index) => {
      finalPrompt += `${index + 1}. ${item.name} (Score: ${item.score}/100) - ${item.description}\\n`;
      
      if (item.key === 'topicCoverage') {
        finalPrompt += `   → Add topics/subtopics that top-ranking content covers\\n`;
        if (serpData?.lsiKeywords?.length > 0) {
          finalPrompt += `   → Integrate these missing topics: ${serpData.lsiKeywords.slice(0, 5).join(', ')}\\n`;
        }
      } else if (item.key === 'semanticRelevance') {
        finalPrompt += `   → Use more related terms and LSI keywords naturally throughout content\\n`;
        if (serpData?.lsiKeywords?.length > 0) {
          finalPrompt += `   → Missing LSI keywords: ${serpData.lsiKeywords.slice(0, 5).join(', ')}\\n`;
        }
      } else if (item.key === 'searchIntent') {
        finalPrompt += `   → Better match what users are looking for with "${keywordsForSEO}"\\n`;
        if (serpData?.searchIntent) {
          finalPrompt += `   → SERP shows ${serpData.searchIntent} intent - adjust your approach\\n`;
        }
      } else if (item.key === 'readabilityStructure') {
        finalPrompt += `   → Improve heading hierarchy (H1 → H2 → H3)\\n`;
        finalPrompt += `   → Break long paragraphs into shorter ones (50-150 words each)\\n`;
        finalPrompt += `   → Add bullet points and improve scannability\\n`;
      } else if (item.key === 'contentDepth') {
        finalPrompt += `   → Add more depth, examples, data, or actionable insights\\n`;
        finalPrompt += `   → Target: ${wordCount} words (±10% acceptable)\\n`;
      }
      finalPrompt += `\\n`;
    });
    
    // Add SERP gap fixes if available
    if (serpGaps) {
      finalPrompt += `🔍 SERP COMPETITIVE GAPS TO FIX:\\n\\n`;
      
      if (serpGaps.missingSerpElements && serpGaps.missingSerpElements.length > 0) {
        finalPrompt += `Add these elements (found in top-ranking content):\\n`;
        serpGaps.missingSerpElements.forEach((element: string) => {
          finalPrompt += `  • ${element}\\n`;
        });
        finalPrompt += `\\n`;
      }
      
      if (serpGaps.gaps && serpGaps.gaps.length > 0) {
        finalPrompt += `Apply these optimizations:\\n`;
        serpGaps.gaps.forEach((gap: string) => {
          finalPrompt += `  • ${gap}\\n`;
        });
        finalPrompt += `\\n`;
      }
    }
    
    // Add suggestions from modern scoring system
    if (analysis.suggestions && analysis.suggestions.length > 0) {
      finalPrompt += `💡 ADDITIONAL IMPROVEMENT SUGGESTIONS:\\n`;
      analysis.suggestions.slice(0, 3).forEach((suggestion: string) => {
        finalPrompt += `  • ${suggestion}\\n`;
      });
      finalPrompt += `\\n`;
    }
    
    finalPrompt += `CRITICAL RULES:\\n`;
    finalPrompt += `• Keep all GOOD parts from the original (don't break what's working)\\n`;
    finalPrompt += `• ONLY fix the specific weaknesses listed above\\n`;
    finalPrompt += `• Maintain the same tone, style, and overall structure\\n`;
    finalPrompt += `• Target word count: ${wordCount} words (±5%)\\n`;
    finalPrompt += `• Use \"${keywordsForSEO}\" naturally - don't force it\\n`;
    finalPrompt += `• This is a TARGETED fix, not a complete rewrite\\n\\n`;
    
    finalPrompt += `🚨 OUTPUT FORMAT:\\n`;
    finalPrompt += `• Return ONLY the improved content\\n`;
    finalPrompt += `• DO NOT include scores, analysis, or metadata\\n`;
    finalPrompt += `• DO NOT include phrases like "📊 UPDATED MODERN SEO SCORES" or "These micro-improvements"\\n`;
    finalPrompt += `• DO NOT include the keywords list or word count\\n`;
    finalPrompt += `• DO NOT echo back the scores or analysis I showed you\\n\\n`;
    
    finalPrompt += `Return content with MINIMAL changes — this should look almost identical to the input.`;
  }
  
  // ITERATION 3: Final micro-optimization pass
  else if (iteration === 3 && previousAnalysis && previousContent) {
    const analysis = previousAnalysis;
    
    // Use MODERN scores if available
    const modernScores = analysis.modernScores || {
      topicCoverage: analysis.titleScore || 85,
      semanticRelevance: analysis.contentScore || 85,
      searchIntent: analysis.keywordScore || 85,
      readabilityStructure: analysis.metaScore || 85,
      contentDepth: analysis.readabilityScore || 85
    };
    
    finalPrompt = `You previously generated this content:\\\\n\\\\n`;
    finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\\\n`;
    finalPrompt += `${previousContent}\\\\n`;
    finalPrompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\\\n\\\\n`;
    
    finalPrompt += `📊 CURRENT MODERN SEO SCORES:\\\\n`;
    finalPrompt += `Overall: ${analysis.overallScore}/100\\\\n\\\\n`;
    finalPrompt += `Factor Scores (Weighted):\\\\n`;
    finalPrompt += `• Topic Coverage (30%): ${modernScores.topicCoverage}/100\\\\n`;
    finalPrompt += `• Semantic Relevance (25%): ${modernScores.semanticRelevance}/100\\\\n`;
    finalPrompt += `• Search Intent Match (20%): ${modernScores.searchIntent}/100\\\\n`;
    finalPrompt += `• Readability & Structure (15%): ${modernScores.readabilityStructure}/100\\\\n`;
    finalPrompt += `• Content Depth (10%): ${modernScores.contentDepth}/100\\\\n\\\\n`;
    
    finalPrompt += `🎯 FINAL PRECISION OPTIMIZATION:\\\\\\\\n\\\\\\\\n`;
    finalPrompt += `Make MICRO-IMPROVEMENTS to push score to 95+:\\\\\\\\n\\\\\\\\n`;
    
    let microFixNum = 1;
    
    // Identify which factors need micro-optimization
    if (modernScores.topicCoverage < 95) {
      finalPrompt += `${microFixNum}. Topic Coverage: Add 1-2 more relevant subtopics from SERP analysis\\\\n`;
      microFixNum++;
    }
    
    if (modernScores.semanticRelevance < 95) {
      finalPrompt += `${microFixNum}. Semantic Relevance: Integrate 2-3 more LSI keywords naturally\\\\n`;
      if (serpData?.lsiKeywords?.length > 0) {
        finalPrompt += `   Consider: ${serpData.lsiKeywords.slice(0, 3).join(', ')}\\\\n`;
      }
      microFixNum++;
    }
    
    if (modernScores.searchIntent < 95) {
      finalPrompt += `${microFixNum}. Search Intent: Fine-tune content to better match user expectations\\\\n`;
      microFixNum++;
    }
    
    if (modernScores.readabilityStructure < 95) {
      finalPrompt += `${microFixNum}. Readability: Split 1-2 longest sentences, ensure H2/H3 hierarchy is clear\\\\n`;
      microFixNum++;
    }
    
    if (modernScores.contentDepth < 95) {
      finalPrompt += `${microFixNum}. Content Depth: Add 1 concrete example or data point for extra authority\\\\n`;
      microFixNum++;
    }
    
    // Add suggestion to naturally use keywords
    finalPrompt += `${microFixNum}. Keywords: Ensure \\\"${keywordsForSEO}\\\" appears in prominent positions (H2s, intro, conclusion)\\\\n`;
    
    finalPrompt += `\\\\n⚠️ CRITICAL RULES FOR PRECISION PASS:\\\\n`;
    finalPrompt += `• This is MICRO-optimization — change as little as possible\\\\n`;
    finalPrompt += `• DO NOT rewrite entire paragraphs\\\\n`;
    finalPrompt += `• DO NOT change bullet points unless necessary\\\\n`;
    finalPrompt += `• DO NOT alter tone or style\\\\n`;
    finalPrompt += `• ONLY make the tiny adjustments listed above\\\\n`;
    finalPrompt += `• Preserve 95%+ of iteration 2's content\\\\n`;
    finalPrompt += `• Goal: Small score boost (3-5 points max)\\\\n`;
    finalPrompt += `• Target word count: ${wordCount} words (±5%)\\\\n\\\\n`;
    
    finalPrompt += `🚨 OUTPUT FORMAT:\\\\n`;
    finalPrompt += `• Return ONLY the improved content\\\\n`;
    finalPrompt += `• DO NOT include scores, analysis, or metadata\\\\n`;
    finalPrompt += `• DO NOT include phrases like "📊 UPDATED MODERN SEO SCORES" or "These micro-improvements"\\\\n`;
    finalPrompt += `• DO NOT include the keywords list or word count\\\\n`;
    finalPrompt += `• DO NOT echo back the scores or analysis I showed you\\\\n\\n`;
    
    finalPrompt += `Return content with MINIMAL changes — this should look almost identical to the input.`;
  }

  // FIX: Replace double-escaped newlines with actual newlines
  // This fixes a bug where write_tool double-escaped all \n to \\n
  finalPrompt = finalPrompt.replace(/\\\\n/g, '\n').replace(/\\\\"/g, '"');
  
  const fixed = fixPromptFormatting(finalPrompt);
  
  return fixed;
};

// URL content extraction using Jina AI Reader API
export const extractURLContent = async (url: string, openaiApiKey: string): Promise<string> => {
  try {
    console.log(`Extracting content from URL: ${url}`);
    
    // Use Jina AI Reader API to convert webpage to clean markdown
    // This handles CORS, JavaScript rendering, and HTML parsing automatically
    const jinaUrl = `https://r.jina.ai/${url}`;
    console.log(`  → Using Jina AI Reader: ${jinaUrl}`);
    
    const jinaResponse = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-With-Generated-Alt': 'true',
      }
    });

    if (!jinaResponse.ok) {
      console.log(`  ❌ Jina AI Reader failed (${jinaResponse.status}), trying direct fetch...`);
      throw new Error('Jina AI Reader unavailable');
    }

    // Jina AI can return text/plain or JSON, handle both
    const contentType = jinaResponse.headers.get('content-type') || '';
    let cleanContent = '';
    
    if (contentType.includes('application/json')) {
      const jinaData = await jinaResponse.json();
      cleanContent = jinaData.data?.content || jinaData.content || jinaData.data || '';
    } else {
      // Plain text response
      cleanContent = await jinaResponse.text();
    }
    
    if (!cleanContent || cleanContent.length < 100) {
      console.log(`  ❌ Insufficient content extracted (${cleanContent.length} chars), trying direct fetch...`);
      throw new Error('Insufficient content from Jina');
    }

    console.log(`  ✅ Successfully extracted ${cleanContent.length} characters from URL`);
    
    // Use GPT to summarize the extracted content
    const extractResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a content extraction expert. Summarize the main topic, key points, and themes from the provided webpage content. Focus on what the page is about and its primary purpose. Be concise but accurate."
          },
          {
            role: "user",
            content: `Summarize the main topic and key information from this webpage content:\\n\\n${cleanContent.slice(0, 8000)}\\n\\nProvide a 2-3 sentence summary focusing on the main topic and purpose.`
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!extractResponse.ok) {
      console.log(`  ❌ GPT summarization failed, using raw content`);
      return cleanContent.slice(0, 2000); // Return first 2000 chars
    }

    const extractData = await extractResponse.json();
    const summary = extractData.choices[0].message.content;
    console.log(`  ✅ Content summarized: \"${summary.substring(0, 100)}...\"`);
    return summary;
    
  } catch (error) {
    console.log(`  ⚠️ Error with Jina AI Reader: ${error.message}, trying fallback...`);
    
    // FALLBACK: Try direct fetch with user-agent
    try {
      console.log(`  → Attempting direct fetch with user-agent...`);
      const directResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ContentBot/1.0)',
        }
      });
      
      if (!directResponse.ok) {
        throw new Error(`HTTP ${directResponse.status}`);
      }
      
      const htmlContent = await directResponse.text();
      
      // Extract text from HTML using simple regex (remove scripts, styles, tags)
      let textContent = htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (textContent.length < 100) {
        throw new Error('Insufficient content from direct fetch');
      }
      
      console.log(`  ✅ Direct fetch successful, extracted ${textContent.length} characters`);
      
      // Use GPT to summarize
      const summaryResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Extract the main topic and purpose of this webpage. Be specific and accurate."
            },
            {
              role: "user",
              content: `What is the main topic of this webpage?\\n\\n${textContent.slice(0, 6000)}`
            }
          ],
          temperature: 0.2,
          max_tokens: 200,
        }),
      });
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        const summary = summaryData.choices[0].message.content;
        console.log(`  ✅ Fallback summary created: \"${summary.substring(0, 100)}...\"`);
        return summary;
      }
      
      return textContent.slice(0, 2000);
      
    } catch (fallbackError) {
      console.log(`  ❌ All extraction methods failed: ${fallbackError.message}`);
      console.log(`  → Returning URL as fallback (user should use keyword/prompt instead)`);
      return `Website about: ${url} (Unable to extract content. Please use a keyword or custom prompt instead of a URL for better results.)`; 
    }
  }
};