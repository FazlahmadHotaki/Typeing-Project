// components/Login.jsx
import React, { useState } from 'react';

const Login = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { email, password, rememberMe });
    alert('Login successful!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-night3 rounded-2xl border border-white/10 p-8 shadow-2xl">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slateink hover:text-cloudwhite transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold text-night font-mono font-bold text-xl">
            ⌨
          </div>
          <h2 className="font-display font-bold text-2xl mt-3" data-i18n="login.title">Welcome Back</h2>
          <p className="text-slateink text-sm mt-1" data-i18n="login.subtitle">Sign in to continue your typing journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="login.emailLabel">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="contact-input"
              placeholder="you@example.com"
              data-i18n-placeholder="login.emailPlaceholder"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="login.passwordLabel">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="contact-input"
              placeholder="••••••••"
              data-i18n-placeholder="login.passwordPlaceholder"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slateink">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/10 bg-white/5 text-gold focus:ring-gold"
              />
              <span data-i18n="login.remember">Remember me</span>
            </label>
            <a href="#" className="text-sm text-gold hover:underline" data-i18n="login.forgot">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="contact-submit"
            data-i18n="login.submitBtn"
          >
            Sign In
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-slateink mt-6">
          <span data-i18n="login.noAccount">Don't have an account?</span>{' '}
          <button 
            onClick={onSwitchToSignup}
            className="text-gold hover:underline font-medium"
            data-i18n="login.signupLink"
          >
            Sign up free
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;