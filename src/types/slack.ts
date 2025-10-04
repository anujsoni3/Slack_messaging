export interface SlackUser {
  id: string;
  slack_id: string;
  name: string;
  email?: string;
  team_id: string;
  access_token: string;
}

export interface SlackMessage {
  id: string;
  user_id: string;
  slack_message_id?: string;
  channel_id: string;
  text: string;
  scheduled_at?: string;
  sent_at?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface SlackChannel {
  id: string;
  name: string;
}
