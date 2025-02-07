import { createContext, useContext, useState, useTransition, useEffect } from 'react';
import authService from '../lib/appwrite';
import LoadingScreen from '../components/LoadingScreen';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isInitialCheck, setIsInitialCheck] = useState(true);

    const clearSession = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('appwrite_session');
    };

    const checkSession = async (skipInitialFlag = false) => {
        try {
            const currentUser = await authService.init();
            
            startTransition(() => {
                if (currentUser) {
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } else {
                    clearSession();
                }
                if (isInitialCheck) {
                    setIsInitialCheck(false);
                }
            });
        } catch (error) {
            // Only log error if it's not the initial "not logged in" state
            if (error.code !== 401 && !isInitialCheck) {
                console.error('Session check error:', error);
            }
            clearSession();
            if (isInitialCheck) {
                setIsInitialCheck(false);
            }
        }
    };

    // Initial session check
    useEffect(() => {
        const initSession = async () => {
            if (isInitialCheck) {
                const hasSession = localStorage.getItem('appwrite_session');
                if (hasSession) {
                    await checkSession(true);
                } else {
                    setIsInitialCheck(false);
                }
            }
        };

        initSession();
    }, [isInitialCheck]);

    const value = {
        user,
        isAuthenticated,
        isLoading: isPending || isInitialCheck,
        checkSession: () => checkSession(false),
        logout: async () => {
            try {
                await authService.logout();
                clearSession();
            } catch (error) {
                console.error('Logout error:', error);
                clearSession();
            }
        }
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}; 