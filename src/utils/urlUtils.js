export const getVerificationUrl = () => {
  return window.location.hostname === 'localhost'
    ? import.meta.env.VITE_DEV_VERIFY_URL
    : import.meta.env.VITE_PROD_VERIFY_URL;
}; 