import { STORY_BEATS } from "@/content/journeyStory";
import { asset } from "@/lib/asset";

/** the three sections as stills, rendered from the same model (public/photos/PROVENANCE.md) */
const STAGE_STILL: Record<string, { n: number; alt: string }> = {
  s1: { n: 1, alt: "The first housing cut open: the three-layer sediment cartridge, coarse on the outside and fine at the core, with water passing through it" },
  s2: { n: 2, alt: "The second housing cut open: the copper-zinc granules and the bed of coconut carbon behind them" },
  s3: { n: 3, alt: "The third housing cut open: the limescale-reduction media ahead of a second bed of coconut carbon" },
};

/**
 * Reduced-motion fallback (Slice 5). The whole sales story rides the scroll
 * as windowed HUD beats — which are hidden under prefers-reduced-motion, and
 * the 3D journey doesn't run there either. Without this, a reduced-motion
 * visitor would get the static plate + booking tail and none of the story.
 *
 * This renders the same STORY_BEATS as a plain, readable document, with a still
 * of each stage cut open where the scroll would have opened it live. It is
 * `display:none` for everyone EXCEPT under prefers-reduced-motion (see the
 * media query in globals.css, which also collapses the pinned journey so the
 * static plate shows once rather than for 1050svh of dead scroll).
 */
export function StaticStory() {
  const beats = STORY_BEATS.filter((b) => b.id !== "cover" && b.id !== "handoff");
  return (
    <section className="static-story" aria-label="How the system works">
      <div className="ss-inner">
        <p className="ss-lead">
          Three housings at the mains, plumbed in series behind a clip-on cover. Here is what each one does to your water.
        </p>
        {beats.map((b) => (
          <article key={b.id} className="ss-beat">
            <h2 className="ss-h">{b.h}</h2>
            {STAGE_STILL[b.id] && (
              <img
                className="ss-img"
                src={asset(`/photos/stage-${STAGE_STILL[b.id].n}.jpg`)}
                alt={STAGE_STILL[b.id].alt}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
              />
            )}
            <p className="ss-body">{b.body}</p>
            {b.rows && (
              <dl className="ss-rows">
                {b.rows.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {b.stat && <span className="ss-stat">{b.stat}</span>}
          </article>
        ))}
      </div>
    </section>
  );
}
