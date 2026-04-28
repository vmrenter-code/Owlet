import React, { createContext, useState, ReactNode, useContext } from 'react';
import { usePolarH9 } from '../src/services/polarH9Service';
export interface HeartRateDataPoint {
  time: number; // seconds elapsed since screening started
  bpm: number;
}

interface ScreeningContextType {
  screeningId: string | null;
  setScreeningId: (id: string) => void;
  videoNumber: number;
  setVideoNumber: (num: number) => void;
  startScreening: () => string;
  // H9 Heart Rate
  heartRate: number | null;
  connected: boolean;
  scanning: boolean;
  error: string | null;
  connectToH9: () => Promise<void>;
  disconnect: () => void;
  // Heart Rate Log
  heartRateLog: HeartRateDataPoint[];
  addHeartRateDataPoint: (bpm: number) => void;
  clearHeartRateLog: () => void;
  screeningStartTime: number | null;
  setScreeningStartTime: (time: number) => void;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export const ScreeningProvider = ({ children }: { children: ReactNode }) => {
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [videoNumber, setVideoNumber] = useState(1);
  const [heartRateLog, setHeartRateLog] = useState<HeartRateDataPoint[]>([]);
  const [screeningStartTime, setScreeningStartTime] = useState<number | null>(null);

  const { heartRate, connected, scanning, error, connectToH9, disconnect } = usePolarH9();

  const startScreening = () => {
  const newId = `screening_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  setScreeningId(newId);
  return newId;
};

  const addHeartRateDataPoint = (bpm: number) => {
    const elapsed = screeningStartTime
      ? Math.floor((Date.now() - screeningStartTime) / 1000)
      : 0;
    setHeartRateLog(prev => [...prev, { time: elapsed, bpm }]);
  };

  const clearHeartRateLog = () => {
    setHeartRateLog([]);
    setScreeningStartTime(null);
  };

  return (
    <ScreeningContext.Provider value={{
      screeningId,
      setScreeningId,
      videoNumber,
      setVideoNumber,
      startScreening,
      heartRate,
      connected,
      scanning,
      error,
      connectToH9,
      disconnect,
      heartRateLog,
      addHeartRateDataPoint,
      clearHeartRateLog,
      screeningStartTime,
      setScreeningStartTime,
    }}>
      {children}
    </ScreeningContext.Provider>
  );
};

export const useScreening = () => {
  const context = useContext(ScreeningContext);
  if (!context) throw new Error('useScreening must be used within ScreeningProvider');
  return context;
};