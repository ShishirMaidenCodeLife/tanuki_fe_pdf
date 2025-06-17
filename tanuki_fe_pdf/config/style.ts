import { siteImages } from "../data/custom/site";

export const pineappleListColors = [
  "#D5C12D", // yellow
  "#16B590", // teal
  "#49BB37", // green
  "#E7B31D", // gold
  "#14B6BC", // blue
  "#F29719", // orange
];

export const lightColors = {
  // Default
  defaultBackground: "#ffffff", // var(--color-default-background-light)
  defaultBtnBorder: "#ffffff4d",
  background: "#ffffff", // var(--color-background-light)
  foreground: "#000000", // var(--color-foreground-light)
  textColor: "#333", // var(--color-text-color-light)

  // Primary & Secondary
  highlight: "#0AB69B", // var(--color-highlight-light) // rgb(10, 182, 155)
  "highlight-hover": "#099F88", // var(--color-highlight-hover-light)
  "highlight-theme": "#E0F7F4", // var(--color-highlight-theme-light)

  // Additional
  skeleton: "#f3f3f3", // var(--color-skeleton-light)
  stroke: "#cccccc", // var(--color-stroke-light)
  strokeParentNode: "#cccccc", // var(--color-stroke-parent-node-light)
  tooltip: "#1A202CB3", // var(--color-tooltip-light)
  overlay: "rgba(255, 255, 255, 0.4)", // var(--color-overlay-light)
  overlay20: "rgba(255, 255, 255, 0.2)", // var(--color-overlay-light-20)
  overlay30: "rgba(255, 255, 255, 0.3)", // var(--color-overlay-light-30)
  overlay40: "rgba(255, 255, 255, 0.4)", // var(--color-overlay-light-50)
  overlay50: "rgba(255, 255, 255, 0.5)", // var(--color-overlay-light-50)
  overlay60: "rgba(255, 255, 255, 0.6)", // var(--color-overlay-light-60)
  overlay70: "rgba(255, 255, 255, 0.7)", // var(--color-overlay-light-70)
  overlay80: "rgba(255, 255, 255, 0.8)", // var(--color-overlay-light-80)

  // // Status Colors
  // success: "#28a745", // var(--color-success)
  // warning: "#f39c12", // var(--color-warning)
  // info: "#17a2b8", // var(--color-info)
  // danger: "#e63946", // var(--color-danger)
};

export const darkColors = {
  // Default
  defaultBackground: "#000", // var(--color-default-background-dark)
  defaultBtnBorder: "#ffffff4d",
  background: "#1a202c", // var(--color-background-dark)
  foreground: "#ffffff", // var(--color-foreground-dark)
  textColor: "#f1f1f1", // var(--color-text-color-dark)

  // Primary & Secondary
  highlight: "#D27A14", // var(--color-highlight-dark) // rgb(210, 122, 20)
  "highlight-hover": "#C16912", // var(--color-highlight-hover-dark)
  "highlight-theme": "#F7E0A2", // var(--color-highlight-theme-dark)

  // Additional
  skeleton: "#1e1e1e", // var(--color-skeleton-dark)
  tooltip: "#FFFFFFB3", // var(--color-tooltip-dark)
  stroke: "#666666", // var(--color-stroke-dark)
  strokeParentNode: "#ededed", // var(--color-stroke-parent-node-dark)
  overlay: "rgba(0, 0, 0, 0.4)", // var(--color-overlay-dark)
  overlay20: "rgba(0, 0, 0, 0.2)", // var(--color-overlay-dark-20)
  overlay30: "rgba(0, 0, 0, 0.3)", // var(--color-overlay-dark-30)
  overlay40: "rgba(0, 0, 0, 0.4)", // var(--color-overlay-dark-40)
  overlay50: "rgba(0, 0, 0, 0.5)", // var(--color-overlay-dark-50)
  overlay60: "rgba(0, 0, 0, 0.6)", // var(--color-overlay-dark-60)
  overlay70: "rgba(0, 0, 0, 0.7)", // var(--color-overlay-dark-70)
  overlay80: "rgba(0, 0, 0, 0.8)", // var(--color-overlay-dark-80)
};

