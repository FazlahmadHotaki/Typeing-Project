// components/Contact.js
import React from 'react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    e.target.reset();
  };

  return (
    <section id="contact" className="contact-section py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-gold text-xs tracking-[0.25em] uppercase mb-3" data-i18n="contact.eyebrow">Get in touch</p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl" data-i18n="contact.title">Let's talk about your typing journey.</h2>
          <p className="text-slateink mt-4 leading-relaxed" data-i18n="contact.subtitle">Have questions, feedback, or want to bring TypeTone to your school? We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="contact-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="contact-icon-box"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 6.5L12 13 2 6.5M2 6.5v11a1.5 1.5 0 001.5 1.5h17a1.5 1.5 0 001.5-1.5v-11"/></svg></div>
                <div><p className="font-medium text-sm text-cloudwhite" data-i18n="contact.emailLabel">Email</p><a href="mailto:hello@typetone.app" className="text-slateink hover:text-gold transition text-sm">hello@typetone.app</a></div>
              </div>
            </div>
            <div className="contact-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="contact-icon-box"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></div>
                <div><p className="font-medium text-sm text-cloudwhite" data-i18n="contact.responseLabel">Response Time</p><p className="text-slateink text-sm" data-i18n="contact.responseText">Within 2 business days</p></div>
              </div>
            </div>
            <div className="contact-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="contact-icon-box"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <div><p className="font-medium text-sm text-cloudwhite" data-i18n="contact.schoolLabel">School Edition</p><p className="text-slateink text-sm" data-i18n="contact.schoolText">Special pricing for schools &amp; institutions</p></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <a href="#" className="social-link" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4l11.733 16h4.267l-11.733-16z"/><path d="M4 20l6.768-6.768M20 4l-7.384 7.384"/></svg></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
              <a href="#" className="social-link" aria-label="YouTube"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/></svg></a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="contact-card rounded-2xl p-8">
              <form id="contactForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="contact.nameLabel">Full Name</label><input type="text" className="contact-input" placeholder="Your name" data-i18n-placeholder="contact.namePlaceholder" /></div>
                  <div><label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="contact.emailLabel">Email</label><input type="email" className="contact-input" placeholder="you@example.com" data-i18n-placeholder="contact.emailPlaceholder" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="contact.subjectLabel">Subject</label><input type="text" className="contact-input" placeholder="How can we help?" data-i18n-placeholder="contact.subjectPlaceholder" /></div>
                <div><label className="block text-sm font-medium text-slateink mb-1.5" data-i18n="contact.messageLabel">Message</label><textarea rows="4" className="contact-input resize-none" placeholder="Write your message here..." data-i18n-placeholder="contact.messagePlaceholder"></textarea></div>
                <button type="submit" className="contact-submit" data-i18n="contact.submitBtn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;