import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Download, 
  CheckCircle, 
  XCircle, 
  Calendar,
  AlertCircle,
  ExternalLink,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from './AuthContext';

interface BillingTabProps {
  user?: any;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
}

interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export function BillingTab({ user }: BillingTabProps) {
  const { getAccessToken } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for real data from backend
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Fetch billing data on mount
  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        toast.error('Please sign in to view billing information');
        return;
      }

      // Fetch subscription
      const subResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/billing/subscription`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (subResponse.ok) {
        const subData = await subResponse.json();
        setCurrentPlan(subData);
      }

      // Fetch payment methods
      const pmResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/billing/payment-methods`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (pmResponse.ok) {
        const pmData = await pmResponse.json();
        setPaymentMethods(pmData);
      }

      // Fetch invoices
      const invResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/billing/invoices`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (invResponse.ok) {
        const invData = await invResponse.json();
        setInvoices(invData);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    toast.info('Redirecting to upgrade page...');
    // Implement upgrade logic
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        toast.error('Please sign in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/billing/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const data = await response.json();
      toast.success(data.message || 'Subscription cancelled. Access until ' + currentPlan.currentPeriodEnd);
      setShowCancelModal(false);
      
      // Refresh billing data
      await fetchBillingData();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  const handleAddPaymentMethod = () => {
    toast.info('Add payment method feature coming soon');
    // Implement add payment method logic
  };

  const handleRemovePaymentMethod = (id: string) => {
    toast.info('Remove payment method feature coming soon');
    // Implement remove payment method logic
  };

  const handleDownloadInvoice = (invoiceUrl: string) => {
    toast.success('Downloading invoice...');
    // Implement download logic
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl text-[#001524] mb-2 tracking-tight">Billing & Subscription</h1>
        <p className="text-[#15616d]">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#ff7d00] animate-spin" />
            <p className="text-[#15616d]">Loading billing information...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Current Plan */}
          {currentPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-[#001524]">Current Plan</h2>
                    {currentPlan.trialEnd && currentPlan.plan === 'free' && (
                      <p className="text-sm text-[#15616d]">
                        Trial ends: {new Date(currentPlan.trialEnd).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
                {currentPlan.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    <XCircle className="w-4 h-4" />
                    Inactive
                  </span>
                )}
              </div>

              <div className="bg-gradient-to-br from-[#ffecd1] to-[#ffecd1]/50 rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl text-[#001524]">${currentPlan.price}</span>
                  <span className="text-[#15616d]">/ {currentPlan.interval}</span>
                </div>
                <h3 className="text-xl text-[#001524] mb-3">{currentPlan.name}</h3>
                <ul className="space-y-2">
                  {currentPlan.features && currentPlan.features.length > 0 ? (
                    currentPlan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-[#15616d]">
                        <CheckCircle className="w-4 h-4 text-[#ff7d00]" />
                        {feature}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-[#15616d]">
                        <CheckCircle className="w-4 h-4 text-[#ff7d00]" />
                        Unlimited content generation
                      </li>
                      <li className="flex items-center gap-2 text-[#15616d]">
                        <CheckCircle className="w-4 h-4 text-[#ff7d00]" />
                        All 28 content types
                      </li>
                      <li className="flex items-center gap-2 text-[#15616d]">
                        <CheckCircle className="w-4 h-4 text-[#ff7d00]" />
                        3 Marketing Intelligence tools
                      </li>
                      <li className="flex items-center gap-2 text-[#15616d]">
                        <CheckCircle className="w-4 h-4 text-[#ff7d00]" />
                        112 country support
                      </li>
                      <li className="flex items-center gap-2 text-[#15616d]">
                        <CheckCircle className="w-4 h-4 text-[#ff7d00]" />
                        Priority support
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-6 border-t-2 border-[#15616d]/20">
                <div className="flex flex-col gap-2">
                  {currentPlan.trialEnd && currentPlan.plan === 'free' && (
                    <div className="flex items-center gap-2 text-[#15616d]">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Trial ends: {new Date(currentPlan.trialEnd).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                  {currentPlan.plan !== 'free' && (
                    <div className="flex items-center gap-2 text-[#15616d]">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {currentPlan.cancelAtPeriodEnd 
                          ? `Access until ${new Date(currentPlan.currentPeriodEnd).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}`
                          : `Next billing date: ${new Date(currentPlan.currentPeriodEnd).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}`
                        }
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleUpgrade}
                    className="px-6 py-2 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Upgrade Plan
                  </button>
                  {!currentPlan.cancelAtPeriodEnd && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-6 py-2 border-2 border-[#15616d] text-[#15616d] rounded-lg hover:bg-[#15616d] hover:text-white transition-colors"
                    >
                      Cancel Plan
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-[#001524]">Payment Methods</h2>
              <button
                onClick={handleAddPaymentMethod}
                className="flex items-center gap-2 px-4 py-2 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Payment Method
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 bg-[#ffecd1] rounded-lg border-2 border-[#15616d]/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#15616d] to-[#001524] rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[#001524]">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-[#ff7d00] text-white rounded text-xs">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#15616d]">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  {!method.isDefault && (
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove payment method"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Billing History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border-2 border-[#15616d] rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl text-[#001524] mb-6">Billing History</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#15616d]/20">
                    <th className="text-left py-3 px-4 text-[#15616d]">Date</th>
                    <th className="text-left py-3 px-4 text-[#15616d]">Amount</th>
                    <th className="text-left py-3 px-4 text-[#15616d]">Status</th>
                    <th className="text-right py-3 px-4 text-[#15616d]">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[#15616d]/10 hover:bg-[#ffecd1]/30 transition-colors">
                      <td className="py-4 px-4 text-[#001524]">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4 text-[#001524]">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(invoice.invoiceUrl)}
                          className="inline-flex items-center gap-1 text-[#ff7d00] hover:text-[#78290f] transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Cancel Subscription Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl text-[#001524]">Cancel Subscription?</h3>
                </div>
                
                <p className="text-[#15616d] mb-6">
                  Are you sure you want to cancel your subscription? You'll still have access until {new Date(currentPlan.currentPeriodEnd).toLocaleDateString()}.
                </p>

                <div className="bg-[#ffecd1] rounded-lg p-4 mb-6">
                  <p className="text-sm text-[#001524]">
                    <strong>What you'll lose:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-[#15616d]">
                    <li>• Unlimited content generation</li>
                    <li>• Marketing Intelligence tools access</li>
                    <li>• Priority support</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancelling}
                    className="flex-1 px-6 py-3 border-2 border-[#15616d] text-[#15616d] rounded-lg hover:bg-[#15616d] hover:text-white transition-colors disabled:opacity-50"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {cancelling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Yes, Cancel'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
}