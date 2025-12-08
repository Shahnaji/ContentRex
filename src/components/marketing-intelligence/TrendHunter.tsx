import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Loader2, BarChart3, Users, MapPin, ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { countries } from '../../utils/countries';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { InteractiveLoading, TREND_HUNTER_STAGES } from './InteractiveLoading';
import { getRemainingFreeUsage, hasReachedFreeLimit, incrementUsage } from '../../utils/usageTracking';
import { UsageLimitModal } from '../UsageLimitModal';
import { saveToHistory } from '../HistoryTab';

interface TrendData {
  keyword: string;
  growth: number;
  volume: number;
  category: string;
}

interface MainTrend {
  keyword: string;
  currentVolume: number;
  averageVolume: number;
  peakVolume: number;
  growth: number;
  trend: 'rising' | 'falling' | 'stable';
  chartData: Array<{ date: string; value: number }>;
}

interface DemographyData {
  age_range: string;
  gender: string;
  value: number;
}

interface RegionalData {
  location: string;
  value: number;
}

interface TrendHunterResult {
  mainTrend: MainTrend;
  trends: TrendData[];
  relatedKeywords: string[];
  insights: string[];
  demographics: DemographyData[] | null;
  regionalData: RegionalData[] | null;
}

interface TrendHunterProps {
  user?: any;
  onSignUpClick?: () => void;
  isDashboard?: boolean;
}

