"use client";

import { useEffect, useState } from "react";

/**
 * EACH PAGE ARRIVES WITH A SHORT FADE.
 *
 * A template remounts on every navigation, so the fade runs each time a new
 * page replaces the last (the old one has already faded out: SmoothScroll's
 * link handler). The first page a visitor opens is not faded: there it would
 * only hold back the first paint. Opacity only, never a transform: a
 * transformed ancestor would turn the machine's position: fixed canvas into
 * one that scrolls with the page.
 */
let arrived = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [fade] = useState(() => arrived);
  useEffect(() => {
    arrived = true;
  }, []);
  return <div className={fade ? "page page-in" : "page"}>{children}</div>;
}
