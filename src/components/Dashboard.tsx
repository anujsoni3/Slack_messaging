import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { HomePage } from './pages/HomePage';
import { MessagesPage } from './pages/MessagesPage';
import { SchedulePage } from './pages/SchedulePage';
import { HistoryPage } from './pages/HistoryPage';
import { Toast } from './Toast';
import { SlackUser } from '../types/slack';
import { slackService } from '../utils/slackService';

interface DashboardProps {
  user: SlackUser;
  onLogout: () => void;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  const handleLogout = () => {
    slackService.logout();
    onLogout();
    showToast('Logged out successfully', 'success');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage user={user} />;
      case 'messages':
        return <MessagesPage user={user} showToast={showToast} />;
      case 'schedule':
        return <SchedulePage user={user} showToast={showToast} />;
      case 'history':
        return <HistoryPage user={user} showToast={showToast} />;
      default:
        return <HomePage user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email || 'Slack User'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {renderPage()}
        </main>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
