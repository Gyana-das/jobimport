import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import redis from '../config/redis.js';
import Job from '../model/job.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Worker connected to MongoDB'))
  .catch((err) => console.error('Worker DB error:', err.message));

const worker = new Worker(
  'job-import',
  async (job) => {
    const jobData = job.data;
    try {
      const existing = await Job.findOne({ link: jobData.link });

      if (existing) {
        await Job.updateOne({ link: jobData.link }, jobData);
        console.log(`Updated: ${jobData.title}`);
      } else {
        await Job.create({
          title: jobData.title,
          link: jobData.link,
          company: jobData['job:company'] || 'Unknown',
          description: jobData.description || '',
          category: jobData.category || 'General',
          pubDate: jobData.pubDate,
        });
        console.log(`Inserted: ${jobData.title}`);
      }
    } catch (error) {
      console.error(`Failed: ${error.message}`);
      throw error;
    }
  },
  { connection: redis }
);

worker.on('completed', (job) =>
  console.log(`Completed job: ${job.id}`)
);

worker.on('failed', (job, err) =>
  console.error(`Job failed: ${job.id} - ${err.message}`)
);
