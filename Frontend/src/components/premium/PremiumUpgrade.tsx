import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface PremiumFeature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const PremiumUpgrade: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const features: PremiumFeature[] = [
    {
      title: 'Relationship Dynamics Assessment',
      description: 'Understand your attachment style and love languages',
      icon: <StarIcon className="w-5 h-5" />
    },
    {
      title: 'Career Alignment Profile',
      description: 'Discover careers that match your personality',
      icon: <StarIcon className="w-5 h-5" />
    },
    {
      title: 'Emotional Intelligence Mapping',
      description: 'Map your EQ to your personality profile',
      icon: <StarIcon className="w-5 h-5" />
    },
    {
      title: 'Leadership Potential Analysis',
      description: 'Uncover your leadership style and potential',
      icon: <StarIcon className="w-5 h-5" />
    },
    {
      title: 'Creative Expression Profile',
      description: 'Explore how personality influences creativity',
      icon: <StarIcon className="w-5 h-5" />
    },
    {
      title: 'Unlimited Team Comparisons',
      description: 'Compare personalities with family, friends, and colleagues',
      icon: <StarIcon className="w-5 h-5" />
    }
  ];

  const handlePurchase = async () => {
    if (!user) {
      setError('Please sign in to unlock premium features');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await api.createPaymentIntent();

      // For demo/placeholder, we'll simulate successful payment
      // In production, integrate Stripe Elements here
      setShowPaymentForm(true);

      // Simulate payment processing
      setTimeout(async () => {
        try {
          // Confirm purchase
          await api.confirmPurchase(paymentIntentId);
          
          // Reload page to update premium status
          window.location.reload();
        } catch (err) {
          setError('Payment processing failed. Please try again.');
        } finally {
          setLoading(false);
          setShowPaymentForm(false);
        }
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  if (showPaymentForm) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing payment...</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Demo Mode: In production, Stripe payment form would appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Unlock Your Full Potential</h1>
            <p className="text-xl opacity-90 mb-8">
              Get lifetime access to all premium assessments and features
            </p>
            <div className="inline-flex items-center justify-center">
              <span className="text-5xl font-bold">$24.99</span>
              <span className="ml-3 text-lg opacity-75">one-time payment</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Everything included in Premium:
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    {feature.icon || <CheckIcon className="w-5 h-5 text-purple-600" />}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="px-8 py-8 bg-gray-50">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">7</div>
              <div className="text-gray-600 mt-1">Premium Assessments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-gray-600 mt-1">Team Comparisons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">1</div>
              <div className="text-gray-600 mt-1">Lifetime Payment</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-8 py-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105'
              }`}
          >
            {loading ? 'Processing...' : 'Unlock Premium Features Now'}
          </button>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              <LockClosedIcon className="w-4 h-4 inline mr-1" />
              Secure payment • No recurring charges
            </p>
            <p className="text-xs text-gray-500">
              30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Is this really a one-time payment?
            </h3>
            <p className="text-gray-600">
              Yes! Pay once and get lifetime access to all current and future premium features.
              No subscriptions, no hidden fees.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              What happens after I pay?
            </h3>
            <p className="text-gray-600">
              You'll immediately get access to all premium assessments and features.
              Your account will be permanently upgraded.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Can I share my premium access?
            </h3>
            <p className="text-gray-600">
              Premium access is tied to your personal account. However, you can create
              unlimited teams and invite others to compare personalities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgrade;