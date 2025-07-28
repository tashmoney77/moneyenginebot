import React, { useState } from 'react';
import { AdminInsight } from '../../types';
import { Lightbulb, Send, Calendar, User, MessageSquare, TrendingUp } from 'lucide-react';

const AdminInsights: React.FC = () => {
  const [showSendForm, setShowSendForm] = useState(false);
  const [newInsight, setNewInsight] = useState({
    userId: '',
    message: ''
  });

  const insights: AdminInsight[] = [
    {
      id: '1',
      userId: 'user-1',
      message: "Your recent experiment on email sequences showed great results! Consider scaling this approach to your main onboarding flow. The 24% open rate is well above industry average.",
      timestamp: '2024-01-20T10:30:00Z',
      read: false
    },
    {
      id: '2',
      userId: 'user-2',
      message: "I noticed you've been asking about customer retention. Based on your data, implementing a weekly check-in email could improve your retention by 15-20%. Happy to discuss implementation strategies.",
      timestamp: '2024-01-19T15:45:00Z',
      read: true
    },
    {
      id: '3',
      userId: 'user-3',
      message: "Your CAC has been trending upward. Consider focusing on organic channels or referral programs. Your current customers seem highly engaged - they could be great advocates.",
      timestamp: '2024-01-18T09:15:00Z',
      read: true
    }
  ];

  const users = [
    { id: 'user-1', name: 'Sarah Chen', email: 'sarah@startup.com' },
    { id: 'user-2', name: 'Mike Rodriguez', email: 'mike@techco.com' },
    { id: 'user-3', name: 'Emma Johnson', email: 'emma@newventure.io' },
    { id: 'user-4', name: 'Alex Kim', email: 'alex@innovate.co' }
  ];

  const handleSendInsight = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the insight
    setShowSendForm(false);
    setNewInsight({ userId: '', message: '' });
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Insights</h1>
          <p className="text-gray-600 mt-1">Send personalized insights to founders</p>
        </div>
        <button
          onClick={() => setShowSendForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg flex items-center"
        >
          <Send className="h-5 w-5 mr-2" />
          Send Insight
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{insights.length}</div>
              <div className="text-sm text-gray-600">Total Insights Sent</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{insights.filter(i => i.read).length}</div>
              <div className="text-sm text-gray-600">Read Insights</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((insights.filter(i => i.read).length / insights.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Insight Form */}
      {showSendForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Insight to Founder</h2>
              <form onSubmit={handleSendInsight} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Founder
                  </label>
                  <select
                    value={newInsight.userId}
                    onChange={(e) => setNewInsight({...newInsight, userId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a founder...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insight Message
                  </label>
                  <textarea
                    value={newInsight.message}
                    onChange={(e) => setNewInsight({...newInsight, message: e.target.value})}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Share your personalized insight based on their data and progress..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowSendForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg"
                  >
                    Send Insight
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Insights List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Insights</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {insights.map((insight) => (
            <div key={insight.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      <span className="font-medium">{getUserName(insight.userId)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.read 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {insight.read ? 'Read' : 'Unread'}
                    </div>
                  </div>
                  <p className="text-gray-800">{insight.message}</p>
                </div>
                <div className="ml-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {insights.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No insights sent yet</h3>
          <p className="text-gray-600 mb-6">Start providing personalized insights to help founders succeed</p>
          <button
            onClick={() => setShowSendForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg"
          >
            Send Your First Insight
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminInsights;