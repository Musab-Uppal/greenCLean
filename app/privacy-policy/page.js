import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Calendar, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Green Clean Group",
  description: "Privacy policy and data protection information for Green Clean Group.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 400px)", minHeight: "85vh", padding: "48px 16px 80px" }}>
      <div className="container" style={{ maxWidth: "860px" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "16px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              color: "var(--emerald-700)",
              fontWeight: "600",
              textDecoration: "none"
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Main Card */}
        <div
          className="glass-card"
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1.5px solid var(--border-subtle)",
            boxShadow: "var(--shadow-lg)",
            padding: "40px 36px"
          }}
        >
          {/* Header */}
          <div style={{ borderBottom: "1px solid var(--slate-200)", paddingBottom: "24px", marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--emerald-50)",
                border: "1px solid var(--emerald-200)",
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                color: "var(--emerald-800)",
                fontSize: "0.75rem",
                fontWeight: "700",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "12px"
              }}
            >
              <Shield size={13} color="#059669" />
              <span>Data Protection</span>
            </div>

            <h1 style={{ fontSize: "2.1rem", fontWeight: "850", color: "var(--slate-900)", letterSpacing: "-0.025em", marginBottom: "8px" }}>
              Privacy Policy
            </h1>

            <p style={{ fontSize: "0.9rem", color: "var(--slate-500)", margin: 0 }}>
              Green Clean Group &bull; greencleangroup.co.uk
            </p>
          </div>

          {/* Body Content */}
          <div
            style={{
              fontSize: "0.925rem",
              lineHeight: "1.75",
              color: "var(--slate-700)",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}
          >

            {/* Who we are */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                Who we are
              </h2>
              <p>
                Our website address is: <a href="https://greencleangroup.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: "var(--emerald-600)", fontWeight: "600" }}>https://greencleangroup.co.uk</a>
              </p>
            </section>

            {/* Comments */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                Comments
              </h2>
              <p style={{ marginBottom: "10px" }}>
                When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.
              </p>
              <p>
                An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--emerald-600)", textDecoration: "underline" }}>https://automattic.com/privacy/</a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.
              </p>
            </section>

            {/* Media */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                Media
              </h2>
              <p>
                If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                Cookies
              </h2>
              <p style={{ marginBottom: "10px" }}>
                If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
              </p>
              <p style={{ marginBottom: "10px" }}>
                If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
              </p>
              <p style={{ marginBottom: "10px" }}>
                When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select &ldquo;Remember Me&rdquo;, your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
              </p>
              <p>
                If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
              </p>
            </section>

            {/* Embedded content from other websites */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                Embedded content from other websites
              </h2>
              <p style={{ marginBottom: "10px" }}>
                Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
              </p>
              <p>
                These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
              </p>
            </section>

            {/* Who we share your data with */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                Who we share your data with
              </h2>
              <p>
                If you request a password reset, your IP address will be included in the reset email.
              </p>
            </section>

            {/* How long we retain your data */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                How long we retain your data
              </h2>
              <p style={{ marginBottom: "10px" }}>
                If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
              </p>
              <p>
                For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
              </p>
            </section>

            {/* What rights you have over your data */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                What rights you have over your data
              </h2>
              <p>
                If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
              </p>
            </section>

            {/* Where your data is sent */}
            <section>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                Where your data is sent
              </h2>
              <p>
                Visitor comments may be checked through an automated spam detection service.
              </p>
            </section>

            {/* Contact & Inquiries */}
            <section style={{ marginTop: "8px" }}>
              <div
                style={{
                  background: "var(--slate-50)",
                  border: "1px solid var(--slate-200)",
                  borderLeft: "4px solid var(--emerald-500)",
                  padding: "16px 20px",
                  borderRadius: "0 var(--radius-sm) var(--radius-sm) 0"
                }}
              >
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "6px" }}>
                  Contact Information
                </h3>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--slate-600)" }}>
                  If you have any questions or data requests regarding this Privacy Policy, please contact us at:
                  <br />
                  Email: <a href="mailto:info@greencleangroup.co.uk" style={{ color: "var(--emerald-600)", fontWeight: "600" }}>info@greencleangroup.co.uk</a> / <a href="mailto:contact@greencleangroup.co.uk" style={{ color: "var(--emerald-600)", fontWeight: "600" }}>contact@greencleangroup.co.uk</a>
                  <br />
                  Phone: <a href="tel:07359068284" style={{ color: "var(--emerald-600)", fontWeight: "600" }}>07359 068 284</a>
                </p>
              </div>
            </section>

          </div>

          {/* Action Row */}
          <div
            style={{
              marginTop: "36px",
              paddingTop: "24px",
              borderTop: "1px solid var(--slate-200)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <Link href="/" className="btn btn-secondary btn-sm">
              &larr; Back to Home
            </Link>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link href="/terms-and-conditions" className="btn btn-secondary btn-sm">
                <FileText size={14} />
                <span>Terms and Conditions</span>
              </Link>
              <Link href="/book" className="btn btn-primary btn-sm">
                <Calendar size={14} />
                <span>Book a Service</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
