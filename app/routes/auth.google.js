import { google } from 'google-auth-library';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export let loader = async ({ request }) => {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/adwords',
    ],
  });

  return redirect(url);
};
