import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const outputDir = path.join(process.cwd(), "public");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(process.cwd(), "UK_Client_Payment_Requirements_Liverpool.pdf");
const publicOutputPath = path.join(outputDir, "UK_Client_Payment_Requirements_Liverpool.pdf");

console.log("Generating UK Client Payment Requirements PDF...");

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
  info: {
    Title: "Green Clean Group Liverpool - UK Client Payment & Stripe Requirements",
    Author: "Green Clean Group Web Engineering Team",
    Subject: "UK Banking Standards, Stripe Gateway Setup & Merchant Requirements for Liverpool Business",
    Keywords: "Stripe, UK Payments, Sort Code, Account Number, Liverpool, Green Clean Group",
    CreationDate: new Date(),
  },
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const PRIMARY = "#059669";      // Emerald Green
const PRIMARY_DARK = "#065f46"; // Deep Green
const TEXT_DARK = "#0f172a";    // Slate 900
const TEXT_MUTED = "#475569";   // Slate 600
const BORDER_COLOR = "#cbd5e1"; // Slate 300
const BG_LIGHT = "#f8fafc";     // Slate 50
const BG_EMERALD = "#ecfdf5";   // Emerald 50
const ACCENT_GOLD = "#d97706";  // Amber

// Helper for drawing headers
function drawPageHeader(title) {
  doc.save();
  doc.rect(50, 25, 495, 20).fill(BG_LIGHT);
  doc.fillColor(TEXT_MUTED).fontSize(8).font("Helvetica-Bold");
  doc.text("GREEN CLEAN GROUP (LIVERPOOL) | UK PAYMENT COMPLIANCE GUIDE", 55, 30, { align: "left" });
  doc.text("STRICTLY CONFIDENTIAL", 50, 30, { width: 490, align: "right" });
  doc.restore();
}

// =========================================================================
// PAGE 1: TITLE & EXECUTIVE SUMMARY & 2-MODE PAYMENT ARCHITECTURE
// =========================================================================
drawPageHeader();

doc.moveDown(1.5);

// Title Banner
doc.rect(50, 55, 495, 80).fill(PRIMARY);
doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold");
doc.text("UK Merchant Payment Setup & Compliance Guide", 65, 70, { width: 465 });
doc.fontSize(11).font("Helvetica");
doc.text("Requirements for Accepting Online & Local Payments in Liverpool, UK", 65, 96, { width: 465 });
doc.fontSize(9).font("Helvetica-Oblique").fillColor("#d1fae5");
doc.text("Tailored for: Green Clean Group Business Owner | Prepared: September 2026", 65, 115);

doc.y = 150;

// Section 1
doc.fillColor(PRIMARY_DARK).fontSize(14).font("Helvetica-Bold").text("1. Executive Overview & 2 Payment Modes");
doc.moveDown(0.4);

doc.fillColor(TEXT_DARK).fontSize(9.5).font("Helvetica").text(
  "This website is built exclusively for Green Clean Group providing eco-friendly home and oven cleaning services to customers across Liverpool and Merseyside (L1–L39, CH, WA postcodes). To maximize customer bookings while ensuring secure, modern financial operations, the booking engine has been streamlined to support exactly two payment modes:",
  { lineGap: 3 }
);

doc.moveDown(0.8);

// Box 1: Mode 1 - Pay Locally
doc.rect(50, doc.y, 495, 62).fillAndStroke(BG_LIGHT, BORDER_COLOR);
const box1Y = doc.y;
doc.fillColor(PRIMARY_DARK).fontSize(10).font("Helvetica-Bold").text("MODE 1: Pay Locally upon Arrival (Cash or Mobile Card)", 62, box1Y + 8);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font("Helvetica").text(
  "• Customer selects 'I will pay locally (cash or credit card)' at online checkout.\n" +
  "• Booking is confirmed immediately with zero online pre-payment friction.\n" +
  "• Technician collects payment on the day of service via physical cash or handheld card terminal.\n" +
  "• Recorded in your database as: Payment Method = 'local', Payment Status = 'pending'.",
  62, box1Y + 22, { lineGap: 2 }
);

doc.y = box1Y + 72;

