# Where every raster on the site comes from

None of the images on this site is a photograph of a Next Gen installation. Each one is captioned on the page it appears on where that matters, and this file is the record.

| File | What it is | Origin | Date |
|---|---|---|---|
| `cover-still.jpg` | The closed Next Gen cover, the hero's poster and the no-WebGL image | Render of the site's own procedural model (`src/components/machine/`) from the dev viewer at `/dev/machine/?view=hero&yaw=-0.3`, resized to 1200×1400 | 17 Sep 2026 |
| `../og.jpg` | The 1200×630 share image | Composited in HTML on the running site from `cover-still.jpg`, the site's wordmark and live type, then screenshotted (no generated text) | 17 Sep 2026 |
| `stage-1.jpg`, `stage-2.jpg`, `stage-3.jpg` | Each housing cut open in section, for the reduced-motion story | Renders of the same model from the dev viewer (`?view=s1|s2|s3&cut=62&flow=1&open=1`) | 17 Sep 2026 |
| `system-render.jpg` | The system with its cover off, three-quarter view, for the "What you get" panel | Render of the same model from the dev viewer (`?view=iso&open=1&pos=-74,60,128&tgt=1,33,0&fov=34`) | 17 Sep 2026 |
| `../brand/ng-logo.jpg` | An older brand raster | Added in commit d323b69 (26 Jun 2026); source not recorded; not referenced by the current pages | 26 Jun 2026 |
| `system-covered.jpg` | The system with its cover on, beside the client's concept in the cover band | Render of the same model from the dev viewer (`?pos=-88,60,152&tgt=2,37,0&fov=32&post=1`) | 18 Sep 2026 |
| `nextgen-cover-concept.jpg` | The cover on a wall, with a plant | Aaron's brand-concept mockup ("Next gen filter.jpeg"), forwarded in his 14 Sep 2026 email; a visualisation made by his designer, not a photograph of an installed system; the page says so under it | received 14 Sep 2026 |
| `fitting.jpg`, `kitchen-tap.jpg`, `cartridges.jpg`, `installed.jpg`, `kettle-scale.jpg`, `water-test.jpg` | The interior-page pictures (a plumber's hands on a fitting, a kitchen tap, three cartridges, an installed unit, a scaled kettle element, a water test on a bench) | Generated visualisations added in commit d792c29 (21 Aug 2026); the generator was not recorded at the time. Every page that shows one captions it "Visualisation, not a photograph" | 21 Aug 2026 |
| `kitchen-glass.jpg` / `.webp` | A glass of water on a kitchen bench | Generated visualisation added in commit 52b6c4e (15 Aug 2026); generator not recorded | 15 Aug 2026 |
| `machine-rest.jpg` / `.webp` | The earlier machine at rest | Render of the previous (retired) drawing-set scene, commit 8770964; no longer referenced by a page | 15 Aug 2026 |

Product truth for the model itself: the supplier's datasheet for the FHWR-3S1-20 (Water Analytics Australia, version 1.1, 2024, `docs/datasheet-FHWR-3S1-20-v1.1.pdf`) and the supplier photographs Aaron forwarded on 15 Sep 2026.

Each file also carries its origin embedded in the image itself (a JPEG comment, or a `.json` sidecar for WebP), readable with the impeccable skill's `embed-prompt.mjs --read`.

On 18 Sep 2026 the look-dev was rebuilt on the finish review's directive, so every render cut from the model was re-rendered through the page's own lens chain: `cover-still.jpg`, `stage-1.jpg`, `stage-2.jpg`, `stage-3.jpg`, `system-render.jpg`, the new `system-covered.jpg`, and `og.jpg` on top of the new still. `installed.jpg` came off the page in the same round: the generated visualisation showed three chrome bowls on an uncovered unit, which is not the product sold. It is kept here, unreferenced, until the client says to delete it. The covered render moved out of the path in the same round: a studio product shot between three daylight scenes broke the row's register, so the path's quote step uses kitchen-tap.jpg and the render sits beside the client's concept in the cover band, where the subject is the cover itself.
