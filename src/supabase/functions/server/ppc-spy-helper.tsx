// PPC Spy Helper Functions using DataForSEO APIs
import { callDataForSEO } from './dataforseo-helper.tsx';
import { getLocationCode, normalizeDomain } from './location-helper.tsx';

// Main PPC Spy function
export async function spyOnCompetitor(domain: string, platform: string = 'google', country: string = 'us') {
  console.log('========================================');
  console.log('🔍 PPC SPY TOOL - Starting Analysis');
  console.log('========================================');
  console.log(`Domain: ${domain}`);
  console.log(`Platform: ${platform}`);
  console.log(`Country: ${country}`);
  console.log('----------------------------------------');

  const normalizedDomain = normalizeDomain(domain);
  const locationCode = getLocationCode(country);
  
  console.log(`✅ Normalized domain: ${normalizedDomain}`);
  console.log(`✅ Location code: ${locationCode}`);

  let googleData = null;
  let topCompetitors = null;
  let historicalTrends = null;

  // Get Google Ads data (only platform supported)
  console.log('\n📊 Starting Google Ads analysis...');
  googleData = await getGoogleAdsData(normalizedDomain, locationCode);
  
  if (googleData) {
    console.log(`✅ Google Ads data retrieved: ${googleData.keywords.length} keywords found`);
    
    // Get top competitors
    console.log('\n👥 Starting Competitors analysis...');
    if (googleData.keywords.length > 0) {
      topCompetitors = await getTopCompetitors(googleData.keywords.slice(0, 20), locationCode, normalizedDomain);
      if (topCompetitors) {
        console.log(`✅ Competitors data retrieved: ${topCompetitors.length} competitors found`);
      } else {
        console.log('⚠️ No competitors data found');
      }
    }
    
    // Get historical trends
    console.log('\n📈 Starting Historical Trends analysis...');
    if (googleData.keywords.length > 0) {
      historicalTrends = await getHistoricalTrends(googleData.rawKeywords.slice(0, 10), locationCode);
      if (historicalTrends) {
        console.log(`✅ Historical trends retrieved: ${historicalTrends.length} trends found`);
      } else {
        console.log('⚠️ No historical trends data found');
      }
    }
  } else {
    console.log('⚠️ No Google Ads data found for this domain');
  }

  // Analyze data
  console.log('\n🧠 Generating strategic insights...');
  const analysis = analyzePPCData(googleData, normalizedDomain);
  console.log(`✅ Analysis complete: ${analysis.insights.length} insights, ${analysis.recommendations.length} recommendations`);

  console.log('\n========================================');
  console.log('✅ PPC SPY TOOL - Analysis Complete!');
  console.log('========================================\n');

  return {
    domain: normalizedDomain,
    google: googleData,
    topCompetitors,
    historicalTrends,
    analysis,
  };
}

