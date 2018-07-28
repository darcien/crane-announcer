// @flow

import FeedParser from 'feedparser';
import request from 'request';
import fs from 'fs';

import {owner} from '../config/config.json';

import type {Message} from 'discord.js';
import type {Stash} from '../type/Stash';

let url = 'https://www.craneanime.com/wp/feed/atom';
// let url = 'https://xkcd.com/atom.xml';

export default {
  name: 'announce',
  description: 'Check the feed and make announcement for new post',
  guildOnly: true,
  execute(message: Message, args: String) {
    let newArticles = [];
    if (message.author.id !== owner) {
      return;
    }

    message.channel.send('Checking feed...').then((sentMessage) => {
      sentMessage.delete(3000);
    });

    checkFeed(url).then((result) => {
      for (let article of result) {
        let {guid, title, link, date} = article;
        let articleData = {
          guid,
          title,
          date,
        };
        newArticles.push(articleData);

        message.channel.send(`Article,
        guid = ${guid}
        title = ${title}
        link = ${link}
        date = ${date}
         `);
      }
      let serverID = message.guild.id;
      let storagePath = `./src/stash/${serverID}.json`;

      fs.stat(storagePath, (err, stat) => {
        if (err == null) {
          //file exist
          let obj;
          //utf8 encoding change data to string
          fs.readFile(storagePath, 'utf8', (err, data) => {
            if (err) {
              console.log(err);
            }

            let parsedArticleData: Stash = JSON.parse(data);

            let filteredArticles = newArticles.filter((article) => {
              return article.guid === parsedArticleData.articles[0].guid;
            });
            if (filteredArticles.length === 0) {
              for (let article of newArticles) {
                parsedArticleData.articles.push(article);
              }
              let newStashString = JSON.stringify(parsedArticleData, null, 2);

              fs.writeFile(storagePath, newStashString, (err) => {
                if (err) {
                  console.log(err);
                }
                message.channel.send('Stash is updated');
              });
            } else {
              message.channel.send('Stash is up to date');
            }
          });
        } else if (err.code == 'ENOENT') {
          // file does not exist
          let stash: Stash = {
            articles: newArticles,
          };
          let stashString = JSON.stringify(stash, null, 2);
          fs.writeFile(storagePath, stashString, (err) => {
            if (err) {
              console.log(err);
            }
            message.channel.send('Feeds is stored in storage');
          });
        } else {
          console.log('Some other error: ', err.code);
        }
      });

      message.react('✅');
    });
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
