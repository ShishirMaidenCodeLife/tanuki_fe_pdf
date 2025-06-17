"use client";

import * as HeroUI from "@heroui/react";
// import Link from "next/link";

import { siteImages } from "../../data/custom/site";

import { CommonModal, CommonTooltip, RoundSkeleton } from "@/components";
import * as H from "@/hooks";
import { SITE_LINKS } from "@/utils/constants/site";
import { truncateEmail } from "@/utils/methods/string";
// import { getRouteName } from "@/utils/methods/app";

const CommonDivider = () => (
  <HeroUI.Divider className="absolute mt-2 -translate-x-2 bg-highlight/50" />
);

export const ProfileAvatar = () => {
  const { handleLogout } = H.useAuthHook();
  const { isLogoutLoading, userEmail, shouldHideFromAuthPages } =
    H.useCombinedAuthNavHook();
  const {
    state: isOpen,
    setTrue: onOpen,
    toggle: onOpenChange,
  } = H.useBooleanHook();
  // const isAuthRoute = H.useAuthRouteHook();
  const isMounted = H.useCheckMountedHook();

  // Return early if user is logged in
  if (!shouldHideFromAuthPages) return null;

  return (
    <>
      <CommonModal
        actionBtnProps={{ isLoading: isLogoutLoading }}
        btnProps={{ className: "hidden" }}
        isOpen={isOpen}
        titleOnly="Do you want to log out?"
        onActionClick={handleLogout}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />

      {!isMounted ? (
        <RoundSkeleton rounded8 />
      ) : (
        <div className="flex items-center gap-4">
          <HeroUI.Dropdown
            className="bg-overlay80 backdrop-blur-sm"
            placement="bottom-end"
          >
            <HeroUI.DropdownTrigger>
              <div className="relative inline-block">
                <HeroUI.Badge
                  className="absolute bottom-[3px] right-[4px] cursor-pointer border-background"
                  color="success"
                  content=""
                  placement="bottom-right"
                  shape="circle"
                >
                  <HeroUI.Avatar
                    as="button"
                    className="transition-transform w-8 h-8 mt-0.5 p-1 bg-defaultBackground border-[1.5px] border-highlight"
                    src={siteImages.svg.pineapple.squareFilled}
                  />
                </HeroUI.Badge>
              </div>
            </HeroUI.DropdownTrigger>
            <HeroUI.DropdownMenu aria-label="Profile Actions" variant="flat">
              <HeroUI.DropdownItem key="profile" className="gap-1">
                <CommonTooltip
                  showArrow
                  classNames={{
                    base: ["before:bg-highlight/70"],
                    content: [
                      "py-2 px-4 shadow-xl",
                      "text-white bg-highlight/80 transition-none",
                    ],
                  }}
                  content={userEmail}
                  placement="top"
                >
                  <div className="flex flex-col text-xs">
                    <div className="font-semibold">Signed in as</div>
                    <div>{truncateEmail(userEmail)}</div>
                  </div>
                </CommonTooltip>
                <CommonDivider />
              </HeroUI.DropdownItem>

              {SITE_LINKS.profileAvatarLinks.map(({ label, href }, index) => {
                const isLogout = href === "logout";
                const className = `${isLogout || index === 0 ? "mt-1" : ""} text-foreground`;
                const color = isLogout ? "danger" : "secondary";

                return (
                  <HeroUI.DropdownItem
                    key={href}
                    className={className}
                    color={color}
                  >
                    {isLogout ? (
                      <HeroUI.Button
                        className="w-full text-inherit bg-transparent p-0 m-0 h-5 justify-start"
                        onClick={onOpen}
                      >
                        {label}
                      </HeroUI.Button>
                    ) : (
                      // <Link href={getRouteName(href, isUserAuthenticated)}>{label}</Link>
                      <div>{label}</div>
                    )}
                    {SITE_LINKS.profileAvatarLinks?.length - 2 === index && (
                      <CommonDivider />
                    )}
                  </HeroUI.DropdownItem>
                );
              })}
            </HeroUI.DropdownMenu>
          </HeroUI.Dropdown>
        </div>
      )}
    </>
  );
};
