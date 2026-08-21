"use client";

import { useEffect, useRef } from "react";

/**
 * The easter egg on the opening photograph.
 *
 * The glass of water sits under a layer of condensation. Move a pointer across
 * it and it wipes clear, the way you would wipe a cold glass, revealing the
 * water underneath. Nothing on the page says to do it. Either you find it, or
 * the photograph is just a photograph.
 *
 * Built as one canvas rather than the grid-of-hover-areas approach the snippet
 * used: a grid puts 900 nodes in the DOM, can only toggle whole cells, cannot
 * be clipped to the glass alone, and cannot heal. Here the frost is painted
 * once, erased with destination-out along the pointer path, and re-painted at
 * very low alpha every frame so the condensation slowly comes back.
 *
 * The frost is CLIPPED TO THE GLASS. GLASS_BOX is in fractions of the natural
 * image, and the cover-fit transform is solved on every resize, so the clip
 * tracks the crop at any viewport.
 */

/** the glass in the source photograph, as fractions of its natural size */
const GLASS_BOX = { x: 0.226, y: 0.328, w: 0.152, h: 0.437 };

/** how fast the condensation creeps back (alpha added per frame) */
const HEAL = 0.0045;
/** wipe radius, as a fraction of the glass's on-screen height */
const WIPE_R = 0.26;
/** object-position X used by .opening-figure img, so the clip lands on the glass */
const COVER_X = 0.38;

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

    /** where a cover-fitted image actually lands inside its box */
    const coverRect = (bw: number, bh: number, iw: number, ih: number) => {
      const scale = Math.max(bw / iw, bh / ih);
      const w = iw * scale;
      const h = ih * scale;
      return { x: (bw - w) * COVER_X, y: (bh - h) * 0.5, w, h };
    };

    /** paint the condensation layer once, clipped to the glass */
    const buildFrost = (w: number, h: number, dpr: number) => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(w * dpr));
      c.height = Math.max(1, Math.round(h * dpr));
      const g = c.getContext("2d");
      if (!g) return c;
      g.scale(dpr, dpr);
      g.save();

      // The tumbler's real silhouette, not a rounded rectangle over it: an
      // elliptical rim (we are looking slightly down into the glass), sides
      // tapering in toward the base, an elliptical foot. A rectangle of frost
      // reads as a rendering bug; this reads as condensation on glass.
      const { x, y, w: gw, h: gh } = glass;
      const cx = x + gw / 2;
      const rimRy = gh * 0.038;
      const rimY = y + rimRy;
      const footY = y + gh - rimRy;
      const footRx = gw * 0.415;
      g.beginPath();
      g.ellipse(cx, rimY, gw / 2, rimRy, 0, Math.PI, 0); // back of the rim
      g.bezierCurveTo(
        cx + gw / 2, rimY + gh * 0.45,
        cx + footRx, footY - gh * 0.35,
        cx + footRx, footY,
      );
      g.ellipse(cx, footY, footRx, rimRy, 0, 0, Math.PI); // the foot
      g.bezierCurveTo(
        cx - footRx, footY - gh * 0.35,
        cx - gw / 2, rimY + gh * 0.45,
        cx - gw / 2, rimY,
      );
      g.closePath();
      g.clip();

      // blurred, lifted copy of the photograph underneath = condensation
      g.filter = "blur(6px) brightness(1.5) saturate(0.25) contrast(0.8)";
      const r = coverRect(w, h, img.naturalWidth, img.naturalHeight);
      g.drawImage(img, r.x, r.y, r.w, r.h);
      g.filter = "none";

      // a cool film over it, densest across the middle of the glass
      const wash = g.createLinearGradient(x, y, x, y + gh);
      wash.addColorStop(0, "rgba(214,232,240,0.34)");
      wash.addColorStop(0.5, "rgba(214,232,240,0.5)");
      wash.addColorStop(1, "rgba(190,212,224,0.3)");
      g.fillStyle = wash;
      g.fillRect(x, y, gw, gh);

      // droplet speckle, deterministic so it never shimmers between resizes
      let seed = 7;
      const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
      for (let i = 0; i < 190; i++) {
        const dx = x + rnd() * gw;
        const dy = y + rnd() * gh;
        const rr = 0.6 + rnd() * 2.4;
        g.beginPath();
        g.arc(dx, dy, rr, 0, Math.PI * 2);
        g.fillStyle = "rgba(255,255,255," + (0.05 + rnd() * 0.16).toFixed(3) + ")";
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
        const rad = Math.max(18, glass.h * WIPE_R);
        ctx.globalCompositeOperation = "destination-out";
        // step along the path, so a fast drag clears a stroke rather than dots
        const dist = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
        const steps = Math.max(1, Math.round(dist / (rad * 0.4)));
        for (let i = 0; i <= steps; i++) {
          const t = steps ? i / steps : 1;
          const cx = pointer.px + (pointer.x - pointer.px) * t;
          const cy = pointer.py + (pointer.y - pointer.py) * t;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          grad.addColorStop(0, "rgba(0,0,0,0.5)");
          grad.addColorStop(0.55, "rgba(0,0,0,0.28)");
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
      <img ref={imgRef} src={src} alt={alt} decoding="async" />
      <canvas ref={canvasRef} className="frosted-veil" aria-hidden="true" />
    </div>
  );
}

export default FrostedGlass;
