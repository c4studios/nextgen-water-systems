"use client";

import { useEffect, useRef } from "react";

/**
 * Condensation on the opening photograph's glass, that wipes clear.
 *
 * REBUILT. The first version blurred a copy of the photo and dusted white specks
 * over it, and the client's read was exactly right: it looked like cling film,
 * not a cold glass. Blur is the wrong physics. What actually happens on a cold
 * glass is REFRACTION — hundreds of droplets each acting as a tiny lens that
 * bends and inverts what is behind it — plus a scatter haze between them, plus
 * a few beads that have run and left clear trails.
 *
 * So this draws three things, in order:
 *   1. a REFRACTED copy of the photograph, displaced per-pixel by a turbulence
 *      field (SVG feTurbulence + feDisplacementMap, the same technique the
 *      liquid-glass effects use). This is what makes it read as seen-through
 *      rather than smeared.
 *   2. a scatter haze, thin, so the glass looks cold rather than painted.
 *   3. real droplets: uneven radii, each with a bright specular point up-light
 *      and a dark rim, several with run-trails behind them.
 *
 * Wiping erases along the pointer path, and it heals slowly.
 */

/** the glass in the source photograph, as fractions of its natural size */
const GLASS_BOX = { x: 0.226, y: 0.328, w: 0.152, h: 0.437 };
/** how fast condensation creeps back (alpha per frame) */
const HEAL = 0.004;
/** wipe radius as a fraction of the glass's on-screen height */
const WIPE_R = 0.24;
/** must match .opening-figure img's object-position X */
const COVER_X = 0.38;

/** the refraction filter, injected once — the whole point of the rebuild */
const FILTER_ID = "ng-frost-refract";

