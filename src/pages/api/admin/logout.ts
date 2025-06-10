import type { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  nookies.destroy({ res }, 'admin_token', { path: '/' });
  res.status(200).json({ success: true });
} 