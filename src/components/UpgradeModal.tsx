import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../lib/stripe';
import { Crown, CheckCircle, X, CreditCard, Shield } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'premium'>('pro');

  const plans = {
    pro: {
      name: 'Pro',
      price: '$29',
      priceId: 'price_1RpW1eE26JYO8VJI4bg9F96X', // Your actual Pro price ID
      period: 'month',
      description: 'Perfect for serious founders',
      features: [
        'Unlimited coaching questions',
        '1 experiment per month',
        'Detailed feedback reports',
        'Basic dashboard',
        'Priority email support'
      ],
      popular: true
    },
    premium: {
      name: 'Premium',
      price: '$99',
      priceId: 'price_1RpW4OE26JYO8VJIOhJMReyr', // Your actual Premium price ID
      period: 'month',
      description: 'For scaling startups',
      features: [
        'Everything in Pro',
        'Unlimited experiments',
        'Custom KPI dashboard',
        'Direct admin insights',
        'Real-time messaging',
        'Advanced analytics',
        '1-on-1 strategy calls'
      ],
      popular: false
    }
  };

  const handleUpgrade = async (planType: 'pro' | 'premium') => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('🎯 Starting upgrade process for:', planType);
      console.log('🔑 Using price ID:', plans[planType].priceId);
      console.log('👤 User info:', { id: user.id, email: user.email });
      
      await createCheckoutSession(
        plans[planType].priceId,
        user.id,
        user.email
      );
    } catch (error) {
      console.error('💥 Upgrade failed:', error);
      
      // Show more specific error messages
      let errorMessage = 'Upgrade failed. ';
      
      if (error.message.includes('STRIPE_SECRET_KEY')) {
        errorMessage += 'Payment system not configured. Please contact support.';
      } else if (error.message.includes('404')) {
        errorMessage += 'Function URL issue. Checking logs...';
      } else if (error.message.includes('500')) {
        errorMessage += 'Server error. Please try again or contact support.';
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      console.error('Full error details:', error);
      alert(errorMessage + '\n\nCheck console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Your Plan</h2>
            <p className="text-gray-600">Unlock unlimited coaching and advanced features</p>
          </div>

          {/* Security Badge */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center text-green-800">
              <Shield className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                Secure payment powered by Stripe • Cancel anytime • 30-day money-back guarantee
              </span>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPlan === key
                    ? 'border-blue-600 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                } ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}
                onClick={() => setSelectedPlan(key as 'pro' | 'premium')}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                    selectedPlan === key
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedPlan === key && (
                      <CheckCircle className="h-6 w-6 text-white -m-0.5" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Plan Info */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">
                <strong>Current Plan:</strong> {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                {user.tier === 'free' && (
                  <span className="ml-2 text-blue-600">
                    • {user.questionsAnswered}/3 questions used
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={() => handleUpgrade(selectedPlan)}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Upgrade to {plans[selectedPlan].name}
                </>
              )}
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;