"use client";

import { addToast, ToastProps } from "@heroui/toast";

import { ApiErrorType, CreateToastPayloadType, CustomToastType } from "@/types";

// Additional toast props that are used to display the toast messages.
// export const additionalToastProps = {
//   closeIcon: (
//     <svg
//       fill="none"
//       height="32"
//       stroke="currentColor"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       viewBox="0 0 24 24"
//       width="32"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   ),
// };

// #region toast
// This is the default toast props that are used to display the toast messages.
export const defaultToastProps = {
  timeout: 4000,
  variant: "flat" as ToastProps["variant"],
  // classNames: {
  //   closeButton: "bg-red-300 absolute right-4 top-1/2 -translate-y-1/2",
  // },
  // ...additionalToastProps,
};

// Helper function to create toast messages
export const createToast = (
  color: ToastProps["color"],
  titleEn: string,
  titleJp: string,
): CreateToastPayloadType => {
  return {
    color,
    title: (
      <>
        {titleEn}
        <br />
        {titleJp}
      </>
    ),
  };
};

// This function is used to handle the toast messages that are displayed at the top of the screen.
export const handleCustomToast = ({
  title,
  color = "danger",
  description,
}: CustomToastType) => {
  return addToast({
    ...defaultToastProps,
    title,
    color: (color || "danger") as ToastProps["color"],
    ...(description && { description }),
  });
};

// This function is used to handle the error toast messages that are displayed at the top of the screen.
export const handleErrorToast = (error: ApiErrorType, description?: string) => {
  const title = error?.message || "An error occurred";

  return addToast({
    ...defaultToastProps,
    title,
    color: "danger",
    ...(description && { description }),
  });
};
// #endregion toast

// export const getImages = ({
//   isOnline,
//   theme,
// }: {
//   isOnline: boolean;
//   theme: UseThemeProps["theme"];
// }) => {
//   const tanukiBg =
//     theme === "light"
//       ? isOnline
//         ? "bg-tanuki-bg-light"
//         : "bg-tanuki-bg-light-fallback"
//       : isOnline
//         ? "bg-tanuki-bg-dark"
//         : "bg-tanuki-bg-dark-fallback";

//   const dashboardBg =
//     theme === "light"
//       ? isOnline
//         ? "bg-tanuki-banner-light"
//         : "bg-tanuki-banner-light-fallback"
//       : isOnline
//         ? "bg-tanuki-banner-dark"
//         : "bg-tanuki-banner-dark-fallback";

//   return { dashboardBg, tanukiBg };
// };
