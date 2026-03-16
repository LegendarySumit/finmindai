'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, Mail, Lock, Eye, EyeOff, Loader, ArrowLeft, Rocket, Shield, Zap, TrendingUp, Chrome } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
};

export default function AuthPage() {
  const router = useRouter();
  const { loginWithEmail, signupWithEmail, loginWithWallet, loginWithGoogle, signupWithGoogle, isLoading, error, clearError, user } = useAuth();
  const [tab, setTab] = useState<'wallet' | 'email'>('email');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const isProcessingAuth = useRef(false);
  const stayOnAuthPageRef = useRef(false);

  useEffect(() => {
    // Only auto-redirect if we're not in the middle of an active sign-in flow.
    // This avoids redirect races between auth state updates and in-flight handlers.
    if (user?.token && !isProcessingAuth.current && !stayOnAuthPageRef.current) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handleWalletConnect = async () => {
    setLocalError('');
    clearError();
    stayOnAuthPageRef.current = false;
    isProcessingAuth.current = true;

    try {
      await loginWithWallet();
      router.push('/');
    } catch (err: unknown) {
      stayOnAuthPageRef.current = true;
      setLocalError(getErrorMessage(err, 'Wallet connection failed'));
    } finally {
      isProcessingAuth.current = false;
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError('');
    clearError();
    setTab('email');
    stayOnAuthPageRef.current = false;
    isProcessingAuth.current = true;

    try {
      if (mode === 'signup') {
        await signupWithGoogle();
      } else {
        await loginWithGoogle();
      }
      router.push('/');
    } catch (err: unknown) {
      stayOnAuthPageRef.current = true;
      setLocalError(getErrorMessage(err, `Google ${mode} failed`));
    } finally {
      isProcessingAuth.current = false;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    stayOnAuthPageRef.current = false;

    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    isProcessingAuth.current = true;

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        isProcessingAuth.current = false;
        setLocalError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        isProcessingAuth.current = false;
        setLocalError('Password must be at least 8 characters');
        return;
      }

      try {
        await signupWithEmail(email, password);
        router.push('/');
      } catch (err: unknown) {
        stayOnAuthPageRef.current = true;
        setLocalError(getErrorMessage(err, 'Signup failed'));
      } finally {
        isProcessingAuth.current = false;
      }
    } else {
      try {
        await loginWithEmail(email, password);
        router.push('/');
      } catch (err: unknown) {
        stayOnAuthPageRef.current = true;
        setLocalError(getErrorMessage(err, 'Login failed'));
      } finally {
        isProcessingAuth.current = false;
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-finance-dark via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-amber-500/5 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-linear-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-finance-dark/50 backdrop-blur-lg border-b border-slate-700/20">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
            <motion.a
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-1 sm:p-1.5 md:p-2 bg-linear-to-br from-amber-500/10 to-amber-600/10 rounded-md sm:rounded-lg border border-amber-500/20">
                <Rocket className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-finance-gold" />
              </div>
              <span className="text-xs sm:text-sm md:text-lg font-black bg-linear-to-r from-finance-gold to-finance-gold-bright bg-clip-text text-transparent">
                FinMindAI
              </span>
            </motion.a>

            <motion.button
              onClick={() => router.back()}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ArrowLeft className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-2 sm:px-3 md:px-4 pt-14 sm:pt-16 md:pt-20 pb-4 sm:pb-6 md:pb-8">
        <motion.div
          className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center">
            {/* Left Side - Features */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <div className="space-y-6 lg:space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
                    Welcome to<br />
                    <span className="bg-linear-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">FinMind AI</span>
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-400">
                    Secure access to AI-powered financial intelligence
                  </p>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  {[
                    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption for your data' },
                    { icon: Zap, title: 'Instant Access', desc: 'Get started in seconds' },
                    { icon: TrendingUp, title: 'AI Powered', desc: 'Real-time market insights' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-2 sm:gap-3 lg:gap-4 p-3 sm:p-3.5 lg:p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all"
                      whileHover={{ x: 4 }}
                    >
                      <div className="shrink-0">
                        <div className="flex items-center justify-center w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 rounded-lg bg-linear-to-br from-amber-500/20 to-slate-700/20">
                          <item.icon className="w-4 sm:w-4.5 lg:w-5 h-4 sm:h-4.5 lg:h-5 text-amber-400" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-xs sm:text-sm lg:text-base">{item.title}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Auth Forms */}
            <motion.div variants={itemVariants} className="space-y-4 sm:space-y-5 md:space-y-6 w-full">
              {/* Global error banner — shown regardless of active tab */}
              {(localError || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium"
                >
                  {localError || error}
                </motion.div>
              )}

              {/* Tab Buttons */}
              <div className="flex gap-2 sm:gap-2.5 md:gap-3 mb-5 sm:mb-6 md:mb-8">
                <button
                  onClick={() => setTab('wallet')}
                  className={`flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg md:rounded-xl font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 border text-xs sm:text-sm ${
                    tab === 'wallet'
                      ? 'bg-linear-to-r from-amber-500/20 to-amber-600/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Wallet</span>
                </button>
                <button
                  onClick={() => setTab('email')}
                  className={`flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg md:rounded-xl font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 border text-xs sm:text-sm ${
                    tab === 'email'
                      ? 'bg-linear-to-r from-blue-500/20 to-blue-600/20 border-blue-500/40 text-blue-300'
                      : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Email</span>
                </button>
              </div>

              {/* Wallet Auth */}
              {tab === 'wallet' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-4 sm:space-y-5 md:space-y-6"
                >
                  <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-8 border border-slate-700/40 backdrop-blur-xl">
                    <div className="text-center mb-4 sm:mb-5 md:mb-6">
                      <div className="w-11 sm:w-12 md:w-16 h-11 sm:h-12 md:h-16 rounded-lg sm:rounded-xl bg-linear-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center border border-amber-500/30 mx-auto mb-2 sm:mb-3 md:mb-4">
                        <Wallet className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-amber-400" />
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-1 sm:mb-1.5 md:mb-2">Web3 Wallet</h2>
                      <p className="text-xs sm:text-xs md:text-sm text-slate-400">Connect your wallet for secure access</p>
                    </div>

                    <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
                      <motion.button
                        onClick={handleWalletConnect}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-lg md:rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-black transition-all flex items-center justify-center gap-2 sm:gap-2 md:gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="w-4 sm:w-4 md:w-5 h-4 sm:h-4 md:h-5 animate-spin" />
                            <span className="hidden sm:inline">Connecting...</span>
                            <span className="sm:hidden">Connect...</span>
                          </>
                        ) : (
                          <>
                            <Wallet className="w-4 sm:w-4 md:w-5 h-4 sm:h-4 md:h-5" />
                            <span className="hidden sm:inline">Connect MetaMask</span>
                            <span className="sm:hidden">Connect</span>
                          </>
                        )}
                      </motion.button>

                      <p className="text-xs text-slate-500 text-center">
                        MetaMask secure sign-in via Firebase
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email Auth */}
              {tab === 'email' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-3 sm:space-y-4 md:space-y-6"
                >
                  <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-8 border border-slate-700/40 backdrop-blur-xl">
                    <div className="text-center mb-3 sm:mb-4 md:mb-6">
                      <div className="w-11 sm:w-12 md:w-16 h-11 sm:h-12 md:h-16 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center border border-blue-500/30 mx-auto mb-2 sm:mb-3 md:mb-4">
                        <Mail className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-blue-400" />
                      </div>
                      <h2 className="text-lg sm:text-lg md:text-xl font-black text-white mb-0.5 sm:mb-1 md:mb-2">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {mode === 'login' ? 'Sign in to your account' : 'Join the platform'}
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 sm:py-3 rounded-lg border border-slate-600/60 bg-white text-slate-900 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
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
                    </motion.button>

                    <div className="my-3 sm:my-4 flex items-center gap-2">
                      <div className="h-px flex-1 bg-slate-700/40" />
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">or use email</span>
                      <div className="h-px flex-1 bg-slate-700/40" />
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-2.5 sm:space-y-3 md:space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 sm:mb-1.5">
                          Email
                        </label>
                        <motion.input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          whileFocus={{ scale: 1.01 }}
                          className="w-full px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all text-xs sm:text-sm md:text-base"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 sm:mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <motion.input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            whileFocus={{ scale: 1.01 }}
                            className="w-full px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all text-xs sm:text-sm md:text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 sm:right-3.5 md:right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      {mode === 'signup' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 sm:mb-1.5">
                            Confirm Password
                          </label>
                          <motion.input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            whileFocus={{ scale: 1.01 }}
                            className="w-full px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all text-xs sm:text-sm md:text-base"
                          />
                        </div>
                      )}

                      {/* Error */}
                      {(localError || error) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-2 sm:p-2.5 md:p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium"
                        >
                          {localError || error}
                        </motion.div>
                      )}

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 sm:py-3 md:py-3 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-4 md:mt-4 text-xs sm:text-sm md:text-base"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="hidden sm:inline">Processing...</span>
                            <span className="sm:hidden">Loading...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span className="hidden sm:inline">{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                            <span className="sm:hidden">{mode === 'login' ? 'Sign In' : 'Create'}</span>
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-3 sm:mt-3 md:mt-4 pt-3 sm:pt-3 md:pt-4 border-t border-slate-700/30 text-center">
                      <p className="text-xs text-slate-400">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login');
                            setLocalError('');
                            clearError();
                          }}
                          className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                        >
                          {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer */}
              <p className="text-xs text-slate-500 text-center px-1 sm:px-0">
                By continuing, you agree to our <a href="#" className="text-slate-400 hover:text-slate-300">Terms</a> and <a href="#" className="text-slate-400 hover:text-slate-300">Privacy Policy</a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
