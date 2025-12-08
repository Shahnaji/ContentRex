// Shared types for YouTube SEO workflows

export interface VideoDetails {
  title: string;
  description: string;
  tags: string[];
  channelTitle: string;
  publishedDate: string;
  duration?: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
  };
}

export interface TopVideo {
  title: string;
  videoId: string;
  channelName: string;
  views: number;
  publishedDate: string;
  description: string;
  duration: string;
}

export interface CompetitorInsights {
  topVideos: TopVideo[];
  averageViews: number;
}

export interface AdvancedFeatures {
  optimizedTags: string[];
  titleVariations: string[];
  hashtags: string[];
  bestTimeToPost: string;
  optimalVideoLength: string;
  contentGaps: string[];
  thumbnailStrategy: string;
}

export interface EngagementBenchmarks {
  avgLikeRate: number;
  avgCommentRate: number;
  avgEngagementRate: number;
  topPerformer: {
    title: string;
    views: number;
    engagementRate: number;
  } | null;
}

export interface ThumbnailPatterns {
  strategy: string;
  topPerformers: {
    title: string;
    videoId: string;
    thumbnailUrl: string;
  }[];
}

// KEYWORD SEARCH RESULT
export interface KeywordSearchResult {
  type: 'keyword_search';
  topVideos: TopVideo[];
  keywords: string[];
  relatedKeywords: string[];
  suggestions: string[];
  competitorInsights: CompetitorInsights;
  metrics: {
    estimatedViews: number;
    competitionLevel: string;
    trendingScore?: number;
    trendDirection?: string;
  };
  advancedFeatures?: AdvancedFeatures;
  engagementBenchmarks?: EngagementBenchmarks;
  videoTopicSuggestions?: string[];
  thumbnailPatterns?: ThumbnailPatterns;
}

// VIDEO ANALYSIS RESULT (LEARN FROM THIS)
export interface LearnFromThisResult {
  type: 'video_analysis';
  activeTab: 'learn';
  videoDetails: VideoDetails;
  topVideos: TopVideo[];
  keywords: string[];
  relatedKeywords: string[];
  metrics: {
    estimatedViews: number;
    competitionLevel: string;
    optimizationScore: number;
  };
  advancedFeatures: AdvancedFeatures;
  engagementBenchmarks: EngagementBenchmarks;
  videoTopicSuggestions: string[];
}

// VIDEO ANALYSIS RESULT (OPTIMIZE THIS VIDEO)
export interface OptimizeVideoResult {
  type: 'video_analysis';
  activeTab: 'optimize';
  videoDetails: VideoDetails;
  keywords: string[];
  relatedKeywords: string[];
  suggestions: string[];
  metrics: {
    estimatedViews: number;
    competitionLevel: string;
    optimizationScore: number;
  };
  advancedFeatures: AdvancedFeatures;
  engagementBenchmarks: EngagementBenchmarks;
}
