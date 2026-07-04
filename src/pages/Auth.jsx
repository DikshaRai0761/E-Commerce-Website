import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { authAPI } from '../services/api.js';
import Button from '../components/Button.jsx';

export default function Auth({ id, onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLoginTab) {
        // Handle User Login
        const data = await authAPI.login(email, password);
        setSuccess("Signed in successfully!");
        
        // Pass user object and token to parent
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
          // If they are admin, direct to admin, else home
          if (data.user.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 800);
      } else {
        // Handle User Register
        if (!name.trim()) {
          setError("Name is required.");
          setIsLoading(false);
          return;
        }
        const data = await authAPI.register(name, email, password);
        setSuccess("Account registered successfully!");
        
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
          if (data.user.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 800);
      }
    } catch (err) {
      console.error("Auth submit error:", err);
      setError(err.response?.data?.message || "An authentication error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTab = () => {
    setIsLoginTab(!isLoginTab);
    setError('');
    setSuccess('');
    setName('');
    setEmail('');
    setPassword('');
  };

  // Quick helper to fill in admin demo credentials for testing convenience
  const handleAutoFillAdmin = () => {
    setEmail('admin@shopease.com');
    setPassword('admin123');
    setIsLoginTab(true);
  };

  return (
    <div id={id} className="bg-slate-50 min-h-screen py-16 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-150 mx-auto">
            S
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isLoginTab ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-slate-400 text-xs">
            {isLoginTab ? "Sign in to access your cart and complete checkout." : "Sign up to start saving and logging purchases."}
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1">
          <button
            onClick={() => isLoginTab || toggleTab()}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
              isLoginTab
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => !isLoginTab || toggleTab()}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
              !isLoginTab
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Success/Error displays */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign up only) */}
          {!isLoginTab && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            {!isLoginTab && (
              <span className="text-[10px] text-slate-400 block pt-0.5">Password must be at least 6 characters long.</span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full h-11 pt-2.5"
            isLoading={isLoading}
          >
            <span>{isLoginTab ? "Sign In" : "Register Account"}</span>
          </Button>
        </form>

        {/* Demo Credentials Tip Banner */}
        <div className="bg-amber-50/75 border border-amber-200/50 p-4 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Developer Test Tip</span>
          </div>
          <p className="text-[11px] text-amber-950 leading-relaxed">
            Logging in or signing up with any email containing <strong>'admin'</strong> (e.g. <span className="underline select-all cursor-pointer font-semibold" onClick={handleAutoFillAdmin}>admin@shopease.com</span>) automatically grants Admin CRUD privileges. Click the email link to autofill demo admin credentials.
          </p>
        </div>

      </div>
    </div>
  );
}
