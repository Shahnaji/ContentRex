import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Youtube, Search, Sparkles, Zap } from 'lucide-react';
import { YouTubeSEOKeywords } from './YouTubeSEOKeywords';
import { YouTubeSEOLearnFromThis } from './YouTubeSEOLearnFromThis';
import { YouTubeSEOOptimizeVideo } from './YouTubeSEOOptimizeVideo';

type WorkflowMode = 'select' | 'keywords' | 'learn' | 'optimize';

interface YouTubeSEOProps {
  user?: any;
  onSignUpClick?: () => void;
  isDashboard?: boolean;
}

export const YouTubeSEO: React.FC<YouTubeSEOProps> = ({ user, onSignUpClick, isDashboard }) => {
  const [mode, setMode] = useState<WorkflowMode>('select');

  // Selection Screen
  if (mode === 'select') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#001524] via-[#15616d] to-[#001524] rounded-3xl p-10 text-white shadow-2xl text-center">
          <div className="w-16 h-16 bg-[#ff7d00] rounded-full flex items-center justify-center mx-auto mb-4">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl mb-3">YouTube SEO Intelligence</h1>
          <p className="text-lg text-[#ffecd1]">Choose what you want to analyze</p>
        </div>

        {/* Workflow Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Keywords Intelligence */}
          <motion.button
            onClick={() => setMode('keywords')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white border-4 border-[#15616d] rounded-2xl p-8 shadow-xl hover:border-[#ff7d00] transition-all text-center group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl text-[#001524] mb-3">Keyword Intelligence</h3>
            <p className="text-sm text-[#15616d] mb-4">
              Discover trending keywords, analyze competition, and find content gaps
            </p>
            <div className="flex flex-col gap-2 text-xs text-[#15616d]">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Top performing videos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Keyword recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Video topic suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Engagement benchmarks</span>
              </div>
            </div>
            <div className="mt-6 py-2 bg-[#ff7d00] text-white rounded-lg group-hover:bg-[#78290f] transition-colors">
              Start Analysis
            </div>
          </motion.button>

          {/* Learn From This */}
          <motion.button
            onClick={() => setMode('learn')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white border-4 border-[#15616d] rounded-2xl p-8 shadow-xl hover:border-[#ff7d00] transition-all text-center group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#15616d] to-[#001524] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl text-[#001524] mb-3">Learn From This</h3>
            <p className="text-sm text-[#15616d] mb-4">
              Analyze a successful competitor video to learn what's working
            </p>
            <div className="flex flex-col gap-2 text-xs text-[#15616d]">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Performance breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Winning title & tags</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Keywords they rank for</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Similar top videos</span>
              </div>
            </div>
            <div className="mt-6 py-2 bg-[#15616d] text-white rounded-lg group-hover:bg-[#001524] transition-colors">
              Analyze Competitor
            </div>
          </motion.button>

          {/* Optimize This Video */}
          <motion.button
            onClick={() => setMode('optimize')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white border-4 border-[#15616d] rounded-2xl p-8 shadow-xl hover:border-[#ff7d00] transition-all text-center group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl text-[#001524] mb-3">Optimize This Video</h3>
            <p className="text-sm text-[#15616d] mb-4">
              Get actionable fixes to improve your video's performance
            </p>
            <div className="flex flex-col gap-2 text-xs text-[#15616d]">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Health check score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Critical issues detected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Copy-paste fixes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Action checklist</span>
              </div>
            </div>
            <div className="mt-6 py-2 bg-[#ff7d00] text-white rounded-lg group-hover:bg-[#78290f] transition-colors">
              Optimize My Video
            </div>
          </motion.button>
        </div>

        {/* Back to all tools note */}
        <div className="text-center text-sm text-[#15616d]">
          <p>💡 Each workflow is independent and optimized for its specific use case</p>
        </div>
      </motion.div>
    );
  }

  // Show selected workflow with back button
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setMode('select')}
        className="flex items-center gap-2 text-[#15616d] hover:text-[#ff7d00] transition-colors"
      >
        <span>←</span>
        <span>Back to workflow selection</span>
      </button>

      {/* Render selected workflow */}
      {mode === 'keywords' && <YouTubeSEOKeywords user={user} onSignUpClick={onSignUpClick} isDashboard={isDashboard} />}
      {mode === 'learn' && <YouTubeSEOLearnFromThis user={user} onSignUpClick={onSignUpClick} isDashboard={isDashboard} />}
      {mode === 'optimize' && <YouTubeSEOOptimizeVideo user={user} onSignUpClick={onSignUpClick} isDashboard={isDashboard} />}
    </div>
  );
};