// Custom Tailwind CSS configuration for the app
export const extend = {
  animation: {
    "move-bg-linear-60s": "move-bg 60s linear infinite",
    "move-bg-linear-240s": "move-bg 240s linear infinite",
  },

  backgroundImage: {
    // Images
    "tanuki-banner-light": `url(${siteImages.png.tanuki.banner.light.default})`,
    "tanuki-banner-light-fallback": `url(${siteImages.png.tanuki.banner.light.fallback})`,
    "tanuki-banner-dark": `url(${siteImages.png.tanuki.banner.dark.default})`,
    "tanuki-banner-dark-fallback": `url(${siteImages.png.tanuki.banner.dark.fallback})`,
    "tanuki-bg-light": `url(${siteImages.png.tanuki.bg.light.default})`,
    "tanuki-bg-light-fallback": `url(${siteImages.png.tanuki.bg.light.fallback})`,
    "tanuki-bg-dark": `url(${siteImages.png.tanuki.bg.dark.default})`,
    "tanuki-bg-dark-fallback": `url(${siteImages.png.tanuki.bg.dark.fallback})`,
    "tanuki-wave": `url(${siteImages.svg.tanuki.wave})`,

    // Gradients
    "dashboard-gradient-bg-light":
      "radial-gradient(50% 50% at 50% 50%, rgba(164, 232, 234, 0.7) 0%, rgba(31, 229, 235, 0.7) 100%)",

    "dashboard-gradient-bg-dark":
      "radial-gradient(50% 50% at 50% 50%, rgba(15, 76, 92, 0.7) 0%, rgba(0, 105, 112, 0.7) 100%)",
  },

  keyframes: {
    "move-bg": {
      "0%": { backgroundPosition: "0% 0%" },
      "50%": { backgroundPosition: "100% 0%" },
      "100%": { backgroundPosition: "0% 0%" },
    },
  },

  fontFamily: {
    poppins: ["var(--font-poppins)"],
    roboto: ["var(--font-roboto)"],
    fredoka: ["var(--font-fredoka)"],
  },

  // Backdrop blur settings
  backdropBlur: {
    // Blur effect with 20px radius
    "20": "20px",
  },

  // Custom border images
  borderImageSource: {
    // Green gradient for border image
    "green-gradient":
      "linear-gradient(180deg, rgba(1, 107, 75, 0.4) 0%, #016B4B 100%)",
  },

  // Box shadow configurations
  boxShadow: {
    // Light inset shadow with transparency
    "inset-light": "-2px -4px 20px 2px #1BA37BA6 inset",
    // Medium inset shadow with greenish hue
    "inset-medium": "30px 35px 15px -15px #1BA37B33 inset",
    // Strong inset shadow with dark green hue
    "inset-strong": "0px 0px 50px 40px #1BA37B inset",
    // Soft green shadow
    "soft-green": "7px 7px 40px 0px #20575573",
    // Shadow for selected text elements
    selection_text: "0px 0px 5px 0px #000000A6",
    "white-glow": "0px 0px 25px 8px rgba(255, 255, 255, 0.5)", // Soft, rounded glow
    "dark-glow": "0px 0px 25px 8px rgba(0, 0, 0, 0.6)", // Dark mode adaptation
  },

  screens: {
    xs: "320px",
    "sm-custom": "480px",
    "md-custom": "640px",
    "lg-custom": "768px",
    "xl-custom": "1024px",
    "2xl-custom": "1280px",
  },

  // Text shadow styles
  textShadow: {
    // Basic text shadow with a subtle blur effect
    normal: "0px 0px 5px #000000A6",

    "more-templates":
      "0px 10px 15px -3px rgba(0, 178, 130, 0.4), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },

  // Z-index values for stacking order of elements
  zIndex: {
    minus_1: "-1",
    minus_10: "-10",
    minus_50: "-50",
    minus_100: "-100",
    plus_1: "1",
    plus_10: "10",
    plus_50: "50",
    plus_100: "100",

    // Z-index for mobile stepper (progress indicators)
    mobile_stepper: "1000",

    // Z-index for floating action button (FAB)
    fab: "1050",

    // Z-index for speed dial buttons
    speed_dial: "1050",

    // Z-index for app bar
    app_bar: "1100",

    // Z-index for drawer (sidebar)
    drawer: "1200",

    // Z-index for modal dialogs
    modal: "1300",

    // Z-index for snackbar (temporary message display)
    snackbar: "1400",

    // Z-index for tooltips (hover info display)
    tooltip: "1500",

    // Z-index for maximum stacking order
    max: 99999,
  },
};

// export const safeList = [
//   "bg-tanuki-banner-light",
//   "bg-tanuki-banner-light-fallback",
//   "bg-tanuki-banner-dark",
//   "bg-tanuki-banner-dark-fallback",

//   "bg-tanuki-bg-light",
//   "bg-tanuki-bg-light-fallback",
//   "bg-tanuki-bg-dark",
//   "bg-tanuki-bg-dark-fallback",
// ];

// Safe list of background colors for the app
// export const safeList = [
//   "bg-[#fff]",
//   "bg-[#000]",
//   "!bg-[#000]",
//   "bg-[#121212]",
//   "bg-[#1a202c]",
//   "hover:bg-[#1a202c]",
//   "bg-[#1A202CB3]",
//   "hover:bg-[#1A202CB3]",
//   "bg-[#FFFFFFB3]",
//   "text-[#333]",
//   "text-[#0077cc]",
//   "hover:text-[#005a99]",
//   "text-[#4dafff]",
//   "text-[#0077cc]",
//   "hover:text-[#3399ff]",
//   "text-[#fff]",
//   "text-[#000]",
//   "text-[#F7FAFC]",
// ];

export const themes = {
  light: {
    extend: "light",
    colors: lightColors,
  },

  dark: {
    extend: "dark",
    colors: darkColors,
  },
};
