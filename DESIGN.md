---
name: Next Gen Water Systems
description: A white launch page with the machine live in it. Charcoal ink, one blue for the action, Satoshi headings over Hanken sentences, and a pale studio the product stands in.
colors:
  ground: "#ffffff"
  studio: "#f2f3f3"
  panel: "#f6f7f7"
  panel-2: "#eaecee"
  ink: "#17191c"
  ink-2: "#3e4348"
  ink-3: "#676e75"
  hairline: "rgba(23, 25, 28, 0.12)"
  accent: "#0b62b8"
  deep: "#094a8a"
  water: "#2ea9df"
  redline: "#b8412c"
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
    fontSize: "clamp(17px, 2vw, 21px)"
    fontWeight: 700
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(16px, 1.5vw, 18px)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: "normal"
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    letterSpacing: "0"
  caption:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0"
  action:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 600
    letterSpacing: "0"
rounded:
  mark: "2px"
  tag: "4px"
  card: "6px"
  control: "10px"
  panel: "16px"
  pill: "999px"
spacing:
  inline: "8px"
  stack: "12px"
  field: "16px"
  row: "20px"
  block: "28px"
  gutter: "clamp(18px, 5vw, 34px)"
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
  button-nav-hover:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.ground}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
  button-quiet-hover:
    backgroundColor: "rgba(28, 31, 34, 0.05)"
    textColor: "{colors.ink}"
  link-more:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
  link-more-hover:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
  chip-taste:
    backgroundColor: "rgba(248, 249, 249, 0.72)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "9px 13px 9px 11px"
  chip-taste-on:
    backgroundColor: "rgba(248, 249, 249, 0.72)"
    textColor: "{colors.ink}"
  chip-taste-live:
    backgroundColor: "rgba(27, 166, 217, 0.12)"
    textColor: "{colors.ink}"
  input-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "12px 13px"
  input-field-focus:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  hint-pill:
    backgroundColor: "rgba(255, 255, 255, 0.86)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  stat-tag:
    backgroundColor: "rgba(255, 255, 255, 0.75)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.tag}"
    padding: "6px 11px"
  placeholder-mark:
    backgroundColor: "rgba(184, 65, 44, 0.1)"
    textColor: "{colors.redline}"
    rounded: "{rounded.mark}"
    padding: "1px 6px"
  note-paper:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "22px 24px 24px"
  closing-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(28px, 4vw, 44px)"
---

# Design System: Next Gen Water Systems

## Overview

**Creative North Star: "The White Studio"**

A product photography studio with the page as its backdrop. The page is white. The machine stands in a pale grey field that one fixed WebGL scene paints behind the whole document, and the hero and the journey are the two windows onto it. The type is the charcoal of the cover's own lettering. There is one blue, and it is spent on the action. Everything else is a hairline or a sheet of paper.

The register is premium restraint (PRODUCT.md): closer to an appliance launch than to a plumbing site. Density is low. Each screen owns one idea, set in a big medium-weight line with a short sentence under it, and the proof sits in hairline rows rather than cards. Motion belongs to the machine. The cover turns under a drag and lifts under a tap; each stage opens in section on the scroll. The chrome around it stays still.

Confirmed rejections, from the 17 Sep 2026 direction contract and PRODUCT.md: the blue water-splash hero, the three feature cards, the stats band and the testimonial carousel of the category; the drawing-set furniture of the world this page replaced (sheet strips, sheet numbers, registration ticks, drafting labels); and the wellness aesthetic (sage, blush, rounded friendly type, droplets as decoration). Three rules from the previous world survive in changed form and are marked below as carried over.

**Key Characteristics:**
- White page, pale studio, charcoal ink, one blue.
- The product is live in the first viewport and is the only picture that matters.
- Satoshi Medium for the big lines; Hanken for sentences and for every label, in sentence case.
- Hairline rows instead of cards.
- Flat paper: a shadow only where something floats over the page.
- A visible red placeholder wherever a figure has no source.

## Colors

