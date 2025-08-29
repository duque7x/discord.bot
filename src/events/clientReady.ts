import { ActivityType } from "discord.js";
import { Bot } from "../structures/Client";
import { Event } from "../types/Event";

const event: Event = {
  name: "clientReady",
  once: true,
  async execute(client: Bot) {
    client.user.setActivity({
      name: "Powered by 🎮",
      type: ActivityType.Playing,
    });

    setInterval(() => {
      if (client.user.presence.activities[0].name == "Powered by 🎮") {
        client.user.setActivity({
          name: "Powered by INFINITY ZONE",
          type: ActivityType.Playing,
        });
      } else {
        client.user.setActivity({
          name: "Powered by 🎮",
          type: ActivityType.Playing,
        });
      }
    }, 60 * 1000);
    console.log(`O bot está on! Com o nome ${client.user.username} e com ${client.guilds.cache.size} guildas.`);
  },
};

export default event;
