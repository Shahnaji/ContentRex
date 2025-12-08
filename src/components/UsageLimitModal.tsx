import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

export const UsageLimitModal: React.FC<UsageLimitModalProps> = ({ isOpen, onClose, onSignUp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative border-2 border-[#ff7d00]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#15616d] hover:text-[#ff7d00] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-lg flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <h2 className="text-center text-[#001524] mb-4">
          You've Used All 3 Free Generations! 🎉
        </h2>
        
        <p className="text-center text-[#15616d] mb-6">
          Ready for more? Sign up now and get:
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#ffecd1] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#ff7d00]">✓</span>
            </div>
            <p className="text-[#001524]">
              <strong>14 days unlimited free trial</strong> – All features unlocked
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#ffecd1] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#ff7d00]">✓</span>
            </div>
            <p className="text-[#001524]">
              <strong>Content Generator</strong> – Unlimited iterations
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#ffecd1] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#ff7d00]">✓</span>
            </div>
            <p className="text-[#001524]">
              <strong>Marketing Intelligence</strong> – Full access to all 3 tools
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#ffecd1] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#ff7d00]">✓</span>
            </div>
            <p className="text-[#001524]">
              No credit card required
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onSignUp}
          className="w-full bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white py-4 rounded-lg hover:shadow-lg transition-all"
        >
          Start Your Free 14-Day Trial
        </button>

        <p className="text-center text-sm text-[#15616d] mt-4">
          Join thousands of content creators today
        </p>
      </motion.div>
    </div>
  );
};
