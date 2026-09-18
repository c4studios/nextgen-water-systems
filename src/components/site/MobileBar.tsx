"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONTACT } from "@/content/plates";

/**
 * THE PHONE'S ACTION BAR.
 *
 * On a phone the two things a visitor might want are always a thumb away: call
 * the installer, or book the free test. It stays out of the way at the top of
 * the page and once the booking form itself is on screen. Through the journey
 * it stays: the caption cards sit above it (world.css).
 */
export function MobileBar() {
  const pathname = usePathname();
  const [on, setOn] = useState(false);
  const home = pathname === "/";
  const bookHref = home ? "#book" : "/water-test/";

  useEffect(() => {
    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const past = window.scrollY > vh * 0.7;
      const book = document.getElementById("book");
      const bookIn = book ? book.getBoundingClientRect().top < vh * 0.9 && book.getBoundingClientRect().bottom > 0 : false;
      const form = document.querySelector(".tform");
      const formIn = form ? form.getBoundingClientRect().top < vh && form.getBoundingClientRect().bottom > 0 : false;
      setOn(past && !bookIn && !formIn);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <div className={`mbar${on ? " is-on" : ""}`} {...({ inert: on ? undefined : "" } as Record<string, unknown>)}>
      <a className="mbar-call" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.5 3.5h3l1.6 4.4-2.2 1.4a11 11 0 0 0 6.8 6.8l1.4-2.2 4.4 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
        </svg>
        Call
      </a>
      <a className="mbar-book" href={bookHref}>
        Book a free water test
      </a>
    </div>
  );
}
