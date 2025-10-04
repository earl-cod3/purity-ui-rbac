export const isAdminLike = (user) =>
  !!user && (user.role === "OWNER" || user.role === "ADMIN");

export const hasAccess = (user, route) => {
  if (!route.access) return true;        // no restriction
  return route.access.includes(user?.role);
};

export const hasFeatureForRoute = (user, route) => {
  if (!route.feature) return true;       // no flag required
  return user?.features?.includes?.(route.feature);
};
