// components/Signup.jsx
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Signup({ onClose, onSwitchToLogin, onSignupSuccess }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Here you would normally make an API call to register the user
    // For demo, we'll just call the success callback
    onSignupSuccess({
      name: formData.name,
      email: formData.email
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1D212C] border border-[#2E3444] rounded-2xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#9AA1B4] hover:text-[#ECEEF3] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-[#ECEEF3] mb-2">Create Account</h2>
        <p className="text-[#9AA1B4] text-sm mb-6">Start your typing journey today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#9AA1B4] text-sm mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-[#0f1218] border ${errors.name ? 'border-red-500' : 'border-[#2E3444]'} rounded-lg px-4 py-2 text-[#ECEEF3] focus:outline-none focus:border-[#E8A33D] transition-colors`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[#9AA1B4] text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-[#0f1218] border ${errors.email ? 'border-red-500' : 'border-[#2E3444]'} rounded-lg px-4 py-2 text-[#ECEEF3] focus:outline-none focus:border-[#E8A33D] transition-colors`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[#9AA1B4] text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-[#0f1218] border ${errors.password ? 'border-red-500' : 'border-[#2E3444]'} rounded-lg px-4 py-2 text-[#ECEEF3] focus:outline-none focus:border-[#E8A33D] transition-colors`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[#9AA1B4] text-sm mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-[#0f1218] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#2E3444]'} rounded-lg px-4 py-2 text-[#ECEEF3] focus:outline-none focus:border-[#E8A33D] transition-colors`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#E8A33D] text-[#1a1508] font-bold py-2.5 rounded-lg hover:bg-[#C9832A] transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="text-[#9AA1B4] text-sm text-center mt-4">
          Already have an account?{' '}
          <button 
            onClick={onSwitchToLogin}
            className="text-[#E8A33D] hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}