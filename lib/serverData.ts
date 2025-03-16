import { kv } from '@vercel/kv';

// Define the shape of the server data for type safety
interface ServerData {
  ip: string | null;
  port: number | null;
}

const SERVER_DATA_KEY = 'gameServerData'; // Unique key for the KV store

export async function setServerData(ip: string, port: number): Promise<void> {
  const serverData: ServerData = { ip, port };
  try {
    await kv.set(SERVER_DATA_KEY, serverData);
  } catch (error) {
    console.error('Error setting server data in Vercel KV:', error);
    throw error;
  }
}

export async function getServerData(): Promise<ServerData> {
  try {
    const serverData = await kv.get<ServerData>(SERVER_DATA_KEY);
    // Return the stored data or default if null
    return serverData || { ip: null, port: null };
  } catch (error) {
    console.error('Error getting server data from Vercel KV:', error);
    return { ip: null, port: null }; // Fallback to default on error
  }
}


/// curl -X POST http://192.168.0.10:3000/api/register -H "Content-Type: application/json" -d '{"ip": "127.0.0.1", "port": 8080}'
// curl http://192.168.0.10:3000/api/server