"use client";

import clsx from "clsx";
import { Input, InputOtp, Kbd, Textarea } from "@heroui/react";
import React from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import { CommonSkeleton, SearchIcon } from "@/components";
import {
  useCombinedAuthNavHook,
  useBooleanHook,
  useCheckMountedHook,
} from "@/hooks";
import { CommonResponsiveType, InputType, TextAreaType } from "@/types";

export const EmailInput = (props: InputType) => {
  // Destructure
  const { field, error, label, isNotRequired, ...rest } = props;

  return (
    <Input
      {...field}
      autoComplete="username"
      errorMessage={error?.message}
      isInvalid={!!error}
      isRequired={!isNotRequired}
      label={label || "Email"}
      type="email"
      validationBehavior="aria"
      variant="flat"
      onBlur={field.onBlur}
      onChange={field.onChange}
      {...rest}
    />
  );
};

export const NameInput = (props: InputType) => {
  // Destructure
  const { field, error, label, isNotRequired, ...rest } = props;

  return (
    <Input
      {...field}
      errorMessage={error?.message}
      isInvalid={!!error}
      isRequired={!isNotRequired}
      label={label || "Name"}
      type="text"
      validationBehavior="aria"
      variant="flat"
      onBlur={field.onBlur}
      onChange={field.onChange}
      {...rest}
    />
  );
};

export const TextareaInput = (props: TextAreaType) => {
  // Destructure
  const { field, error, label, isNotRequired, ...rest } = props;

  return (
    <Textarea
      {...field}
      isClearable
      className="max-w-xs"
      classNames={{
        description: "font-normal",
      }}
      defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      errorMessage={error?.message}
      isInvalid={!!error}
      isRequired={!isNotRequired}
      label={label || "Description"}
      placeholder="Description"
      // validationBehavior="aria"
      variant="flat"
      // eslint-disable-next-line no-console
      // onClear={() => console.log("textarea cleared")}
      onClear={() => field.onChange("")} // Clears the value in React Hook Form
      //   onBlur={field.onBlur}
      //   onChange={field.onChange}
      {...rest}
    />
  );
};

export const OtpInput = (props: InputType) => {
  // Destructure
  const { field, error, length, ...rest } = props;

  return (
    <InputOtp
      {...field}
      errorMessage={error && error.message}
      isInvalid={!!error}
      length={length || 6}
      {...rest}
    />
  );
};

export const PasswordInput = (props: InputType) => {
  // Destructure
  const { field, error, label, isNotRequired, ...rest } = props;

  // States
  const { state, toggle } = useBooleanHook();

  return (
    <Input
      {...field}
      autoComplete="current-password"
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggle}
        >
          {state ? (
            <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      errorMessage={error?.message}
      isInvalid={!!error}
      isRequired={!isNotRequired}
      label={label || "Password"}
      type={state ? "text" : "password"}
      validationBehavior="aria"
      variant="flat"
      onBlur={field.onBlur}
      onChange={field.onChange}
      {...rest}
    />
  );
};

export const SearchInput: React.FC<CommonResponsiveType> = (props) => {
  const { isMenuToggled } = props;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { shouldHideAuthHeaderButtons } = useCombinedAuthNavHook();
  const isMounted = useCheckMountedHook();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      alert("Coming soon!");
    }
  };

  // Global keyboard shortcut (Cmd + K or Ctrl + K)
  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleShortcut);

    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  if (shouldHideAuthHeaderButtons) return null;

  // Css
  const menuToggledDisplayCss = isMenuToggled ? "md:hidden" : "hidden md:flex";
  const menuToggleWidth = isMenuToggled
    ? "w-60 focus-within:w-80"
    : "w-40 focus-within:w-60";

  return (
    <div
      className={clsx(
        "search-input",
        "group w-40 max-w-sm focus-within:w-60 h-[40px] apply_transition_all_500",
        menuToggledDisplayCss,
        menuToggleWidth,
      )}
    >
      {!isMounted ? (
        <div className={clsx("relative max-w-sm h-[40px]", menuToggleWidth)}>
          <CommonSkeleton roundedXl />
          <CommonSkeleton
            color100
            roundedLg
            extendCss="absolute top-[calc(40px-24px-8px)] right-3"
            height="h-6"
            width="w-[2.1rem]"
          />
        </div>
      ) : (
        <Input
          ref={inputRef}
          aria-label="Search"
          classNames={{
            inputWrapper:
              "bg-overlay40 w-full border-[1px] border-transparent dark:border-defaultBtnBorder",
            input: "text-sm",
          }}
          endContent={<Kbd keys={["command"]}>K</Kbd>}
          labelPlacement="outside"
          placeholder="Search..."
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};
