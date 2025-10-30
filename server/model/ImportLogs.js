const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema({
  fileName: String,
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ImportLog', ImportLogSchema);
