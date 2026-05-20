export default {
  name: 'resume',
  description: 'Resume paused music',

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

    if (!player.paused) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.info.replace('#', ''), 16),
          title: 'ℹ️ Not Paused',
          description: 'The music is not paused. Use `!pause` to pause playback.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    await player.pause(false);

    return message.reply({
      embeds: [{
        color: parseInt(config.BOT.color.success.replace('#', ''), 16),
        title: '▶️ Resumed',
        description: 'Music playback has been resumed.',
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