import { Redis } from '@upstash/redis';

interface ServerData {
  ip: string | null;
  port: number | null;
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in environment variables');
}

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

const SERVER_DATA_KEY = 'gameServerData';

export async function setServerData(ip: string, port: number): Promise<void> {
  const serverData: ServerData = { ip, port };
  try {
    const jsonData = JSON.stringify(serverData); // Explicitly stringify
    console.log('Setting server data:', serverData); // Log object
    console.log('Stringified data to store:', jsonData); // Log JSON string
    const result = await redis.set(SERVER_DATA_KEY, jsonData);
    console.log('Redis set result:', result); // Should be "OK"
  } catch (error) {
    console.error('Failed to set server data in Upstash Redis:', error);
    throw error;
  }
}

export async function getServerData(): Promise<ServerData> {
  try {
    // Remove the generic type and JSON.parse call
    const data = await redis.get(SERVER_DATA_KEY);
    if (data) {
      return data as ServerData;
    }
    return { ip: null, port: null };
  } catch (error) {
    console.error('Error getting server data from Upstash Redis:', error);
    return { ip: null, port: null };
  }
}

// curl -X POST http://192.168.0.10:3000/api/register -H "Content-Type: application/json" -d '{"ip": "127.0.0.1", "port": "8080"}'
// curl http://192.168.0.10:3000/api/server
// https://game-server-bmplospky-andrew-malokhatkos-projects.vercel.app/

// https://game-server-puce.vercel.app/
// curl -X POST https://game-server-puce.vercel.app/api/register -H "Content-Type: application/json" -d '{"ip": "127.0.0.1", "port": 8080}'
// curl https://game-server-puce.vercel.app/api/server