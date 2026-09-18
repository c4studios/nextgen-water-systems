---
name: Next Gen Water Systems
description: A white launch page with one machine live in a photographic studio behind it. Charcoal ink, one blue for the action, Satoshi headings over Hanken sentences, and every fact in a hairline row.
colors:
  ground: "#ffffff"
  panel: "#f6f7f7"
  panel-2: "#eaecee"
  studio: "#f2f3f3"
  ink: "#17191c"
  ink-2: "#3e4348"
  ink-3: "#676e75"
  hairline: "rgba(23, 25, 28, 0.12)"
  accent: "#0b62b8"
  deep: "#094a8a"
  water: "#2ea9df"
  redline: "#b8412c"
  set-pool: "#c6c6c4"
  set-corner: "#6c6c6a"
typography:
  display:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(42px, 5.4vw, 80px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(30px, 4.2vw, 50px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  beat:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(28px, 3.3vw, 46px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(16px, 1.5vw, 18px)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  row:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  caption:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0"
  action:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0"
rounded:
  square: "0"
  mark: "2px"
  tag: "4px"
  card: "6px"
  plate: "8px"
  chrome: "10px"
  tile: "12px"
  panel: "16px"
  pill: "999px"
  disc: "50%"
spacing:
  inline: "8px"
  stack: "12px"
  field: "16px"
  row: "20px"
  block: "28px"
  head-gap: "48px"
  column: "clamp(24px, 4vw, 56px)"
  step: "clamp(32px, 5vh, 56px)"
  gutter: "clamp(20px, 5vw, 40px)"
  section: "clamp(84px, 12vh, 150px)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.ground}"
  button-nav:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
    size: "14px"
  button-nav-hover:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.ground}"
  button-book-phone:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    height: "46px"
  button-call-phone:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "46px"
    size: "15px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "40px"
    size: "14px"
  button-quiet-hover:
    backgroundColor: "rgba(23, 25, 28, 0.05)"
    textColor: "{colors.ink}"
  link-more:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    size: "15.5px"
  link-more-hover:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
  tab-stage:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "18px 20px 19px"
  tab-stage-on:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  tab-booking:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "38px"
    size: "14.5px"
  tab-booking-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  mark-step:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.disc}"
    size: "36px"
  mark-step-held:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  dot-path:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.disc}"
    size: "34px"
  dot-path-lit:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  note-figure:
    backgroundColor: "rgba(255, 255, 255, 0.96)"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "14px 16px 15px"
  tag-callout:
    backgroundColor: "rgba(255, 255, 255, 0.95)"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "7px 11px 8px"
    size: "14px"
  stat-tag:
    backgroundColor: "rgba(255, 255, 255, 0.75)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.tag}"
    padding: "6px 11px"
  hint-pill:
    backgroundColor: "rgba(255, 255, 255, 0.86)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    size: "12.5px"
  card-package:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "12px 12px 14px"
  panel-system:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "26px 30px 30px"
  frame-figure:
    backgroundColor: "#d3d7da"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    width: "100%"
  chip-taste:
    backgroundColor: "rgba(246, 247, 247, 0.72)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "9px 13px 9px 11px"
    size: "13.5px"
  chip-taste-on:
    backgroundColor: "rgba(246, 247, 247, 0.72)"
    textColor: "{colors.ink}"
  chip-taste-live:
    backgroundColor: "rgba(46, 169, 223, 0.12)"
    textColor: "{colors.ink}"
  input-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "12px 13px"
    size: "16px"
  input-field-focus:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  placeholder-mark:
    backgroundColor: "rgba(184, 65, 44, 0.1)"
    textColor: "{colors.redline}"
    rounded: "{rounded.mark}"
    padding: "1px 6px"
  closing-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(28px, 4vw, 44px)"
---

# Design System: Next Gen Water Systems

## Overview

**Creative North Star: "The White Studio"**

A product-photography studio with the page as its backdrop. The page is white. One WebGL scene is fixed behind the whole document, and the page opens two windows onto it: the hero, where the set is driven to white so the machine stands on the page itself, and the journey, where the set becomes a lit neutral-grey seamless backdrop with a pool of light in it. Every other section is an opaque sheet over that scene. The type is the charcoal of the cover's own lettering. There is one blue and it is spent on the action.

The register is premium restraint (PRODUCT.md): closer to an appliance launch than to a plumbing site. Density is low at the top of the page and rises as a visitor gets closer to buying. The hero and the journey give one idea a whole screen; the commercial half of the page (the stage explorer, the numbered path, the package panels, the questions, the booking tabs) is denser, because by then the visitor is comparing rather than being introduced. Motion belongs to the machine. The cover turns under a drag and lifts under a tap; each housing opens in section on the scroll; the chrome around it changes fill and nothing else.

