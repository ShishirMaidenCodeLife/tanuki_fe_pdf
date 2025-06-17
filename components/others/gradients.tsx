"use client";

import { useTheme } from "next-themes";

import { useCheckMountedHook } from "@/hooks";

export const BgGradient1 = () => {
  const mounted = useCheckMountedHook();
  const { theme } = useTheme();

  if (!mounted) return null;

  return theme === "light" ? (
    <div className="absolute inset-0 bg-[linear-gradient(120deg,#FFD700_0%,#FFA500_100%)] bg-blend-overlay" />
  ) : (
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(10,10,20,1)_40%,rgba(30,60,160,0.4)_60%,black_100%)] bg-blend-multiply" />
  );
};

export const BgGradient2 = () => {
  const mounted = useCheckMountedHook();
  const { theme } = useTheme();

  if (!mounted) return null;

  return theme === "light" ? (
    <div className="absolute inset-0 bg-[linear-gradient(120deg,#E3E2C5_0%,#D5C7AF_15%,#C9C4A0_30%,#82D0D6_50%,#319ABD_80%,#2161C2_100%)] bg-blend-overlay" />
  ) : (
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(5,5,15,1)_60%,rgba(25,50,120,0.3)_75%,black_100%)] bg-blend-darken" />
  );
};

export const BgGradient3 = () => {
  const mounted = useCheckMountedHook();
  const { theme } = useTheme();

  if (!mounted) return null;

  return theme === "light" ? (
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(164,232,234,0.7)_0%,rgba(31,229,235,0.7)_100%)] bg-blend-color-dodge" />
  ) : (
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(5,5,15,1)_50%,rgba(20,40,160,0.3)_65%,black_100%)] bg-blend-darken" />
  );
};

export const BgGradient4 = () => {
  const mounted = useCheckMountedHook();
  const { theme } = useTheme();

  if (!mounted) return null;

  return theme === "light" ? (
    <div className="absolute inset-0 bg-[linear-gradient(120deg,#FF5733_0%,#C70039_50%,#900C3F_100%)] bg-blend-overlay" />
  ) : (
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(5,5,15,1)_70%,rgba(25,50,120,0.3)_80%,black_100%)] bg-blend-darken" />
  );
};

export const BgGradient5 = () => {
  const mounted = useCheckMountedHook();
  const { theme } = useTheme();

  if (!mounted) return null;

  return theme === "light" ? (
    <div className="absolute inset-0 bg-white" />
  ) : (
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(5,5,10,1)_75%,rgba(15,30,120,0.2)_85%,black_100%)] bg-blend-overlay" />
  );
};
