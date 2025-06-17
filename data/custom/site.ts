import { env } from "../../config/env";

export const siteData = {
  company: {
    name: "System Shared Inc.",
    description: "A modern web application for managing shared systems.",
  },
  buttons: {
    goHome: "Go back to Home",
    login: "Login",
    moreTemplates: "More Templates",
    register: "Register",
    verifyOtp: "Verify OTP",
    ai: "Generate AI",
  },
  pages: {
    error: {
      default: "Some error occured. Please try again.",
      notFound: "Page not found.",
    },
    login: {
      title: "Sign in",
      noAccountSignUp: "Dont have an account? Sign up.",
    },
    register: {
      title: "Sign up",
      haveAccountSignIn: "Already have an account? Sign in.",
    },
    dashboard: {
      banner: {
        title: "Explore the map",
        description: "Open the door the world of IT technology through maps!",
      },
    },
  },
  layout: {
    footer: {
      copyright: "© System Shared co., ltd, All Rights Reserved.",
    },
  },
};

export const siteImages = {
  icon: {
    sss: {
      logo: "/images/icon/sss/sss-logo.ico",
    },
  },

  png: {
    pineapple: {
      blushing: "/images/png/pineapple/pineapple-blushing.png",
    },
    roadmap: {
      compass: "/images/png/roadmap/roadmap-compass.png",
      diwali: "/images/png/roadmap/roadmap-diwali.png",
      endSign: "/images/png/roadmap/roadmap-end-sign.png",
      location: "/images/png/roadmap/roadmap-location.png",
      placeholder: "/images/png/roadmap/roadmap-placeholder.png",
      startSign: "/images/png/roadmap/roadmap-start-sign.png",
      traffic: "/images/png/roadmap/roadmap-traffic.png",
    },

    sss: {
      fullLogo: "/images/png/sss/sss-full-logo.png",
    },

    tanuki: {
      banner: {
        dark: {
          default: `${env.CLOUDINARY_URL}/tanuki-banner-dark`,
          fallback: "/images/png/tanuki/tanuki-banner-dark.png",
        },
        light: {
          default: `${env.CLOUDINARY_URL}/tanuki-banner-light`,
          fallback: "/images/png/tanuki/tanuki-banner-light.png",
        },
      },

      bg: {
        dark: {
          default: `${env.CLOUDINARY_URL}/tanuki-bg-dark`,
          fallback: "/images/png/tanuki/tanuki-bg-dark.png",
        },
        light: {
          default: `${env.CLOUDINARY_URL}/tanuki-bg-light`,
          fallback: "/images/png/tanuki/tanuki-bg-light.png",
        },
      },
    },
  },

  svg: {
    category: {
      business: "/images/svg/category/category-business.svg",
      cybersecurity: "/images/svg/category/category-cybersecurity.svg",
      dataScience: "/images/svg/category/category-data-science.svg",
      designer: "/images/svg/category/category-designer.svg",
      personal: "/images/svg/category/category-personal.svg",
      software: "/images/svg/category/category-software.svg",
    },

    figma: {
      saveRoute: "/images/svg/figma/figma-save-route.svg",
      settingConfig: "/images/svg/figma/figma-setting-config.svg",
      signOut: "/images/svg/figma/figma-sign-out.svg",
      vectorCenter: "/images/svg/figma/figma-vector-center.svg",
      vectorRoute: "/images/svg/figma/figma-vector-route.svg",
    },

    pineapple: {
      bigHead: "/images/svg/pineapple/pineapple-big-head.svg",
      squareFilled: "/images/svg/pineapple/pineapple-square-filled.svg",
      squareOutline: "/images/svg/pineapple/pineapple-square-outline",
    },

    tanuki: {
      logo: "/images/svg/tanuki/tanuki-logo.svg",
      wave: "/images/svg/tanuki/tanuki-wave.svg",
    },
  },

  webp: {
    pineapple: {
      referee: "/images/webp/pineapple/pineapple-referee.webp",
    },
  },
};

export const siteConstants = {
  GLOBAL_LOADING_TIME: 10000,
};
