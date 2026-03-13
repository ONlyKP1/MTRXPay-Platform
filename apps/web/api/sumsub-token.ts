import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN || 'sbx:VBa98je5otnADcegvM8fvMoA.0AkHcCa3rhuWsl4hN7l1eYq78av2iHEv';
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY || 'SJzgm9aelfVrlzd0bUqEbhN6NYpqzLhu';
const SUMSUB_BASE_URL = 'https://api.sumsub.com';

function createSignature(ts: number, method: string, path: string, body: string = ''): string {
  const data = ts + method.toUpperCase() + path + body;
  return crypto.createHmac('sha256', SUMSUB_SECRET_KEY).update(data).digest('hex');
}

async function createAccessToken(userId: string, levelName: string = 'id-and-liveness'): Promise<string> {
  const ts = Math.floor(Date.now() / 1000);
  const method = 'POST';
  const path = `/resources/accessTokens?userId=${encodeURIComponent(userId)}&levelName=${encodeURIComponent(levelName)}`;

  const signature = createSignature(ts, method, path);

  const response = await fetch(`${SUMSUB_BASE_URL}${path}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-App-Token': SUMSUB_APP_TOKEN,
      'X-App-Access-Sig': signature,
      'X-App-Access-Ts': ts.toString(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sumsub API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, levelName } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const token = await createAccessToken(userId, levelName || 'basic-kyc-level');

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Sumsub token error:', error);
    return res.status(500).json({ error: 'Failed to generate access token' });
  }
}
