// @flow

import FeedParser from 'feedparser';
import request from 'request';

import type {Message} from 'discord.js';

let url = 'https://www.craneanime.com/wp/feed/atom';

export default {
  name: 'check',
  description: 'Check the atom feed',
  guildOnly: true,
  execute(message: Message) {
    if (message.author.id !== '202538693582389248') {
      return;
    }

    checkFeed(url).then((result) => {
      // console.log('Result', result);

      for (let article of result) {
        // let props = Object.keys(article).join(', ');
        message.channel.send(`Article: ${article.link} `);
      }

      message.channel.send('Done');
    });
    message.channel.send('Checking...');
  },
};

async function checkFeed(url: string) {
  return new Promise((resolve, reject) => {
    let req = request(url);
    let feedparser = new FeedParser();

    req.on('error', (error) => {
      // handle any request errors
      console.log('Error on request');
      reject(error);
    });

    req.on('response', function(res) {
      // var stream = this; // `this` is `req`, which is a stream

      if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'));
      } else {
        this.pipe(feedparser);
      }
    });

    feedparser.on('error', (error) => {
      // always handle errors
      console.log('Error on feedparse');
      reject(error);
    });

    let result = [];

    feedparser.on('readable', function() {
      // This is where the action is!
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      var item;

      while ((item = stream.read())) {
        result.push(item);
      }
    });

    feedparser.on('end', () => {
      console.log('Done parsing');
      resolve(result);
    });
  });
}
