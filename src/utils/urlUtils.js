export const getVerificationUrl = () => {
  const baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:5173'
    : 'https://docutalk.github.io/docutalk';

  return `${baseUrl}/verify`;
}; 