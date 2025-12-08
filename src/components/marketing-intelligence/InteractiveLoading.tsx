import React from 'react';
import { motion } from 'motion/react';

interface Stage {
  emoji: string;
  title: string;
  description: string;
  fact: string;
}

interface InteractiveLoadingProps {
  stages: Stage[];
  currentStage: number;
  progress: number;
  timeEstimate?: string;
}

export const InteractiveLoading: React.FC<InteractiveLoadingProps> = ({
  stages,
  currentStage,
  progress,
  timeEstimate = '30-60 seconds',
}) => {
  const stage = stages[currentStage] || stages[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
    >
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {/* Time Estimate */}
        <div className="text-center mb-6">
          <p className="text-lg text-[#15616d]">⏱️ This may take {timeEstimate}...</p>
        </div>

        {/* Animated Stage Display */}
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-6xl mb-4">{stage.emoji}</div>
          <h3 className="text-2xl text-[#001524] mb-2">{stage.title}</h3>
          <p className="text-[#15616d]">{stage.description}</p>
        </motion.div>

        {/* Animated Progress Bar */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff7d00] via-[#15616d] to-[#ff7d00]"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </div>

        {/* Floating Particles */}
        <div className="flex justify-center gap-4 py-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#ff7d00]"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Fun Facts */}
        <motion.div
          key={`fact-${currentStage}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm text-gray-600 italic bg-[#ffecd1] rounded-lg p-3"
        >
          {stage.fact}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Predefined loading stages for each feature

export const YOUTUBE_SEO_STAGES: Stage[] = [
  {
    emoji: '🔍',
    title: 'Searching Top YouTube Videos...',
    description: 'Finding the best-performing videos in your niche...',
    fact: '💡 We analyze top 10 ranking videos for deep competitive insights!'
  },
  {
    emoji: '📹',
    title: 'Analyzing Video Metrics...',
    description: 'Extracting views, likes, comments, and engagement data...',
    fact: '💡 Did you know? We analyze real-time video performance across millions of data points!'
  },
  {
    emoji: '💎',
    title: 'Calculating Engagement Benchmarks...',
    description: 'Comparing metrics against industry standards...',
    fact: '💡 Pro tip: Higher engagement rates = better YouTube algorithm performance!'
  },
  {
    emoji: '🤖',
    title: 'Generating AI Recommendations...',
    description: 'Creating personalized optimization strategies with AI...',
    fact: '💡 Our AI creates personalized recommendations based on real data!'
  },
  {
    emoji: '🏆',
    title: 'Finalizing Report...',
    description: 'Compiling your complete YouTube SEO intelligence report...',
    fact: '💡 Almost there! Your complete SEO report is ready in seconds...'
  }
];

export const TREND_HUNTER_STAGES: Stage[] = [
  {
    emoji: '🔍',
    title: 'Searching Trending Topics...',
    description: 'Discovering emerging trends in your industry...',
    fact: '💡 We analyze Google Trends and search volume data in real-time!'
  },
  {
    emoji: '📊',
    title: 'Analyzing Search Volumes...',
    description: 'Calculating monthly search volumes and growth patterns...',
    fact: '💡 Did you know? We track trends across 112 countries!'
  },
  {
    emoji: '🌍',
    title: 'Mapping Regional Data...',
    description: 'Identifying geographic hotspots and demographics...',
    fact: '💡 Regional insights help you target the right audience!'
  },
  {
    emoji: '🤖',
    title: 'Generating AI Insights...',
    description: 'Creating actionable trend predictions with GPT-4o...',
    fact: '💡 Our AI detects patterns humans might miss!'
  },
  {
    emoji: '🏆',
    title: 'Compiling Trend Report...',
    description: 'Finalizing your comprehensive trend analysis...',
    fact: '💡 Stay ahead of the curve with data-driven insights!'
  }
];

export const PPC_SPY_STAGES: Stage[] = [
  {
    emoji: '🔍',
    title: 'Searching Competitor Ads...',
    description: 'Finding top-performing ad campaigns in your niche...',
    fact: '💡 We analyze real advertising data from across the web to find winning strategies!'
  },
  {
    emoji: '💰',
    title: 'Analyzing Ad Costs...',
    description: 'Calculating CPC, competition levels, and bid strategies...',
    fact: '💡 Did you know? Knowing competitor CPCs saves thousands on ad spend!'
  },
  {
    emoji: '📝',
    title: 'Extracting Ad Copy...',
    description: 'Collecting headlines, descriptions, and landing pages...',
    fact: '💡 Pro tip: Study winning ad formulas to boost your CTR!'
  },
  {
    emoji: '🤖',
    title: 'Generating Strategy Insights...',
    description: 'Creating competitive intelligence with AI analysis...',
    fact: '💡 Our AI identifies gaps in competitor strategies!'
  },
  {
    emoji: '🏆',
    title: 'Finalizing PPC Report...',
    description: 'Compiling your complete competitive intelligence report...',
    fact: '💡 Outsmart your competition with data-driven PPC insights!'
  }
];

export const MULTI_ENGINE_STAGES: Stage[] = [
  {
    emoji: '🔍',
    title: 'Querying Multiple Search Engines...',
    description: 'Searching Google, Bing, Yahoo, Baidu & more...',
    fact: '💡 We analyze up to 4 search engines simultaneously!'
  },
  {
    emoji: '📊',
    title: 'Comparing SERP Results...',
    description: 'Analyzing differences in rankings across platforms...',
    fact: '💡 Did you know? Rankings vary 30-40% across search engines!'
  },
  {
    emoji: '🌐',
    title: 'Calculating Cross-Engine Metrics...',
    description: 'Identifying ranking patterns and opportunities...',
    fact: '💡 Pro tip: Optimize for all engines to maximize visibility!'
  },
  {
    emoji: '🤖',
    title: 'Generating AI Analysis...',
    description: 'Creating cross-platform SEO strategies with AI...',
    fact: '💡 Our AI finds untapped opportunities in alternative search engines!'
  },
  {
    emoji: '🏆',
    title: 'Compiling Multi-Engine Report...',
    description: 'Finalizing your comprehensive search engine analysis...',
    fact: '💡 Dominate every search engine with data-driven strategies!'
  }
];