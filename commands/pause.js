export default {
  name: 'pause',
  description: 'Pause the current song',

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

    if (player.paused) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.info.replace('#', ''), 16),
          title: 'ℹ️ Already Paused',
          description: 'The music is already paused. Use `!resume` to resume playback.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    await player.pause(true);

    return message.reply({
      embeds: [{
        color: parseInt(config.BOT.color.success.replace('#', ''), 16),
        title: '⏸️ Paused',
        description: 'Music playback has been paused.',
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