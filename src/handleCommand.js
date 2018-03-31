// @flow

import {prefix} from './config/config.json';

export default function handleCommand(message: {
  content: string,
  channel: Object,
}) {
  if (message == null) {
    return;
  }

  let {content} = message;

  if (!content.startsWith(prefix)) {
    return;
  }

  let command = content.slice(2);

  switch (command) {
    case 'ping':
      message.channel.send('Pong.');
      break;

    default:
      break;
  }
}
