require("dotenv").config();
const { readdirSync } = require('fs');
const { Client, IntentsBitField, REST, Routes, Collection } = require('discord.js');
const token = process.env.DISCORD_TOKEN;

class Bot extends Client {
   constructor(options) {
      super(options);
      this.commands = new Collection();
    

      this.loadCommands(__dirname.replace('\\structures', '\\commands'));
      this.loadEvents();
     // this.registryCommands(); // Now commands are loaded before registration
   }

   async registryCommands() {
      await this.login(token); // Use the correct token variable

      const rest = new REST({ version: '10' }).setToken(token); // Use the correct token variable

      try {
         console.log('Refreshing slash commands...');
         console.log([...this.commands.values()]);

         await rest.put(
            Routes.applicationCommands("1056957302462238820"),
            { body: [...this.commands.values()] }
         );

         console.log('Successfully registered slash commands.');
      } catch (error) {
         console.error('Error registering commands:', error);
      }
   }

   loadCommands(path) {
      readdirSync(path).forEach((dir) => {
         const commands = readdirSync(`${path}\\${dir}`);

         for (const command of commands) {
            const commandClass = require(`${path}/${dir}/${command}`);
            const cmd = new (commandClass)(this);

            this.commands.set(cmd.name, {
               name: cmd.name,
               description: cmd.description,
               options: cmd.options,
               run: cmd.run
            });
         }
      });
   }

   loadEvents(path = __dirname.replace('\\structures', '\\events')) {
      const categories = readdirSync(path);

      categories.forEach((file) => {
         const eventClass = new (require(`../events/${file}`))(this);
         if (eventClass.name === 'ready') return this.on('ready', (a) => eventClass.run(a));
         else return this.on(eventClass.name, (...a) => eventClass.run(...a));
      });
   }
}

const client = new Bot({
   intents: [
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.MessageContent,
   ]
});
console.log({ token });

client.login(token);
process.on('unhandledRejection', console.log);
process.on('uncaughtException', console.log);

module.exports = { Bot, client };
