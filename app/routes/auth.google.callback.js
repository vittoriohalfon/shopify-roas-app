import { google } from 'google-auth-library';
import { redirect } from '@remix-run/node';

export let action = async ({ request }) => {
    const formData = await request.formData();
    const code = formData.get('code');
    const state = formData.get('state');

    //Retrieve state from cookie
    const cookieHeader = request.headers.get('Cookie');
    const cookies = cookieHeader ? new Map(cookieHeader.split(';').map((c) => c.trim().split('='))) : new Map();
    const storedState = cookies.get('state');

    // Check if the state returned by Google matches the one we stored
    if (!storedState || storedState !== state) {
        throw new Error('Invalid state parameter');
    }
    
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    
    const { tokens } = await client.getToken(code);

    const headers = new Headers({
        'Set-Cookie': [
            `access_token=${tokens.access_token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
            `refresh_token=${tokens.refresh_token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800` // 1 week
        ],
    });

    return redirect('/path-to-redirect-to-after-auth', { headers });
};
