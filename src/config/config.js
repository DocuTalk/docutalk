import colors from './colors';

// Simple environment check that works in Vite
const isDev = import.meta?.env?.DEV ?? false;

// Get env variable with fallback
const getEnvVar = (key, fallback = '') => {
  return import.meta.env[key] || fallback;
};

// Development and Production use the same config source
const sharedConfig = {
  appwriteEndpoint: getEnvVar('DOCUTALK_APPWRITE_ENDPOINT'),
  appwriteProjectId: getEnvVar('DOCUTALK_APPWRITE_PROJECT_ID'),
  appwriteDatabaseId: getEnvVar('DOCUTALK_APPWRITE_DATABASE_ID'),
  appwriteStorageId: getEnvVar('DOCUTALK_APPWRITE_STORAGE_ID'),
  appwriteUserCollectionId: getEnvVar('DOCUTALK_APPWRITE_USER_COLLECTION_ID'),
  appwriteDocCollectionId: getEnvVar('DOCUTALK_APPWRITE_DOC_COLLECTION_ID'),
  uploadApiEndpoint: getEnvVar('DOCUTALK_UPLOAD_API_ENDPOINT'),
  deleteApiEndpoint: getEnvVar('DOCUTALK_DELETE_API_ENDPOINT'),
  queryApiEndpoint: getEnvVar('DOCUTALK_QUERY_API_ENDPOINT'),
  standardMaxQueryCount: Number(getEnvVar('STANDARD_MAX_QUERY_COUNT', '100')),
  standardMaxDocCount: Number(getEnvVar('STANDARD_MAX_DOC_COUNT', '1'))
};

// Base config that works in all environments
const baseConfig = {
  appName: 'DocuTalk',
  colors,
  isDev,
  hostname: isDev ? 'localhost' : 'docutalk.github.io'
};

// Create a safe config getter that works in all environments
const getConfig = () => {
  try {
    return {
      ...baseConfig,
      ...sharedConfig
    };
  } catch (error) {
    console.error('Config error:', error);
    throw new Error('Failed to load configuration');
  }
};

// Export the config
export const config = getConfig();

// Add runtime validation in browser environment
if (typeof window !== 'undefined') {
  const requiredKeys = [
    'appwriteEndpoint',
    'appwriteProjectId',
    'appwriteDatabaseId',
    'appwriteStorageId',
    'appwriteUserCollectionId',
    'appwriteDocCollectionId',
    'uploadApiEndpoint',
    'deleteApiEndpoint',
    'queryApiEndpoint'
  ];

  const missingKeys = requiredKeys.filter(key => !config[key]);

  if (missingKeys.length > 0) {
    console.error(`Missing required configuration: ${missingKeys.join(', ')}`);
  }
}

export default config; 