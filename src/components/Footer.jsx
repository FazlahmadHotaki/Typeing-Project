// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid sm:grid-cols-3 gap-10 border-t border-white/5">
      <div><a href="#top" className="flex items-center gap-2 font-display font-extrabold text-lg mb-4"><span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gold text-night font-mono font-bold text-sm">⌨</span><span>TypeTone</span></a><p className="text-slateink text-sm" data-i18n="footer.rights">© TypeTone, 2020–2026. All rights reserved.</p></div>
      <div><p className="font-mono text-xs uppercase tracking-widest text-slateink mb-4" data-i18n="footer.contactTitle">Contact</p><p className="text-sm mb-1"><a href="mailto:hello@typetone.app" className="hover:text-gold transition">hello@typetone.app</a></p><p className="text-sm text-slateink" data-i18n="footer.contactNote">We usually reply within two business days.</p></div>
      <div><p className="font-mono text-xs uppercase tracking-widest text-slateink mb-4" data-i18n="footer.linksTitle">Links</p><ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-gold transition" data-i18n="footer.privacy">Privacy Policy</a></li><li><a href="#" className="hover:text-gold transition" data-i18n="footer.terms">Terms of Service</a></li><li><a href="#" className="hover:text-gold transition" data-i18n="footer.about">About us</a></li></ul></div>
    </footer>
  );
};

export default Footer;