A near-monochrome of white, pale grey and charcoal, with one blue for the action and a lighter blue reserved for water.

### Primary
- **Action Blue** (#0b62b8, `accent`): the one call to action on each surface (the hero pill, the nav pill, the booking submit, the sheets' "Book your free water test"); inline links in prose; the stage numbers and "Out" keys in the stages list; the journey's cue links and stage marker; the caret in a form field; the hover colour of quiet links; the drawn plus and minus of the schedule. About 6.1:1 on white, computed from the hex.
- **Deep Blue** (#094a8a, `deep`): the action's hover and focus fill. It has no other job.

### Secondary
- **Water** (#2ea9df, `water`): water itself. Text selection at 28% alpha, the live dot in the hint pills, the fill under a chip that has just been ticked, the journey heading forming out of water. It is 2.7:1 on white and is never used for type.

### Tertiary
- **Redline** (#b8412c, `redline`): the honesty colour. The `[PLACEHOLDER]` mark on the specification, the form's error line, the "Request logged" stamp. Never decoration, never a heading.

### Neutral
- **Page White** (#ffffff, `ground`): the page. Painted on `html` rather than `body`, because the fixed scene at z-index -1 sits between the two in paint order and a body background would cover it.
- **Studio Grey** (#f2f3f3, `studio`): the field the machine stands in, the fixed scene's clear colour and its fog. It shows through the hero and the journey and nowhere else; `STUDIO_BG` in Studio.tsx carries the same value.
- **Paper** (#f6f7f7, `panel`): the specification section's ground, the spec table, form fields, the footer, the interior sheets' closing card, the phone menu.
- **Recessed Paper** (#eaecee, `panel-2`): wells and pressed surfaces. Rare.
- **Cover Ink** (#17191c, `ink`): headings, prose on the interior sheets, values in rows, the focus ring on a button, the top rule of a data table. Sampled from the cover's lettering.
- **Second Ink** (#3e4348, `ink-2`): leads, section prose, chip text, the quiet link at rest. About 10:1 on white.
- **Third Ink** (#676e75, `ink-3`): labels, captions, the installer strip, field placeholders. 5.2:1 on white and 4.65:1 on Studio Grey, which is the system's contrast floor and was measured in the finish review.
- **Hairline** (rgba(23, 25, 28, 0.12), `hairline`): every rule, border and row divider.

### Named Rules
**The One Blue Rule.** Action Blue is spent on the action and on what leads to it: one pill per surface, inline links, the stage numbers that index the journey. It never tints a background, a heading or a decoration. Two blue pills on one screen means one of them is wrong.

**The Water Is Never Text Rule.** Carried over from the previous world. Water marks water: a selection, a live dot, the fill under a live chip, a heading forming out of water. At 2.7:1 on white it is never a word.

**The Red Means Unsourced Rule.** A figure without a source is set as a red dashed `[PLACEHOLDER]` mark. It is never replaced with a plausible number and never softened to grey.

## Typography

**Display Font:** Satoshi (400, 500, 700; self-hosted, with ui-sans-serif, system-ui fallback)
**Body Font:** Hanken Grotesk (variable 400 to 600; self-hosted, same fallback)
**Lockup Font:** Michroma, for the NEXT GEN line of the wordmark only (nav and footer). The cover's 3D lettering is the same face baked to outlines in `lockupPaths.ts`, not a web font.

**Character:** A geometric grotesque doing the talking and a humanist grotesque doing the reading. Satoshi Medium, tight, at very large sizes, then Hanken at ordinary sizes with generous leading. Nothing on the page is set in a monospace or a drafting face, and nothing is tracked out in capitals.

### Hierarchy
- **Display** (500, clamp(42px, 5.4vw, 80px), 1, -0.035em): the hero line, "Water that tastes of nothing." Balanced wrap. The booking headline is the same weight at clamp(40px, 6.4vw, 84px) / 0.98, and a sheet's title runs clamp(34px, 6.4vw, 62px). On phones the hero drops to clamp(31px, 8.6vw, 38px).
- **Headline** (500, clamp(30px, 4.2vw, 50px), 1.04, -0.03em): section headings, two lines with a hard break ("The three stages, / standing still."). The stages and installer headings run slightly larger, to 52px and 54px.
- **Beat** (700, clamp(28px, 3.3vw, 46px), 1.04, -0.02em): the journey's copy beats, which form out of water as each stage opens. The one bold headline tier. Phones: clamp(22px, 6vw, 27px).
- **Title** (700, clamp(17px, 2vw, 21px), -0.02em): stage names, the spec list's keys (17px), the sheets' block headings (clamp(20px, 2.4vw, 25px)), note headings (22px) and the footer index titles (16.5px).
- **Lead** (400, clamp(16px, 1.5vw, 18px), 1.65): the one sentence under a headline, in Second Ink, on a 42 to 52ch measure. The hero lead runs clamp(17px, 1.5vw, 19px) / 1.6 on 42ch.
- **Body** (400, 16.5px, 1.72): prose on the interior sheets, 66ch, in Cover Ink. Row values and panel copy sit at 16px / 1.5 and 15.5px / 1.6.
- **Label** (500, 13.5px, 0 tracking, sentence case): caption heads ("Pages", "Talk to someone", "What each stage does", "Plumbing licence") in Third Ink; the stage numbers in Action Blue; the spec table's keys at 12px with 0.02em.
- **Caption** (400, 13px): breadcrumbs, the note under a generated photograph, form field labels, "or call", the nav hint. Third Ink.
- **Action** (Satoshi 600, 15.5px, 0 tracking): the pill's label. Satoshi ships here in 400, 500 and 700, so 600 resolves to the Bold file. The nav pill is 14px.

### Named Rules
**The Two Faces Rule.** Satoshi sets headings and the action. Hanken sets everything else, every label included. No third face appears on a text surface: Geist Mono is loaded, and the build points `--font-mono` and `--font-draft` at Hanken so that it cannot be used.

**The Sentence Case Rule.** Labels and keys are sentence case with zero tracking. No uppercase, no tracked small caps, no monospace for keys or numbers. Tabular figures are the only numeric treatment.

**The Medium Weight Rule.** The bigger the line, the lighter the weight. Display and headline sit at 500 with tight tracking; 700 belongs to the title tier and to the journey beats.

## Layout

The page is a stack of full-width sections over one fixed scene. The scene (`.stage-fixed`) is `position: fixed; inset: 0; z-index: -1` and paints Studio Grey; the hero and the journey are transparent so it shows through; every other section paints Page White or Paper. Nothing else may be transparent.

**The first viewport** (desktop, above 900px) is a two-column grid, `minmax(0, 10fr) minmax(0, 10fr)`, at `min-height: 100svh`. The copy sits in the left column, vertically centred, on a 44rem block with `clamp(120px, 16vh, 180px)` above it and `clamp(22px, 6vw, 96px)` of left gutter. The right column is the machine's anchor: a box with `min-height: 66svh` that the scene fits the closed cover into every frame (Opening.tsx writes the box's centre and size into `HERO`). A hint pill sits at the bottom of that box. The installer strip spans both columns in the second grid row under a hairline. On phones the grid is one column: copy (84px top padding), then the machine at `min-height: 42svh`, then the strip.

**The journey** is a pinned section of `1050svh` (`620svh` on phones) with a sticky `100svh` frame. Copy beats are absolute, `max-width: 430px`, at `left`/`right: clamp(24px, 6vw, 96px)` and vertically centred; the camera steps the machine aside on wide frames so the copy sits on clean studio with no halo or scrim. Below 900px every beat speaks from a paper card at the base of the screen: `width: calc(100vw - 28px)`, `max-width: 440px`, `bottom: 14px + safe-area`, 6px corners, hairline, one soft shadow. In landscape on a short screen (`max-height: 500px`) the card stands beside the machine at `min(46vw, 400px)`.

**Sections** run `clamp(84px, 12vh, 150px)` top and bottom (`--sec-y`; the specification, concept and installer sections use a literal `clamp(72px, 12vh, 150px)`) and `clamp(18px, 5vw, 34px)` inline. The content width is 1240px (`--maxw`); the stages section reads on 980px; the booking tail and the interior sheets read on 760px. Two-column sections are 5/7 (specification), 5/6 (concept band) or 7/5 (installer) and collapse to one column at 900px.

**Interior sheets** (`Sheet.tsx`) are a single 760px column: breadcrumb, title, lead, one photograph, titled blocks, then a closing card with the one action. `clamp(112px, 15vh, 168px)` above the breadcrumb; blocks `clamp(38px, 6vh, 62px)` apart.

**Rhythm.** Data is set as hairline-separated rows in a definition list, on a 12 to 20px vertical step: the spec table (13px 16px rows), the stage list (20px rows), the installer facts, the footer index (14px rows). Inline gaps run 8, 12, 14, 16, 18 and 28px. Sizes are `clamp()` throughout; there is no spacing scale beyond the observed steps.

**Breakpoints.** 900px is the cut: below it the journey plays a shorter timeline for a narrow camera and every two-column grid stacks. 860px drops the phone menu under the bar as its own sheet; 820px hides the nav links; 640px shrinks the compact lockup to 15px; above 1500px the journey rail moves up to clear the stage marker.

### Named Rules
**The One Scene Rule.** The machine is one WebGL scene fixed behind the page. The hero and the journey are windows onto it and paint nothing; every other section is opaque. A new section that lets the studio show through is a bug.

**The Hairline Row Rule.** Carried over from the previous world's Hairline Rule. Facts go in rows: key on the left, value on the right, a hairline between rows, one solid Cover Ink rule at the top of a table. Cards are not used for facts.

## Elevation & Depth

Flat paper. Surfaces sit on the page with a hairline and no shadow, and depth comes from two things only: the studio showing through the hero and journey windows, and the machine's own light and shadow inside the scene. A drop shadow appears only on an element that floats over the page or over the studio, and every one of them is soft, ink-tinted and pulled in with a negative spread.

### Shadow Vocabulary
- **Action** (`box-shadow: 0 8px 18px -12px rgba(11, 98, 184, 0.7)`): under the blue pill, tinted with the pill's own colour. Nothing else carries a coloured shadow.
- **Floating card** (`box-shadow: 0 20px 44px -26px rgba(23, 25, 28, 0.45)`): the phone journey card. The phone menu sheet uses the same shape at `0 22px 44px -22px rgba(28, 31, 34, 0.38)` with an inset hairline.
- **Framed figure** (`box-shadow: 0 18px 40px -24px rgba(28, 31, 34, 0.35)`): the concept photograph's paper frame.
- **Chrome** (`box-shadow: 0 8px 20px -12px rgba(28, 31, 34, 0.3)` and `0 6px 16px -10px rgba(28, 31, 34, 0.3)`): the journey rail card and the nav hint, both over the studio with `backdrop-filter: blur(6px to 8px)`.
- **Nav seat** (`0 1px 0 0 rgba(28, 31, 34, 0.12)` while attached; `0 14px 30px -16px rgba(28, 31, 34, 0.32)` once detached): the header's frosted pane, cross-faded between the two by the scroll. The pane is the one surface with a heavy blur (16px); the rail and hint use 6px to 8px.

### Named Rules
**The Floating Paper Rule.** Carried over from the previous world's Paper-and-Glass Rule. A shadow says the element is off the page. It says nothing about importance. Rows, tables, fields and notes are flat; only the action, a floating card, a framed figure and the chrome over the studio cast one.

## Shapes

Two silhouettes. Anything you press is a pill (999px): the action, the nav pill, the quiet outline buttons, the taste chips, the hint pills, the stage marker, the nav orb. Anything you read is square: form fields, table rows, the paper notes, the schedule. Between the two, a small set of corners: 2px on the placeholder mark, 4px on the stat tag, 6px on a floating card and on the reduced-motion stills, 10px on chrome (the journey rail, the menu button, the skip link's bottom corners) and 16px on the interior sheets' closing card.

Borders are 1px hairlines in ink alpha. A data table opens with a 1px solid Cover Ink rule and divides with hairlines; a form field's edge is half-ink (rgba(28, 31, 34, 0.5)) so it holds 3:1 on paper by itself. Marks are drawn: chevrons are a 9px box with two 1.5px borders rotated 45 degrees; the schedule's plus and minus are two 1.5px bars in Action Blue; the chip's tick-box is a 12px square with a 1px Third Ink edge that fills with Action Blue when ticked; the four route glyphs in the radial menu are 24-unit hairline SVGs drawn for this site. There is no icon library.

The wordmark is the one piece of geometry with its own rule: NEXT GEN sets the measure, and each line under it is spread letter by letter to that width, with a rule between the second and third lines on the full lockup.

## Components

### Buttons
Tactile in one way only: colour. Buttons do not lift, scale or shimmer; they change fill.
- **Shape:** pill (999px), 1px transparent border.
- **Primary** (`button-primary`): Action Blue fill, white label in Satoshi 600 at 15.5px, `16px 28px` padding on the hero and `14px 26px` on the booking submit, the interior sheets' button at 48px tall and `0 24px`; the Action shadow under it.
- **Hover / Focus:** fill goes to Deep Blue; focus-visible adds a 2px Cover Ink outline offset 3px. Transition 0.22s on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Nav** (`button-nav`): the same treatment at `9px 16px` and 14px.
- **Quiet outline** (`button-quiet`: "Watch this stage open", the breadcrumb's "Home"): a hairline pill, 38px tall (34px on the breadcrumb) at `0 16px`, Second Ink at 14px; hover fills 5% ink, darkens the edge to 34% and sets the text in Cover Ink. Only one filled pill per surface.
- **Quiet link** (`link-more`: "See inside it", "Skip the section"): Hanken 500 at 15.5px in Second Ink with a drawn 9px chevron; Action Blue on hover and focus.

### Chips
- **Style** (`chip-taste`): a pill on 72% paper with a hairline, Hanken 13.5px at 0.02em in Second Ink, a 9px gap to the drawn tick-box, `9px 13px 9px 11px` padding.
- **State:** hover darkens the border to 32% ink and the text to Cover Ink; ticked (`is-on`) keeps Cover Ink and sets the border to 55% accent while the tick-box fills; the most recently ticked chip (`is-live`) takes a 12% Water fill while its answer shows. Answers name a stage in Action Blue.

### Cards / Containers
- **Corner Style:** square for a note or panel (`note-paper`); 16px for the interior sheets' closing card (`closing-card`); 6px when the card floats (phone journey card).
- **Background:** Paper, or 72% and 66% paper alphas over the page (installer notes, the schedule).
- **Shadow Strategy:** none at rest; see Elevation.
- **Border:** 1px hairline.
- **Internal Padding:** `22px 24px 24px` on a note, `26px` on the logged state, `clamp(28px, 4vw, 44px)` on the closing card.

### Inputs / Fields
- **Style:** Paper fill, half-ink 1px edge, no radius, `12px 13px` padding, Hanken 16px in Cover Ink, Action Blue caret, placeholder in Third Ink. The label is a 13px Hanken caption in Third Ink, 7px above the field, sentence case.
- **Focus:** the edge and a 1px ring both go Action Blue; no outline. Elsewhere on the page the focus ring is a 2px Action Blue outline offset 3px with 3px corners.
- **Error:** a 13px line in Redline under the actions. The success state is a paper panel with a rotated Redline "Request logged" stamp.

### Navigation
A fixed header that morphs continuously with the scroll rather than flipping between states. At the top of the page it is a 72px full-width bar, 1240px at most, with the compact lockup at left, three text links and the nav pill at right; over the first 260px of scroll it detaches into a 56px floating pill 760px wide with 999px corners, and inside the journey it collapses to a 62px orb that opens a radial menu (or right-click anywhere in the journey). The morph interpolates width, height, radius and inset every frame from two scalars, the second of them run through a spring (stiffness 120, damping 18). The pane behind the bar is frosted glass: a light gradient over `backdrop-filter: blur(16px) saturate(140%) brightness(1.03)`, with a 97% Paper fallback where backdrop-filter is unsupported. Attached, it separates from the page by a one-pixel seat; detached, by the Nav seat shadow. Links are 14px in Third Ink, Cover Ink on hover, with a 1px Action Blue underline on the current page. Below 860px the links hide behind a 42px, 10px-cornered menu button and the menu drops under the bar as a Paper sheet.

### The Machine (signature)
One `MachineStage` scene, fixed behind the page, with the cover fitted into the hero's anchor box every frame while the hero is on screen. A drag turns it (yaw clamped to ±1.1), a tap lifts the cover as a rigid body (feet forward, clips release, rise, square up), and the journey scalar then opens each housing in section, runs the water and sets the bowls down. Until WebGL is live, a rendered still (`cover-still.jpg`, edge-feathered with a linear mask at 11% and 13%) stands in; under `prefers-reduced-motion` the journey and the scene are removed and `StaticStory` shows the same beats with a still per stage. The scene's materials (powder coat, polypropylene, black heads, brass, copper) live in `materials.ts` and are not UI tokens.

### The Hint Pill and Stage Marker (signature)
Small floating pills over the studio: 86% white, hairline, 999px, 12.5px Hanken 500 in Second Ink, `8px 14px`, with a 7px Water dot. "Drag to turn · tap to open" under the hero machine; the stage marker under the nav inside the journey; the journey rail at bottom right as a 10px-cornered card of the same paper, which on phones becomes a row of dots.

### The Placeholder Mark (signature)
`mark.placeholder`: Redline text on a 10% Redline tint with a 1px dashed 45% Redline border, 2px corners, `1px 6px`, at 0.86em. Set inline wherever a figure has no source. It reads as the site's own honesty, and it is the only red on the page.

### The Hairline Row (signature)
A definition list with a solid Cover Ink top rule, 13 to 20px rows divided by hairlines, keys in Label (Third Ink) on a `minmax(0, 190px)` column and values in Cover Ink at 16px with tabular figures. The spec table, the concept notes, the installer facts, the stage list and the footer index are all this one component.

## Do's and Don'ts

### Do:
- **Do** give every surface one filled pill in Action Blue, and make everything else on it a hairline or a text link.
- **Do** set the big line in Satoshi Medium (500) at -0.03em or tighter, wrapped to two lines with a hard break, with one Hanken sentence under it in Second Ink.
- **Do** set labels and keys in Hanken 500 at 13.5px, sentence case, zero tracking, Third Ink.
- **Do** put facts in hairline rows with a solid ink top rule, key left and value right, tabular figures.
- **Do** keep the machine live: the scene is the picture, and a raster stands in only until WebGL is up or when motion is reduced.
- **Do** mark any unsourced figure with the red dashed `[PLACEHOLDER]`, and caption a generated image as a visualisation where it is shown.
- **Do** paint an opaque ground on every new section, so the studio shows only through the hero and the journey.
- **Do** keep the reduced-motion path whole: no pinned journey, no scene, the same story as a document with a still per stage.

### Don't:
- **Don't** introduce a third blue, a gradient or a blue background; Action Blue fills the action and colours links, Water marks water.
- **Don't** set type in Water; it is 2.7:1 on white.
- **Don't** use a monospace or drafting face, tracked uppercase, sheet numbers, sheet strips or registration ticks; the drawing set is retired.
- **Don't** put a scrim, a halo or a text shadow behind copy over the studio; move the copy or step the camera aside.
- **Don't** build a feature-card grid, a stats band or a testimonial carousel; the direction contract refuses the category's furniture.
- **Don't** drift toward wellness: no sage or blush, no rounded friendly type, no droplets or leaves as decoration.
- **Don't** quote a reduction percentage or any figure without a source document; describe the mechanism instead.
- **Don't** let a button lift, scale or shimmer; state changes are fill changes.
