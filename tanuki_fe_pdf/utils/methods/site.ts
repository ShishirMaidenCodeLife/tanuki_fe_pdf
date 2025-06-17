// Helper function to check if the user is authenticated
export const isAuthenticated = (
  accessToken?: string,
  idToken?: string,
): boolean => Boolean(accessToken && idToken);

export const isActiveLink = (path: string, currentPath: string) => {
  return path === currentPath;
};
