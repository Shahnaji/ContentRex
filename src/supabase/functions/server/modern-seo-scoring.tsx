// Modern SEO Scoring System - Based on Real Ranking Factors
// Focuses on relevance, intent, comprehensiveness, and readability

export interface ModernSEOAnalysis {
  overallScore: number;
  topicCoverageScore: number;
  semanticRelevanceScore: number;
  searchIntentScore: number;
  readabilityStructureScore: number;
  contentDepthScore: number;
  wordCount: number;
  suggestions: string[];
  breakdown: {
    topicCoverage: string;
    semanticRelevance: string;
    searchIntent: string;
    readabilityStructure: string;
    contentDepth: string;
  };
}

// Calculate Flesch Reading Ease Score
const calculateFleschScore = (content: string, wordCount: number): number => {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentences === 0 || wordCount === 0) return 0;
  
  // Count syllables (simplified approximation)
  const syllableCount = content.split(/\s+/).reduce((total, word) => {
    // Simple syllable counter: vowel groups
    const syllables = (word.toLowerCase().match(/[aeiouy]+/g) || []).length;
    return total + Math.max(1, syllables);
  }, 0);
  
  const avgWordsPerSentence = wordCount / sentences;
  const avgSyllablesPerWord = syllableCount / wordCount;
  
  // Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  return Math.max(0, Math.min(100, score)); // Clamp between 0-100
};

// Classify search intent based on content and keyword
const classifySearchIntent = (content: string, keyword: string): { 
  intent: string; 
  confidence: number;
  match: boolean;
} => {
  const lowerContent = content.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  // Intent indicators
  const informationalIndicators = [
    'what', 'how', 'why', 'guide', 'tutorial', 'learn', 'understand', 
    'explain', 'definition', 'meaning', 'tips', 'ways', 'best'
  ];
  const commercialIndicators = [
    'best', 'top', 'review', 'comparison', 'vs', 'versus', 'alternatives',
    'compare', 'benefits', 'features', 'pros', 'cons'
  ];
  const transactionalIndicators = [
    'buy', 'purchase', 'order', 'price', 'cost', 'deal', 'discount',
    'shop', 'sale', 'coupon', 'cheap', 'affordable', 'get'
  ];
  const navigationalIndicators = [
    'login', 'sign in', 'official', 'website', 'homepage', 'contact',
    'location', 'near me'
  ];
  
  // Count indicators in both keyword and content
  let informationalScore = 0;
  let commercialScore = 0;
  let transactionalScore = 0;
  let navigationalScore = 0;
  
  informationalIndicators.forEach(indicator => {
    if (lowerKeyword.includes(indicator)) informationalScore += 3;
    if (lowerContent.includes(indicator)) informationalScore += 1;
  });
  
  commercialIndicators.forEach(indicator => {
    if (lowerKeyword.includes(indicator)) commercialScore += 3;
    if (lowerContent.includes(indicator)) commercialScore += 1;
  });
  
  transactionalIndicators.forEach(indicator => {
    if (lowerKeyword.includes(indicator)) transactionalScore += 3;
    if (lowerContent.includes(indicator)) transactionalScore += 1;
  });
  
  navigationalIndicators.forEach(indicator => {
    if (lowerKeyword.includes(indicator)) navigationalScore += 3;
    if (lowerContent.includes(indicator)) navigationalScore += 1;
  });
  
  // Determine primary intent
  const scores = {
    informational: informationalScore,
    commercial: commercialScore,
    transactional: transactionalScore,
    navigational: navigationalScore
  };
  
  const maxScore = Math.max(...Object.values(scores));
  const intent = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'informational';
  const confidence = maxScore > 0 ? Math.min(100, (maxScore / 20) * 100) : 50;
  
  // Check if content matches intent
  const match = confidence >= 40;
  
  return { intent, confidence, match };
};

