import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Search, Sparkles, Cog, DollarSign, Code } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: Search },
    { id: 'general', name: 'General', icon: Sparkles },
    { id: 'content', name: 'Content Generation', icon: Sparkles },
    { id: 'process', name: 'Process & Workflow', icon: Cog },
    { id: 'pricing', name: 'Pricing & Plans', icon: DollarSign },
    { id: 'technical', name: 'Technical', icon: Code }
  ];

  const faqData = [
    {
      category: 'general',
      question: 'What is the best ASO tool for content optimization?',
      answer: 'ContentRex AI is purpose-built as a comprehensive ASO (App Store Optimization) and content optimization platform. Unlike single-function ASO tools limited to app stores, we deliver advanced content generation plus real-time SEO analysis, marketing intelligence, and competitive research across all major platforms—web, social, search, and mobile.'
    },
    {
      category: 'general',
      question: 'What makes ContentRex AI different from other AI content tools?',
      answer: 'Three decisive advantages: (1) Real-time search intelligence—we analyze live SERP data, not outdated patterns, (2) Iterative refinement—we perfect content through multiple cycles until hitting 80+ scores, not single-shot generation, (3) Complete marketing intelligence—YouTube SEO, trend detection, and PPC analysis included, not sold separately.'
    },
    {
      category: 'content',
      question: 'What countries and languages does ContentRex AI support?',
      answer: 'We support 112 countries with complete localization—from the US, UK, Canada, and Australia to Germany, France, Spain, Italy, Brazil, Mexico, Japan, South Korea, India, and 99 additional markets. Our system understands regional search patterns, cultural context, and local competition dynamics.'
    },
    {
      category: 'content',
      question: 'Is all generated content original and plagiarism-free?',
      answer: 'Absolutely. Every piece is 100% original, created from scratch by our AI. We never copy, spin, or paraphrase existing content. Each generation is unique to your inputs—keywords, framework, audience, and voice—producing fresh content every time.'
    },
    {
      category: 'content',
      question: 'What content types can I create with ContentRex AI?',
      answer: 'We support 28 content formats: blog posts (500-3000 words), product descriptions, social media posts, email campaigns, ad copy, landing pages, YouTube video descriptions, meta descriptions, press releases, case studies, and more. Each type includes optimized word count ranges and format-specific SEO validation.'
    },
    {
      category: 'content',
      question: 'Which copywriting frameworks are available?',
      answer: 'We offer five battle-tested frameworks: AIDA (Attention, Interest, Desire, Action), PAS (Problem, Agitate, Solution), BAB (Before, After, Bridge), 4Ps (Promise, Picture, Proof, Push), and FAB (Features, Advantages, Benefits). Each framework is intelligently applied based on your content type and marketing objective.'
    },
    {
      category: 'process',
      question: 'How fast is content generation?',
      answer: 'Initial content appears in 15-30 seconds based on length and complexity. The complete optimization process—including SEO analysis, competitive gap detection, and refinement—takes 45-90 seconds total. Compare that to 2-4 hours for manual creation at similar quality.'
    },
    {
      category: 'process',
      question: 'How does your SEO scoring system work?',
      answer: 'We analyze 15+ critical factors: keyword density (1-2% optimal range), readability (Flesch Reading Ease), title optimization (50-60 chars with strategic keyword placement), meta description quality, content structure (H1/H2/H3 hierarchy), semantic SEO, competitive gap analysis, and SERP feature targeting. Minimum guaranteed score: 80+.'
    },
    {
      question: 'When should I use the retry feature?',
      answer: 'The retry option activates after 3 iterations if your content scores below 70. It provides up to 3 additional refinement attempts (6 total maximum) for competitive keywords or complex formats. Most content achieves high scores within the standard 3 iterations.'
    },
    {
      category: 'process',
      question: 'How does Marketing Intelligence work?',
      answer: 'Our Intelligence suite includes three power tools: (1) YouTube SEO Optimizer—reverse-engineers video performance and surfaces optimization opportunities, (2) Trend Hunter—uncovers emerging trends with historical data, demographic insights, and AI opportunity scoring, (3) PPC Spy—decodes competitor paid campaigns with estimated budgets and winning ad copy patterns.'
    },
    {
      category: 'pricing',
      question: 'What are the content generation limits?',
      answer: 'Limits scale by plan: Starter includes 50 generations monthly, Professional includes 500 monthly, Enterprise offers unlimited. Each "generation" includes the complete 3-iteration optimization cycle with full SEO analysis—not just a single draft.'
    },
    {
      category: 'pricing',
      question: 'Can I switch plans at any time?',
      answer: 'Yes—upgrade, downgrade, or cancel whenever you want. Upgrades activate immediately with prorated billing. Downgrades take effect at your next billing cycle. No penalties, no hidden fees, no contracts.'
    },
    {
      category: 'pricing',
      question: 'Do you offer a free trial?',
      answer: 'Yes! All plans include a 14-day free trial. No credit card required to start. You get complete access to every feature in your chosen plan during the trial period.'
    },
    {
      category: 'pricing',
      question: 'What is your refund policy?',
      answer: 'We offer full refunds within 14 days of your initial purchase or renewal. Contact our support team within the 14-day window to request a refund. Refunds are processed to your original payment method within 5-10 business days.'
    },
    {
      category: 'technical',
      question: 'Is API access available for developers?',
      answer: 'Yes—Professional and Enterprise plans include full API access. Integrate ContentRex AI content generation, SEO analysis, and marketing intelligence directly into your applications, workflows, or client dashboards. Complete API documentation provided with endpoints for all major features.'
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">
              Questions
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-[#15616d] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything you need to know about ContentRex AI, content generation, SEO optimization, and our platform.
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b-2 border-[#15616d]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white border-[#ff7d00]'
                      : 'bg-white text-[#15616d] border-[#15616d] hover:border-[#ff7d00]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white border-2 border-[#15616d] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#ffecd1]/30 transition-colors"
                >
                  <h3 className="text-lg text-[#001524] pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-[#ff7d00] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[#ff7d00] flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5"
                  >
                    <div className="pt-2 border-t border-[#15616d]/20">
                      <p className="text-[#15616d] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-[#15616d]">No questions found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 bg-gradient-to-br from-[#15616d] to-[#001524] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl mb-6 tracking-tight">
              Still Have Questions?
            </h2>
            <p className="text-xl text-[#ffecd1] mb-8">
              Our support team is here to help. Get in touch with us anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity text-lg shadow-xl">
                Contact Support
              </button>
              <button className="px-8 py-4 bg-white text-[#15616d] rounded-lg hover:bg-[#ffecd1] transition-colors text-lg shadow-xl">
                Start Free Trial
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};