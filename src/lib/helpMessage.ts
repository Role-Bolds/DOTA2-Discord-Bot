import Discord = require("discord.js");
import { debug } from "./debug";
import { config, client } from "../main";

export async function helpMessage(message: Discord.Message) {
  try {
    await message.channel.send(`I can only do the following:
\`${config.prefix} h\`,\`${config.prefix} help\`, <@${client.user.id}> to display this help message.

V:${config.version}`);
  } catch (error) {
    debug(error, "error");
  }
}
