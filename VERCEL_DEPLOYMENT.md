# Vercel Deployment Guide - Main Branch

## 🚀 Ready for Vercel Deployment

Your main branch is now optimized and ready for deployment on Vercel. Here's everything you need to know:

### ✅ Pre-Deployment Checklist

#### 1. Environment Variables Setup
Create a `.env.production` file based on `env.production.example`:

```bash
# Copy the production environment template
cp env.production.example .env.production

# Edit with your actual production values
nano .env.production
```

#### 2. Required Environment Variables for Vercel

**Firebase (Production)**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
```

**Firebase Admin SDK**
```env
FIREBASE_ADMIN_PROJECT_ID=your_production_project_id
FIREBASE_ADMIN_PRIVATE_KEY_ID=your_production_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour production private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
```

**Stripe (Production)**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

**Application Configuration**
```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Srow
NODE_ENV=production
```

### 🚀 Deployment Methods

#### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
npm run deploy:vercel

# Or deploy with preview
npm run deploy:vercel:preview
```

#### Method 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Import the project
4. Configure environment variables
5. Deploy

#### Method 3: GitHub Integration
1. Push to main branch
2. Vercel automatically deploys
3. Configure environment variables in dashboard

### 🔧 Vercel Configuration

The project includes `vercel.json` with:
- **Security Headers**: XSS protection, content type options
- **CORS Configuration**: API endpoint access
- **Route Rewrites**: Clean URLs for products and categories
- **Function Configuration**: API timeout settings
- **Redirects**: SEO-friendly redirects

### 📊 Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze
```

#### Performance Monitoring
- Vercel Analytics (built-in)
- Core Web Vitals tracking
- Real User Monitoring (RUM)

### 🔒 Security Features

#### Headers Configuration
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

#### API Security
- CORS configuration for API routes
- Rate limiting (configure in Vercel dashboard)
- Input validation in all API endpoints

### 🌐 Domain Configuration

#### Custom Domain Setup
1. Add custom domain in Vercel dashboard
2. Configure DNS records
3. Enable SSL certificate (automatic)

#### Environment-Specific URLs
- Production: `https://your-domain.vercel.app`
- Preview: `https://your-project-git-main-username.vercel.app`

### 📈 Monitoring & Analytics

#### Vercel Analytics
- Page views and performance
- Real user metrics
- Error tracking

#### External Monitoring
- Google Analytics (configure GA_TRACKING_ID)
- Sentry error tracking (configure SENTRY_DSN)
- Custom monitoring endpoints

### 🔄 CI/CD Pipeline

#### Automated Deployment
- Push to main → Automatic production deployment
- Pull requests → Preview deployments
- Branch deployments → Environment-specific URLs

#### Pre-deployment Checks
```bash
# Run before deployment
npm run test:all
npm run build
npm audit
```

### 🐛 Troubleshooting

#### Common Issues

**Build Failures**
```bash
# Check build logs
vercel logs

# Local build test
npm run build
```

**Environment Variables**
- Ensure all required variables are set in Vercel dashboard
- Check for typos in variable names
- Verify Firebase and Stripe keys are production keys

**API Issues**
- Check function timeout settings in `vercel.json`
- Verify CORS configuration
- Test API endpoints locally

#### Debug Commands
```bash
# View deployment logs
vercel logs

# Check deployment status
vercel ls

# Rollback to previous deployment
vercel rollback
```

### 📋 Post-Deployment Checklist

#### ✅ Verify Deployment
- [ ] Application loads correctly
- [ ] All pages are accessible
- [ ] API endpoints work
- [ ] Authentication flows work
- [ ] Payment processing works
- [ ] Admin panel is accessible

#### ✅ Performance Check
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals are good
- [ ] Bundle size is optimized
- [ ] Images are optimized

#### ✅ Security Verification
- [ ] HTTPS is enabled
- [ ] Security headers are present
- [ ] No sensitive data in client-side code
- [ ] API endpoints are protected

#### ✅ Monitoring Setup
- [ ] Analytics tracking is working
- [ ] Error monitoring is active
- [ ] Performance monitoring is enabled
- [ ] Uptime monitoring is configured

### 🎯 Production Optimization

#### Performance
- Enable Vercel Edge Functions for API routes
- Configure image optimization
- Enable automatic static optimization
- Use Vercel's CDN for static assets

#### SEO
- Configure meta tags
- Set up sitemap generation
- Enable structured data
- Configure robots.txt

#### Security
- Enable Vercel's security features
- Configure rate limiting
- Set up monitoring alerts
- Regular security audits

### 📞 Support

#### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Status](https://vercel-status.com)

#### Application Support
- Check `README.md` for application-specific documentation
- Review `TESTING.md` for testing procedures
- Consult `DEPLOYMENT_READINESS.md` for deployment checklist

---

## 🎉 Ready to Deploy!

Your main branch is now:
- ✅ Optimized for Vercel
- ✅ Configured with security headers
- ✅ Ready for production environment variables
- ✅ Set up with monitoring and analytics
- ✅ Configured for custom domains

**Next Steps:**
1. Set up environment variables in Vercel dashboard
2. Deploy using `npm run deploy:vercel`
3. Configure custom domain
4. Set up monitoring and alerts
5. Test all functionality in production

Happy deploying! 🚀 