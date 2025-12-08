import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Youtube, TrendingUp, MousePointer } from 'lucide-react';
import { YouTubeSEO } from './marketing-intelligence/YouTubeSEO';
import { TrendHunter } from './marketing-intelligence/TrendHunter';
import { PPCSpy } from './marketing-intelligence/PPCSpy';

type TabType = 'youtube' | 'trends' | 'ppc';

interface MarketingIntelligenceProps {
  user?: any;
  onSignUpClick?: () => void;
  isDashboard?: boolean;
}

export const MarketingIntelligence: React.FC<MarketingIntelligenceProps> = ({ user, onSignUpClick, isDashboard }) => {
  const [activeTab, setActiveTab] = useState<TabType>('youtube');

  const tabs = [
    { id: 'youtube', label: 'YouTube SEO', icon: Youtube },
    { id: 'trends', label: 'Trend Hunter', icon: TrendingUp },
    { id: 'ppc', label: 'PPC Spy', icon: MousePointer },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-[#ff7d00] text-white shadow-lg'
                  : 'bg-white text-[#001524] border-2 border-[#15616d] hover:bg-[#ffecd1]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area - Each feature is now isolated */}
      <div className="space-y-8">
        {activeTab === 'youtube' && <YouTubeSEO user={user} onSignUpClick={onSignUpClick} isDashboard={isDashboard} />}
        {activeTab === 'trends' && <TrendHunter user={user} onSignUpClick={onSignUpClick} isDashboard={isDashboard} />}
        {activeTab === 'ppc' && <PPCSpy user={user} onSignUpClick={onSignUpClick} isDashboard={isDashboard} />}

        {/* Bottom Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#15616d] to-[#001524] border-2 border-[#ff7d00] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl mb-4">🎯 Marketing Intelligence Suite</h3>
            <p className="text-lg text-[#ffecd1] max-w-2xl mx-auto">
              CONTENTREX: The Platform for Content Authority and<br />Market Intelligence.
            </p>
            <p className="text-lg text-[#ffecd1] max-w-2xl mx-auto mt-4">
              Stay ahead of trends, spy on competitors, and predict viral success with our comprehensive marketing intelligence tools.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-[#ff7d00] rounded-full text-sm">Real-time Data</span>
              <span className="px-4 py-2 bg-[#ff7d00] rounded-full text-sm">AI-Powered</span>
              <span className="px-4 py-2 bg-[#ff7d00] rounded-full text-sm">Multi-Platform</span>
              <span className="px-4 py-2 bg-[#ff7d00] rounded-full text-sm">Actionable Insights</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};