// Analyze topic coverage vs SERP competitors
const analyzeTopicCoverage = (
  content: string,
  serpData: any,
  keyword: string
): { score: number; details: string; missedTopics: string[] } => {
  if (!serpData || !serpData.topResults || serpData.topResults.length === 0) {
    return {
      score: 95, // High neutral score when no SERP data
      details: 'No SERP data available for comparison',
      missedTopics: []
    };
  }
  
  const lowerContent = content.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  // Extract topics from SERP titles and descriptions
  const serpTopics = new Set<string>();
  serpData.topResults.forEach((result: any) => {
    const titleWords = (result.title || '').toLowerCase().split(/\\s+/);
    const descWords = (result.description || '').toLowerCase().split(/\\s+/);
    
    [...titleWords, ...descWords].forEach((word: string) => {
      if (word.length > 4 && !['these', 'their', 'there', 'about', 'which'].includes(word)) {
        serpTopics.add(word.replace(/[^a-z]/g, ''));
      }
    });
  });
  
  // Check coverage
  let coveredTopics = 0;
  const missedTopics: string[] = [];
  
  serpTopics.forEach(topic => {
    if (lowerContent.includes(topic)) {
      coveredTopics++;
    } else {
      missedTopics.push(topic);
    }
  });
  
  const totalTopics = serpTopics.size;
  const coveragePercentage = totalTopics > 0 ? (coveredTopics / totalTopics) * 100 : 100;
  
  // REALISTIC: 82% base + up to 18% based on coverage (scores 82-100)
  const score = Math.round(82 + (coveragePercentage * 0.18));
  
  const details = `Covers ${coveredTopics}/${totalTopics} topics from top 10 results (${Math.round(coveragePercentage)}% coverage)`;
  
  return {
    score: Math.min(100, score),
    details,
    missedTopics: missedTopics.slice(0, 5) // Top 5 missed topics
  };
};

// Analyze semantic relevance using LSI keywords
const analyzeSemanticRelevance = (
  content: string,
  serpData: any,
  keyword: string
): { score: number; details: string; missingLSI: string[] } => {
  if (!serpData || !serpData.lsiKeywords || serpData.lsiKeywords.length === 0) {
    return {
      score: 95, // High neutral score when no SERP data
      details: 'No LSI keyword data available',
      missingLSI: []
    };
  }
  
  const lowerContent = content.toLowerCase();
  const lsiKeywords = serpData.lsiKeywords || [];
  
  // Check LSI keyword coverage
  let lsiPresent = 0;
  const missingLSI: string[] = [];
  
  lsiKeywords.forEach((lsiKeyword: string) => {
    if (lowerContent.includes(lsiKeyword.toLowerCase())) {
      lsiPresent++;
    } else {
      missingLSI.push(lsiKeyword);
    }
  });
  
  const lsiCoveragePercentage = lsiKeywords.length > 0 
    ? (lsiPresent / lsiKeywords.length) * 100 
    : 100;
  
  // REALISTIC: 75% base + up to 25% based on LSI coverage
  const score = Math.round(75 + (lsiCoveragePercentage * 0.25));
  
  const details = `Contains ${lsiPresent}/${lsiKeywords.length} LSI keywords (${Math.round(lsiCoveragePercentage)}% coverage)`;
  
  return {
    score: Math.min(100, score),
    details,
    missingLSI: missingLSI.slice(0, 5) // Top 5 missing LSI keywords
  };
};

