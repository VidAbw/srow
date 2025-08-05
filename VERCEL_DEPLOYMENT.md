# Vercel Deployment Guide for Srow E-commerce

## 🚀 Quick Start - Deploy to Vercel

Your main branch is now optimized for Vercel deployment! Here's how to deploy:

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Production
```bash
npm run deploy:vercel
```

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [x] All tests passing (`npm run test:all`)
- [x] Linting clean (`npm run lint`)
- [x] Type checking passed (`npm run type-check`)
- [x] Build successful (`npm run build`)

### ✅ Environment Variables
- [x] Firebase production configuration
- [x] Stripe production keys
- [x] All required environment variables set

### ✅ Security
- [x] Environment variables properly configured
- [x] No sensitive data in code
- [x] Security headers configured

## 🔧 Environment Setup

### 1. Set Environment Variables in Vercel Dashboard

Go to your Vercel project dashboard and add these environment variables:

#### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
```

#### Firebase Admin SDK (Server-side)
```
FIREBASE_ADMIN_PROJECT_ID=your_production_project_id
FIREBASE_ADMIN_PRIVATE_KEY_ID=your_production_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour production private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=your_production_client_id
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your_project.iam.gserviceaccount.com
```

#### Stripe Configuration
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

#### Application Configuration
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Srow
NODE_ENV=production
```

### 2. Using Vercel CLI to Set Environment Variables

```bash
# Set environment variables via CLI
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add FIREBASE_ADMIN_PRIVATE_KEY

# Pull environment variables to local .env file
vercel env pull .env.production
```

## 🚀 Deployment Commands

### Production Deployment
```bash
# Deploy to production
npm run deploy:vercel

# Or using Vercel CLI directly
vercel --prod
```

### Preview Deployment
```bash
# Deploy to preview
npm run deploy:vercel:preview

# Or using Vercel CLI
vercel
```

### Local Testing
```bash
# Test production build locally
npm run preview
```

## 🔍 Post-Deployment Verification

### 1. Check Deployment Status
- Visit your Vercel dashboard
- Check build logs for any errors
- Verify all environment variables are set

### 2. Test Critical Functionality
- [ ] Home page loads correctly
- [ ] Authentication works
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Admin panel accessible

### 3. Performance Check
- [ ] Page load times are acceptable
- [ ] Images are optimized
- [ ] API responses are fast
- [ ] No console errors

### 4. Security Verification
- [ ] HTTPS is enabled
- [ ] Security headers are present
- [ ] No sensitive data exposed
- [ ] Firebase rules are configured

## 🔧 Vercel Configuration

### vercel.json Features
- **Security Headers**: XSS protection, content type options, frame options
- **CORS Configuration**: API routes properly configured
- **Route Handling**: Admin, product, and category routes
- **Performance**: Optimized function timeouts

### Next.js Optimizations
- **Image Optimization**: WebP and AVIF formats
- **Bundle Analysis**: Available with `npm run analyze`
- **Security Headers**: Comprehensive security configuration
- **Performance**: SWC minification, CSS optimization

## 📊 Monitoring and Analytics

### Vercel Analytics
- Enable Vercel Analytics in your dashboard
- Monitor page views, performance, and errors

### Custom Monitoring
```bash
# Add Sentry for error tracking
npm install @sentry/nextjs

# Add Google Analytics
# Set NEXT_PUBLIC_GA_TRACKING_ID in environment variables
```

## 🔄 Continuous Deployment

### GitHub Integration
1. Connect your GitHub repository to Vercel
2. Set up automatic deployments on push to main branch
3. Configure preview deployments for pull requests

### Environment-Specific Deployments
- **Production**: Automatic deployment from main branch
- **Preview**: Automatic deployment from feature branches
- **Development**: Manual deployment from dev branch

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
vercel logs

# Test build locally
npm run build
```

#### Environment Variable Issues
```bash
# Verify environment variables
vercel env ls

# Pull latest environment variables
vercel env pull
```

#### Performance Issues
```bash
# Analyze bundle size
npm run analyze

# Check Core Web Vitals
# Use Vercel Analytics or Lighthouse
```

### Debug Commands
```bash
# View deployment logs
vercel logs

# Check function logs
vercel logs --function=api/create-payment-intent

# Debug environment variables
vercel env ls
```

## 🔒 Security Best Practices

### Environment Variables
- Never commit sensitive data to Git
- Use Vercel's environment variable encryption
- Rotate keys regularly

### Firebase Security
- Configure Firebase security rules
- Use production Firebase project
- Set up proper authentication

### Stripe Security
- Use production Stripe keys
- Configure webhook endpoints
- Test payment flows thoroughly

## 📈 Performance Optimization

### Vercel Edge Functions
- API routes automatically optimized
- Global CDN distribution
- Automatic scaling

### Next.js Optimizations
- Image optimization
- Code splitting
- Bundle analysis
- SWC compilation

## 🎯 Next Steps

1. **Set up custom domain** in Vercel dashboard
2. **Configure SSL certificate** (automatic with Vercel)
3. **Set up monitoring** with Vercel Analytics
4. **Configure backups** for Firebase data
5. **Set up error tracking** with Sentry
6. **Monitor performance** with Core Web Vitals

---

## 🎉 Your App is Ready for Production!

Your Srow e-commerce application is now optimized for Vercel deployment with:
- ✅ Production-ready configuration
- ✅ Security best practices
- ✅ Performance optimizations
- ✅ Monitoring setup
- ✅ Continuous deployment

Deploy with confidence knowing your application follows enterprise-grade standards! 