// components/Signup.jsx
import React, { useState } from 'react';

const Signup = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup:', { name, email, password, agreeTerms });
    alert('Account created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-night3 rounded-2xl border border-white/10 p-8 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slateink hover:text-cloudwhite transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold text-night font-mono font-bold text-xl">
            ⌨
          </div>
          <h2 className="font-display font-bold text-2xl mt-3" data-i18n="signup.title">Create Account</h2>
          <p className="text-slateink text-sm mt-1" data-i18n="signup.subtitle">Start your typing journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="signup.nameLabel">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="contact-input"
              placeholder="Your name"
              data-i18n-placeholder="signup.namePlaceholder"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="signup.emailLabel">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="contact-input"
              placeholder="you@example.com"
              data-i18n-placeholder="signup.emailPlaceholder"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="signup.passwordLabel">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="contact-input"
              placeholder="Create a password"
              data-i18n-placeholder="signup.passwordPlaceholder"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-gold focus:ring-gold"
              required
            />
            <label className="text-sm text-slateink">
              <span data-i18n="signup.agreeTerms">I agree to the</span>{' '}
              <a href="#" className="text-gold hover:underline" data-i18n="signup.terms">Terms of Service</a>
              <span data-i18n="signup.and"> and </span>
              <a href="#" className="text-gold hover:underline" data-i18n="signup.privacy">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            className="contact-submit"
            data-i18n="signup.submitBtn"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-slateink mt-6">
          <span data-i18n="signup.hasAccount">Already have an account?</span>{' '}
          <button 
            onClick={onSwitchToLogin}
            className="text-gold hover:underline font-medium"
            data-i18n="signup.loginLink"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;