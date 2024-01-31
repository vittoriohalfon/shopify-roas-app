import { google } from 'google-auth-library';
import { redirect } from '@remix-run/node';
import crypto from 'crypto';

function generateSecureRandomState() {
    return crypto.randomBytes(32).toString('hex');
    }

export let loader = async ({ request }) => {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Generating a secure, random state value
  const state = generateSecureRandomState();

  const url = client.generateAuthUrl({
    access_type: 'offline', // to get refresh token
    scope: [
      'https://www.googleapis.com/auth/adwords',
    ],
    state: state,
  });

  // Store the state value in the session
  const headers = new Headers({
    'Set-Cookie': `state=${state}; HttpOnly; Secure; SameSite=Strict; Path=/auth/google/callback; Max-Age=300`,
  });

  return redirect(url, { headers });
};
