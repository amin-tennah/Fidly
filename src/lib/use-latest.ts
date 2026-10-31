"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Ref always holding the latest value, so an effect can call it without resubscribing. */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
