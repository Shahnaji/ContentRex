import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MousePointer, Loader2, DollarSign, Target, TrendingUp, Zap, Code, FileText, Users, Clock, HelpCircle, Lightbulb } from 'lucide-react';
import { Input } from '../ui/input';
import { countries } from '../../utils/countries';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { InteractiveLoading, PPC_SPY_STAGES } from './InteractiveLoading';
import { getRemainingFreeUsage, hasReachedFreeLimit, incrementUsage } from '../../utils/usageTracking';
import { UsageLimitModal } from '../UsageLimitModal';
import { saveToHistory } from '../HistoryTab';

interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: number;
  cpc: number;
}

interface PlatformData {
  keywords: KeywordData[];
}

interface TechData {
  name: string;
  category: string;
}

interface AnalysisProfile {
  isActive: boolean;
  platforms: string[];
  totalKeywords: number;
  estimatedMonthlyBudget: number;
  topCategories: string[];
}

interface Analysis {
  profile: AnalysisProfile;
  insights: string[];
  recommendations: string[];
}

interface AdCopy {
  keyword: string;
  headline: string;
  description: string;
  url: string;
  domain: string;
  position: number;
}

interface Competitor {
  domain: string;
  sharedKeywords: number;
  keywords: string[];
  avgCPC: number;
  estimatedOverlap: number;
}

interface HistoricalTrend {
  keyword: string;
  currentVolume: number;
  monthlyData: Array<{
    month: number;
    year: number;
    volume: number;
  }>;
  trendDirection: 'rising' | 'falling' | 'stable';
  trendPercentage: number;
}

interface PPCSpyResult {
  domain: string;
  google: PlatformData | null;
  techStack: {
    marketing: TechData[];
    analytics: TechData[];
    advertising: TechData[];
    all: {
      [category: string]: TechData[] | { [subcategory: string]: TechData[] };
    };
  } | null;
  analysis: Analysis;
  adCopyData: AdCopy[] | null;
  topCompetitors: Competitor[] | null;
  historicalTrends: HistoricalTrend[] | null;
}

interface PPCSpyProps {
  user?: any;
  onSignUpClick?: () => void;
  isDashboard?: boolean;
}

