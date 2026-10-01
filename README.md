# DENZZMUSIC — Discord Music Bot 24/7

A professional Discord music bot dashboard mobile app built with React Native & Expo.

---

## Features

### Bot Commands
| Command | Description |
|---|---|
| `/play <query>` | Play a song or playlist |
| `/pause` | Pause playback |
| `/resume` | Resume playback |
| `/skip` | Skip current track |
| `/stop` | Stop and clear queue |
| `/queue` | Show queue |
| `/nowplaying` | Show current track |
| `/loop` | Toggle loop mode (off/track/queue) |
| `/shuffle` | Toggle shuffle |
| `/volume <0-100>` | Set volume |
| `/remove <number>` | Remove track from queue |
| `/clear` | Clear entire queue |
| `/247 on` | Enable 24/7 mode |
| `/247 off` | Disable 24/7 mode |
| `/help` | Show help |

### Prefix Commands
```
dm!play, dm!skip, dm!queue, dm!stop, dm!pause
```

---

## Architecture

```
app/               — Expo Router pages
services/          — API layer (mock/real)
hooks/             — Business logic
components/        — UI components
contexts/          — Global state
constants/         — Theme & config
types/             — TypeScript types
```

---

## Bot Backend (Node.js)

The mobile dashboard connects to a REST API served by the Discord bot.

### Required endpoints:
```
GET  /health
GET  /api/stats
GET  /api/guilds
GET  /api/guilds/:id/queue
POST /api/guilds/:id/play
POST /api/guilds/:id/pause
POST /api/guilds/:id/resume
POST /api/guilds/:id/skip
POST /api/guilds/:id/stop
POST /api/guilds/:id/volume
POST /api/guilds/:id/loop
POST /api/guilds/:id/shuffle
POST /api/guilds/:id/247
DELETE /api/guilds/:id/queue/:index
DELETE /api/guilds/:id/queue
```

### Environment Variables (.env)
```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DASHBOARD_PORT=3000
NODE_ENV=production
```

---

## Deployment

### Render / Railway
1. Connect GitHub repo
2. Set environment variables
3. Build command: `npm install`
4. Start command: `node src/index.js`

### Health Check
```
GET /health
→ { status: "ok", uptime: 12345, guilds: 10 }
```

---

## Dashboard App Config

Set in `.env`:
```env
EXPO_PUBLIC_BOT_API_URL=https://your-bot.render.com
EXPO_PUBLIC_WS_URL=wss://your-bot.render.com
EXPO_PUBLIC_DISCORD_CLIENT_ID=your_client_id
```

---

## Tech Stack
- React Native + Expo (Dashboard)
- Node.js + discord.js v14 (Bot)
- @discordjs/voice (Audio)
- ytdl-core / play-dl (Audio source)
- Express (REST API)

---

**DENZZMUSIC — Discord Music Bot 24/7**
