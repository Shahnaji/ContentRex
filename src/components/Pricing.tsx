import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Rocket, Crown, DollarSign, Users, TrendingUp } from 'lucide-react';

interface PricingProps {
  setCurrentPage: (page: 'home' | 'content' | 'marketing' | 'pricing' | 'how-it-works' | 'features' | 'privacy' | 'terms') => void;
}

export const Pricing: React.FC<PricingProps> = ({ setCurrentPage }) => {
  const plans = [
    {
      name: 'Creator Pro',
      icon: Zap,
      price: '$29',
      period: '/month',
      description: 'Content generation and repurposing tools',
      bestFor: 'Freelancers, bloggers, content marketers',
      features: [
        'Unlimited content generations',
        'Content repurposing',
        '28 content types',
        '112+ country localization',
        'Email support',
        'All copywriting frameworks'
      ],
      highlighted: false,
      cta: 'Get Started'
    },
    {
      name: 'Strategist Pro',
      icon: Rocket,
      price: '$29',
      period: '/month',
      description: 'Marketing intelligence tools',
      bestFor: 'SEO specialists, PPC managers, marketing strategists',
      features: [
        'YouTube SEO Optimizer',
        'Trend Hunter',
        'PPC Spy',
        '112+ country localization',
        'Email support',
        'Unlimited usage'
      ],
      highlighted: false,
      cta: 'Get Started'
    },
    {
      name: 'REX ELITE',
      icon: Crown,
      price: '$49',
      period: '/month',
      description: 'All content and intelligence tools included',
      bestFor: 'Agencies, growing startups, serious marketers',
      features: [
        'Unlimited content generations',
        'Content repurposing',
        'YouTube SEO Optimizer',
        'Trend Hunter',
        'PPC Spy',
        '28 content types',
        '112+ country localization',
        'Email support',
        'All copywriting frameworks'
      ],
      highlighted: true,
      cta: 'Get Started'
    }
  ];

  const comparisonFeatures = [
    {
      category: 'Content Generation',
      features: [
        { name: 'Content generations', starter: 'Unlimited', pro: '—', enterprise: 'Unlimited' },
        { name: 'Content repurposing', starter: '✅', pro: '—', enterprise: '✅' },
        { name: 'Content types', starter: '28', pro: '—', enterprise: '28' },
        { name: 'Copywriting frameworks', starter: 'All', pro: '—', enterprise: 'All' }
      ]
    },
    {
      category: 'Marketing Intelligence',
      features: [
        { name: 'YouTube SEO Optimizer', starter: '—', pro: '✅', enterprise: '✅' },
        { name: 'Trend Hunter', starter: '—', pro: '✅', enterprise: '✅' },
        { name: 'PPC Spy', starter: '—', pro: '✅', enterprise: '✅' }
      ]
    },
    {
      category: 'Support & Localization',
      features: [
        { name: 'Country localization', starter: '112+', pro: '112+', enterprise: '112+' },
        { name: 'Customer support', starter: '✅', pro: '✅', enterprise: '✅' },
        { name: 'Usage limits', starter: 'Unlimited', pro: 'Unlimited', enterprise: 'Unlimited' }
      ]
    }
  ];

  const useCases = [
    {
      plan: 'Creator Pro',
      icon: '📝',
      scenario: 'Freelance Content Writer',
      description: 'Save 20 hours/month creating optimized content for clients.',
      calculation: 'Time saved: 20 hours × $75/hour = $1,500 value. Cost: $29. Monthly savings: $1,471'
    },
    {
      plan: 'Strategist Pro',
      icon: '🚀',
      scenario: 'SEO Consultant',
      description: 'Research competitors, trends, and YouTube strategies faster.',
      calculation: 'Time saved: 15 hours × $100/hour = $1,500 value. Cost: $29. Monthly savings: $1,471'
    },
    {
      plan: 'REX ELITE',
      icon: '🏢',
      scenario: 'Marketing Agency',
      description: 'Complete content + intelligence for multiple client campaigns.',
      calculation: 'Time saved: 40 hours × $100/hour = $4,000 value. Cost: $49. Monthly savings: $3,951'
    }
  ];

  const faqs = [
    {
      question: 'What does "unlimited usage" mean?',
      answer: 'Unlimited means no caps on generations, searches, or tool usage. Use Creator Pro for as much content as you need, Strategist Pro for unlimited intelligence queries, or REX ELITE for everything—no hidden limits or overage fees.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle. No penalties or hidden fees.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. All transactions are secure and encrypted.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All plans come with a 14-day free trial. No credit card required to start. You get full access to all features in your chosen plan during the trial period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee on all plans. If you\'re not satisfied within the first 30 days, we\'ll refund you in full, no questions asked.'
    },
    {
      question: 'Which plan is right for me?',
      answer: 'Choose Creator Pro for content creation needs, Strategist Pro for marketing intelligence, or REX ELITE (most popular) for both. Most agencies and serious marketers choose REX ELITE for complete coverage.'
    },
    {
      question: 'Is there an annual payment discount?',
      answer: 'Yes! Pay annually and save 20%. Creator Pro: $278/year (save $70), Strategist Pro: $278/year (save $70), REX ELITE: $470/year (save $118). Annual plans include the 30-day money-back guarantee.'
    },
    {
      question: 'What\'s included in customer support?',
      answer: 'All plans include customer support via email. We typically respond within 24 hours on business days. REX ELITE customers receive priority support with faster response times.'
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
            Simple, Transparent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7d00] to-[#78290f]">
              Pricing
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-[#15616d] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Choose the perfect plan for your needs. All plans include a 14-day free trial with no credit card required.
          </motion.p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: DollarSign, title: 'Unlimited Usage', description: 'No caps on content generations or tool usage' },
              { icon: Users, title: '3 Powerful Plans', description: 'Choose content creation, intelligence, or both' },
              { icon: TrendingUp, title: '112+ Countries', description: 'Localized content for global markets' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-[#ffecd1] to-white border-2 border-[#15616d] rounded-xl p-6 text-center"
                >
                  <Icon className="w-12 h-12 text-[#ff7d00] mx-auto mb-3" />
                  <h3 className="text-xl text-[#001524] mb-2">{stat.title}</h3>
                  <p className="text-[#15616d]">{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gradient-to-br from-[#ffecd1] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative rounded-2xl p-8 transition-all duration-300 flex flex-col ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-[#ff7d00] to-[#78290f] text-white border-4 border-[#ff7d00] shadow-2xl scale-105 hover:scale-110'
                      : 'bg-white border-2 border-[#15616d] shadow-xl hover:shadow-2xl hover:scale-105 hover:border-[#ff7d00]'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#001524] text-white px-4 py-1 rounded-full text-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      plan.highlighted ? 'bg-white' : 'bg-[#001524]'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${plan.highlighted ? 'text-[#ff7d00]' : 'text-white'}`} />
                  </div>

                  {/* Plan Name */}
                  <h3
                    className={`text-2xl mb-2 ${plan.highlighted ? 'text-white' : 'text-[#001524]'}`}
                  >
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm mb-2 ${plan.highlighted ? 'text-[#ffecd1]' : 'text-[#15616d]'}`}>
                    {plan.description}
                  </p>

                  {/* Best For */}
                  <p className={`text-xs mb-4 italic ${plan.highlighted ? 'text-[#ffecd1]' : 'text-[#15616d]'}`}>
                    Best for: {plan.bestFor}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className={`text-5xl ${plan.highlighted ? 'text-white' : 'text-[#001524]'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${plan.highlighted ? 'text-[#ffecd1]' : 'text-[#15616d]'}`}>
                      {plan.period}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.highlighted ? 'text-[#ffecd1]' : 'text-[#ff7d00]'
                          }`}
                        />
                        <span className={`text-sm ${plan.highlighted ? 'text-white' : 'text-[#15616d]'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-4 rounded-lg transition-all text-center ${
                      plan.highlighted
                        ? 'bg-white text-[#ff7d00] hover:bg-[#ffecd1]'
                        : 'bg-[#ff7d00] text-white hover:bg-[#78290f]'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl text-[#001524] text-center mb-12 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Detailed Feature Comparison
          </motion.h2>

          <div className="space-y-8">
            {comparisonFeatures.map((section, sectionIdx) => (
              <motion.div
                key={sectionIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIdx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-[#15616d] rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-[#15616d] to-[#001524] text-white px-6 py-4">
                  <h3 className="text-xl">{section.category}</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-[#15616d]">
                          <th className="text-left py-3 px-4 text-[#001524]">Feature</th>
                          <th className="text-center py-3 px-4 text-[#001524]">Creator Pro</th>
                          <th className="text-center py-3 px-4 text-[#001524]">Strategist Pro</th>
                          <th className="text-center py-3 px-4 text-[#001524]">REX ELITE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.features.map((feature, idx) => (
                          <tr key={idx} className="border-b border-[#15616d]/20">
                            <td className="py-3 px-4 text-[#15616d]">{feature.name}</td>
                            <td className="py-3 px-4 text-center text-[#15616d]">{feature.starter}</td>
                            <td className="py-3 px-4 text-center text-[#15616d]">{feature.pro}</td>
                            <td className="py-3 px-4 text-center text-[#15616d]">{feature.enterprise}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl text-[#001524] text-center mb-12 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Value Based on Time Savings
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-[#15616d] rounded-2xl p-6"
              >
                <div className="text-5xl mb-4 text-center">{useCase.icon}</div>
                <div className="bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white px-3 py-1 rounded-full text-sm inline-block mb-3">
                  {useCase.plan}
                </div>
                <h3 className="text-xl text-[#001524] mb-3">{useCase.scenario}</h3>
                <p className="text-[#15616d] mb-4">{useCase.description}</p>
                <div className="bg-[#ffecd1] rounded-lg p-4">
                  <p className="text-[#001524] text-sm">{useCase.calculation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl text-[#001524] text-center mb-12 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Pricing & Plans FAQs
          </motion.h2>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
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
      <section className="py-20 bg-gradient-to-br from-[#15616d] to-[#001524] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl mb-6 tracking-tight">
              Start Your 14-Day Free Trial
            </h2>
            <p className="text-xl text-[#ffecd1] mb-8">
              No credit card required. Full access to all features. Cancel anytime.
            </p>
            <button 
              onClick={() => setCurrentPage('content')}
              className="px-8 py-4 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity text-lg shadow-xl"
            >
              Get Started Free
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};