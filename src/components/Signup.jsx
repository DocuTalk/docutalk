import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import { gradient } from "../assets";
import Button from "./Button";
import authService from "../lib/appwrite";
import { useSession } from '../context/SessionContext';

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkSession } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.createAccount(formData);
      if (response?.currentUser?.$id) {
        // Update session context
        await checkSession();
        
        console.log('Account created successfully!');
        
        // Navigate to dashboard
        navigate('/dashboard', { 
          replace: true,
          state: { from: 'signup' }
        });
      } else {
        throw new Error('Failed to create account: Invalid response');
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
    <>
      <Section className="pt-[12rem] -mt-[5.25rem]" crosses crossesOffset="lg:translate-y-[5.25rem]">
        <div className="container relative">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem]">
            <h1 className="h1 mb-6">
              Create Your Account
            </h1>
            <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2">
              Join DocuTalk to start your AI-powered journey
            </p>
          </div>

          <div className="relative max-w-[40rem] mx-auto">
            <div className="relative z-1 p-8 rounded-2xl bg-n-8 border border-n-6">
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
                    placeholder="Choose a strong password"
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

      {/* Bottom section with crosses */}
      <Section crosses />
    </>
  );
};

export default Signup; 