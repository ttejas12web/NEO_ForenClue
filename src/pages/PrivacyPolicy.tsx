import { Shield, Lock, Eye, RefreshCw, UserCheck, AlertTriangle, Building2, Mail, Clock } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="py-20 px-4 max-w-4xl mx-auto">
      <SEO 
        title="Privacy Policy | ForenClue"
        description="ForenClue Ventures Privacy Policy. Learn how we collect, use, share, protect, and process your personal data under the laws of India on https://forenclue.in."
        keywords="forenclue privacy policy, forenclue ventures data protection, grievance officer, data retention, indian privacy laws"
        canonicalPath="/privacy"
      />

      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 border border-warning/20 mb-6 shadow-[0_0_30px_rgba(255,165,0,0.2)]">
          <Shield className="text-warning" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 uppercase tracking-tight">
          Privacy <span className="text-warning">Policy</span>
        </h1>
        <p className="text-text-muted text-sm max-w-2xl mx-auto">
          Official Privacy Policy of ForenClue Ventures (&quot;Platform Owner&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;) for the Platform <a href="https://forenclue.in" className="text-warning hover:underline font-medium">https://forenclue.in</a>
        </p>
      </div>

      <div className="space-y-10 text-base text-text-muted leading-relaxed">
        
        {/* 1. Introduction */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 relative overflow-hidden rounded-xl space-y-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            1. Introduction
          </h2>
          <p className="text-sm">
            This Privacy Policy describes how <strong>ForenClue Ventures</strong> and its affiliates (collectively &quot;ForenClue Ventures, we, our, us&quot;) collect, use, share, protect or otherwise process your information/ personal data through our website <a href="https://forenclue.in" className="text-warning hover:underline font-medium">https://forenclue.in</a> (hereinafter referred to as <strong>Platform</strong>).
          </p>
          <p className="text-sm">
            Please note that you may be able to browse certain sections of the Platform without registering with us. We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.
          </p>
        </section>

        {/* 2. Collection */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            2. Collection of Personal Data
          </h2>
          <p className="text-sm">
            We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship and related information provided from time to time.
          </p>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Data Provided During Registration:</strong> Some of the information that we may collect includes but is not limited to personal data / information provided to us during sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number, email ID and/or any such information shared as proof of identity or address.
            </p>
            <p>
              <strong>Sensitive Personal Data:</strong> Some of the sensitive personal data may be collected with your consent, such as your bank account or credit or debit card or other payment instrument information or biometric information such as your facial features or physiological information (in order to enable use of certain features when opted for, available on the Platform) etc., all of the above being in accordance with applicable law(s). You always have the option to not provide information, by choosing not to use a particular service or feature on the Platform.
            </p>
            <p>
              <strong>Usage & Analytical Data:</strong> We may track your behaviour, preferences, and other information that you choose to provide on our Platform. This information is compiled and analysed on an aggregated basis. We will also collect your information related to your transactions on Platform and such third-party business partner platforms. When such a third-party business partner collects your personal data directly from you, you will be governed by their privacy policies. We shall not be responsible for the third-party business partner&apos;s privacy practices or the content of their privacy policies, and we request you to read their privacy policies prior to disclosing any information.
            </p>
          </div>

          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle size={14} className="shrink-0" />
              Anti-Fraud & Credential Security Advisory:
            </p>
            <p>
              If you receive an email or a call from a person/association claiming to be ForenClue Ventures seeking any personal data like debit/credit card PIN, net-banking or mobile banking password, we request you to never provide such information. If you have already revealed such information, report it immediately to an appropriate law enforcement agency.
            </p>
          </div>
        </section>

        {/* 3. Usage */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            3. Usage of Information
          </h2>
          <p className="text-sm">
            We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses. We use your personal data to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-text-main">
            <li>Assist sellers and business partners in handling and fulfilling orders.</li>
            <li>Enhance customer experience and resolve disputes.</li>
            <li>Troubleshoot problems and provide technical support.</li>
            <li>Inform you about online and offline offers, products, services, and updates.</li>
            <li>Customise your experience and tailor educational recommendations.</li>
            <li>Detect and protect us against error, fraud and other criminal activity.</li>
            <li>Enforce our terms and conditions.</li>
            <li>Conduct marketing research, analysis, and surveys, and as otherwise described to you at the time of collection of information.</li>
          </ul>
          <p className="text-xs text-text-muted">
            You understand that your access to these products/services may be affected in the event permission is not provided to us.
          </p>
        </section>

        {/* 4. Sharing */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            4. Sharing of Personal Data
          </h2>
          <p className="text-sm">
            We may share your personal data internally within our group entities, our other corporate entities, and affiliates to provide you access to the services and products offered by them. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out.
          </p>
          <p className="text-sm">
            We may disclose personal data to third parties such as sellers, business partners, third party service providers including logistics partners, prepaid payment instrument issuers, third-party reward programs and other payment opted by you. These disclosures may be required for us to provide you access to our services and products offered to you, to comply with our legal obligations, to enforce our user agreement, to facilitate our marketing and advertising activities, to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our services.
          </p>
          <p className="text-sm">
            We may disclose personal and sensitive personal data to government agencies or other authorised law enforcement agencies if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process. We may disclose personal data to law enforcement offices, third party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms of Use or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.
          </p>
        </section>

        {/* 5. Security Precautions */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            5. Security Precautions
          </h2>
          <p className="text-sm">
            To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures. Once your information is in our possession or whenever you access your account information, we adhere to our security guidelines to protect it against unauthorised access and offer the use of a secure server.
          </p>
          <p className="text-sm">
            However, the transmission of information is not completely secure for reasons beyond our control. By using the Platform, the users accept the security implications of data transmission over the internet and the World Wide Web which cannot always be guaranteed as completely secure, and therefore, there would always remain certain inherent risks regarding use of the Platform. Users are responsible for ensuring the protection of login and password records for their account.
          </p>
        </section>

        {/* 6. Data Deletion and Retention */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            6. Data Deletion and Retention
          </h2>
          <p className="text-sm">
            You have an option to delete your account by visiting your profile and settings on our Platform; this action would result in you losing all information related to your account. You may also write to us at the contact information provided below to assist you with these requests.
          </p>
          <p className="text-sm">
            We may in event of any pending grievance, claims, pending shipments or any other services refuse or delay deletion of the account. Once the account is deleted, you will lose access to the account. We retain your personal data information for a period no longer than is required for the purpose for which it was collected or as required under any applicable law. However, we may retain data related to you if we believe it may be necessary to prevent fraud or future abuse or for other legitimate purposes. We may continue to retain your data in anonymised form for analytical and research purposes.
          </p>
        </section>

        {/* 7. Your Rights & Consent */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            7. Your Rights & Consent
          </h2>
          <p className="text-sm">
            <strong>Your Rights:</strong> You may access, rectify, and update your personal data directly through the functionalities provided on the Platform.
          </p>
          <p className="text-sm">
            <strong>Consent:</strong> By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy. If you disclose to us any personal data relating to other people, you represent that you have the authority to do so and permit us to use the information in accordance with this Privacy Policy.
          </p>
          <p className="text-sm">
            You, while providing your personal data over the Platform or any partner platforms or establishments, consent to us (including our other corporate entities, affiliates, lending partners, technology partners, marketing channels, business partners and other third parties) to contact you through SMS, instant messaging apps, call and/or e-mail for the purposes specified in this Privacy Policy.
          </p>
          <div className="p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5 text-sm space-y-2">
            <h3 className="font-bold text-text-main">Consent Withdrawal Process:</h3>
            <p>
              You have an option to withdraw your consent that you have already provided by writing to the Grievance Officer at the contact information provided below. Please mention <strong>&quot;Withdrawal of consent for processing personal data&quot;</strong> in the subject line of your communication. We may verify such requests before acting on our request. However, please note that your withdrawal of consent will not be retrospective and will be in accordance with the Terms of Use, this Privacy Policy, and applicable laws. In the event you withdraw consent given to us under this Privacy Policy, we reserve the right to restrict or deny the provision of our services for which we consider such information to be necessary.
            </p>
          </div>
          <p className="text-sm">
            <strong>Changes to this Privacy Policy:</strong> Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices. We may alert / notify you about the significant changes to the Privacy Policy, in the manner as may be required under applicable laws.
          </p>
        </section>

        {/* 8. Grievance Officer & Contact Information */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-6">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            8. Grievance Officer & Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-5 bg-base/50 rounded-xl border border-black/5 dark:border-white/5 space-y-3">
              <h3 className="font-bold text-warning uppercase text-xs tracking-wider flex items-center gap-1.5">
                <Building2 size={16} /> Grievance Officer
              </h3>
              <div className="space-y-1 text-text-main text-xs">
                <p><strong>Name of Office:</strong> Grievance Officer</p>
                <p><strong>Designation:</strong> Legal & Compliance Officer</p>
                <p><strong>Company:</strong> ForenClue Ventures</p>
                <p><strong>Registered Address:</strong> Pune, Maharashtra, India</p>
                <p><strong>Email:</strong> <a href="mailto:support@forenclue.in" className="text-warning hover:underline">support@forenclue.in</a></p>
              </div>
            </div>

            <div className="p-5 bg-base/50 rounded-xl border border-black/5 dark:border-white/5 space-y-3">
              <h3 className="font-bold text-warning uppercase text-xs tracking-wider flex items-center gap-1.5">
                <Clock size={16} /> Customer Support & Working Hours
              </h3>
              <div className="space-y-1 text-text-main text-xs">
                <p><strong>Operating Days:</strong> Monday – Friday</p>
                <p><strong>Operating Hours:</strong> 09:00 – 18:00 IST</p>
                <p><strong>Direct Inquiries:</strong> <a href="mailto:forenclue@gmail.com" className="text-warning hover:underline">forenclue@gmail.com</a></p>
                <p><strong>Website:</strong> <a href="https://forenclue.in" className="text-warning hover:underline">https://forenclue.in</a></p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Google API Services Limited Use & DMCA */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            9. Google API Services & DMCA Compliance
          </h2>
          <p className="text-sm">
            ForenClue&apos;s use and transfer to any other app of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-warning hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements. We do not use Google user data for advertising, nor do we transfer or sell user profiles to third parties.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/5 dark:border-white/5">
            <span className="text-xs text-text-muted">Registered with DMCA.com for digital asset copyright protection.</span>
            <a href="https://www.dmca.com/r/8eqg90g" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://images.dmca.com/Badges/DMCA_logo-grn-btn120w.png?ID=cf5061f2-85e0-4a93-981a-645cfa86336c" 
                alt="DMCA.com Protection Status" 
                className="h-7 w-auto"
              />
            </a>
          </div>
        </section>

        {/* 10. Advertising Cookies */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            10. Advertising Cookies and User Choices
          </h2>
          <p className="text-sm">
            Third-party vendors, including Google, may use cookies to serve advertising based on a visitor&apos;s previous visits to this Platform or to other websites. Google&apos;s use of advertising cookies enables Google and its partners to show ads that may be relevant to a visitor based on those visits.
          </p>
          <p className="text-sm">
            Visitors can manage or opt out of personalized advertising through <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-warning hover:underline">Google Ads Settings</a>. Where required by applicable law, we will request consent before using non-essential advertising or measurement cookies. Other advertising partners may use their own cookies subject to their respective privacy policies and opt-out mechanisms.
          </p>
          <p className="text-sm">
            Advertising cookies are separate from information received through Google APIs. As stated above, Google API user data is not used by ForenClue for advertising.
          </p>
        </section>

      </div>
    </div>
  );
}
