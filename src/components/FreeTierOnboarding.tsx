import React, { useState } from 'react';
import { MessageSquare, Target, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

interface FreeTierOnboardingProps {
  onComplete: () => void;
}

const FreeTierOnboarding: React.FC<FreeTierOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to MoneyEngineBot!",
      description: "I'm your AI startup coach, here to help you validate your business idea through proven methodologies.",
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            As a free user, you get <strong>3 strategic questions</strong> to help identify your biggest challenges and opportunities.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">What you'll get:</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                Personalized coaching responses
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                AI-generated summary of insights
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                Actionable improvement suggestions
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Make Your Questions Count",
      description: "To get the most value, focus on your biggest challenges and be specific about your situation.",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Great Questions:</h4>
              <ul className="space-y-1 text-sm text-green-800">
                <li>"How do I validate demand for my B2B SaaS idea?"</li>
                <li>"What's the best way to find my first 10 customers?"</li>
                <li>"How do I know if my pricing is right?"</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">❌ Avoid These:</h4>
              <ul className="space-y-1 text-sm text-red-800">
                <li>"What should I build?"</li>
                <li>"How do I make money?"</li>
                <li>"Is my idea good?"</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start?",
      description: "After your 3 questions, you'll receive a comprehensive summary with next steps and upgrade options.",
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Remember: The more specific and detailed your questions, the better insights you'll receive!
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">After your free questions:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                Get a detailed summary of all insights
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                Receive prioritized action items
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                Option to upgrade for experiment creation
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {currentStepData.description}
            </p>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg flex items-center"
            >
              {currentStep === steps.length - 1 ? 'Start Coaching' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTierOnboarding;