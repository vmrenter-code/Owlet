import { useState, useEffect } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';

const manager = new BleManager();

export function usePolarH9() {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [rrInterval, setRrInterval] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const connectToH9 = async () => {
    await requestPermissions();
    setScanning(true);
    setError(null);

    manager.startDeviceScan(null, null, (err, device) => {
      if (err) {
        setError('Scan error: ' + err.message);
        setScanning(false);
        return;
      }

      if (device?.name?.includes('Polar H9') || device?.name?.includes('H9')) {
        manager.stopDeviceScan();
        setScanning(false);

        device.connect()
          .then(d => d.discoverAllServicesAndCharacteristics())
          .then(d => {
            setConnected(true);
            d.monitorCharacteristicForService(
              HEART_RATE_SERVICE,
              HEART_RATE_CHARACTERISTIC,
              (err, characteristic) => {
                if (err) {
                  setError('Monitor error: ' + err.message);
                  return;
                }
                if (characteristic?.value) {
                  const raw = atob(characteristic.value);
                  const bytes = Array.from(raw).map(c => c.charCodeAt(0));
                  
                  const flags = bytes[0];
                  const hr16bit = flags & 0x01;
                  
                  // Parse BPM
                  const hr = hr16bit ? (bytes[2] << 8) | bytes[1] : bytes[1];
                  setHeartRate(hr);

                  // Parse RR intervals (bit 4 of flags indicates RR present)
                  const rrPresent = (flags & 0x10) !== 0;
                  if (rrPresent) {
                    const rrOffset = hr16bit ? 3 : 2;
                    // Each RR is 2 bytes, in units of 1/1024 seconds
                    for (let i = rrOffset; i + 1 < bytes.length; i += 2) {
                      const rrRaw = (bytes[i + 1] << 8) | bytes[i];
                      const rrMs = Math.round((rrRaw / 1024) * 1000);
                      setRrInterval(rrMs);
                    }
                  }
                }
              }
            );
          })
          .catch(err => {
            setError('Connection error: ' + err.message);
            setConnected(false);
          });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const disconnect = () => {
    manager.stopDeviceScan();
    setConnected(false);
    setHeartRate(null);
    setRrInterval(null);
  };

  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  return { heartRate, rrInterval, connected, scanning, error, connectToH9, disconnect };
}