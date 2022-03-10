const { BaseCommandInteraction, MessageEmbed } = require("discord.js");
const { Bot } = require("../../structures/Client");

module.exports = class {
   /**
    * 
    * @param {Bot} client 
    */
   constructor(client) {
      this.client = client;
      this.name = 'play';
      this.description = 'Comando de musica.';
      this.options = [
         {
            name: 'track',
            description: 'Nome da musica',
            type: 3
         }
      ];
      this.category = 'info';
   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   async run(interaction) {
  if (!interaction.member.voice.channel) return interaction.reply({ content: `Você precisa estar em canal de voz!`, ephemeral: true });

  const track = interaction.options.getString('track');

  const res = await this.client.vulkava.search(track);

  if (res.loadType === "LOAD_FAILED") {
    return interaction.reply(`:x: Falha a carraregar. Erro: ${res.exception.message}`);
  } else if (res.loadType === "NO_MATCHES") {
    return interaction.reply(':x: Nao encontrei!');
  }

  // Creates the audio player
  const player = this.client.vulkava.createPlayer({
    guildId: interaction.guild.id,
    voiceChannelId: interaction.member.voice.channelId,
    textChannelId: interaction.channel.id,
    selfDeaf: true
  });
  
  player.connect(); // Connects to the voice channel

  if (res.loadType === 'PLAYLIST_LOADED') {
    for (const track of res.tracks) {
      track.setRequester(interaction.user);
      player.queue.push(track);
    }

    interaction.reply(`Playlist \`${res.playlistInfo.name}\` loaded!`);
  } else {
    const track = res.tracks[0];
    track.setRequester(interaction.user);

    player.queue.push(track);
    interacton.reply(`Queued \`${track.title}\``);
  }

  if (!player.playing) player.play();
      interaction.reply({ embeds: [embed] });
   }
}