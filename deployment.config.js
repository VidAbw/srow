/**
 * Deployment Configuration
 * This file defines environment-specific configurations for deployment
 */

const environments = {
  development: {
    name: 'Development',
    url: 'http://localhost:3000',
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || 'dev-project',
      hosting: {
        public: 'out',
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [{ source: '**', destination: '/index.html' }]
      }
    },
    vercel: {
      production: false,
      preview: true
    },
    features: {
      debug: true,
      mockData: true,
      analytics: false
    }
  },

  staging: {
    name: 'Staging',
    url: process.env.STAGING_URL || 'https://staging.yourdomain.com',
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || 'staging-project',
      hosting: {
        public: 'out',
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [{ source: '**', destination: '/index.html' }],
        headers: [
          {
            source: '**/*.@(js|css)',
            headers: [
              { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
            ]
          }
        ]
      }
    },
    vercel: {
      production: false,
      preview: true
    },
    features: {
      debug: false,
      mockData: false,
      analytics: true
    }
  },

  production: {
    name: 'Production',
    url: process.env.PRODUCTION_URL || 'https://yourdomain.com',
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || 'prod-project',
      hosting: {
        public: 'out',
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [{ source: '**', destination: '/index.html' }],
        headers: [
          {
            source: '**/*.@(js|css)',
            headers: [
              { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
            ]
          },
          {
            source: '**/*.@(jpg|jpeg|gif|png|svg|webp|ico)',
            headers: [
              { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
            ]
          }
        ]
      }
    },
    vercel: {
      production: true,
      preview: false
    },
    features: {
      debug: false,
      mockData: false,
      analytics: true
    }
  }
};

/**
 * Get environment configuration
 * @param {string} env - Environment name (development, staging, production)
 * @returns {Object} Environment configuration
 */
function getEnvironmentConfig(env = process.env.NODE_ENV || 'development') {
  return environments[env] || environments.development;
}

/**
 * Get Firebase hosting configuration for environment
 * @param {string} env - Environment name
 * @returns {Object} Firebase hosting configuration
 */
function getFirebaseConfig(env = process.env.NODE_ENV || 'development') {
  const config = getEnvironmentConfig(env);
  return config.firebase;
}

/**
 * Get Vercel configuration for environment
 * @param {string} env - Environment name
 * @returns {Object} Vercel configuration
 */
function getVercelConfig(env = process.env.NODE_ENV || 'development') {
  const config = getEnvironmentConfig(env);
  return config.vercel;
}

/**
 * Get feature flags for environment
 * @param {string} env - Environment name
 * @returns {Object} Feature flags
 */
function getFeatureFlags(env = process.env.NODE_ENV || 'development') {
  const config = getEnvironmentConfig(env);
  return config.features;
}

/**
 * Validate environment configuration
 * @param {string} env - Environment name
 * @returns {boolean} Is configuration valid
 */
function validateEnvironmentConfig(env = process.env.NODE_ENV || 'development') {
  const config = getEnvironmentConfig(env);
  
  // Check required fields
  const required = ['name', 'url', 'firebase', 'vercel', 'features'];
  const missing = required.filter(field => !config[field]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required configuration fields: ${missing.join(', ')}`);
    return false;
  }
  
  // Check Firebase configuration
  const firebaseRequired = ['projectId', 'hosting'];
  const firebaseMissing = firebaseRequired.filter(field => !config.firebase[field]);
  
  if (firebaseMissing.length > 0) {
    console.error(`❌ Missing Firebase configuration: ${firebaseMissing.join(', ')}`);
    return false;
  }
  
  console.log(`✅ Environment configuration for ${env} is valid`);
  return true;
}

module.exports = {
  environments,
  getEnvironmentConfig,
  getFirebaseConfig,
  getVercelConfig,
  getFeatureFlags,
  validateEnvironmentConfig
};
