import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Section from "./Section";
import { gradient } from "../assets";
import Button from "./Button";
import authService from "../lib/appwrite";
import { useSession } from '../context/SessionContext';
import LoadingScreen from './LoadingScreen';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, checkSession } = useSession();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const session = await authService.login(formData);
      if (session) {
        await checkSession();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses crossesOffset="lg:translate-y-[5.25rem]">
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto">
          <h1 className="h1 mb-6 text-center">Welcome Back</h1>
          <p className="text-n-3 text-center text-lg mb-12">
            Sign in to continue with DocuTalk
          </p>

          <div className="bg-n-8 border border-n-6 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="text-red-500 text-center p-2 bg-red-500/10 rounded">
                  {error}
                </div>
              )}
              
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
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-n-6 text-color-1 focus:ring-color-1"
                  />
                  <span className="text-n-3">Remember me</span>
                </label>
                <a href="#" className="text-color-1 hover:text-color-1/80">
                  Forgot Password?
                </a>
              </div>

              <Button 
                className="w-full" 
                type="submit"
              >
                Sign In
              </Button>

              <p className="text-center text-n-4">
                Don't have an account?{" "}
                <a 
                  onClick={() => navigate('/signup')} 
                  className="text-color-1 hover:text-color-1/80 cursor-pointer"
                >
                  Sign up
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

export default Login; 