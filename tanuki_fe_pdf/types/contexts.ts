import type { ThemeProviderProps } from "next-themes";

import { JWT } from "@aws-amplify/auth";

import { ChildrenType, ToastStatusType } from "@/types";

// #region default-providers
export type DefaultProvidersType = ChildrenType & ThemeProviderType;
// #endregion default-providers

// #region theme-provider
export interface ThemeProviderType {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}
// #endregion theme-provider

// #region toast-provider

// Toast to display the message
export interface ToastType extends ToastStatusType {
  duration?: number;
  isPopup?: boolean;
  isWidthFull?: boolean;
  msg?: React.ReactNode;
}

// #endregion toast-provider

// #region amplify-auth-provider
export type SignInDetailsType = {
  authFlowType: string;
  loginId: string;
};

export type AmplifyStateType = {
  accessToken: JWT;
  idToken: JWT;
  // isLoading: boolean;
  // isLogoutLoading?: boolean;
  loading: {
    isLoading: boolean;
    isLogoutLoading: boolean;
    isOtpLoading: boolean;
  };
  isUserAuthenticated: boolean;
  signInDetails?: SignInDetailsType;
  userId: string;
  username: string;
  otpUsername?: string;
  isOtpSent: boolean;
  otpError?: string | null;
};

export type AmplifyActionType =
  | { type: "SET_USER"; payload: Partial<AmplifyStateType> }
  | {
      type: "SET_LOADING";
      payload: {
        isLoading?: boolean;
        isLogoutLoading?: boolean;
        isOtpLoading?: boolean;
      };
    }
  | {
      type: "SET_OTP";
      payload: { isOtpSent?: boolean; otpUsername?: string; otpError?: string };
    };

// Type for the context value including clearAuthState
export type AmplifyContextType = {
  clearAuthState: () => void;
  dispatch: React.Dispatch<AmplifyActionType>;
  state: AmplifyStateType;
  sendOtp?: (username?: string) => Promise<void>;
  verifyOtp?: (username: string, code: string) => Promise<void>;
};
// #endregion amplify-auth-provider
