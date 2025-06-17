export type ChildrenType = {
  children?: React.ReactNode;
};

export type DefaultType = any;

export type NavItemType = {
  label: string;
  href: string;
};

export type NextImageType = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
};

export type SvgRefType = React.RefObject<SVGSVGElement | null>;

export type ToastStatusType = {
  status: "info" | "success" | "warning" | "error" | "default";
};

export type BreakpointsType = {
  [key: number]: {
    slidesPerView: number;
    spaceBetween: number;
  };
};

export type CommonResponsiveType = {
  isMenuToggled?: boolean;
};

// export type PageType = {
//   randomNumber?: number;
// };
