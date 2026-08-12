/**
 * Metro picks `PositionChild.web.tsx` on web and `PositionChild.native.tsx`
 * on iOS/Android before this file. This re-export exists so TypeScript can
 * resolve the import path.
 */
export { default } from './PositionChild.native';
