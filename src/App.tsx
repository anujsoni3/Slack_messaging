import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { CallbackPage } from './components/CallbackPage';
import { Dashboard } from './components/Dashboard';
import { SlackUser } from './types/slack';
import { slackService } from './utils/slackService';

function App() {
  const [user, setUser] = useState<SlackUser | null>(null);
  const [isCallback, setIsCallback] = useState(false);

  useEffect(() => {
    const currentUser = slackService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    if (window.location.pathname === '/callback') {
      setIsCallback(true);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: SlackUser) => {
    setUser(loggedInUser);
    setIsCallback(false);
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isCallback) {
    return <CallbackPage onSuccess={handleLoginSuccess} />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
