import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  BarChart3, 
  LogOut, 
  User, 
  FileText, 
  TrendingUp,
  Calendar,
  Zap,
  CreditCard,
  Settings
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { ContentGenerator } from './ContentGenerator';
import { MarketingIntelligence } from './MarketingIntelligence';
import { HistoryTab } from './HistoryTab';
import { BillingTab } from './BillingTab';
import { SettingsTab } from './SettingsTab';
import { toast } from 'sonner';

interface DashboardProps {
  onSignOut: () => void;
}

export function Dashboard({ onSignOut }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'marketing' | 'history' | 'billing' | 'settings'>('content');
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  // Determine which features user has access to based on plan
  const userPlan = user?.plan || 'free';
  const hasContentGenerator = userPlan === 'creator_pro' || userPlan === 'rex_elite' || userPlan === 'free';
  const hasMarketingIntelligence = userPlan === 'strategist_pro' || userPlan === 'rex_elite' || userPlan === 'free';

  useEffect(() => {
    if (user?.trialEndsAt) {
      const endDate = new Date(user.trialEndsAt);
      const now = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setTrialDaysLeft(Math.max(0, daysLeft));
    }
  }, [user]);

  // Set default active tab based on user's plan
  useEffect(() => {
    if (hasContentGenerator && !hasMarketingIntelligence) {
      setActiveTab('content');
    } else if (hasMarketingIntelligence && !hasContentGenerator) {
      setActiveTab('marketing');
    }
  }, [hasContentGenerator, hasMarketingIntelligence]);

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out successfully');
    onSignOut();
  }

  const isTrialActive = trialDaysLeft > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#ffecd1]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#15616d] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#001524] tracking-tight">ContentRex AI</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Trial Status */}
              {isTrialActive && (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{trialDaysLeft} days left in trial</span>
                </div>
              )}

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-[#001524]">{user?.name || 'User'}</p>
                  <p className="text-xs text-[#15616d]">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-[#15616d] hover:text-[#ff7d00] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trial Banner (Mobile) */}
      {isTrialActive && (
        <div className="sm:hidden bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white py-2 px-4 text-center">
          <p className="text-sm">{trialDaysLeft} days left in your free trial</p>
        </div>
      )}

      {/* Trial Ended Banner */}
      {!isTrialActive && user?.plan === 'free' && (
        <div className="bg-[#001524] text-white py-4 px-4 text-center">
          <p className="text-lg mb-2">Your free trial has ended</p>
          <p className="text-sm text-[#ffecd1] mb-3">Upgrade to continue using ContentRex AI</p>
          <button className="px-6 py-2 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity">
            View Pricing Plans
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b-2 border-[#15616d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {hasContentGenerator && (
              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === 'content'
                    ? 'border-[#ff7d00] text-[#ff7d00]'
                    : 'border-transparent text-[#15616d] hover:text-[#ff7d00]'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>Content Generator</span>
              </button>
            )}
            {hasMarketingIntelligence && (
              <button
                onClick={() => setActiveTab('marketing')}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === 'marketing'
                    ? 'border-[#ff7d00] text-[#ff7d00]'
                    : 'border-transparent text-[#15616d] hover:text-[#ff7d00]'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Marketing Intelligence</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-[#ff7d00] text-[#ff7d00]'
                  : 'border-transparent text-[#15616d] hover:text-[#ff7d00]'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>History</span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'billing'
                  ? 'border-[#ff7d00] text-[#ff7d00]'
                  : 'border-transparent text-[#15616d] hover:text-[#ff7d00]'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Billing</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#ff7d00] text-[#ff7d00]'
                  : 'border-transparent text-[#15616d] hover:text-[#ff7d00]'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl text-[#001524] mb-2 tracking-tight">Content Generator</h1>
              <p className="text-[#15616d]">
                Create SEO-optimized content across 28 formats with our 3-stage refinement system
              </p>
            </div>
            <ContentGenerator isDashboard={true} />
          </motion.div>
        )}

        {activeTab === 'marketing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl text-[#001524] mb-2 tracking-tight">Marketing Intelligence</h1>
              <p className="text-[#15616d]">
                Analyze competitors, track trends, and optimize your YouTube content
              </p>
            </div>
            <MarketingIntelligence isDashboard={true} />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HistoryTab />
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BillingTab user={user} />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SettingsTab user={user} onSignOut={onSignOut} />
          </motion.div>
        )}
      </div>
    </div>
  );
}