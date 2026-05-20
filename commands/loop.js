export default {
  name: 'loop',
  aliases: ['repeat'],
  description: 'Toggle loop mode (off, single, queue)',

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

    // Parse mode from argument or toggle
    const modeArg = args[0]?.toLowerCase();

    let newMode;
    let modeDescription;

    if (modeArg === 'off') {
      newMode = 'off';
      modeDescription = 'Loop mode disabled';
    } else if (modeArg === 'single' || modeArg === '1') {
      newMode = 'track';
      modeDescription = 'Looping current track';
    } else if (modeArg === 'queue' || modeArg === 'all' || modeArg === '1') {
      newMode = 'queue';
      modeDescription = 'Looping entire queue';
    } else {
      // Toggle between modes
      if (player.trackRepeat) {
        newMode = 'queue';
        modeDescription = 'Changed to queue loop';
      } else if (player.queueRepeat) {
        newMode = 'off';
        modeDescription = 'Loop mode disabled';
      } else {
        newMode = 'track';
        modeDescription = 'Changed to single track loop';
      }
    }

    // Apply the new mode
    if (newMode === 'off') {
      await player.setTrackRepeat(false);
      await player.setQueueRepeat(false);
    } else if (newMode === 'track') {
      await player.setTrackRepeat(true);
      await player.setQueueRepeat(false);
    } else if (newMode === 'queue') {
      await player.setTrackRepeat(false);
      await player.setQueueRepeat(true);
    }

    // Create mode indicator
    const modeEmoji = player.trackRepeat ? '🔂' : (player.queueRepeat ? '🔁' : '❌');
    const modeText = player.trackRepeat ? 'Single Track Loop' : (player.queueRepeat ? 'Queue Loop' : 'Off');

    return message.reply({
      embeds: [{
        color: parseInt(config.BOT.color.success.replace('#', ''), 16),
        title: `${modeEmoji} Loop Mode`,
        description: modeDescription,
        fields: [
          { name: 'Current Mode', value: modeText, inline: true },
          { name: 'Usage', value: '`!loop off` / `!loop single` / `!loop queue`', inline: true },
        ],
        footer: { text: config.BOT.name },
        timestamp: new Date(),
      }],
    });
  }
};