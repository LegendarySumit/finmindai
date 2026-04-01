'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Mail, Lock, Eye, EyeOff, Loader, Chrome } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, signupWithEmail, loginWithWallet, loginWithGoogle, signupWithGoogle, isLoading, error, clearError } = useAuth();
  const [tab, setTab] = useState<'wallet' | 'email'>('wallet');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const displayedError = localError || error || '';

  const handleWalletConnect = async () => {
    setLocalError('');
    clearError();

    try {
      await loginWithWallet();
      onClose();
    } catch (err: unknown) {
      setLocalError(getErrorMessage(err, 'Wallet connection failed'));
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError('');
    clearError();

    try {
      if (mode === 'signup') {
        await signupWithGoogle();
      } else {
        await loginWithGoogle();
      }
      onClose();
    } catch (err: unknown) {
      setLocalError(getErrorMessage(err, `Google ${mode} failed`));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Validation
    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters');
        return;
      }

      try {
        await signupWithEmail(email, password);
        onClose();
      } catch (err: unknown) {
        setLocalError(getErrorMessage(err, 'Signup failed'));
      }
    } else {
      try {
        await loginWithEmail(email, password);
        onClose();
      } catch (err: unknown) {
        setLocalError(getErrorMessage(err, 'Login failed'));
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-linear-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-2xl font-black text-white">FinMind Access</h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-6 pb-4">
              <button
                onClick={() => {
                  setTab('wallet');
                  setLocalError('');
                  clearError();
                }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  tab === 'wallet'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 border border-slate-700/50'
                }`}
              >
                <Wallet className="w-4 h-4" />
                Web3 Wallet
              </button>
              <button
                onClick={() => {
                  setTab('email');
                  setLocalError('');
                  clearError();
                }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  tab === 'email'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 border border-slate-700/50'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            {/* Error Message */}
            {displayedError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 text-sm"
              >
                {displayedError}
              </motion.div>
            )}

            {/* Content */}
            <div className="px-6 pb-6 pt-2">
              {tab === 'wallet' ? (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-slate-400 mb-4">
                    Connect your Web3 wallet for secure, non-custodial access. Your keys, your control.
                  </p>
                  <button
                    onClick={handleWalletConnect}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        Connect MetaMask / Wallet
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    MetaMask secure sign-in via Firebase
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="email"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleEmailAuth}
                  className="space-y-4"
                >
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl border border-slate-600/60 bg-white text-slate-900 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Chrome className="w-4 h-4" />
                        {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-700/40" />
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">or use email</span>
                    <div className="h-px flex-1 bg-slate-700/40" />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Signup) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {mode === 'login' ? 'Login' : 'Create Account'}
                      </>
                    )}
                  </button>

                  {/* Mode Toggle */}
                  <div className="text-center pt-2 border-t border-slate-800">
                    <p className="text-sm text-slate-400">
                      {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode(mode === 'login' ? 'signup' : 'login');
                          setLocalError('');
                          clearError();
                        }}
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                      >
                        {mode === 'login' ? 'Sign up' : 'Login'}
                      </button>
                    </p>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
