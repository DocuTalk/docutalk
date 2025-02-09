import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ButtonGradient from './assets/svg/ButtonGradient';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import Documents from './components/Documents';
import RootRoute from './components/RootRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { SessionProvider } from './context/SessionContext';
import Upload from './components/Upload';
import Profile from './components/Profile';
import { useEffect } from 'react';
import docutalkLogo from './assets/docutalk-logo.png';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
import About from './pages/About';
import EditProfile from './pages/EditProfile';
import FAQs from './pages/FAQs';
import Guide from './pages/Guide';
import Verify from './components/Verify';
import { Toaster } from 'react-hot-toast';

// Add future flags for React Router v7
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  useEffect(() => {
    document.title = 'DocuTalk - AI Document Analysis';
    
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = docutalkLogo;
      document.head.appendChild(newFavicon);
    } else {
      favicon.href = docutalkLogo;
    }
  }, []);

  console.log('App component rendering');
  
  return (
    <SessionProvider>
      <Toaster position="top-center" />
      <Router basename="/docutalk" {...router}>
        <>
          <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden bg-n-8">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<RootRoute />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Documents />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/upload" 
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-profile" 
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/about" element={<About />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/docutalk/verify" element={<Verify />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ButtonGradient />
        </>
      </Router>
    </SessionProvider>
  );
}

export default App;
