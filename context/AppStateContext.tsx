import React, {createContext, useContext, useState, ReactNode,} from 'react';

/** Set to false to restore Launch → login → onboarding. */
const DEV_START_AT_HOME = false;

type AppUser = {
  uid: string;
  hasCompletedOnboarding: boolean;
};

const DEV_HOME_USER: AppUser = {
  uid: 'dev-local',
  hasCompletedOnboarding: true,
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
  const [user, setUser] = useState<AppUser | null>(
    DEV_START_AT_HOME ? DEV_HOME_USER : null
  );

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