const { Message, Collection } = require("discord.js");
const { Bot } = require("../structures/Client");

module.exports = class {
   /**
   * 
   * @param {Bot} client 
   */
   constructor(client) {
      this.client = client;
      this.name = 'raw'
   }
   /**
    * 
    * @param {import("discord.js/typings/rawDataTypes").RawEmojiData} packet 
    */
   async run(packet) {
      try {
         this.client.vulkava.handleVoiceUpdate(packet)
      } catch (o) {
         console.log(o);
      }
   }
}