# 🚀 CI/CD Pipeline Documentation

## Overview

This project includes a sophisticated CI/CD pipeline built with GitHub Actions that automatically builds, tests, and deploys your application to multiple environments. The pipeline supports both **main** and **dev** branches with different deployment strategies.

## 🏗️ Pipeline Architecture

### Workflow Triggers
- **Push to main**: Triggers production deployment
- **Push to dev**: Triggers staging deployment
- **Pull Requests**: Runs tests and quality checks
- **Manual Dispatch**: Allows manual deployment to any environment

### Job Dependencies
```
security → lint-and-type-check → test → e2e → build → deploy-staging/deploy-production → monitor
```

## 🔧 Pipeline Jobs

### 1. Security & Dependency Check
- **Purpose**: Security vulnerability scanning
- **Tools**: npm audit, Snyk
- **Output**: Security report and vulnerability assessment

### 2. Lint & Type Check
- **Purpose**: Code quality and type safety
- **Tools**: ESLint, Prettier, TypeScript
- **Output**: Linting results and type checking status

### 3. Testing
- **Purpose**: Code quality assurance
- **Tools**: Jest, React Testing Library
- **Coverage**: Minimum 70% required
- **Matrix**: Tests on Node.js 18 and 20

### 4. E2E Testing
- **Purpose**: End-to-end functionality testing
- **Tools**: Playwright
- **Browsers**: Chrome, Firefox, Safari
- **Output**: Test reports and artifacts

### 5. Build & Quality Check
- **Purpose**: Application compilation and validation
- **Tools**: Next.js build system
- **Output**: Build artifacts and bundle size analysis

### 6. Deployment
- **Staging**: Automatic deployment from dev branch
- **Production**: Automatic deployment from main branch
- **Platforms**: Firebase Hosting + Vercel (optional)

### 7. Monitoring
- **Purpose**: Post-deployment status tracking
- **Features**: Deployment notifications and health checks

## 🌍 Environment Management

### Development
- **Branch**: `dev`
- **URL**: `http://localhost:3000`
- **Features**: Debug mode, mock data, no analytics

### Staging
- **Branch**: `dev`
- **URL**: `https://staging.yourdomain.com`
- **Features**: Production-like, analytics enabled, no debug

### Production
- **Branch**: `main`
- **URL**: `https://yourdomain.com`
- **Features**: Full production, analytics, performance optimization

## 🔐 Required Secrets

### Firebase Configuration
```bash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_SERVICE_ACCOUNT_STAGING=staging_service_account_json
FIREBASE_SERVICE_ACCOUNT_PROD=production_service_account_json
```

### Vercel Configuration (Optional)
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

### Security & Monitoring
```bash
SNYK_TOKEN=your_snyk_token
```

## 🚀 Getting Started

### 1. Set Up GitHub Secrets
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the required secrets listed above

### 2. Configure Environment Variables
1. Copy `env.template` to `.env.local`
2. Fill in your actual values
3. Never commit `.env.local` to version control

### 3. Set Up Firebase
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Configure your project ID

### 4. Set Up Vercel (Optional)
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`

## 📋 Manual Deployment

### Using GitHub Actions
1. Go to Actions tab in your repository
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Choose environment (staging/production)
5. Click "Run workflow"

### Using Local Scripts
```bash
# Deploy to development
npm run deploy:dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 🔍 Monitoring & Debugging

### Pipeline Status
- **Green**: All checks passed, deployment successful
- **Yellow**: Some checks passed, deployment in progress
- **Red**: Checks failed, deployment blocked

### Common Issues & Solutions

#### Build Failures
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check for linting issues
npm run lint
```

#### Test Failures
```bash
# Run tests locally
npm run test:all

# Check test coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

#### Deployment Failures
```bash
# Check Firebase configuration
firebase projects:list

# Check Vercel configuration
vercel whoami

# Validate environment variables
node scripts/deploy.js --validate
```

## 📊 Quality Gates

### Code Quality
- ✅ ESLint passes with no errors
- ✅ Prettier formatting is correct
- ✅ TypeScript compilation successful
- ✅ No console statements in production code

### Testing
- ✅ Unit test coverage ≥ 70%
- ✅ All E2E tests pass
- ✅ Integration tests successful

### Security
- ✅ No high-severity vulnerabilities
- ✅ Security audit passes
- ✅ Dependencies are up to date

### Performance
- ✅ Build completes successfully
- ✅ Bundle size is reasonable
- ✅ No performance regressions

## 🔄 Branch Strategy

### Development Workflow
1. **Feature Branch**: Create from `dev`
2. **Development**: Work on features
3. **Testing**: Run tests locally
4. **Pull Request**: Create PR to `dev`
5. **CI/CD**: Automatic staging deployment
6. **Merge**: After approval and CI passes

### Production Workflow
1. **Staging**: Test on staging environment
2. **Pull Request**: Create PR from `dev` to `main`
3. **CI/CD**: Full pipeline execution
4. **Production**: Automatic production deployment
5. **Monitoring**: Post-deployment health checks

## 🛠️ Customization

### Adding New Environments
1. Update `deployment.config.js`
2. Add environment-specific configuration
3. Update CI/CD workflow
4. Add required secrets

### Adding New Quality Gates
1. Update workflow file
2. Add new job or step
3. Configure failure conditions
4. Update documentation

### Adding New Deployment Targets
1. Install required tools
2. Configure authentication
3. Update deployment scripts
4. Add to CI/CD pipeline

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Vercel Deployment](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Playwright Testing](https://playwright.dev/)

## 🤝 Contributing

When contributing to the CI/CD pipeline:

1. **Test Locally**: Always test changes locally first
2. **Small Changes**: Make incremental improvements
3. **Documentation**: Update this README for any changes
4. **Security**: Never expose secrets or sensitive information
5. **Testing**: Ensure all quality gates still pass

## 📞 Support

If you encounter issues with the CI/CD pipeline:

1. **Check Logs**: Review GitHub Actions logs for detailed error messages
2. **Local Testing**: Reproduce issues locally if possible
3. **Documentation**: Check this README and related documentation
4. **Issues**: Create a GitHub issue with detailed information
5. **Community**: Reach out to the development team

---

**Last Updated**: $(date)
**Pipeline Version**: 2.0.0
**Maintainer**: Development Team
