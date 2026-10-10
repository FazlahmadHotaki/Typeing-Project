// components/Signup.jsx
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../data/translations';
import { useNavigate } from 'react-router-dom';

export default function Signup({ formData, setFormData, setFindingTure }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  const isRTL = lang === "ps" || lang === "da";

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = t("signup.nameRequired");
    }

    if (!formData.email) {
      newErrors.email = t("signup.emailRequired");
    }

    if (!formData.password) {
      newErrors.password = t("signup.passwordRequired");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("signup.passwordMismatch");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      const userData = {
        name: formData.name,
        email: formData.email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("formData", JSON.stringify(userData));
      localStorage.setItem("usersing", formData.name);

      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);

      alert(
        "Could not connect to the server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto text-stone-900 backdrop-blur-sm p-4 sm:p-6">

      <div
        className="relative my-auto w-full max-w-md rounded-2xl border border-stone-200 bg-[#fdf4c7] p-6 shadow-2xl sm:p-8 lg:max-w-2xl lg:p-12"
        dir={isRTL ? 'rtl' : 'ltr'}
      >

        {/* Close Button */}
        <button
          onClick={() => { navigate('/') }}
          className="absolute right-4 top-4 text-lg text-stone-600 transition hover:text-stone-900 lg:right-5 lg:top-5 lg:text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">

          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold lg:h-14 lg:w-14">
            <img
              src="https://img.icons8.com/?size=100&id=Mvoe3CJ3xK2P&format=png&color=000000"
              alt="logo"
            />
          </div>

          <h2
            className="mt-3 font-display text-2xl font-bold text-stone-900 lg:text-3xl"
            data-i18n="signup.title"
          >
            {t('signup.title')}
          </h2>

          <p
            className="mt-1 text-sm text-stone-700 lg:text-base"
            data-i18n="signup.subtitle"
          >
            {t('signup.subtitle')}
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* On PC: name + email side by side */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Full Name */}
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-stone-700"
                data-i18n="signup.fullName"
              >
                {t('signup.fullName')}
              </label>

              <input
                type="text"
                name="name"
                placeholder={t("signup.namePlaceholder")}
                data-i18n-placeholder="signup.namePlaceholder"
                value={formData.name}
                onChange={handleChange}
                className={`contact-input ${errors.name ? 'border-red-500' : ''}`}
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-stone-700"
                data-i18n="signup.email"
              >
                {t('signup.email')}
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`contact-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder={t('signup.emailPlaceholder')}
                data-i18n-placeholder="signup.emailPlaceholder"
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

          </div>

          {/* On PC: password + confirm side by side */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Password */}
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-stone-700"
                data-i18n="signup.password"
              >
                {t('signup.password')}
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`contact-input ${errors.password ? 'border-red-500' : ''}`}
                placeholder={t('signup.passwordPlaceholder')}
              />

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-stone-700"
                data-i18n="signup.confirmPassword"
              >
                {t('signup.confirmPassword')}
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`contact-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder={t('signup.confirmPasswordPlaceholder')}
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

          </div>

          {/* Submit — max-width on PC so button isn't huge */}
          <div className="lg:mx-auto lg:max-w-sm lg:pt-2">
            <button
              type="submit"
              className="contact-submit w-full"
              data-i18n="signup.submitButton"
            >
              {t('signup.submitButton')}
            </button>
          </div>

        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-stone-700">
          <span data-i18n="signup.alreadyHaveAccount">
            {t('signup.alreadyHaveAccount')}
          </span>{' '}

          <button
            onClick={() => navigate('/login')}
            className="font-medium text-gold hover:underline"
            data-i18n="signup.loginLink"
          >
            {t('signup.loginLink')}
          </button>
        </p>

      </div>

    </div>
  );
}