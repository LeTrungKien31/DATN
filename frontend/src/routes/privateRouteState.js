export const getPrivateRouteState = ({ isInitializing, isAuthenticated }) => {
  if (isInitializing) return "loading";
  if (!isAuthenticated) return "redirect";
  return "render";
};
