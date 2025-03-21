import { NextRequest, NextResponse } from 'next/server';
import { setServerData } from '../../../lib/serverData';

interface ServerData {
  ip: string;
  port: number;
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const data: ServerData = await req.json();
    let { ip, port } = data;

    if (typeof port === 'string') {
      port = parseInt(port, 10);
      if (isNaN(port)) {
        return NextResponse.json({ error: 'Invalid port' }, { status: 400 });
      }
    }

    if (typeof ip !== 'string' || typeof port !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await setServerData(ip, port);

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON or storage error' }, { status: 400 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}