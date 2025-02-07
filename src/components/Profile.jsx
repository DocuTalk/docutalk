import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import { gradient } from "../assets";
import Button from "./Button";
import { useSession } from '../context/SessionContext';
import config from "../config/config";

const SettingsItem = ({ icon, title, onClick, textStyle, showArrow = true, iconColor, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex justify-between items-center py-3 w-full transition-colors ${
        disabled ? 'opacity-70' : 'hover:bg-n-7'
      }`}
    >
      <div className="flex items-center gap-3">
        <svg 
          className={`w-6 h-6 ${iconColor || `text-[${config.colors.primary}]`}`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor"
        >
          {icon}
        </svg>
        <span className={`text-base font-medium ${textStyle || 'text-n-1'}`}>
          {title}
        </span>
      </div>
      {showArrow && (
        <svg 
          className={`w-6 h-6 text-[${config.colors.primary}]`}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      )}
    </button>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const [loading, setLoading] = useState(false);

  // Debug user data
  useEffect(() => {
    if (user) {
      console.log('User data:', {
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        $createdAt: user.$createdAt,
        $updatedAt: user.$updatedAt,
        rawUser: user
      });
    }
  }, [user]);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) {
      console.log('No date string provided');
      return 'N/A';
    }

    try {
      // Try parsing the ISO string
      const date = new Date(dateString);
      
      // Validate the date
      if (isNaN(date.getTime())) {
        console.log('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      
      // Format the date
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      });

      console.log('Formatted date:', {
        input: dateString,
        output: formatted
      });

      return formatted;
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateString);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="container relative">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-[80px] h-[80px] border-4 border-n-1/10 border-t-color-1 rounded-full animate-spin mb-6"></div>
              <p className="h4 text-n-1/50">Loading...</p>
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
  }

  const handleUpdateProfile = () => {
    // Handle profile update logic
    console.log("Profile update functionality to be implemented");
  };

  return (
    <>
      <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          {/* Avatar Section */}
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-12">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-2 border-n-6 bg-n-7 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-n-6 text-4xl text-n-1">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <button 
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-n-7 border border-n-6 flex items-center justify-center hover:bg-n-6 transition-colors"
                  onClick={() => navigate('/edit-profile')}
                >
                  <svg 
                    className={`w-5 h-5 text-[${config.colors.primary}]`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </div>
              <h2 className="text-2xl font-semibold text-n-1 mb-2">
                {user?.name || 'User'}
              </h2>
              <p className="text-n-3">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="relative z-1 max-w-[40rem] mx-auto">
            <div className="bg-n-8 border border-n-6 rounded-2xl overflow-hidden">
              {/* Documents Section */}
              <div className="border-b border-n-6 p-4">
                <SettingsItem
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />}
                  title="My Documents"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                />
                <SettingsItem
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />}
                  title="Upload Document"
                  onClick={() => navigate('/upload')}
                  disabled={loading}
                />
              </div>

              {/* Help & Support Section */}
              <div className="p-4">
                <SettingsItem
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />}
                  title="Help & Support"
                  onClick={() => navigate('/help')}
                  disabled={loading}
                />
                <SettingsItem
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />}
                  title="Privacy Policy"
                  onClick={() => navigate('/privacy')}
                  disabled={loading}
                />
                <SettingsItem
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />}
                  title="About"
                  onClick={() => navigate('/about')}
                  disabled={loading}
                />
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
      </Section>
    </>
  );
};

export default Profile; 