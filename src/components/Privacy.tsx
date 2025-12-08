import React from 'react';
import { motion } from 'motion/react';

export const Privacy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-20 bg-gradient-to-br from-[#ffecd1] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-4xl sm:text-5xl text-[#001524] mb-6 tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-xl text-[#15616d] text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Last updated: December 1, 2025
          </motion.p>

          <div className="bg-white border-2 border-[#15616d] rounded-2xl p-8 sm:p-12 shadow-xl space-y-8">
            <div>
              <h2 className="text-2xl text-[#001524] mb-4">1. Information We Collect</h2>
              <p className="text-[#15616d] mb-4">
                When you use ContentRex AI, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li>Account information (email address, name, password)</li>
                <li>Content you create using our AI tools</li>
                <li>Keywords, topics, and preferences you specify</li>
                <li>Usage data and analytics</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">2. How We Use Your Information</h2>
              <p className="text-[#15616d] mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li>Provide, maintain, and improve our AI content generation services</li>
                <li>Process your requests and deliver the content you generate</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">3. Data Security</h2>
              <p className="text-[#15616d] mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit and at rest, regular security assessments, restricted access to personal information, and secure authentication mechanisms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-[#15616d] mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li>With your consent or at your direction</li>
                <li>With trusted service providers who assist in our operations</li>
                <li>To comply with legal obligations or respond to legal requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">5. Your Rights and Choices</h2>
              <p className="text-[#15616d] mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">6. Cookies and Tracking</h2>
              <p className="text-[#15616d] mb-4">
                We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">7. Data Retention</h2>
              <p className="text-[#15616d] mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time by contacting our support team.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">8. International Data Transfers</h2>
              <p className="text-[#15616d] mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy. For users in the European Economic Area (EEA) and California residents, we comply with GDPR and CCPA requirements.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">9. Changes to This Policy</h2>
              <p className="text-[#15616d]">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">10. Contact Us</h2>
              <p className="text-[#15616d] mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-[#ffecd1] rounded-lg p-6">
                <p className="text-[#001524]">
                  <strong>Email:</strong> privacy@contentrex.ai<br />
                  <strong>Address:</strong> ContentRex AI Privacy Team<br />
                  123 Marketing Street, Suite 100<br />
                  San Francisco, CA 94102, USA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};