import { account } from '../lib/appwrite';
import { toast } from 'react-hot-toast';

const verifyUrl = import.meta.env.PROD 
  ? import.meta.env.VITE_PROD_VERIFY_URL 
  : import.meta.env.VITE_DEV_VERIFY_URL;

const ResendVerification = () => {
  const handleResend = async () => {
    try {
      await account.createVerification(verifyUrl);
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Failed to send verification email');
    }
  };

  return (
    <button 
      onClick={handleResend}
      className="text-blue-600 hover:text-blue-800 underline"
    >
      Resend verification email
    </button>
  );
};

export default ResendVerification; 