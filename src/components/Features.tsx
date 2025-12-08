import React from 'react';
import { motion } from 'motion/react';
import { WhoShouldUse, SuccessStories, WhatMakesDifferent } from './SEOHomepageSections';

interface FeaturesProps {
  setCurrentPage: (page: 'home' | 'content' | 'marketing' | 'pricing' | 'how-it-works' | 'features' | 'privacy' | 'terms') => void;
}

export const Features: React.FC<FeaturesProps> = ({ setCurrentPage }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl text-[#001524] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Everything You Need to Build{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">
              Content Authority
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-[#15616d] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover why brands, agencies, and creators choose ContentRex AI to power their content strategy and market intelligence.
          </motion.p>
        </div>
      </section>

      {/* Key Features Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl text-[#001524] mb-4 tracking-tight">
              Two Engines. One Platform. Complete Control.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '🎨',
                title: 'AI Content Generation',
                description: 'Transform ideas into ranking content with our 3-stage optimization engine',
                features: ['28 content types', '112 countries', '5 copywriting frameworks', 'Guaranteed 80+ SEO scores']
              },
              {
                icon: '📊',
                title: 'Marketing Intelligence',
                description: 'Decode your market with real-time competitive and trend intelligence',
                features: ['YouTube SEO reverse engineering', 'Emerging trend detection', 'PPC campaign decoding', 'Multi-engine SERP tracking']
              },
              {
                icon: '🔄',
                title: 'Iterative Optimization',
                description: 'Refinement cycles that perfect content until it meets performance standards',
                features: ['3-6 iteration cycles', 'Real-time SERP analysis', 'Competitive gap detection', 'Transparent scoring']
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-[#ffecd1] border-2 border-[#15616d] rounded-2xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl text-[#001524] mb-3">{feature.title}</h3>
                <p className="text-[#15616d] mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#15616d]">
                      <span className="text-[#ff7d00]">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <WhatMakesDifferent />

      {/* Who Should Use */}
      <WhoShouldUse setCurrentPage={setCurrentPage} />

      {/* Success Stories */}
      <SuccessStories />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#15616d] to-[#001524] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl mb-6 tracking-tight">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-[#ffecd1] mb-8">
              Join thousands of marketers who have transformed their content strategy with ContentRex AI. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('content')}
                className="px-8 py-4 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity text-lg shadow-xl"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => setCurrentPage('pricing')}
                className="px-8 py-4 bg-white text-[#001524] rounded-lg hover:bg-[#ffecd1] transition-colors text-lg"
              >
                View Pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};