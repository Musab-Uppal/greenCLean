import Link from 'next/link';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Green Clean Group UK',
  description: 'Learn how Green Clean Group protects and manages your personal data under UK GDPR.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: '4rem 1.5rem', minHeight: '80vh', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '840px', background: 'var(--bg-card)', padding: '3.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <Shield size={16} /> Data Protection & Compliance
        </div>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Last Updated: 15 September 2026 | Compliant with UK Data Protection Act 2018 & UK GDPR
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>1. Introduction</h2>
            <p>
              Green Clean Group (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides eco-friendly domestic and commercial cleaning services across Liverpool, Merseyside, and neighboring areas. We are committed to safeguarding the privacy and security of your personal information when you visit our website (<strong>greencleangroup.co.uk</strong>) or book our professional services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>2. Information We Collect</h2>
            <p style={{ marginBottom: '0.75rem' }}>When you interact with our website or submit a booking reservation, we may collect the following personal details:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Contact Information:</strong> Full name, telephone/mobile number, and email address.</li>
              <li><strong>Service Address:</strong> Property address, postcode, access instructions, and parking details.</li>
              <li><strong>Booking Details:</strong> Selected cleaning packages, chosen date and arrival time slots, special appliance requests, and optional notes.</li>
              <li><strong>Technical Data:</strong> Browser user agent, approximate geographic location, and device analytics collected via cookies to enhance user navigation.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>3. How We Use Your Data</h2>
            <p style={{ marginBottom: '0.75rem' }}>We collect and process your personal data strictly for lawful business purposes:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>To confirm, schedule, and execute your booked eco-cleaning service appointment.</li>
              <li>To dispatch technician notifications (e.g. arrival ETA or access confirmation).</li>
              <li>To provide clear booking invoices, receipts, and customer service follow-ups.</li>
              <li>To process payments securely upon job completion (cash, card, or invoice).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>4. Data Security & Storage</h2>
            <p>
              We implement industry-standard encryption, SSL protocols, and access controls to ensure your sensitive contact details and booking information remain protected against unauthorized access, loss, or disclosure. We never sell, rent, or trade your personal data to third-party marketing companies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>5. Your Statutory Rights</h2>
            <p style={{ marginBottom: '0.75rem' }}>Under the UK GDPR, you have the legal right to:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Request copies of the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete records.</li>
              <li>Request deletion or restriction of your personal data when no longer required for booking fulfillment.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>6. Contact Us Regarding Your Privacy</h2>
            <p>
              If you have questions regarding this Privacy Policy or wish to exercise your data rights, please contact our Data Representative at:
            </p>
            <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>Green Clean Group</p>
              <p style={{ margin: '0.25rem 0' }}>Email: <a href="mailto:contact@greencleangroup.co.uk" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>contact@greencleangroup.co.uk</a></p>
              <p style={{ margin: 0 }}>Telephone: <a href="tel:07359068284" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>07359 068 284</a></p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>Service Headquarters: Liverpool, Merseyside, UK</p>
            </div>
          </section>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/" className="btn btn-secondary">
            &larr; Back to Home
          </Link>
          <Link href="/terms-and-conditions" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
            View Terms & Conditions &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
