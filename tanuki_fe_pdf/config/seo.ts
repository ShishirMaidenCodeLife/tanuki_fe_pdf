import { Metadata, Viewport } from "next";

import { siteData, siteImages } from "../data/custom/site";

// Default metadata
export const defaultMetadata: Metadata = {
  title: {
    default: siteData.company.name,
    template: `%s - ${siteData.company.name}`,
  },
  description: siteData.company.description,
  icons: {
    icon: siteImages.icon.sss.logo,
  },
  // headers: {
  //   "Cache-Control": "max-age=31536000, immutable", // Cache the favicon
  // },
};

// Default viewport
export const defaultViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
