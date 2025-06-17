"use client";

import { useState, useCallback } from "react";

export const useBooleanHook = (initialState = false) => {
  const [state, setState] = useState<boolean>(initialState);

  // Memoize the setter functions to avoid unnecessary re-renders
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);
  const toggle = useCallback(() => setState((prev) => !prev), []);

  return { state, setTrue, setFalse, toggle };
};
