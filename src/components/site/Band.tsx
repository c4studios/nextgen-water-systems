import { asset } from "@/lib/asset";

/**
 * A full-bleed photographic band with a drawing-note caption.
 *
 * The site had exactly one photograph on it, which is why it read as a diagram
 * rather than as a place. These carry the PROBLEM — scale, spotting, the film
 * on glassware, where the machine actually goes — and never a result. Nothing
 * here is presented as a customer's house or as a before-and-after, because
 * neither of those exists yet.
 */
export function Band({
  src,
  alt,
  tag,
  caption,
}: {
  src: string;
  alt: string;
  tag: string;
  caption: string;
}) {
  return (
    <section className="band">
      <figure className="band-figure">
        <img src={asset(src)} alt={alt} loading="lazy" decoding="async" />
        <figcaption className="band-cap">
          <b>{tag}</b>
          <span>{caption}</span>
        </figcaption>
      </figure>
    </section>
  );
}
