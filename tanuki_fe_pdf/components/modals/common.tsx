"use client";

import { Button, ButtonProps } from "@heroui/button";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import clsx from "clsx";
import { forwardRef } from "react";

import { CommonPineappleImage } from "@/components";
import { CommonModalType } from "@/types/components";

// Common modal component
export const CommonModal = forwardRef<HTMLButtonElement, CommonModalType>(
  (
    {
      name = "Open Modal",
      titleOnly,
      title,
      body,
      extendCss = "",
      btnProps = {
        className: clsx("_apply_custom_link", extendCss),
      },
      onActionClick = () => {},
      actionBtnName = "Yes",
      actionBtnProps = {},
      isNotDefaultTitle = false,
      hideOkayDialog = false,
      isOpen: isOpen2,
      onOpen: onOpen2,
      onOpenChange: onOpenChange2,
      ...rest
    },
    ref,
  ) => {
    // Hooks
    const {
      isOpen: isOpen1,
      onOpen: onOpen1,
      onOpenChange: onOpenChange1,
    } = useDisclosure();

    const isOpen = isOpen2 || isOpen1;
    const onOpen = onOpen2 || onOpen1;
    const onOpenChange = onOpenChange2 || onOpenChange1;

    // Handlers
    const handleClick = () => onOpen();
    const handleActionClick: ButtonProps["onClick"] = (e) => {
      onActionClick(e);
    };

    return (
      <>
        <Button ref={ref} onClick={handleClick} {...btnProps}>
          {name}
        </Button>{" "}
        <Modal
          backdrop="opaque"
          className="!z-modal custom-modal-pineapple bg-background text-textColor"
          classNames={{
            backdrop:
              "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
            base: "duration-150", // Speed up the animation
          }}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          {...rest}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {titleOnly ? (
                    <div className="grid place-items-center gap-2">
                      <CommonPineappleImage />
                      <div>{titleOnly}</div>
                    </div>
                  ) : (
                    title ||
                    (!isNotDefaultTitle
                      ? "Are you sure you want to continue?"
                      : "")
                  )}
                </ModalHeader>

                {body && <ModalBody>{body}</ModalBody>}

                <ModalFooter>
                  <Button color="danger" variant="light" onClick={onClose}>
                    Close
                  </Button>

                  <Button
                    className="text-white"
                    color="success"
                    onClick={(e) => {
                      handleActionClick(e);
                      if (hideOkayDialog) onClose();
                    }}
                    {...actionBtnProps}
                  >
                    {actionBtnName}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  },
);

CommonModal.displayName = "CommonModal";
