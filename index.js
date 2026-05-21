import 'dotenv/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { Manager } from 'erela.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// Create command collection
client.commands = new Collection();

// Create manager for Lavalink
const manager = new Manager({
  nodes: [config.LAVALINK],
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

// Event: Client ready
client.once('ready', () => {
  console.log(`🎵 ${config.BOT.name} is ready!`);
  console.log(`📡 Connected to ${client.guilds.cache.size} servers`);
  console.log(`🎧 Lavalink: ${config.LAVALINK.host}:${config.LAVALINK.port}`);

  // Initialize Lavalink
  manager.init(client.user.id);
});

// Event: Manager node connected
manager.on('nodeConnect', (node) => {
  console.log(`✅ Lavalink Node Connected: ${node.options.identifier}`);
});

// Event: Manager node error
manager.on('nodeError', (node, error) => {
  console.error(`❌ Lavalink Node Error: ${node.options.identifier}`, error.message);
});

// Event: Track start
manager.on('trackStart', (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
  if (channel) {
    channel.send({
      embeds: [{
        color: parseInt(config.BOT.color.success.replace('#', ''), 16),
        title: '🎵 Now Playing',
        description: `[${track.title}](${track.uri})`,
        fields: [
          { name: 'Duration', value: formatDuration(track.duration), inline: true },
          { name: 'Requested by', value: track.requester?.username || 'Unknown', inline: true },
        ],
        thumbnail: { url: track.thumbnail || null },
        footer: { text: `${config.BOT.name} • ${player.queue.length} songs in queue` },
        timestamp: new Date(),
      }],
    });
  }
});

// Event: Queue end
manager.on('queueEnd', (player) => {
  const channel = client.channels.cache.get(player.textChannel);
  if (channel) {
    channel.send({
      embeds: [{
        color: parseInt(config.BOT.color.info.replace('#', ''), 16),
        title: '📋 Queue Ended',
        description: 'No more songs in queue. Waiting for more...',
        footer: { text: `${config.BOT.name} • Use !play to add more songs` },
        timestamp: new Date(),
      }],
    });
  }

  // Auto disconnect after inactivity
  setTimeout(() => {
    if (!player.playing && player.queue.size === 0) {
      const voiceChannel = client.channels.cache.get(player.voiceChannel);
      if (voiceChannel) {
        player.destroy();
        console.log(`🔌 Auto-disconnected from ${voiceChannel.name}`);
      }
    }
  }, config.AUTO_DISCONNECT);
});

// Load commands
const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Event: MessageCreate
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(config.BOT.prefix) || message.author.bot) return;

  const args = message.content.slice(config.BOT.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args, manager, config);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    message.reply({
      embeds: [{
        color: parseInt(config.BOT.color.error.replace('#', ''), 16),
        title: '❌ Error',
        description: 'An error occurred while executing this command.',
        footer: { text: config.BOT.name },
        timestamp: new Date(),
      }],
    });
  }
});

// Helper function: Format duration
function formatDuration(ms) {
  if (!ms) return '0:00';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

// Login to Discord
client.login(config.DISCORD_TOKEN).catch((error) => {
  console.error('Failed to login:', error.message);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});