Confirmed rejections, from the direction contract and PRODUCT.md: the blue water-splash hero, the three feature cards, the stats band and the testimonial carousel of the category; the drawing-set furniture of the world this page replaced (sheet strips, sheet numbers, registration ticks, tracked-out drafting labels); and the wellness aesthetic (sage, blush, rounded friendly type, droplets as decoration). Rules carried over from the previous world in changed form are marked below.

**Key Characteristics:**
- White page, a lit grey set behind two windows, charcoal ink, one blue.
- The product is live in the first viewport and is the only picture that matters.
- Satoshi Medium for the big lines; Hanken for sentences and for every label, in sentence case.
- Hairline rows for facts; a rounded panel only where a picture and its list are one object.
- Flat paper: a shadow only where something floats over the page or over the set.
- A visible red placeholder wherever a figure has no source.

## Colors

A near-monochrome of white, pale grey and charcoal, with one blue for the action and a lighter blue reserved for water. The only chromatic surface on the page is the machine itself.

### Primary
- **Action Blue** (#0b62b8, `accent`): the one filled call to action on each surface (the hero pill, the nav pill, the phone bar's book button, the booking submit, the interior sheets' button); inline links in prose; the stage numbers in the how-it-works list; the journey's cue links and stage marker; the numbered steps' counters; the caret in a form field; the hover colour of quiet links and of a question's toggle; every focus ring that is not on a filled button. About 6.1:1 on white.
- **Deep Blue** (#094a8a, `deep`): the action's hover and focus fill. It has no other job.

### Secondary
- **Water** (#2ea9df, `water`): water itself. Text selection at 28% alpha, the live dot in the hint pill, the fill under a chip that has just been ticked, the journey heading forming out of water. It is 2.7:1 on white and is never used for type.

### Tertiary
- **Redline** (#b8412c, `redline`): the honesty colour. The `[PLACEHOLDER]` mark on the specification, the form's error line, the "Request logged" stamp. Never decoration, never a heading.

### Neutral
- **Page White** (#ffffff, `ground`): the page, and the ground of the loud sections (the kettle, the stage explorer, the packages). Painted on `html` rather than `body`, because the fixed scene at z-index -1 sits between the two in paint order and a body background would cover it. Measured at #ffffff, and the hero's own WebGL set measures #ffffff with it.
- **Paper** (#f6f7f7, `panel`): the ground of the quiet sections that alternate with white (the path, the questions, the specification), the spec table, form fields, the footer, the booking tab track, the system panel, the phone menu. The value is the token in world.css, and a capture of the band reads #f6f8f7: one level of green, which is the screenshot pipeline's colour conversion rather than a second grey (the action blue reads #0c62b9 for #0b62b8 in the same frame). The alternation is what gives a ten-screen page a rhythm without a new colour.
- **Recessed Paper** (#eaecee, `panel-2`): wells and pressed surfaces, and the ground a path photograph sits on before it loads. Rare.
- **Pre-canvas Grey** (#f2f3f3, `studio`): the CSS ground of the fixed stage layer, painted under the canvas and visible only while the canvas is faded out. It is a fallback, not the studio; see the note under Set Grey.
- **Set Grey** (#c6c6c4 in the pool of light to #6c6c6a at the frame corners, `set-pool` / `set-corner`): the journey's seamless backdrop, painted in screen space by a shader in `Studio.tsx` so no horizon ever swings through the shot. Measured from real pixels on 18 Sep 2026 and neutral by measurement: red equals green, blue two levels under. The scene's own source values are a linear ramp of #c8c8c6, #a3a3a1 and #6f6f6e with the clear colour and the fog at #a3a3a1; the numbers above are what the Neutral tone mapper puts on screen, and they are the ones to design against.
- **Cover Ink** (#17191c, `ink`): headings, journey body copy, values in rows, the ticked state of a chip, the filled state of a stage tab's edge and of a path dot, the booking tab's selected fill, the focus ring on a filled button, the top rule of a data table, every callout leader and its dot ring. Sampled from the cover's lettering.
- **Second Ink** (#3e4348, `ink-2`): leads, section prose, row copy, the quiet link and the quiet button at rest. About 10:1 on white.
- **Third Ink** (#676e75, `ink-3`): labels, captions, the note beside a figure, the stage number inside a tab title, a path dot before it lights, field placeholders. 5.2:1 on white.
- **Hairline** (rgba(23, 25, 28, 0.12), `hairline`): every rule, border and row divider, and the one-pixel ring that stands in for a border on a rounded panel.

### Named Rules
**The One Blue Rule.** Action Blue is spent on the action and on what leads to it: one filled pill per surface, inline links, the counters that index a sequence. It never tints a background, a heading or a decoration. Two filled blue pills on one screen means one of them is wrong. The blue is deliberately singular: there is no blue-100, no blue border token, no second accent.

**The Water Is Never Text Rule.** Carried over. Water marks water: a selection, a live dot, the fill under a live chip, a heading forming out of water. At 2.7:1 on white it is never a word.

**The Set Is Lit, The Page Is Not Rule.** The grey behind the machine is a gradient because it is a lit backdrop, and its falloff is produced by a shader, not by a CSS gradient. A gradient on the page itself is allowed in exactly two places, and both simulate a physical material rather than decorate: the nav's frosted pane (a 180-degree wash over a 16px backdrop blur) and the water-bead cursor (three radial gradients, a rim and one specular). No flat surface, no button and no heading carries a gradient fill, and no type sits on one except over the set, where it is placed on the pool of light and measured.

**The Machine Keeps Its Own Colours Rule.** The palette above is the page's. The machine is a manufactured object and carries the colours it is made in: a blue valve handle (#1f5fb0), blue cartridge caps (#2c48c9), a red gauge needle (#c8281e), brass, copper, stainless. Those live in `materials.ts`, they are not tokens, and they are not counted against the one-blue rule. Do not "correct" them toward the palette.

**The Red Means Unsourced Rule.** A figure without a source is set as a red dashed `[PLACEHOLDER]` mark. It is never replaced with a plausible number and never softened to grey.

**The Contrast Floor Rule.** Every measured text-on-background pair on the shipping surface clears 4.5:1, and the floor is the journey's body copy over the set at 5.10:1, with the stage chips at 6.34:1 or better and the footer credit at 9.3:1. Copy over the set takes full Cover Ink, never Second Ink, because Second Ink falls under the floor toward the frame corners.

## Typography

**Display Font:** Satoshi (400, 500, 700; self-hosted, with ui-sans-serif, system-ui fallback)
**Body Font:** Hanken Grotesk (variable 400 to 600; self-hosted, same fallback)
**Lockup Font:** Michroma, for the NEXT GEN line of the wordmark only (nav and footer). The cover's 3D lettering is the same face baked to outlines in `lockupPaths.ts`, not a web font.

**Character:** A geometric grotesque doing the talking and a humanist grotesque doing the reading. Satoshi Medium, tight, at very large sizes, then Hanken at ordinary sizes with generous leading. Nothing on a text surface is set in a monospace or a drafting face, and no label is tracked out in capitals.

### Hierarchy
- **Display** (500, clamp(42px, 5.4vw, 80px), 1, -0.035em): the hero line. Balanced wrap. The booking headline is the same weight at clamp(40px, 6.4vw, 84px) / 0.98, and a sheet's title runs clamp(34px, 6.4vw, 62px). On phones the hero drops to clamp(31px, 8.6vw, 38px).
- **Headline** (500, clamp(30px, 4.2vw, 50px), 1.04, -0.03em): every section heading, on the home page and the interior pages alike, usually two lines with a hard break. One ramp step for all of them; the sections do not compete on size.
- **Beat** (700, clamp(28px, 3.3vw, 46px), 1.04, -0.02em): the journey's copy beats, each word rising out of its own overflow-clipped line. The one bold headline tier. Phones: clamp(22px, 6vw, 27px).
- **Title** (700, 19px, -0.01em): a stage tab's name, a path step's title. Siblings on the same tier: a package title at 21px / -0.015em, a figure note's heading at 17px / -0.01em, a question at 19px in 600 (it is a control, so it takes the lighter weight), the footer index titles at 16.5px.
- **Lead** (400, clamp(16px, 1.5vw, 18px), 1.6): the one sentence under a headline, in Second Ink, on a 42 to 44ch measure. The hero lead runs clamp(17px, 1.5vw, 19px) / 1.6 on 42ch.
- **Body** (400, 16.5px, 1.65): a journey beat's paragraph (1.6, 40ch, full Cover Ink), a question's answer (1.65, 62ch), a stage panel's "what happens" at 17px / 1.65 on 62ch, prose on the interior sheets at 1.72 on 66ch.
- **Row** (400, 15.5px, 1.5): the value side of a hairline row, a package list item and a path step's paragraph at 15px, a figure note's body and a stage tab's one-line summary at 14.5px. This is the tier that carries the commercial half of the page.
- **Label** (500, 13.5px, sentence case): caption heads and the key side of a hairline row, in Third Ink. Tracking is 0, or 0.02em on a table key and a taste chip; the journey rail and the stage marker are the one exception at 0.04em, still in sentence case.
- **Caption** (400, 13px): breadcrumbs, the note under a generated photograph, form field labels, the caption beside a figure, the note beside an action, the nav hint. Third Ink.
- **Action** (Satoshi 600, 15.5px, 0 tracking): the pill's label, including the phone bar's. Satoshi ships in 400, 500 and 700, so 600 resolves to the Bold file. The nav pill is 14px and the phone bar's call button 15px.

### Named Rules
**The Two Faces Rule.** Satoshi sets headings, titles and the action. Hanken sets everything else, every label and every number included. No third face appears on a text surface. Enforcement is by override rather than by absence: the build re-points `--font-mono` and `--font-draft` at Hanken, and names Hanken directly with `!important` on the label selectors the retired stylesheets used to set in a drafting face.

**The Sentence Case Rule.** Labels and keys are sentence case. No uppercase, no tracked small caps, no monospace for keys or numbers. Tabular figures are the only numeric treatment (`font-variant-numeric: tabular-nums` on a stage number and on a row value).

**The Medium Weight Rule.** The bigger the line, the lighter the weight. Display and headline sit at 500 with tight tracking; 700 belongs to the title tier and to the journey beats; 600 to the action and to a control that reads as a heading.

**The Counter Is Not A Kicker Rule.** Numbers that index the product are allowed: three stages, four steps in the path, three marks on the kettle photograph. They sit inside the thing they number (a tab's title, a step's dot, a mark on a picture) and count plainly, 1 2 3, with no leading zero. A number floating above a section as a `01` marker is furniture and is not used.

## Layout

The page is a stack of full-width sections over one fixed scene. The scene (`.stage-fixed`) is `position: fixed; inset: 0; z-index: -1`; the hero and the journey are transparent so it shows through; every other section paints Page White or Paper. Nothing else may be transparent.

**The first viewport** (above 900px) is a two-column grid, `minmax(0, 10fr) minmax(0, 10fr)`, at `min-height: 100svh`. The copy sits in the left column, vertically centred, on a 44rem block with `clamp(120px, 16vh, 180px)` above it and `clamp(22px, 6vw, 96px)` of left gutter. The right column is the machine's anchor: a box at `min-height: 66svh` that the scene fits the closed cover into every frame (`Opening.tsx` writes the box's centre and size into `HERO`, and the set's pool of light follows it). A hint pill sits at the bottom of that box. The installer proof strip spans both columns in the second grid row under a hairline. On phones the grid is one column: copy (84px top padding), then the machine at `min-height: 42svh`, then the strip.

**The journey** is a pinned section of `1050svh` (`620svh` on phones) with a sticky `100svh` frame. Copy beats are absolute, `max-width: 430px`, at `left`/`right: clamp(24px, 6vw, 96px)`, the left beat centred and the right beat at 44% so the rail's open list never reaches it; the camera steps the machine aside on wide frames so the copy sits on clean set with no halo or scrim. Screen-space callouts live in the margin: a dot on the part, a 64px hairline leader, a paper tag at 74px, each anchored to a real point on the model in centimetres and windowed on the journey scalar. Below 900px every beat speaks from a paper card at the base of the screen, above the phone action bar: `width: calc(100vw - 28px)`, `max-width: 440px`, `bottom: 84px + safe-area`, 6px corners, hairline, one soft shadow, and the callouts are dropped because a phone has no margin. In landscape on a short screen (`max-height: 500px`) the card stands beside the machine at `min(46vw, 400px)`.

**Sections** run `clamp(84px, 12vh, 150px)` top and bottom (`--sec-y`; the kettle closes at 0.7 of that, and the specification, concept and installer sections carry a literal `clamp(72px, 12vh, 150px)`) and `clamp(20px, 5vw, 40px)` inline (`--gutter`). The content width is 1240px (`--maxw`); the stages section reads on 980px; the booking tail and the interior sheets read on 760px. A section head is a 7/5 grid, heading left and lead right, bottom-aligned, with the body `clamp(32px, 5vh, 56px)` below it. Two-column bodies are 4/8 (the stage explorer), 5/7 (the questions, the specification), 7/5 (the packages, the installer) or four equal columns (the path). Every one of them collapses to a single column at 900px.

**Sticky columns.** Three sections park a column under the nav: the kettle's photographic plate at 86px, the stage explorer's tab list at 104px, the questions' heading block at 110px. The kettle plate is followed by a 70svh runway of its own so the sticky release happens inside the section rather than over the next one.

**Rhythm.** Facts are hairline-separated rows in a definition list on a 12 to 20px vertical step: the spec table, the stage facts (`minmax(0, 170px)` key column), the installer facts, a package list (9px rows), the footer index. Inline gaps run 8, 12, 14, 16, 18, 20 and 28px; a section head gaps 24px by 48px; a two-column body gaps `clamp(24px, 4vw, 56px)`. Sizes are `clamp()` throughout; there is no spacing scale beyond the observed steps.

**Nav clearance.** `html` carries `scroll-padding-top: 96px` so an anchor jump and the browser's own scroll to a focused control both stop clear of the fixed nav, and below 900px it also carries `scroll-padding-bottom: calc(86px + safe-area)` for the phone action bar. The callout driver fades any tag whose paper would land under the nav pill.

**Breakpoints.** 1500px moves the journey rail up to clear the stage marker. 1180px drops the digits of the nav's phone number and keeps its glyph. 900px is the cut: the journey plays a shorter timeline for a narrow camera, every multi-column grid stacks, the beats become cards, the callouts and the kettle's hotspots go and a tappable key list replaces them, and the phone action bar appears. 900px with `max-height: 500px` is the landscape case. 860px hides the nav links behind the burger and unsticks the kettle plate. 640px shrinks the compact lockup to 15px and left-aligns the taste question.

### Named Rules
**The One Scene Rule.** The machine is one WebGL scene fixed behind the page. The hero and the journey are windows onto it and paint nothing; every other section is opaque, and an opaque section taller than a screen sits between the two windows so the scene changes hands unseen. A new section that lets the set show through is a bug.

**The Alternating Ground Rule.** Sections alternate Page White and Paper down the page. White carries the sections with a picture or a live object in them; Paper carries the sections that are mostly words. Two Paper sections must not touch.

**The Hairline Row Rule.** Carried over from the previous world's Hairline Rule. Facts go in rows: key on the left, value on the right, a hairline between rows, one solid Cover Ink rule at the top of a table. A rounded panel is used only when a picture and its list are one object, never to hold a fact on its own.

## Elevation & Depth

Flat paper, with one exception that earns it. Surfaces sit on the page with a hairline and no shadow, and depth comes from three things: the set showing through the hero and journey windows, the machine's own light and shadow inside the scene, and a photographic plate. A drop shadow appears only on an element that floats over the page or over the set, or on a framed photograph, and every one is soft, ink-tinted and pulled in with a large negative spread. A rounded panel takes a one-pixel ring in place of a border, because a 1px border on a 16px corner and a 1px ring do not draw the same arc.

### Shadow Vocabulary
- **Ring** (`box-shadow: 0 0 0 1px var(--hairline)`): the border of a rounded panel, a package card, the booking tab track. Flat; it is a border, not a lift.
- **Action** (`0 8px 18px -12px rgba(11, 98, 184, 0.7)`): under the blue pill, tinted with the pill's own colour. Nothing else carries a coloured shadow.
- **Plate** (`0 30px 70px -40px rgba(23, 25, 28, 0.5)` with a ring, and `0 30px 70px -44px rgba(23, 25, 28, 0.55)` on the stage frame): a photograph presented as a plate. The deepest shadow in the system, and the only one over 40px of blur.
- **Tile selected** (`0 18px 34px -26px rgba(23, 25, 28, 0.5)`): a stage tab once chosen. The only case where a shadow marks state.
- **Note** (`0 0 0 1px rgba(23, 25, 28, 0.08), 0 18px 38px -22px rgba(23, 25, 28, 0.55)`): a note floating over a photographic plate. The callout tag over the set uses the same shape lighter, at `0 12px 26px -14px rgba(23, 25, 28, 0.45)`.
- **Floating card** (`0 20px 44px -26px rgba(23, 25, 28, 0.45)`): the phone journey card. The phone menu sheet uses the same shape at `0 22px 44px -22px rgba(28, 31, 34, 0.38)` with an inset hairline.
- **Action bar** (`0 0 0 1px var(--hairline), 0 18px 40px -18px rgba(23, 25, 28, 0.55)`): the phone's fixed call-and-book bar.
- **Mark ring** (`0 0 0 1.5px var(--ink)` plus `0 8px 18px -8px rgba(23, 25, 28, 0.55)` on a hotspot, `0 2px 8px rgba(23, 25, 28, 0.35)` on a callout dot, `0 0 0 1.5px rgba(23, 25, 28, 0.25)` on a path dot before it lights): a 1.5px ink ring is how a mark reads on any ground, photograph or page.
- **Nav seat** (`0 1px 0 0 rgba(28, 31, 34, 0.12)` while attached, cross-faded to `0 14px 30px -16px rgba(28, 31, 34, 0.32)` and `0 2px 6px -2px rgba(28, 31, 34, 0.1)` once detached): the header's frosted pane, interpolated by the scroll. The pane is the one surface with a heavy blur (16px, saturate 140%, brightness 1.03, with a 97% Paper fallback where backdrop-filter is unsupported); the journey rail and the hint use 6px to 8px.

### Named Rules
**The Floating Paper Rule.** Carried over from the previous world's Paper-and-Glass Rule. A shadow says the element is off the page. It says nothing about importance. Rows, tables, fields, tabs at rest and notes on the page are flat; the action, a floating card, a plate, a note over a plate, the phone bar and the chrome over the set cast one.

**The Ring Not Border Rule.** Anything with a 12px or 16px corner takes `0 0 0 1px var(--hairline)` instead of a border, so the inner fill and the edge share the same arc and a photograph inside it can bleed to the corner.

## Shapes

Two silhouettes and one scale between them. Anything you press is a pill (999px): the action, the nav pill, the phone bar's two buttons, the quiet outline button, the booking tabs and their track, the taste chips, the hint pill, the stage marker. Anything you read flat is square (0): form fields, table rows, the paper notes on the interior sheets. Between them a scale that is actually used, smallest to largest: 2px on the placeholder mark; 4px on a stat tag and a callout tag; 6px on a floating card, a note over a plate, a reduced-motion still and the phone's tappable key row; 8px on the kettle's photographic plate; 10px on chrome (the burger, the skip link's bottom corners, a package's inset photograph); 12px on a stage tab and a path figure; 16px on a stage frame, a package card, the system panel and the interior sheets' closing card. A mark is a full circle (50%): a hotspot at 36px, a path dot at 34px, a callout dot at 10px.

Borders are 1px hairlines in ink alpha, darkening to 26% on a tab hover and 32% on a tab chosen. A data table opens with a 1px solid Cover Ink rule and divides with hairlines; a question list opens with a 20% ink rule; a form field's edge is half-ink so it holds 3:1 on paper by itself. Marks are drawn, not set: a chevron is a 8px or 9px box with two 1.5px borders rotated 45 degrees, pointing down for "more below", up-right for "elsewhere" and up-left for "back"; a question's toggle is two 1.5px bars, the second rotated away on open; the path's connector is a 2px ink-14% rail with an ink fill scaled from the left as each step lights; the chip's tick-box is a 12px square with a 1px Third Ink edge that fills with Action Blue when ticked; the four route glyphs in the radial menu and the four proof glyphs in the hero strip are 24-unit, 1.5px-stroke SVGs drawn for this site. There is no icon library and no glyph font.

The wordmark is the one piece of geometry with its own rule: NEXT GEN sets the measure, and each line under it is spread letter by letter to that width, with a rule between the second and third lines on the full lockup.

## Components

### Buttons
Tactile in one way: colour. A button changes fill; it does not lift, scale or shimmer on hover.
- **Shape:** pill (999px), 1px transparent border on a filled one.
- **Primary** (`button-primary`): Action Blue fill, white label in Satoshi 600 at 15.5px, `16px 28px` on the hero and the section actions, `14px 26px` on the booking submit, 48px tall at `0 24px` on an interior sheet, with the Action shadow under it.
- **Hover / Focus:** fill goes to Deep Blue; focus-visible adds a 2px Cover Ink outline offset 3px. Transition 0.22s on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Nav** (`button-nav`): the same treatment at `9px 16px` and 14px, beside the phone number.
- **Phone bar** (`button-book-phone`, `button-call-phone`): two buttons in a fixed pill at the foot of the screen below 900px. Book is the Action Blue fill, 46px, flexible width; call is transparent with a 22% ink inset ring at 46px and `0 18px`, the glyph and the number in Cover Ink at 15px 600. The bar slides up from `translateY(160%)` over 0.45s once the visitor is 0.7 of a screen down, and hides itself while the booking section or the form is on screen.
- **Quiet outline** (`button-quiet`): a 20%-ink pill, 40px tall at `0 18px`, Second Ink at 14px with a drawn up-left chevron. Hover fills 5% ink, darkens the edge to 34% and sets the label in Cover Ink.
- **Quiet link** (`link-more`): Hanken 500 at 15.5px in Second Ink with a drawn chevron; Action Blue on hover and focus. Used for the second action beside every primary pill, so a section never carries two filled buttons.

### Chips
- **Style** (`chip-taste`): a pill on 72% paper with a hairline, Hanken 13.5px at 0.02em in Second Ink, a 9px gap to the drawn tick-box, `9px 13px 9px 11px`.
- **State:** hover darkens the border to 32% ink and the text to Cover Ink; ticked keeps Cover Ink and sets the border to 55% accent while the tick-box fills; the most recently ticked chip takes a 12% Water fill while its answer shows. Answers name a stage in Action Blue.

### Tabs
Two kinds, and they look nothing alike on purpose.
- **Stage tabs** (`tab-stage`): a sticky column of three 12px tiles on the page's own white, hairline, `18px 20px 19px`, each carrying a Third Ink number inside a 19px Satoshi title and a 14.5px summary under it. Chosen: Paper fill, 32% ink edge, the Tile-selected shadow. On phones the column becomes a three-across row of 10px tiles at `12px 10px 13px` with the summary dropped.
- **Booking tabs** (`tab-booking`): a centred pill track on Paper with a ring, 4px of padding, two 38px pills at `0 18px` in 14.5px 500. Chosen: Cover Ink fill, white label. The one place a solid ink fill marks selection.

### Cards / Containers
- **Package panels** (`panel-system`, `card-package`): the one rounded-panel family on the page. A 7/5 grid where the tall left panel is Paper with a 4:3 render bleeding to its top corners and `26px 30px 30px` of text under it, and the two right cards are white at `12px 12px 14px` with a 16:7 inset photograph at 10px corners, a 21px title and a hairline-row list. All three take the Ring and no shadow.
- **Figure frame** (`frame-figure`): a 4:3, 16px-cornered frame on #d3d7da with the Plate shadow, holding three stage photographs that cross-fade at 0.55s opacity and 0.9s scale from 1.02.
- **Note over a plate** (`note-figure`): 96% white at 6px corners, `14px 16px 15px`, a 17px Satoshi 700 title with a Third Ink index beside it and a 14.5px body, the Note shadow. It fades to 0.4 when another note is held.
- **Corner Style:** square for a note or panel on an interior sheet; 6px when a card floats; 16px on a package panel and the closing card.
- **Internal Padding:** `22px 24px 24px` on an interior note, `26px 30px 30px` on the system panel, `clamp(28px, 4vw, 44px)` on the closing card.

### Inputs / Fields
- **Style:** Paper fill, half-ink 1px edge, no radius, `12px 13px`, Hanken 16px in Cover Ink, Action Blue caret, placeholder in Third Ink. The label is a 13px Hanken caption in Third Ink, 7px above the field, sentence case.
- **Focus:** the edge and a 1px ring both go Action Blue; no outline. Elsewhere the focus ring is a 2px Action Blue outline offset 3px (offset 4px on a question, 2px on a booking tab), and a filled blue button takes a Cover Ink outline instead so the ring is visible against its own fill.
- **Error:** a 13px line in Redline under the actions. The success state is a paper panel with a rotated Redline "Request logged" stamp.

### Navigation
A fixed header that morphs continuously with the scroll rather than flipping between states, and it now has two states rather than three.
- **Attached** (scroll 0): a full-width bar at most 1240px, 72px tall, square, seated on the page by a one-pixel shadow. Compact lockup at left; at right the text links, a phone number with a drawn handset glyph, the Action Blue pill, and a 38px round quick-menu button that opens the radial route menu.
- **Detached** (scroll 260px): a floating pill at `min(920px, 100vw - 28px)`, 56px tall, 999px corners, 10px from the top, lifted by the Nav-seat shadow. Width, height, radius and inset are interpolated every frame from one scroll scalar; there is no transition on those four, because the scroll is the timeline.
- **Through the journey** the pill stays. It used to collapse to an orb; the phone number and the test action now stay one tap away the whole way down, and the quick menu is the round button inside the pill.
- **Links** are 14px in Second Ink, Cover Ink on hover, with a 1px Action Blue underline on the current page. Below 1180px the phone number keeps its glyph and drops its digits. Below 860px the links and the quick-menu button hide behind a 42px, 10px-cornered burger and the menu drops under the bar as a Paper sheet; a list is easier to hit and easier to read out than a ring.

### The Machine (signature)
One scene fixed behind the page, with the closed cover fitted into the hero's anchor box every frame while the hero is on screen. A drag turns it (yaw clamped to ±1.1), a tap lifts the cover as a rigid body, and the journey scalar then opens each housing in section, runs the water and sets the bowls down. The camera rail, the callout driver and the post driver share the one journey scalar, and the field of view narrows from 38 to 34 degrees as a housing opens while the focus rides the part being discussed. Every dimension is a centimetre in `dims.ts`. Materials (`materials.ts`) are the datasheet's: satin grey polypropylene housings, satin-black heads, a powder-coated frame and folded-sheet cover in #a1a3a5 with charcoal lettering, brass connectors, copper pipe, stainless and gauge glass. The media inside the cartridges (`media.ts`) are drawn on a canvas from a seeded random as macro beds with colour, height and roughness maps drawn together, so a still matches the page. None of these are UI tokens.
- **Lens** (`PostChain.tsx`): one chain shared by the page and by every still cut from the scene, in order — ambient occlusion, depth of field, bloom at 0.26 above a 0.92 luminance threshold, chromatic aberration at (0.0005, 0.0003), a 0.4 vignette and 0.14 grain. On the hero the page is white, so the vignette, the grain, the bloom and the aberration are all driven to zero; the stills keep them. Tone mapping is Neutral at exposure 1.
- **Tiers** (`quality.ts`): high, medium and low, chosen from pointer type, cores, memory and screen, overridable with `?ngtier=`. High gets dpr up to 2, depth of field, the lens chain, transmissive glass, decals, 130 condensation beads, full normal-map relief, the hardware details and a reflecting floor. Low gets dpr 1 and no post chain at all. A phone gets a scene that still looks like the machine; it does not get the film lens.
- **Fallbacks:** until WebGL is live a rendered still stands in, edge-feathered with a two-axis linear mask at 11% and 13% so it has no frame. Under `prefers-reduced-motion` the journey and the scene are removed outright (`display: none`) and a static story shows the same beats with a 6px-cornered still per stage.

### The Screen-Space Callout (signature)
A dot on the part, a hairline leader and a paper tag in the margin, drawn as HTML over the canvas so the type stays crisp while the leader stays attached to the part. The dot is a 10px white disc with a 1.5px Cover Ink ring; the leader is a 1px Cover Ink line 64px long, scaled from the end nearest the dot; the tag is 95% white at 4px corners, `7px 11px 8px`, 14px Hanken 500, at 74px from the anchor. Each is anchored to a point on the model in centimetres, windowed on the journey scalar, and placed clear of the bowls' printed stage labels and of the nav pill. Desktop only.

### The Hotspot Plate (signature)
A photograph presented as a plate: an 8px-cornered, ring-and-Plate-shadow figure, sticky under the nav, with an SVG overlay of 2.2px Cover Ink leaders that dim to 0.25 when one is held, three numbered 36px hotspots that scale in from 0.6, and three notes that rise 10px into place. Below 860px the plate unsticks, the overlay and the notes are dropped, and a list of tappable 6px key rows carries the same three notes with the same numbered discs.

### The Numbered Path (signature)
Four equal columns, each a 4:3 photograph desaturated to 0.6 and at 0.5 opacity until its step lights, a 34px numbered disc on a 2px connector rail that fills from the left, a 19px Satoshi title and a 15px paragraph. On phones the columns stack, the rail is dropped and every photograph is lit, because a four-step rail read as decoration in one column.

### The Placeholder Mark (signature)
Redline text on a 10% Redline tint with a 1px dashed 45% Redline border, 2px corners, `1px 6px`, at 0.86em, in Hanken via the re-pointed mono variable. Set inline wherever a figure has no source. It is the only red on the page.

### The Water Bead Cursor (signature)
A 26px disc that follows the pointer and grows to 54px over anything marked `data-cursor`. It reads by its rim and one specular rather than by brightness, because a bright bead on pale paper disappears: three radial gradients (a white highlight at 34%/26%, a Water wash low and right, a Deep Blue edge), a 50%-alpha Deep Blue border, an inset shadow that lenses the paper darker under it, and a 0.6px backdrop blur. It is gated on the input rather than the width (`hover: none`, `pointer: coarse`) so a narrow desktop window keeps it and a hybrid device does not get a stuck bead.

### The Hairline Row (signature)
A definition list with a solid Cover Ink top rule, 9 to 20px rows divided by hairlines, keys in Label (Third Ink) on a `minmax(0, 170px)` column and values in Row (Cover Ink) with tabular figures. The spec table, the stage facts, the concept notes, the installer facts, a package's contents and the footer index are all this one component.

## Do's and Don'ts

### Do:
- **Do** give every surface one filled pill in Action Blue and make its second action a quiet link or a hairline outline.
- **Do** set the big line in Satoshi Medium (500) at -0.03em or tighter, wrapped to two lines with a hard break, with one Hanken sentence under it in Second Ink on a 42 to 44ch measure.
- **Do** set labels and keys in Hanken 500 at 13.5px, sentence case, Third Ink, tracking 0 to 0.02em.
- **Do** put facts in hairline rows with a solid ink top rule, key left and value right, tabular figures.
- **Do** alternate Page White and Paper down the page, and paint an opaque ground on every new section so the set shows only through the hero and the journey.
- **Do** measure copy that sits over the set, place it in the pool of light, and give it full Cover Ink; 5.10:1 is the floor the build holds.
- **Do** give a rounded panel a one-pixel hairline ring instead of a border.
- **Do** keep the machine live: the scene is the picture, and a raster stands in only until WebGL is up or when motion is reduced.
- **Do** mark any unsourced figure with the red dashed `[PLACEHOLDER]`, caption a generated image as a visualisation on the page it appears on, and add a row to `public/photos/PROVENANCE.md` for any raster that ships.
- **Do** cut every still through the same lens chain the page uses, so a still never looks like a different camera.
- **Do** keep the reduced-motion path whole: no pinned journey, no scene, the same story as a document with a still per stage.
- **Do** leave the nav's four morph properties untransitioned; the scroll is the timeline and a transition on top of it reintroduces the lag.

### Don't:
- **Don't** introduce a third blue, a blue background or a blue border token; Action Blue fills the action and colours links, Deep Blue is its hover, Water marks water.
- **Don't** set type in Water, or in Second Ink over the set; both fall under the floor.
- **Don't** paint a gradient on a flat surface, a button or a heading. The set's falloff is a lit backdrop produced by a shader; the nav pane and the cursor are materials. Nothing else gets one.
- **Don't** use a monospace or a drafting face on a text surface, tracked uppercase, sheet numbers, sheet strips or registration ticks; the drawing set is retired and the two face variables are re-pointed so it cannot come back.
- **Don't** float a number above a section as an `01` marker. A counter belongs inside the thing it counts.
- **Don't** put a scrim, a halo or a text shadow behind copy over the set; move the copy or step the camera aside.
- **Don't** build a feature-card grid, a stats band or a testimonial carousel; the direction contract refuses the category's furniture. A rounded panel is for a picture and its list together, not for three parallel claims.
- **Don't** drift toward wellness: no sage or blush, no rounded friendly type, no droplets or leaves as decoration.
- **Don't** quote a reduction percentage or any figure without a source document; describe the mechanism instead, in the datasheet's own terms.
- **Don't** let a hover state move anything. A hover is a fill change, a border darkening or a colour change. A press may compress (the quick-menu button at 0.94) and a mark may scale in as it arrives; neither is a hover.
- **Don't** let a sticky column release over the next section; give it a runway inside its own.
- **Don't** add to `globals.css` or `brand.css`. They are the retired world's stylesheets, kept only until they are pruned; new rules go in `world.css` or `sections.css`.
