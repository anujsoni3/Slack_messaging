import { useState, useEffect } from 'react';
import { SlackUser, SlackChannel } from '../../types/slack';
import { slackService, messageStorage } from '../../utils/slackService';
import { Send, Loader } from 'lucide-react';

interface MessagesPageProps {
  user: SlackUser;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function MessagesPage({ user, showToast }: MessagesPageProps) {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(true);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const fetchedChannels = await slackService.getChannels(user.access_token);
      setChannels(fetchedChannels);
      if (fetchedChannels.length > 0) {
        setSelectedChannel(fetchedChannels[0].id);
      }
    } catch (error) {
      showToast('Failed to load channels', 'error');
    } finally {
      setLoadingChannels(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChannel) return;

    setLoading(true);
    try {
      const result = await slackService.sendMessage(user.access_token, selectedChannel, messageText);

      if (result.ok) {
        messageStorage.saveMessage({
          user_id: user.id,
          slack_message_id: result.ts,
          channel_id: selectedChannel,
          text: messageText,
          status: 'sent',
          sent_at: new Date().toISOString(),
        });

        showToast('Message sent successfully!', 'success');
        setMessageText('');
      } else {
        showToast(result.error || 'Failed to send message', 'error');
      }
    } catch (error) {
      showToast('Error sending message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Message</h2>

        {loadingChannels ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Channel
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                {channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    #{channel.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !messageText.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
