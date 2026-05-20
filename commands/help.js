export default {
  name: 'help',
  aliases: ['commands'],
  description: 'Show all available commands',

  async execute(message, args, manager, config) {
    const commands = [
      { name: 'play', value: 'Play a song or add to queue', usage: '!play <song>' },
      { name: 'skip', value: 'Skip current song', usage: '!skip' },
      { name: 'stop', value: 'Stop music and clear queue', usage: '!stop' },
      { name: 'pause', value: 'Pause current song', usage: '!pause' },
      { name: 'resume', value: 'Resume paused music', usage: '!resume' },
      { name: 'queue', value: 'Show music queue', usage: '!queue' },
      { name: 'nowplaying', value: 'Show current song info', usage: '!nowplaying' },
      { name: 'volume', value: 'Adjust volume (0-100)', usage: '!volume <0-100>' },
      { name: 'loop', value: 'Toggle loop mode', usage: '!loop [off/single/queue]' },
      { name: 'help', value: 'Show this help message', usage: '!help' },
    ];

    const commandList = commands.map(cmd => `**${config.BOT.prefix}${cmd.name}** - ${cmd.value}\n└─ \`${cmd.usage}\``).join('\n\n');

    const embed = {
      color: parseInt(config.BOT.color.primary.replace('#', ''), 16),
      title: '🎵 Music Bot Commands',
      description: `Here's a list of all available commands:\n\n${commandList}`,
      fields: [
        { name: 'Quick Tips', value: '• Use YouTube links or search by name\n• Bot auto-disconnects after 5 min of inactivity\n• Use !np for now playing info', inline: false },
      ],
      footer: { text: `${config.BOT.name} • Powered by LavaLink` },
      timestamp: new Date(),
    };

    return message.reply({ embeds: [embed] });
  }
};