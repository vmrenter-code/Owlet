import React, { createContext, useState, ReactNode, useContext } from 'react';
import { usePolarH9 } from '../src/services/polarH9Service';

interface ScreeningContextType {
  screeningId: string | null;
  setScreeningId: (id: string) => void;
  videoNumber: number;
  setVideoNumber: (num: number) => void;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export const ScreeningProvider = ({ children }: { children: ReactNode }) => {
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [videoNumber, setVideoNumber] = useState(1);

  return (
    <ScreeningContext.Provider value={{ screeningId, setScreeningId, videoNumber, setVideoNumber }}>
      {children}
    </ScreeningContext.Provider>
  );
};

export const useScreening = () => {
  const context = useContext(ScreeningContext);
  if (!context) throw new Error('useScreening must be used within ScreeningProvider');
  return context;
};