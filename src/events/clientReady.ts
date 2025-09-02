import { ActivityType } from "discord.js";
import { Bot } from "../structures/Client";
import { Event } from "../types/Event";

const event: Event = {
  name: "clientReady",
  once: true,
  async execute(client: Bot) {
    client.user.setActivity({
      name: "Powered by INFINITY ZONE",
      type: ActivityType.Playing,
    });
    console.log(`O bot está on! Com o nome ${client.user.username} e com ${client.guilds.cache.size} guildas.`);
    client.guilds.cache.map((g) =>
      console.log(`I am in: ${g.name}, has ${g.memberCount} membros.`, `Guild id is: ${g.id}`)
    );

    let checkingTime = 5 * 60 * 60 * 1000;
    const guild = client.guilds.cache.get("1336809872884371587");
    const apiGuild = client.api.guilds.cache.get("1336809872884371587");

    setInterval(() => {
      const expiredVips = apiGuild.vipMembers.cache.filter((m) => {
        const hasVipExpired = m.duration.getTime() < Date.now();
        console.log({ hasVipExpired });
        return hasVipExpired;
      });
      if (expiredVips.size !== 0) {
        expiredVips.map((member) => {
          const memberRole = guild.roles.cache.get(member.roleId);
          const memberChannel = guild.roles.cache.get(member.voiceChannelId);
          if (memberRole) memberRole.delete();
          if (memberChannel) memberChannel.delete();

          member.update({ status: "off" });
        });
      }
    }, checkingTime);
  },
};

export default event;
