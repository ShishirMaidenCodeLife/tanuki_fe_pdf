"use client";

import clsx from "clsx";

import { CommonSkeleton, TanukiLogo } from "@/components";
import { siteData } from "@/data/custom/site";
import { ContainerType } from "@/types";
import { SITE_LINKS } from "@/utils/constants/site";
import { useCheckMountedHook } from "@/hooks";

// Footer Wave component
export const FooterWave = ({ extendCss }: ContainerType) => {
  const mounted = useCheckMountedHook();

  if (!mounted) return null;

  return (
    <div
      className={clsx(
        "tanuki-wave",
        extendCss || "fixed",
        "z-plus_1 bottom-0 w-screen mx-auto h-[6rem] min-h-[6rem] border-0 outline-0 text-highlight bg-tanuki-wave animate-move-bg-linear-60s !opacity-50 dark:!opacity-30",
        // "z-plus_1 bottom-0 _apply_container_width w-full mx-auto h-[6rem] min-h-[6rem] border-0 outline-0 text-highlight bg-tanuki-wave animate-move-bg-linear-60s !opacity-50 dark:!opacity-30",
      )}
    />
  );
};

// Actual Footer component
export const Footer = () => {
  const mounted = useCheckMountedHook();

  return (
    <section
      // className={clsx(
      //   "dashboard-footer-section",
      //   "z-plus_50 _apply_common_padding w-full h-fit p-10 grid grid-cols-12 gap-6 lg:gap-0 place-content-center !fixed bottom-0 left-0",
      //   // h-full lg:h-[250px]
      //   mounted &&
      //     "bg-gradient-to-b from-white/30 to-white/10 border-t border-transparent relative before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-b before:from-white/50 before:to-white/10",
      //   !mounted && "bg-foreground/10",
      // )}
      className={clsx(
        "dashboard-footer-section",
        "_apply_common_padding w-full h-fit p-10 grid grid-cols-12 gap-6 lg:gap-0 place-content-center",
        mounted &&
          "bg-gradient-to-b from-white/30 to-white/10 border-t border-transparent relative before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-b before:from-white/50 before:to-white/10",
        !mounted && "bg-foreground/10",
      )}
    >
      <div
        className={clsx(
          "first-section",
          "first-section col-span-12 lg:col-span-8 h-full",
        )}
      >
        {/* <div className="logo-section"> */}
        <TanukiLogo />
        {/* </div> */}
        <div className="copyright-section min-h-[20px]">
          {!mounted ? (
            <CommonSkeleton extendCss="mt-3" height="h-5" width="w-[22rem]" />
          ) : (
            siteData.layout.footer.copyright
          )}
        </div>
      </div>

      <div
        className={clsx(
          "child-section",
          "col-span-12 lg:col-span-4 h-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0",
        )}
      >
        {SITE_LINKS.footerLinks?.map((link, index) => {
          return (
            <div
              key={index}
              className={clsx("footer-section-category", "flex flex-col gap-1")}
            >
              <div className="footer-section-category-title py-2 font-bold text-lg min-h-[28px]">
                {!mounted ? (
                  <CommonSkeleton extendCss="mb-1" height="h-5" width="w-16" />
                ) : (
                  link.label
                )}
              </div>

              {link.children?.map((child, childIndex) => {
                return (
                  <div
                    key={childIndex}
                    className="footer-section-category-item"
                  >
                    {!mounted ? (
                      <CommonSkeleton
                        extendCss="my-1"
                        height="h-3"
                        width="w-24"
                      />
                    ) : (
                      child.label
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
};

// export const Footer = () => {
//   return (
//     <FooterWave className="z-plus_10 sticky bottom-0 w-full mx-auto min-h-[6rem] bg-cover border-0 outline-0 text-highlight bg-tanuki-wave animate-move-bg-linear-60s !opacity-50" />
//   );
// };

// export const Footer = () => {
//   return (
//     <FooterWave className="z-plus_10 fixed bottom-0 w-full mx-auto h-auto bg-cover border-0 outline-0 text-highlight bg-tanuki-wave animate-move-bg-linear-60s !opacity-50 pb-8" />
//   );
// };
