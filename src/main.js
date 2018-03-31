// @flow

import Discord from 'discord.js';

import {token} from './config/config.json';
import handleCommand from './handleCommand';

let client = new Discord.Client();

client.on('ready', () => {
  console.log('Ready!');
});

client.on('message', handleCommand);

client.login(token);
