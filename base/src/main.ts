import Discord = require("discord.js");
import { Config } from "./lib/config";
import { debug } from "./lib/debug";
const client = new Discord.Client();
const config = new Config();

client.once("ready", () => {
  debug("Ready!");
  debug(`Code base: ${config.version}`);
  debug(`Node V: ${process.version}`);
});

client.on("message", async (message) => {
  // Ignore messages from bot
  if (message.author.bot) return;
  // Help message
  if (
    message.content === `${config.prefix} h` ||
    message.content === `${config.prefix} help` ||
    message.mentions.has(client.user.id)
  ) {
    try {
      await message.channel.send(`I can only do the following:
\`${config.prefix} h\`,\`${config.prefix} help\`, <@${client.user.id}> to display this help message.

V:${config.version}`);
    } catch (error) {
      debug(error, "error");
    }
  }
  // Ignore anything else without proper prefix
  if(!message.content.startsWith(config.prefix))return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

});

client.login(config.token);
