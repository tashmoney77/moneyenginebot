import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  useEffect(() => {
    // Update user tier based on URL parameters or webhook
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId && user) {
      // In a real app, you'd verify the session with your backend
      // For now, we'll simulate upgrading to Pro
      updateUser({ tier: 'pro' });
    }
  }, [user, updateUser]);

  const handleContinue = () => {
    window.location.hash = 'chat';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Pro! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your payment was successful and your account has been upgraded.
          </p>

          {/* Features Unlocked */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              You now have access to:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Unlimited coaching questions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">1 experiment per month</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Detailed feedback reports</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Basic dashboard</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Priority email support</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg flex items-center justify-center mx-auto"
            >
              Start Unlimited Coaching
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            
            <p className="text-sm text-gray-500">
              Questions? Email us at support@moneyenginebot.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;