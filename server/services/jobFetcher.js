import axios from 'axios';
import xml2js from 'xml2js';
import jobQueue from './queue.js';
import ImportLog from '../model/ImportLogs.js';

export default async function fetchJobs() {
  try {
    const feedUrls = [
      'https://jobicy.com/?feed=job_feed',
      'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
      'https://jobicy.com/?feed=job_feed&job_categories=data-science',
    ];

    for (const url of feedUrls) {
      const { data } = await axios.get(url);
      console.log("the data is",data);
      const parser = new xml2js.Parser({ explicitArray: false });
      const json = await parser.parseStringPromise(data);
      const jobs = json?.rss?.channel?.item || [];
      const totalFetched = Array.isArray(jobs) ? jobs.length : 0;

      let count = 0;
      for (const job of jobs) {
        await jobQueue.add('importJob', job, {
          removeOnComplete: true,
          removeOnFail: false,
        });
        count++;
      }

      // Create log entry
      await ImportLog.create({
        fileName: url,
        totalFetched,
        newJobs: 0, 
        updatedJobs: 0,
        failedJobs: 0,
      });

      console.log(`Added ${count} jobs from ${url} to queue`);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    throw error;
  }
}
