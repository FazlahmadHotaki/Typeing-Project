// components/Signup.jsx
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../data/translations';
import { useNavigate } from 'react-router-dom';

export default function Signup({  }) {
  const navigate = useNavigate();
const { lang } = useLanguage();  // Translation function
 const t = (key) => {
  return translations[lang]?.[key] || key;
};

const isRTL = lang === "ps" || lang === "da";

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
    
    // Basic validation with translated error messages
    const newErrors = {};
    if (!formData.name) newErrors.name = t('signup.nameRequired');
    if (!formData.email) newErrors.email = t('signup.emailRequired');
    if (!formData.password) newErrors.password = t('signup.passwordRequired');
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('signup.passwordMismatch');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

  navigate("/dashboard");
    // Here you would normally make an API call to register the user
    // For demo, we'll just call the success callback
    
  };

  // Determine text direction based on language

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#1D212C] border border-[#2E3444] rounded-2xl w-full max-w-md p-6 relative animate-fadeIn"
         dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Close button */}
        <button
          onClick={()=> {navigate('/')}}
          className="absolute top-3 right-3 text-[#9AA1B4] hover:text-[#ECEEF3] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-[#ECEEF3] mb-2" data-i18n="signup.title">
          {t('signup.title')}
        </h2>
        <p className="text-[#9AA1B4] text-sm mb-6" data-i18n="signup.subtitle">
          {t('signup.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#9AA1B4] text-sm mb-2" data-i18n="signup.fullName">
              {t('signup.fullName')}
            </label>
            <input
              type="text"
  name="name"
  placeholder={t("signup.namePlaceholder")}
  data-i18n-placeholder="signup.namePlaceholder"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-[#0f1218] border ${errors.name ? 'border-red-500' : 'border-[#2E3444]'} rounded-lg px-4 py-2 text-[#ECEEF3] focus:outline-none focus:border-[#E8A33D] transition-colors`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[#9AA1B4] text-sm mb-2" data-i18n="signup.email">
              {t('signup.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-[#0f1218] border ${errors.email ? 'border-red-500' : 'border-[#2E3444]'} rounded-lg px-4 py-2 text-[#ECEEF3] focus:outline-none focus:border-[#E8A33D] transition-colors`}
              placeholder={t('signup.emailPlaceholder')}
              data-i18n-placeholder="signup.emailPlaceholder"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[#9AA1B4] text-sm mb-2" data-i18n="signup.password">
              {t('signup.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-[#0f1218] border ${errors.password ? 'border-red-500' : 'border-[#2E3444]'} rounded-lg px-4 py-2 text-[#ECEEF3] focus:outline-none focus:border-[#E8A33D] transition-colors`}
              placeholder={t('signup.passwordPlaceholder')}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[#9AA1B4] text-sm mb-2" data-i18n="signup.confirmPassword">
              {t('signup.confirmPassword')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-[#0f1218] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#2E3444]'} rounded-lg px-4 py-2 text-[#ECEEF3] focus:outline-none focus:border-[#E8A33D] transition-colors`}
              placeholder={t('signup.confirmPasswordPlaceholder')}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#E8A33D] text-[#1a1508] font-bold py-2.5 rounded-lg hover:bg-[#C9832A] transition-colors"
            data-i18n="signup.submitButton"
          >
            {t('signup.submitButton')}
          </button>
        </form>

        <p className="text-[#9AA1B4] text-sm text-center mt-4">
          <span data-i18n="signup.alreadyHaveAccount">{t('signup.alreadyHaveAccount')}</span>{' '}
          <button 
            onClick={()=> navigate('/login')}
            className="text-[#E8A33D] hover:underline font-medium"
            data-i18n="signup.loginLink"
          >
            {t('signup.loginLink')}
          </button>
        </p>
      </div>
    </div>
  );
}