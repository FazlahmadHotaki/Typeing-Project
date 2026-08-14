// components/Login.jsx

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { users } from "../data/users";

const translations = {
  en: {
    "login.title": "Welcome Back",
    "login.subtitle": "Sign in to continue your typing journey",
    "login.email": "Email Address",
    "login.emailPlaceholder": "you@example.com",
    "login.password": "Password",
    "login.passwordPlaceholder": "••••••••",
    "login.rememberMe": "Remember me",
    "login.forgotPassword": "Forgot password?",
    "login.signIn": "Sign In",
    "login.noAccount": "Don't have an account?",
    "login.signUp": "Sign up free",
  },

  ps: {
    "login.title": "بیا ښه راغلاست",
    "login.subtitle": "د خپلې ټایپ کولو زده کړې د دوام لپاره ننوتل وکړئ",
    "login.email": "برېښنالیک پته",
    "login.emailPlaceholder": "you@example.com",
    "login.password": "پټنوم",
    "login.passwordPlaceholder": "••••••••",
    "login.rememberMe": "ما په یاد وساته",
    "login.forgotPassword": "پټنوم مو هېر شوی؟",
    "login.signIn": "ننوتل",
    "login.noAccount": "حساب نه لرئ؟",
    "login.signUp": "وړیا نوم‌لیکنه وکړئ",
  },

  da: {
    "login.title": "خوش آمدید",
    "login.subtitle": "برای ادامه مسیر یادگیری تایپ وارد شوید",
    "login.email": "آدرس ایمیل",
    "login.emailPlaceholder": "you@example.com",
    "login.password": "رمز عبور",
    "login.passwordPlaceholder": "••••••••",
    "login.rememberMe": "مرا به خاطر بسپار",
    "login.forgotPassword": "رمز عبور را فراموش کرده‌اید؟",
    "login.signIn": "ورود",
    "login.noAccount": "حساب کاربری ندارید؟",
    "login.signUp": "رایگان ثبت‌نام کنید",
  },
};

const Login = ({ onClose, onSwitchToSignup ,onSignupSuccess}) => {
  const { lang } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const updateLanguage = (language) => {
    const currentLanguage = translations[language];

    if (!currentLanguage) return;

    // Text translation
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;

      if (currentLanguage[key]) {
        element.textContent = currentLanguage[key];
      }
    });

    // Placeholder translation
    document
      .querySelectorAll("[data-i18n-placeholder]")
      .forEach((element) => {
        const key = element.dataset.i18nPlaceholder;

        if (currentLanguage[key]) {
          element.placeholder = currentLanguage[key];
        }
      });
  };

  useEffect(() => {
    updateLanguage(lang);
  }, [lang]);

 const handleSubmit = (e) => {
  e.preventDefault();

  const user = users.find(
    (user) =>
      user.email === email &&
      user.password === password
  );

  if (user) {
    // Use the same success callback pattern as Signup
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    
    // Call the success callback with user data
    onSignupSuccess({
      name: user.name,
      email: user.email,
      
    });
    
    onClose();
  } else {
    // Show error message
    const errorMsg = translations[lang]?.["login.invalidCredentials"] || "Invalid email or password!";
    alert(errorMsg);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-white backdrop-blur-sm">

      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-night3 p-8 shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slateink transition hover:text-cloudwhite"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold">
            <img
              src="https://img.icons8.com/?size=100&id=49439&format=png&color=000000"
              alt="logo"
            />
          </div>

          <h2
            className="mt-3 font-display text-2xl font-bold"
            data-i18n="login.title"
          >
            Welcome Back
          </h2>

          <p
            className="mt-1 text-sm text-slateink"
            data-i18n="login.subtitle"
          >
            Sign in to continue your typing journey
          </p>

        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>

            <label
              className="mb-1.5 block text-sm font-medium text-slateink"
              data-i18n="login.email"
            >
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              data-i18n-placeholder="login.emailPlaceholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="contact-input"
              required
            />

          </div>

          {/* Password */}
          <div>

            <label
              className="mb-1.5 block text-sm font-medium text-slateink"
              data-i18n="login.password"
            >
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

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-sm text-slateink">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/10 bg-white/5 text-gold"
              />

              <span data-i18n="login.rememberMe">
                Remember me
              </span>

            </label>

            <a
              href="#"
              className="text-sm text-gold hover:underline"
              data-i18n="login.forgotPassword"
            >
              Forgot password?
            </a>

          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="contact-submit"
            data-i18n="login.signIn"
onClick={onSignupSuccess}            
          >
            Sign In
          </button>

        </form>

        {/* Sign Up */}
        <p className="mt-6 text-center text-sm text-slateink">

          <span data-i18n="login.noAccount">
            Don't have an account?
          </span>

          {" "}

          <button
            onClick={onSwitchToSignup}
            className="font-medium text-gold hover:underline"
            data-i18n="login.signUp"
          >
            Sign up free
          </button>

        </p>

      </div>

    </div>
  );
};

export default Login;