export function FrostedGlass({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !img || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frost: HTMLCanvasElement | null = null;
    let raf = 0;
    let glass = { x: 0, y: 0, w: 0, h: 0 };
    const pointer = { x: -1, y: -1, px: -1, py: -1, live: false };

    const coverRect = (bw: number, bh: number, iw: number, ih: number) => {
      const scale = Math.max(bw / iw, bh / ih);
      return { x: (bw - iw * scale) * COVER_X, y: (bh - ih * scale) * 0.5, w: iw * scale, h: ih * scale };
    };

    /** the tumbler's real silhouette: elliptical rim, tapered sides, foot */
    const glassPath = (g: CanvasRenderingContext2D) => {
      const { x, y, w: gw, h: gh } = glass;
      const cx = x + gw / 2;
      const rimRy = gh * 0.038;
      const rimY = y + rimRy;
      const footY = y + gh - rimRy;
      const footRx = gw * 0.415;
      g.beginPath();
      g.ellipse(cx, rimY, gw / 2, rimRy, 0, Math.PI, 0);
      g.bezierCurveTo(cx + gw / 2, rimY + gh * 0.45, cx + footRx, footY - gh * 0.35, cx + footRx, footY);
      g.ellipse(cx, footY, footRx, rimRy, 0, 0, Math.PI);
      g.bezierCurveTo(cx - footRx, footY - gh * 0.35, cx - gw / 2, rimY + gh * 0.45, cx - gw / 2, rimY);
      g.closePath();
    };

    const buildFrost = (w: number, h: number, dpr: number) => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(w * dpr));
      c.height = Math.max(1, Math.round(h * dpr));
      const g = c.getContext("2d");
      if (!g) return c;
      g.scale(dpr, dpr);
      g.save();
      glassPath(g);
      g.clip();

      const r = coverRect(w, h, img.naturalWidth, img.naturalHeight);

      // 1 — REFRACTION. The turbulence filter displaces the photograph per
      // pixel, so what shows through is bent, not smeared. A light blur on top
      // only softens the seams between displaced regions.
      g.filter = `url(#${FILTER_ID}) blur(1.1px) brightness(1.28) saturate(0.42)`;
      g.drawImage(img, r.x, r.y, r.w, r.h);
      g.filter = "none";

      // 2 — scatter haze. Thin: the glass should look cold, not painted.
      const haze = g.createLinearGradient(0, glass.y, 0, glass.y + glass.h);
      haze.addColorStop(0, "rgba(206,226,236,0.2)");
      haze.addColorStop(0.45, "rgba(214,232,240,0.3)");
      haze.addColorStop(1, "rgba(184,206,220,0.16)");
      g.fillStyle = haze;
      g.fillRect(glass.x, glass.y, glass.w, glass.h);

      // 3 — the droplets. Deterministic, so they never reshuffle on resize.
      let seed = 20260821;
      const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
      const { x, y, w: gw, h: gh } = glass;
      const unit = Math.max(gw, 40) / 260;

      // a few that have run, leaving a clear trail behind them
      for (let i = 0; i < 7; i++) {
        const dx = x + (0.12 + rnd() * 0.76) * gw;
        const dy = y + (0.1 + rnd() * 0.5) * gh;
        const len = (0.08 + rnd() * 0.26) * gh;
        const wdt = (2.2 + rnd() * 3.4) * unit;
        const trail = g.createLinearGradient(dx, dy, dx, dy + len);
        trail.addColorStop(0, "rgba(0,0,0,0.16)");
        trail.addColorStop(1, "rgba(0,0,0,0)");
        g.globalCompositeOperation = "destination-out";
        g.fillStyle = trail;
        g.fillRect(dx - wdt / 2, dy, wdt, len);
        g.globalCompositeOperation = "source-over";
      }

      // and the beads themselves
      const beads = 260;
      for (let i = 0; i < beads; i++) {
        const dx = x + rnd() * gw;
        const dy = y + rnd() * gh;
        // a real population is mostly small with a few big ones
        const t = rnd();
        const rr = (0.7 + t * t * t * 9) * unit;

        // the droplet lenses what is behind it: sample the photo from BELOW
        // and draw it inverted inside the bead. That inversion is the tell
        // that reads as a droplet rather than a dot.
        g.save();
        g.beginPath();
        g.arc(dx, dy, rr, 0, Math.PI * 2);
        g.clip();
        g.globalAlpha = 0.9;
        g.drawImage(img, r.x, r.y + rr * 3.2, r.w, r.h);
        // droplets sit on a lit glass, so lift the lensed sample
        g.globalAlpha = 0.22;
        g.fillStyle = "#dceaf2";
        g.fillRect(dx - rr, dy - rr, rr * 2, rr * 2);
        g.restore();

        // dark rim where the droplet's edge bends light away
        g.beginPath();
        g.arc(dx, dy, rr, 0, Math.PI * 2);
        g.strokeStyle = "rgba(24,32,40,0.4)";
        g.lineWidth = Math.max(0.4, rr * 0.16);
        g.stroke();

        // specular point, up-light and to the right, like the photo's window
        const sp = g.createRadialGradient(
          dx + rr * 0.34, dy - rr * 0.38, 0,
          dx + rr * 0.34, dy - rr * 0.38, rr * 0.55,
        );
        sp.addColorStop(0, "rgba(255,255,255,1)");
        sp.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = sp;
        g.beginPath();
        g.arc(dx, dy, rr, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();
      return c;
    };

    const layout = () => {
      const box = wrap.getBoundingClientRect();
      if (!box.width || !box.height || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      canvas.style.width = box.width + "px";
      canvas.style.height = box.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = coverRect(box.width, box.height, img.naturalWidth, img.naturalHeight);
      glass = {
        x: r.x + GLASS_BOX.x * r.w,
        y: r.y + GLASS_BOX.y * r.h,
        w: GLASS_BOX.w * r.w,
        h: GLASS_BOX.h * r.h,
      };
      frost = buildFrost(box.width, box.height, dpr);
      ctx.clearRect(0, 0, box.width, box.height);
      ctx.drawImage(frost, 0, 0, box.width, box.height);
    };

    const tick = () => {
      raf = 0;
      if (!frost) return;
      const box = wrap.getBoundingClientRect();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = HEAL;
      ctx.drawImage(frost, 0, 0, box.width, box.height);
      ctx.globalAlpha = 1;

      if (pointer.live) {
        const rad = Math.max(16, glass.h * WIPE_R);
        ctx.globalCompositeOperation = "destination-out";
        const dist = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
        const steps = Math.max(1, Math.round(dist / (rad * 0.35)));
        for (let i = 0; i <= steps; i++) {
          const t = steps ? i / steps : 1;
          const cx = pointer.px + (pointer.x - pointer.px) * t;
          const cy = pointer.py + (pointer.y - pointer.py) * t;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          grad.addColorStop(0, "rgba(0,0,0,0.62)");
          grad.addColorStop(0.5, "rgba(0,0,0,0.3)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
        }
        ctx.globalCompositeOperation = "source-over";
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const box = wrap.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      if (pointer.x < 0) {
        pointer.px = x;
        pointer.py = y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.live = true;
      start();
    };
    const onLeave = () => {
      pointer.live = false;
      pointer.x = -1;
      pointer.y = -1;
      start();
    };

    const onLoad = () => {
      layout();
      start();
    };
    if (img.complete && img.naturalWidth) onLoad();
    else img.addEventListener("load", onLoad, { once: true });

    const ro = new ResizeObserver(() => {
      layout();
      start();
    });
    ro.observe(wrap);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="frosted" ref={wrapRef}>
      {/* The refraction field. baseFrequency sets droplet-scale detail; scale is
          how far the photograph gets bent. Kept moderate — past about 30 the
          image tears rather than refracts. */}
      <svg className="frosted-defs" aria-hidden="true" focusable="false">
        <filter id={FILTER_ID} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.055 0.048" numOctaves="3" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="17" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <img ref={imgRef} src={src} alt={alt} decoding="async" />
      <canvas ref={canvasRef} className="frosted-veil" aria-hidden="true" />
    </div>
  );
}

export default FrostedGlass;