// Box 2: Mode 2 - Pay Online (Stripe)
doc.rect(50, doc.y, 495, 62).fillAndStroke(BG_EMERALD, PRIMARY);
const box2Y = doc.y;
doc.fillColor(PRIMARY_DARK).fontSize(10).font("Helvetica-Bold").text("MODE 2: Pay Online with Credit Card via Stripe (Pre-paid)", 62, box2Y + 8);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font("Helvetica").text(
  "• Customer selects 'I will pay now with credit card' at online checkout.\n" +
  "• Processed securely in GBP (£) using the official Stripe UK gateway.\n" +
  "• Fully compliant with UK Strong Customer Authentication (SCA / 3D Secure 2).\n" +
  "• Funds are transferred directly to your UK business bank account on an automated rolling schedule.",
  62, box2Y + 22, { lineGap: 2 }
);

doc.y = box2Y + 75;

// Section 2
doc.fillColor(PRIMARY_DARK).fontSize(13).font("Helvetica-Bold").text("2. UK Banking Requirements for Accepting Payments");
doc.moveDown(0.4);

doc.fillColor(TEXT_DARK).fontSize(9.5).font("Helvetica").text(
  "To receive online customer payments into your business, Stripe UK and UK banking laws require you to link a valid UK sterling bank account. You must provide the following two numbers:",
  { lineGap: 2 }
);

doc.moveDown(0.5);

// Account No Table
const tableY = doc.y;
doc.rect(50, tableY, 495, 20).fill("#1e293b");
doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
doc.text("UK Banking Detail", 60, tableY + 5);
doc.text("Format & Description", 180, tableY + 5);
doc.text("Acceptable Sources", 380, tableY + 5);

const row1Y = tableY + 20;
doc.rect(50, row1Y, 495, 24).fillAndStroke("#ffffff", BORDER_COLOR);
doc.fillColor(TEXT_DARK).fontSize(8.5).font("Helvetica-Bold").text("6-Digit Sort Code", 60, row1Y + 6);
doc.font("Helvetica").fillColor(TEXT_MUTED).text("Format: XX-XX-XX (e.g. 20-45-45). Identifies your UK bank branch.", 180, row1Y + 4, { width: 190 });
doc.text("Bank card, statement, or banking app.", 380, row1Y + 6);

const row2Y = row1Y + 24;
doc.rect(50, row2Y, 495, 24).fillAndStroke(BG_LIGHT, BORDER_COLOR);
doc.fillColor(TEXT_DARK).fontSize(8.5).font("Helvetica-Bold").text("8-Digit Account No", 60, row2Y + 6);
doc.font("Helvetica").fillColor(TEXT_MUTED).text("Format: 8 numerical digits (e.g. 12345678). Your direct bank account.", 180, row2Y + 4, { width: 190 });
doc.text("UK bank statement / online banking.", 380, row2Y + 6);

const row3Y = row2Y + 24;
doc.rect(50, row3Y, 495, 28).fillAndStroke("#ffffff", BORDER_COLOR);
doc.fillColor(TEXT_DARK).fontSize(8.5).font("Helvetica-Bold").text("Account Holder Name", 60, row3Y + 6);
doc.font("Helvetica").fillColor(TEXT_MUTED).text("Must strictly match your Sole Trader legal name or Ltd Company name.", 180, row3Y + 4, { width: 190 });
doc.text("Barclays, HSBC, NatWest, Lloyds, Santander, Starling, Monzo.", 380, row3Y + 4, { width: 160 });

doc.y = row3Y + 38;

// Note Alert
doc.rect(50, doc.y, 495, 34).fillAndStroke(BG_EMERALD, "#10b981");
const alert1Y = doc.y;
doc.fillColor(PRIMARY_DARK).fontSize(8.5).font("Helvetica-Bold").text("Important UK Payout Standard:", 60, alert1Y + 5);
doc.fillColor(TEXT_MUTED).fontSize(8).font("Helvetica").text(
  "Stripe UK transfers all card payments via BACS Faster Payments directly to this UK bank account on a rolling 2-day or weekly schedule. There is no manual withdrawal required; it deposits automatically into your account.",
  60, alert1Y + 16, { width: 475 }
);

// =========================================================================
// PAGE 2: UK LEGAL COMPLIANCE & STRIPE ONBOARDING CHECKLIST
// =========================================================================
doc.addPage();
drawPageHeader();

doc.y = 55;

doc.fillColor(PRIMARY_DARK).fontSize(14).font("Helvetica-Bold").text("3. UK Legal Entity & Identity Verification (KYC / AML)");
doc.moveDown(0.3);

