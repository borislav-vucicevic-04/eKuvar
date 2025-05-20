// context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isAuthorised: boolean | null;
  setIsAuthorised: (isAuthorised: boolean | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

  return (
    <AuthContext.Provider value={{ isAuthorised, setIsAuthorised }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth mora biti koristen unutart AuthProvidera");
  return context;
};
