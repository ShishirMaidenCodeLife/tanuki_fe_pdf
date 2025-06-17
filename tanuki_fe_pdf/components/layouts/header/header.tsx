"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
} from "@heroui/navbar";
import clsx from "clsx";

import * as C from "@/components";
import {
  useCombinedAuthNavHook,
  useCheckMountedHook,
  usePageScrolledHook,
  useRoadmapStoreHook,
} from "@/hooks";
import { HeaderType } from "@/types";

const LeftNavbarSection = () => {
  const { isGlobalLoading } = useRoadmapStoreHook();

  return (
    <NavbarContent className="left-navbar-section" justify="start">
      <NavbarBrand>
        <C.TanukiLogo />
        <C.ThemeSwitch />
        {isGlobalLoading && <C.HeaderSpinner />}
      </NavbarBrand>
      {/* <NavLinks /> */}
    </NavbarContent>
  );
};

const RightNavbarSection = () => {
  return (
    <NavbarContent
      className={clsx("right-navbar-section", "gap-0")}
      justify="end"
    >
      <NavbarItem
        className={clsx(
          "flex items-center",
          "px-4 sm:px-8",
          "gap-4",
          // isAuthRoute ? "gap-4" : "gap-6",
        )}
      >
        <C.SearchInput />

        <div className="hidden sm:flex">
          <C.AuthActionsButtons />
          <C.DashboardActionsButtons />
        </div>
        <C.ProfileAvatar />
        <C.MenuToggle />
      </NavbarItem>
    </NavbarContent>
  );
};

const MobileMenuSection = () => {
  const { isAuthPublicPagePath } = useCombinedAuthNavHook();

  if (isAuthPublicPagePath) return null;

  return (
    <NavbarMenu
      className={clsx(
        "mobile-navbar-section",
        "z-modal bg-transparent backdrop-saturate-100 backdrop-blur-[8px]",
        "flex flex-col gap-0",
      )}
    >
      <NavbarContent className="flex flex-col items-start gap-2">
        <NavbarItem className="flex flex-col gap-4">
          <C.SearchInput isMenuToggled />
          <div className="sm:hidden">
            <C.AuthActionsButtons />
            <C.DashboardActionsButtons />
          </div>
        </NavbarItem>

        {/* <MobileNavLinks /> */}
      </NavbarContent>
    </NavbarMenu>
  );
};

// Final header component
export const Header: React.FC<HeaderType> = (props) => {
  const { pageLayout } = props;
  // const isAuthRoute = useAuthRouteHook();
  const isPageScrolled = usePageScrolledHook();
  const { shouldBlurNav } = useCombinedAuthNavHook(); // Check if navbar should blur
  const isMounted = useCheckMountedHook(); // Check if component is mounted

  // Css variables
  const navbarContainerCss = clsx([
    "header",
    "border-none shadow-none",
    "flex font-fredoka p-0 _apply_navbar_height _apply_container_width _apply_common_left_padding",
    // "[&>header]:p-0 [&>header]:max-w-[1366px]",
    "[&>header]:p-0",
    !isMounted && shouldBlurNav ? "bg-background" : "bg-transparent",
    ((!shouldBlurNav && isMounted) || !isPageScrolled) &&
      "!backdrop-blur-none backdrop-saturate-100",
  ]);

  // Other variables
  const isErrorPage = pageLayout === "error";

  return (
    <Navbar className={navbarContainerCss} maxWidth="xl" position="sticky">
      <C.CommonBreadcrumbs />
      <LeftNavbarSection />
      {!isErrorPage && <RightNavbarSection />}
      <MobileMenuSection />
    </Navbar>
  );
};
