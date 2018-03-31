// @flow

import type {Message} from 'discord.js';

export default {
  name: 'kek',
  description: 'Kek!',
  execute(message: Message) {
    console.log('Message author', message.author);

    message.channel.send(`Pong.`);
  },
};
