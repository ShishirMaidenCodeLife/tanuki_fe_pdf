import clsx from "clsx";
import React, { isValidElement } from "react";

import { fontPoppins } from "@/config/fonts";
import { defaultMetadata, defaultViewport } from "@/config/seo";
import { DefaultProviders } from "@/contexts/combined/default-providers";
import { ChildrenType } from "@/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/styles/globals.css";
import "@/styles/base.css";
import "@/styles/custom.css";
import "@/styles/cute-pineapple.css";
import "@/styles/gradients.css";
import "@/styles/uiw_md_editor.css";
import "@/styles/variables.css";
import "@/styles/swiper.css";
import "@/styles/tailwind-apply.css";
import "@/styles/xy-theme.css";

// Assign metadata and viewport settings
export const metadata = defaultMetadata;
export const viewport = defaultViewport;

// async function getRandomNumber() {
//   return Math.floor(Math.random() * 1000);
// }

// Main Layout Component
export default async function RootLayout({ children }: ChildrenType) {
  // Get a random number
  // const randomNumber = await getRandomNumber();

  return (
    <html
      suppressHydrationWarning
      className={clsx("antialiased", fontPoppins?.className ?? "")}
      lang="en"
    >
      <body suppressHydrationWarning>
        <DefaultProviders
          themeProps={{ attribute: "class", defaultTheme: "light" }}
        >
          {isValidElement(children)
            ? React.cloneElement(children as React.ReactElement, {})
            : children}
        </DefaultProviders>
      </body>
    </html>
  );
}
