"use client";

import { Controller, useForm } from "react-hook-form";

import { AuthFormContainer, TextareaInput } from "@/components";
import { getAiSingleCallBody } from "@/config/api";
import * as H from "@/hooks";
import { RoutesFormBuilderType } from "@/types";
import { formValidation } from "@/utils/constants/validation";

// AI Routes Search Form
export const GenerateRoutePageClient = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RoutesFormBuilderType>({
    mode: "onChange",
    defaultValues: { routesValue: "" },
  });
  const { isMdLoading, setIsMdLoading } = H.useRoadmapStoreHook();
  const singleAiCallMutation = H.useMutationSingleCallHook();
  const { isNavigating } = H.useNavigationLoaderHook();

  // Action when the form gets submitted
  const handleFormSubmit = (data: RoutesFormBuilderType) => {
    setIsMdLoading(true);

    singleAiCallMutation?.mutate(getAiSingleCallBody(data.routesValue));
  };

  return (
    <AuthFormContainer
      extendActionBtnCss="_apply_container_width_form_btn_center"
      extendCss="page-dashboard-generate-route"
      isSubmitting={isMdLoading || isNavigating}
      submitTitle="Generate"
      title="AI Roadmap"
      onSubmit={handleSubmit((data: RoutesFormBuilderType) =>
        handleFormSubmit(data),
      )}
    >
      <Controller
        control={control}
        name="routesValue"
        render={({ field }) => (
          <TextareaInput
            className="max-w-md"
            // className="min-w-[150px]"
            description="You may or may not use spaces between the routes."
            error={errors.routesValue}
            field={{
              ...field,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit((data: RoutesFormBuilderType) =>
                    handleFormSubmit(data),
                  )();
                }
              },
            }}
            label="Enter routes separated by comma"
            placeholder="Business, Marketing, Sales"
          />
        )}
        rules={formValidation.routesValue}
      />
    </AuthFormContainer>
  );
};
