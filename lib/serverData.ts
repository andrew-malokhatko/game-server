import { Redis } from '@upstash/redis';

interface ServerData {
  ip: string | null;
  port: number | null;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const SERVER_DATA_KEY = 'gameServerData';

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
    return { ip: null, port: null };
  } catch (error) {
    console.error('Error getting server data from Upstash Redis:', error);
    return { ip: null, port: null };
  }
}

// curl -X POST https://game-server-bmplospky-andrew-malokhatkos-projects.vercel.app/api/register -H "Content-Type: application/json" -d '{"ip": "127.0.0.1", "port": 8080}'
// curl http://192.168.0.10:3000
// https://game-server-bmplospky-andrew-malokhatkos-projects.vercel.app/