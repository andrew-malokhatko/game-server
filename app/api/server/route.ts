import { NextRequest, NextResponse } from 'next/server';
import { getServerData } from '../../../lib/serverData';

// Define the shape of the server data for type safety
interface ServerData {
  ip: string | null;
  port: number | null;
}

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const serverData: ServerData = await getServerData();

  const response = NextResponse.json(serverData, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}