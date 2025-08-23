import axios, { Axios } from 'axios';
import { useContext, createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

interface AppContextType {
  currency: string;
  navigate: ReturnType<typeof useNavigate>;
  user: any | null | undefined; // Replace 'any' with the correct Clerk user type if available
  getToken: ReturnType<typeof useAuth>['getToken'];
  isOwner: boolean;
  setIsOwner: React.Dispatch<React.SetStateAction<boolean>>;
  axios: Axios;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const currency = import.meta.env.VITE_CURRENCY || 'R';
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/user`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      
      if (response.data.success) {
        setIsOwner(response.data.role === 'Owner');
      } else {
        // Retry fetching user data after 5 seconds
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const value: AppContextType = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};