/**
 * Clean path navigation helper using HTML5 History API
 */
export function navigate(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  } else if (window.location.hash) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  }
}
