import { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', form);
    alert('Thanks for reaching out! We\'ll be in touch soon.');
    setForm({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <section className="hp-contact__header">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center' }}>
          <span className="hp-section-label">Contact</span>
          <h1 className="hp-section-title">
            Get in <em>touch</em>
          </h1>
          <p className="hp-section-subtitle">
            Have questions about our platform? Our team is ready to help you get started.
          </p>
        </AnimatedSection>
      </section>

      <section className="hp-contact__body">
        <div className="hp-contact__grid">
          {/* Form */}
          <AnimatedSection className="hp-contact__form-card" animation="fade-up">
            <h2>Send us a message</h2>
            <form onSubmit={handleSubmit}>
              <div className="hp-contact__field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="hp-contact__field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                />
              </div>
              <div className="hp-contact__field">
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                />
              </div>
              <div className="hp-contact__field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your business and how we can help..."
                />
              </div>
              <button type="submit" className="hp-btn hp-btn--primary hp-btn--full">
                Send Message
              </button>
            </form>
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection className="hp-contact__info-card" animation="fade-up" delay={0.15}>
            <div className="hp-contact__info-block">
              <h3>Email</h3>
              <a href="mailto:info@mtrxpay.com">info@mtrxpay.com</a>
            </div>
            <div className="hp-contact__info-block">
              <h3>London Office</h3>
              <p>MTRX PAY LIMITED</p>
              <p>71–75 Shelton Street</p>
              <p>London WC2H 9JQ</p>
              <p>United Kingdom</p>
            </div>
            <div className="hp-contact__info-block">
              <h3>Dubai Office</h3>
              <p>MIDAS TRANSACTION EXCHANGE FZCO</p>
              <p>IFZA Business Park, DDP</p>
              <p>Dubai, UAE</p>
            </div>
            <div className="hp-contact__info-block">
              <h3>Working Hours</h3>
              <p>Monday to Friday</p>
              <p>9:00 AM to 6:00 PM (GMT)</p>
            </div>
            <div className="hp-contact__info-block">
              <h3>For Merchants</h3>
              <p>Already a merchant? Log in to your dashboard for direct support from your dedicated account manager.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
