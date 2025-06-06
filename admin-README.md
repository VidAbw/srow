# Admin Catalog Management System

This module provides an admin interface for managing your product catalog, including categories and products.

## Features

1. **Authentication**
   - Secure admin-only access
   - Role-based authorization
   - Admin user creation

2. **Category Management**
   - Create, edit, and delete categories
   - Category image upload
   - Nested categories support

3. **Product Management**
   - Create, edit, and delete products
   - Product image upload
   - Category assignment
   - Pricing, stock management, and more

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Google
3. Create a Firestore database
4. Set up Firebase Storage
5. Get your Firebase config from Project Settings > General > Your Apps
6. Create a `.env.local` file based on the `.env.local.example` template and add your Firebase config

### 2. Firebase Admin SDK Setup

To enable server-side authentication and admin route protection:

1. Go to Firebase Project Settings > Service Accounts
2. Click "Generate new private key" to download a JSON file
3. Fill in the Firebase Admin variables in your `.env.local` file:
   - `FIREBASE_PROJECT_ID`: From the JSON file
   - `FIREBASE_CLIENT_EMAIL`: From the JSON file
   - `FIREBASE_PRIVATE_KEY`: From the JSON file (make sure to include quotes and newlines)

### 3. Create an Admin User

1. Start the development server with `npm run dev`
2. Navigate to `/setup-admin` in your browser
3. Create an admin user with email and password
4. **Important**: After creating your admin user, you should either:
   - Remove the `setup-admin.tsx` page from your project
   - Or protect it with additional authentication

### 4. Access the Admin Panel

Once set up, you can access the admin panel at `/admin`. You'll need to:

1. Sign in with your admin user credentials
2. You will be redirected to the admin dashboard
3. From there, you can manage categories and products

## Security Considerations

The system implements several security measures:

- Server-side authentication check using Firebase Admin SDK
- Role-based access control through Firestore
- Token-based authentication using secure cookies
- Protected API routes for admin operations

Remember to:

- Use strong passwords for admin accounts
- Review Firebase security rules for your Firestore and Storage
- Protect the admin creation page after initial setup
- Consider implementing additional security measures for production environments

## Local Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the application.
Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).
