import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import { gradient } from "../assets";
import Button from "./Button";
import authService from "../lib/appwrite";
import { useSession } from '../context/SessionContext';
import { toast } from 'react-hot-toast';
import { account } from '../lib/appwrite';

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkSession } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyUrl = import.meta.env.PROD 
    ? import.meta.env.VITE_PROD_VERIFY_URL 
    : import.meta.env.VITE_DEV_VERIFY_URL;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Create account first
      const response = await authService.createAccount(formData);
      
      if (response?.currentUser?.$id) {
        // Create session and get the user data
        await checkSession();
        
        // Now send verification email after successful account creation and session
        const verifyUrl = import.meta.env.PROD 
          ? import.meta.env.VITE_PROD_VERIFY_URL 
          : import.meta.env.VITE_DEV_VERIFY_URL;
          
        await account.createVerification(verifyUrl);
        
        // Custom styled toast
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-n-7 border border-n-6 shadow-lg rounded-2xl pointer-events-auto flex items-center`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-color-1">
                    Verification Email Sent
                  </p>
                  <p className="mt-1 text-sm text-n-3">
                    Please check your inbox to verify your email address
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-n-6">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-n-1 hover:text-color-1 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-center',
        });
        
        // Navigate to dashboard
        navigate('/dashboard', { 
          replace: true,
          state: { from: 'signup' }
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
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

  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses crossesOffset="lg:translate-y-[5.25rem]">
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto">
          <h1 className="h1 mb-6 text-center">Create Account</h1>
          <p className="text-n-3 text-center text-lg mb-12">
            Join DocuTalk to start managing your documents
          </p>

          <div className="bg-n-8 border border-n-6 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="text-red-500 text-center p-2 bg-red-500/10 rounded">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block mb-2 text-n-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg bg-n-7 border border-n-6 text-n-1 focus:outline-none focus:border-color-1"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-n-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-n-7 border border-n-6 text-n-1 focus:outline-none focus:border-color-1"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-n-1" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-n-7 border border-n-6 text-n-1 focus:outline-none focus:border-color-1"
                  required
                />
                <p className="mt-1 text-sm text-n-3">
                  Minimum 8 characters with at least one special character
                </p>
              </div>

              <div>
                <label className="block mb-2 text-n-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-lg bg-n-7 border border-n-6 text-n-1 focus:outline-none focus:border-color-1"
                  required
                />
              </div>

              <Button 
                className="w-full" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <p className="text-center text-n-4">
                Already have an account?{" "}
                <a 
                  onClick={() => navigate('/login')} 
                  className="text-color-1 hover:text-color-1/80 cursor-pointer"
                >
                  Sign in
                </a>
              </p>
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
  );
};

export default Signup; 