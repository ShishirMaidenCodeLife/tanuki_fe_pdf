"use client";

import { ToastProps } from "@heroui/react";
import { signUp } from "aws-amplify/auth";
import { Controller, useForm } from "react-hook-form";

import {
  AuthFormContainer,
  NameInput,
  EmailInput,
  PasswordInput,
} from "@/components";
import { useAmplify } from "@/contexts/amplify";
import { siteData } from "@/data/custom/site";
import {
  useBooleanHook,
  useCheckMountedHook,
  useNavigationLoaderHook,
} from "@/hooks";
import { RegisterFormType } from "@/types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { formValidation } from "@/utils/constants/validation";
import { handleCustomToast } from "@/utils/methods/style";

export const RegisterPageClient = () => {
  const { dispatch } = useAmplify();

  const mounted = useCheckMountedHook();
  const { state: isSubmitting, setFalse, setTrue } = useBooleanHook();
  const { navigateWithLoader } = useNavigationLoaderHook();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormType>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmSignupPassword: "",
    },
  });

  // Handle signup submission
  const onSubmit = async (data: RegisterFormType) => {
    setTrue();
    try {
      const { email: username, password } = data;

      await signUp({ username, password });

      dispatch({
        type: "SET_OTP",
        payload: { otpUsername: username, isOtpSent: true },
      });
      handleCustomToast(TOAST_MESSAGES.auth.otp.pleaseVerify);
      navigateWithLoader("/verify-otp", true);
    } catch (error) {
      handleCustomToast({
        color: "danger" as ToastProps["color"],
        title: (error as Error)?.message,
      });
    } finally {
      setFalse();
    }
  };

  if (!mounted) return null;

  return (
    <AuthFormContainer
      extendCss="page-register"
      isSubmitting={isSubmitting}
      nextLinkHref="/login"
      nextLinkTitle={siteData.pages.register.haveAccountSignIn}
      title={siteData.buttons.register}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="name"
        render={({ field }) => <NameInput error={errors.name} field={field} />}
        rules={formValidation.name}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <EmailInput error={errors.email} field={field} />
        )}
        rules={formValidation.email}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <PasswordInput error={errors.password} field={field} />
        )}
        rules={formValidation.password}
      />
      <Controller
        control={control}
        name="confirmSignupPassword"
        render={({ field }) => (
          <PasswordInput
            error={errors.confirmSignupPassword}
            field={field}
            label="Retype Password"
          />
        )}
        rules={formValidation.confirmSignupPassword}
      />
    </AuthFormContainer>
  );
};