doc.fillColor(TEXT_DARK).fontSize(9.5).font("Helvetica").text(
  "Under UK Financial Conduct Authority (FCA) anti-money laundering regulations, every merchant accepting card payments in the UK must complete basic identity verification. Depending on how your business is registered in the UK, you need to provide:",
  { lineGap: 2 }
);

doc.moveDown(0.6);

// Sole Trader vs Ltd Company comparison
const compY = doc.y;
const colWidth = 240;

// Sole Trader Column
doc.rect(50, compY, colWidth, 140).fillAndStroke(BG_LIGHT, BORDER_COLOR);
doc.fillColor(PRIMARY_DARK).fontSize(10).font("Helvetica-Bold").text("IF SOLE TRADER (Self-Employed):", 60, compY + 8);
doc.fillColor(TEXT_MUTED).fontSize(8).font("Helvetica").text(
  "1. Full Legal Name & Date of Birth\n" +
  "   (Must match official UK identity documents).\n\n" +
  "2. National Insurance (NI) Number\n" +
  "   (e.g., QQ 12 34 56 A).\n\n" +
  "3. Unique Taxpayer Reference (UTR)\n" +
  "   10-digit number issued by HMRC for UK tax.\n\n" +
  "4. Proof of Liverpool Address\n" +
  "   UK Council tax bill, utility bill, or bank\n" +
  "   statement dated within the last 3 months.\n\n" +
  "5. Valid UK Photo ID\n" +
  "   UK Passport or UK Photocard Driving Licence.",
  60, compY + 24, { width: colWidth - 20, lineGap: 1.5 }
);

// Limited Company Column
doc.rect(305, compY, colWidth, 140).fillAndStroke(BG_LIGHT, BORDER_COLOR);
doc.fillColor(PRIMARY_DARK).fontSize(10).font("Helvetica-Bold").text("IF LIMITED COMPANY (Ltd):", 315, compY + 8);
doc.fillColor(TEXT_MUTED).fontSize(8).font("Helvetica").text(
  "1. Companies House Registration Number (CRN)\n" +
  "   8-digit company number (e.g., 12345678).\n\n" +
  "2. Company Legal Name & Registered Office\n" +
  "   As officially recorded at Companies House.\n\n" +
  "3. VAT Number (If Registered)\n" +
  "   If turnover exceeds £90,000 threshold, or state\n" +
  "   'Not VAT Registered'.\n\n" +
  "4. Director & Significant Owner Details\n" +
  "   Full name, address, DOB, and photo ID for\n" +
  "   shareholders holding 25% or more.\n\n" +
  "5. UK Business Bank Account Details\n" +
  "   Account must be in the exact limited company name.",
  315, compY + 24, { width: colWidth - 20, lineGap: 1.5 }
);

doc.y = compY + 152;

// Section 4: Stripe Dashboard Settings for Liverpool
doc.fillColor(PRIMARY_DARK).fontSize(13).font("Helvetica-Bold").text("4. Stripe Account Setup Checklist for Liverpool Business");
doc.moveDown(0.3);

doc.fillColor(TEXT_DARK).fontSize(9).font("Helvetica").text(
  "When you log in to Stripe (https://dashboard.stripe.com) to complete your merchant onboarding, enter these exact settings:",
  { lineGap: 2 }
);

doc.moveDown(0.5);

const confTableY = doc.y;
doc.rect(50, confTableY, 495, 18).fill("#1e293b");
doc.fillColor("#ffffff").fontSize(8.5).font("Helvetica-Bold");
doc.text("Stripe Setting Field", 60, confTableY + 5);
doc.text("Recommended Setting for Green Clean Group", 200, confTableY + 5);

const cRows = [
  { f: "Country & Currency", v: "United Kingdom (GB) | British Pound (£ / GBP)" },
  { f: "Industry / MCC Code", v: "Cleaning, Janitorial, & Maintenance Services (MCC: 7349)" },
  { f: "Statement Descriptor", v: "GREENCLEAN LIV (Appears on customer bank statements - max 22 chars)" },
  { f: "Support Phone Number", v: "07359 068284 (UK mobile for customer booking dispatch)" },
  { f: "Support Email", v: "contact@greencleangroup.co.uk (Official contact mailbox)" },
  { f: "Website URL", v: "https://greencleangroup.co.uk (Includes Terms & Cancellation policies)" },
  { f: "Payout Schedule", v: "Automatic Rolling 2-day or weekly direct to your UK bank account" },
];

