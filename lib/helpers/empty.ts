// utility function needs any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(obj: any): boolean {
  if (obj == null) return true; // Check for null or undefined
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
}

// utility function needs any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function allValuesAreEmpty(obj: Record<string, any>) : boolean {
  return !Object.values(obj).some(x => x !== null && x !== '');
}