export const PPCSpy: React.FC<PPCSpyProps> = ({ user, onSignUpClick, isDashboard }) => {
  const [domain, setDomain] = useState('');
  const [platform, setPlatform] = useState('google');
  const [country, setCountry] = useState('us');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<PPCSpyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);

  const handleSpy = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a competitor domain');
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
    }, 8000); // Change stage every 8 seconds

    progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 600); // Update progress every 600ms

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/ppc-spy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ domain, platform, country }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to spy on competitor ads');
      }

      const data = await response.json();
      setResult(data);
      toast.success('PPC analysis complete!');
      
      // Save to history
      saveToHistory({
        tool: 'ppc-spy',
        keyword: domain,
        contentType: 'ppc-competitor-analysis',
        generatedContent: JSON.stringify(data, null, 2),
        metadata: {
          country,
          platform
        }
      });
      
      // Increment usage for non-authenticated users
      if (!user) {
        incrementUsage();
      }

      // Save to history for authenticated users
      if (user) {
        saveToHistory({
          type: 'PPC Spy',
          domain,
          platform,
          country,
          result: data,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('PPC Spy error:', err);
    } finally {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      setLoading(false);
      setLoadingStage(0);
      setLoadingProgress(0);
    }
  };

  const getCompetitionColor = (competition: number) => {
    if (competition > 0.7) return 'text-red-600';
    if (competition > 0.4) return 'text-orange-500';
    return 'text-green-600';
  };

  const getCompetitionLabel = (competition: number) => {
    if (competition > 0.7) return 'High';
    if (competition > 0.4) return 'Medium';
    return 'Low Competition';
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
            <MousePointer className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl text-[#001524]">PPC Spy Tool</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#15616d] mb-2">
              Competitor Domain
            </label>
            <Input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., example.com or competitor.io"
              className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#15616d] mb-2">
                Ad Platform
              </label>
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                disabled={loading}
              >
                <option value="google">Google Ads</option>
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
            onClick={handleSpy}
            disabled={loading}
            className="w-full py-4 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing PPC Strategy...
              </>
            ) : (
              'Spy on Competitor Ads'
            )}
          </button>
        </div>
      </div>

      {/* Interactive Loading Display */}
      {loading && (
        <InteractiveLoading
          stages={PPC_SPY_STAGES}
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
          {/* Competitor Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#15616d] to-[#001524] rounded-2xl p-8 text-white shadow-xl"
          >
            <h3 className="text-2xl mb-6">Competitor Profile: {result.domain}</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-[#ffecd1]" />
                <p className="text-sm text-[#ffecd1] mb-1">Keywords</p>
                <p className="text-xl">{result.analysis.profile.totalKeywords}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-[#ffecd1]" />
                <p className="text-sm text-[#ffecd1] mb-1">Platforms</p>
                <p className="text-xl">{result.analysis.profile.platforms.length}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#ffecd1]" />
                <p className="text-sm text-[#ffecd1] mb-1">Status</p>
                <p className="text-xl">{result.analysis.profile.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>

            {result.analysis.profile.platforms.length > 0 && (
              <div className="mt-4 bg-white/5 rounded-lg p-4">
                <p className="text-sm text-[#ffecd1]">Active on: {result.analysis.profile.platforms.join(', ')}</p>
              </div>
            )}
          </motion.div>

          {/* Google Ads Keywords */}
          {result.google && result.google.keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-[#ff7d00]" />
                <h3 className="text-2xl text-[#001524]">Google Ads Keywords</h3>
              </div>

              {/* Keywords Grid - 2 per row */}
              <div className="grid grid-cols-2 gap-4">
                {result.google.keywords.slice(0, 15).map((kw, idx) => (
                  <div 
                    key={idx}
                    className="p-5 bg-gradient-to-br from-[#ffecd1] to-[#ffecd1]/70 rounded-xl border-l-4 border-[#ff7d00] hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-7 h-7 bg-[#ff7d00] rounded-full flex items-center justify-center text-white text-xs">
                          {idx + 1}
                        </div>
                        <span className="text-[#001524] font-medium truncate">{kw.keyword}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getCompetitionColor(kw.competition)} bg-white shadow-sm ml-2`}>
                        {getCompetitionLabel(kw.competition)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#15616d]/20">
                      <div className="text-center">
                        <p className="text-xs text-[#15616d] mb-1">Search Volume</p>
                        <p className="text-lg text-[#001524] font-semibold">{kw.searchVolume.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#15616d] mb-1">CPC</p>
                        <p className="text-lg text-[#ff7d00] font-semibold">${kw.cpc.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* REMOVED: Tech Stack */}
          {false && result.techStack && result.techStack.all && Object.keys(result.techStack.all).length > 0 && (() => {
            // Extract ALL tech categories dynamically (not just marketing/analytics/advertising)
            const allCategories = result.techStack.all;
            const hasAnyTech = Object.values(allCategories).some((category: any) => 
              Array.isArray(category) ? category.length > 0 : Object.keys(category).length > 0
            );
            
            return hasAnyTech ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Code className="w-6 h-6 text-[#ff7d00]" />
                  <h3 className="text-2xl text-[#001524]">Tech Stack</h3>
                  <span className="px-3 py-1 bg-[#ff7d00] text-white text-xs rounded-full">PREMIUM</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(allCategories).map(([categoryName, techList]: [string, any]) => {
                    // Handle both object (with subcategories) and array formats
                    const isObject = !Array.isArray(techList);
                    const items: any[] = [];
                    
                    if (isObject) {
                      // Extract items from subcategories (e.g., servers.cdn, security.security)
                      Object.values(techList).forEach((subList: any) => {
                        if (Array.isArray(subList)) {
                          items.push(...subList);
                        }
                      });
                    } else {
                      items.push(...techList);
                    }
                    
                    if (items.length === 0) return null;
                    
                    return (
                      <div key={categoryName}>
                        <h4 className="text-sm font-semibold text-[#15616d] mb-3 capitalize">
                          {categoryName}
                        </h4>
                        <div className="space-y-2">
                          {items.slice(0, 5).map((tech, idx) => (
                            <div key={idx} className="px-3 py-2 bg-[#ffecd1] rounded text-sm text-[#001524] flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#ff7d00]"></div>
                              {typeof tech === 'string' ? tech : tech.name || 'Unknown'}
                            </div>
                          ))}
                          {items.length > 5 && (
                            <p className="text-xs text-[#78290f] mt-2">+{items.length - 5} more</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null;
          })()}

          {/* REMOVED: Ad Copy Intelligence */}
          {false && result.adCopyData && result.adCopyData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-6 h-6 text-[#ff7d00]" />
                <h3 className="text-2xl text-[#001524]">Ad Copy Intelligence</h3>
                <span className="ml-auto px-3 py-1 bg-[#ff7d00] text-white rounded-full text-xs">PREMIUM</span>
              </div>
              
              <div className="space-y-4">
                {result.adCopyData.map((ad, idx) => (
                  <div 
                    key={idx}
                    className="p-5 bg-gradient-to-r from-[#ffecd1] to-[#ffecd1]/50 rounded-lg border-l-4 border-[#ff7d00] hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-[#ff7d00] text-white rounded text-xs">Position {ad.position}</span>
                          <span className="text-xs text-[#15616d]">Keyword: "{ad.keyword}"</span>
                        </div>
                        <h4 className="text-lg text-[#001524] mb-2">{ad.headline}</h4>
                        <p className="text-sm text-[#15616d] mb-3">{ad.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#15616d]/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#78290f]">Landing Page:</span>
                        <a 
                          href={ad.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-[#ff7d00] hover:underline truncate max-w-md"
                        >
                          {ad.url}
                        </a>
                      </div>
                      <span className="text-xs text-[#15616d]">{ad.domain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Top Competitors */}
          {result.topCompetitors && result.topCompetitors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-[#ff7d00]" />
                <h3 className="text-2xl text-[#001524]">Top Competitors</h3>
                <span className="ml-auto px-3 py-1 bg-[#ff7d00] text-white rounded-full text-xs">PREMIUM</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {result.topCompetitors.map((comp, idx) => {
                  const estimatedCost = comp.avgCPC * comp.sharedKeywords;
                  return (
                    <div 
                      key={idx}
                      className="p-5 bg-gradient-to-br from-[#ffecd1] to-[#ffecd1]/70 rounded-xl border-2 border-[#ff7d00] hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                          #{idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg text-[#001524] font-semibold">{comp.domain}</p>
                          <p className="text-xs text-[#15616d]">
                            {comp.sharedKeywords} keywords • {comp.estimatedOverlap}% overlap
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-[#15616d]/20">
                        <div className="text-center bg-white/60 rounded-lg p-2">
                          <p className="text-xs text-[#78290f] mb-1">Avg CPC</p>
                          <p className="text-base text-[#ff7d00] font-bold">${comp.avgCPC.toFixed(2)}</p>
                        </div>
                        <div className="text-center bg-white/60 rounded-lg p-2">
                          <p className="text-xs text-[#78290f] mb-1">Est. Cost</p>
                          <p className="text-base text-[#ff7d00] font-bold">${estimatedCost.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-[#15616d] mb-2 font-medium">Top Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {comp.keywords.slice(0, 3).map((kw, kidx) => (
                            <span 
                              key={kidx}
                              className="px-2.5 py-1 bg-white text-[#001524] rounded-full text-xs border border-[#15616d]/30 shadow-sm font-medium"
                            >
                              {kw}
                            </span>
                          ))}
                          {comp.keywords.length > 3 && (
                            <span className="px-2.5 py-1 text-[#78290f] text-xs font-medium">
                              +{comp.keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 🔥 FEATURE 3: Historical Trends */}
          {result.historicalTrends && result.historicalTrends.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-[#ff7d00]" />
                <h3 className="text-2xl text-[#001524]">Historical Trends</h3>
                <span className="ml-auto px-3 py-1 bg-[#ff7d00] text-white rounded-full text-xs">PREMIUM</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {result.historicalTrends.map((trend, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-gradient-to-br from-[#ffecd1] to-[#ffecd1]/70 rounded-xl border-l-4 border-[#ff7d00]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-lg text-[#001524] font-semibold">{trend.keyword}</p>
                        <p className="text-xs text-[#15616d]">
                          Volume: {trend.currentVolume.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1.5 ${
                          trend.trendDirection === 'rising' ? 'text-green-600' : 
                          trend.trendDirection === 'falling' ? 'text-red-600' : 
                          'text-[#ff7d00]'
                        }`}>
                          {trend.trendDirection === 'rising' && <TrendingUp className="w-4 h-4" />}
                          {trend.trendDirection === 'falling' && <TrendingUp className="w-4 h-4 rotate-180" />}
                          {trend.trendDirection === 'stable' && <span className="w-4 h-0.5 bg-[#ff7d00]" />}
                          <span className="text-base font-bold">
                            {trend.trendPercentage > 0 ? '+' : ''}{trend.trendPercentage}%
                          </span>
                        </div>
                        <p className="text-xs text-[#15616d] capitalize">{trend.trendDirection}</p>
                      </div>
                    </div>
                    
                    {/* Mini chart visualization - Compact with no extra spacing */}
                    <div className="flex items-end gap-0.5 h-12">
                      {trend.monthlyData.slice(-6).map((month, midx) => {
                        const maxVolume = Math.max(...trend.monthlyData.slice(-6).map(m => m.volume));
                        const height = maxVolume > 0 ? (month.volume / maxVolume) * 100 : 0;
                        return (
                          <div key={midx} className="flex-1">
                            <div 
                              className="w-full bg-gradient-to-t from-[#ff7d00] to-[#ff7d00]/70 rounded-t"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Strategic Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl text-[#001524]">Strategic Insights</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Findings */}
              <div className="bg-gradient-to-br from-[#ffecd1] to-[#ffecd1]/50 rounded-xl p-6 border-2 border-[#15616d]">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-[#15616d]/20">
                  <div className="w-8 h-8 bg-[#15616d] rounded-full flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-xl text-[#001524] font-semibold">Key Findings</h4>
                </div>
                <ul className="space-y-3">
                  {result.analysis.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-[#15616d]/10">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#15616d] to-[#001524] rounded-full flex items-center justify-center mt-0.5 shadow-sm">
                        <span className="text-white text-xs font-semibold">{idx + 1}</span>
                      </div>
                      <span className="text-[#001524] leading-relaxed text-sm">
                        {insight.replace(/^[🔍📊💰👥📈📉⚡✨💡🎯🔔❗💸🌟⭐🎁📌🎉💎🚀🏆]+\s*/, '')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-br from-[#ff7d00]/10 to-[#ff7d00]/5 rounded-xl p-6 border-2 border-[#ff7d00]">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-[#ff7d00]/30">
                  <div className="w-8 h-8 bg-[#ff7d00] rounded-full flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-xl text-[#001524] font-semibold">Recommendations</h4>
                </div>
                <ul className="space-y-3">
                  {result.analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-[#ff7d00]/20">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center mt-0.5 shadow-sm">
                        <Lightbulb className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[#001524] leading-relaxed text-sm">
                        {rec}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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