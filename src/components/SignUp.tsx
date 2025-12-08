import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Loader2, Chrome } from 'lucide-react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onSuccess: () => void;
}

export function SignUp({ onSwitchToSignIn, onSuccess }: SignUpProps) {
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await signUp(email, password, name);

    if (result.success) {
      toast.success('Account created! Welcome to ContentRex AI');
      onSuccess();
    } else {
      toast.error(result.error || 'Failed to create account');
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
      // Note: Google OAuth will redirect, so we don't need to call onSuccess here
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#ffecd1] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-[#001524] mb-2 tracking-tight">Start Your Free Trial</h1>
            <p className="text-[#15616d]">14 days unlimited access. No credit card required.</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-[#15616d] rounded-lg hover:bg-[#ffecd1] transition-colors mb-6"
          >
            <Chrome className="w-5 h-5 text-[#15616d]" />
            <span className="text-[#001524]">Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#15616d]"></div>
            <span className="text-[#15616d] text-sm">or</span>
            <div className="flex-1 h-px bg-[#15616d]"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#001524] mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#15616d]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#15616d] rounded-lg focus:outline-none focus:border-[#ff7d00]"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#001524] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#15616d]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#15616d] rounded-lg focus:outline-none focus:border-[#ff7d00]"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#001524] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#15616d]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#15616d] rounded-lg focus:outline-none focus:border-[#ff7d00]"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-sm text-[#15616d] mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Start Free Trial'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#15616d]">
              Already have an account?{' '}
              <button
                onClick={onSwitchToSignIn}
                className="text-[#ff7d00] hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#15616d]">
            <p className="text-xs text-[#15616d] text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy. 
              14-day money-back guarantee.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
