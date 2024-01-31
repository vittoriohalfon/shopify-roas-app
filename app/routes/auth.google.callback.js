import { google } from 'google-auth-library';
import { redirect } from '@remix-run/node';

export let action = async ({ request }) => {
    const formData = await request.formData();
    const code = formData.get('code');
    
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    
    const { tokens } = await client.getToken(code);

    const headers = new Headers({
        'Set-Cookie': [
            `access_token=${tokens.access_token}; HttpOnly; Secure; SameSite=Strict`,
            `refresh_token=${tokens.refresh_token}; HttpOnly; Secure; SameSite=Strict`
        ],
    });

    return redirect('/path-to-redirect-to-after-auth', { headers });
};
