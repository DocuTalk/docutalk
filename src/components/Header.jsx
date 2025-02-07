import { useLocation, Link, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect } from "react";

import docutalkLogo from "../assets/docutalk-logo.png";
import { publicNavigation, privateNavigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import authService from "../lib/appwrite";
import { useSession } from '../context/SessionContext';
import ConfirmDialog from './ConfirmDialog';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, logout, checkSession } = useSession();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Close navigation on route change
  useEffect(() => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    }
  }, [location.pathname]);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = (e, item) => {
    if (openNavigation) {
      enablePageScroll();
      setOpenNavigation(false);
    }

    // Handle hash navigation for both home and dashboard
    if (item.url.startsWith('#')) {
      e.preventDefault();
      
      if (!isHomePage) {
        navigate('/');
        return;
      }
      
      const targetElement = document.querySelector(item.url);
      if (targetElement) {
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Effect to handle scrolling when navigating to home with hash
  useEffect(() => {
    if (isHomePage && location.state?.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // Clean up state after scrolling
      navigate('/', { state: null, replace: true });
    }
  }, [isHomePage, location.state]);

  // Add effect to handle hash navigation after page load
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSignOutClick = () => {
    setShowSignOutDialog(true);
    disablePageScroll(); // Lock scroll when opening dialog
    if (openNavigation) {
      setOpenNavigation(false);
    }
  };

  const handleCloseSignOutDialog = () => {
    setShowSignOutDialog(false);
    enablePageScroll(); // Enable scroll when closing dialog
  };

  const handleSignOut = async () => {
    try {
      await logout();
      await checkSession();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setShowSignOutDialog(false);
      enablePageScroll(); // Enable scroll after sign out
    }
  };

  // Get navigation items based on auth state and current page
  const getNavigation = () => {
    if (isLoading) return [];
    
    // When authenticated, always show private navigation
    if (isAuthenticated) {
      return privateNavigation;
    }
    
    // When not authenticated, show public navigation
    return publicNavigation;
  };

  const renderNavLink = (item) => {
    // For hash links
    if (item.url.startsWith('#')) {
      return (
        <a
          key={item.id}
          href={item.url}
          onClick={(e) => handleClick(e, item)}
          className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
            item.onlyMobile ? "lg:hidden" : ""
          } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
            isHomePage && location.hash === item.url
              ? "z-2 lg:text-n-1"
              : "lg:text-n-1/50"
          } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
        >
          {item.title}
        </a>
      );
    }

    // For regular routes
    return (
      <Link
        key={item.id}
        to={item.url}
        onClick={(e) => handleClick(e, item)}
        className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
          item.onlyMobile ? "lg:hidden" : ""
        } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
          location.pathname === item.url
            ? "z-2 lg:text-n-1"
            : "lg:text-n-1/50"
        } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
      >
        {item.title}
      </Link>
    );
  };

  const renderAuthButtons = () => {
    if (isLoading) return null;

    if (isAuthenticated && user) {
      return (
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-n-1/50">
            Hello, {user.name || user.email}
          </span>
          <Button 
            className="ml-4" 
            onClick={handleSignOutClick}
          >
            Sign out
          </Button>
        </div>
      );
    }

    return (
      <div className="hidden lg:flex items-center">
        <Button className="mr-4" onClick={() => navigate('/login')}>
          Sign In
        </Button>
        <Button onClick={() => navigate('/signup')}>
          Sign Up
        </Button>
      </div>
    );
  };

  const renderMobileAuthButtons = () => {
    if (isLoading) return null;

    if (isAuthenticated && user) {
      return (
        <div className="flex items-center justify-center mt-4 lg:hidden">
          <Button 
            className="w-full max-w-[200px]" 
            onClick={handleSignOutClick}
          >
            Sign out
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-4 mt-4 lg:hidden">
        <Button className="w-full" onClick={() => navigate('/login')}>
          Sign In
        </Button>
        <Button className="w-full" onClick={() => navigate('/signup')}>
          Sign Up
        </Button>
      </div>
    );
  };

  const renderMobileUserInfo = () => {
    if (isAuthenticated && user) {
      return (
        <div className="text-n-1/50 font-code text-2xl text-center py-4 mb-4 lg:hidden">
          Hello, {user.name || user.email}
        </div>
      );
    }
    return null;
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link 
          to="#"
          onClick={handleLogoClick}
          className="block w-[12rem] xl:mr-8 flex items-center gap-4"
        >
          <img 
            src={docutalkLogo} 
            width={40} 
            height={40} 
            alt="DocuTalk" 
            className="h-[40px] w-[40px] object-contain"
          />
          <span className="text-2xl font-bold text-white">
            DocuTalk
          </span>
        </Link>

        <nav
          className={`${
            openNavigation ? "flex flex-col" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 z-50 lg:static lg:flex lg:flex-row lg:mx-auto lg:bg-transparent`}
        >
          <div className="flex flex-col h-full lg:flex-row">
            {renderMobileUserInfo()}
            <div className="relative z-2 flex flex-col items-center justify-center flex-1 lg:flex-row">
              {getNavigation().map((item) => renderNavLink(item))}
              {renderMobileAuthButtons()}
            </div>
          </div>

          <HamburgerMenu />
        </nav>

        {renderAuthButtons()}

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showSignOutDialog}
        onClose={handleCloseSignOutDialog}
        onConfirm={handleSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out? You will need to sign in again to access your documents."
      />
    </div>
  );
};

export default Header;