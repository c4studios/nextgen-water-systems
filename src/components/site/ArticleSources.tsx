import Link from "next/link";
import { ARTICLES } from "@/content/articles";

/** The foot of an article: every source it was written from, linked, then the
 *  other reads. Sources are the point of these pages, so they are listed in
 *  full rather than tucked into a tooltip. */
export function ArticleSources({ sources, current }: { sources: { name: string; url: string; note?: string }[]; current: string }) {
  const others = ARTICLES.filter((a) => a.slug !== current);
  return (
    <div className="art-foot">
      <section className="art-sources" aria-labelledby="art-sources-h">
        <h2 id="art-sources-h">Sources</h2>
        <ol>
          {sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener">
                {s.name}
              </a>
              {s.note && <span>{s.note}</span>}
            </li>
          ))}
        </ol>
      </section>
      {others.length > 0 && (
        <nav className="art-more" aria-label="More to read">
          <h2>More to read</h2>
          <ul>
            {others.map((a) => (
              <li key={a.slug}>
                <Link href={a.href}>
                  {a.title}
                  <i aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
