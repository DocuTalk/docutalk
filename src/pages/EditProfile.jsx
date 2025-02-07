import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Section from "../components/Section";
import { gradient } from "../assets";
import Button from "../components/Button";
import { useSession } from '../context/SessionContext';
import authService from '../lib/appwrite';
import Modal from '../components/Modal';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useSession();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: null,
    previewUrl: user?.avatar || null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user name if changed
      if (formData.name !== user.name) {
        await authService.updateName(formData.name);
      }

      // Update avatar if changed
      if (formData.avatar) {
        await authService.updateAvatar(formData.avatar);
      }

      // Get updated user data
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/profile');
  };

  return (
    <>
      <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-12">
            <h1 className="h1 mb-6">Edit Profile</h1>
          </div>

          <div className="relative z-1 max-w-[40rem] mx-auto">
            <div className="bg-n-8 border border-n-6 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-2 border-n-6 bg-n-7 overflow-hidden">
                      {formData.previewUrl ? (
                        <img 
                          src={formData.previewUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-n-6 text-4xl text-n-1">
                          {formData.name.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-n-7 border border-n-6 flex items-center justify-center cursor-pointer hover:bg-n-6 transition-colors"
                    >
                      <svg 
                        className="w-5 h-5 text-n-1" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                    </label>
                  </div>
                  <p className="text-n-3 text-sm">Click to upload new avatar</p>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block mb-2 text-n-1" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-n-7 border border-n-6 text-n-1 focus:outline-none focus:border-n-5"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Display */}
                <div>
                  <label className="block mb-2 text-n-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-n-7 border border-n-6 text-n-1 opacity-70"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-4">
                  <Button
                    className="flex-1"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    className="flex-1"
                    type="button"
                    onClick={() => navigate('/profile')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
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

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Profile Updated"
        message="Your profile has been successfully updated."
        type="success"
      />

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Update Failed"
        message={errorMessage}
        type="error"
      />
    </>
  );
};

export default EditProfile; 