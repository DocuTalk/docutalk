import { useSession } from '../context/SessionContext';
import Home from './Home';

const RootRoute = () => {
  const { isAuthenticated } = useSession();

  // Always render Home component, regardless of auth state
  return <Home />;
};

export default RootRoute; 