# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All tests pass locally (`npm run test:all`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No console statements in production code
- [ ] Code is properly formatted (`npm run format:check`)

### ✅ Testing
- [ ] Unit test coverage ≥ 70%
- [ ] All E2E tests pass
- [ ] Integration tests successful
- [ ] Manual testing completed on staging

### ✅ Security
- [ ] Security audit passes (`npm run security:audit`)
- [ ] No high-severity vulnerabilities
- [ ] Dependencies are up to date
- [ ] Environment variables are properly configured

### ✅ Build
- [ ] Application builds successfully (`npm run build`)
- [ ] Bundle size is reasonable
- [ ] No build warnings or errors
- [ ] Static assets are optimized

## Environment-Specific Checklist

### 🔧 Development
- [ ] `.env.local` file exists and is configured
- [ ] Firebase development project is set up
- [ ] Local development server runs without errors
- [ ] Database connections work locally

### 🧪 Staging
- [ ] Staging environment variables are set
- [ ] Firebase staging project is configured
- [ ] Staging URL is accessible
- [ ] All features work on staging
- [ ] Performance is acceptable

### 🚀 Production
- [ ] Production environment variables are set
- [ ] Firebase production project is configured
- [ ] Domain and SSL are configured
- [ ] Monitoring and analytics are set up
- [ ] Backup strategy is in place

## Deployment Steps

### 1. Pre-Deployment Validation
```bash
# Run full CI check locally
npm run ci:full

# Validate environment configuration
npm run deploy:validate

# Check security
npm run security:audit
```

### 2. Deploy to Staging
```bash
# Deploy to staging environment
npm run deploy:staging

# Verify staging deployment
# - Check staging URL
# - Run smoke tests
# - Verify all features work
```

### 3. Deploy to Production
```bash
# Deploy to production environment
npm run deploy:production

# Verify production deployment
# - Check production URL
# - Run smoke tests
# - Monitor error rates
# - Check performance metrics
```

## Post-Deployment Checklist

### ✅ Verification
- [ ] Application is accessible at production URL
- [ ] All critical features work correctly
- [ ] Performance metrics are within acceptable ranges
- [ ] Error monitoring shows no critical issues
- [ ] Analytics are tracking correctly

### ✅ Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerting
- [ ] Monitor performance metrics
- [ ] Set up log aggregation
- [ ] Configure backup monitoring

### ✅ Documentation
- [ ] Update deployment notes
- [ ] Document any configuration changes
- [ ] Update runbooks if needed
- [ ] Share deployment status with team

## Rollback Plan

### 🚨 Emergency Rollback
1. **Immediate Action**: Revert to previous deployment
2. **Investigation**: Identify root cause of issue
3. **Fix**: Implement proper fix
4. **Re-deploy**: Deploy fixed version
5. **Post-mortem**: Document lessons learned

### Rollback Commands
```bash
# Firebase rollback
firebase hosting:clone srow:live srow:live --version-id PREVIOUS_VERSION_ID

# Vercel rollback
vercel rollback PREVIOUS_DEPLOYMENT_ID

# Git rollback
git revert HEAD
git push origin main
```

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript compilation errors
- Verify environment variables

#### Deployment Failures
- Check Firebase project configuration
- Verify service account permissions
- Check Vercel project linking
- Verify domain configuration

#### Runtime Issues
- Check environment variables
- Verify database connections
- Check external service configurations
- Monitor error logs

### Debug Commands
```bash
# Check build output
npm run build

# Check environment variables
node -e "console.log(process.env.NODE_ENV)"

# Check Firebase status
firebase projects:list

# Check Vercel status
vercel whoami

# Run health check
npm run health:check
```

## Success Metrics

### 🎯 Deployment Success
- [ ] Zero-downtime deployment
- [ ] All tests pass in CI/CD
- [ ] No critical errors in production
- [ ] Performance metrics maintained
- [ ] User experience unaffected

### 📊 Performance Targets
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%

---

**Remember**: Always test on staging before deploying to production!
**Emergency Contact**: [Your Team Contact Information]
