"use client";

import { motion, AnimatePresence } from "framer-motion";

import * as C from "@/components";
import { siteData } from "@/data/custom/site";
import { useCheckMountedHook } from "@/hooks";
import { CustomTemplateErrorType, WrapperApiErrorType } from "@/types";
import * as _f from "@/utils/constants/framer-constants";

// Custom Template for the all sorts of errors
export const CustomTemplateError = (props: CustomTemplateErrorType) => {
  // Destructure
  const { errorMsg, pageErrorType, status, extendCss } = props;

  const mounted = useCheckMountedHook();

  return (
    <C.Container isCenter extendCss={extendCss || "apply_dimension_full"}>
      <motion.div
        animate="visible"
        className="w-full max-w-md bg-overlay30 p-6 rounded-xl font-fredoka font-medium backdrop-blur-sm"
        data-testid="custom-error"
        initial="hidden"
        variants={_f.containerVariants}
      >
        <C.Container isCenter extendCss="gap-4">
          <motion.div
            className="min-w-fit grid place-items-center"
            variants={_f.itemVariants}
          >
            <motion.div
              animate={{
                rotate: [0, -5, 5, -5, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
            >
              <C.CoolPineappleImage />
            </motion.div>

            <div className="status-code text-3xl font-bold -translate-x-[5px] px-2 -translate-y-1.5 rounded-xl w-24 h-[2.65rem] flex justify-center">
              <AnimatePresence mode="wait">
                {!mounted ? (
                  <motion.div
                    key="skeleton"
                    animate={{ opacity: 1 }}
                    className="relative w-full h-full"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                  >
                    <C.CommonSkeleton color100 roundedXl />
                    <C.CommonSkeleton
                      color200
                      roundedXl
                      extendCss="absolute top-1/3 left-1/2 transform -translate-x-1/2"
                      height="h-1/3"
                      width="w-3/5"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="error-code"
                    animate="animate"
                    className="w-24 h-full text-red-600 border-[2px] border-t-4 border-red-500 rounded-xl px-2 flex justify-center items-center bg-white/5 backdrop-blur-sm"
                    initial="initial"
                    variants={_f.errorCodeVariants}
                  >
                    {status ?? "404"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4"
            variants={_f.itemVariants}
          >
            <AnimatePresence mode="wait">
              {pageErrorType === "error-page" ? (
                <motion.div
                  key="error-page"
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg"
                  exit={{ opacity: 0, x: 20 }}
                  initial={{ opacity: 0, x: -20 }}
                >
                  {!mounted ? (
                    <C.CommonSkeleton />
                  ) : (
                    errorMsg || siteData.pages.error.default
                  )}
                </motion.div>
              ) : pageErrorType === "not-found-page" ? (
                <motion.div
                  key="not-found-page"
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg"
                  exit={{ opacity: 0, x: 20 }}
                  initial={{ opacity: 0, x: -20 }}
                >
                  {!mounted ? (
                    <C.CommonSkeleton />
                  ) : (
                    errorMsg || siteData.pages.error.notFound
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="custom-error"
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  initial={{ opacity: 0, y: -20 }}
                >
                  <C.CustomTooltip
                    className="_apply_custom_error_msg"
                    maxLength={30}
                    title={errorMsg}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <C.Container>
              <C.LinkButton
                isHome
                data-testid="home-button"
                extendCss="w-48 apply_height_button"
                skeletonProps={{
                  heightCommon: true,
                  roundedXl: true,
                  width: "w-48",
                }}
              >
                {siteData.buttons.goHome}
              </C.LinkButton>
            </C.Container>
          </motion.div>
        </C.Container>
      </motion.div>
    </C.Container>
  );
};

export const WrapperApiError = (props: WrapperApiErrorType) => {
  const { children, errorMsg, isLoading, isSuccess, status } = props;

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <C.HappyPineappleSpinner />
        </motion.div>
      ) : isSuccess ? (
        <motion.div
          key="success"
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          initial={{ opacity: 0, y: 20 }}
        >
          {children}
        </motion.div>
      ) : (
        errorMsg && (
          <motion.div
            key="error"
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[calc(100vh-64px)] grid place-items-center"
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
          >
            <CustomTemplateError {...{ status, errorMsg }} />
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
};
