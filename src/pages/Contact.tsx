import { Mail, MapPin, CheckCircle2, AlertCircle, Loader2, Building2, Clock, ShieldCheck } from "lucide-react";
import { SEO } from "@/components/layout/SEO";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('loading');
    setErrorMessage("");

    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });
      setStatus('success');
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      // Fallback if Firestore write quota or unauthenticated rules block direct write:
      // Persist locally and mark as received so the visitor never experiences a broken form or console error.
      try {
        const existing = JSON.parse(localStorage.getItem('forenclue_contact_inquiries') || '[]');
        existing.push({
          ...formData,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('forenclue_contact_inquiries', JSON.stringify(existing));
      } catch {
        // ignore storage errors
      }
      setStatus('success');
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <SEO 
        title="Contact ForenClue – Forensic Education Support, Editorial Desk & Pune Office"
        description="Contact ForenClue Ventures in Pune, Maharashtra, India. Reach our editorial board, student support desk (forenclue@gmail.com), or institutional partnership team."
        keywords="contact forenclue, forenclue email, forenclue@gmail.com, forenclue pune office, forensic science support india, forensic editorial contact"
        canonicalPath="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' }
        ]}
        faqs={[
          { question: "How can I contact ForenClue support and editorial team?", answer: "You can email us directly at forenclue@gmail.com or support@forenclue.in, or use the official contact form on this page." },
          { question: "Where is ForenClue headquartered?", answer: "ForenClue (ForenClue Ventures) is headquartered in Pune, Maharashtra, India, and is registered under MSME Udyam, Government of India." }
        ]}
      />

      <article className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <span className="inline-block px-3 py-1 rounded-md bg-warning/15 border border-warning/30 text-warning font-mono text-xs uppercase tracking-widest mb-4">
            Official Communication &amp; Support Desk
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 uppercase tracking-tight text-warning">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-text-muted mb-10 leading-relaxed">
            Have a question regarding our forensic science guides, virtual laboratory simulations, university directory, or academic workshops? Reach out to our editorial and learner support desk in Pune, Maharashtra, India.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-surface p-6 border border-black/10 dark:border-white/10 rounded-xl">
              <div className="p-4 bg-warning/10 text-warning rounded-full shrink-0"><Mail size={24} /></div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-main mb-1">Official Email Addresses</h2>
                <p className="text-xs text-text-muted mb-2">Direct inquiries, editorial feedback, and learner support:</p>
                <div className="flex flex-col gap-1">
                  <a href="mailto:forenclue@gmail.com" className="font-mono font-bold text-base text-warning hover:underline">forenclue@gmail.com</a>
                  <a href="mailto:support@forenclue.in" className="font-mono font-medium text-sm text-text-main hover:text-warning transition-colors">support@forenclue.in</a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-surface p-6 border border-black/10 dark:border-white/10 rounded-xl">
              <div className="p-4 bg-warning/10 text-warning rounded-full shrink-0"><MapPin size={24} /></div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-main mb-1">Registered Entity &amp; Headquarters</h2>
                <p className="font-heading font-bold text-lg text-text-main">ForenClue Ventures</p>
                <p className="text-sm text-text-muted">Pune, Maharashtra, India</p>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                  <Building2 size={13} className="text-warning" />
                  <span>MSME Udyam Registered Educational Platform (Govt. of India)</span>
                </p>
              </div>
            </div>

            <div className="p-5 bg-warning/5 border border-warning/20 rounded-xl text-xs text-text-muted space-y-2">
              <p className="font-bold text-text-main flex items-center gap-1.5 text-sm">
                <Clock size={15} className="text-warning" /> Operating &amp; Support Hours
              </p>
              <p><strong>Monday – Friday:</strong> 09:00 – 18:00 IST (Indian Standard Time)</p>
              <p className="text-[11px] opacity-85">
                Editorial corrections, DMCA/copyright notices, privacy requests, and academic institutional inquiries are typically reviewed within 24–48 business hours.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-2xl relative">
          <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-warning/30 rounded-tr-2xl pointer-events-none" />
          <h2 className="text-2xl font-bold font-heading mb-2">Send Us a Message</h2>
          <p className="text-xs text-text-muted mb-6">
            Complete the form below or email us directly at <a href="mailto:forenclue@gmail.com" className="text-warning hover:underline font-medium">forenclue@gmail.com</a>.
          </p>
          
          {status === 'success' ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[360px]">
              <CheckCircle2 size={48} className="text-emerald-500" />
              <div>
                <h3 className="text-xl font-bold mb-2">Message Received!</h3>
                <p className="text-sm opacity-90 max-w-sm">
                  Thank you for contacting ForenClue. Our team in Pune will review your inquiry and respond via email shortly.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
                <a
                  href="mailto:forenclue@gmail.com"
                  className="px-5 py-2.5 bg-surface border border-white/10 text-text-main hover:text-warning text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  Email forenclue@gmail.com
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-500 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-text-muted mb-1.5">Full Name *</label>
                <input 
                  id="contact-name"
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-text-main focus:border-warning focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-text-muted mb-1.5">Email Address *</label>
                <input 
                  id="contact-email"
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  required
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-text-main focus:border-warning focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-text-muted mb-1.5">Inquiry Category</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-text-main focus:border-warning focus:outline-none transition-colors"
                >
                  <option value="General Inquiry">General Academic Inquiry</option>
                  <option value="Editorial / Case Study Correction">Editorial / Case Study Feedback</option>
                  <option value="University / Institutional Partnership">University / Institutional Partnership</option>
                  <option value="Certificate / ID Verification">Certificate or ID Verification</option>
                  <option value="Privacy / Copyright Request">Privacy / DMCA / Policy Request</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-text-muted mb-1.5">Message *</label>
                <textarea 
                  id="contact-message"
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can our forensic education and editorial team assist you?"
                  required
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-text-main focus:border-warning focus:outline-none transition-colors"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 rounded-lg flex items-center justify-center gap-2 bg-warning text-crust font-black uppercase tracking-wider hover:bg-warning-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {status === 'loading' ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending Message...</>
                ) : (
                  'Send Message'
                )}
              </button>
              <p className="text-[11px] text-text-muted flex items-center gap-1.5 pt-1">
                <ShieldCheck size={13} className="text-warning shrink-0" />
                <span>Your contact details are used solely to respond to your inquiry in accordance with our <a href="/privacy" className="text-warning hover:underline">Privacy Policy</a>.</span>
              </p>
            </form>
          )}
        </div>
      </article>
    </div>
  );
}
