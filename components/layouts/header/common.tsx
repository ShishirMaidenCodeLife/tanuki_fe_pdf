"use client";

import { NavbarMenuToggle } from "@heroui/navbar";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import clsx from "clsx";
import Link from "next/link";

import * as C from "@/components";
import { siteData } from "@/data/custom/site";
import { useCombinedAuthNavHook, useCheckMountedHook } from "@/hooks";
import {
  DASHBOARD_AI_FORM_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
} from "@/utils/constants/site";
import { toTitleCase } from "@/utils/methods/string";

// Login, Register, Logout or maybe other buttons as per the auth state
export const AuthActionsButtons = () => {
  const { shouldHideFromAuthPages, isAuthPublicPagePath } =
    useCombinedAuthNavHook();
  const isMounted = useCheckMountedHook();

  if (shouldHideFromAuthPages || isAuthPublicPagePath) return null;

  return (
    <div className="apply_height_button flex gap-3">
      <C.LinkButton
        extendCss="_apply_custom_link w-[80px]"
        href={LOGIN_ROUTE}
        skeletonProps={{
          width: "w-[80px]",
          roundedXl: true,
          isSkeletonLoading: !isMounted,
        }}
      >
        {siteData.buttons.login}
      </C.LinkButton>

      <C.LinkButton
        extendCss="_apply_custom_link w-[100px]"
        href={REGISTER_ROUTE}
        skeletonProps={{
          width: "w-[100px]",
          roundedXl: true,
          isSkeletonLoading: !isMounted,
        }}
      >
        {siteData.buttons.register}
      </C.LinkButton>
    </div>
  );
};

// Dashboard actions buttons
export const DashboardActionsButtons = () => {
  const { isAuthRoute, isUserAuthenticated } = useCombinedAuthNavHook();
  const isMounted = useCheckMountedHook();

  if (!isAuthRoute || !isUserAuthenticated) return null;

  return (
    <div className="apply_height_button flex gap-3">
      <C.LinkButton
        extendCss="_apply_custom_link w-[136px]"
        href={DASHBOARD_AI_FORM_ROUTE}
        skeletonProps={{
          width: "w-[136px]",
          roundedXl: true,
          isSkeletonLoading: !isMounted,
        }}
      >
        {siteData.buttons.ai}
      </C.LinkButton>
    </div>
  );
};

// Common breadcrumbs component
export const CommonBreadcrumbs = () => {
  const { isUserAuthenticated, pathSegments, shouldHideBreadcrumbs } =
    useCombinedAuthNavHook();
  const isMounted = useCheckMountedHook();

  const breadcrumbsClass = clsx([
    "common-breadcrumbs",
    // "text-sm absolute rounded-xl py-1 translate-y-[3rem] !z-drawer",
    "text-sm absolute rounded-xl py-1 translate-x-[2rem] translate-y-[4rem] !z-drawer",
    "min-w-screen",
    isMounted &&
      "px-4 !backdrop-blur-[10px] apply_common_transition cursor-pointer bg-overlay40 hover:bg-overlay20/80",
  ]);

  // Generate breadcrumb items with links
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLastPath = index === pathSegments.length - 1;
    const title = toTitleCase(decodeURIComponent(segment));

    return (
      <BreadcrumbItem key={href}>
        {isLastPath ? (
          <div className="font-medium text-highlight">{title}</div>
        ) : (
          <Link className="_apply_link_medium" href={href}>
            {title}
          </Link>
        )}
      </BreadcrumbItem>
    );
  });

  if (shouldHideBreadcrumbs) return;

  return (
    <>
      {!isMounted ? (
        <div className={breadcrumbsClass}>
          <C.CommonSkeleton rounded2Xl height="h-7" width="w-44" />
        </div>
      ) : (
        <Breadcrumbs
          className={breadcrumbsClass}
          itemClasses={{ separator: "px-2" }}
          separator=">"
        >
          <BreadcrumbItem>
            {/* {isRootPath ? (
              <div className="font-medium text-highlight">Dashboard</div>
            ) : (
              <Link className="_apply_link_medium" href="/">
                Dashboard
              </Link>
            )} */}
            <Link className="_apply_link_medium" href="/">
              {isUserAuthenticated ? "Dashboard" : "Home"}
            </Link>
          </BreadcrumbItem>
          {breadcrumbItems}
        </Breadcrumbs>
      )}
    </>
  );
};

// Menu toggle button
export const MenuToggle = () => {
  const mounted = useCheckMountedHook();

  return (
    <div className={clsx("menu-toggle", "md:hidden")}>
      {!mounted ? (
        <div>
          {/* <div className="_apply_common_right_margin"> */}
          <C.CommonSkeleton height="h-8" width="w-8" />
        </div>
      ) : (
        <NavbarMenuToggle
          className={clsx([
            "w-8 h-8",
            // "w-8 h-8 _apply_common_right_margin",
            // isUserAuthenticated && "sm:hidden",
          ])}
        />
      )}
    </div>
  );
};
