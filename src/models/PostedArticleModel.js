// @flow

import mongoose from 'mongoose';

let PostedArticleSchema = new mongoose.Schema({
  guid: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model('PostedArticle', PostedArticleSchema);
