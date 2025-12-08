// Shared helper functions for Content Generator (Generate & Repurpose)
// This file eliminates ~300+ lines of duplicate code between the two endpoints

/**
 * Extract keywords from custom prompts using GPT
 * Used when user provides a custom prompt instead of a simple keyword
 */
export async function extractKeywordsFromPrompt(
  prompt: string,
  openaiApiKey: string
): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a keyword extraction expert. Extract the most important 1-3 keywords or key phrases from the user's prompt that should be used for SEO optimization."
          },
          {
            role: "user",
            content: `Extract the main keywords/phrases from this prompt for SEO purposes:\n\n"${prompt}"\n\nProvide ONLY the keywords separated by commas (e.g., "keyword1, keyword2"). No explanations.`
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      return prompt;
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    return prompt;
  }
}

/**
 * Get SEO insights from DataForSEO Google Ads API
 * Returns search volume, CPC, competition data
 */
export async function getDataForSEOInsights(
  keyword: string,
  location: string,
  dataForSeoEmail: string | undefined,
  dataForSeoPassword: string | undefined
) {
  if (!dataForSeoEmail || !dataForSeoPassword) {
    return null;
  }

  try {
    // DataForSEO location code mapping
    const locationCode = location === 'WW' ? 2840 : 2840; // Default to US for now
    
    // DataForSEO requires Basic Auth with email:password
    const authString = btoa(`${dataForSeoEmail}:${dataForSeoPassword}`);
    
    const response = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{
        keywords: [keyword],
        location_code: locationCode,
        language_code: "en"
      }]),
    });

    if (!response.ok) {
      console.log("DataForSEO API error:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Get SERP data from DataForSEO
 * Returns top 10 results, search intent, LSI keywords, common patterns
 */
export async function getSERPData(
  keyword: string,
  location: string,
  dataForSeoEmail: string | undefined,
  dataForSeoPassword: string | undefined
) {
  if (!dataForSeoEmail || !dataForSeoPassword) {
    return null;
  }

  try {
    // DataForSEO location code mapping
    const locationCode = location === 'WW' ? 2840 : 2840; // Default to US for now
    
    // DataForSEO requires Basic Auth with email:password
    const authString = btoa(`${dataForSeoEmail}:${dataForSeoPassword}`);
    
    const response = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{
        keyword: keyword,
        location_code: locationCode,
        language_code: "en",
        depth: 10, // Get top 10 results
        device: "desktop",
        os: "windows"
      }]),
    });

    if (!response.ok) {
      console.log("DataForSEO SERP API error:", await response.text());
      return null;
    }

    const data = await response.json();
    
    if (data?.tasks?.[0]?.result?.[0]?.items) {
      const serpResults = data.tasks[0].result[0].items;
      
      // Extract SERP insights
      const serpInsights = {
        topResults: serpResults.slice(0, 10).map((item: any) => ({
          url: item.url,
          title: item.title,
          description: item.description,
          position: item.rank_group
        })),
        searchIntent: data.tasks[0].result[0].check_url || 'informational',
        avgTitleLength: 0,
        avgDescriptionLength: 0,
        commonPatterns: [] as string[],
        lsiKeywords: [] as string[]
      };
      
      // Calculate averages
      let titleLengthSum = 0;
      let descLengthSum = 0;
      const allTitles: string[] = [];
      const allDescriptions: string[] = [];
      
      serpResults.forEach((item: any) => {
        if (item.title) {
          titleLengthSum += item.title.length;
          allTitles.push(item.title.toLowerCase());
        }
        if (item.description) {
          descLengthSum += item.description.length;
          allDescriptions.push(item.description.toLowerCase());
        }
      });
      
      serpInsights.avgTitleLength = Math.round(titleLengthSum / serpResults.length);
      serpInsights.avgDescriptionLength = Math.round(descLengthSum / serpResults.length);
      
      // Detect common patterns
      const patterns = [];
      const titleText = allTitles.join(' ');
      if (titleText.includes('how to')) patterns.push('how-to');
      if (titleText.includes('best')) patterns.push('listicle');
      if (titleText.includes('review')) patterns.push('review');
      if (titleText.includes('guide')) patterns.push('guide');
      if (titleText.includes('vs') || titleText.includes('versus')) patterns.push('comparison');
      serpInsights.commonPatterns = patterns;
      
      // Extract LSI keywords (common words across titles and descriptions)
      const wordFrequency: { [key: string]: number } = {};
      const allText = [...allTitles, ...allDescriptions].join(' ');
      const words = allText.match(/\b\w{4,}\b/g) || [];
      
      words.forEach(word => {
        const lowerWord = word.toLowerCase();
        if (!['this', 'that', 'with', 'from', 'have', 'more', 'what', 'when', 'your', 'their'].includes(lowerWord)) {
          wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
        }
      });
      
      // Get top 10 LSI keywords
      serpInsights.lsiKeywords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
      
      return serpInsights;
    }
    
    return null;
  } catch (error) {
    console.log("Error fetching SERP data:", error);
    return null;
  }
}