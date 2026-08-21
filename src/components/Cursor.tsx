"use client";

import { useEffect, useRef } from "react";

/**
 * A droplet, rather than a ring.
 *
 * The old cursor was a steel circle that trailed the pointer. It read as a
 * generic custom cursor, and on a water site that is a wasted object. This one
 * behaves like a bead of water being dragged across glass: it stretches along
 * the direction it is travelling, squashes across it, and rounds back out when
 * it stops. Surface tension does the rest.
 *
 * The deformation is driven by real velocity rather than by a timed animation,
 * so it answers the hand. Move slowly and it stays a bead; flick it and it
 * draws out into a tear and snaps back.
 *
 * Two guards keep it off touch devices. The listener never attaches unless the
 * device has a fine pointer that can hover, and the stylesheet hides it under
 * `(hover: none)` and `(pointer: coarse)` as well, because a narrow desktop
 * window is not a phone and a phone that reports hover is still a phone.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // fine pointer AND hover: either alone lets through hybrids and stylus tablets
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    /** smoothed velocity, which is what the shape is made of */
    let vx = 0;
    let vy = 0;
    let raf = 0;
    let last = performance.now();
    let seen = false;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        // jump to the pointer on first sight rather than flying in from centre
        seen = true;
        x = tx;
        y = ty;
        el.style.opacity = "";
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const px = x;
      const py = y;
      // trails the pointer: the lag is what gives it weight
      x += (tx - x) * 0.19;
      y += (ty - y) * 0.19;

      // velocity in px/s, smoothed so a single jittery frame cannot spike it
      const ivx = dt > 0 ? (x - px) / dt : 0;
      const ivy = dt > 0 ? (y - py) / dt : 0;
      vx += (ivx - vx) * 0.22;
      vy += (ivy - vy) * 0.22;

      const speed = Math.hypot(vx, vy);
      // 1400px/s is a brisk flick; past that the shape stops growing so it
      // never becomes a streak
      const s = Math.min(speed / 1400, 1);
      const stretch = 1 + s * 0.85;
      const squash = 1 - s * 0.36;
      const angle = speed > 12 ? (Math.atan2(vy, vx) * 180) / Math.PI : 0;

      el.style.transform =
        `translate(${x}px, ${y}px) translate(-50%, -50%) ` +
        `rotate(${angle}deg) scale(${stretch}, ${squash})`;
      // the faster it goes the more the trailing edge draws out, which is the
      // difference between a stretched circle and a droplet
      el.style.borderRadius = `${50 - s * 22}% 50% 50% ${50 - s * 22}% / 50% ${50 - s * 14}% ${50 - s * 14}% 50%`;
      raf = requestAnimationFrame(loop);
    };

    const over = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.("[data-cursor]")) el.classList.add("grow");
    };
    const out = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.("[data-cursor]")) el.classList.remove("grow");
    };
    const leave = () => el.classList.add("gone");
    const enter = () => el.classList.remove("gone");

    el.style.opacity = "0";
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  return <div className="cursor" ref={ref} aria-hidden="true" />;
}