// Get Google Ads data for competitor
async function getGoogleAdsData(domain: string, locationCode: number) {
  try {
    console.log(`\n📊 [GOOGLE ADS] Starting analysis for domain: ${domain}`);
    console.log(`📊 [GOOGLE ADS] Location code: ${locationCode}`);
    
    // Step 1: Get keywords the competitor is bidding on
    const keywordsPayload = [{
      target: domain,
      location_code: locationCode,
      language_code: 'en',
      limit: 100, // Get top 100 keywords
    }];

    console.log(`📊 [GOOGLE ADS] Calling DataForSEO API: /v3/keywords_data/google_ads/keywords_for_site/live`);
    console.log(`📊 [GOOGLE ADS] Payload:`, JSON.stringify(keywordsPayload, null, 2));

    const keywordsData = await callDataForSEO('/v3/keywords_data/google_ads/keywords_for_site/live', keywordsPayload);
    
    console.log(`📊 [GOOGLE ADS] API Response Status:`, keywordsData.status_code);
    console.log(`📊 [GOOGLE ADS] Full API Response:`, JSON.stringify(keywordsData, null, 2));
    
    if (!keywordsData.tasks || !keywordsData.tasks[0] || !keywordsData.tasks[0].result) {
      console.log(`❌ [GOOGLE ADS] No tasks/result in response`);
      return null;
    }

    // FIX: result is already an array of keywords, not an object with a keywords property
    const keywords = keywordsData.tasks[0].result || [];
    console.log(`📊 [GOOGLE ADS] Raw keywords count: ${keywords.length}`);
    
    if (keywords.length === 0) {
      console.log(`⚠️ [GOOGLE ADS] ZERO keywords returned by DataForSEO for ${domain}`);
      console.log(`⚠️ [GOOGLE ADS] This could mean:`);
      console.log(`   1. Domain is not in DataForSEO's database`);
      console.log(`   2. Domain uses different tracking (e.g., subdomain)`);
      console.log(`   3. DataForSEO hasn't crawled this domain recently`);
      return { keywords: [], rawKeywords: [] };
    }

    console.log(`✅ [GOOGLE ADS] Found ${keywords.length} keywords`);
    
    // Get top 50 keywords for detailed analysis
    const topKeywords = keywords
      .sort((a: any, b: any) => (b.search_volume || 0) - (a.search_volume || 0))
      .slice(0, 50);

    console.log(`📊 [GOOGLE ADS] Top 5 keywords:`, topKeywords.slice(0, 5).map((k: any) => k.keyword).join(', '));

    // Transform keywords to simplified format
    const enrichedKeywords = topKeywords.map((kw: any) => {
      return {
        keyword: kw.keyword,
        searchVolume: kw.search_volume || 0,
        competition: kw.competition || 0,
        cpc: kw.cpc || 0,
      };
    });

    console.log(`✅ [GOOGLE ADS] Analysis complete - ${enrichedKeywords.length} keywords processed`);

    return {
      keywords: enrichedKeywords,
      rawKeywords: topKeywords, // Keep original keywords with monthly_searches for trends
    };
  } catch (error) {
    console.log('❌ [GOOGLE ADS] Critical error getting Google Ads data:', error);
    return null;
  }
}

// Analyze PPC data and generate insights
function analyzePPCData(googleData: any, domain: string) {
  const insights: string[] = [];
  const competitorProfile: any = {
    isActive: false,
    platforms: [],
    totalKeywords: 0,
    topCategories: [],
  };

  // Google analysis
  if (googleData && googleData.keywords.length > 0) {
    competitorProfile.isActive = true;
    competitorProfile.platforms.push('Google Ads');
    competitorProfile.totalKeywords += googleData.keywords.length;

    insights.push(`Found ${googleData.keywords.length} active Google Ads keywords`);
    
    const highValueKeywords = googleData.keywords.filter((kw: any) => kw.cpc > 5);
    if (highValueKeywords.length > 0) {
      insights.push(`${highValueKeywords.length} high-value keywords detected with CPC over $5 - premium positioning strategy`);
    }

    // Top keywords
    const topKeyword = googleData.keywords[0];
    if (topKeyword) {
      insights.push(`Top keyword: "${topKeyword.keyword}" (${topKeyword.searchVolume.toLocaleString()} searches, $${topKeyword.cpc} CPC)`);
    }
  }

  // Categorize keywords
  const categories = categorizeKeywords(
    googleData ? googleData.keywords : []
  );
  competitorProfile.topCategories = categories;

  if (categories.length > 0) {
    insights.push(`Focus areas: ${categories.slice(0, 3).join(', ')}`);
  }

  if (!competitorProfile.isActive) {
    insights.push(`⚠️ No active PPC campaigns detected for ${domain}. They may be focusing on organic or other channels.`);
  }

  return {
    profile: competitorProfile,
    insights,
    recommendations: generateRecommendations(googleData, competitorProfile),
  };
}

