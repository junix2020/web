/**
 * Utility function to check if an object is not defined.
 * @param obj object to check
 */
export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined';

/**
 * Utility function to check if an object is null.
 * @param obj object to check
 */
export const isNil = (obj: any): boolean => isUndefined(obj) || obj === null;
/**
 * Utility function to check if an array is empty.
 * @param array the array to check
 */
export const isEmpty = (array: any): boolean => !(array && array.length > 0);
/**
 * Utility function to check if an object is defined.
 * @param obj object to check
 */
export const isNotUndefined = (obj: any) => !isUndefined(obj);
/**
 * Utility function to check if an object is not null.
 * @param obj object to check
 */
export const isNotNil = (obj: any): boolean => !isNil(obj);
/**
 * Utility function to check if an array is not empty.
 * @param array the array to check
 */
export const isNotEmpty = (array: any): boolean => !isEmpty(array);

/**
 * Utility function to check if the current URL matches the given URL.
 * Note: For browser use only, window will be undefined in NodeJS applications.
 */
export const urlMatches = (itemUrl): boolean => {
  const currentUrl = window.location.pathname;
  // Test exact match first
  if (currentUrl === itemUrl) {
    return true;
  }
  // If not, do a difference
  // Get difference between two strings
  const diff = currentUrl.split(itemUrl).join('');
  // Remove diff from currentUrl
  const newUrl = currentUrl.substring(0, currentUrl.length - diff.length);
  // Match new URL
  return itemUrl === newUrl;
};
