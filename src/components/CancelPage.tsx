import React from 'react';
import { XCircle, ArrowLeft, MessageSquare } from 'lucide-react';

const CancelPage: React.FC = () => {
  const handleBackToChat = () => {
    window.location.hash = 'chat';
  };

  const handleTryAgain = () => {
    // This would reopen the upgrade modal
    window.location.hash = 'chat';
    // You could also trigger the upgrade modal here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="h-12 w-12 text-white" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            No Problem!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your payment was cancelled. You can continue using MoneyEngineBot with your current plan.
          </p>

          {/* Current Plan Reminder */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Free Plan Includes:
            </h3>
            <div className="space-y-2 text-gray-700">
              <div>✅ 3 coaching questions</div>
              <div>✅ AI-generated summary</div>
              <div>✅ Basic improvement suggestions</div>
              <div>✅ Email support</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleBackToChat}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg flex items-center justify-center mx-auto"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Continue with Free Plan
            </button>
            
            <button
              onClick={handleTryAgain}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Maybe Later
            </button>
            
            <p className="text-sm text-gray-500 mt-6">
              Ready to upgrade? You can always upgrade later from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;