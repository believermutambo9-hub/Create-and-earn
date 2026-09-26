import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Crown, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin' 
}) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('creator');
  const [category, setCategory] = useState('Comedy');
  const [location, setLocation] = useState('Lusaka, Zambia');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name or brand name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        await signUpWithEmail(email, password, name, role, category, location);
        setSuccessMsg('Account created successfully! Welcome to CREATE & EARN.');
      } else {
        await signInWithEmail(email, password);
        setSuccessMsg('Signed in successfully!');
      }
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      if (
        err?.code !== 'auth/popup-closed-by-user' &&
        err?.code !== 'auth/cancelled-popup-request'
      ) {
        setError(err.message || 'Google sign in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#121824] border border-[#232D42] rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#182030] flex items-center justify-center text-gray-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#FFB800] via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3">
            <Crown className="w-6 h-6 text-black fill-black" />
          </div>
          <h2 className="text-xl font-black text-white font-mono uppercase tracking-wider">
            CREATE & EARN
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {mode === 'signup' 
              ? 'Join Africa’s premier creator economy platform' 
              : 'Sign in to access your scripts, deals & earnings'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#0B0E14] rounded-2xl border border-[#1E2638] mb-5">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-[#FFB800] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-[#FFB800] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* One-click Google Login */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          className="w-full mb-4 py-2.5 px-4 rounded-xl bg-[#1A2335] hover:bg-[#202C42] border border-[#2B3954] text-xs font-bold text-white flex items-center justify-center space-x-2.5 transition active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#1E2638] w-full"></div>
          <span className="bg-[#121824] px-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            or use email
          </span>
          <div className="border-t border-[#1E2638] w-full"></div>
        </div>

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              {/* Role selection */}
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1.5">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('creator')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                      role === 'creator'
                        ? 'border-[#FFB800] bg-[#FFB800]/15 text-[#FFB800]'
                        : 'border-[#232D42] bg-[#0E131F] text-gray-400'
                    }`}
                  >
                    <span>🎭 Creator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('business')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                      role === 'business'
                        ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-[#3B82F6]'
                        : 'border-[#232D42] bg-[#0E131F] text-gray-400'
                    }`}
                  >
                    <span>🏢 Brand / Business</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">
                  {role === 'business' ? 'Business / Agency Name' : 'Full Name / Creator Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'business' ? 'Hungry Lion Zambia' : 'Ace Believer'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="Comedy">Comedy 😂</option>
                    <option value="Love & Relationships">Romance ❤️</option>
                    <option value="Acting">Acting 🎭</option>
                    <option value="Music & Dance">Music 🎵</option>
                    <option value="Business">Business 🍔</option>
                    <option value="Lifestyle">Lifestyle 📱</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    City / Country
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Lusaka, Zambia"
                      className="w-full pl-8 pr-2 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@createandearn.africa"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB800]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB800]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFB800] via-amber-400 to-[#FFA000] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : mode === 'signup' ? 'Create Free Account' : 'Sign In'}
          </button>
        </form>

        {/* Footnote */}
        <p className="text-[10px] text-gray-500 text-center mt-4">
          By continuing, you agree to CREATE & EARN’s Terms of Service and Creator Escrow Policy.
        </p>
      </div>
    </div>
  );
};
