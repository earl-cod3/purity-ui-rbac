/*eslint-disable*/
// chakra imports
import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import { CreativeTimLogo } from "components/Icons/Icons";
import { Separator } from "components/Separator/Separator";
import { SidebarHelp } from "components/Sidebar/SidebarHelp";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

// RBAC context
import { useAuth } from "auth/AuthContext";

/* --------------------------- RBAC / Feature helpers ---------------------------
   Rules:
   1) Auth pages (layout === "/auth")
      - Hidden for any logged-in role EXCEPT OWNER.
      - Visible when not logged in.
      - Visible for OWNER even when logged in (your request).

   2) Admin pages (layout === "/admin")
      - Hidden if not logged in at all.
      - If route has `access`, the user.role must be included.

   3) Feature flags
      - If route has `feature`, user.features must include it.

   4) Public routes (no access, not /auth)
      - Shown for everyone (unless filtered above).
----------------------------------------------------------------------------- */

const isOwner = (user) => user?.role === "OWNER";

const hasAccess = (user, route) => {
  if (!route) return false;

  // --- Special handling for auth pages ---
  if (route.layout === "/auth") {
    // Show auth links if:
    //  - not logged in, OR
    //  - logged in as OWNER (explicit requirement)
    return !user || isOwner(user);
  }

  // --- Hide admin items when not authenticated ---
  if (route.layout === "/admin" && !user) return false;

  // --- Role-restricted routes ---
  if (route.access) {
    return route.access.includes(user?.role);
  }

  // Default: visible
  return true;
};

const hasFeature = (user, route) => {
  if (!route || !route.feature) return true;
  return user?.features?.includes?.(route.feature);
};

// this function creates the links and collapses that appear in the sidebar (left menu)
const SidebarContent = ({ logoText, routes }) => {
  const { user } = useAuth();

  // to check for active links and opened collapses
  const location = useLocation();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };

  // Filter routes by RBAC + feature (handles categories too)
  const filterRoutes = React.useCallback(
    (items) =>
      (items || [])
        .map((r) =>
          r?.views
            ? {
                ...r,
                views: r.views.filter(
                  (v) => hasAccess(user, v) && hasFeature(user, v)
                ),
              }
            : r
        )
        // Keep route if:
        //  - It's a category with at least one visible child, OR
        //  - It's a regular route that passes access + feature checks
        .filter((r) =>
          r?.views ? r.views.length > 0 : hasAccess(user, r) && hasFeature(user, r)
        ),
    [user]
  );

  const createLinks = (items) => {
    // Chakra Color Mode
    const activeBg = useColorModeValue("white", "gray.700");
    const inactiveBg = useColorModeValue("white", "gray.700");
    const activeColor = useColorModeValue("gray.700", "white");
    const inactiveColor = useColorModeValue("gray.400", "gray.400");

    return items.map((prop) => {
      if (!prop || prop.redirect) return null;

      // Category with nested views
      if (prop.category) {
        const st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{ xl: "12px" }}
              mx="auto"
              ps={{ sm: "10px", xl: "16px" }}
              py="12px"
            >
              {document.documentElement.dir === "rtl" ? prop.rtlName : prop.name}
            </Text>
            {createLinks(prop.views)}
          </div>
        );
      }

      // Regular nav item
      const fullPath = (prop.layout || "") + (prop.path || "");
      const isActive = activeRoute(fullPath) === "active";

      return (
        <NavLink to={fullPath} key={fullPath}>
          {isActive ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg={activeBg}
              mb={{ xl: "12px" }}
              mx={{ xl: "auto" }}
              ps={{ sm: "10px", xl: "16px" }}
              py="12px"
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{ boxShadow: "none" }}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <IconBox bg="teal.300" color="white" h="30px" w="30px" me="12px">
                    {prop.icon}
                  </IconBox>
                ) : (
                  <IconBox bg="teal.300" color="white" h="30px" w="30px" me="12px">
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={activeColor} my="auto" fontSize="sm">
                  {document.documentElement.dir === "rtl" ? prop.rtlName : prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{ xl: "12px" }}
              mx={{ xl: "auto" }}
              py="12px"
              ps={{ sm: "10px", xl: "16px" }}
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{ boxShadow: "none" }}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <IconBox bg={inactiveBg} color="teal.300" h="30px" w="30px" me="12px">
                    {prop.icon}
                  </IconBox>
                ) : (
                  <IconBox bg={inactiveBg} color="teal.300" h="30px" w="30px" me="12px">
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {document.documentElement.dir === "rtl" ? prop.rtlName : prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

  // Apply filter once per render
  const visibleRoutes = filterRoutes(routes);
  const links = <>{createLinks(visibleRoutes)}</>;

  return (
    <>
      <Box pt={"25px"} mb="12px">
        <Link
          href={`${process.env.PUBLIC_URL}/#/`}
          target="_blank"
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize="11px"
        >
          <CreativeTimLogo w="32px" h="32px" me="10px" />
          <Text fontSize="sm" mt="3px">
            {logoText}
          </Text>
        </Link>
        <Separator></Separator>
      </Box>

      <Stack direction="column" mb="40px">
        <Box>{links}</Box>
      </Stack>

      <SidebarHelp />
    </>
  );
};

export default SidebarContent;
