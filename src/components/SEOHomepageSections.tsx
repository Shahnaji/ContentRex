import React from 'react';
import { motion } from 'motion/react';

export const WhatIsContentRex: React.FC = () => (
  <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl sm:text-5xl text-[#001524] mb-6 text-center tracking-tight">
          What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">ContentRex AI</span>?
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-[#15616d]">
            ContentRex AI is a dual-engine platform that transforms how you create content and understand your market. Unlike single-purpose AI writing tools, we combine intelligent content generation with real-time competitive intelligence—giving you both the content and the strategic insights you need to win.
          </p>
          <p className="text-lg text-[#15616d]">
            Our 3-stage refinement process doesn't just generate content and call it done. We analyze, optimize, and refine until every piece scores 80+ on critical SEO factors—from keyword density and readability to competitive positioning. You get content that's built to rank, not just exist.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export const WhyOptimization: React.FC = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl text-[#001524] mb-6 tracking-tight">
          Why Content Optimization <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">Matters</span>
        </h2>
      </motion.div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#ffecd1] to-white border-2 border-[#15616d] rounded-2xl p-8"
        >
          <h3 className="text-2xl text-[#001524] mb-4">The Problem</h3>
          <p className="text-[#15616d] mb-4">
            Creating content that ranks on Google, drives traffic, and converts visitors into customers is harder than ever. With over 4.4 million blog posts published daily and search algorithms becoming increasingly sophisticated, generic AI-generated content simply doesn't cut it anymore.
          </p>
          <p className="text-[#15616d]">
            Most businesses struggle with low search rankings, poor engagement rates, and content that fails to connect with their target audience. They waste hours researching keywords, analyzing competitors, and manually optimizing their content—only to see minimal results.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#ff7d00] to-[#78290f] border-2 border-[#15616d] rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl mb-4">The Solution</h3>
          <p className="text-[#ffecd1] mb-4">
            ContentRex AI solves this with advanced machine learning that doesn't just generate content—it optimizes, analyzes, and iteratively improves your content until it meets the highest SEO standards. Our platform connects to real-time search data from Google, Bing, Yahoo, and Baidu to understand exactly what's ranking and why.
          </p>
          <p className="text-[#ffecd1]">
            With features like competitor PPC analysis, YouTube SEO optimization, trend hunting, and intelligent SERP analysis, you get insights that would normally require expensive tools and hours of manual research—all automated and delivered in seconds.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export const HowAIWorks: React.FC = () => (
  <section className="py-20 bg-gradient-to-br from-[#15616d] to-[#001524] text-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl mb-6 tracking-tight">
          How Our <span className="text-[#ff7d00]">AI Works</span>
        </h2>
        <p className="text-xl text-[#ffecd1]">
          Advanced optimization process for high-quality SEO results
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white/10 rounded-xl p-6"
        >
          <h3 className="text-2xl text-[#ff7d00] mb-3">1. Analysis</h3>
          <p className="text-[#ffecd1]">
            Deep keyword analysis for search volume, competition data, and ranking insights using real-time market intelligence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/10 rounded-xl p-6"
        >
          <h3 className="text-2xl text-[#ff7d00] mb-3">2. Generation</h3>
          <p className="text-[#ffecd1]">
            Generate content with AI incorporating your framework, audience, and localization.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white/10 rounded-xl p-6"
        >
          <h3 className="text-2xl text-[#ff7d00] mb-3">3. Refinement</h3>
          <p className="text-[#ffecd1]">
            Analyze and refine up to 6 times until achieving high SEO scores across all metrics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white/10 rounded-xl p-6"
        >
          <h3 className="text-2xl text-[#ff7d00] mb-3">4. Intelligence</h3>
          <p className="text-[#ffecd1]">
            Identify gaps, SERP features, and opportunities to outrank competitors.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export const WhoShouldUse: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  const useCases = [
    {
      title: 'Content Marketers',
      description: 'Create blog posts, articles, and guides that rank well. Save 10+ hours per week on content creation while improving quality and SEO performance.',
      icon: '✍️'
    },
    {
      title: 'E-commerce Businesses',
      description: 'Generate compelling product descriptions and landing pages that convert. Optimize for local and international markets with multi-country support.',
      icon: '🛒'
    },
    {
      title: 'Digital Marketing Agencies',
      description: 'Scale content production for multiple clients. Deliver consistent, high-quality SEO content that drives measurable results.',
      icon: '🚀'
    },
    {
      title: 'YouTube Creators',
      description: 'Optimize video titles, descriptions, and tags for visibility. Use our YouTube SEO tool to discover trending keywords and analyze competitors.',
      icon: '🎥'
    },
    {
      title: 'SEO Professionals',
      description: 'Automate content optimization and competitive analysis. Discover opportunities your competitors are missing.',
      icon: '📊'
    },
    {
      title: 'Small Business Owners',
      description: 'Create professional marketing content without the overhead. From website copy to Google Ads, generate everything you need to grow.',
      icon: '🏪'
    }
  ];

  return (
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
            Who Should Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">ContentRex AI</span>?
          </h2>
          <p className="text-xl text-[#15616d]">
            Perfect for anyone looking to scale their content marketing with AI
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#ffecd1] to-white border-2 border-[#15616d] rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
              onClick={() => setCurrentPage('content')}
            >
              <div className="text-4xl mb-3">{useCase.icon}</div>
              <h3 className="text-xl text-[#001524] mb-3">{useCase.title}</h3>
              <p className="text-[#15616d]">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SuccessStories: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Content Marketing Manager',
      quote: 'ContentRex AI helped us increase organic traffic by 340% in 3 months. The 3-iteration process ensures every piece meets our quality standards.',
      metric: '340% traffic increase',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Digital Agency Founder',
      quote: 'The Marketing Intelligence features save us 20 hours per week on competitor research. Our clients see an average SEO score improvement of 45 points.',
      metric: '20 hours saved weekly',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Thompson',
      role: 'E-commerce Director',
      quote: 'We rewrote 2,000+ product descriptions. Conversion rates increased by 28%, and we\'re now ranking for 3x more keywords.',
      metric: '28% conversion boost',
      avatar: '👩‍💼'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl text-[#001524] mb-4 tracking-tight">
            Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">Stories</span>
          </h2>
          <p className="text-xl text-[#15616d]">
            Join thousands of marketers achieving breakthrough results
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="text-[#001524]">{testimonial.name}</h4>
                  <p className="text-sm text-[#15616d]">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-[#15616d] mb-4 italic">"{testimonial.quote}"</p>
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-full text-sm">
                {testimonial.metric}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const WhatMakesDifferent: React.FC = () => {
  const differentiators = [
    {
      title: 'Real-Time Search Intelligence',
      description: 'ContentRex AI analyzes current search trends across multiple search engines. Every piece of content is optimized based on real-world performance data—not guesswork.',
      icon: '🔄'
    },
    {
      title: 'Iterative Improvement Process',
      description: 'Most AI tools generate content once. ContentRex AI analyzes, scores, and iteratively improves your content multiple times until achieving high SEO scores for consistent results.',
      icon: '🎯'
    },
    {
      title: 'Comprehensive Marketing Intelligence',
      description: 'With YouTube SEO, Trend Hunter, and PPC Spy, you get the complete competitive intelligence suite that would normally cost $500+/month across multiple tools.',
      icon: '📊'
    },
    {
      title: 'Transparent SEO Scoring',
      description: 'Every piece of content comes with detailed SEO analysis showing exactly why you got your score and how to improve it. Clear, actionable insights you can understand.',
      icon: '📈'
    }
  ];

  return (
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
            What Makes Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">Different</span>?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {differentiators.map((diff, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-[#ffecd1] border-2 border-[#15616d] rounded-xl p-6"
            >
              <div className="text-4xl mb-4">{diff.icon}</div>
              <h3 className="text-2xl text-[#001524] mb-3">{diff.title}</h3>
              <p className="text-[#15616d]">{diff.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ComprehensiveFAQ: React.FC<{ setCurrentPage?: (page: string) => void }> = ({ setCurrentPage }) => {
  const faqs = [
    {
      question: 'What is the best ASO tool for content optimization?',
      answer: 'ContentRex AI is specifically designed as the most comprehensive ASO (App Store Optimization) and content optimization platform available. Unlike traditional ASO tools that focus solely on app store optimization, ContentRex AI combines advanced content generation with real-time SEO analysis, marketing intelligence, and competitive research across web, social media, and search platforms.'
    },
    {
      question: 'How long does content generation take?',
      answer: 'Content generation is lightning-fast. Initial content is typically generated in 15-30 seconds depending on length and complexity. The complete 3-iteration optimization process takes 45-90 seconds total. For comparison, manual content creation would take 2-4 hours per piece.'
    },
    {
      question: 'Is the content plagiarism-free and original?',
      answer: 'Yes, 100%. All content generated by ContentRex AI is completely original and created from scratch. We do not copy, spin, or rewrite existing content from other sources. Each piece is uniquely generated based on your specific inputs, target keywords, and brand voice.'
    },
    {
      question: 'What countries and languages are supported?',
      answer: 'ContentRex AI supports exactly 112 countries with full localization capabilities, including the United States, United Kingdom, Canada, Australia, Germany, France, Spain, Italy, Brazil, Mexico, Japan, South Korea, India, and 99 more markets.'
    },
    {
      question: 'How does the SEO scoring system work?',
      answer: 'Our SEO scoring system analyzes 15+ critical factors including keyword density, readability, title optimization, meta description quality, content structure, semantic SEO, and competitor gap analysis. We guarantee minimum 80+ scores, with most content achieving 96+.'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! All plans come with a 14-day free trial with no credit card required. You get full access to all features in your chosen plan during the trial period. Start generating amazing content today!'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl text-[#001524] mb-4 tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">Questions</span>
          </h2>
          <p className="text-xl text-[#15616d]">
            Quick answers to common questions
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-[#15616d] rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg text-[#001524] mb-3">{faq.question}</h3>
              <p className="text-[#15616d]">{faq.answer}</p>
            </motion.div>
          ))}
        </div>

        {/* View All FAQs Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setCurrentPage && setCurrentPage('faq')}
            className="px-8 py-4 bg-gradient-to-r from-[#15616d] to-[#001524] text-white rounded-lg hover:opacity-90 transition-opacity text-lg shadow-xl"
          >
            View All FAQs (15 Questions) →
          </button>
        </motion.div>
      </div>
    </section>
  );
};