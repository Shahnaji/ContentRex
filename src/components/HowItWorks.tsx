import React from 'react';
import { motion } from 'motion/react';
import { Search, Wand2, BarChart3, Rocket, FileText, Sparkles, Clock, Target, TrendingUp, Zap } from 'lucide-react';

interface HowItWorksProps {
  setCurrentPage: (page: 'home' | 'content' | 'marketing' | 'pricing' | 'how-it-works' | 'features' | 'privacy' | 'terms') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ setCurrentPage }) => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Tool',
      description: 'Start with Content Generator for creation or Marketing Intelligence for insights.',
      icon: Search,
      color: 'from-[#ff7d00] to-[#78290f]',
      details: 'Pick your starting point based on your objective. Content Generator builds and optimizes content from scratch or repurposes existing material. Marketing Intelligence reveals competitive insights, trend patterns, YouTube optimization opportunities, and PPC campaign strategies.'
    },
    {
      number: '02',
      title: 'Input Your Parameters',
      description: 'Define your target keyword, content type, audience, and strategic requirements.',
      icon: FileText,
      color: 'from-[#15616d] to-[#001524]',
      details: 'Specify your target keyword, select from 28 content formats (blog post, product description, social media, etc.), choose your target market from 112 countries, pick your copywriting framework (AIDA, PAS, BAB, 4Ps, or FAB), and define your audience profile.'
    },
    {
      number: '03',
      title: 'AI Analysis & Generation',
      description: 'Our system analyzes live SERP data and generates optimized content in under a minute.',
      icon: Wand2,
      color: 'from-[#ff7d00] to-[#78290f]',
      details: 'Our optimization engine analyzes search volume, competition intensity, top-ranking content patterns, and SERP feature opportunities in real time. Then generates strategically optimized content matching your specifications in 15-30 seconds.'
    },
    {
      number: '04',
      title: 'Review & Refinement',
      description: 'Get detailed SEO analysis with actionable recommendations for improvement.',
      icon: BarChart3,
      color: 'from-[#15616d] to-[#001524]',
      details: 'We analyze 15+ SEO factors: keyword density, readability, title optimization, meta quality, content structure, and competitive positioning. If scoring below 70, automatic refinement activates for up to 3 iterations (6 with retry) until quality standards are met. Minimum guaranteed score: 80+.'
    },
    {
      number: '05',
      title: 'Deploy with Confidence',
      description: 'Copy your optimized content and deploy across any marketing channel.',
      icon: Rocket,
      color: 'from-[#ff7d00] to-[#78290f]',
      details: 'Copy your high-scoring content with one click. Deploy to blog posts, landing pages, social campaigns, email sequences, or ad platforms. Every piece is 100% original, plagiarism-free, and ready to publish immediately with no additional editing required.'
    }
  ];

  const features = [
    {
      title: 'Content Generation',
      description: 'Create blog posts, product descriptions, emails, social media posts, and ad copy with AI.',
      icon: Sparkles,
      items: [
        '28 content types with optimized templates',
        '5 copywriting frameworks (AIDA, PAS, BAB, 4Ps, FAB)',
        '112+ country localization with cultural adaptation',
        'Custom word counts (100-5000 words)',
        'Tone customization (professional, casual, friendly, authoritative)'
      ]
    },
    {
      title: 'Marketing Intelligence',
      description: 'Gain competitive insights and discover trending opportunities across platforms.',
      icon: BarChart3,
      items: [
        'YouTube SEO optimization with real-time analytics',
        'Trend discovery across multiple data sources',
        'Competitor PPC campaign analysis',
        'Real-time SERP feature detection'
      ]
    },
    {
      title: 'SEO Optimization',
      description: 'Every piece of content is optimized through our 3-iteration improvement process.',
      icon: Wand2,
      items: [
        'Keyword density analysis (1-2% optimal)',
        'Readability scoring (Flesch Reading Ease)',
        'Title optimization (50-60 chars with keyword)',
        'Meta description analysis',
        'Guaranteed minimum 80+ SEO score'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How long does the entire process take?',
      answer: 'From start to finish, the process takes 45-90 seconds for complete content generation with 3-iteration optimization. Initial content appears in 15-30 seconds. Manual creation of similar quality content would take 2-4 hours.'
    },
    {
      question: 'What happens during the 3-iteration process?',
      answer: 'Iteration 1: Initial content generation based on SERP analysis. Iteration 2: SEO refinement addressing keyword density, readability, and structure issues. Iteration 3: Competitive gap analysis and final optimization. If score < 70 after 3 iterations, you can trigger up to 3 more retries (6 total max).'
    },
    {
      question: 'Can I customize the content after generation?',
      answer: 'Absolutely! Generated content is fully editable. You can copy it to any text editor and make adjustments. The SEO analysis provides specific recommendations for further improvement if needed.'
    },
    {
      question: 'Do I need SEO knowledge to use ContentRex AI?',
      answer: 'No! ContentRex AI is designed for users of all skill levels. The platform handles all SEO optimization automatically. However, the detailed scoring breakdown also helps SEO professionals understand exactly what makes content rank.'
    },
    {
      question: 'How does ContentRex AI compare to hiring a content writer?',
      answer: 'ContentRex AI generates SEO-optimized content in 60 seconds vs. 2-4 hours for manual writing. Cost: $29-49/month vs. $50-200 per article. Quality: Guaranteed 80+ SEO scores vs. variable quality. Scale: Unlimited pieces/month vs. limited output. Use ContentRex AI for first draft, then add human touch for best results.'
    },
    {
      question: 'What makes the iterative process better than one-shot generation?',
      answer: 'One-shot AI tools generate content once with no quality guarantee. ContentRex AI analyzes, scores, and refines up to 6 times to improve quality. Guaranteed minimum 80+ scores. This ensures consistency and reduces manual editing time.'
    }
  ];

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
            How It{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">
              Works
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-[#15616d] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Create professional, SEO-optimized content in just 5 simple steps. No expertise required.
          </motion.p>
        </div>
      </section>

      {/* Why Optimization Matters */}
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
              Why Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">Process</span> Works
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
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
              <h3 className="text-2xl mb-4">Our Solution</h3>
              <p className="text-[#ffecd1] mb-4">
                ContentRex AI solves this with advanced machine learning that doesn't just generate content—it optimizes, analyzes, and iteratively improves your content until it meets the highest SEO standards. Our platform connects to real-time search data from Google, Bing, Yahoo, and Baidu to understand exactly what's ranking and why.
              </p>
              <p className="text-[#ffecd1]">
                With features like competitor PPC analysis, YouTube SEO optimization, trend hunting, and intelligent SERP analysis, you get insights that would normally require expensive tools and hours of manual research—all automated and delivered in seconds.
              </p>
            </motion.div>
          </div>

          {/* Time & Cost Savings */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Fast Generation', description: 'Generate in 60 seconds what takes 2-4 hours manually' },
              { icon: Target, title: '80+ SEO Scores', description: 'Guaranteed quality through iterative refinement' },
              { icon: TrendingUp, title: 'Save Time & Money', description: 'Less time writing = more time growing your business' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border-2 border-[#15616d] rounded-xl p-6 text-center"
                >
                  <Icon className="w-12 h-12 text-[#ff7d00] mx-auto mb-3" />
                  <h4 className="text-xl text-[#001524] mb-2">{stat.title}</h4>
                  <p className="text-[#15616d]">{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl text-[#001524] text-center mb-12 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Step-by-Step Process
          </motion.h2>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8 mb-16`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className={`text-6xl bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                    {step.number}
                  </div>
                  <h3 className="text-3xl text-[#001524] mb-4">{step.title}</h3>
                  <p className="text-lg text-[#15616d] mb-4">{step.description}</p>
                  <p className="text-[#15616d]">{step.details}</p>
                </div>

                {/* Icon */}
                <div className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                  <Icon className="w-32 h-32 text-white" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl text-[#001524] text-center mb-12 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Powerful Features at Your Fingertips
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl text-[#001524] mb-3">{feature.title}</h3>
                  <p className="text-[#15616d] mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#15616d]">
                        <span className="text-[#ff7d00] mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl text-[#001524] text-center mb-12 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Process & Workflow FAQs
          </motion.h2>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-[#15616d] rounded-xl p-6"
              >
                <h3 className="text-xl text-[#001524] mb-3">{faq.question}</h3>
                <p className="text-[#15616d]">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#15616d] to-[#001524]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl text-white mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-[#ffecd1] mb-8 max-w-2xl mx-auto">
              Join thousands of marketers and content creators who are already creating amazing content with our AI tools.
            </p>
            <button 
              onClick={() => setCurrentPage('content')}
              className="px-8 py-4 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity text-lg shadow-xl"
            >
              Start Your Free Trial
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};