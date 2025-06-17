"use client";

import { Form } from "@heroui/react";
import clsx from "clsx";
import Link from "next/link";

import * as C from "@/components";
import * as T from "@/types";
import { handleErrorToast } from "@/utils/methods/style";
import { useRouteTemplateApiService } from "@/hooks";

// Form conainer for authentication pages like Login, Register, Verify-OTP, et
export const AuthFormContainer: React.FC<T.AuthFormContainerType> = ({
  extendActionBtnCss,
  children,
  extendCss,
  isSubmitting,
  nextButton,
  nextLinkHref,
  nextLinkTitle,
  submitTitle,
  onSubmit,
  title = "Default Title",
}) => {
  return (
    <div
      className={clsx(
        extendCss && extendCss,
        "auth-form-container w-full apply_height pb-[6rem] z-plus_10 grid place-items-center",
      )}
    >
      <div className="relative grid gap-5 place-items-center w-full h-full max-w-md mx-auto">
        <div className="w-full grid gap-5 place-items-center rounded-md">
          {/* Form Content */}
          <div className="w-full text-lg font-semibold rounded-br-lg px-8 py-5 flex flex-col gap-8">
            {/* Title */}
            <div className="mx-auto px-5 py-1.5 text-highlight rounded-md bg-background/40 flex justify-center items-center">
              {title}
            </div>

            <Form className="_apply_container_width_form" onSubmit={onSubmit}>
              {/* Input components */}
              {children}

              {/* Button layer for submission and next buttons */}
              <div
                className={
                  extendActionBtnCss || "_apply_container_width_form_btn"
                }
              >
                {nextButton && nextButton}
                <C.SubmitButton isOpposite isLoading={isSubmitting}>
                  {submitTitle || title || "Submit"}
                </C.SubmitButton>
                {nextLinkHref && (
                  <Link className="apply_normal_next_link" href={nextLinkHref}>
                    {nextLinkTitle}
                  </Link>
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Used when the button gets disabled but still need an onClick feature so that button gets surrounded with this div
export const CommonToastContainer: React.FC<T.CommonToastContainerType> = ({
  children,
  show,
  title,
}) => {
  const className = `apply_common_transition ${
    show ? "cursor-not-allowed" : "cursor-pointer"
  }`;

  const onClick = () => {
    show && handleErrorToast({ message: title });
  };

  const customProps = { className, onClick };

  return <div {...customProps}>{children}</div>;
};

// Default container for flex layout
export const Container: React.FC<T.ContainerType> = ({
  children,
  isColumn = false,
  isDimensionFull = false,
  isDimensionCommon = false,
  isCenter = false, // Default is false
  extendCss = "",
}) => {
  // Use clsx to conditionally add classes
  const className = clsx(
    extendCss,
    "w-full h-full flex container", // Basic flex container
    isColumn && "flex-col", // Column direction if isColumn is true
    !isColumn && "flex-row", // Row direction if isColumn is false
    isCenter && "items-center justify-center", // Apply centering if isCenter is true
    isDimensionFull && "apply_dimension_full",
    isDimensionCommon && "_apply_dimension_common",
  );

  return <div className={className}>{children}</div>;
};

// Page container for all pages
export const PageContainer: React.FC<T.ContainerType> = ({
  children,
  className: newClassName,
  extendCss,
}) => {
  return (
    <div
      className={clsx([
        newClassName ||
          clsx([
            "container-page-section",
            "relative flex _apply_container_width mx-auto",
            // "section-page flex flex-col items-center justify-center gap-4 py-8 md:py-10 bg-red-300",
            extendCss,
          ]),
      ])}
    >
      {children}
    </div>
  );
};

export const DashboardContainer = () => {
  const { getByCatResponse } = useRouteTemplateApiService(["useGetByCategory"]);

  return (
    <FullPageContainer>
      <C.PageContainer
        extendCss={clsx(
          "dashboard-container",
          "relative w-full h-full flex-col",
        )}
      >
        <C.BannerSection />
        <C.CategoriesSection {...getByCatResponse?.data} />
        <C.MoreTemplatesSection />
        <C.YourRoutesSection />
      </C.PageContainer>
    </FullPageContainer>
  );
};

export const FullPageContainer = ({ children }: T.ChildrenType) => {
  return (
    <div className="dashboard-wrapper min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-grow">{children}</main>
      <C.Footer />
    </div>
  );
};
