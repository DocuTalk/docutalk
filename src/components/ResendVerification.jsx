import { account } from '../lib/appwrite';
import { toast } from 'react-hot-toast';
import { getVerificationUrl } from '../utils/urlUtils';

const ResendVerification = () => {
  const handleResend = async () => {
    try {
      const verifyUrl = getVerificationUrl();
      console.log('Using verification URL:', verifyUrl); // For debugging
      
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