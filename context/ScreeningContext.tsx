import React, { createContext, useContext, useState, ReactNode } from 'react';

type ScreeningContextType = {
  screeningID: string | null;
  setScreeningID: (id: string | null) => void;
  startScreening: () => string;
  endScreening: () => void;
};

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [screeningID, setScreeningID] = useState<string | null>(null);

  const startScreening = () => {
    // Generate a unique screening ID (timestamp + random string)
    const newID = `screening_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setScreeningID(newID);
    console.log('Screening started with ID:', newID);
    return newID;
  };

  const endScreening = () => {
    console.log('Screening ended:', screeningID);
    setScreeningID(null);
  };

  return (
    <ScreeningContext.Provider value={{ screeningID, setScreeningID, startScreening, endScreening }}>
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const context = useContext(ScreeningContext);
  if (context === undefined) {
    throw new Error('useScreening must be used within a ScreeningProvider');
  }
  return context;
}
