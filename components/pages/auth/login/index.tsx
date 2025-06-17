"use client";

import { Controller, useForm } from "react-hook-form";

import { AuthFormContainer, EmailInput, PasswordInput } from "@/components";
import { siteData } from "@/data/custom/site";
import { useAuthHook, useBooleanHook } from "@/hooks";
import { LoginFormType } from "@/types";
import { formValidation } from "@/utils/constants/validation";

export const LoginPageClient = () => {
  const { handleLogin } = useAuthHook();
  const { state: isSubmitting, setFalse, setTrue } = useBooleanHook();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormType>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthFormContainer
      extendCss="page-login"
      isSubmitting={isSubmitting}
      nextLinkHref="/register"
      nextLinkTitle={siteData.pages.login.noAccountSignUp}
      title={siteData.buttons.login}
      onSubmit={handleSubmit((data: LoginFormType) =>
        handleLogin(data, setTrue, setFalse),
      )}
    >
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
    </AuthFormContainer>
  );
};
