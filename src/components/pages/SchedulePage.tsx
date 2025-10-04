import { useState, useEffect } from 'react';
import { SlackUser, SlackChannel } from '../../types/slack';
import { slackService, messageStorage } from '../../utils/slackService';
import { Clock, Loader } from 'lucide-react';

interface SchedulePageProps {
  user: SlackUser;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function SchedulePage({ user, showToast }: SchedulePageProps) {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [messageText, setMessageText] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(true);

  useEffect(() => {
    loadChannels();
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    setScheduleDate(tomorrow.toISOString().split('T')[0]);
    setScheduleTime('09:00');
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

  const handleScheduleMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChannel || !scheduleDate || !scheduleTime) return;

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const postAt = Math.floor(scheduledDateTime.getTime() / 1000);

    if (postAt <= Date.now() / 1000) {
      showToast('Schedule time must be in the future', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await slackService.scheduleMessage(
        user.access_token,
        selectedChannel,
        messageText,
        postAt
      );

      if (result.ok) {
        messageStorage.saveMessage({
          user_id: user.id,
          slack_message_id: result.scheduled_message_id,
          channel_id: selectedChannel,
          text: messageText,
          status: 'scheduled',
          scheduled_at: scheduledDateTime.toISOString(),
        });

        showToast('Message scheduled successfully!', 'success');
        setMessageText('');
      } else {
        showToast(result.error || 'Failed to schedule message', 'error');
      }
    } catch (error) {
      showToast('Error scheduling message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Schedule Message</h2>

        {loadingChannels ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <form onSubmit={handleScheduleMessage} className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
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
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  Schedule Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
