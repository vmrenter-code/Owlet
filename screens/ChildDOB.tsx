/**
 * Metro picks `ChildDOB.web.tsx` on web and `ChildDOB.native.tsx` on
 * iOS/Android before this file. This re-export exists so TypeScript can
 * resolve the import path.
 */
export { default } from './ChildDOB.native';
