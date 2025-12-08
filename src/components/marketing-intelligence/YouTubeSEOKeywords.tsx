import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Youtube, Loader2, TrendingUp, Eye, Target } from 'lucide-react';
import { Input } from '../ui/input';
import { countries } from '../../utils/countries';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { InteractiveLoading, YOUTUBE_SEO_STAGES } from './InteractiveLoading';
import { KeywordSearchResult } from './youtube-seo-types';
import { getRemainingFreeUsage, hasReachedFreeLimit, incrementUsage } from '../../utils/usageTracking';
import { UsageLimitModal } from '../UsageLimitModal';
import { saveToHistory } from '../HistoryTab';

interface YouTubeSEOKeywordsProps {
  user?: any;
  onSignUpClick?: () => void;
  isDashboard?: boolean;
}

export const YouTubeSEOKeywords: React.FC<YouTubeSEOKeywordsProps> = ({ user, onSignUpClick, isDashboard }) => {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('us');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<KeywordSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);

  // Fallback clipboard function for when Clipboard API is blocked
  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch (err) {
      // Fallback method using textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toast.success(successMessage);
      } catch (fallbackErr) {
        toast.error('Copy failed. Please copy manually.');
      }
      document.body.removeChild(textarea);
    }
  };

  const handleAnalyze = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter keywords');
      return;
    }

    // Check usage limit for non-authenticated users
    if (!user && hasReachedFreeLimit()) {
      setShowUsageLimitModal(true);
      return;
    }

    setLoading(true);
    setLoadingStage(0);
    setLoadingProgress(0);
    setError(null);
    setResult(null);

    // Animate loading stages
    const stageInterval = setInterval(() => {
      setLoadingStage(prev => (prev < 4 ? prev + 1 : prev));
    }, 8000);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 600);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/youtube-seo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ 
            input: keyword, 
            country
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze YouTube keywords');
      }

      const data = await response.json();
      
      setResult(data);
      toast.success('YouTube keyword analysis complete!');
      
      // Save to history
      saveToHistory({
        tool: 'youtube-seo',
        keyword,
        contentType: 'keyword-research',
        generatedContent: JSON.stringify(data, null, 2),
        metadata: {
          country: countryCode
        }
      });
      
      // Increment usage for non-authenticated users
      if (!user) {
        incrementUsage();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('YouTube Keywords error:', err);
    } finally {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      setLoading(false);
      setLoadingStage(0);
      setLoadingProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Usage Counter for Non-Authenticated Users (Only on Public Landing Page) */}
      {!user && !isDashboard && (
        <div className="mb-4 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white px-4 py-3 rounded-lg shadow-lg text-center">
          <p className="text-base">
            ✨ <strong>{getRemainingFreeUsage()} of 3</strong> free generations remaining
            {getRemainingFreeUsage() > 0 && (
              <span className="block text-sm mt-1 text-[#ffecd1]">
                Sign up for unlimited access with a 14-day free trial!
              </span>
            )}
          </p>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#ff7d00] rounded-full flex items-center justify-center">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl text-[#001524]">YouTube Keyword Intelligence</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Target Keywords
            </label>
            <Input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keywords (e.g., gaming tips, cooking recipes)"
              className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Target Country
            </label>
            <select 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
              disabled={loading}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-4 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Keywords'
            )}
          </button>
        </div>
      </div>

      {/* Interactive Loading Display */}
      {loading && (
        <InteractiveLoading
          stages={YOUTUBE_SEO_STAGES}
          currentStage={loadingStage}
          progress={loadingProgress}
        />
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border-2 border-red-500 rounded-2xl p-6"
        >
          <p className="text-red-700 text-center">{error}</p>
        </motion.div>
      )}

      {/* Results Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* HERO STATS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#001524] via-[#15616d] to-[#001524] rounded-3xl p-10 text-white shadow-2xl"
          >
            <h2 className="text-4xl text-center mb-8">📊 YouTube Intelligence Report</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-[#ffecd1]" />
                <p className="text-sm text-[#ffecd1] mb-2">
                  {result.metrics.trendingScore !== undefined ? 'YouTube Trending Score' : 'Monthly Searches'}
                </p>
                <p className="text-3xl">
                  {result.metrics.trendingScore !== undefined 
                    ? `${result.metrics.trendingScore}/100` 
                    : result.metrics.estimatedViews.toLocaleString()}
                </p>
                {result.metrics.trendDirection && (
                  <p className="text-sm text-[#ffecd1] mt-2">
                    {result.metrics.trendDirection === 'Rising' && '📈 Rising'}
                    {result.metrics.trendDirection === 'Declining' && '📉 Declining'}
                    {result.metrics.trendDirection === 'Stable' && '➡️ Stable'}
                  </p>
                )}
                {result.topVideos.length > 0 && (() => {
                  const avgViews = Math.round(
                    result.topVideos.slice(0, 10).reduce((sum, v) => sum + v.views, 0) / 
                    Math.min(result.topVideos.length, 10)
                  );
                  return (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-xs text-[#ffecd1]/80 mb-1">Avg Views (Top 10)</p>
                      <p className="text-lg">{avgViews.toLocaleString()}</p>
                    </div>
                  );
                })()}
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center">
                <Target className="w-12 h-12 mb-3 text-[#ffecd1]" />
                <p className="text-sm text-[#ffecd1] mb-2">Competition</p>
                <p className="text-3xl">{result.metrics.competitionLevel}</p>
              </div>
            </div>
          </motion.div>

          {/* MAIN CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-4 border-[#15616d] rounded-3xl p-10 shadow-2xl"
          >
            {/* 1. VIDEO TOPIC SUGGESTIONS */}
            {result.videoTopicSuggestions && result.videoTopicSuggestions.length > 0 && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">💡 Video Topics You Should Create</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Based on gaps in this niche</p>
                <div className="space-y-3">
                  {result.videoTopicSuggestions.slice(0, 5).map((topic, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#ffecd1] border-2 border-[#ff7d00] rounded-xl p-5 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-[#ff7d00] text-white rounded-full flex items-center justify-center">{idx + 1}</span>
                        <span className="text-[#001524] text-lg">{topic}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. RECOMMENDED KEYWORDS */}
            <div className="mb-12">
              <h3 className="text-3xl text-[#001524] mb-2 text-center">🔑 Recommended Keywords</h3>
              <p className="text-sm text-[#15616d] mb-6 text-center">Use these in your titles and descriptions</p>
              
              <div className="bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-2xl p-6 mb-4">
                <p className="text-sm text-[#ffecd1] mb-3 text-center">🎯 Main Keywords</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {result.keywords.slice(0, 5).map((keyword, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-white text-[#001524] rounded-full hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => copyToClipboard(keyword, `Copied: ${keyword}`)}
                      title="Click to copy"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    const keywords = result.keywords.slice(0, 5).join(', ');
                    copyToClipboard(keywords, 'All main keywords copied!');
                  }}
                  className="w-full py-2 bg-white text-[#001524] rounded-lg hover:bg-[#ffecd1] transition-colors text-sm"
                >
                  📋 Copy All Main Keywords
                </button>
              </div>

              {result.relatedKeywords && result.relatedKeywords.length > 0 && (
                <div className="bg-white border-2 border-[#15616d] rounded-2xl p-6">
                  <p className="text-sm text-[#15616d] mb-4 text-center">🔍 Related Keywords</p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {result.relatedKeywords.map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-2 bg-[#ffecd1] border-2 border-[#15616d] text-[#001524] rounded-full text-sm hover:bg-[#ff7d00] hover:text-white hover:border-[#ff7d00] transition-colors cursor-pointer"
                        onClick={() => copyToClipboard(keyword, `Copied: ${keyword}`)}
                        title="Click to copy"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      const keywords = result.relatedKeywords!.join(', ');
                      copyToClipboard(keywords, 'All related keywords copied!');
                    }}
                    className="w-full py-2 bg-[#15616d] text-white rounded-lg hover:bg-[#001524] transition-colors text-sm"
                  >
                    📋 Copy All Related Keywords
                  </button>
                </div>
              )}
            </div>

            {/* 3. TOP PERFORMING VIDEOS */}
            {result.topVideos && result.topVideos.length > 0 && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">🎬 Top Performing Videos</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Videos currently ranking for "{keyword}"</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {result.topVideos.slice(0, 4).map((video, idx) => (
                    <a
                      key={idx}
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ffecd1] border-2 border-[#ff7d00] rounded-xl p-5 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer block"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center text-white text-lg">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[#001524] mb-2 line-clamp-2">{video.title}</h4>
                          <p className="text-sm text-[#15616d] mb-2">{video.channelName}</p>
                          <div className="flex items-center gap-4 text-xs text-[#15616d]">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {video.views.toLocaleString()}
                            </span>
                            {video.duration && (
                              <span>⏱️ {video.duration}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 4. THUMBNAIL STRATEGY */}
            {result.thumbnailPatterns && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">🖼️ Thumbnail Strategy</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Design thumbnails that get clicks</p>
                
                <div className="bg-white border-2 border-[#15616d] rounded-2xl p-6">
                  <div className="mb-6 bg-[#ffecd1] border-2 border-[#ff7d00] rounded-xl p-6">
                    <p className="text-[#001524]">{result.thumbnailPatterns.strategy}</p>
                  </div>

                  {result.thumbnailPatterns.topPerformers && result.thumbnailPatterns.topPerformers.length > 0 && (
                    <div>
                      <p className="text-sm text-[#15616d] mb-4 text-center">🏆 Top Performing Thumbnails to Study</p>
                      <div className="grid md:grid-cols-3 gap-4">
                        {result.thumbnailPatterns.topPerformers.map((video, idx) => (
                          <a
                            key={idx}
                            href={`https://www.youtube.com/watch?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                          >
                            <div className="bg-[#ffecd1] border-2 border-[#15616d] rounded-xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02]">
                              <img 
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                                }}
                              />
                              <div className="p-3">
                                <p className="text-xs text-[#001524] line-clamp-2">{video.title}</p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. TITLE VARIATIONS */}
            {result.advancedFeatures?.titleVariations && result.advancedFeatures.titleVariations.length > 0 && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">✍️ Title Variations</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">SEO-optimized titles for maximum discoverability</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.advancedFeatures.titleVariations.slice(0, 10).map((title, idx) => (
                    <div 
                      key={idx}
                      className="bg-white border-2 border-[#15616d] rounded-xl p-4 hover:shadow-md transition-all hover:border-[#ff7d00]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-7 h-7 bg-[#ff7d00] text-white rounded-full flex items-center justify-center text-sm">{idx + 1}</span>
                        <span className="text-[#001524]">{title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. OPTIMIZED TAGS */}
            {result.advancedFeatures?.optimizedTags && result.advancedFeatures.optimizedTags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">🏷️ Optimized Tags</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Copy these tags to your YouTube video settings</p>
                <div className="bg-white border-2 border-[#15616d] rounded-2xl p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.advancedFeatures.optimizedTags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-2 bg-[#ffecd1] border border-[#15616d] text-[#001524] rounded-lg text-sm hover:bg-[#ff7d00] hover:text-white transition-colors cursor-pointer"
                        title="Click to copy"
                        onClick={() => {
                          copyToClipboard(tag, `Copied: ${tag}`);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      const tags = result.advancedFeatures!.optimizedTags.join(', ');
                      copyToClipboard(tags, 'All tags copied!');
                    }}
                    className="w-full py-2 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors text-sm"
                  >
                    📋 Copy All Tags
                  </button>
                </div>
              </div>
            )}

            {/* 7. HASHTAGS */}
            {result.advancedFeatures?.hashtags && result.advancedFeatures.hashtags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">#️⃣ Hashtags</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Add these to your description for better discovery</p>
                <div className="bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-2xl p-6">
                  <div className="flex flex-wrap gap-3 justify-center mb-4">
                    {result.advancedFeatures.hashtags.map((hashtag, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 bg-white text-[#001524] rounded-full hover:scale-105 transition-transform cursor-pointer"
                        title="Click to copy"
                        onClick={() => {
                          copyToClipboard(hashtag, `Copied: ${hashtag}`);
                        }}
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      const hashtags = result.advancedFeatures!.hashtags.join(' ');
                      copyToClipboard(hashtags, 'All hashtags copied!');
                    }}
                    className="w-full py-2 bg-white text-[#001524] rounded-lg hover:bg-[#ffecd1] transition-colors text-sm"
                  >
                    📋 Copy All Hashtags
                  </button>
                </div>
              </div>
            )}

            {/* 8. POSTING STRATEGY */}
            {(result.advancedFeatures?.bestTimeToPost || result.advancedFeatures?.optimalVideoLength) && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">🗓️ Posting Strategy</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Optimize when and how you publish</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {result.advancedFeatures.bestTimeToPost && (
                    <div className="bg-[#ffecd1] border-2 border-[#ff7d00] rounded-xl p-6">
                      <p className="text-sm text-[#15616d] mb-3 text-center">📅 Best Time to Post</p>
                      <p className="text-[#001524] text-center">{result.advancedFeatures.bestTimeToPost}</p>
                    </div>
                  )}
                  
                  {result.advancedFeatures.optimalVideoLength && (
                    <div className="bg-[#ffecd1] border-2 border-[#ff7d00] rounded-xl p-6">
                      <p className="text-sm text-[#15616d] mb-3 text-center">⏱️ Optimal Video Length</p>
                      <p className="text-[#001524] text-center">{result.advancedFeatures.optimalVideoLength}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 9. ENGAGEMENT BENCHMARKS */}
            {result.engagementBenchmarks && result.engagementBenchmarks.avgEngagementRate > 0 && (
              <div>
                <h3 className="text-3xl text-[#001524] mb-2 text-center">📈 Engagement Benchmarks</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Target these metrics for success</p>
                
                <div className="bg-gradient-to-br from-[#15616d] to-[#001524] rounded-2xl p-8 text-white">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                      <p className="text-sm text-[#ffecd1] mb-2">Target Like Rate</p>
                      <p className="text-3xl">{result.engagementBenchmarks.avgLikeRate}%</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                      <p className="text-sm text-[#ffecd1] mb-2">Target Comment Rate</p>
                      <p className="text-3xl">{result.engagementBenchmarks.avgCommentRate}%</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                      <p className="text-sm text-[#ffecd1] mb-2">Total Engagement</p>
                      <p className="text-3xl">{result.engagementBenchmarks.avgEngagementRate}%</p>
                    </div>
                  </div>

                  {result.engagementBenchmarks.topPerformer && (
                    <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <p className="text-sm text-[#ffecd1] mb-3 text-center">🏆 Top Performer</p>
                      <p className="text-lg text-center mb-2">{result.engagementBenchmarks.topPerformer.title}</p>
                      <div className="flex justify-center gap-8 text-sm">
                        <span>{result.engagementBenchmarks.topPerformer.views.toLocaleString()} views</span>
                        <span>{result.engagementBenchmarks.topPerformer.engagementRate}% engagement</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      
      {/* Usage Limit Modal */}
      <UsageLimitModal 
        isOpen={showUsageLimitModal}
        onClose={() => setShowUsageLimitModal(false)}
        onSignUp={() => {
          setShowUsageLimitModal(false);
          if (onSignUpClick) {
            onSignUpClick();
          }
        }}
      />
    </motion.div>
  );
};