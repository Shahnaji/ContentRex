import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Youtube, Loader2, Target } from 'lucide-react';
import { Input } from '../ui/input';
import { countries } from '../../utils/countries';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { InteractiveLoading, YOUTUBE_SEO_STAGES } from './InteractiveLoading';
import { OptimizeVideoResult } from './youtube-seo-types';
import { getRemainingFreeUsage, hasReachedFreeLimit, incrementUsage } from '../../utils/usageTracking';
import { UsageLimitModal } from '../UsageLimitModal';
import { saveToHistory } from '../HistoryTab';

interface YouTubeSEOOptimizeVideoProps {
  user?: any;
  onSignUpClick?: () => void;
  isDashboard?: boolean;
}

export const YouTubeSEOOptimizeVideo: React.FC<YouTubeSEOOptimizeVideoProps> = ({ user, onSignUpClick, isDashboard }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [country, setCountry] = useState('us');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<OptimizeVideoResult | null>(null);
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

  const handleOptimize = async () => {
    if (!videoUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    // Validate YouTube URL
    if (!videoUrl.match(/(?:youtube\\.com|youtu\\.be)/i)) {
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
            activeTab: 'optimize'
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize video');
      }

      const data = await response.json();
      
      setResult(data);
      toast.success('Optimize This Video analysis complete!');
      
      // Save to history
      saveToHistory({
        tool: 'youtube-seo',
        keyword: videoUrl,
        contentType: 'optimize-video',
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
      console.error('Optimize This Video error:', err);
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
          <h2 className="text-3xl text-[#001524]">⚡ Optimize This Video</h2>
        </div>

        <p className="text-sm text-[#15616d] mb-6 text-center">
          Get actionable fixes to improve your video's performance
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Your YouTube Video URL
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
            onClick={handleOptimize}
            disabled={loading}
            className="w-full py-4 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Optimize My Video'
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
            <p className="text-xl">⚡ Optimize This Video Analysis</p>
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
            {/* VIDEO HEALTH CHECK */}
            <div className="mb-12">
              <h3 className="text-4xl text-[#001524] mb-2 text-center">📊 Video Health Check</h3>
              <p className="text-sm text-[#15616d] mb-6 text-center">Current performance analysis</p>
              
              <div className="bg-gradient-to-br from-[#001524] to-[#15616d] rounded-2xl p-8 text-white mb-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                    <p className="text-4xl mb-2">{result.videoDetails.metrics.views.toLocaleString()}</p>
                    <p className="text-sm text-[#ffecd1]">Views</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                    <p className="text-4xl mb-2">{result.videoDetails.metrics.likes.toLocaleString()}</p>
                    <p className="text-sm text-[#ffecd1]">Likes ({((result.videoDetails.metrics.likes / result.videoDetails.metrics.views) * 100).toFixed(1)}%)</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                    <p className="text-4xl mb-2">{result.videoDetails.metrics.comments.toLocaleString()}</p>
                    <p className="text-sm text-[#ffecd1]">Comments</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <p className="text-sm text-[#ffecd1] mb-2">Optimization Score</p>
                  <p className="text-5xl mb-2">{result.metrics.optimizationScore}/100</p>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-[#ff7d00] h-full rounded-full transition-all"
                      style={{ width: `${result.metrics.optimizationScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#ffecd1] mt-2">
                    {result.metrics.optimizationScore >= 80 ? '🟢 Great!' : result.metrics.optimizationScore >= 60 ? '🟡 Needs Improvement' : '🔴 Critical Issues'}
                  </p>
                </div>
              </div>
            </div>

            {/* WHAT'S BROKEN */}
            <div className="mb-12">
              <h3 className="text-3xl text-[#001524] mb-2 text-center">❌ What Needs Fixing</h3>
              <p className="text-sm text-[#15616d] mb-6 text-center">Critical issues hurting your video's performance</p>
              
              <div className="space-y-4">
                {/* Title Check */}
                {(!result.videoDetails.title || result.videoDetails.title.length < 40) && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-xl p-5">
                    <p className="text-red-700 mb-2">❌ Title too short ({result.videoDetails.title.length} characters)</p>
                    <p className="text-sm text-red-600">Aim for 50-60 characters for optimal SEO</p>
                  </div>
                )}
                
                {/* Description Check */}
                {(!result.videoDetails.description || result.videoDetails.description.length < 200) && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-xl p-5">
                    <p className="text-red-700 mb-2">❌ Description too short ({result.videoDetails.description.length} characters)</p>
                    <p className="text-sm text-red-600">Need at least 200 characters for SEO. Add timestamps, keywords, and links.</p>
                  </div>
                )}
                
                {/* Tags Check */}
                {result.videoDetails.tags.length < 10 && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-xl p-5">
                    <p className="text-red-700 mb-2">❌ Only {result.videoDetails.tags.length} tags (need 15-20)</p>
                    <p className="text-sm text-red-600">You're missing out on discoverability. Add more relevant tags below.</p>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK FIXES */}
            <div className="mb-12">
              <h3 className="text-3xl text-[#001524] mb-2 text-center">⚡ Copy-Paste Fixes (Do This NOW)</h3>
              <p className="text-sm text-[#15616d] mb-6 text-center">Ready-to-use improvements</p>
              
              {/* Current vs Optimized Title */}
              {result.advancedFeatures && result.advancedFeatures.titleVariations && (
                <div className="bg-white border-2 border-[#15616d] rounded-2xl p-6 mb-6">
                  <h4 className="text-xl text-[#001524] mb-4">1. Update Your Title</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-red-600 mb-2">❌ Current:</p>
                      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
                        <p className="text-[#001524]">{result.videoDetails.title}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-green-600 mb-2">✅ Better:</p>
                      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3">
                        <p className="text-[#001524]">{result.advancedFeatures.titleVariations[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Add These Tags */}
              {result.advancedFeatures && result.advancedFeatures.optimizedTags && (
                <div className="bg-[#ffecd1] border-2 border-[#ff7d00] rounded-2xl p-6">
                  <h4 className="text-xl text-[#001524] mb-4">2. Add These Missing Tags</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.advancedFeatures.optimizedTags.filter(tag => 
                      !result.videoDetails.tags.some(existing => existing.toLowerCase() === tag.toLowerCase())
                    ).slice(0, 15).map((tag, idx) => (
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
                      copyToClipboard(tags, 'Tags copied to clipboard!');
                    }}
                    className="w-full py-2 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors"
                  >
                    📋 Copy All Tags
                  </button>
                </div>
              )}
            </div>

            {/* COMPARE TO COMPETITORS */}
            {result.engagementBenchmarks && result.engagementBenchmarks.avgEngagementRate > 0 && (
              <div className="mb-12">
                <h3 className="text-3xl text-[#001524] mb-2 text-center">📈 How You Compare to Competitors</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Benchmark your video against top performers</p>
                
                <div className="bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-2xl p-8 text-white">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Your Stats */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <p className="text-sm text-[#ffecd1] mb-4 text-center">Your Video</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Like Rate:</span>
                          <span className="text-xl">{((result.videoDetails.metrics.likes / result.videoDetails.metrics.views) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Comment Rate:</span>
                          <span className="text-xl">{((result.videoDetails.metrics.comments / result.videoDetails.metrics.views) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Engagement:</span>
                          <span className="text-xl">{(((result.videoDetails.metrics.likes + result.videoDetails.metrics.comments) / result.videoDetails.metrics.views) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Competitor Average */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <p className="text-sm text-[#ffecd1] mb-4 text-center">Top Performers Average</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Like Rate:</span>
                          <span className="text-xl">{result.engagementBenchmarks.avgLikeRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Comment Rate:</span>
                          <span className="text-xl">{result.engagementBenchmarks.avgCommentRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Engagement:</span>
                          <span className="text-xl">{result.engagementBenchmarks.avgEngagementRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    {(((result.videoDetails.metrics.likes + result.videoDetails.metrics.comments) / result.videoDetails.metrics.views) * 100) >= result.engagementBenchmarks.avgEngagementRate ? (
                      <p className="text-lg">🟢 <strong>Great job!</strong> Your engagement is above average. Keep doing what you're doing!</p>
                    ) : (
                      <p className="text-lg">🔴 <strong>Below average.</strong> Your video needs {((result.engagementBenchmarks.avgEngagementRate - ((result.videoDetails.metrics.likes + result.videoDetails.metrics.comments) / result.videoDetails.metrics.views) * 100)).toFixed(1)}% more engagement to match top performers.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACTION CHECKLIST */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div>
                <h3 className="text-3xl text-[#001524] mb-2 text-center">✅ Your Action Checklist</h3>
                <p className="text-sm text-[#15616d] mb-6 text-center">Focused actions to boost your video's performance</p>
                <div className="bg-gradient-to-br from-[#15616d] to-[#001524] rounded-2xl p-8 text-white">
                  <div className="space-y-6">
                    {result.suggestions.map((suggestion, idx) => {
                      // Check if this is a section header
                      const isSectionHeader = suggestion.match(/^[📝📄🏷️💬🎨⏱️🔍]/) || 
                                              (suggestion === suggestion.toUpperCase() && suggestion.length < 50) ||
                                              (!suggestion.match(/^\d/) && suggestion.split(' ').length < 6);
                      
                      if (isSectionHeader) {
                        return (
                          <h4 key={idx} className="text-lg text-[#ff7d00] mt-4 first:mt-0 pb-2 border-b border-white/20">
                            {suggestion}
                          </h4>
                        );
                      }
                      
                      return (
                        <div key={idx} className="flex items-start gap-3 pl-4">
                          <span className="flex-shrink-0 w-6 h-6 bg-[#ff7d00] rounded-full flex items-center justify-center text-white text-sm">
                            {suggestion.match(/^\d+/) ? suggestion.match(/^\d+/)![0] : '•'}
                          </span>
                          <span className="flex-1 text-white/90 leading-relaxed">
                            {suggestion.replace(/^\d+\.\s*/, '')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
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