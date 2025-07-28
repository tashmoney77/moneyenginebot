import React from 'react';
import { Download, BarChart3, Target, TrendingUp } from 'lucide-react';

const ValidationTracker: React.FC = () => {
  const downloadTracker = () => {
    const csvContent = `CORE VALIDATION METRICS,,,,,
Validation Stage,Target,Actual,Conversion Rate,Notes,Date
Problem Interviews,20,0,0%,,
Problem Validation Rate,70%,0%,,,
Solution Interviews,15,0,0%,,
Solution Interest Rate,67%,0%,,
Pricing Conversations,10,0,0%,,
Budget Confirmation Rate,60%,0%,,
Landing Page Visitors,100,0,0%,,
Email Signups,20,0,20%,,
Demo Requests,5,0,25%,,
Pilot Customers,5,0,100%,,
Pilot to Paid Conversion,3,0,60%,,
Monthly Recurring Revenue,$0,0,,,
Customer Acquisition Cost,$0,0,,,
,,,,,
ADDITIONAL METRICS,,,,,
Validation Stage,Target,Actual,Conversion Rate,Notes,Date
Customer Lifetime Value,$0,0,,,
Churn Rate,5%,0%,,,
Net Promoter Score,50,0,,,`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'startup-validation-tracker.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Validation Tracking Sheet</h3>
            <p className="text-gray-600">Track your startup validation metrics and progress</p>
          </div>
        </div>
        <button
          onClick={downloadTracker}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Core Metrics (1-13)</h4>
          </div>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-900">Problem Interviews</div>
              <div className="text-xs text-blue-700">Target: 20 interviews</div>
              <div className="text-xs text-blue-700">Success: 70% confirm problem</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-900">Pilot Program</div>
              <div className="text-xs text-blue-700">Target: 5 pilot customers</div>
              <div className="text-xs text-blue-700">Success: 60% convert to paid</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Revenue Tracking</h4>
          </div>
          <div className="space-y-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-purple-900">Monthly Recurring Revenue</div>
              <div className="text-xs text-purple-700">Track: $0 to target</div>
              <div className="text-xs text-purple-700">Growth: Month over month</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-purple-900">Customer Acquisition Cost</div>
              <div className="text-xs text-purple-700">Track: Cost per customer</div>
              <div className="text-xs text-purple-700">Target: Under $X</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Additional Metrics</h4>
          </div>
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-900">Customer Lifetime Value</div>
              <div className="text-xs text-green-700">Track: Revenue per customer</div>
              <div className="text-xs text-green-700">Target: 3x CAC minimum</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-900">Retention Metrics</div>
              <div className="text-xs text-green-700">Churn: Under 5% monthly</div>
              <div className="text-xs text-green-700">NPS: Above 50 score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationTracker;