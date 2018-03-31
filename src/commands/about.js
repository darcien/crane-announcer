// @flow

import type {Message} from 'discord.js';

export default {
  name: 'about',
  description: 'About this bot.',
  execute(message: Message) {
    message.channel.send(
      `This bot was made to make sure Chyvalle is happy with the automated announcer.`,
    );
  },
};
