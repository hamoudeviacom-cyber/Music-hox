export default {
  name: 'play',
  description: 'Play a song from YouTube or search for a song',

  async execute(message, args, manager, config) {
    // Check if user is in a voice channel
    if (!message.member.voice.channel) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.error.replace('#', ''), 16),
          title: '❌ Not in Voice Channel',
          description: 'You need to be in a voice channel to play music.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    // Check if user has permission to connect
    if (!message.member.voice.channel.joinable) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.error.replace('#', ''), 16),
          title: '❌ Cannot Join',
          description: 'I don\'t have permission to join your voice channel.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    // Check if there's a query
    if (!args.length) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.info.replace('#', ''), 16),
          title: '🎵 Play Command',
          description: 'Usage: `!play <song name or URL>`',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    const query = args.join(' ');

    // Try to get player
    let player = manager.players.get(message.guildId);

    // Create player if it doesn't exist
    if (!player) {
      player = manager.create({
        guild: message.guildId,
        voiceChannel: message.member.voice.channelId,
        textChannel: message.channelId,
        selfDeafen: true,
      });
    }

    // Check if already connected to a different voice channel
    if (player.voiceChannel && player.voiceChannel !== message.member.voice.channelId) {
      return message.reply({
        embeds: [{
          color: parseInt(config.BOT.color.error.replace('#', ''), 16),
          title: '❌ Different Channel',
          description: 'I\'m already playing music in another voice channel.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }

    // Connect to voice channel
    if (!player.connected) {
      await player.connect();
    }

    // Send searching message
    const searchMsg = await message.reply({
      embeds: [{
        color: parseInt(config.BOT.color.primary.replace('#', ''), 16),
        title: '🔍 Searching',
        description: `Searching for: **${query}**`,
        footer: { text: config.BOT.name },
        timestamp: new Date(),
      }],
    });

    try {
      // Search for the track
      const search = await manager.search(query, message.author);

      // Check for errors
      if (!search || !search.tracks.length) {
        return searchMsg.edit({
          embeds: [{
            color: parseInt(config.BOT.color.error.replace('#', ''), 16),
            title: '❌ No Results',
            description: 'No songs found matching your search.',
            footer: { text: config.BOT.name },
            timestamp: new Date(),
          }],
        });
      }

      // Add track to queue
      const track = search.tracks[0];
      player.queue.add(track);

      // Update message with result
      if (search.type === 'PLAYLIST') {
        searchMsg.edit({
          embeds: [{
            color: parseInt(config.BOT.color.success.replace('#', ''), 16),
            title: '✅ Playlist Added',
            description: `Added **${search.tracks.length}** tracks from playlist to queue.`,
            fields: [
              { name: 'Playlist', value: search.playlistName, inline: true },
              { name: 'Duration', value: formatDuration(search.tracks.reduce((acc, t) => acc + t.duration, 0)), inline: true },
            ],
            footer: { text: config.BOT.name },
            timestamp: new Date(),
          }],
        });
      } else {
        searchMsg.edit({
          embeds: [{
            color: parseInt(config.BOT.color.success.replace('#', ''), 16),
            title: '🎵 Added to Queue',
            description: `[${track.title}](${track.uri})`,
            fields: [
              { name: 'Duration', value: formatDuration(track.duration), inline: true },
              { name: 'Position', value: `#${player.queue.size}`, inline: true },
              { name: 'Requested by', value: message.author.username, inline: true },
            ],
            thumbnail: { url: track.thumbnail || null },
            footer: { text: `${config.BOT.name} • ${player.queue.length} songs in queue` },
            timestamp: new Date(),
          }],
        });
      }

      // Start playing if not already
      if (!player.playing && !player.paused) {
        await player.play();
      }

    } catch (error) {
      console.error('Search error:', error);
      searchMsg.edit({
        embeds: [{
          color: parseInt(config.BOT.color.error.replace('#', ''), 16),
          title: '❌ Error',
          description: 'An error occurred while searching. Please try again.',
          footer: { text: config.BOT.name },
          timestamp: new Date(),
        }],
      });
    }
  }
};

// Helper function: Format duration
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}