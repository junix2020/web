import { Router } from '@angular/router';

/**
 * Utility function to navigate up in the navigation hierarchy.
 * @param router the injected router
 */
export const navigateUp = (router: Router) => {
  const url = window.location.pathname;
  const urlUp = url.substring(0, url.lastIndexOf('/'));
  router.navigate([urlUp]);
};
