import { google } from 'google-auth-library';
import { json } from '@remix-run/node';
import { useSearchParams } from '@remix-run/react';

export let action = async ({ request }) => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  // Here we'll save the tokens securely (associated with the user's session)

  return json({ success: true });
};
