import React, { ReactNode } from 'react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UpgradeModal from './UpgradeModal';
import { LogOut, MessageSquare, BarChart3, Settings, Users, Bot } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!user) return <>{children}</>;

  const navigation = user.role === 'admin' ? [
    { name: 'Users', icon: Users, href: 'users' },
    { name: 'Insights', icon: BarChart3, href: 'insights' },
    { name: 'Messages', icon: MessageSquare, href: 'messages' },
  ] : [
    { 
      name: 'Chat', 
      icon: MessageSquare, 
      href: 'chat',
      available: true 
    },
    { 
      name: 'Dashboard', 
      icon: BarChart3, 
      href: 'dashboard',
      available: user.tier !== 'free' || user.questionsAnswered >= 3
    },
    { 
      name: 'Experiments', 
      icon: Settings, 
      href: 'experiments',
      available: user.tier !== 'free' || user.questionsAnswered >= 3
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    MoneyEngineBot
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <div className="font-medium text-gray-700">{user.name}</div>
                  <div className="text-gray-500 capitalize">{user.tier} Plan</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={`#${item.href}`}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                      item.available 
                        ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (!item.available) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    <span className="flex items-center justify-between w-full">
                      {item.name}
                      {!item.available && user?.tier === 'free' && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          Pro
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
              {user?.summary && (
                <li>
                  <a
                    href="#resources"
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  >
                    <svg className="mr-4 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resources & Templates
                  </a>
                </li>
              )}
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
          </nav>
        </aside>
        
        <main className="flex-1 p-8">
          {children}
        </main>
        
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </div>
    </div>
  );
};

export default Layout;