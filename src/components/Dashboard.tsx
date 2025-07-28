import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UpgradeModal from './UpgradeModal';
import { KPI } from '../types';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Zap, MessageSquare, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const kpis: KPI[] = [
    {
      name: 'Monthly Recurring Revenue',
      value: 15420,
      change: 12.5,
      unit: '$',
      color: 'blue'
    },
    {
      name: 'Active Users',
      value: 1247,
      change: 8.2,
      unit: '',
      color: 'green'
    },
    {
      name: 'Customer Acquisition Cost',
      value: 45,
      change: -5.3,
      unit: '$',
      color: 'purple'
    },
    {
      name: 'Conversion Rate',
      value: 3.2,
      change: 15.7,
      unit: '%',
      color: 'orange'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Completed customer interview #15', time: '2 hours ago', type: 'research' },
    { id: 2, action: 'Updated KPI targets for Q1', time: '5 hours ago', type: 'planning' },
    { id: 3, action: 'Launched A/B test for signup flow', time: '1 day ago', type: 'experiment' },
    { id: 4, action: 'Received admin insight on user retention', time: '2 days ago', type: 'insight' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // Feature gate: Dashboard is only available for Pro and Premium users
  if (user?.tier === 'free') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unlock Your Dashboard</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Complete your free coaching session first, then upgrade to Pro to access your personalized KPI dashboard, track your startup's progress, and get detailed analytics.
          </p>
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Features Include:</h3>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-center">
                <Target className="h-5 w-5 text-blue-600 mr-3" />
                Custom KPI tracking
              </li>
              <li className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                Progress analytics
              </li>
              <li className="flex items-center">
                <Zap className="h-5 w-5 text-purple-600 mr-3" />
                Experiment results
              </li>
              <li className="flex items-center">
                <MessageSquare className="h-5 w-5 text-orange-600 mr-3" />
                Coach insights & feedback
              </li>
            </ul>
            <button 
              disabled={user?.questionsAnswered < 3}
              onClick={() => {
                setShowUpgradeModal(true);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold mt-6 hover:shadow-lg transition-all duration-200"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
        
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your startup's key metrics and progress</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const colorClasses = getColorClasses(kpi.color).split(' ');
          const isPositive = kpi.change > 0;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses[2]} rounded-lg flex items-center justify-center`}>
                  {kpi.name.includes('Revenue') && <DollarSign className={`h-6 w-6 ${colorClasses[1]}`} />}
                  {kpi.name.includes('Users') && <Users className={`h-6 w-6 ${colorClasses[1]}`} />}
                  {kpi.name.includes('Cost') && <Target className={`h-6 w-6 ${colorClasses[1]}`} />}
                  {kpi.name.includes('Rate') && <TrendingUp className={`h-6 w-6 ${colorClasses[1]}`} />}
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.unit === '$' && '$'}{kpi.value.toLocaleString()}{kpi.unit !== '$' && kpi.unit}
                </div>
                <div className="text-sm text-gray-600">{kpi.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'research' ? 'bg-blue-500' :
                  activity.type === 'planning' ? 'bg-green-500' :
                  activity.type === 'experiment' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Revenue Target</span>
              <span className="text-sm text-gray-500">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">User Acquisition</span>
              <span className="text-sm text-gray-500">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Experiments</span>
              <span className="text-sm text-gray-500">100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;