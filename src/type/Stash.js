// @flow

export type Article = {
  guid: string,
  title: string,
  date: string,
};

export type Stash = {
  articles: Array<Article>,
};
