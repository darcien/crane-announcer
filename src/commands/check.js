// @flow

import type {Message} from 'discord.js';

export default {
  name: 'check',
  description: 'Check the atom feed',
  args: true,
  execute(message: Message, args: Array<string>) {
    if (args[0] === 'post') {
      return message.channel.send(`Checking post...`);
    }

    message.channel.send('Checking...');
  },
};
