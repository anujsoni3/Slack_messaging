import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.post("/api/slack/oauth", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ ok: false, error: "Missing code" });

  try {
    
    const oauthResponse = await axios.post("https://slack.com/api/oauth.v2.access", null, {
      params: {
        code,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      },
    
    });
   
    const oauthData = oauthResponse.data;
    if (!oauthData.ok) return res.status(400).json({ ok: false, error: oauthData.error });

    const accessToken = oauthData.authed_user.access_token;
    const userId = oauthData.authed_user.id;
    const teamName = oauthData.team.name;

    const userInfoResponse = await axios.get("https://slack.com/api/users.info", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { user: userId },
    });

    const userInfoData = userInfoResponse.data;
    if (!userInfoData.ok) return res.status(400).json({ ok: false, error: userInfoData.error });

    const user = {
      id: userId,
      access_token: accessToken,
      team: teamName,
      name: userInfoData.user.real_name, 
    };

    res.json({ ok: true, user });

  } catch (err) {
    console.error("Slack OAuth error:", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

app.post("/api/slack/send-message", async (req, res) => {
  const { token, channel, text } = req.body;
  if (!token || !channel || !text)
    return res.status(400).json({ ok: false, error: "Missing parameters" });

  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      { channel, text },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Slack message error:", err);
    res.status(500).json({ ok: false, error: "Failed to send message" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`✅ Backend running on http://localhost:${process.env.PORT||3000}`)
);
