import { useState, useEffect } from 'react';
import { SlackUser, SlackMessage } from '../../types/slack';
import { messageStorage, slackService } from '../../utils/slackService';
import { CreditCard as Edit2, Trash2, CheckCircle, Clock, XCircle, Loader } from 'lucide-react';

interface HistoryPageProps {
  user: SlackUser;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function HistoryPage({ user, showToast }: HistoryPageProps) {
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const allMessages = messageStorage.getMessages();
    setMessages(allMessages.reverse());
  };

  const handleEdit = (message: SlackMessage) => {
    setEditingId(message.id);
    setEditText(message.text);
  };

  const handleSaveEdit = async (message: SlackMessage) => {
    if (!editText.trim()) return;

    setLoading(message.id);
    try {
      if (message.slack_message_id && message.status === 'sent') {
        const result = await slackService.updateMessage(
          user.access_token,
          message.channel_id,
          message.slack_message_id,
          editText
        );

        if (result.ok) {
          messageStorage.updateMessage(message.id, { text: editText });
          showToast('Message updated successfully!', 'success');
          setEditingId(null);
          loadMessages();
        } else {
          showToast(result.error || 'Failed to update message', 'error');
        }
      } else {
        messageStorage.updateMessage(message.id, { text: editText });
        showToast('Message updated locally', 'success');
        setEditingId(null);
        loadMessages();
      }
    } catch (error) {
      showToast('Error updating message', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (message: SlackMessage) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    setLoading(message.id);
    try {
      if (message.slack_message_id && message.status === 'sent') {
        const result = await slackService.deleteMessage(
          user.access_token,
          message.channel_id,
          message.slack_message_id
        );

        if (result.ok) {
          messageStorage.deleteMessage(message.id);
          showToast('Message deleted successfully!', 'success');
          loadMessages();
        } else {
          showToast(result.error || 'Failed to delete message', 'error');
        }
      } else {
        messageStorage.deleteMessage(message.id);
        showToast('Message deleted', 'success');
        loadMessages();
      }
    } catch (error) {
      showToast('Error deleting message', 'error');
    } finally {
      setLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-orange-100 text-orange-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Message History</h2>

        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No messages yet. Start by sending one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(message.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>

                    {editingId === message.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(message)}
                            disabled={loading === message.id}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
                          >
                            {loading === message.id ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-700 leading-relaxed">{message.text}</p>
                    )}
                  </div>

                  {editingId !== message.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(message)}
                        disabled={loading === message.id}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit message"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(message)}
                        disabled={loading === message.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete message"
                      >
                        {loading === message.id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
