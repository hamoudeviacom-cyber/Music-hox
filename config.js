import 'dotenv/config';

export default {
  // Discord Bot Token
  DISCORD_TOKEN: process.env.DISCORD_TOKEN || 'YOUR_BOT_TOKEN_HERE',

  // LavaLink Server Configuration
  LAVALINK: {
    host: 'lava-v4.ajieblogs.eu.org',
    port: 443,
    secure: true,
    password: 'https://dsc.gg/ajidevserver',
    resumeKey: 'https://dsc.gg/ajidevserver'
  },

  // Bot Settings
  BOT: {
    name: 'Lava Music',
    prefix: '!',
    color: {
      primary: '#9B59B6',
      success: '#2ECC71',
      error: '#E74C3C',
      info: '#3498DB'
    }
  },

  // Auto-Disconnect Settings (in milliseconds)
  AUTO_DISCONNECT: 5 * 60 * 1000, // 5 minutes of inactivity
};