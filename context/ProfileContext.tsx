import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileContextType = {
  profileComplete: boolean;
  setProfileComplete: (value: boolean) => void;
  loading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileComplete, setProfileCompleteState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      const stored = await AsyncStorage.getItem('profileComplete');
      setProfileCompleteState(stored === 'true');
      setLoading(false);
    };

    loadStatus();
  }, []);

  const setProfileComplete = async (value: boolean) => {
    setProfileCompleteState(value);
    await AsyncStorage.setItem('profileComplete', value ? 'true' : 'false');
  };

  return (
    <ProfileContext.Provider
      value={{ profileComplete, setProfileComplete, loading }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
}