import colors from './colors';

// Simple environment check that works in Vite
const isDev = import.meta?.env?.DEV ?? false;

// Development defaults
const devConfig = {
  appwriteEndpoint: 'https://cloud.appwrite.io/v1',
  appwriteProjectId: '6771e4f60010b0ea14e8',
  appwriteDatabaseId: '6771e89c0009dc7238e6',
  appwriteStorageId: '6771f53e0019f09c79b0',
  appwriteUserCollectionId: '6771f2f1001182783d8b',
  appwriteDocCollectionId: '6771f2fb001d0972bb5d',
  uploadApiEndpoint: 'http://localhost:3001/api',
  deleteApiEndpoint: 'http://localhost:3001/api',
  queryApiEndpoint: 'http://localhost:3001/api',
  standardMaxQueryCount: 100,
  standardMaxDocCount: 1
};

// Production config using Vite's import.meta.env
const prodConfig = {
  appwriteEndpoint: import.meta.env.DOCUTALK_APPWRITE_ENDPOINT,
  appwriteProjectId: import.meta.env.DOCUTALK_APPWRITE_PROJECT_ID,
  appwriteDatabaseId: import.meta.env.DOCUTALK_APPWRITE_DATABASE_ID,
  appwriteStorageId: import.meta.env.DOCUTALK_APPWRITE_STORAGE_ID,
  appwriteUserCollectionId: import.meta.env.DOCUTALK_APPWRITE_USER_COLLECTION_ID,
  appwriteDocCollectionId: import.meta.env.DOCUTALK_APPWRITE_DOC_COLLECTION_ID,
  uploadApiEndpoint: import.meta.env.DOCUTALK_UPLOAD_API_ENDPOINT,
  deleteApiEndpoint: import.meta.env.DOCUTALK_DELETE_API_ENDPOINT,
  queryApiEndpoint: import.meta.env.DOCUTALK_QUERY_API_ENDPOINT,
  standardMaxQueryCount: Number(import.meta.env.STANDARD_MAX_QUERY_COUNT || 100),
  standardMaxDocCount: Number(import.meta.env.STANDARD_MAX_DOC_COUNT || 1)
};

// Base config that works in all environments
const baseConfig = {
  appName: 'DocuTalk',
  colors,
  isDev
};

// Create a safe config getter that works in all environments
const getConfig = () => {
  try {
    return {
      ...baseConfig,
      ...(isDev ? devConfig : prodConfig)
    };
  } catch (error) {
    // Fallback to dev config if there's an error
    console.warn('Config error, falling back to dev config:', error);
    return {
      ...baseConfig,
      ...devConfig
    };
  }
};

// Export the config
export const config = getConfig();

// Add runtime validation in browser environment
if (typeof window !== 'undefined' && !isDev) {
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