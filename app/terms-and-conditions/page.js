import Link from 'next/link';
import { Scale, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Green Clean Group UK',
  description: 'Terms of service, booking policies, minimum order values, and cancellation guidelines for Green Clean Group.',
};

export default function TermsAndConditionsPage() {
  return (
    <div style={{ padding: '4rem 1.5rem', minHeight: '80vh', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '840px', background: 'var(--bg-card)', padding: '3.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <Scale size={16} /> Service Agreement & Policies
        </div>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Effective Date: 15 September 2026 | Green Clean Group (greencleangroup.co.uk)
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>1. Scope of Agreement</h2>
            <p>
              By accessing our website or booking any domestic or commercial cleaning service with Green Clean Group, you agree to be bound by the terms, rates, and policies outlined herein. These terms apply to all cleaning bookings across Liverpool, Merseyside, Greater Manchester, Cheshire, and Lancashire.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>2. Minimum Booking Value</h2>
            <p>
              All direct service bookings are subject to a <strong>minimum order value of £50.00</strong> (excluding promotional discounts). Bookings that fall below this threshold cannot be dispatched unless bundled with additional cleaning items (e.g. extractor fan, hob, or microwave add-on).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>3. Eco-Friendly Products & Safety</h2>
            <p>
              Green Clean Group guarantees the use of 100% biodegradable, non-caustic, fume-free, and pet-friendly cleaning detergents. Our dip-tank soaking systems and steam-assisted tools are safe for food preparation areas immediately upon completion of the service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>4. Property Access & Utilities</h2>
            <p>
              Customers must ensure that our cleaning specialists are provided with:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <li>Safe access to the premises at the agreed arrival time window.</li>
              <li>A working supply of hot and cold running water and electricity.</li>
              <li>Legal parking or a valid visitor parking permit where on-street restrictions apply.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>5. Cancellations & Rescheduling</h2>
            <p>
              We understand that schedules change. You may reschedule or cancel your appointment free of charge by giving at least <strong>24 hours notice</strong> prior to your scheduled time slot. Cancellations made with less than 24 hours notice or non-access on arrival may incur a £25 call-out administration fee.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>6. Payment Terms</h2>
            <p>
              Payment is due upon successful completion and inspection of the cleaning service. We accept:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <li>Cash directly to the technician on-site.</li>
              <li>Credit / Debit card payments via our mobile chip-and-pin card reader.</li>
              <li>Bank BACS transfer for verified commercial or landlord tenancy accounts.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>7. 100% Satisfaction Guarantee</h2>
            <p>
              We take pride in our 5-star reputation. If any inspected area does not meet our high standards, notify us within 24 hours of completion and we will return to reclean the affected item at no additional charge.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/" className="btn btn-secondary">
            &larr; Back to Home
          </Link>
          <Link href="/book" className="btn btn-primary">
            Book a Clean Now
          </Link>
        </div>

      </div>
    </div>
  );
}
