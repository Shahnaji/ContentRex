import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Youtube, Loader2, Target, Eye } from 'lucide-react';
import { Input } from '../ui/input';
import { countries } from '../../utils/countries';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { InteractiveLoading, YOUTUBE_SEO_STAGES } from './InteractiveLoading';
import { LearnFromThisResult } from './youtube-seo-types';
import { getRemainingFreeUsage, hasReachedFreeLimit, incrementUsage } from '../../utils/usageTracking';
import { UsageLimitModal } from '../UsageLimitModal';
import { saveToHistory } from '../HistoryTab';

interface YouTubeSEOLearnFromThisProps {
  user?: any;
  onSignUpClick?: () => void;
  isDashboard?: boolean;
}

export const YouTubeSEOLearnFromThis: React.FC<YouTubeSEOLearnFromThisProps> = ({ user, onSignUpClick, isDashboard }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [country, setCountry] = useState('us');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<LearnFromThisResult | null>(null);
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
    if (!videoUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    // Validate YouTube URL
    if (!videoUrl.match(/(?:youtube\.com|youtu\.be)/i)) {
      toast.error('Please enter a valid YouTube URL');
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
            input: videoUrl, 
            country,
            activeTab: 'learn'
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze video');
      }

      const data = await response.json();
      
      setResult(data);
      toast.success('Learn From This analysis complete!');
      
      // Save to history
      saveToHistory({
        tool: 'youtube-seo',
        keyword: videoUrl,
        contentType: 'learn-from-this',
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
      console.error('Learn From This error:', err);
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
          <h2 className="text-3xl text-[#001524]">🔍 Learn From This Video</h2>
        </div>

        <p className="text-sm text-[#15616d] mb-6 text-center">
          Analyze a successful competitor video to learn what's working
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              YouTube Video URL
            </label>
            <Input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
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
              'Learn From This Video'
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
          {/* Tab Indicator */}
          <div className="bg-gradient-to-r from-[#ff7d00] to-[#78290f] rounded-2xl p-4 text-white text-center shadow-xl">
            <p className="text-xl">🔍 Learn From This Analysis</p>
          </div>

          {/* HERO STATS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#001524] via-[#15616d] to-[#001524] rounded-3xl p-10 text-white shadow-2xl"
          >
            <h2 className="text-4xl text-center mb-8">📊 YouTube SEO Analysis Report</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#ffecd1] rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-sm text-[#ffecd1] mb-2">Optimization Score</p>
                <p className="text-3xl">{result.metrics.optimizationScore}/100</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-3 text-[#ffecd1]" />
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
            {/* 1. PERFORMANCE OVERVIEW */}
            {result.videoDetails && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">📊 This Video's Performance</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">What this successful video achieved</p>
                <div className="bg-gradient-to-br from-[#001524] to-[#15616d] rounded-2xl p-8 text-white">
                  <div className="grid md:grid-cols-3 gap-6 mb-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                      <p className="text-4xl mb-2">{result.videoDetails.metrics.views.toLocaleString()}</p>
                      <p className="text-sm text-[#ffecd1]">Views</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                      <p className="text-4xl mb-2">{result.videoDetails.metrics.likes.toLocaleString()}</p>
                      <p className="text-sm text-[#ffecd1]">Likes</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                      <p className="text-4xl mb-2">{(((result.videoDetails.metrics.likes + result.videoDetails.metrics.comments) / result.videoDetails.metrics.views) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-[#ffecd1]">Engagement Rate</p>
                    </div>
                  </div>
                  {result.engagementBenchmarks && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-sm text-[#ffecd1]">
                        {(() => {
                          const videoEngagement = (((result.videoDetails.metrics.likes + result.videoDetails.metrics.comments) / result.videoDetails.metrics.views) * 100);
                          const expectedMin = result.engagementBenchmarks.expectedEngagementRange?.min || 1.0;
                          const expectedMax = result.engagementBenchmarks.expectedEngagementRange?.max || 8.0;
                          const avgViews = result.engagementBenchmarks.avgViews || 0;
                          
                          // Check if engagement is within or above expected range for this view tier
                          if (videoEngagement >= expectedMin) {
                            return `🟢 ${avgViews >= 1000000 ? 'Strong for viral content!' : 'Above average engagement!'}`;
                          } else {
                            return `🟡 Below average for this view tier - there's room to improve`;
                          }
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. WHY IT WORKED */}
            {result.videoDetails && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">🎯 Why This Video Worked</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Copy these proven elements</p>
                
                <div className="bg-[#ffecd1] border-2 border-[#ff7d00] rounded-xl p-6 mb-4">
                  <p className="text-sm text-[#15616d] mb-2">✍️ Their Winning Title:</p>
                  <p className="text-xl text-[#001524]">{result.videoDetails.title}</p>
                  <p className="text-xs text-[#15616d] mt-2">{result.videoDetails.title.length} characters - Use this format!</p>
                </div>
              </div>
            )}

            {/* 3. AUDIENCE RETENTION ANALYSIS */}
            {result.videoDetails && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">📉 Audience Retention Analysis</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">The structure that kept viewers watching</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Video Length */}
                  <div className="bg-gradient-to-br from-[#15616d] to-[#001524] rounded-2xl p-6 text-white text-center">
                    <div className="text-4xl mb-2">⏱️</div>
                    <p className="text-sm text-[#ffecd1] mb-2">Video Length</p>
                    <p className="text-2xl">{result.videoDetails.duration || 'N/A'}</p>
                    <p className="text-xs text-[#ffecd1] mt-2">Optimal length for this niche</p>
                  </div>

                  {/* Engagement Rate */}
                  <div className="bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-2xl p-6 text-white text-center">
                    <div className="text-4xl mb-2">🔥</div>
                    <p className="text-sm text-[#ffecd1] mb-2">Engagement Rate</p>
                    <p className="text-2xl">
                      {(((result.videoDetails.metrics.likes + result.videoDetails.metrics.comments) / result.videoDetails.metrics.views) * 100).toFixed(1)}%
                    </p>
                    {result.engagementBenchmarks && (() => {
                      const videoEngagement = (((result.videoDetails.metrics.likes + result.videoDetails.metrics.comments) / result.videoDetails.metrics.views) * 100);
                      const expectedMin = result.engagementBenchmarks.expectedEngagementRange?.min || 1.0;
                      
                      return (
                        <p className="text-xs text-[#ffecd1] mt-2">
                          {videoEngagement >= expectedMin ? '🟢 Strong' : '🟡 Needs Work'}
                        </p>
                      );
                    })()}
                  </div>

                  {/* Estimated Intro Length */}
                  <div className="bg-gradient-to-br from-[#001524] to-[#15616d] rounded-2xl p-6 text-white text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-sm text-[#ffecd1] mb-2">Title Hook Score</p>
                    <p className="text-2xl">
                      {result.videoDetails.title.length >= 40 && result.videoDetails.title.length <= 70 ? 'Strong' : 'Weak'}
                    </p>
                    <p className="text-xs text-[#ffecd1] mt-2">
                      {result.videoDetails.title.length >= 40 && result.videoDetails.title.length <= 70 
                        ? '✅ Good length (40-70 chars)' 
                        : `⚠️ ${result.videoDetails.title.length < 40 ? 'Too short' : 'Too long'}`}
                    </p>
                  </div>
                </div>

                {/* Retention Insights */}
                <div className="mt-6 bg-white border-2 border-[#15616d] rounded-2xl p-6">
                  <h4 className="text-xl text-[#001524] mb-4 text-center">🎯 Retention Insights</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-[#ffecd1] rounded-lg">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="text-sm text-[#001524]">
                          <strong>View Duration Strategy:</strong> Videos with {result.videoDetails.duration || '8-12 minutes'} length in this niche tend to perform well. Keep viewers engaged throughout.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[#ffecd1] rounded-lg">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="text-sm text-[#001524]">
                          <strong>Hook Timing:</strong> The first 30-60 seconds are critical. Deliver on your title promise immediately to prevent drop-off.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[#ffecd1] rounded-lg">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="text-sm text-[#001524]">
                          <strong>Engagement Timing:</strong> High engagement rate ({(((result.videoDetails.metrics.likes + result.videoDetails.metrics.comments) / result.videoDetails.metrics.views) * 100).toFixed(1)}%) suggests viewers watched long enough to interact. Aim for similar pacing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. KEYWORDS THEY'RE RANKING FOR */}
            <div className="mb-12">
              <h3 className="text-3xl text-[#001524] mb-2 text-center">🔑 Keywords They're Ranking For</h3>
              <p className="text-sm text-[#15616d] mb-6 text-center">These keywords are bringing them traffic</p>
              
              <div className="bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-2xl p-6 mb-4">
                <p className="text-sm text-[#ffecd1] mb-3 text-center">🎯 Main Keywords (In Title)</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.keywords.slice(0, 5).map((keyword, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-white text-[#001524] rounded-full hover:scale-105 transition-transform"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {result.relatedKeywords && result.relatedKeywords.length > 0 && (
                <div className="bg-white border-2 border-[#15616d] rounded-2xl p-6">
                  <p className="text-sm text-[#15616d] mb-4 text-center">🔍 Related Keywords (In Description)</p>
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
                      copyToClipboard(keywords, 'All keywords copied!');
                    }}
                    className="w-full py-2 bg-[#15616d] text-white rounded-lg hover:bg-[#001524] transition-colors text-sm"
                  >
                    📋 Copy All Keywords
                  </button>
                </div>
              )}
            </div>

            {/* 6. VIDEO TOPICS YOU SHOULD CREATE */}
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

            {/* 7. THEIR TAGS & HASHTAGS */}
            {result.advancedFeatures && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">🏷️ Their Tags & Hashtags</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Copy what's working for them</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white border-2 border-[#15616d] rounded-2xl p-6">
                    <h4 className="text-xl text-[#001524] mb-4 text-center">Tags</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.advancedFeatures.optimizedTags.slice(0, 20).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-[#ff7d00] text-white rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const tags = result.advancedFeatures!.optimizedTags.slice(0, 20).join(', ');
                        copyToClipboard(tags, 'Tags copied!');
                      }}
                      className="w-full py-2 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors text-sm"
                    >
                      📋 Copy All Tags
                    </button>
                  </div>

                  <div className="bg-[#ffecd1] border-2 border-[#ff7d00] rounded-2xl p-6">
                    <h4 className="text-xl text-[#001524] mb-4 text-center">Hashtags</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.advancedFeatures.hashtags.slice(0, 15).map((hashtag, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-white border-2 border-[#15616d] text-[#001524] rounded-full text-sm"
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const hashtags = result.advancedFeatures!.hashtags.slice(0, 15).join(' ');
                        copyToClipboard(hashtags, 'Hashtags copied!');
                      }}
                      className="w-full py-2 bg-[#15616d] text-white rounded-lg hover:bg-[#001524] transition-colors text-sm"
                    >
                      📋 Copy All Hashtags
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 8. OTHER TOP VIDEOS IN THIS NICHE */}
            {result.topVideos && result.topVideos.length > 0 && (
              <div>
                <h3 className="text-3xl text-[#001524] mb-2 text-center">🎬 Other Top Videos in This Niche</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Study these for more pattern recognition</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {result.topVideos.slice(0, 6).map((video, idx) => (
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
          </motion.div>
        </motion.div>
      )}
      {showUsageLimitModal && (
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
      )}
    </motion.div>
  );
};