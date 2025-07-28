import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import Experiments from './components/Experiments';
import ResourcesPage from './components/ResourcesPage';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import AdminUsers from './components/admin/AdminUsers';
import AdminInsights from './components/admin/AdminInsights';
import AdminMessages from './components/admin/AdminMessages';

// Force deployment trigger - updated functions v2
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('chat');

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setCurrentView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!user) {
    return <LandingPage />;
  }

  const renderContent = () => {
    if (user.role === 'admin') {
      switch (currentView) {
        case 'users':
          return <AdminUsers />;
        case 'insights':
          return <AdminInsights />;
        case 'messages':
          return <AdminMessages />;
        default:
          return <AdminUsers />;
      }
    } else {
      switch (currentView) {
        case 'chat':
          return <Chatbot />;
        case 'dashboard':
          return <Dashboard />;
        case 'experiments':
          return <Experiments />;
        case 'resources':
          return <ResourcesPage />;
        case 'success':
          return <SuccessPage />;
        case 'cancel':
          return <CancelPage />;
        default:
          return <Chatbot />;
      }
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;