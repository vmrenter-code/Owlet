import React, {createContext, useContext, useState, ReactNode,} from 'react';

type AppUser = {
  uid: string;
  hasCompletedOnboarding: boolean;
};

type AppStateContextType = {
  user: AppUser | null;
  loginUser: (completed?: boolean) => void;
  completeOnboarding: () => void;
  logout: () => void;
};

const AppStateContext =
  createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AppUser | null>(null);

  const loginUser = (completed = true) => {
    setUser({
      uid: '123',
      hasCompletedOnboarding: completed,
    });
  };

  const completeOnboarding = () => {
    setUser((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        hasCompletedOnboarding: true,
      };
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppStateContext.Provider
      value={{
        user,
        loginUser,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error(
      'useAppState must be used within AppStateProvider'
    );
  }

  return context;
}