const isDev = import.meta.env.DEV;

// Color scheme based on Material Design with Android green
export const colors = {
  primary: '#1CA961', // Android green
  primaryLight: '#4BD88F',
  primaryDark: '#167D49',
  primaryAlpha: 'rgba(28, 169, 97, 0.1)', // For transparent backgrounds

  // Text colors
  textPrimary: '#FFFFFF',  // n-1
  textSecondary: '#9BA1A9', // n-3
  textDisabled: '#6F767E', // n-4

  // Background colors
  background: '#141716', // n-8
  surfacePrimary: '#222326', // n-7
  surfaceSecondary: '#191B1F', // n-6
  border: '#292B2F', // n-5

  // Status colors
  success: '#1CA961', // Same as primary for consistency
  error: '#FF4B4B',
  warning: '#FFB800',
  info: '#3B82F6',

  // Gradients
  buttonGradient: 'linear-gradient(92.09deg, #1CA961 -11.68%, #4BD88F 97.36%)',
  backgroundGradient: 'linear-gradient(180deg, rgba(28, 169, 97, 0.05) 0%, rgba(28, 169, 97, 0) 100%)',
};

export const config = {
    appName: 'DocuTalk',
    appwriteEndpoint: 'https://cloud.appwrite.io/v1',
    appwriteProjectId: '6771e4f60010b0ea14e8',
    appwriteDatabaseId: '6771e89c0009dc7238e6',
    appwriteStorageId: '6771f53e0019f09c79b0',
    appwriteUserCollectionId: '6771f2f1001182783d8b',
    appwriteDocCollectionId: '6771f2fb001d0972bb5d',
    uploadApiEndpoint: isDev 
        ? 'http://localhost:3001/api'
        : import.meta.env.DOCUTALK_UPLOAD_API_ENDPOINT,
    deleteApiEndpoint: isDev
        ? 'http://localhost:3001/api'
        : import.meta.env.DOCUTALK_DELETE_API_ENDPOINT,
    queryApiEndpoint: isDev
        ? 'http://localhost:3001/api'
        : import.meta.env.DOCUTALK_QUERY_API_ENDPOINT,
    isDev,
    standardMaxQueryCount: import.meta.env.VITE_STANDARD_MAX_QUERY_COUNT || 100,
    standardMaxDocCount: import.meta.env.VITE_STANDARD_MAX_DOC_COUNT || 1,
    colors, // Export colors as part of config
};

export default config; 