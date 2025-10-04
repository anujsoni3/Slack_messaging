import { SlackUser } from '../../types/slack';
import { MessageSquare, Clock, History, TrendingUp } from 'lucide-react';
import { messageStorage } from '../../utils/slackService';

interface HomePageProps {
  user: SlackUser;
}

export function HomePage({ user }: HomePageProps) {
  const messages = messageStorage.getMessages();
  const sentCount = messages.filter((m: any) => m.status === 'sent').length;
  const scheduledCount = messages.filter((m: any) => m.status === 'scheduled').length;
  const totalCount = messages.length;

  const stats = [
    { label: 'Total Messages', value: totalCount, icon: MessageSquare, color: 'blue' },
    { label: 'Sent', value: sentCount, icon: TrendingUp, color: 'green' },
    { label: 'Scheduled', value: scheduledCount, icon: Clock, color: 'orange' },
    { label: 'History', value: totalCount, icon: History, color: 'purple' },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-slate-300">Manage your Slack messages from one beautiful dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <p className="font-medium text-blue-900">Send a Message</p>
              <p className="text-sm text-blue-600">Post a message to any channel</p>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200">
              <p className="font-medium text-green-900">Schedule Message</p>
              <p className="text-sm text-green-600">Plan your messages ahead</p>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors duration-200">
              <p className="font-medium text-orange-900">View History</p>
              <p className="text-sm text-orange-600">Check your message logs</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
          {messages.length > 0 ? (
            <div className="space-y-3">
              {messages.slice(-5).reverse().map((msg: any) => (
                <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{msg.text}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {msg.status} • {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No messages yet. Start by sending one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
