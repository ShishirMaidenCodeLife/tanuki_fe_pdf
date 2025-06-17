"use client";

import {
  Fredoka as FontFredoka,
  Poppins as FontPoppins,
  Roboto as FontRoboto,
} from "next/font/google";

const fontFredoka = FontFredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

const fontPoppins = FontPoppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const fontRoboto = FontRoboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export { fontFredoka, fontPoppins, fontRoboto };
