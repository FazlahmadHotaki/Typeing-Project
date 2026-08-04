// components/Login.jsx

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

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
    "contact.namePlaceholder": "Your name",
    "contact.emailPlaceholder": "you@example.com",
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
    "contact.namePlaceholder": "ستاسو نوم",
    "contact.emailPlaceholder": "تاسو@بېلګه.com",
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
    "contact.namePlaceholder": "نام شما",
    "contact.emailPlaceholder": "شما@مثال.com",
  },
};


const Login = ({ onClose, onSwitchToSignup }) => {

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

    console.log({
      email,
      password,
      rememberMe,
    });

    alert("You are not Login. Please Sign up first!");

    onClose();

  };



  return (

    <div className="fixed inset-0 z-50 flex items-center text-white justify-center bg-black/80 backdrop-blur-sm">

      <div className="relative w-full max-w-md mx-4 bg-night3 rounded-2xl border border-white/10 p-8 shadow-2xl">


        {/* Close Button */}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slateink hover:text-cloudwhite transition"
        >

          ✕

        </button>



        {/* Logo */}

        <div className="text-center mb-8">

          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold">

            <img
              src="https://img.icons8.com/?size=100&id=49439&format=png&color=000000"
              alt="logo"
            />

          </div>


          <h2
            className="font-display font-bold text-2xl mt-3"
            data-i18n="login.title"
          >
            Welcome Back
          </h2>


          <p
            className="text-slateink text-sm mt-1"
            data-i18n="login.subtitle"
          >
            Sign in to continue your typing journey
          </p>


        </div>




        <form onSubmit={handleSubmit} className="space-y-5">


          <div>

            <label
              className="block text-sm font-medium text-slateink mb-1.5"
              data-i18n="login.email"
            >
              Email Address
            </label>


            <input

             type="email"
  placeholder="you@example.com"
  data-i18n-placeholder="contact.emailPlaceholder"

              value={email}

              onChange={(e)=>setEmail(e.target.value)}

              className="contact-input"



              required

            />

          </div>




          <div>


            <label
              className="block text-sm font-medium text-slateink mb-1.5"
              data-i18n="login.password"
            >

              Password

            </label>



            <input

              type="password"

              value={password}

              onChange={(e)=>setPassword(e.target.value)}

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

                onChange={(e)=>setRememberMe(e.target.checked)}

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





          <button

            type="submit"

            className="contact-submit"

            data-i18n="login.signIn"

          >

            Sign In

          </button>



        </form>





        <p className="text-center text-sm text-slateink mt-6">


          <span data-i18n="login.noAccount">

            Don't have an account?

          </span>
          {" "}
          <button onClick={onSwitchToSignup} className="text-gold hover:underline font-medium"data-i18n="login.signUp">Sign up free</button>
        </p>
      </div>
    </div>

  );

};


export default Login;