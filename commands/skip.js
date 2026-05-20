export default {
  name: 'skip',
  description: 'Skip the current song',

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

    const currentTrack = player.queue.current;

    await player.stop();

    return message.reply({
      embeds: [{
        color: parseInt(config.BOT.color.success.replace('#', ''), 16),
        title: '⏭️ Skipped',
        description: `Skipped: **${currentTrack?.title || 'Unknown'}**`,
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