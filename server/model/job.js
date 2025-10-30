const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: String,
    link: { type: String, unique: true },
    company: String,
    description: String,
    category: String,
    pubDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
