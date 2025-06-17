import { ToastProps } from "@heroui/toast";

export type CustomToastType = {
  title: React.ReactNode;
  color: ToastProps["color"];
  description?: string;
};

export type CreateToastPayloadType = {
  color: ToastProps["color"];
  title: JSX.Element;
};
