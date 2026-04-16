type UserLike = {
  role?: string | null;
  features?: string[] | null;
};

type RouteLike = {
  access?: string[] | null;
  feature?: string | null;
};

const normalizeRole = (role?: string | null) =>
  typeof role === "string" ? role.trim().toUpperCase() : "";

export const isAdminLike = (user?: UserLike | null) => {
  const role = normalizeRole(user?.role);
  return role === "OWNER" || role === "ADMIN";
};

export const hasAccess = (user?: UserLike | null, route?: RouteLike | null) => {
  if (!route?.access || route.access.length === 0) return true;

  const role = normalizeRole(user?.role);
  if (!role) return false;

  const allowedRoles = route.access
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().toUpperCase());

  return allowedRoles.includes(role);
};

export const hasFeatureForRoute = (
  user?: UserLike | null,
  route?: RouteLike | null,
) => {
  if (!route?.feature) return true;

  const requiredFeature = route.feature.trim();
  if (!requiredFeature) return true;

  if (!Array.isArray(user?.features) || user.features.length === 0) {
    return false;
  }

  return user.features.some(
    (feature) => typeof feature === "string" && feature.trim() === requiredFeature,
  );
};
