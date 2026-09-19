import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, Calendar } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Green Clean Group",
  description: "Terms and conditions of use for GreenClean Group website and cleaning introductory services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 400px)", minHeight: "85vh", padding: "48px 16px 80px" }}>
      <div className="container" style={{ maxWidth: "860px" }}>

        {/* Breadcrumb / Category Tag */}
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
              <FileText size={13} color="#059669" />
              <span>Legal Documentation</span>
            </div>

            <h1 style={{ fontSize: "2.1rem", fontWeight: "850", color: "var(--slate-900)", letterSpacing: "-0.025em", marginBottom: "8px" }}>
              Terms and Conditions
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
            <p style={{ fontWeight: "500" }}>
              Please read these terms of use carefully before you start using the site as they will create a binding agreement between you and us (GreenClean Group) and will govern our relationship whilst you are using our website. By using our site, you indicate that you have read, understood, considered and you accept these terms of use, and that you agree to abide by them. If you do not agree to these terms of use, please refrain from using our site.
            </p>

            {/* Section 1 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                1. Accessing our site
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>1.1.</strong> Access to our site is permitted on a temporary basis only, and we reserve the right to withdraw or amend the service we provide on our site without notice (see below). We will not be liable if for any reason our site is unavailable at any time or for any period.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>1.2.</strong> From time to time, we, GreenClean Group, may restrict access to some parts of our site, or our entire site.
              </p>
              <p>
                <strong>1.3.</strong> You are responsible for making all arrangements necessary for you to have access to our site. You are also responsible for ensuring that all persons who access our site through your internet connection are aware of these terms, and that they comply with them.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                2. Transactions concluded through our site and our liability to you
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>2.1.</strong> Our role is as/of an introductory agent for providers of a wide range of cleaning and home improvement services and we, GreenClean Group, are authorised by local providers to enter into a contract with you on the service providers’ behalf. We will do this by taking your booking enquiry, allocating the booking to an available service provider (Provider) and then sending you an email confirming the details of your booking and providing a link to the Services Terms and Conditions.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>2.2.</strong> Once you have indicated your agreement to the Services Terms and Conditions and the terms set out in the email using the link provided in the email, a contract will come into existence between you and the Provider.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>2.3.</strong> Your contract is with the Provider and the responsibility for the provision of the services rests solely with the Provider. Please read the Services Terms and Conditions carefully as they will be legally binding on you once you have indicated your agreement to them, directly or by confirming the booked service with the service provider.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>2.4.</strong> Although your contract is with the Provider, we will continue to be your main point of contact whilst the Provider is providing the services that you have requested. Additionally, we may also process all non-cash payments from you on behalf of the Provider.
              </p>
              <p>
                <strong>2.5.</strong> Please note that the responsibility for the provision of the services is the Provider’s alone. You acknowledge and agree that we shall not be held responsible and incur no liability of any kind, under any circumstances whatsoever for the provision of services.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                3. Intellectual Property Rights
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.1.</strong> We, are the owner of all intellectual property in our website, and of the material published on it. Those works are protected by copyright laws and treaties around the world. We, GreenClean Group, any of our subsidiaries, partners, service providers, licensors or any other third parties related to us own and reserve all intellectual property rights and other rights and title in and to the GreenClean Group, and all data and content included therein, including, computer and/or titles, objects, phone recordings, artwork, graphics, designs, photos, pictures, sounds, musical compositions and recordings, and methods of operation.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.2.</strong> We grant you a limited, non-exclusive, non-transferable, revocable license to use and enjoy the GreenClean Group website, for your individual, non-commercial purposes only and expressly conditioned upon your compliance with the terms of this Agreement. Unless otherwise expressly authorised by us in a signed writing, you may not sell, copy, exchange, loan, reverse engineer, decompile, derive script from, translate, lease, grant security interest in, transfer, publish, assign or otherwise distribute any of the GreenClean Group’ intellectual property.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.3.</strong> You acknowledge and agree that unless we grant you a license, in a signed written contract, you may never use any of our trademarks, service marks, trade names, logos, domain names, taglines, or trade dress. Any reproduction, redistribution, or modification of the GreenClean Group and its properties, or use of the GreenClean Group or its properties, not in accordance with this Agreement, is expressly prohibited and may result in civil and/or criminal penalties.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.4.</strong> You acknowledge and agree that you have no claim, right, title, ownership, or other proprietary interest in the contents of the website and/or any other credits accumulated through the GreenClean Group website, regardless of any consideration offered or paid in exchange.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.5.</strong> You acknowledge and agree that GreenClean Group, any of our subsidiaries, partners, service providers, licensors or any other third parties related to us, shall not be liable in any manner for the deletion, modification, impairment, hacking, or any other damage or loss of any kind caused to the content of the website, including deletion of any and all of the website and/or any and all accumulated credits.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.6.</strong> You may print off one copy, and may download extracts, of any page(s) from our site for your personal reference and you may draw the attention of others within your organisation to material posted on our site.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.7.</strong> You must not modify the paper or digital copies of any materials you have printed off or downloaded in any way, and you must not use any illustrations, photographs, video or audio sequences or any graphics separately from any accompanying text.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.8.</strong> Our status (and that of any identified contributors) as the authors of material on our site must always be acknowledged.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.9.</strong> You must not use any part of the materials on our site for commercial purposes without obtaining a licence to do so from us or our licensors.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.10.</strong> If you print off, copy or download any part of our site in breach of these terms of use, your right to use our site will cease immediately and you must, at our option, return or destroy any copies of the materials you have made.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.11.</strong> GreenClean Group are trademarks owned by or licensed to GreenClean Group.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>3.12.</strong> If you’re a copyright owner or agent thereof and believe that content posted on our website, infringes upon your copyright, please submit a notice to the Legal Department with:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>An electronic or physical signature of the person authorised to act on behalf of the copyright owner;</li>
                <li>A description of the copyrighted work that you claim has been infringed;</li>
                <li>The URL of the location on the website containing the material you claim is infringing;</li>
                <li>Your address, telephone number, and email address;</li>
                <li>A statement by you that you have a good faith belief that the disputed use is not authorised by the copyright owner, its agent, or the law; and</li>
                <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or the person authorised to act on the copyright owner’s behalf.</li>
              </ul>
              <p style={{ marginBottom: "8px" }}>
                Email: <a href="mailto:info@greencleangroup.co.uk" style={{ color: "var(--emerald-600)", fontWeight: "600" }}>info@greencleangroup.co.uk</a>
              </p>
              <p>
                Please note that these notifications are legal notices and that GreenClean Group may provide copies of such notices to the participants in the dispute or to third parties, at its discretion or as required by law. The Privacy Policy does not protect information provided in this notices.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                4. Reliance on information posted
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>4.1.</strong> Commentary and other materials posted on our site are not intended to amount to advice on which reliance should be placed.
              </p>
              <p>
                <strong>4.2.</strong> We therefore refuse all liability and responsibility arising from any reliance placed on such materials by any visitor to our site, or by anyone who may be informed of any of its contents.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                5. Our site changes regularly
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>5.1.</strong> We put a lot of effort to improve our services. Thus, our site is updated regularly, and we may change the content at any time. If the need arises, we may suspend access to our site, or close it indefinitely. You agree that we may change, update, suspend or restrict your access to any features, parts or the whole site, at any time, without notice or liability to you. Additionally, you understand and agree that GreenClean Group. might change any system specification requirements necessary to use the site, in such case you are solely responsible to make sure that you meet the requirements for any necessary additional software or hardware, in order to use the site.
              </p>
              <p>
                <strong>5.2.</strong> Any of the material on our site may be out of date at any given time, and we are under no obligation to update any and all materials, whatsoever.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                6. Our liability for the material on the site
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>6.1.</strong> The GreenClean Group and the materials displayed on our site is provided to you on ‘as is’ and ‘as available’ basis, without any guarantees, warranties or representations of any kind, express or implied. To the fullest extent permitted by applicable law, we, other members of our group of companies and third parties connected to us hereby expressly exclude:
              </p>
              <p style={{ paddingLeft: "16px", marginBottom: "6px" }}>
                <strong>6.1.1.</strong> All conditions, warranties and other terms which might otherwise be implied by statute, common law or the law of equity.
              </p>
              <p style={{ paddingLeft: "16px", marginBottom: "6px" }}>
                <strong>6.1.2.</strong> Any liability for any direct, indirect or consequential loss or damage incurred by any user in connection with our website or in connection with the use, inability to use, or results of the use of our website to it and any information and/or materials posted on it, including:
              </p>
              <ul style={{ paddingLeft: "36px", marginBottom: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li><strong>6.1.2.1.</strong> loss of income or revenue;</li>
                <li><strong>6.1.2.2.</strong> loss of business;</li>
                <li><strong>6.1.2.3.</strong> loss of profits or contracts;</li>
                <li><strong>6.1.2.4.</strong> loss of anticipated savings;</li>
                <li><strong>6.1.2.5.</strong> loss of data;</li>
                <li><strong>6.1.2.6.</strong> loss of goodwill;</li>
                <li><strong>6.1.2.7.</strong> wasted management or office time; and whether caused by tort (including negligence), breach of contract or otherwise, even if foreseeable.</li>
              </ul>
              <p>
                <strong>6.2.</strong> This does not affect our liability for death or personal injury arising from our negligence, nor our liability for fraudulent misrepresentation or misrepresentation as to a fundamental matter, nor any other liability which cannot be excluded or limited under applicable law.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                7. Indemnity
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>7.1.</strong> You hereby acknowledge and agree to indemnify, defend and hold harmless GreenClean Group, any of our subsidiaries, partners, service providers, licensors, licensees or any other third parties related to us, our officers and directors from and against any and all claims, lawsuits, damages, losses, liabilities and costs that directly or indirectly arise or result from your use or misuse of the GreenClean Group website and services, any violation by you of any of the provisions of this Agreement or the Privacy Policy or any infringement by you of any third party’s right.
              </p>
              <p>
                <strong>7.2.</strong> GreenClean Group reserves the right, at its own expense and in its sole and absolute discretion, to assume the exclusive defence and control of any matter otherwise subject to indemnification by you, in which even you will cooperate with GreenClean Group in asserting any available defences.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                8. Information about you and your visits to our site
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>8.1.</strong> We monitor and may process information about you in accordance with our Privacy Policy.
              </p>
              <p>
                <strong>8.2.</strong> By using our site, you consent to such processing and you warrant that all data provided by you is accurate.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                9. Uploading material to our site
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>9.1.</strong> Whenever you make use of a feature that allows you to upload material to our site, or to make contact with other users of our site, you must comply with the content standards set out in these terms. You warrant that any such contribution does comply with those standards. In cases where any such contribution does not comply with those standards and is a cause for a claim or a dispute you agree and undertake to indemnify us for any breach of that warranty.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>9.2.</strong> Any material you upload to our site will be considered non-confidential and nonproprietary, and we have the right to use, copy, distribute and disclose to third parties any such material for any purpose. We also have the right to disclose your identity to any third party who is claiming that any material posted or uploaded by you to our site constitutes a violation of their intellectual property rights, or of their right to privacy.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>9.3.</strong> You are responsible and liable for any and all communications, information, images, material, their contents and accuracy transmitted, uploaded or posted to our website by you to us and any third party.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>9.4.</strong> You hereby acknowledge and agree that none of the communications, information, images, material and their contents will not be subject to any obligation, whether of confidentiality, attribution or otherwise, on the part of GreenClean Group, any of our subsidiaries, partners, service providers, licensors, licensees or any other third parties related to us won’t be liable for any and all use or disclosure of the communications, information, images, material and their contents. You waive any moral rights you may have in the content that you have posted to the maximum extent permitted by the laws of your jurisdiction.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>9.5.</strong> You hereby represent, warrant and agree that the communications, information, images, materials and their contents shall not violate any third-party rights.
              </p>
              <p>
                <strong>9.6.</strong> We have the right to remove any material or posting you make on our site if, in our opinion, such material does not comply with the content standards set out in these terms.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                10. Viruses, hacking and other offences
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>10.1.</strong> You must not misuse our site by knowingly introducing viruses, trojans, worms, logic bombs or other material which is malicious or technologically harmful. You must not attempt to gain unauthorised access to our site, the server on which our site is stored or any server, computer or database connected to our site. You must not attack our site via a denial-of-service attack or a distributed denial-of service attack.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>10.2.</strong> By breaching this provision, you would commit a criminal offence under the Computer Misuse Act 1990. We will report any such breach to the relevant law enforcement authorities and we will co-operate with those authorities by disclosing your identity to them. In the event of such a breach, your right to use our site will cease immediately.
              </p>
              <p>
                <strong>10.3.</strong> We will not be liable for any loss or damage caused by a distributed denial-of-service attack, viruses or other technologically harmful material that may infect your computer equipment, computer programs, data or other proprietary material due to your use of our site or to your downloading of any material posted on it, or on any website linked to it.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                11. Linking to our site and removal of links
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>11.1.</strong> You may link to our website, provided you do so in a way that is fair and legal and does not damage our reputation or take advantage of it, but you must not establish a link in such a way as to suggest any form of association or in misleading context.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>11.2.</strong> Appropriate link text should always be used in links pointing to our website.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>11.3.</strong> Our site must not be framed on any other site or use any similar technology in relation to the content of the website. We reserve the right to withdraw linking permission without notice. The website from which you are linking must comply in all respects with the content standards set out in these terms.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>11.4.</strong> If you wish to make any use of material on our site other than that set out above or to link to us for commercial purposes, please address your request to <a href="mailto:info@greencleangroup.co.uk" style={{ color: "var(--emerald-600)", fontWeight: "600" }}>info@greencleangroup.co.uk</a>.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>11.5.</strong> You agree that, should we request the deletion of a link to our website that is within your control, you will delete the link promptly.
              </p>
              <p>
                <strong>11.6.</strong> If you would like us to remove a link to your website that is included on this website, please contact us. Unless you have a legal right to demand removal, such removal will be at our discretion.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                12. Links from our site
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>12.1.</strong> Where our site contains links to other sites and resources provided by third parties, these links are provided for your information only.
              </p>
              <p>
                <strong>12.2.</strong> We have no control over the contents of those sites or resources, and accept no responsibility for them or for any loss or damage that may arise from your use of them.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                13. Limitation of liability
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>13.1.</strong> Under no circumstances, and under no legal theory, whether in contract, tort (including negligence), strict liability or otherwise, shall GreenClean Group be liable to you or any other person for any indirect, incidental, consequential, special, exemplary, or punitive damages of any kind (including, damages for loss of business, loss of data, loss of goodwill, or lost profits), or any damages for gross negligence of any kind (including, damages for work stoppage, or any other commercial damages or losses) arising from your use or misuse of the GreenClean Group, even if GreenClean Group knew or should have known of the possibility of such damages. In no event shall GreenClean Group be liable for any damages in excess of any amount you have paid to GreenClean Group for provision of services, if any, during the six /6/ months immediately prior to the time your cause of action arose.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>13.2.</strong> Notwithstanding the aforementioned limitations of liability nothing in this agreement shall limit GreenClean Group’ liability:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>13.2.1.</strong> for damage from injury to life, body or health due to negligent breach of duty or intentional or negligent breach of duty by a legal representative or a person used to perform an obligation of GreenClean Group;</li>
                <li><strong>13.2.2.</strong> for other damage arising from a grossly negligent breach of duty by GreenClean Group or intentional or negligent breach of duty by a legal representative or a person used to perform an obligation of GreenClean Group;</li>
                <li><strong>13.2.3.</strong> for intentional misconduct;</li>
                <li><strong>13.2.4.</strong> for damage arising from a negligent breach of an obligation that is essential for the performance of the contract by GreenClean Group to the extent that is typical and foreseeable;</li>
                <li><strong>13.2.5.</strong> for any guarantee given by GreenClean Group to you; and</li>
                <li><strong>13.2.6.</strong> for any liability under a jurisdiction’s applicable services liability legislation.</li>
              </ul>
              <p>
                <strong>13.3.</strong> Because certain states or jurisdictions do not allow for exclusion or limitation of liability for certain types of losses or damages, in such states or jurisdictions, the liability of GreenClean Group shall be limited to the fullest extent permitted by applicable law.
              </p>
            </section>

            {/* Section 14 (Alternative dispute resolution, numbered 15 in original text) */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                14. Alternative dispute resolution
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>14.1.</strong> GreenClean Group and you hereby agree to first attempt to informally negotiate any claim or dispute for at least 30 /thirty/ days.
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>14.2.</strong> You shall notify GreenClean Group of any claims that you have by sending a notice to <a href="mailto:info@greencleangroup.co.uk" style={{ color: "var(--emerald-600)", fontWeight: "600" }}>info@greencleangroup.co.uk</a>.
              </p>
              <p>
                <strong>14.3.</strong> This clause shall have no effect on any statutory rights to initiate a court proceeding in case of a dispute and shall not suspend any statutory limitation periods applicable to the bringing of a claim.
              </p>
            </section>

            {/* Section 15 (Variations) */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                15. Variations
              </h2>
              <p>
                <strong>15.1.</strong> We may revise these terms of use at any time by amending this page. You are expected to check this page from time to time to take notice of any changes we made, as they are binding on you. Some of the provisions contained in these terms of use may also be superseded by provisions or notices published elsewhere on our site.
              </p>
            </section>

            {/* Section 16 (Headings) */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                16. Headings
              </h2>
              <p>
                <strong>16.1.</strong> The headings in this Agreement shall have no legal effect whatsoever and are provided for informational purposes only.
              </p>
            </section>

            {/* Section 17 (Term) */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                17. Term
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>17.1.</strong> This Agreement shall be effective as of the date that you indicated that you accept it, whether explicitly or by using the website of GreenClean Group, and shall last as long as you continue using the website of GreenClean Group.
              </p>
              <p>
                <strong>17.2.</strong> You may terminate this agreement by simply ceasing to use the website of GreenClean Group.
              </p>
            </section>

            {/* Section 18 (Entire Agreement) */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                18. Entire Agreement
              </h2>
              <p style={{ marginBottom: "8px" }}>
                <strong>18.1.</strong> This Agreement represents the complete agreement between you and GreenClean Group concerning the use of our website and supersedes any prior or contemporaneous agreements between you and GreenClean Group.
              </p>
              <p>
                <strong>18.2.</strong> This clause shall have no effect and shall coexist with the Terms and Conditions of the actual services, and shall coexist and not supersede any other GreenClean Group policies referenced in this Agreement.
              </p>
            </section>

            {/* Section 19 (Your concerns) */}
            <section>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "750", color: "var(--slate-900)", marginBottom: "8px" }}>
                19. Your concerns
              </h2>
              <p style={{ marginBottom: "16px" }}>
                <strong>19.1.</strong> If you have any concerns about material which appears on our site, please contact <a href="mailto:info@greencleangroup.co.uk" style={{ color: "var(--emerald-600)", fontWeight: "600" }}>info@greencleangroup.co.uk</a>.
              </p>
              <div
                style={{
                  background: "var(--slate-50)",
                  borderLeft: "4px solid var(--emerald-500)",
                  padding: "14px 18px",
                  borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                  fontStyle: "italic",
                  color: "var(--slate-800)"
                }}
              >
                You hereby acknowledge and agree that you have read, understood, considered and accept this Agreement, and that by using or accessing the GreenClean Group website, you are agreeing to be bound by the terms and conditions set forth herein.
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
            <Link href="/book" className="btn btn-primary btn-sm">
              <Calendar size={15} />
              <span>Book a Service</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
