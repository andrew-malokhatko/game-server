import { Redis } from '@upstash/redis';

// Define the shape of the server data for type safety
interface ServerData {
  ip: string | null;
  port: number | null;
}

// Initialize Upstash Redis client with environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const SERVER_DATA_KEY = 'gameServerData'; // Unique key for Redis

export async function setServerData(ip: string, port: number): Promise<void> {
  const serverData: ServerData = { ip, port };
  try {
    await redis.set(SERVER_DATA_KEY, JSON.stringify(serverData));
  } catch (error) {
    console.error('Error setting server data in Upstash Redis:', error);
    throw error;
  }
}

export async function getServerData(): Promise<ServerData> {
  try {
    const data = await redis.get<string | null>(SERVER_DATA_KEY);
    if (data) {
      return JSON.parse(data) as ServerData;
    }
    return { ip: null, port: null }; // Default if no data exists
  } catch (error) {
    console.error('Error getting server data from Upstash Redis:', error);
    return { ip: null, port: null }; // Fallback to default on error
  }
}