const { readdirSync } = require('fs')
const { Client } = require('discord.js');
const { DataBase } = require('@josue7/database');
const { Vulkava } = require('vulkava');
const { token } = require('../../config.json');
const express = require('express');
const app = express();

class Bot extends Client {
   constructor(options) {
      super(options)
      this.commands = [];
      this.database = new DataBase();
      this.vulkava = new Vulkava({
         nodes: [
           {
             id: 'Node 1',
             hostname: '127.0.0.1',
             port: 3000,
           }
         ],
         sendWS: (guildId, payload) => {
           this.guilds.cache.get(guildId)?.shard.send(payload);
           // With eris
           // client.guilds.get(guildId)?.shard.sendWS(payload.op, payload.d);
         }
       })
   }

   async registryCommands() {
      await this.login(token);
      this.guilds.cache.get('947254393147887707').commands.set(this.commands);
   }

   loadCommands(path = __dirname.replace('\\structures', '\\commands')) {
      readdirSync(path).forEach((dir) => {
         const commands = readdirSync(`${path}\\${dir}`);

         for (const command of commands) {
            const commandClass = require(`${path}/${dir}/${command}`);
            const cmd = new (commandClass)(this);

            this.commands.push(cmd);
         }
      });

   }
   loadEvents(path = __dirname.replace('\\structures', '\\events')) {
      const categories = readdirSync(path);

      categories.forEach((file) => {
         const eventClass = new (require(`../events/${file}`))(this);
         if (eventClass.name === 'ready') {
            return this.on('ready', (a) => eventClass.run(a));
         } else {
            return this.on(eventClass.name, (...a) => eventClass.run(...a));
         }

      });
   }
   host() {
      app.get('/', (req, res) => {
         res.sendStatus(202).send({ accepted: true });
      });
      app.listen(3000, console.log('Running.'));
   }
}

module.exports.Bot = Bot;