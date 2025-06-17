import * as HeroUI from "@heroui/react";
import { SwitchProps } from "@heroui/switch";
import { ImageProps } from "next/image";
import { MouseEventHandler } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { ChildrenType, DefaultType } from "@/types";

// #region animations
export interface CommonTooltipType extends HeroUI.TooltipProps {}
// #endregion animations

// #region buttons
export interface CommonButtonType extends HeroUI.ButtonProps {
  extendCss?: string;
  onPress?: MouseEventHandler<HTMLButtonElement>;
  isOpposite?: boolean;
}

export interface LinkButtonType extends CommonButtonType {
  isGhost?: boolean;
  isHome?: boolean;
  isNextLink?: boolean;
  isOpposite?: boolean;
  skeletonProps?: CommonSkeletonType;
}

export type CommonModalButtonType = {
  commonToastProps: CommonToastContainerType;
  modalProps: CommonModalType;
};

export type ThemeSwitchType = {
  className?: string;
  classNames?: SwitchProps["classNames"];
};
// #endregion buttons

// #region container
export type ContainerType = {
  children?: React.ReactNode;
  isHorizontal?: boolean;
  isVertical?: boolean;
  isColumn?: boolean;
  isDimensionFull?: boolean;
  isDimensionCommon?: boolean;
  isCenter?: boolean;
  extendCss?: string;
  className?: string;
};

// Used when the button gets disabled but still need an onClick feature so that button gets surrounded with this div
export interface CommonToastContainerType extends ChildrenType {
  title: React.ReactNode;
  show: boolean;
}
// #endregion container

// #region errors
export type CustomTemplateErrorType = {
  errorMsg?: string;
  status?: number | string;
  pageErrorType?: "error-page" | "not-found-page";
  extendCss?: string;
};

export type CommonNextJsErrorType = {
  pageErrorType?: "page" | "default";
};

export interface WrapperApiErrorType extends ChildrenType {
  isLoading?: boolean;
  errorMsg?: string;
  // isError?: boolean;
  // isFetching?: boolean;
  isSuccess?: boolean;
  status?: string;
}
// #endregion errors

// #region forms

export interface AuthFormContainerType extends ChildrenType {
  extendActionBtnCss?: string;
  extendCss?: string;
  isSubmitting: boolean;
  nextButton?: React.ReactNode;
  nextLinkHref?: string;
  nextLinkTitle?: string;
  submitTitle?: string;
  title: string | React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface InputType extends HeroUI.InputProps {
  field: FieldValues;
  error: FieldErrors[DefaultType];
  label?: string;
  className?: string;
  isNotRequired?: boolean;
  length?: number;
}

export interface TextAreaType extends HeroUI.TextAreaProps {
  className?: string;
  description?: string;
  error: FieldErrors[DefaultType];
  field: FieldValues;
  isNotRequired?: boolean;
  label?: string;
  length?: number;
  placeholder?: string;
}
// #endregion forms

export interface CommonImageType extends Omit<ImageProps, "src" | "alt"> {
  alt?: string;
  blurDataUrl?: string;
  className?: string;
  // customLoader?: () => string;
  // handleLoad?: () => void;
  showBlurImage?: boolean;
  src: string;
}

export type ProfileAvatarType = {
  avatarProps?: HeroUI.AvatarProps;
  badgeProps?: HeroUI.BadgeProps;
  email?: string;
  isLoading?: boolean;
};

// #endregion images

// #region modals
export type CommonModalType = {
  actionBtnName?: string;
  actionBtnProps?: Record<string, DefaultType>;
  body?: React.ReactNode;
  extendCss?: string;
  btnProps?: Record<string, DefaultType>;
  hideOkayDialog?: boolean;
  isNotDefaultTitle?: boolean;
  name?: string;
  title?: string | React.ReactNode;
  titleOnly?: string;
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: () => void;
};
// #endregion modals

// #region others/skeletons
export type CommonSkeletonType = {
  border?: string;
  color?: string;
  color100?: boolean;
  color200?: boolean;
  color300?: boolean;
  color400?: boolean;
  color500?: boolean;
  colorTransparent?: boolean;
  extendCss?: string;
  height?: string;
  heightCommon?: boolean;
  imageDonut?: boolean;
  imageMdEditor?: boolean;
  imageRoute?: boolean;
  imageSize?: string;
  rounded?: string;
  roundedFull?: boolean;
  roundedLg?: boolean;
  roundedMd?: boolean;
  roundedSm?: boolean;
  roundedXl?: boolean;
  rounded2Xl?: boolean;
  rounded8?: boolean;
  width?: string;
  isSkeletonLoading?: boolean;
};
// #endregion others/skeletons

// #region others/tooltips
export type CustomTooltipType = {
  title?: string;
  maxLength: number;
  tooltipProps?: CommonTooltipType;
  className?: string;
};
// #endregion others/tooltips

// #region layouts

export type HeaderType = {
  pageLayout?: "error" | "otp" | "public" | "private";
};
