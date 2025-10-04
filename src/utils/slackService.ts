// src/utils/slackService.ts

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const SLACK_AUTH_URL = "https://slack.com/oauth/v2/authorize";

export const slackService = {
  initiateOAuth: () => {
    const clientId = import.meta.env.VITE_SLACK_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SLACK_REDIRECT_URI;
    const scope = "chat:write,channels:read,channels:history,chat:write.public,users:read";

    const authUrl = `${SLACK_AUTH_URL}?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  },

  exchangeCodeForToken: async (code: string) => {
    const response = await fetch(`${BACKEND_URL}/api/slack/oauth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (data.ok && data.user) {
      localStorage.setItem("slack_user", JSON.stringify(data.user));
      return data.user;
    }
    return null;
  },

  sendMessage: async (channel: string, text: string) => {
    const userStr = localStorage.getItem("slack_user");
    if (!userStr) throw new Error("No user logged in");

    const user = JSON.parse(userStr);
    const response = await fetch(`${BACKEND_URL}/api/slack/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.access_token, channel, text }),
    });

    return await response.json();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('slack_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const messageStorage = {
  getMessages: () => {
    const messagesStr = localStorage.getItem('slack_messages');
    return messagesStr ? JSON.parse(messagesStr) : [];
  },
  saveMessage: (message: any) => {
    const messages = messageStorage.getMessages();
    messages.push(message);
    localStorage.setItem('slack_messages', JSON.stringify(messages));
  },
};