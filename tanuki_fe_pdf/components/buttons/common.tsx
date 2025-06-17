"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { FcHome } from "react-icons/fc";

import {
  CommonModal,
  CommonSkeleton,
  CommonToastContainer,
} from "@/components";
import {
  CommonButtonType,
  CommonModalButtonType,
  LinkButtonType,
} from "@/types/components";

// export type ModalButtonType = {
// commonToastProps
// }

export const CommonButton = (props: CommonButtonType) => {
  // Destructure
  const { children, extendCss, ...rest } = props;

  return (
    <Button className={clsx("_apply_custom_link", extendCss)} {...rest}>
      {children}
    </Button>
  );
};

export const LinkButton = (props: LinkButtonType) => {
  // Props
  const {
    extendCss = "_apply_custom_link",
    isHome,
    isGhost,
    isNextLink,
    isOpposite,
    skeletonProps = { isSkeletonLoading: false },

    ...rest
  } = props;

  // Main
  return (
    <>
      {skeletonProps.isSkeletonLoading ? (
        <CommonSkeleton {...skeletonProps} />
      ) : (
        <Button
          // isExternal
          as={Link}
          // className="text-sm font-normal text-default-600 bg-default-100"
          // startContent={
          //   <CustomIcons.HeartFilledIcon className="text-danger" />
          // }
          className={clsx([
            `${isGhost ? "!bg-none" : extendCss}`,
            isOpposite
              ? "_apply_custom_overlay_link"
              : isNextLink
                ? "_apply_auth_next_link"
                : "_apply_custom_link",
          ])}
          href={isHome ? "/" : undefined}
          startContent={isHome ? <FcHome size={24} /> : null}
          variant="flat"
          {...rest}
        />
      )}
    </>
  );
};

export const SubmitButton = (props: CommonButtonType) => {
  const {
    children,
    extendCss = "_apply_custom_link",
    isOpposite,
    ...rest
  } = props;

  return (
    <Button
      className={clsx(
        isOpposite ? "_apply_custom_overlay_link" : "",
        extendCss,
      )}
      type="submit"
      {...rest}
    >
      {children}
    </Button>
  );
};

export const CommonModalButton = (props: CommonModalButtonType) => {
  const { commonToastProps, modalProps } = props;

  return (
    <CommonToastContainer {...commonToastProps}>
      <CommonModal {...modalProps} />
    </CommonToastContainer>
  );
};
