import { asset } from "@/lib/asset";

/**
 * THE POSTER: what the hero shows until the live scene is up, and the whole
 * picture for anyone without WebGL or with reduced motion.
 *
 * Cut from the live scene itself, once per layout (C4-main/_ngposter.mjs): at
 * the phone's and the desktop's own viewport, the settled frame inside the
 * hero's anchor box. The live camera fits the cover to 82% of the box height
 * at any size, and so does each poster, so poster and live frame are the same
 * picture and the handover (a short fade, sections.css) cannot show two
 * covers or a jump in size. The earlier poster was rendered with a closer
 * camera and drew the cover about 8% larger in stronger perspective; the
 * finish review of 18 Sep 2026 caught the two overlapping on a phone at load.
 */
export function HeroPoster() {
  return (
    <picture className="hero-poster-pic">
      <source media="(max-width: 900px)" srcSet={asset("/photos/cover-poster-phone.jpg")} width={780} height={572} />
      <img
        className="hero-still hero-poster"
        src={asset("/photos/cover-poster-desktop.jpg")}
        alt=""
        width={1440}
        height={1188}
        draggable={false}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
