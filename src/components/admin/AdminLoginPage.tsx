import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Server
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ZStoreLogo } from '../common/ZStoreLogo';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, adminAuthLoading, adminAuthError, setCurrentView } = useStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setValidationError('Please enter your administrator email or username.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your administrator password.');
      return;
    }

    const success = await adminLogin(cleanIdentifier, password);
    if (!success) {
      // Error message is set in store or displayed
    }
  };

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900 text-slate-100 relative overflow-hidden"
      id="zstore-admin-login-page"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Top ZStore brand badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl mb-4">
            <ZStoreLogo size="lg" variant="white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restricted Administration Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrator Authentication
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Authorized personnel only. All access attempts, activities, and changes are logged and monitored.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 p-7 sm:p-9 shadow-2xl">
          {/* Server Error Alert */}
          {(adminAuthError || validationError) && (
            <div
              className="mb-6 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Access Denied</span>
                <span>{validationError || adminAuthError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 sm:py-3.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  id="admin-login-identifier"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Admin Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full text-xs sm:text-sm pl-10 pr-10 py-3 sm:py-3.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium tracking-wide"
                  id="admin-login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Protected by server-side session token validation.</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={adminAuthLoading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              id="admin-login-submit-btn"
            >
              {adminAuthLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Executive Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Return to Public Marketplace */}
          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                if (typeof window !== 'undefined') {
                  window.history.pushState({ view: 'home' }, '', '/');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to ZStore Marketplace
            </button>
          </div>
        </div>

        {/* Security watermark */}
        <div className="text-center mt-6 text-[11px] text-slate-500">
          ZStore Security Protocol • TLS 1.3 End-to-End Encrypted
        </div>
      </div>
    </div>
  );
};
