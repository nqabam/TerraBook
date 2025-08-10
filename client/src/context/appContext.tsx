import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth, } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import type { UserResource } from "@clerk/types";


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL as string;

// Define the context value type
interface AppContextType {
  currency: string;
  navigate: ReturnType<typeof useNavigate>;
  user: UserResource | null | undefined;
  getToken: () => Promise<string | null>;
  isOwner: boolean;
  setIsOwner: React.Dispatch<React.SetStateAction<boolean>>;
  axios: typeof axios;
  showRegister: boolean;
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
  searchedCities: string[];
  setSearchedCities: React.Dispatch<React.SetStateAction<string[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const currency = (import.meta.env.VITE_CURRENCY as string) || "R";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [searchedCities, setSearchedCities] = useState<string[]>([]);

  const fetchUser = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === "owner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        setTimeout(fetchUser, 5000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to fetch user data");
      } else {
        toast.error("Failed to fetch user data");
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    } else {
      setIsOwner(false);
      setSearchedCities([]);
    }
  }, [user]);

  const value: AppContextType = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showRegister,
    setShowRegister,
    searchedCities,
    setSearchedCities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