export const TrendHunter: React.FC<TrendHunterProps> = ({ user, onSignUpClick, isDashboard }) => {
  const [industry, setIndustry] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const [country, setCountry] = useState('us');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<TrendHunterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);

  const handleDiscover = async () => {
    if (!industry.trim()) {
      toast.error('Please enter an industry or niche');
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
    let stageInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    stageInterval = setInterval(() => {
      setLoadingStage(prev => (prev < 4 ? prev + 1 : prev));
    }, 10000); // Change stage every 10 seconds (8 steps = ~40-50s total)

    progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 2;
      });
    }, 600); // Update progress every 600ms

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/trend-hunter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ industry, timeRange, country }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to discover trends');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('[Trend Hunter Frontend] Received result:', {
        hasDemographics: !!data.demographics,
        demographicsLength: data.demographics?.length,
        hasRegionalData: !!data.regionalData,
        regionalDataLength: data.regionalData?.length,
      });

      setResult({
        mainTrend: data.mainTrend,
        trends: data.trends,
        relatedKeywords: data.relatedKeywords,
        insights: data.insights,
        demographics: data.demographics,
        regionalData: data.regionalData,
      });
      toast.success('Trend discovery complete!');
      
      // Save to history
      saveToHistory({
        tool: 'trend-hunter',
        keyword,
        contentType: 'trend-analysis',
        generatedContent: JSON.stringify({
          mainTrend: data.mainTrend,
          trends: data.trends,
          relatedKeywords: data.relatedKeywords,
          insights: data.insights,
          demographics: data.demographics,
          regionalData: data.regionalData
        }, null, 2),
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
      console.error('Trend Hunter error:', err);
    } finally {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      setLoading(false);
      setLoadingStage(0);
      setLoadingProgress(0);
    }
  };

  const getTrendIcon = (trend: 'rising' | 'falling' | 'stable') => {
    switch (trend) {
      case 'rising':
        return <ArrowUpCircle className="w-8 h-8 text-green-500" />;
      case 'falling':
        return <ArrowDownCircle className="w-8 h-8 text-red-500" />;
      default:
        return <MinusCircle className="w-8 h-8 text-[#ff7d00]" />;
    }
  };

  const getTrendColor = (growth: number) => {
    if (growth > 30) return 'text-green-600';
    if (growth > 0) return 'text-green-500';
    if (growth < -30) return 'text-red-600';
    if (growth < 0) return 'text-red-500';
    return 'text-[#ff7d00]';
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
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl text-[#001524]">Trend Hunter</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Industry or Niche
            </label>
            <Input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Fitness, Technology, Fashion"
              className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#15616d] mb-2">
                Time Range
              </label>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                disabled={loading}
              >
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#15616d] mb-2">
                Country
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
          </div>

          <button 
            onClick={handleDiscover}
            disabled={loading}
            className="w-full py-4 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Discovering Trends...
              </>
            ) : (
              'Discover Trends'
            )}
          </button>
        </div>
      </div>

      {/* Interactive Loading Display */}
      {loading && (
        <InteractiveLoading
          stages={TREND_HUNTER_STAGES}
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
        <>
          {/* Main Trend Overview */}
          {result.mainTrend && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#15616d] to-[#001524] rounded-2xl p-8 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl">Main Trend: {result.mainTrend.keyword}</h3>
                {getTrendIcon(result.mainTrend.trend)}
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-[#ffecd1] mb-1">Current</p>
                  <p className="text-2xl">{result.mainTrend.currentVolume}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-[#ffecd1] mb-1">Average</p>
                  <p className="text-2xl">{result.mainTrend.averageVolume}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-[#ffecd1] mb-1">Peak</p>
                  <p className="text-2xl">{result.mainTrend.peakVolume}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-[#ffecd1] mb-1">Growth</p>
                  <p className={`text-2xl ${result.mainTrend.growth > 0 ? 'text-green-300' : result.mainTrend.growth < 0 ? 'text-red-300' : ''}`}>
                    {result.mainTrend.growth > 0 ? '+' : ''}{result.mainTrend.growth.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-[#ffecd1] mb-2">Trend Status</p>
                <p className="text-lg capitalize">{result.mainTrend.trend} trend detected</p>
              </div>
            </motion.div>
          )}

          {/* Trending Topics */}
          {result.trends && result.trends.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-6 h-6 text-[#ff7d00]" />
                <h3 className="text-2xl text-[#001524]">Top Trending Keywords</h3>
              </div>
              <div className="space-y-3">
                {result.trends.map((trend, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#ffecd1] rounded-lg p-4 flex items-center justify-between border-2 border-[#ff7d00] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#ff7d00] rounded-full flex items-center justify-center text-white">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-[#001524]">{trend.keyword}</p>
                        <p className="text-sm text-[#15616d]">{trend.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg ${getTrendColor(trend.growth)}`}>
                        {trend.growth > 0 ? '↑' : trend.growth < 0 ? '↓' : '→'} {Math.abs(trend.growth).toFixed(1)}%
                      </p>
                      <p className="text-sm text-[#15616d]">{trend.volume.toLocaleString()} vol.</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related Keywords */}
          {result.relatedKeywords && result.relatedKeywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#ffecd1] rounded-xl p-6 border-2 border-[#ff7d00] shadow-xl"
            >
              <h3 className="text-xl text-[#001524] mb-4 text-center">Related Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.relatedKeywords.map((keyword, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-white border border-[#15616d] rounded-full text-[#001524] text-sm hover:bg-[#ff7d00] hover:text-white transition-colors cursor-pointer"
                  >
                    {typeof keyword === 'string' ? keyword : keyword.keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Demographics */}
          {result.demographics && result.demographics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-[#ff7d00]" />
                <h3 className="text-2xl text-[#001524]">Demographics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {result.demographics.slice(0, 6).map((demo, idx) => {
                  // Cap percentage at 100 to prevent UI breaking
                  const displayValue = Math.min(100, Math.max(0, demo.value));
                  return (
                    <div key={idx} className="bg-[#ffecd1] rounded-lg p-4">
                      <p className="text-sm text-[#15616d]">
                        {demo.age_range} • {demo.gender}
                      </p>
                      <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#ff7d00] h-full rounded-full"
                          style={{ width: `${displayValue}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#78290f] mt-1">{displayValue.toFixed(0)}% interest</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Regional Data */}
          {result.regionalData && result.regionalData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-6 h-6 text-[#ff7d00]" />
                <h3 className="text-2xl text-[#001524]">Regional Hotspots</h3>
              </div>
              <div className="space-y-3">
                {result.regionalData.slice(0, 10).map((region, idx) => {
                  // Cap percentage at 100 to prevent UI breaking
                  const displayValue = Math.min(100, Math.max(0, region.value));
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 text-[#15616d] text-sm">{idx + 1}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[#001524]">{region.location}</p>
                          <p className="text-sm text-[#ff7d00]">{displayValue.toFixed(0)}%</p>
                        </div>
                        <div className="bg-[#ffecd1] rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-[#ff7d00] h-full rounded-full"
                            style={{ width: `${displayValue}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-r from-[#ff7d00] to-[#78290f] rounded-2xl p-8 text-white shadow-xl"
          >
            <h3 className="text-2xl mb-6 text-center">Strategic Insights</h3>
            <div className="space-y-3">
              {result.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
                  <p className="text-[#ffecd1] leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
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