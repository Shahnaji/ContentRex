import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, FileText, Menu, X, Zap, Target, TrendingUp, BarChart3 } from 'lucide-react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Dashboard } from './components/Dashboard';
import { ContentGenerator } from './components/ContentGenerator';
import { MarketingIntelligence } from './components/MarketingIntelligence';
import { Pricing } from './components/Pricing';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Privacy } from './components/Privacy';
import { Terms } from './components/Terms';
import { Refund } from './components/Refund';
import { FAQ } from './components/FAQ';
import { Toaster } from './components/ui/sonner';
import { 
  WhatIsContentRex, 
  HowAIWorks, 
  ComprehensiveFAQ 
} from './components/SEOHomepageSections';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'content' | 'marketing' | 'pricing' | 'how-it-works' | 'features' | 'privacy' | 'terms' | 'refund' | 'faq' | 'signin' | 'signup' | 'dashboard'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize page from URL hash on mount
  React.useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    const validPages = ['home', 'content', 'marketing', 'pricing', 'how-it-works', 'features', 'privacy', 'terms', 'refund', 'faq', 'signin', 'signup', 'dashboard'];
    
    if (hash && validPages.includes(hash)) {
      setCurrentPage(hash as typeof currentPage);
    }
  }, []);

  // Scroll to top when page changes
  const handlePageChange = (page: typeof currentPage) => {
    setCurrentPage(page);
    window.location.hash = page; // Update URL hash
    window.scrollTo(0, 0);
  };

  // Listen for hash changes (browser back/forward buttons)
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const validPages = ['home', 'content', 'marketing', 'pricing', 'how-it-works', 'features', 'privacy', 'terms', 'refund', 'faq', 'signin', 'signup', 'dashboard'];
      
      if (hash && validPages.includes(hash)) {
        setCurrentPage(hash as typeof currentPage);
        window.scrollTo(0, 0);
      } else if (!hash) {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If user is logged in and on home/signin/signup, redirect to dashboard
  React.useEffect(() => {
    if (user && !loading && (currentPage === 'home' || currentPage === 'signin' || currentPage === 'signup')) {
      setCurrentPage('dashboard');
    }
  }, [user, loading, currentPage]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#ffecd1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-[#15616d]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages
  if (currentPage === 'signin') {
    return <SignIn onSwitchToSignUp={() => handlePageChange('signup')} onSuccess={() => handlePageChange('dashboard')} />;
  }

  if (currentPage === 'signup') {
    return <SignUp onSwitchToSignIn={() => handlePageChange('signin')} onSuccess={() => handlePageChange('dashboard')} />;
  }

  // Show dashboard if logged in
  if (currentPage === 'dashboard' && user) {
    return <Dashboard onSignOut={() => handlePageChange('home')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      {/* Simple Header */}
      <header className="border-b-2 border-[#15616d] bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handlePageChange('home')}>
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#001524] tracking-tight">ContentRex AI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => handlePageChange('content')}
                className="text-[#15616d] hover:text-[#ff7d00] transition-colors"
              >
                Content Generator
              </button>
              <button 
                onClick={() => handlePageChange('marketing')}
                className="text-[#15616d] hover:text-[#ff7d00] transition-colors"
              >
                Marketing Intelligence
              </button>
              <button 
                onClick={() => handlePageChange('features')}
                className="text-[#15616d] hover:text-[#ff7d00] transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => handlePageChange('pricing')}
                className="text-[#15616d] hover:text-[#ff7d00] transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => handlePageChange('how-it-works')}
                className="text-[#15616d] hover:text-[#ff7d00] transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => user ? handlePageChange('dashboard') : handlePageChange('signin')}
                className="px-5 py-2 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {user ? 'Dashboard' : 'Sign in'}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-[#15616d]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t-2 border-[#15616d]">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { handlePageChange('content'); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-[#15616d] hover:text-[#ff7d00]"
                >
                  Content Generator
                </button>
                <button 
                  onClick={() => { handlePageChange('marketing'); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-[#15616d] hover:text-[#ff7d00]"
                >
                  Marketing Intelligence
                </button>
                <button 
                  onClick={() => { handlePageChange('features'); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-[#15616d] hover:text-[#ff7d00]"
                >
                  Features
                </button>
                <button 
                  onClick={() => { handlePageChange('pricing'); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-[#15616d] hover:text-[#ff7d00]"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => { handlePageChange('how-it-works'); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-[#15616d] hover:text-[#ff7d00]"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => { 
                    user ? handlePageChange('dashboard') : handlePageChange('signin'); 
                    setMobileMenuOpen(false); 
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 mt-2"
                >
                  {user ? 'Dashboard' : 'Sign in'}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Home Page */}
      {currentPage === 'home' && (
        <>
          {/* Hero Section */}
          <section className="py-20 sm:py-32">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1 
                className="text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#001524] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">CONTENT AUTHORITY MARKET VELOCITY</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl sm:text-2xl text-[#15616d] max-w-3xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Go Beyond Generation: Build Content Authority with AI-Driven Content and Real-Time Strategic Intelligence.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <button 
                  onClick={() => handlePageChange('content')}
                  className="px-8 py-4 bg-[#001524] text-white rounded-lg hover:bg-[#15616d] transition-colors text-lg"
                >
                  Start Creating Content
                </button>
                <button 
                  onClick={() => handlePageChange('marketing')}
                  className="px-8 py-4 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity text-lg shadow-lg"
                >
                  Explore Intelligence Tools
                </button>
              </motion.div>
            </div>
          </section>

          {/* Tools Cards */}
          <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl text-[#001524] mb-4 tracking-tight">
                  CONTENTREX: The Platform for Content Authority<br />and Market Intelligence.
                </h2>
                <p className="text-xl text-[#15616d] max-w-3xl mx-auto">
                  Stop creating content that disappears into the void. Build lasting authority with data-driven content and competitive intelligence that puts you ahead of your market.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Content Generator Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border-2 border-[#15616d] rounded-2xl p-8 sm:p-12 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePageChange('content')}
                >
                  <div className="w-16 h-16 bg-[#001524] rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl text-[#001524] mb-4 tracking-tight">
                    Content Generator
                  </h3>
                  <p className="text-[#15616d] text-lg mb-6">
                    Transform keywords into ranking content. Our 3-stage refinement system analyzes, optimizes, and perfects every piece until it earns 80+ SEO scores.
                  </p>
                  <ul className="space-y-3 text-[#15616d]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#ff7d00] mt-1">✓</span>
                      <span>Generate or repurpose across 28 formats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ff7d00] mt-1">✓</span>
                      <span>5 proven copywriting frameworks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ff7d00] mt-1">✓</span>
                      <span>112-country localization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ff7d00] mt-1">✓</span>
                      <span>Real-time SERP analysis</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Marketing Intelligence Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-[#ff7d00] to-[#78290f] border-2 border-[#15616d] rounded-2xl p-8 sm:p-12 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePageChange('marketing')}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-8 h-8 text-[#ff7d00]" />
                  </div>
                  <h3 className="text-3xl text-white mb-4 tracking-tight">
                    Marketing Intelligence
                  </h3>
                  <p className="text-[#ffecd1] text-lg mb-6">
                    See what your competitors can't hide. Track trending topics, decode PPC strategies, and reverse-engineer top-performing YouTube videos—all in real time.
                  </p>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-2">
                      <span className="text-[#ffecd1] mt-1">✓</span>
                      <span>YouTube SEO reverse engineering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ffecd1] mt-1">✓</span>
                      <span>Emerging trend detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ffecd1] mt-1">✓</span>
                      <span>Competitor PPC campaign analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ffecd1] mt-1">✓</span>
                      <span>Multi-engine SERP tracking</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl text-[#001524] mb-4 tracking-tight">
                  Trusted by marketers worldwide
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: '28', label: 'Content Types' },
                  { number: '112', label: 'Countries Supported' },
                  { number: '5', label: 'Copywriting Frameworks' },
                  { number: '24/7', label: 'AI Powered' }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f] mb-2 tracking-tight">
                      {stat.number}
                    </div>
                    <div className="text-[#15616d]">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl text-[#001524] mb-4 tracking-tight">
                  Everything you need
                </h2>
                <p className="text-xl text-[#15616d]">
                  Powerful features to create and optimize your content
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: '⚡',
                    title: 'Lightning Fast',
                    description: 'Generate comprehensive content and insights in seconds, not hours.'
                  },
                  {
                    icon: '🌍',
                    title: 'Global Reach',
                    description: 'Support for 112 countries with localized content generation.'
                  },
                  {
                    icon: '📊',
                    title: 'Marketing Intelligence',
                    description: 'YouTube SEO, trend hunting, PPC spy, and viral prediction tools.'
                  },
                  {
                    icon: '✨',
                    title: 'AI Copywriting',
                    description: 'Multiple frameworks: AIDA, PAS, BAB, 4Ps, and FAB.'
                  },
                  {
                    icon: '🔄',
                    title: 'Repurpose Content',
                    description: 'Transform content across platforms: blog, social, email, ads.'
                  },
                  {
                    icon: '🎯',
                    title: 'SEO Optimized',
                    description: 'Advanced improvement process for 80+ SEO scores guaranteed.'
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-white to-[#ffecd1] border-2 border-[#15616d] rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl text-[#001524] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#15616d]">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* AEO/SEO Optimized Content Sections */}
          <WhatIsContentRex />
          <HowAIWorks />
          <ComprehensiveFAQ setCurrentPage={handlePageChange} />

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-[#15616d] to-[#001524]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-6xl text-white mb-6 tracking-tight">
                  Ready to supercharge your marketing?
                </h2>
                <p className="text-xl text-[#ffecd1] mb-8">
                  Start generating amazing content today. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handlePageChange('content')}
                    className="px-8 py-4 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity text-lg shadow-xl"
                  >
                    Get Started Free
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* Content Generator Page */}
      {currentPage === 'content' && (
        <section className="py-12 bg-gradient-to-br from-white to-[#ffecd1] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-4xl">✨</span>
                <h1 className="text-4xl sm:text-5xl text-[#001524] tracking-tight">
                  The Rex Engine: Content Authority, Automated
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className="px-4 py-2 bg-white border-2 border-[#15616d] rounded-full text-sm text-[#001524]">
                  ⚡ Fast
                </span>
                <span className="px-4 py-2 bg-white border-2 border-[#15616d] rounded-full text-sm text-[#001524]">
                  🎯 Accurate
                </span>
                <span className="px-4 py-2 bg-white border-2 border-[#15616d] rounded-full text-sm text-[#001524]">
                  ✅ Easy
                </span>
                <span className="px-4 py-2 bg-white border-2 border-[#15616d] rounded-full text-sm text-[#001524]">
                  🌍 Global
                </span>
              </div>
              <p className="text-xl text-[#15616d] max-w-3xl mx-auto mb-8">
                Beat the blank page 📝 and dominate the SERP 🏆. Leverage next-generation AI ⚡ to instantly create high-quality, SEO-optimized copy ✨ for every channel—from long-form articles that rank 📈 to high-converting ad copy 💰 and a continuous stream of social media posts 📱. Scale your brand voice effortlessly 🚀
              </p>
            </motion.div>
            <ContentGenerator user={user} onSignUpClick={() => handlePageChange('signup')} />
          </div>
        </section>
      )}

      {/* Marketing Intelligence Page */}
      {currentPage === 'marketing' && (
        <section className="py-12 bg-gradient-to-br from-[#ffecd1] to-white min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h1 className="text-4xl sm:text-5xl text-[#001524] tracking-tight mb-4">
                CONQUER THE MARKET: AI-Driven Strategic Insight
              </h1>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="px-4 py-2 bg-[#ffecd1] text-[#001524] rounded-full border border-[#ff7d00]">
                  🎯 Strategic
                </span>
                <span className="px-4 py-2 bg-[#ffecd1] text-[#001524] rounded-full border border-[#ff7d00]">
                  🔥 Real-Time
                </span>
                <span className="px-4 py-2 bg-[#ffecd1] text-[#001524] rounded-full border border-[#ff7d00]">
                  💪 Powerful
                </span>
                <span className="px-4 py-2 bg-[#ffecd1] text-[#001524] rounded-full border border-[#ff7d00]">
                  🌍 Global
                </span>
              </div>
              <p className="text-xl text-[#15616d] max-w-3xl mx-auto mb-8">
                Go from informed to dominant 📊➡️👑 CONTENTREX delivers a holistic, real-time view ⚡ of your competitive landscape. Instantly uncover viral trends 🔥, spy on rivals' winning PPC campaigns 🔍, and optimize your YouTube videos 🎥 for algorithmic dominance 🎯. Stop reacting to the market—start leading it 🚀
              </p>
            </motion.div>
            <MarketingIntelligence user={user} onSignUpClick={() => handlePageChange('signup')} />
          </div>
        </section>
      )}

      {/* Pricing Page */}
      {currentPage === 'pricing' && (
        <section className="bg-gradient-to-br from-white to-[#ffecd1] min-h-screen">
          <Pricing setCurrentPage={handlePageChange} />
        </section>
      )}

      {/* How It Works Page */}
      {currentPage === 'how-it-works' && (
        <section className="bg-white min-h-screen">
          <HowItWorks setCurrentPage={handlePageChange} />
        </section>
      )}

      {/* Features Page */}
      {currentPage === 'features' && (
        <section className="bg-white min-h-screen">
          <Features setCurrentPage={handlePageChange} />
        </section>
      )}

      {/* Privacy Page */}
      {currentPage === 'privacy' && (
        <section className="bg-white min-h-screen">
          <Privacy />
        </section>
      )}

      {/* Terms Page */}
      {currentPage === 'terms' && (
        <section className="bg-white min-h-screen">
          <Terms />
        </section>
      )}

      {/* Refund Page */}
      {currentPage === 'refund' && (
        <section className="bg-white min-h-screen">
          <Refund />
        </section>
      )}

      {/* FAQ Page */}
      {currentPage === 'faq' && (
        <section className="bg-white min-h-screen">
          <FAQ />
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#001524] text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span>ContentRex AI</span>
              </div>
              <p className="text-[#ffecd1]">
                CONTENTREX: The Platform for Content Authority<br />and Market Intelligence.
              </p>
            </div>
            
            <div>
              <div className="text-white mb-4">Product</div>
              <ul className="space-y-2 text-[#ffecd1]">
                <li><button onClick={() => handlePageChange('content')} className="hover:text-[#ff7d00] transition-colors">Content Generator</button></li>
                <li><button onClick={() => handlePageChange('marketing')} className="hover:text-[#ff7d00] transition-colors">Marketing Intelligence</button></li>
                <li><button onClick={() => handlePageChange('features')} className="hover:text-[#ff7d00] transition-colors">Features</button></li>
                <li><button onClick={() => handlePageChange('pricing')} className="hover:text-[#ff7d00] transition-colors">Pricing</button></li>
                <li><button onClick={() => handlePageChange('how-it-works')} className="hover:text-[#ff7d00] transition-colors">How It Works</button></li>
              </ul>
            </div>
            
            <div>
              <div className="text-white mb-4">Legal</div>
              <ul className="space-y-2 text-[#ffecd1]">
                <li><button onClick={() => handlePageChange('privacy')} className="hover:text-[#ff7d00] transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => handlePageChange('terms')} className="hover:text-[#ff7d00] transition-colors">Terms of Service</button></li>
                <li><button onClick={() => handlePageChange('refund')} className="hover:text-[#ff7d00] transition-colors">Refund Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#15616d] pt-8 text-center text-[#ffecd1]">
            <p>&copy; 2025 ContentRex AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
