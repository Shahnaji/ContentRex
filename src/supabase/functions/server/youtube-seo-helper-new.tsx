// TEMPORARY FILE - Contains optimized GPT functions

// Generate LEARN TAB ONLY features (video topics, tags, hashtags)
export async function generateLearnTabFeaturesOptimized(videoInfo: any, competitors: any[], keywords: any, title: string, callOpenAI: any) {
  console.log('🎓 Starting LEARN TAB ONLY features generation...');
  
  const prompt = `
⚠️ LEARN TAB ONLY - Generate ONLY these 4 fields:

Analyze this YouTube video to provide "Learn From This" insights.

VIDEO DATA:
Title: ${videoInfo.title || ''}
Description: ${(videoInfo.description || '').substring(0, 500)}
Tags: ${(videoInfo.video_tags || []).join(', ')}
Views: ${videoInfo.views_count || 0}
Likes: ${videoInfo.likes_count || 0}
Comments: ${videoInfo.comments_count || 0}

COMPETITOR DATA (Top 5):
${competitors.slice(0, 5).map((c: any, i: number) => `${i + 1}. ${c.title} - ${c.views || 0} views`).join('\n')}

PRIMARY KEYWORDS: ${keywords.topKeywords.slice(0, 5).join(', ')}

Return ONLY this JSON (DO NOT include titleVariations):
{
  "optimizedTags": ["tag1", "tag2", "tag3", ... (exactly 30 tags)],
  "hashtags": ["#hashtag1", "#hashtag2", ... (exactly 15 hashtags)],
  "contentGaps": ["video topic 1", "video topic 2", "video topic 3", "video topic 4"],
  "thumbnailStrategy": "detailed thumbnail recommendation"
}
`;

  try {
    const response = await callOpenAI(prompt, 'You are a YouTube SEO expert. Return ONLY the requested JSON fields. Do not include titleVariations.');
    console.log('✅ GPT response received for LEARN tab');
    
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    
    const parsed = JSON.parse(cleanedResponse);
    console.log(`✅ LEARN TAB: Generated ${parsed.optimizedTags?.length || 0} tags, ${parsed.contentGaps?.length || 0} video topics`);
    return parsed;
  } catch (e) {
    console.log('⚠️  Error with GPT, using fallback for LEARN tab:', e);
    
    const allTags = [...(videoInfo.video_tags || []), ...keywords.relatedKeywords].slice(0, 30);
    
    return {
      optimizedTags: allTags.length > 0 ? allTags : keywords.topKeywords.slice(0, 30),
      hashtags: keywords.topKeywords.slice(0, 15).map((k: string) => `#${k.replace(/\s+/g, '')}`),
      contentGaps: [
        "Create more in-depth tutorials with step-by-step walkthroughs",
        "Add behind-the-scenes content to build audience connection",
        "Include case studies and real-world examples",
        "Cover common mistakes and how to avoid them"
      ],
      thumbnailStrategy: `Use high-contrast colors, readable text (max 3-4 words), emotional expressions, recognizable at small sizes. Analyze top ${competitors.length} competitor thumbnails.`
    };
  }
}

// Generate OPTIMIZE TAB ONLY features (title variations, optimized tags)
export async function generateOptimizeTabFeaturesOptimized(videoInfo: any, competitors: any[], keywords: any, title: string, callOpenAI: any) {
  console.log('🔧 Starting OPTIMIZE TAB ONLY features generation...');
  
  const prompt = `
⚠️ OPTIMIZE TAB ONLY - Generate ONLY these 2 fields:

Analyze this YouTube video to provide optimization recommendations.

VIDEO DATA:
Title: ${videoInfo.title || ''}
Description: ${(videoInfo.description || '').substring(0, 500)}
Tags: ${(videoInfo.video_tags || []).join(', ')}
Views: ${videoInfo.views_count || 0}
Likes: ${videoInfo.likes_count || 0}

COMPETITOR DATA (Top 5):
${competitors.slice(0, 5).map((c: any, i: number) => `${i + 1}. ${c.title} - ${c.views || 0} views`).join('\n')}

PRIMARY KEYWORDS: ${keywords.topKeywords.slice(0, 5).join(', ')}

Return ONLY this JSON (DO NOT include contentGaps, hashtags, thumbnailStrategy):
{
  "titleVariations": ["variation1", "variation2", "variation3", ... (exactly 10 variations)],
  "optimizedTags": ["tag1", "tag2", "tag3", ... (exactly 30 tags)]
}
`;

  try {
    const response = await callOpenAI(prompt, 'You are a YouTube SEO expert. Return ONLY the requested JSON fields. Do not include contentGaps, hashtags, or thumbnailStrategy.');
    console.log('✅ GPT response received for OPTIMIZE tab');
    
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    
    const parsed = JSON.parse(cleanedResponse);
    console.log(`✅ OPTIMIZE TAB: Generated ${parsed.titleVariations?.length || 0} title variations, ${parsed.optimizedTags?.length || 0} tags`);
    return parsed;
  } catch (e) {
    console.log('⚠️  Error with GPT, using fallback for OPTIMIZE tab:', e);
    
    const allTags = [...(videoInfo.video_tags || []), ...keywords.relatedKeywords].slice(0, 30);
    
    return {
      titleVariations: [
        videoInfo.title || title,
        `${keywords.topKeywords[0]} - Complete Guide`,
        `How to ${keywords.topKeywords[0]} (Step by Step)`,
        `${keywords.topKeywords[0]} Tutorial for Beginners`,
        `Best ${keywords.topKeywords[0]} Tips and Tricks`,
        `${keywords.topKeywords[0]} Explained Simply`,
        `Master ${keywords.topKeywords[0]} in 2025`,
        `${keywords.topKeywords[0]} - Everything You Need to Know`,
        `Ultimate ${keywords.topKeywords[0]} Guide`,
        `${keywords.topKeywords[0]} Made Easy`
      ],
      optimizedTags: allTags.length > 0 ? allTags : keywords.topKeywords.slice(0, 30)
    };
  }
}
