// import clsx from "clsx";

// import { env } from "@/config/env";

export const SITE_LINKS = {
  navItems: [
    {
      label: "Map",
      href: "map",
    },
    {
      label: "Route Templates",
      href: "route-templates",
    },
  ],
  navItemsAuth: [
    {
      label: "Map",
      href: "map",
    },
    {
      label: "AI Routes",
      href: "generate-route",
    },
    {
      label: "Route Templates",
      href: "route-templates",
    },
  ],
  profileAvatarLinks: [
    {
      label: "Dashboard",
      href: "dashboard",
    },
    {
      label: "Settings",
      href: "settings",
    },
    {
      label: "Help and Feedback",
      href: "help-and-feedback",
    },
    {
      label: "Logout",
      href: "logout",
    },
  ],
  footerLinks: [
    {
      label: "About",
      children: [
        {
          label: "FAQ",
          href: "faq",
        },
        {
          label: "Our Company",
          href: "our-company",
        },
      ],
    },
    {
      label: "Legal",
      children: [
        {
          label: "Privacy Policy",
          href: "privacy-policy",
        },
        {
          label: "Terms of Use",
          href: "terms-of-use",
        },
        {
          label: "Price",
          href: "price",
        },
      ],
    },
  ],
};

// #region Public Routes

// Auth Public Routes
export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const VERIFY_OTP_ROUTE = "/verify-otp";
export const AUTH_PUBLIC_ROUTES = [
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  VERIFY_OTP_ROUTE,
];

// Default Public Routes
// export const AI_FORM_ROUTE = "/generate-route";
export const HOME_DASHBOARD_ROUTE = "/";
export const ROUTE_TEMPLATES_ROUTE = "/route-templates";
export const MAP_ROUTE = "/map";
export const DEFAULT_PUBLIC_ROUTES = [
  // AI_FORM_ROUTE,
  ROUTE_TEMPLATES_ROUTE,
  MAP_ROUTE,
  ROUTE_TEMPLATES_ROUTE,
];

// #endregion Public Routes

// #region Private Routes

// Default Private Routes
export const HELP_AND_FEEDBACK_ROUTE = "/help-and-feedback";
export const SETTINGS_ROUTE = "/settings";
export const DEFAULT_PRIVATE_ROUTES = [HELP_AND_FEEDBACK_ROUTE, SETTINGS_ROUTE];

// Dashboard Private Routes
export const DASHBOARD_ROUTE = "/dashboard";
export const DASHBOARD_AI_FORM_ROUTE = "/dashboard/generate-route";
export const DASHBOARD_MAP_ROUTE = "/dashboard/map";
export const DASHBOARD_ROUTE_TEMPLATES_ROUTE = "/dashboard/route-templates";
export const DASHBOARD_PRIVATE_ROUTES = [
  DASHBOARD_ROUTE,
  DASHBOARD_AI_FORM_ROUTE,
  DASHBOARD_ROUTE_TEMPLATES_ROUTE,
  DASHBOARD_MAP_ROUTE,
  DASHBOARD_ROUTE_TEMPLATES_ROUTE,
];
export const SHOW_DEFAULT_BG_ROUTES = [
  HOME_DASHBOARD_ROUTE,
  DASHBOARD_ROUTE,
  DASHBOARD_ROUTE_TEMPLATES_ROUTE,
];
export const SHOW_FOOTER_ROUTES = ["/"];
export const BLUR_NAV_ROUTES = [
  "",
  "/",
  ROUTE_TEMPLATES_ROUTE,
  DASHBOARD_ROUTE,
  DASHBOARD_ROUTE_TEMPLATES_ROUTE,
];
export const AUTH_PRIVATE_ROUTES = [
  ...DEFAULT_PRIVATE_ROUTES,
  ...DASHBOARD_PRIVATE_ROUTES,
];
// #endregion Private routes

export const SITE_ROUTES = {
  matchers: [
    ...DEFAULT_PUBLIC_ROUTES,
    ...AUTH_PUBLIC_ROUTES,
    ...DEFAULT_PRIVATE_ROUTES,
    ...DASHBOARD_PRIVATE_ROUTES,
    // // ...DEFAULT_PUBLIC_ROUTES,
    // "/map",
    // "/route-templates",

    // // ...AUTH_PUBLIC_ROUTES,
    // "/login",
    // "/register",
    // "/verify-otp",

    // // ...DEFAULT_PRIVATE_ROUTES,
    // "/help-and-feedback",
    // "/settings",

    // // ...DASHBOARD_PRIVATE_ROUTES,
    // "/dashboard",
    // "/dashboard/generate-route",
    // "/dashboard/route-templates",
    // "/dashboard/map",
  ], // Ensure all routes are hardcoded
  protected: [
    // ...DEFAULT_PRIVATE_ROUTES,
    "/help-and-feedback",
    "/settings",

    // ...DASHBOARD_PRIVATE_ROUTES
    "/dashboard",
    "/dashboard/generate-route",
    "/dashboard/route-templates",
    "/dashboard/map",
  ],
  // auth: ["/login", "/register", "/verify-otp"],
  // filteredMatchers: [] as string[],
  // breadcrumbMatchers: [] as string[],
};
// SITE_ROUTES.filteredMatchers = SITE_ROUTES.matchers.filter(
//   (route) => route !== "/roadmap",
// );
// SITE_ROUTES.breadcrumbMatchers = SITE_ROUTES.matchers;
