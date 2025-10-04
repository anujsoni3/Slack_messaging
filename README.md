# Slack Dashboard

A modern, feature-rich web application for managing Slack messages with a beautiful UI. Built with React, TypeScript, and Tailwind CSS.

## 📸 Screenshot
![App Screenshot](https://github.com/anujsoni3/Slack_messaging/blob/main/Screenshot%202025-10-04%20203641.png)


## Features

- **Slack OAuth Authentication** - Secure login via Slack OAuth 2.0
- **Send Messages** - Post messages instantly to any Slack channel
- **Schedule Messages** - Plan messages to be sent at specific times
- **Message History** - View all your sent and scheduled messages
- **Edit Messages** - Update messages after sending
- **Delete Messages** - Remove messages from channels
- **Beautiful Dashboard** - Modern, responsive UI with smooth animations
- **Real-time Notifications** - Toast notifications for all actions

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Slack Integration**: Slack Web API
- **Build Tool**: Vite
- **Storage**: LocalStorage (temporary - ready for database integration)

## Setup Instructions

### 1. Create a Slack App

1. Go to [Slack API](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app and select your workspace
4. Navigate to "OAuth & Permissions"
5. Add the following OAuth Scopes:
   - `chat:write`
   - `channels:read`
   - `channels:history`
   - `chat:write.public`
   - `users:read`
6. Add Redirect URL: `http://localhost:5173/callback`
7. Install the app to your workspace
8. Copy the Client ID, Client Secret, and Bot User OAuth Token

### 2. Configure Environment Variables

Update the `.env` file with your Slack credentials:

```env
VITE_SLACK_CLIENT_ID=your_client_id_here
VITE_SLACK_CLIENT_SECRET=your_client_secret_here
VITE_SLACK_REDIRECT_URI=http://localhost:5173/callback
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Login**: Click "Sign in with Slack" on the login page
2. **Authorize**: Grant permissions to your Slack workspace
3. **Dashboard**: You'll be redirected to the dashboard after successful login
4. **Send Message**: Navigate to "Send Message" to post instantly
5. **Schedule**: Use "Schedule" to plan messages for later
6. **History**: View all your messages in the "History" section
7. **Edit/Delete**: Manage your messages from the History page

## Project Structure

```
/project
├── src/
│   ├── components/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx          # Dashboard overview
│   │   │   ├── MessagesPage.tsx      # Send messages
│   │   │   ├── SchedulePage.tsx      # Schedule messages
│   │   │   └── HistoryPage.tsx       # Message history
│   │   ├── Dashboard.tsx             # Main dashboard layout
│   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   ├── LoginPage.tsx             # Login screen
│   │   ├── CallbackPage.tsx          # OAuth callback handler
│   │   └── Toast.tsx                 # Toast notifications
│   ├── types/
│   │   └── slack.ts                  # TypeScript interfaces
│   ├── utils/
│   │   └── slackService.ts           # Slack API integration
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # App entry point
│   └── index.css                     # Global styles
├── .env                              # Environment variables
└── package.json
```

## API Operations

The app supports all major Slack API operations:

- **chat.postMessage** - Send messages instantly
- **chat.scheduleMessage** - Schedule messages for later
- **conversations.history** - Retrieve channel history
- **chat.update** - Edit existing messages
- **chat.delete** - Delete messages
- **conversations.list** - List available channels
- **users.info** - Get user information

## Database Integration

Currently using localStorage for temporary storage. Ready for Supabase integration with the following schema:

### Users Table
- `id` (uuid) - Unique identifier
- `slack_id` (text) - Slack user ID
- `name` (text) - User name
- `email` (text) - User email
- `team_id` (text) - Slack team ID
- `access_token` (text) - OAuth token

### Messages Table
- `id` (uuid) - Unique identifier
- `user_id` (uuid) - Reference to user
- `slack_message_id` (text) - Slack message timestamp
- `channel_id` (text) - Target channel
- `text` (text) - Message content
- `status` (text) - 'draft', 'scheduled', 'sent', 'failed'
- `scheduled_at` (timestamp) - Schedule time
- `sent_at` (timestamp) - Send time

## Security Notes

- OAuth tokens are stored securely
- Client secrets should never be exposed in frontend code
- In production, use a backend proxy for API calls
- Implement proper token refresh mechanisms
- Use HTTPS in production

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

## Future Enhancements

- [ ] Database integration with Supabase
- [ ] Real-time message updates
- [ ] File attachments support
- [ ] Message templates
- [ ] Bulk message operations
- [ ] Analytics dashboard
- [ ] Multi-workspace support
- [ ] Export message history

## License

MIT

## Support

For issues or questions, please check the Slack API documentation:
- [Slack API Docs](https://api.slack.com/)
- [Slack Web API Methods](https://api.slack.com/methods)
