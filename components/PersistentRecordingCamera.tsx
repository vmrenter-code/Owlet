/**
 * Metro picks `PersistentRecordingCamera.web.tsx` on web and
 * `PersistentRecordingCamera.native.tsx` on iOS/Android before this file.
 * This re-export exists so TypeScript can resolve the import path.
 */
export { default } from './PersistentRecordingCamera.native';
