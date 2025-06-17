import { heroui } from "@heroui/react";
import plugin from "tailwindcss/plugin";

import { extend, themes } from "./config/style";

module.exports = {
  mode: 'jit',
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  // safeList,
  theme: { extend },
  darkMode: "class",
  plugins: [
    heroui({ themes }),
    require("tailwindcss-textshadow"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".glass-default": {
          background: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        },
        '.border-b-dash-custom': {
          borderBottomWidth: '1.5px',
          borderBottomStyle: 'solid',
          borderImageSource:
            'repeating-linear-gradient(to right, #3B82F6 0, #3B82F6 8px, transparent 8px, transparent 14px)',
          borderImageSlice: '1',
          borderImageRepeat: 'stretch',
          borderImageOutset: '0',
          borderImageWidth: '1',
        },
      });
    }),
  ],
};
