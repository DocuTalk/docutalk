import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { account } from '../lib/appwrite';
import { gradient } from "../assets";
import Button from './Button';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get params regardless of whether the URL includes /docutalk or not
    const secret = searchParams.get('secret');
    const userId = searchParams.get('userId');

    if (!secret || !userId) {
      setVerificationStatus('Invalid verification link');
      return;
    }

    const verifyUser = async () => {
      try {
        await account.updateVerification(userId, secret);
        setVerificationStatus('Email verified successfully!');
        
        // Get user data after verification
        try {
          const user = await account.get();
          setUserData(user);
          setShowModal(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('Verification failed. Please try again.');
      }
    };

    verifyUser();
  }, [searchParams, navigate]);

  const handleOkClick = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-n-8">
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center">
          <div className="p-8 bg-n-7 rounded-2xl border border-n-6">
            <h1 className="h3 mb-4 text-color-1">Email Verification</h1>
            <p className="text-n-3">{verificationStatus}</p>

            {/* Success Modal */}
            {showModal && userData && (
              <div className="mt-8 p-6 bg-n-6 rounded-xl border border-n-5">
                <div className="flex flex-col items-center">
                  {/* User Avatar */}
                  <div className="w-20 h-20 mb-4 rounded-full bg-n-5 flex items-center justify-center">
                    <span className="text-2xl text-color-1">
                      {userData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* User Info */}
                  <h2 className="h4 mb-2 text-color-1">{userData.name}</h2>
                  <p className="text-n-3 mb-4">{userData.email}</p>
                  
                  {/* Success Message */}
                  <div className="text-center">
                    <p className="text-n-2 mb-2">Your email has been verified successfully!</p>
                    <p className="text-n-3 mb-6">Click OK to continue to homepage</p>
                    
                    {/* OK Button */}
                    <Button 
                      className="min-w-[120px]"
                      onClick={handleOkClick}
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute top-0 -left-[10rem] w-[56.625rem] h-[56.625rem] opacity-50 mix-blend-color-dodge pointer-events-none">
          <img
            className="absolute top-1/2 left-1/2 w-[79.5625rem] h-[88.5625rem] -translate-x-1/2 -translate-y-1/2"
            src={gradient}
            alt="Gradient"
          />
        </div>
      </div>
    </div>
  );
};

export default Verify; 