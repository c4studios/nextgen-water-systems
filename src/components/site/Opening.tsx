import Image from "next/image";
import { asset } from "@/lib/asset";

/**
 * Act 0 — the outcome.
 *
 * The site used to open straight into the pinned 3D journey, which meant the
 * first thing a homeowner met was the machine. PRODUCT.md settles that the
 * other way round: lead with the result, demote the engineering to proof. This
 * is the act that goes in front, and the journey below is now what backs it up.
 *
 * Composition is a hard split rather than type-over-photo. Measuring the
 * photograph, the usable areas are the bright window (top left) and a busy
 * mid-right of dish rack and kettle — there is no large field where type would
 * hold at 4.5:1 without dropping a scrim over it, and a scrim is exactly what
 * makes a photo look like a template. So the type gets a clean void field and
 * the photograph keeps its own half, intact.
 */
export function Opening() {
  return (
    <section className="opening" aria-labelledby="opening-h">
      <div className="opening-copy">
        <h1 id="opening-h" className="opening-h">
          Water that tastes
          <br />
          of nothing.
        </h1>

        <p className="opening-body">
          Perth scheme water arrives safe. It also arrives tasting of chlorine, and it leaves
          scale on your kettle, your glassware and the shower screen. One system at the mains
          changes that at every tap in the house.
        </p>

        <div className="opening-act">
          <a className="opening-cta" href="#plate-cta">
            Book a free water test
          </a>
          <p className="opening-installer">
            Installed by Aqua-Safe, licensed Perth plumbers.
          </p>
        </div>
      </div>

      <figure className="opening-figure">
        <Image
          src={asset("/photos/kitchen-glass.jpg")}
          alt="A glass of tap water on a scratched steel benchtop in a Perth kitchen, late afternoon"
          width={1920}
          height={1072}
          priority
          sizes="(max-width: 900px) 100vw, 52vw"
        />
      </figure>

    </section>
  );
}
