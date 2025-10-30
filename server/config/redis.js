import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Create Redis instance with BullMQ-safe options
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,  // 👈 REQUIRED for BullMQ
  enableReadyCheck: false,     // 👈 prevents ready-check delay
});

redis.on('connect', () => console.log('✅ Redis connected successfully'));
redis.on('error', (err) => console.error('❌ Redis connection error:', err));

export default redis;