let currY = confTableY + 18;
cRows.forEach((r, idx) => {
  const bg = idx % 2 === 0 ? "#ffffff" : BG_LIGHT;
  doc.rect(50, currY, 495, 20).fillAndStroke(bg, BORDER_COLOR);
  doc.fillColor(TEXT_DARK).fontSize(8).font("Helvetica-Bold").text(r.f, 60, currY + 5);
  doc.fillColor(TEXT_MUTED).fontSize(8).font("Helvetica").text(r.v, 200, currY + 5);
  currY += 20;
});

doc.y = currY + 12;

// Section 5: API Keys Handover
doc.fillColor(PRIMARY_DARK).fontSize(13).font("Helvetica-Bold").text("5. Handing Over Stripe API Keys to Activate the Website");
doc.moveDown(0.3);

doc.fillColor(TEXT_DARK).fontSize(9).font("Helvetica").text(
  "Once your Stripe account is verified, you must copy 2 keys from your Stripe Dashboard and provide them to your web developer so customer card payments go directly to you:",
  { lineGap: 2 }
);

doc.moveDown(0.4);

// API Keys Box
doc.rect(50, doc.y, 495, 68).fillAndStroke(BG_LIGHT, BORDER_COLOR);
const apiBoxY = doc.y;
doc.fillColor(TEXT_DARK).fontSize(8.5).font("Helvetica-Bold").text("Step-by-Step API Key Retrieval:", 60, apiBoxY + 8);
doc.fillColor(TEXT_MUTED).fontSize(8).font("Helvetica").text(
  "1. Log into https://dashboard.stripe.com\n" +
  "2. Switch toggle at the top left from 'Test mode' to 'Live mode'.\n" +
  "3. Navigate to: Developers > API Keys.\n" +
  "4. Copy your Publishable Key (starts with pk_live_...) -> Website Frontend.\n" +
  "5. Click 'Reveal live key' and copy Secret Key (starts with sk_live_...) -> Website Backend (.env).\n" +
  "6. Send these keys securely to your web developer to paste into the server configuration.",
  60, apiBoxY + 20, { lineGap: 1.8 }
);

// =========================================================================
// PAGE 3: TRANSACTION FEES, FAQS & SUMMARY CHECKLIST
// =========================================================================
doc.addPage();
drawPageHeader();

doc.y = 55;

doc.fillColor(PRIMARY_DARK).fontSize(14).font("Helvetica-Bold").text("6. Stripe UK Transaction Pricing & Fee Structure");
doc.moveDown(0.3);

doc.fillColor(TEXT_DARK).fontSize(9.5).font("Helvetica").text(
  "Stripe UK operates on a pay-as-you-go model with no monthly subscription, no terminal rental fee, and no setup charge. You are only charged when you successfully receive a customer booking:",
  { lineGap: 2 }
);

doc.moveDown(0.5);

// Pricing Table
const priceTableY = doc.y;
doc.rect(50, priceTableY, 495, 18).fill("#1e293b");
doc.fillColor("#ffffff").fontSize(8.5).font("Helvetica-Bold");
doc.text("Card Type / Payment Method", 60, priceTableY + 5);
doc.text("Stripe UK Fee per Transaction", 220, priceTableY + 5);
doc.text("Example: £65.00 Oven Clean", 370, priceTableY + 5);

const feeRows = [
  { t: "Standard UK Debit / Credit Cards (Visa, Mastercard)", f: "1.5% + 20p", ex: "Fee: £1.18 | You Receive: £63.82" },
  { t: "UK Commercial / Business Cards & Amex", f: "1.9% + 20p", ex: "Fee: £1.44 | You Receive: £63.56" },
  { t: "Pay Locally on Arrival (Cash to Technician)", f: "0.0% (Zero Fee)", ex: "Fee: £0.00 | You Receive: £65.00" },
  { t: "Payouts to UK Bank Account via BACS / Faster Pay", f: "FREE (£0.00)", ex: "Transferred automatically every 2 days" }
];