// Categorize keywords by intent/type
function categorizeKeywords(googleKeywords: any[]): string[] {
  const allKeywords = [...googleKeywords];
  const categories: { [key: string]: number } = {};

  allKeywords.forEach(kw => {
    const keyword = kw.keyword.toLowerCase();
    
    if (keyword.includes('buy') || keyword.includes('purchase') || keyword.includes('price') || keyword.includes('cost')) {
      categories['Transactional'] = (categories['Transactional'] || 0) + 1;
    } else if (keyword.includes('how') || keyword.includes('what') || keyword.includes('why') || keyword.includes('guide')) {
      categories['Informational'] = (categories['Informational'] || 0) + 1;
    } else if (keyword.includes('best') || keyword.includes('top') || keyword.includes('vs') || keyword.includes('review')) {
      categories['Comparison'] = (categories['Comparison'] || 0) + 1;
    } else if (keyword.includes('near') || keyword.includes('local') || keyword.includes('in ')) {
      categories['Local'] = (categories['Local'] || 0) + 1;
    } else {
      categories['Brand/Generic'] = (categories['Brand/Generic'] || 0) + 1;
    }
  });

  // Sort by count and return category names
  return Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat);
}

// Generate strategic recommendations
function generateRecommendations(googleData: any, profile: any): string[] {
  const recommendations: string[] = [];

  if (!profile.isActive) {
    recommendations.push('Consider launching PPC campaigns to capture paid search traffic');
    recommendations.push('Start with Google Ads for maximum reach, then expand to Bing');
    return recommendations;
  }

  // Keyword recommendations
  if (googleData && googleData.keywords.length > 0) {
    const lowCompetitionKeywords = googleData.keywords.filter((kw: any) => kw.competition < 0.5);
    if (lowCompetitionKeywords.length > 0) {
      recommendations.push(`Found ${lowCompetitionKeywords.length} low-competition keywords - quick win opportunities`);
    }
    
    const highValueKeywords = googleData.keywords.filter((kw: any) => kw.cpc > 10);
    if (highValueKeywords.length > 0) {
      recommendations.push(`${highValueKeywords.length} premium keywords with CPC over $10 - consider if ROI justifies the investment`);
    }
  }

  return recommendations;
}

// Get top competitors for keywords
async function getTopCompetitors(keywords: any[], locationCode: number, targetDomain: string) {
  try {
    console.log(`👥 [COMPETITORS] Analyzing competitors for ${keywords.length} keywords...`);
    console.log(`👥 [COMPETITORS] Target domain to exclude: ${targetDomain}`);
    
    const competitorDomains: { [key: string]: { count: number; keywords: string[]; totalCPC: number } } = {};
    
    // Use Ads Advertisers API to get competitor data
    for (const kw of keywords.slice(0, 10)) { // Limit to top 10 keywords
      try {
        console.log(`  ↳ [COMPETITORS] Processing keyword: "${kw.keyword}"`);
        
        const payload = [{
          keyword: kw.keyword,
          location_code: locationCode,
          language_code: 'en',
          device: 'desktop',
        }];

        // Use the Ads Advertisers endpoint to get actual advertiser data
        console.log(`  ↳ [COMPETITORS] Calling DataForSEO Ads Advertisers API`);
        const data = await callDataForSEO('/v3/serp/google/ads_advertisers/live/advanced', payload);
        
        console.log(`  ↳ [COMPETITORS] Full API Response:`, JSON.stringify(data, null, 2));
        
        if (data.tasks?.[0]?.result?.[0]?.items) {
          const items = data.tasks[0].result[0].items;
          console.log(`  ↳ [COMPETITORS] Received ${items.length} advertisers for "${kw.keyword}"`);
          
          items.forEach((advertiser: any) => {
            const domain = advertiser.domain || advertiser.advertiser_domain;
            if (domain && domain !== targetDomain) {
              if (!competitorDomains[domain]) {
                competitorDomains[domain] = { count: 0, keywords: [], totalCPC: 0 };
                console.log(`    ✓ [COMPETITORS] New competitor detected: ${domain}`);
              }
              competitorDomains[domain].count += 1;
              competitorDomains[domain].keywords.push(kw.keyword);
              competitorDomains[domain].totalCPC += kw.cpc || 0;
            }
          });
        } else {
          console.log(`  ⚠ [COMPETITORS] No advertiser data for "${kw.keyword}"`);
        }
      } catch (error) {
        console.log(`  ❌ [COMPETITORS] Error analyzing competitors for "${kw.keyword}":`, error);
      }
    }
    
    console.log(`👥 [COMPETITORS] Total unique competitors found: ${Object.keys(competitorDomains).length}`);
    
    if (Object.keys(competitorDomains).length === 0) {
      console.log(`  ℹ️ [COMPETITORS] Note: No advertisers detected for these keywords`);
      return null;
    }
    
    // Convert to array and sort by count
    const topCompetitors = Object.entries(competitorDomains)
      .map(([domain, data]) => ({
        domain,
        sharedKeywords: data.count,
        keywords: data.keywords,
        avgCPC: data.totalCPC / data.count,
        estimatedOverlap: Math.round((data.count / keywords.slice(0, 10).length) * 100),
      }))
      .sort((a, b) => b.sharedKeywords - a.sharedKeywords)
      .slice(0, 10); // Top 10 competitors
    
    topCompetitors.forEach((comp, idx) => {
      console.log(`  ${idx + 1}. ${comp.domain} - ${comp.sharedKeywords} shared keywords, ${comp.estimatedOverlap}% overlap`);
    });
    
    console.log(`✅ [COMPETITORS] Returning top ${topCompetitors.length} competitors`);
    return topCompetitors.length > 0 ? topCompetitors : null;
  } catch (error) {
    console.log('❌ [COMPETITORS] Critical error in competitors analysis:', error);
    return null;
  }
}

