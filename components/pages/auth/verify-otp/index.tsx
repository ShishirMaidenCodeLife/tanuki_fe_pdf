"use client";

import { ToastProps } from "@heroui/react";
import { confirmSignUp } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { AuthFormContainer, CommonButton, OtpInput } from "@/components";
import { useAmplify } from "@/contexts/amplify";
import { siteData } from "@/data/custom/site";
import { useBooleanHook, useNavigationLoaderHook } from "@/hooks";
import { VerifyOtpFormType } from "@/types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { formValidation } from "@/utils/constants/validation";
import { handleCustomToast } from "@/utils/methods/style";

export const VerifyOtpPageClient = () => {
  const { state, sendOtp } = useAmplify();
  const {
    loading: { isOtpLoading },
    otpUsername,
    isOtpSent,
  } = state;
  const { state: isSubmitting, setFalse, setTrue } = useBooleanHook();
  const { isNavigating, navigateWithLoader } = useNavigationLoaderHook();

  // Timer state for Resend OTP button
  const [timeLeft, setTimeLeft] = useState(10); // Initially disabled for 20s

  // Start 2-minute timer when OTP is sent
  const startTimer = () => {
    setTimeLeft(120); // 2 minutes (120 seconds)
  };

  // Effect to countdown timer
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 300);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Handle OTP form submission
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VerifyOtpFormType>({
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  // Handle OTP send
  const handleSendOtp = () => {
    if (!sendOtp) return;
    sendOtp(otpUsername);
    if (isOtpSent) startTimer();
    else handleCustomToast(TOAST_MESSAGES.auth.otp.failed);
  };

  // Handle OTP verification
  const onSubmit = async (data: VerifyOtpFormType) => {
    setTrue();
    try {
      await confirmSignUp({
        username: otpUsername || "",
        confirmationCode: data.otp,
      });
      handleCustomToast(TOAST_MESSAGES.auth.user.verified);
      navigateWithLoader("/login");
    } catch (error) {
      handleCustomToast({
        color: "danger" as ToastProps["color"],
        title: (error as Error)?.message,
      });
    } finally {
      setFalse();
    }
  };

  return (
    <AuthFormContainer
      extendCss="page-verify-otp"
      isSubmitting={isSubmitting || isNavigating}
      nextButton={
        <CommonButton
          isDisabled={timeLeft > 0}
          isLoading={isOtpLoading}
          onPress={handleSendOtp}
        >
          {timeLeft > 0 ? `Resend OTP (${timeLeft}s)` : "Resend OTP"}
        </CommonButton>
      }
      title={siteData.buttons.verifyOtp}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="otp"
        render={({ field }) => <OtpInput error={errors.otp} field={field} />}
        rules={formValidation.otpSixDigit}
      />
    </AuthFormContainer>
  );
};
