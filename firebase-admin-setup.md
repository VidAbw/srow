# Firebase Admin Setup Instructions

Follow these steps to properly configure Firebase Admin in your Next.js application:

## 1. Set up Service Account

1. Go to your [Firebase Console](https://console.firebase.google.com)
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Save the JSON file securely (do not commit it to version control)

## 2. Set Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase Admin Config (for server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Content\n-----END PRIVATE KEY-----\n"
```

Copy the values from your downloaded service account JSON file:
- `projectId` becomes `FIREBASE_PROJECT_ID`
- `client_email` becomes `FIREBASE_CLIENT_EMAIL`
- `private_key` becomes `FIREBASE_PRIVATE_KEY` (keep the quotes and `\n` characters)

## 3. Install Required Dependencies

```bash
npm install firebase firebase-admin
```

## 4. Development vs Production

For local development, the Firebase Admin SDK will work with the above configuration.

For production, make sure to set the environment variables in your hosting environment:
- Vercel: Set them in your project settings
- Firebase Hosting: Use Firebase functions or Cloud Run

## 5. Troubleshooting

If you encounter issues:

1. Verify all environment variables are correctly set
2. Check the Firebase Admin initialization in `src/lib/firebaseAdmin.ts`
3. Ensure your service account has the appropriate permissions
4. Check that the private key is properly formatted with newlines (`\n`)
