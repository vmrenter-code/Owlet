/**
 * Metro picks `ReadyToBegin.web.tsx` on web and `ReadyToBegin.native.tsx`
 * on iOS/Android before this file. This re-export exists so TypeScript can
 * resolve the import path.
 */
export { default } from './ReadyToBegin.native';
