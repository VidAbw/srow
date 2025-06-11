import type { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import nookies from 'nookies';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(','); // Comma-separated list in env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Sign in with email and password using Firebase Auth REST API
    const apiKey = process.env.FIREBASE_API_KEY;
    const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(401).json({ error: data.error?.message || 'Invalid credentials' });
    }

    // Verify ID token
    const decoded = await firebaseAdmin.auth().verifyIdToken(data.idToken);
    // Check if user is admin (by email or custom claim)
    const isAdmin = (decoded.email && ADMIN_EMAILS.includes(decoded.email)) || decoded.admin === true;
    if (!isAdmin) {
      return res.status(403).json({ error: 'Not an admin user' });
    }

    // Set secure HTTP-only cookie
    nookies.set({ res }, 'admin_token', data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax',
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 