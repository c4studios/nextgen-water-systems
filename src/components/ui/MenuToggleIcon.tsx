"use client";

import React from "react";
import { cn } from "@/lib/cn";

/**
 * The menu toggle: a rule that unfurls into a hook and back.
 *
 * Taken essentially verbatim from the supplied component — it is pure SVG plus
 * CSS transitions on stroke-dasharray, so it needed no dependencies and no
 * re-authoring. The only change is `cn` importing from this project's own
 * helper rather than a shadcn `@/lib/utils`, and the default stroke width
 * dropped a little to sit with the site's hairline drafting weight.
 */
type MenuToggleProps = React.ComponentProps<"svg"> & {
  open: boolean;
  duration?: number;
};

export function MenuToggleIcon({
  open,
  className,
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  duration = 520,
  ...props
}: MenuToggleProps) {
  return (
    <svg
      strokeWidth={strokeWidth}
      fill={fill}
      stroke={stroke}
      viewBox="0 0 32 32"
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden="true"
      className={cn("mti", open && "is-open", className)}
      style={{ transitionDuration: `${duration}ms` }}
      {...props}
    >
      <path
        className={cn("mti-curl", open && "is-open")}
        style={{ transitionDuration: `${duration}ms` }}
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
      />
      <path d="M7 16 27 16" />
    </svg>
  );
}
