export const getVerificationUrl = () => {
  return window.location.hostname === 'localhost'
    ? import.meta.env.VITE_DEV_VERIFY_URL
    : 'https://docutalk.co.uk/verify';
}; 