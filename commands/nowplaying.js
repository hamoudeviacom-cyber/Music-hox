export default {
  name: 'nowplaying',
  aliases: ['np'],
  description: 'Show the currently playing song',

  async execute(message, args, manager, config) {
    const player = manager.players.get(message.guildId);

    if (!player || !player.queue.current) {
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

    const track = player.queue.current;
    const progress = player.position;
    const duration = track.duration;

    // Create progress bar
    const progressBar = createProgressBar(progress, duration);

    const embed = {
      color: parseInt(config.BOT.color.success.replace('#', ''), 16),
      title: '🎵 Now Playing',
      description: `[${track.title}](${track.uri})`,
      fields: [
        { name: 'Progress', value: progressBar, inline: false },
        { name: 'Time', value: `${formatDuration(progress)} / ${formatDuration(duration)}`, inline: true },
        { name: 'Volume', value: `${player.volume}%`, inline: true },
        { name: 'Loop', value: player.trackRepeat ? '🔂 Single' : (player.queueRepeat ? '🔁 Queue' : '❌ Off'), inline: true },
      ],
      footer: { text: `${config.BOT.name} • !help for commands` },
      timestamp: new Date(),
    };

    // Add thumbnail if available
    if (track.thumbnail) {
      embed.thumbnail = { url: track.thumbnail };
    }

    // Add requester info
    if (track.requester) {
      embed.description += `\n\nRequested by: **${track.requester.username}**`;
    }

    return message.reply({ embeds: [embed] });
  }
};

// Helper function: Create progress bar
function createProgressBar(current, total) {
  const percentage = current / total;
  const barLength = 15;
  const filled = Math.round(barLength * percentage);
  const empty = barLength - filled;

  return `\`${'▓'.repeat(filled)}${'░'.repeat(empty)}\` ${Math.round(percentage * 100)}%`;
}

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