// Get historical trends for keywords
async function getHistoricalTrends(keywords: any[], locationCode: number) {
  try {
    console.log(`📈 [TRENDS] Fetching historical trends for ${keywords.length} keywords...`);
    
    // FIX: Use the monthly_searches data that's ALREADY in the keywords from keywords_for_site API
    // No need to make a separate API call - the data is already there!
    console.log(`📈 [TRENDS] Using existing monthly_searches data from keywords`);
    
    const trendsData = keywords.map((kw: any) => {
      const monthlySearches = kw.monthly_searches || [];
      console.log(`  ↳ [TRENDS] "${kw.keyword}" - ${monthlySearches.length} months of data`);
      
      if (monthlySearches.length === 0) {
        console.log(`  ⚠ [TRENDS] No monthly data for "${kw.keyword}"`);
        return null;
      }
      
      // Calculate trend (comparing last 3 months vs previous 3 months)
      const recent = monthlySearches.slice(-3).reduce((sum: number, m: any) => sum + (m.search_volume || 0), 0) / 3;
      const previous = monthlySearches.slice(-6, -3).reduce((sum: number, m: any) => sum + (m.search_volume || 0), 0) / 3;
      const trendPercentage = previous > 0 ? Math.round(((recent - previous) / previous) * 100) : 0;
      
      const trendDirection = trendPercentage > 10 ? 'rising' : trendPercentage < -10 ? 'falling' : 'stable';
      console.log(`    ✓ [TRENDS] Trend: ${trendDirection} (${trendPercentage > 0 ? '+' : ''}${trendPercentage}%)`);
      
      return {
        keyword: kw.keyword,
        currentVolume: kw.search_volume || 0,
        monthlyData: monthlySearches.map((m: any) => ({
          month: m.month,
          year: m.year,
          volume: m.search_volume || 0,
        })),
        trendDirection,
        trendPercentage,
      };
    }).filter(Boolean); // Remove null entries
    
    console.log(`✅ [TRENDS] Processed ${trendsData.length} keyword trends`);
    return trendsData.length > 0 ? trendsData : null;
  } catch (error) {
    console.log('❌ [TRENDS] Critical error in historical trends analysis:', error);
    return null;
  }
}