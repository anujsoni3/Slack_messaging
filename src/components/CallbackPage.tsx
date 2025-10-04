  import { useEffect, useState } from 'react';
  import { Loader } from 'lucide-react';
  import { slackService } from '../utils/slackService';
  import { SlackUser } from '../types/slack';

  interface CallbackPageProps {
    onSuccess: (user: SlackUser) => void;
  }

  export function CallbackPage({ onSuccess }: CallbackPageProps) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const handleCallback = async () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const errorParam = params.get('error');

        if (errorParam) {
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
          return;
        }

        if (!code) {
          setError('No authorization code received.');
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
          return;
        }

        try {
          const user = await slackService.exchangeCodeForToken(code);
          if (user) {
            onSuccess(user);
          } else {
            setError('Failed to authenticate. Please try again.');
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          }
        } catch (err) {
          setError('An error occurred during authentication.');
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        }
      };

      handleCallback();
    }, [onSuccess]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md w-full">
          {error ? (
            <div>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Authentication Failed</h2>
              <p className="text-slate-600">{error}</p>
              <p className="text-sm text-slate-500 mt-4">Redirecting to login...</p>
            </div>
          ) : (
            <div>
              <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Authenticating...</h2>
              <p className="text-slate-600">Please wait while we complete your sign-in</p>
            </div>
          )}
        </div>
      </div>
    );
  }