// Analyze readability and structure
const analyzeReadabilityStructure = (
  content: string,
  wordCount: number,
  contentType: string
): { score: number; details: string; issues: string[] } => {
  const issues: string[] = [];
  
  // Calculate Flesch Reading Ease
  const fleschScore = calculateFleschScore(content, wordCount);
  
  // Analyze structure
  const h1Count = (content.match(/^#\s/gm) || []).length;
  const h2Count = (content.match(/^#{2}\s/gm) || []).length;
  const h3Count = (content.match(/^#{3}\s/gm) || []).length;
  const paragraphs = content.split(/\n\n/).filter(p => p.trim().length > 0).length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgSentenceLength = sentences > 0 ? wordCount / sentences : 0;
  
  // Check for bullet points
  const bulletPoints = (content.match(/^[\s]*[•\-\*]/gm) || []).length;
  
  // Scoring components
  let structureScore = 70; // Base score
  
  // Flesch score contribution (0-30 points)
  if (fleschScore >= 60 && fleschScore <= 80) {
    structureScore += 30; // Optimal readability
  } else if (fleschScore >= 50 && fleschScore < 90) {
    structureScore += 20; // Good readability
  } else if (fleschScore >= 40 && fleschScore < 95) {
    structureScore += 10; // Acceptable
  } else {
    issues.push(`Readability could be improved (Flesch: ${Math.round(fleschScore)})`);
  }
  
  // Heading structure (0-20 points)
  if (h1Count === 1 && h2Count >= 3) {
    structureScore += 20; // Perfect structure
  } else if (h1Count === 1 && h2Count >= 2) {
    structureScore += 15; // Good structure
  } else if (h2Count >= 1) {
    structureScore += 10; // Basic structure
    issues.push('Add more H2 subheadings for better structure');
  } else {
    issues.push('Missing proper heading hierarchy (H1, H2, H3)');
  }
  
  // Paragraph structure (0-10 points)
  const avgParagraphLength = paragraphs > 0 ? wordCount / paragraphs : 0;
  if (avgParagraphLength >= 50 && avgParagraphLength <= 150) {
    structureScore += 10; // Ideal paragraph length
  } else if (avgParagraphLength < 50 || avgParagraphLength <= 200) {
    structureScore += 5;
  } else {
    issues.push('Paragraphs are too long or too short');
  }
  
  // Sentence length (already captured in Flesch score)
  if (avgSentenceLength > 25) {
    issues.push('Sentences are too long - aim for 15-20 words average');
  }
  
  // Bullet points (0-10 points for long-form)
  if (wordCount > 300 && bulletPoints >= 3) {
    structureScore += 10;
  } else if (wordCount > 300 && bulletPoints === 0) {
    issues.push('Add bullet points to break up text');
  }
  
  const details = `Flesch: ${Math.round(fleschScore)}, H2s: ${h2Count}, Avg sentence: ${Math.round(avgSentenceLength)} words`;
  
  return {
    score: Math.min(100, Math.round(structureScore)),
    details,
    issues: issues.slice(0, 3)
  };
};

// Analyze content depth vs competition
const analyzeContentDepth = (
  wordCount: number,
  serpData: any,
  targetWordCount: number
): { score: number; details: string } => {
  if (!serpData || !serpData.topResults || serpData.topResults.length === 0) {
    // Compare to target word count
    const ratio = wordCount / targetWordCount;
    let score = 85;
    
    if (ratio >= 0.9 && ratio <= 1.1) score = 100;
    else if (ratio >= 0.8 && ratio <= 1.2) score = 90;
    else if (ratio >= 0.7 && ratio <= 1.3) score = 80;
    else if (ratio < 0.7) score = 60;
    
    return {
      score,
      details: `${wordCount} words (target: ${targetWordCount})`
    };
  }
  
  // Calculate average word count from SERP (estimate from description length)
  // Note: SERP API doesn't give full content, so we estimate
  const avgSerpDescLength = serpData.avgDescriptionLength || 150;
  const estimatedSerpWordCount = avgSerpDescLength * 4; // Rough estimate: description is ~25% of content
  
  const ratio = wordCount / Math.max(targetWordCount, estimatedSerpWordCount);
  
  let score = 78; // Base score
  
  if (ratio >= 0.9 && ratio <= 1.2) {
    score = 100; // Optimal length
  } else if (ratio >= 0.8 && ratio <= 1.4) {
    score = 93; // Good length
  } else if (ratio >= 0.7 && ratio <= 1.6) {
    score = 85; // Acceptable
  } else if (ratio < 0.7) {
    score = 70; // Too short
  } else if (ratio > 1.6) {
    score = 80; // Too long
  }
  
  const details = `${wordCount} words vs SERP avg ~${estimatedSerpWordCount} (${Math.round(ratio * 100)}%)`;
  
  return {
    score: Math.round(score),
    details
  };
};

// Main modern SEO analysis function
export const analyzeModernSEO = (
  content: string,
  keyword: string,
  serpData: any,
  contentType: string,
  targetWordCount: number
): ModernSEOAnalysis => {
  // Validate inputs
  if (!content || content.trim().length === 0) {
    throw new Error('Content is required for SEO analysis');
  }
  
  // Make keyword optional for repurpose mode
  const hasKeyword = keyword && keyword.trim().length > 0;
  
  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  
  // 1. Topic Coverage (30%)
  const topicCoverage = hasKeyword 
    ? analyzeTopicCoverage(content, serpData, keyword)
    : { score: 90, missedTopics: [], details: 'N/A - No target keyword provided' };
  
  // 2. Semantic Relevance (25%)
  const semanticRelevance = hasKeyword
    ? analyzeSemanticRelevance(content, serpData, keyword)
    : { score: 90, missingLSI: [], details: 'N/A - No target keyword provided' };
  
  // 3. Search Intent Match (20%)
  const intentAnalysis = hasKeyword
    ? classifySearchIntent(content, keyword)
    : { intent: 'unknown', confidence: 0, match: true };
  // REALISTIC: 88% base for match, 85% base for mismatch
  const searchIntentScore = hasKeyword
    ? (intentAnalysis.match 
        ? Math.round(88 + (intentAnalysis.confidence * 0.12))
        : Math.round(85 + (intentAnalysis.confidence * 0.10)))
    : 90; // Default score when no keyword
  
  // 4. Readability & Structure (15%)
  const readabilityStructure = analyzeReadabilityStructure(content, words, contentType);
  
  // 5. Content Depth (10%)
  const contentDepth = analyzeContentDepth(words, serpData, targetWordCount);
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    (topicCoverage.score * 0.30) +
    (semanticRelevance.score * 0.25) +
    (searchIntentScore * 0.20) +
    (readabilityStructure.score * 0.15) +
    (contentDepth.score * 0.10)
  );
  
  // Generate suggestions
  const suggestions: string[] = [];
  
  if (hasKeyword && topicCoverage.score < 85 && topicCoverage.missedTopics.length > 0) {
    suggestions.push(`Cover these topics from top-ranking content: ${topicCoverage.missedTopics.slice(0, 3).join(', ')}`);
  }
  
  if (hasKeyword && semanticRelevance.score < 85 && semanticRelevance.missingLSI.length > 0) {
    // Only suggest LSI if not keyword spam
    suggestions.push(`Add these related terms naturally: ${semanticRelevance.missingLSI.slice(0, 3).join(', ')}`);
  }
  
  if (hasKeyword && searchIntentScore < 85) {
    suggestions.push(`Better match ${intentAnalysis.intent} search intent - users expect ${intentAnalysis.intent} content for this keyword`);
  }
  
  if (readabilityStructure.score < 85 && readabilityStructure.issues.length > 0) {
    suggestions.push(readabilityStructure.issues[0]);
  }
  
  if (contentDepth.score < 85) {
    if (words < targetWordCount * 0.8) {
      suggestions.push(`Expand content - aim for at least ${Math.round(targetWordCount * 0.9)} words`);
    } else if (words > targetWordCount * 1.5) {
      suggestions.push(`Content may be too long - consider trimming to ${Math.round(targetWordCount * 1.2)} words`);
    }
  }
  
  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    topicCoverageScore: topicCoverage.score,
    semanticRelevanceScore: semanticRelevance.score,
    searchIntentScore,
    readabilityStructureScore: readabilityStructure.score,
    contentDepthScore: contentDepth.score,
    wordCount: words,
    suggestions: suggestions.slice(0, 5), // Top 5 suggestions
    breakdown: {
      topicCoverage: topicCoverage.details,
      semanticRelevance: semanticRelevance.details,
      searchIntent: hasKeyword 
        ? `${intentAnalysis.intent} (${Math.round(intentAnalysis.confidence)}% confidence, ${intentAnalysis.match ? 'matches' : 'mismatch'})`
        : 'N/A - No target keyword provided',
      readabilityStructure: readabilityStructure.details,
      contentDepth: contentDepth.details
    }
  };
};