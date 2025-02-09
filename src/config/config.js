import colors from './colors';

// Simple environment check that works in Vite
const isDev = import.meta?.env?.DEV ?? false;

// Get env variable with fallback
const getEnvVar = (key, fallback = '') => {
  const value = import.meta.env[`VITE_${key}`] || process.env[`VITE_${key}`];
  if (!value && fallback === '') {
    console.warn(`Missing environment variable: VITE_${key}`);
  }
  return value || fallback;
};

// Debug all environment variables
console.log('All Environment Variables:', import.meta.env);

// Debug specific environment variables
const debugEnvVars = {
  VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  VITE_APPWRITE_STORAGE_ID: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  VITE_APPWRITE_USER_COLLECTION_ID: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  VITE_APPWRITE_DOC_COLLECTION_ID: import.meta.env.VITE_APPWRITE_DOC_COLLECTION_ID,
  VITE_DEV_API_ENDPOINT: import.meta.env.VITE_DEV_API_ENDPOINT,
  VITE_UPLOAD_API_ENDPOINT: import.meta.env.VITE_UPLOAD_API_ENDPOINT,
  VITE_DELETE_API_ENDPOINT: import.meta.env.VITE_DELETE_API_ENDPOINT,
  VITE_QUERY_API_ENDPOINT: import.meta.env.VITE_QUERY_API_ENDPOINT,
  VITE_MAX_QUERY_COUNT: import.meta.env.VITE_MAX_QUERY_COUNT,
  VITE_MAX_DOC_COUNT: import.meta.env.VITE_MAX_DOC_COUNT
};

console.log('Debug Environment Variables:', debugEnvVars);

// Development and Production use the same config source
const sharedConfig = {
  appwriteEndpoint: 'https://cloud.appwrite.io/v1',
  appwriteProjectId: getEnvVar('APPWRITE_PROJECT_ID'),
  appwriteDatabaseId: getEnvVar('APPWRITE_DATABASE_ID'),
  appwriteStorageId: getEnvVar('APPWRITE_STORAGE_ID'),
  appwriteUserCollectionId: getEnvVar('APPWRITE_USER_COLLECTION_ID'),
  appwriteDocCollectionId: getEnvVar('APPWRITE_DOC_COLLECTION_ID'),
  devApiEndpoint: getEnvVar('DEV_API_ENDPOINT'),
  uploadApiEndpoint: getEnvVar('UPLOAD_API_ENDPOINT'),
  deleteApiEndpoint: getEnvVar('DELETE_API_ENDPOINT'),
  queryApiEndpoint: getEnvVar('QUERY_API_ENDPOINT'),
  standardMaxQueryCount: Number(getEnvVar('MAX_QUERY_COUNT', '100')),
  standardMaxDocCount: Number(getEnvVar('MAX_DOC_COUNT', '1'))
};

console.log('Shared Config:', sharedConfig);

// Base config that works in all environments
const baseConfig = {
  appName: 'DocuTalk',
  colors,
  isDev,
  hostname: isDev ? 'localhost:5173' : 'docutalk.github.io'
};

// Create a safe config getter that works in all environments
const getConfig = () => {
  try {
    const config = {
      ...baseConfig,
      ...sharedConfig,
      endpoint: 'https://cloud.appwrite.io/v1',
      project: getEnvVar('APPWRITE_PROJECT_ID')
    };

    console.log('Final Config:', config);

    // Validate required configuration
    const requiredKeys = [
      'appwriteProjectId',
      'appwriteDatabaseId',
      'appwriteStorageId',
      'appwriteUserCollectionId',
      'appwriteDocCollectionId',
      'uploadApiEndpoint',
      'deleteApiEndpoint',
      'queryApiEndpoint'
    ];

    console.log('Checking Required Keys:', requiredKeys);
    
    const missingKeys = requiredKeys.filter(key => {
      const hasKey = !!config[key];
      console.log(`Checking ${key}:`, hasKey, 'Value:', config[key]);
      return !hasKey;
    });

    if (missingKeys.length > 0) {
      console.error('Missing Keys:', missingKeys);
      console.error('Available Environment Variables:', import.meta.env);
      console.error('Config Values:', JSON.stringify(config, null, 2));
      throw new Error(`Missing required configuration: ${missingKeys.join(', ')}`);
    }

    return config;
  } catch (error) {
    console.error('Config Error Details:', {
      error: error.message,
      stack: error.stack,
      env: import.meta.env.MODE,
      availableEnv: Object.keys(import.meta.env)
    });
    throw error;
  }
};

// Export the config
export const config = getConfig();
export default config; 