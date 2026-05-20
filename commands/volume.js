export default {
  name: 'volume',
  aliases: ['vol'],
  description: 'Adjust the music volume (0-100)',

  async execute(message, args, manager, config) {
    const player = manager.players.get(message.guildId);

    if (!player) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.error.replace('#', ''), 16),
          title: '❌ Not Playing',
          description: 'There is no music playing right now.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    if (!message.member.voice.channel || player.voiceChannel !== message.member.voice.channelId) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.error.replace('#', ''), 16),
          title: '❌ Different Channel',
          description: 'You need to be in the same voice channel as the bot.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    // If no argument, show current volume
    if (!args.length) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.primary.replace('#', ''), 16),
          title: '🔊 Current Volume',
          description: `Volume is currently set to **${player.volume}%**`,
          fields: [{ name: 'Usage', value: 'Use `!volume <0-100>` to adjust', inline: true }],
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    const volume = parseInt(args[0]);

    if (isNaN(volume) || volume < 0 || volume > 100) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.error.replace('#', ''), 16),
          title: '❌ Invalid Volume',
          description: 'Volume must be between **0** and **100**.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    await player.setVolume(volume);

    return message.reply({
      embeds: [{
        color: parseInt(config.BOT.color.success.replace('#', ''), 16),
        title: '🔊 Volume Adjusted',
        description: `Volume set to **${volume}%**`,
        fields: [{ name: 'Progress Bar', value: createVolumeBar(volume), inline: false }],
        footer: { text: config.BOT.name },
        timestamp: new Date(),
      }],
    }).then(msg => {
      setTimeout(() => {
        msg.delete().catch(() => {});
      }, 3000);
    });
  }
};

// Helper function: Create volume bar
function createVolumeBar(volume) {
  const barLength = 10;
  const filled = Math.round(barLength * (volume / 100));
  const empty = barLength - filled;

  return `\`${'▓'.repeat(filled)}${'░'.repeat(empty)}\` ${volume}%`;
}