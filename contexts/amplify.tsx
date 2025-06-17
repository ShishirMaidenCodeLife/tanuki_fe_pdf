"use client";

import { Amplify } from "aws-amplify";
import {
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  resendSignUpCode,
} from "@aws-amplify/auth";
import Cookies from "js-cookie";
import * as React from "react";

import {
  amplifyConfig,
  authReducer,
  INITIAL_AMPLIFY_AUTH_STATE,
} from "@/config/amplify";
import { getAmplifyUserState } from "@/services/amplify";
import * as T from "@/types";
import { PAGE_ERROR_MESSAGES } from "@/utils/constants/messages";

// Configure Amplify
Amplify.configure(amplifyConfig);

// Context for Amplify Auth
const AmplifyContext = React.createContext<T.AmplifyContextType | null>(null);

// Provider for Amplify Auth Context
export const AmplifyProvider = ({ children }: T.ChildrenType) => {
  const [state, dispatch] = React.useReducer(
    authReducer,
    INITIAL_AMPLIFY_AUTH_STATE,
  );

  // Reset authentication state and remove cookies
  const clearAuthState = async () => {
    dispatch({
      type: "SET_USER",
      payload: {
        ...INITIAL_AMPLIFY_AUTH_STATE,
        loading: { ...INITIAL_AMPLIFY_AUTH_STATE.loading, isLoading: false },
      },
    });

    // Delete cookies client-side
    Cookies.remove("accessToken");
    Cookies.remove("idToken");
  };

  // Send OTP (Resend OTP)
  const sendOtp = async (otpUsername = "") => {
    try {
      dispatch({ type: "SET_LOADING", payload: { isOtpLoading: true } });

      await resendSignUpCode({ username: otpUsername });

      dispatch({
        type: "SET_OTP",
        payload: { otpUsername, isOtpSent: true, otpError: "" },
      });
    } catch (error) {
      dispatch({
        type: "SET_OTP",
        payload: { otpError: (error as Error).message || "OTP request failed" },
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { isOtpLoading: false } });
    }
  };

  // Verify OTP
  const verifyOtp = async (email: string, otpCode: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: { isOtpLoading: true } });

      await confirmSignUp({ username: email, confirmationCode: otpCode });

      dispatch({
        type: "SET_OTP",
        payload: { isOtpSent: false, otpUsername: "", otpError: "" },
      });
    } catch (error) {
      dispatch({
        type: "SET_OTP",
        payload: {
          otpError: (error as Error).message || "OTP verification failed",
        },
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { isOtpLoading: false } });
    }
  };

  // Fetch user session and store tokens in cookies
  const fetchUser = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: { isLoading: true } });

      const session = await fetchAuthSession({ forceRefresh: true });

      if (session?.tokens?.accessToken && session?.tokens?.idToken) {
        const accessToken = session.tokens.accessToken.toString();
        const idToken = session.tokens.idToken.toString();

        // Store tokens in cookies
        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("idToken", idToken, { secure: true, sameSite: "Strict" });

        const user = await getCurrentUser();

        if (!user) {
          clearAuthState();

          return;
        }
        dispatch(getAmplifyUserState(user, session));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    }
  };

  // useEffect: Fetch user session on mount
  React.useEffect(() => {
    fetchUser();
  }, [state.isUserAuthenticated]);

  return (
    <AmplifyContext.Provider
      value={{ state, dispatch, clearAuthState, sendOtp, verifyOtp }}
    >
      {children}
    </AmplifyContext.Provider>
  );
};

// Custom Hook: Amplify Auth
export const useAmplify = () => {
  const context = React.useContext(AmplifyContext);

  if (!context) {
    throw new Error(PAGE_ERROR_MESSAGES.amplify.outOfBounds);
  }

  return context;
};
