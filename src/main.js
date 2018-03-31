import * as Discord from 'discord.js';

import {prefix, token} from './config/config.json';

import * as commandFiles from './commands';

let client = new Discord.Client();
client.commands = new Discord.Collection();

for (let file in commandFiles) {
  if (commandFiles.hasOwnProperty(file)) {
    let command = commandFiles[file];
    client.commands.set(command.name, command);
  }
}

client.on('ready', () => {
  console.log('Ready!');
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  let args = message.content.slice(prefix.length).split(/ +/);
  let commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) {
    return;
  }

  let command = client.commands.get(commandName);

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply("Stop that, it's server specific command.");
  }

  if (command.args && !args.length) {
    return message.channel.send(`No arguments given, ${message.author}.`);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Oops, something went really wrong, like my life.');
  }
});

client.login(token);