let feeY = priceTableY + 18;
feeRows.forEach((r, idx) => {
  const bg = idx === 2 ? BG_EMERALD : idx % 2 === 0 ? "#ffffff" : BG_LIGHT;
  doc.rect(50, feeY, 495, 22).fillAndStroke(bg, BORDER_COLOR);
  doc.fillColor(TEXT_DARK).fontSize(8).font("Helvetica-Bold").text(r.t, 60, feeY + 6);
  doc.fillColor(idx === 2 ? PRIMARY_DARK : TEXT_MUTED).fontSize(8).font("Helvetica").text(r.f, 220, feeY + 6);
  doc.fillColor(idx === 2 ? PRIMARY_DARK : TEXT_MUTED).fontSize(8).font("Helvetica-Oblique").text(r.ex, 370, feeY + 6);
  feeY += 22;
});

doc.y = feeY + 16;

// Section 7: Summary Action Checklist
doc.fillColor(PRIMARY_DARK).fontSize(13).font("Helvetica-Bold").text("7. Action Checklist for the Business Owner");
doc.moveDown(0.3);

doc.fillColor(TEXT_DARK).fontSize(9).font("Helvetica").text(
  "Complete these 6 simple steps to start receiving card payments from Liverpool customers:",
  { lineGap: 2 }
);

doc.moveDown(0.4);

const checkItems = [
  { num: "[ ] 1", title: "Open / Prepare UK Bank Account", desc: "Ensure you have your 6-digit Sort Code and 8-digit Account Number ready." },
  { num: "[ ] 2", title: "Have UK Tax & Identification Ready", desc: "Have your UTR (if Sole Trader) or CRN (if Ltd) plus photo ID and proof of address." },
  { num: "[ ] 3", title: "Sign Up at Stripe.com", desc: "Go to https://dashboard.stripe.com/register and select United Kingdom." },
  { num: "[ ] 4", title: "Fill In Business Details", desc: "Set Statement Descriptor to 'GREENCLEAN LIV' and support phone to 07359 068284." },
  { num: "[ ] 5", title: "Activate Live Mode", desc: "Complete verification, switch to Live mode, and copy your live API Keys." },
  { num: "[ ] 6", title: "Provide Keys to Developer", desc: "Send your Publishable & Secret Keys to your developer to activate live payments." }
];

let checkY = doc.y;
checkItems.forEach((c) => {
  doc.rect(50, checkY, 495, 26).fillAndStroke("#ffffff", BORDER_COLOR);
  doc.fillColor(PRIMARY).fontSize(9).font("Helvetica-Bold").text(c.num, 58, checkY + 7);
  doc.fillColor(TEXT_DARK).fontSize(8.5).font("Helvetica-Bold").text(c.title + " – ", 95, checkY + 7);
  const titleWidth = doc.widthOfString(c.title + " – ");
  doc.fillColor(TEXT_MUTED).font("Helvetica").text(c.desc, 95 + titleWidth, checkY + 7, { width: 440 - titleWidth });
  checkY += 28;
});

doc.y = checkY + 14;

// Sign-off box
doc.rect(50, doc.y, 495, 50).fillAndStroke(BG_LIGHT, PRIMARY);
const signY = doc.y;
doc.fillColor(PRIMARY_DARK).fontSize(9).font("Helvetica-Bold").text("Technical Support & Assistance:", 60, signY + 8);
doc.fillColor(TEXT_MUTED).fontSize(8).font("Helvetica").text(
  "If you need assistance during your Stripe onboarding or have questions regarding UK banking verification, your web development team is available to assist you at every step.\nWebsite: https://greencleangroup.co.uk | Serving Liverpool & Merseyside with 100% Eco-Friendly Care.",
  60, signY + 20, { width: 475, lineGap: 2 }
);

// Add page numbers on all pages
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  doc.fillColor(TEXT_MUTED).fontSize(8).font("Helvetica");
  doc.text(
    `Green Clean Group (Liverpool) UK Payment Compliance Guide | Page ${i + 1} of ${totalPages}`,
    50,
    doc.page.height - 35,
    { align: "center", width: 495 }
  );
}

doc.end();

writeStream.on("finish", () => {
  // Also copy to public directory for direct download / viewing via web browser
  try {
    fs.copyFileSync(outputPath, publicOutputPath);
  } catch (err) {
    console.error("Error copying to public:", err);
  }
  console.log(`PDF successfully generated at: ${outputPath}`);
  console.log(`Public downloadable copy at: ${publicOutputPath}`);
});
