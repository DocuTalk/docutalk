import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useSession();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate 
      to="/login" 
      replace 
      state={{ from: location.pathname }}
    />;
  }

  return children;
};

export default ProtectedRoute; 