import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import { gradient } from "../assets";
import Button from "./Button";
import authService from "../lib/appwrite";
import { useSession } from '../context/SessionContext';
import LoadingScreen from './LoadingScreen';
import Heading from './Heading';
import config from "../config/config";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: isSessionLoading, checkSession } = useSession();
  const [documentCount, setDocumentCount] = useState(0);
  const [userDocuments, setUserDocuments] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.userDocId) {
        setIsDataLoading(true);
        try {
          const [count, docs] = await Promise.all([
            authService.getUserDocumentCount(user.userDocId),
            authService.getUserDocuments(user.userDocId)
          ]);
          setDocumentCount(count);
          setUserDocuments(docs);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setIsDataLoading(false);
        }
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

  // Debug user data
  useEffect(() => {
    if (user) {
      console.log('Dashboard User Data:', {
        createdAt: user.$createdAt,
        updatedAt: user.$updatedAt,
        fullUser: user
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await authService.logout();
      await checkSession();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isSessionLoading || isDataLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Section 
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
      >
        <div className="container relative">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem]">
            <h1 className="h1 mb-6">
              Welcome back, {user?.name}!
            </h1>
            <p className="body-1 max-w-3xl mx-auto text-n-2">
              Your Document Analysis Dashboard
            </p>
          </div>
        </div>
      </Section>

      {/* Profile Section */}
      <Section>
        <div className="container relative">
          <Heading
            title="Your Profile"
            text="Manage your account settings and preferences"
          />

          <div className="relative max-w-[40rem] mx-auto">
            <div className="relative z-1 p-8 rounded-2xl bg-n-8 border border-n-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className={`text-[${config.colors.textSecondary}]`}>Username</span>
                  <span className={`text-[${config.colors.textPrimary}]`}>{user?.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[${config.colors.textSecondary}]`}>Email</span>
                  <span className={`text-[${config.colors.textPrimary}]`}>{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[${config.colors.textSecondary}]`}>Account ID</span>
                  <span className={`text-[${config.colors.textPrimary}] font-code text-sm`}>{user?.$id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[${config.colors.textSecondary}]`}>User Doc ID</span>
                  <span className={`text-[${config.colors.textPrimary}] font-code text-sm`}>{user?.userDocId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[${config.colors.textSecondary}]`}>Email Verification</span>
                  <span className={`text-[${config.colors.textPrimary}]`}>
                    {user?.emailVerification ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
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
      </Section>

      {/* Documents Section */}
      <Section>
        <div className="container relative">
          <Heading
            title="Your Documents"
            text="View and manage your analyzed documents"
          />

          <div className="relative max-w-[40rem] mx-auto">
            <div className="relative z-1 p-8 rounded-2xl bg-n-8 border border-n-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className={`text-[${config.colors.textSecondary}]`}>Total Documents</span>
                  <span className={`text-[${config.colors.textPrimary}]`}>{documentCount}</span>
                </div>
                {userDocuments.length > 0 ? (
                  userDocuments.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center">
                      <span className={`text-[${config.colors.textSecondary}]`}>{doc.name}</span>
                      <Button onClick={() => navigate(`/documents/${doc.id}`)}>
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className={`text-[${config.colors.textSecondary}] text-center py-4`}>
                    No documents yet. Start by uploading one!
                  </p>
                )}
                <Button className="w-full mt-4">
                  Upload New Document
                </Button>
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
      </Section>

      <Section crosses />
    </>
  );
};

export default Dashboard; 