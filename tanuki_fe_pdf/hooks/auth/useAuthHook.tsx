"use client";

import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
} from "@aws-amplify/auth";

import { useAmplify } from "@/contexts/amplify";
import { useNavigationLoaderHook, useRoadmapStoreHook } from "@/hooks";
import { getAmplifyUserState } from "@/services/amplify";
import { LoginFormType } from "@/types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast, handleErrorToast } from "@/utils/methods/style";

// Function to handle login errors
const handleLoginError = (error: Error) => {
  if (error.name === "NotAuthorizedException") {
    handleCustomToast(TOAST_MESSAGES.auth.incorrectCredentials);
  } else if (error.name === "UserNotFoundException") {
    handleCustomToast(TOAST_MESSAGES.auth.user.notFound);
  } else {
    handleErrorToast(error);
  }
  console.error("Login failed:", error);
};

export const useAuthHook = () => {
  const { clearAuthState, dispatch, sendOtp, state } = useAmplify();
  const {
    loading: { isLogoutLoading },
  } = state;
  const { clearTidyPageMethods, setIsGlobalLoading } = useRoadmapStoreHook();
  const { navigateWithLoader } = useNavigationLoaderHook();

  // Login
  const handleLogin = async (
    data: LoginFormType,
    setTrue: () => void,
    setFalse: () => void,
  ) => {
    try {
      setTrue();
      setIsGlobalLoading(true);
      const { email: username, password } = data;

      // Amplify API: Sign in the user
      const {
        nextStep: { signInStep },
      } = await signIn({ username, password });

      // Redirect to OTP verification if user exists
      if (signInStep === "CONFIRM_SIGN_UP") {
        const otpUsername = data.email;

        dispatch({
          type: "SET_OTP",
          payload: { otpUsername, isOtpSent: true },
        });
        handleCustomToast(TOAST_MESSAGES.auth.user.alreadyExistsVerifyOtp);
        sendOtp && sendOtp(otpUsername);
        setIsGlobalLoading(false);
        navigateWithLoader("/verify-otp", true);

        return;
      }

      // Amplify API: Fetch authenticated user details & session
      const user = await getCurrentUser();
      const session = await fetchAuthSession();

      if (user) {
        clearTidyPageMethods();
        dispatch(getAmplifyUserState(user, session));
        handleCustomToast(TOAST_MESSAGES.auth.login.success);
        navigateWithLoader("dashboard", true);
      }
    } catch (error) {
      // Handle authentication errors
      handleLoginError(error as Error);
      setIsGlobalLoading(false);
    } finally {
      setFalse();
      setIsGlobalLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    if (isLogoutLoading) return;

    dispatch({ type: "SET_LOADING", payload: { isLogoutLoading: true } });

    try {
      setIsGlobalLoading(true);
      await signOut();
      clearAuthState();
      clearTidyPageMethods();
      handleCustomToast(TOAST_MESSAGES.auth.logout.success);
      navigateWithLoader("/login", true);
    } catch (error) {
      console.error("Error logging out:", error);
      setIsGlobalLoading(false);
      handleCustomToast(TOAST_MESSAGES.auth.logout.failed);
    } finally {
      dispatch({ type: "SET_LOADING", payload: { isLogoutLoading: false } });
      setIsGlobalLoading(false);
    }
  };

  return { handleLogin, handleLogout, isLogoutLoading };
};
