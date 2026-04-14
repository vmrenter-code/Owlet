// possible needd future update for native ios and android support
//current react native support via typescript limits features, as well
//as it increase latency by nearly 5x. not noticeable for most users, but something to keep in mind
//import { BleManager, Device } from 'react-native-ble-plx';
//import { Platform, PermissionsAndroid } from 'react-native';
import { useState, useEffect } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';

const manager = new BleManager();

export function usePolarH9() {
  const [heartRate, setHeartRate] = useState<number | null>(null);
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

      // Look for Polar H9
      if (device?.name?.includes('Polar H9') || device?.name?.includes('H9')) {
        manager.stopDeviceScan();
        setScanning(false);

        device.connect()
          .then(d => d.discoverAllServicesAndCharacteristics())
          .then(d => {
            setConnected(true);
            // Start reading heart rate
            d.monitorCharacteristicForService(
              HEART_RATE_SERVICE,
              HEART_RATE_CHARACTERISTIC,
              (err, characteristic) => {
                if (err) {
                  setError('Monitor error: ' + err.message);
                  return;
                }
                if (characteristic?.value) {
                  const data = Buffer.from(characteristic.value, 'base64');
                  const hr = data[1]; // Heart rate BPM
                  setHeartRate(hr);
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

    // Stop scanning after 10 seconds if no device found
    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const disconnect = () => {
    manager.stopDeviceScan();
    setConnected(false);
    setHeartRate(null);
  };

  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  return { heartRate, connected, scanning, error, connectToH9, disconnect };
}