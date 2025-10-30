import { Queue } from 'bullmq';
import redis from '../config/redis.js';

const jobQueue = new Queue('job-import', { connection: redis });

export default jobQueue;
