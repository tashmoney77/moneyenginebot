import React from 'react';
import CustomerInterviewTemplate from '../templates/CustomerInterviewTemplate';
import ValidationTracker from '../templates/ValidationTracker';
import { FileText, BarChart3, Download, ArrowLeft } from 'lucide-react';

const ResourcesPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Startup Resources</h1>
          <p className="text-gray-600 mt-1">Templates and tools to accelerate your validation</p>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://calendly.com/tashmoney/moneyenginebot"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg flex items-center"
          >
            📞 Book Strategy Call
          </a>
          <button
            onClick={() => window.location.hash = 'chat'}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Interview Templates</h3>
              <p className="text-gray-600">Ready-to-use customer interview scripts</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Structured templates for problem discovery, solution validation, and pricing conversations.
          </p>
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Problem Discovery</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Solution Validation</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Validation Tracker</h3>
              <p className="text-gray-600">Track your startup validation metrics</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Comprehensive spreadsheet to monitor your validation funnel and key startup metrics.
          </p>
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Funnel Metrics</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">KPI Tracking</span>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-8">
        <CustomerInterviewTemplate />
        <ValidationTracker />
      </div>

      {/* Additional Resources */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Recommended Reading</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• "The Mom Test" by Rob Fitzpatrick</li>
              <li>• "Running Lean" by Ash Maurya</li>
              <li>• "The Lean Startup" by Eric Ries</li>
              <li>• "Talking to Humans" by Giff Constable</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Useful Tools</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Calendly - Schedule interviews</li>
              <li>• Typeform - Create surveys</li>
              <li>• Notion - Organize research</li>
              <li>• Zoom - Conduct remote interviews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;