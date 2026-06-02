import React, { createContext, useEffect, useState, ReactNode, useContext, useRef } from 'react';
import { usePolarH9 } from '../src/services/polarH9Service';

export interface HeartRateDataPoint {
  time: number;
  bpm: number;
}

export function calculateRMSSD(rrIntervals: number[]): number | null {
  if (rrIntervals.length < 2) return null;
  const squaredDiffs = [];
  for (let i = 1; i < rrIntervals.length; i++) {
    const diff = rrIntervals[i] - rrIntervals[i - 1];
    squaredDiffs.push(diff * diff);
  }
  const mean = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
  return Math.round(Math.sqrt(mean));
}

interface ScreeningContextType {
  screeningId: string | null;
  setScreeningId: (id: string) => void;
  videoNumber: number;
  setVideoNumber: (num: number) => void;
  startScreening: () => string;
  heartRate: number | null;
  rrInterval: number | null;
  connected: boolean;
  scanning: boolean;
  error: string | null;
  connectToH9: () => Promise<void>;
  disconnect: () => void;
  heartRateLog: HeartRateDataPoint[];
  addHeartRateDataPoint: (bpm: number) => void;
  clearHeartRateLog: () => void;
  screeningStartTime: number | null;
  setScreeningStartTime: (time: number) => void;
  rrLog: number[];
  addRrInterval: (rr: number) => void;
  clearRrLog: () => void;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export const ScreeningProvider = ({ children }: { children: ReactNode }) => {
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [videoNumber, setVideoNumber] = useState(1);
  const [heartRateLog, setHeartRateLog] = useState<HeartRateDataPoint[]>([]);
  const [rrLog, setRrLog] = useState<number[]>([]);
  const [screeningStartTime, setScreeningStartTime_internal] = useState<number | null>(null);
  const screeningStartTimeRef = useRef<number | null>(null);

  const { heartRate, rrInterval, connected, scanning, error, connectToH9, disconnect } = usePolarH9();

  useEffect(() => {
    if (rrInterval !== null) {
      addRrInterval(rrInterval);
    }
  }, [rrInterval]);

  const startScreening = () => {
    const newId = `screening_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setScreeningId(newId);
    return newId;
  };

  const addHeartRateDataPoint = (bpm: number) => {
    const elapsed = screeningStartTimeRef.current
      ? Math.floor((Date.now() - screeningStartTimeRef.current) / 1000)
      : 0;
    setHeartRateLog(prev => [...prev, { time: elapsed, bpm }]);
  };

  const addRrInterval = (rr: number) => {
    setRrLog(prev => [...prev, rr]);
  };

  const setScreeningStartTime = (time: number) => {
    screeningStartTimeRef.current = time;
    setScreeningStartTime_internal(time);
  };

  const clearHeartRateLog = () => {
    setHeartRateLog([]);
    screeningStartTimeRef.current = null;
    setScreeningStartTime_internal(null);
  };

  const clearRrLog = () => {
    setRrLog([]);
  };

  return (
    <ScreeningContext.Provider value={{
      screeningId,
      setScreeningId,
      videoNumber,
      setVideoNumber,
      startScreening,
      heartRate,
      rrInterval,
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
      rrLog,
      addRrInterval,
      clearRrLog,
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