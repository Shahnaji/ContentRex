import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface MagicButtonProps {
  onClick: () => void;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const MagicButton: React.FC<MagicButtonProps> = ({
  onClick,
  loading = false,
  children,
  variant = 'primary',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600',
    secondary: 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      className={`relative ${sizeClasses[size]} ${variantClasses[variant]} text-white rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="relative flex items-center justify-center gap-2">
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        <span>{loading ? 'Processing...' : children}</span>
      </div>
    </motion.button>
  );
};