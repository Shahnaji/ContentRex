import React from 'react';
import { motion } from 'motion/react';

export const Refund: React.FC = () => {
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
            Refund Policy
          </motion.h1>
          <motion.p
            className="text-xl text-[#15616d] text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Last updated: December 23, 2024
          </motion.p>

          <div className="bg-white border-2 border-[#15616d] rounded-2xl p-8 sm:p-12 shadow-xl space-y-8">
            <div className="bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl mb-2">14-Day Money-Back Guarantee</h2>
              <p className="text-[#ffecd1]">
                We stand behind our product. If you're not satisfied with ContentRex AI, we offer a full refund within 14 days of your purchase.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">1. Refund Eligibility</h2>
              <p className="text-[#15616d] mb-4">
                You are eligible for a full refund if you request it within 14 days of:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li>Your initial subscription purchase</li>
                <li>Your subscription renewal date</li>
                <li>Any upgrade to a higher-tier plan</li>
              </ul>
              <p className="text-[#15616d] mt-4">
                The 14-day refund window begins on the date your payment is processed, not the date you first use the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">2. How to Request a Refund</h2>
              <p className="text-[#15616d] mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-[#15616d] space-y-3 ml-4">
                <li>Contact our support team at <strong>refunds@contentrex.ai</strong> within 14 days of your purchase or renewal date</li>
                <li>Include your account email address and transaction ID (if available)</li>
                <li>Briefly explain the reason for your refund request (optional but helpful for improving our service)</li>
                <li>Our team will process your request within 2-3 business days</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">3. Refund Processing</h2>
              <p className="text-[#15616d] mb-4">
                Once your refund request is approved:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li>Refunds are processed to your original payment method</li>
                <li>Processing time: 5-10 business days depending on your bank or payment provider</li>
                <li>You will receive a confirmation email once the refund is initiated</li>
                <li>Your access to ContentRex AI will be terminated upon refund approval</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">4. Free Trial Policy</h2>
              <p className="text-[#15616d] mb-4">
                Our free trial offerings include:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li><strong>Public Free Uses:</strong> 3 free Content Generator uses without sign-up (no refund applicable)</li>
                <li><strong>14-Day Free Trial:</strong> Full access to all features after signing up (no charges during trial)</li>
                <li>If you cancel during the free trial period, you will not be charged</li>
                <li>If you forget to cancel and are charged, the 14-day refund policy applies from the charge date</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">5. Subscription Cancellation vs. Refund</h2>
              <div className="space-y-4 text-[#15616d]">
                <p>
                  <strong>Cancellation:</strong> You can cancel your subscription at any time through your account settings. Upon cancellation, you retain access until the end of your current billing period, but no refund is issued for the remaining time.
                </p>
                <p>
                  <strong>Refund:</strong> If you request a refund within the 14-day window, your subscription is terminated immediately, and you receive a full refund of the most recent payment.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">6. Exceptions and Limitations</h2>
              <p className="text-[#15616d] mb-4">
                Refunds may not be issued in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li>Requests made more than 14 days after the payment date</li>
                <li>Violation of our Terms of Service or Acceptable Use Policy</li>
                <li>Fraudulent activity or abuse of our refund policy</li>
                <li>Multiple refund requests from the same account (we reserve the right to decline repeat refund requests)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">7. Subscription Tier Changes</h2>
              <p className="text-[#15616d] mb-4">
                If you upgrade or downgrade your subscription:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li><strong>Upgrades:</strong> You are eligible for a 14-day refund from the upgrade date</li>
                <li><strong>Downgrades:</strong> Take effect at the end of the current billing period; no partial refunds for downgrades</li>
                <li>Pro-rated charges may apply when changing subscription tiers</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">8. Partial Refunds</h2>
              <p className="text-[#15616d]">
                ContentRex AI does not offer partial refunds. All approved refund requests result in a full refund of the most recent payment only. Previous payments or charges from earlier billing cycles are not eligible for refund.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">9. Payment Disputes and Chargebacks</h2>
              <p className="text-[#15616d] mb-4">
                We encourage you to contact us directly before initiating a chargeback with your bank or payment provider. If you file a chargeback:
              </p>
              <ul className="list-disc list-inside text-[#15616d] space-y-2 ml-4">
                <li>Your account will be immediately suspended</li>
                <li>We will provide documentation to your payment provider showing our 14-day refund policy</li>
                <li>Chargebacks initiated after the 14-day window may be contested</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl text-[#001524] mb-4">10. Contact Information</h2>
              <p className="text-[#15616d] mb-4">
                For refund requests or questions about this policy, please contact us:
              </p>
              <div className="bg-[#ffecd1] rounded-lg p-6">
                <p className="text-[#001524]">
                  <strong>Email:</strong> refunds@contentrex.ai<br />
                  <strong>Support:</strong> support@contentrex.ai<br />
                  <strong>Address:</strong> ContentRex AI Customer Support<br />
                  123 Marketing Street, Suite 100<br />
                  San Francisco, CA 94102, USA
                </p>
                <p className="text-[#15616d] mt-4">
                  <strong>Response Time:</strong> We aim to respond to all refund requests within 2-3 business days.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#ffecd1] to-white border-2 border-[#ff7d00] rounded-lg p-6">
              <h3 className="text-xl text-[#001524] mb-3">Our Commitment to You</h3>
              <p className="text-[#15616d]">
                At ContentRex AI, customer satisfaction is our priority. Our 14-day money-back guarantee ensures you can try our platform risk-free. We believe in the value we provide and are committed to continuous improvement based on your feedback.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
