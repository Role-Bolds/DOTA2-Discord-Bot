import Discord = require("discord.js");
import { Config } from "./lib/config";
import { debug } from "./lib/debug";
import got from "got";
const tableToJSON = require('tabletojson').Tabletojson;
import { helpMessage } from './lib/helpMessage';
export const client = new Discord.Client();
export const config = new Config();

client.once("ready", () => {
  debug("Ready!");
  debug(`Code base: ${config.version}`);
  debug(`Node V: ${process.version}`);
});

client.on("message", async (message) => {
  // Ignore messages from bot
  if (message.author.bot) return;
  // mention bot Help message
  if (
    message.mentions.has(client.user.id)
  ) {
    await helpMessage(message);
  }
  // Ignore anything else without proper prefix
  if(!message.content.startsWith(config.prefix))return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'h' || 'help':
      await helpMessage(message);
      break;
    case 't':
      try {
        const todaysMatches = await getDOTA2TournamentList('d2tournamentthreads','user');
        debug(todaysMatches.data.selftext)
        await message.channel.send(`\`\`\`
${todaysMatches.data.url}
\`\`\``)
      } catch (error) {
        debug(error, "error");
      };
      break;
    case 'w':
        try {
          await getDOTA2TournamentList('https://liquipedia.net/dota2/Liquipedia:Upcoming_and_ongoing_matches','table');
        } catch (error) {
          debug(error, 'error');
        };
      break;
    case 'r':
        try {
          await getDOTA2TournamentList('https://www.reddit.com/r/DotA2/comments/jh25ri/october_24_competitive_matches/','table');
        } catch (error) {
          debug(error, 'error');
        }
      break;
    default:
      await helpMessage(message);
      break;
  }
});

client.login(config.token);

async function getDOTA2TournamentList(source:string, type:string) {
  switch (type) {
    case 'user':
        try {
          const response = await got(`https://www.reddit.com/user/${source}.json`)
          debug(response.body, 'json');
          const data = JSON.parse(response.body);
          const today = data.data.children[0];
          debug(today, 'json');
          return today;
        } catch (error) {
          debug(error.response.body, 'error');
        };
      break;
    case 'table':
        try {
          tableToJSON.convertUrl(
            `${source}`,
            (tableAsJSON) => {
              debug(tableAsJSON, 'json');
            }
          )
        } catch (error) {
          debug(error, 'error');
        };
      break;
    default:
      break;
  }
}