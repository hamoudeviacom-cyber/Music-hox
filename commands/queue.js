export default {
  name: 'queue',
  description: 'Show the current music queue',

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

    const queue = player.queue;

    if (queue.length === 0) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.info.replace('#', ''), 16),
          title: '📋 Queue is Empty',
          description: 'No songs in queue. Use `!play <song>` to add songs.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    // Current playing
    const current = queue.current;
    const currentInfo = current ? `🎵 **Now Playing:** [${current.title}](${current.uri})\nDuration: ${formatDuration(current.duration)}` : '';

    // Queue tracks
    const tracks = queue.slice(0, 10).map((track, index) => {
      return `**${index + 1}.** [${track.title}](${track.uri}) - ${formatDuration(track.duration)}`;
    }).join('\n');

    // Total duration
    const totalDuration = queue.reduce((acc, track) => acc + track.duration, 0);

    const embed = {
      color: parseInt(config.BOT.color.primary.replace('#', ''), 16),
      title: '📋 Music Queue',
      description: currentInfo,
      fields: [
        {
          name: 'Up Next',
          value: tracks.length > 0 ? tracks : 'No tracks in queue',
          inline: false,
        },
        {
          name: 'Queue Stats',
          value: `Total Songs: ${queue.length}\nTotal Duration: ${formatDuration(totalDuration)}`,
          inline: true,
        },
        {
          name: 'Loop Mode',
          value: player.trackRepeat ? '🔂 Single Loop' : (player.queueRepeat ? '🔁 Queue Loop' : '❌ Off'),
          inline: true,
        },
      ],
      footer: { text: config.BOT.name },
      timestamp: new Date(),
    };

    // Add thumbnail if available
    if (current && current.thumbnail) {
      embed.thumbnail = { url: current.thumbnail };
    }

    return message.reply({ embeds: [embed] });
  }
};

// Helper function: Format duration
function formatDuration(ms) {
  if (!ms) return 'Unknown';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}