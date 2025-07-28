import React, { useState } from 'react';
import { User } from '../../types';
import { Users, Search, Filter, MessageSquare, TrendingUp, Calendar, Crown, Eye, UserPlus, CheckCircle, CreditCard } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'pro' | 'premium'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  const users: User[] = [
    {
      id: '1',
      email: 'sarah@startup.com',
      name: 'Sarah Chen',
      role: 'founder',
      tier: 'pro',
      questionsAnswered: 25,
      experimentsCreated: 3,
      joinedAt: '2024-01-15',
      summary: 'Completed full analysis for B2B SaaS validation',
      lastLoginDate: '2024-01-22',
      dailyLogins: [
        { date: '2024-01-20', count: 3 },
        { date: '2024-01-21', count: 2 },
        { date: '2024-01-22', count: 1 }
      ]
    },
    {
      id: '2',
      email: 'mike@techco.com',
      name: 'Mike Rodriguez',
      role: 'founder',
      tier: 'premium',
      questionsAnswered: 67,
      experimentsCreated: 12,
      joinedAt: '2024-01-08',
      summary: 'Advanced marketplace validation with multiple experiments',
      lastLoginDate: '2024-01-22',
      dailyLogins: [
        { date: '2024-01-19', count: 5 },
        { date: '2024-01-20', count: 4 },
        { date: '2024-01-21', count: 3 },
        { date: '2024-01-22', count: 2 }
      ]
    },
    {
      id: '3',
      email: 'emma@newventure.io',
      name: 'Emma Johnson',
      role: 'founder',
      tier: 'free',
      questionsAnswered: 3,
      experimentsCreated: 0,
      joinedAt: '2024-01-20',
      summary: 'Completed free tier analysis - consumer app validation',
      lastLoginDate: '2024-01-20',
      dailyLogins: [
        { date: '2024-01-20', count: 1 }
      ]
    },
    {
      id: '4',
      email: 'alex@innovate.co',
      name: 'Alex Kim',
      role: 'founder',
      tier: 'pro',
      questionsAnswered: 41,
      experimentsCreated: 6,
      joinedAt: '2024-01-12',
      summary: 'B2B validation with strong traction metrics',
      lastLoginDate: '2024-01-21',
      dailyLogins: [
        { date: '2024-01-18', count: 2 },
        { date: '2024-01-19', count: 3 },
        { date: '2024-01-20', count: 1 },
        { date: '2024-01-21', count: 2 }
      ]
    },
    {
      id: '5',
      email: 'tash@moneyengine.co',
      name: 'Tash Jefferies',
      role: 'founder',
      tier: 'free',
      questionsAnswered: 3,
      experimentsCreated: 0,
      joinedAt: '2024-01-22',
      summary: 'Testing platform functionality - MoneyEngineBot creator',
      lastLoginDate: '2024-01-22',
      dailyLogins: [
        { date: '2024-01-22', count: 8 }
      ]
    }
  ];

  // Calculate user engagement metrics
  const calculateUserEngagement = (user: User) => {
    const totalLogins = user.dailyLogins?.reduce((sum, day) => sum + day.count, 0) || 0;
    const activeDays = user.dailyLogins?.length || 0;
    const avgLoginsPerDay = activeDays > 0 ? (totalLogins / activeDays).toFixed(1) : '0';
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleDateString() : 'Never';
    
    return { totalLogins, activeDays, avgLoginsPerDay, lastLogin };
  };

  // Analytics data
  const analyticsData = {
    totalVisitors: 1247,
    signups: 156,
    completedForms: 89,
    upgradedToPro: 23,
    conversionRates: {
      visitorToSignup: 12.5,
      signupToComplete: 57.1,
      completeToUpgrade: 25.8
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || user.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const getTierBadge = (tier: string) => {
    const styles = {
      free: 'bg-gray-100 text-gray-800',
      pro: 'bg-blue-100 text-blue-800',
      premium: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
    };
    return styles[tier as keyof typeof styles] || styles.free;
  };

  const getTierIcon = (tier: string) => {
    if (tier === 'premium') return <Crown className="h-4 w-4" />;
    return null;
  };


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Monitor user activity and engagement</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as '24h' | '7d' | '30d')}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Funnel Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.totalVisitors.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Visitors</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.signups}</div>
            <div className="text-sm text-gray-600">Sign Ups</div>
            <div className="text-xs text-green-600 font-medium">{analyticsData.conversionRates.visitorToSignup}% conversion</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.completedForms}</div>
            <div className="text-sm text-gray-600">Completed Forms</div>
            <div className="text-xs text-purple-600 font-medium">{analyticsData.conversionRates.signupToComplete}% completion</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.upgradedToPro}</div>
            <div className="text-sm text-gray-600">Upgraded to Pro</div>
            <div className="text-xs text-orange-600 font-medium">{analyticsData.conversionRates.completeToUpgrade}% upgrade</div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-blue-200">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Overall Conversion Rate (Visitor → Pro)</div>
            <div className="text-3xl font-bold text-blue-600">
              {((analyticsData.upgradedToPro / analyticsData.totalVisitors) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">
              ${analyticsData.upgradedToPro * 29} in Pro revenue this period
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{users.filter(u => u.tier !== 'free').length}</div>
              <div className="text-sm text-gray-600">Paid Users</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, user) => sum + user.questionsAnswered, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, user) => sum + user.experimentsCreated, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Experiments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tiers</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTierBadge(user.tier)}`}>
                      {getTierIcon(user.tier)}
                      <span className={getTierIcon(user.tier) ? 'ml-1' : ''}>
                        {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{user.questionsAnswered} questions</div>
                      <div className="text-gray-500">{user.experimentsCreated} experiments</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const engagement = calculateUserEngagement(user);
                      return (
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">{engagement.totalLogins} total logins</div>
                          <div className="text-gray-500">{engagement.avgLoginsPerDay} avg/day</div>
                          <div className="text-xs text-gray-400">Last: {engagement.lastLogin}</div>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Send Insight
                    </button>
                    {user.summary && (
                      <button 
                        onClick={() => alert(`Summary for ${user.name}:\n\n${user.summary}`)}
                        className="text-purple-600 hover:text-purple-900 text-sm font-medium flex items-center mt-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Summary
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;