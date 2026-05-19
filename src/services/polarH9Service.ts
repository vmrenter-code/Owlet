/**
 * Metro picks `polarH9Service.web.ts` on web and `polarH9Service.native.ts` on iOS/Android
 * before this file. This re-export exists so TypeScript can resolve the import path.
 */
export { usePolarH9 } from './polarH9Service.native';
