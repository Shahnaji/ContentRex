// Trend Hunter Helper Functions using DataForSEO Trends API (Explore Live)
import { callDataForSEO } from './dataforseo-helper.tsx';
import { getLocationCode, getTrendsLocationName } from './location-helper.tsx';

// Main function to hunt trends using Trends Explore API
export async function huntTrends(
  industry: string,
  timeRange: string = '30d',
  country: string = 'us'
) {
  console.log(`[Trend Hunter] 🚀 START - Analyzing trends for: "${industry}"`);
  console.log(`[Trend Hunter] 📅 Time range: ${timeRange}, Country: ${country}`);

  const locationCode = getLocationCode(country);
  const locationName = getTrendsLocationName(country);
  console.log(`[Trend Hunter] 📍 Location code: ${locationCode}, Location name: ${locationName}`);

  // Convert time range to date format for DataForSEO Trends API
  const dateNow = new Date();
  let dateFrom = new Date();
  
  const rangeMatch = timeRange.match(/(\d+)([hdwmy])/);
  if (rangeMatch) {
    const value = parseInt(rangeMatch[1]);
    const unit = rangeMatch[2];
    
    switch (unit) {
      case 'h':
        dateFrom.setHours(dateFrom.getHours() - value);
        break;
      case 'd':
        dateFrom.setDate(dateFrom.getDate() - value);
        break;
      case 'w':
        dateFrom.setDate(dateFrom.getDate() - (value * 7));
        break;
      case 'm':
        dateFrom.setMonth(dateFrom.getMonth() - value);
        break;
      case 'y':
        dateFrom.setFullYear(dateFrom.getFullYear() - value);
        break;
    }
  } else {
    // Default to 30 days
    dateFrom.setDate(dateFrom.getDate() - 30);
  }

  const dateFromStr = dateFrom.toISOString().split('T')[0];
  const dateToStr = dateNow.toISOString().split('T')[0];

  console.log(`[Trend Hunter] 📊 Date range: ${dateFromStr} to ${dateToStr}`);

  try {
    // Use DataForSEO Trends Explore API for comprehensive trend data
    console.log(`[Trend Hunter] 🔍 Calling Trends Explore API...`);
    
    const trendsPayload = [{
      keywords: [industry],
      location_name: locationName,
      date_from: dateFromStr,
      date_to: dateToStr,
      item_types: ['dataforseo_trends_graph', 'dataforseo_trends_map', 'related_queries', 'related_topics']
    }];

    console.log(`[Trend Hunter] 📤 Trends API Payload:`, JSON.stringify(trendsPayload, null, 2));

    const trendsResponse = await callDataForSEO('/v3/keywords_data/dataforseo_trends/explore/live', trendsPayload);
    
    console.log(`[Trend Hunter] 📥 Trends API Response status_code: ${trendsResponse.status_code}`);
    console.log(`[Trend Hunter] 📥 Number of tasks: ${trendsResponse.tasks?.length || 0}`);
    
    const trendsResult = trendsResponse.tasks?.[0]?.result?.[0];
    
    if (!trendsResult) {
      console.log('[Trend Hunter] ⚠️ No trend data available - trendsResult is null/undefined');
      console.log('[Trend Hunter] 📋 Full API Response:', JSON.stringify(trendsResponse, null, 2));
      throw new Error('Insufficient trend data available for this keyword in the selected location. Try: (1) a more popular keyword, or (2) a different country.');
    }

    console.log(`[Trend Hunter] ✅ Trends data received - Processing ${trendsResult.items?.length || 0} items`);
    console.log(`[Trend Hunter] 📋 Item types found:`, trendsResult.items?.map((i: any) => i.type).join(', ') || 'none');

    // Extract graph data (popularity over time)
    const graphItem = trendsResult.items?.find((item: any) => item.type === 'dataforseo_trends_graph');
    const timeline = Array.isArray(graphItem?.data) ? graphItem.data : [];
    
    console.log(`[Trend Hunter] 📈 Timeline data points: ${timeline.length}`);
    if (timeline.length > 0) {
      console.log(`[Trend Hunter] 📈 First data point:`, JSON.stringify(timeline[0], null, 2));
      console.log(`[Trend Hunter] 📈 Last data point:`, JSON.stringify(timeline[timeline.length - 1], null, 2));
    } else {
      console.log(`[Trend Hunter] ⚠️ WARNING: No timeline data available in graphItem`);
      console.log(`[Trend Hunter] 📋 graphItem structure:`, JSON.stringify(graphItem, null, 2));
    }

    // Calculate trend metrics from timeline
    const values = timeline.map((t: any) => t.values?.[0] || 0);
    const avgValue = values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const currentValue = values.length > 0 ? values[values.length - 1] : 0;
    
    // Determine trend direction based on recent vs older data
    const recentValues = values.slice(-Math.ceil(values.length / 3)); // Last third
    const olderValues = values.slice(0, Math.floor(values.length / 3)); // First third
    const recentAvg = recentValues.length > 0 ? recentValues.reduce((a: number, b: number) => a + b, 0) / recentValues.length : currentValue;
    const olderAvg = olderValues.length > 0 ? olderValues.reduce((a: number, b: number) => a + b, 0) / olderValues.length : avgValue;
    
    let direction = 'stable';
    let changePercent = 0;
    
    if (olderAvg > 0) {
      changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
      if (changePercent > 10) direction = 'rising';
      else if (changePercent < -10) direction = 'falling';
    }

    console.log(`[Trend Hunter] 📈 Trend direction: ${direction} (${changePercent.toFixed(1)}% change)`);
    console.log(`[Trend Hunter] 📊 Current value: ${currentValue}, Average: ${avgValue.toFixed(1)}, Peak: ${maxValue}`);

    // Extract regional data (map)
    const mapItem = trendsResult.items?.find((item: any) => item.type === 'dataforseo_trends_map');
    const topRegions = (mapItem?.data || [])
      .map((region: any) => ({
        region: region.geo_name || region.geo_id || 'Unknown',
        value: region.values?.[0] || 0
      }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5);

    console.log(`[Trend Hunter] 🗺️ Top regions: ${topRegions.length}`);
    if (topRegions.length > 0) {
      console.log(`[Trend Hunter] 🗺️ Top 3 regions:`, topRegions.slice(0, 3).map(r => `${r.region}(${r.value})`).join(', '));
    } else {
      console.log(`[Trend Hunter] ⚠️ WARNING: No regional data available`);
      console.log(`[Trend Hunter] 📋 mapItem structure:`, JSON.stringify(mapItem, null, 2));
    }

    // Extract related queries (rising and top)
    const relatedQueriesItem = trendsResult.items?.find((item: any) => item.type === 'related_queries');
    console.log(`[Trend Hunter] 🔗 Related queries item found:`, !!relatedQueriesItem);
    console.log(`[Trend Hunter] 🔗 Related queries data length:`, relatedQueriesItem?.data?.length || 0);
    
    const risingQueries = (relatedQueriesItem?.data || [])
      .filter((q: any) => q.type === 'rising')
      .map((q: any) => ({
        keyword: q.query || '',
        value: q.values?.[0] || 0,
        type: 'rising'
      }))
      .slice(0, 10);

    const topQueries = (relatedQueriesItem?.data || [])
      .filter((q: any) => q.type === 'top')
      .map((q: any) => ({
        keyword: q.query || '',
        value: q.values?.[0] || 0,
        type: 'related'
      }))
      .slice(0, 10);

    const allRelatedKeywords = [...risingQueries, ...topQueries];
    console.log(`[Trend Hunter] ✅ Found ${allRelatedKeywords.length} related keywords (${risingQueries.length} rising, ${topQueries.length} top)`);
    if (risingQueries.length > 0) {
      console.log(`[Trend Hunter] 🔥 Sample rising queries:`, risingQueries.slice(0, 3).map(q => q.keyword).join(', '));
    }
    if (topQueries.length > 0) {
      console.log(`[Trend Hunter] 📊 Sample top queries:`, topQueries.slice(0, 3).map(q => q.keyword).join(', '));
    }

    // Extract related topics
    const relatedTopicsItem = trendsResult.items?.find((item: any) => item.type === 'related_topics');
    console.log(`[Trend Hunter] 🏷️ Related topics item found:`, !!relatedTopicsItem);
    console.log(`[Trend Hunter] 🏷️ Related topics data length:`, relatedTopicsItem?.data?.length || 0);
    
    const relatedTopics = (relatedTopicsItem?.data || [])
      .slice(0, 5)
      .map((topic: any) => ({
        topic: topic.topic_title || topic.topic_type || 'Unknown',
        value: topic.values?.[0] || 0
      }));

    console.log(`[Trend Hunter] 🏷️ Related topics: ${relatedTopics.length}`);
    if (relatedTopics.length > 0) {
      console.log(`[Trend Hunter] 🏷️ Sample topics:`, relatedTopics.map(t => t.topic).join(', '));
    }

    // Get search volume data for commercial insights using Keywords API
    console.log(`[Trend Hunter] 💰 Fetching commercial data (search volume, CPC)...`);
    
    let searchVolume = 0;
    let competition = 0;
    let cpc = 0;
    
    try {
      const keywordPayload = [{
        keywords: [industry],
        location_code: locationCode,
        language_code: 'en'
      }];

      const keywordResponse = await callDataForSEO('/v3/keywords_data/google_ads/search_volume/live', keywordPayload);
      const keywordResult = keywordResponse.tasks?.[0]?.result?.[0];
      
      if (keywordResult) {
        searchVolume = keywordResult.search_volume || 0;
        competition = keywordResult.competition || 0;
        cpc = keywordResult.cpc || 0;
        console.log(`[Trend Hunter] ✅ Commercial data: ${searchVolume.toLocaleString()} volume, $${cpc.toFixed(2)} CPC, ${(competition * 100).toFixed(0)}% competition`);
      }
    } catch (err) {
      console.log('[Trend Hunter] ⚠️ Could not fetch commercial data, continuing without it');
    }

    // Demographics placeholder (Google Trends API doesn't provide this)
    const demographics = {
      ageGroups: [],
      gender: []
    };

    // Generate insights based on all collected data
    const insights = [];
    
    // Search volume insights
    if (searchVolume > 100000) {
      insights.push(`🔥 High search volume detected: ${searchVolume.toLocaleString()} monthly searches - major market opportunity!`);
    } else if (searchVolume > 10000) {
      insights.push(`📊 Moderate search volume: ${searchVolume.toLocaleString()} monthly searches - good market potential`);
    } else if (searchVolume > 0) {
      insights.push(`💡 Niche keyword: ${searchVolume.toLocaleString()} monthly searches - less competition, targeted audience`);
    }
    
    // Trend direction insights
    if (direction === 'rising') {
      insights.push(`🚀 ${industry} is trending UP with ${changePercent.toFixed(1)}% growth - capitalize on this momentum!`);
    } else if (direction === 'falling') {
      insights.push(`📉 ${industry} interest is declining by ${Math.abs(changePercent).toFixed(1)}% - consider pivoting strategy`);
    } else {
      insights.push(`📊 ${industry} shows stable interest - consistent audience engagement`);
    }
    
    // Competition insights
    if (competition > 0.7) {
      insights.push(`⚔️ High competition (${(competition * 100).toFixed(0)}%) - focus on long-tail variations or unique angles`);
    } else if (competition < 0.3 && competition > 0) {
      insights.push(`✨ Low competition (${(competition * 100).toFixed(0)}%) - easier to rank, act fast!`);
    }
    
    // CPC insights (commercial value)
    if (cpc > 5) {
      insights.push(`💰 High commercial value: $${cpc.toFixed(2)} CPC - strong monetization potential`);
    } else if (cpc > 1) {
      insights.push(`💵 Moderate commercial value: $${cpc.toFixed(2)} CPC - decent monetization opportunity`);
    }

    // Peak interest insights
    if (maxValue > avgValue * 1.5) {
      insights.push(`⚡ Peak interest detected at ${maxValue} (${((maxValue / avgValue - 1) * 100).toFixed(0)}% above average) - identify seasonal patterns`);
    }

    // Rising queries insights
    if (risingQueries.length > 0) {
      insights.push(`🔥 ${risingQueries.length} rising related queries detected - explore emerging sub-topics like "${risingQueries[0].keyword}"`);
    }

    // Regional insights
    if (topRegions.length > 0 && topRegions[0].value > 80) {
      insights.push(`🎯 Strongest in ${topRegions[0].region} (${topRegions[0].value}/100) - focus regional targeting here`);
    }

    // Related topics insights
    if (relatedTopics.length > 0) {
      insights.push(`🏷️ ${relatedTopics.length} related topics identified - expand content strategy to cover "${relatedTopics[0].topic}"`);
    }

    console.log(`[Trend Hunter] 💡 Generated ${insights.length} insights`);

    // Build top trends list
    const topTrends = [
      {
        keyword: industry,
        score: currentValue,
        direction,
        change: changePercent,
        volume: searchVolume.toLocaleString(),
      },
      ...risingQueries.slice(0, 4).map(k => ({
        keyword: k.keyword,
        score: k.value,
        direction: 'rising' as const,
        change: 0,
        volume: '—',
      }))
    ];

    console.log(`[Trend Hunter] 🎉 COMPLETE - Analysis finished successfully`);

    const returnData = {
      mainTrend: {
        keyword: industry,
        averageInterest: Math.round(avgValue),
        currentInterest: Math.round(currentValue),
        peakInterest: Math.round(maxValue),
        direction,
        changePercent: Math.round(changePercent * 10) / 10,
        timeline: timeline.map((t: any) => ({
          date: t.timestamp ? new Date(t.timestamp * 1000).toISOString().split('T')[0] : '',
          value: t.values?.[0] || 0,
        })),
      },
      topTrends,
      relatedKeywords: allRelatedKeywords,
      insights,
      demographics,
      regionalData: topRegions,
      relatedTopics,
    };

    console.log(`[Trend Hunter] 📦 Return data summary:`);
    console.log(`  - Timeline points: ${returnData.mainTrend.timeline.length}`);
    console.log(`  - Top trends: ${returnData.topTrends.length}`);
    console.log(`  - Related keywords: ${returnData.relatedKeywords.length}`);
    console.log(`  - Insights: ${returnData.insights.length}`);
    console.log(`  - Regional data: ${returnData.regionalData.length}`);
    console.log(`  - Related topics: ${returnData.relatedTopics?.length || 0}`);

    return returnData;
  } catch (error) {
    console.log('[Trend Hunter] ❌ ERROR:', error);
    throw error;
  }
}