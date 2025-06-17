"use client";

import { useSwitch } from "@heroui/switch";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { FC } from "react";

import { SunFilledIcon, MoonFilledIcon, RoundSkeleton } from "@/components";
import { useCheckMountedHook } from "@/hooks";
import { ThemeSwitchType } from "@/types/components";

export const ThemeSwitch: FC<ThemeSwitchType> = ({ className, classNames }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useCheckMountedHook();

  const onChange = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  const { Component, slots, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch({
      isSelected: resolvedTheme === "light",
      "aria-label": `Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`,
      onChange,
    });

  if (!isMounted || !resolvedTheme)
    return (
      <div className="-translate-x-6">
        <RoundSkeleton rounded8 />
      </div>
    );

  return (
    <Component
      {...getBaseProps({
        className: clsx([
          "transition-opacity hover:opacity-80 cursor-pointer w-full _apply_navbar_height -translate-x-4",
          className,
          classNames?.base,
        ]),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-12 h-12",
              "bg-transparent p-1.5",
              "rounded-full",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-highlight",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {resolvedTheme === "light" ? (
          <SunFilledIcon size={28} />
        ) : (
          <MoonFilledIcon size={28} />
        )}
      </div>
      {process.env.FE_MODE && (
        <div className="glass-default px-2 py-1 rounded-md text-sm">
          {process.env.FE_MODE}
        </div>
      )}
    </Component>
  );
};
