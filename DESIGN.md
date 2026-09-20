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
  set-corner: "#7d7d7c"
typography:
  display:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(38px, 4.2vw, 62px)"
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
  button-book-menu:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-book-menu-hover:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.ground}"
  button-check:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "50px"
    size: "15px"
  button-check-hover:
    backgroundColor: "rgba(23, 25, 28, 0.05)"
    textColor: "{colors.ink}"
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
  row-answer:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "11px 4px 11px 0"
    size: "16.5px"
  row-answer-hover:
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
  row-stage:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.tile}"
    padding: "11px 14px 12px"
    size: "14px"
  row-stage-on:
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
  track-sort:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "32px"
    size: "13.5px"
  track-sort-on:
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
  rail-pane:
    backgroundColor: "rgba(250, 251, 251, 0.93)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 8px 0 22px"
    height: "50px"
  rail-stop:
    backgroundColor: "#fbfbfb"
    textColor: "{colors.ink}"
    rounded: "{rounded.disc}"
    size: "9px"
  rail-stop-stage:
    backgroundColor: "#fbfbfb"
    textColor: "{colors.ink}"
    rounded: "{rounded.disc}"
    size: "24px"
  rail-stop-lit:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  rail-tip:
    backgroundColor: "rgba(255, 255, 255, 0.97)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.tag}"
    padding: "7px 11px 8px"
    size: "13.5px"
  rail-skip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 14px 0 16px"
    height: "36px"
    size: "13.5px"
  rail-skip-hover:
    backgroundColor: "rgba(23, 25, 28, 0.05)"
    textColor: "{colors.ink}"
  dot-told:
    backgroundColor: "{colors.water}"
    textColor: "{colors.ink}"
    rounded: "{rounded.disc}"
    size: "10px"
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
    backgroundColor: "rgba(255, 255, 255, 0.82)"
    textColor: "{colors.ink}"
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
  input-check:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0 14px"
    height: "50px"
    size: "16px"
  row-read:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "22px 40px 22px 0"
  row-read-hover:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
  placeholder-mark:
    backgroundColor: "rgba(184, 65, 44, 0.07)"
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

The register is premium restraint (PRODUCT.md): closer to an appliance launch than to a plumbing site. Density is low at the top of the page and rises as a visitor gets closer to buying. The first screen asks one thing of the visitor and the machine answers it: the home page as shipped asks what the water is doing, and each answer lifts the cover and opens the stage that is there for it. The journey gives the machine a whole screen; the commercial half of the page (the numbered path, the package panels, the stage explorer, the questions, the booking tabs) is denser, because by then the visitor is comparing rather than being introduced. Motion belongs to the machine. The cover turns under a drag and lifts under a tap, and each housing opens in section on the scroll. The journey's copy arrives on the clock while the machine stays on the scroll. The chrome around it changes fill, and the page itself moves only to take the visitor somewhere: a nav link glides to its section, a new page fades in, an answer grows open under its row.

One section is not Next Gen's. The installer's band is handed to Aqua-Safe Plumbing & Maintenance and dressed in their livery: their deep teal, their white lockup, their photographs and their display face for its one heading. It is the installer introducing themselves, and it is the only bounded exception to the palette and to the two faces (The Borrowed Livery Rule).

Confirmed rejections, from the direction contract and PRODUCT.md: the blue water-splash hero, the three feature cards, the stats band and the testimonial carousel of the category; the drawing-set furniture of the world this page replaced (sheet strips, sheet numbers, registration ticks, tracked-out drafting labels); and the wellness aesthetic (sage, blush, rounded friendly type, droplets as decoration). Rules carried over from the previous world in changed form are marked below.

**Key Characteristics:**
- White page, a lit grey set behind two windows, charcoal ink, one blue.
- The product is live in the first viewport and is the only picture that matters; a poster cut from the live scene holds its place until the scene is up.
- One pinned section, with a rail along its foot that says where the visitor is in it: every stop is a jump, and there is a way past.
- Satoshi Medium for the big lines; Hanken for sentences and for every label, in sentence case.
- Hairline rows for facts; a rounded panel only where a picture and its list are one object.
- Flat paper: a shadow only where something floats over the page or over the set.
- A visible red placeholder wherever a figure has no source.
- One borrowed band: the installer's own section, in their livery, and nowhere else.

## Colors

A near-monochrome of white, pale grey and charcoal, with one blue for the action and a lighter blue reserved for water. On Next Gen's own surfaces the only chromatic object is the machine. The one other chromatic surface is the installer's band, which is in their livery rather than this palette (The Borrowed Livery Rule).

### Primary
- **Action Blue** (#0b62b8, `accent`): the one filled call to action on each surface (the hero pill, the nav pill, the phone bar's book button, the phone menu's booking pill, the booking submit, the interior sheets' button, the kettle checklist's pill, the pill the journey ends on above 900px); inline links in prose and in a hero's result line; the stage numbers in the how-it-works list; the journey's jump to the visitor's own stage, on the phone's paper card only (over the set the same jump is Cover Ink with an underline); the numbered steps' counters and the counters on the booking's three next steps; the caret in a form field; the tick that fills a chosen chip's box and the dot that fills a chosen answer's ring; the hover colour of quiet links, of a question's toggle, of a read's title and of an answer row on a device that can hover; every focus ring that is not on a filled button. About 6.1:1 on white, and about 3.6:1 against Set Grey in the pool of light (computed from the two tokens), which is why it is never type over the set.
- **Deep Blue** (#094a8a, `deep`): the action's hover and focus fill. It has no other job.

### Secondary
- **Water** (#2ea9df, `water`): water itself. Text selection at 28% alpha, the live dot in the hint pill, the fill under a chip that has just been ticked, and the visitor's own water in the journey: a 9px dot on the rail's disc for the stage their words point at, and a 10px live dot before the one line that stage's beat says in those words. It is 2.7:1 on white and is never used for type.

### Tertiary
- **Redline** (#b8412c, `redline`): the honesty colour. The `[PLACEHOLDER]` mark on the specification (on a 7% tint of itself) and the form's line when a send fails. Never decoration, never a heading, and never on anything that worked: the "Request logged" stamp was Redline until 19 Sep 2026 and is now Cover Ink.

### Neutral
- **Page White** (#ffffff, `ground`): the page, and the ground of the loud sections (the kettle, the stage explorer, the packages). Painted on `html` rather than `body`, because the fixed scene at z-index -1 sits between the two in paint order and a body background would cover it. It is also the fixed scene layer's own ground under the hero, so until the canvas is up the hero's background is still the page's white. Measured at #ffffff, and the hero's own WebGL set measures #ffffff with it.
- **Paper** (#f6f7f7, `panel`): the ground of the quiet sections that alternate with white (the path, the questions, the specification), the spec table, form fields, the footer, the booking tab track and the chart's sort track, the system panel, the phone menu, a chosen stage row. The value is the token in world.css, and a capture of the band reads #f6f8f7: one level of green, which is the screenshot pipeline's colour conversion rather than a second grey (the action blue reads #0c62b9 for #0b62b8 in the same frame). The alternation is what gives a ten-screen page a rhythm without a new colour.
- **Recessed Paper** (#eaecee, `panel-2`): wells and pressed surfaces, and the ground a path photograph sits on before it loads. Rare.
- **Pre-canvas Grey** (#f2f3f3, `studio`): the CSS ground of the fixed stage layer while the journey owns it (the journey sets `.is-journey` on the layer), painted under the canvas and visible only while the canvas is faded out. Under the hero the same layer is Page White. It is a fallback, not the studio; see the note under Set Grey.
- **Set Grey** (#c6c6c4 in the pool of light to about #7d7d7c at the frame corners, `set-pool` / `set-corner`): the journey's seamless backdrop, painted in screen space by a shader in `Studio.tsx` so no horizon ever swings through the shot. Measured from real pixels and neutral by measurement: red equals green, blue one or two levels under. The corners were measured on 19 Sep 2026 at #7c7c7b to #7d7d7c in the frame's bottom corners and #888886 in its top corners, sampled two pixels in from each corner of a 1440 by 900 frame; the 18 Sep 2026 reading of #6c6c6a no longer matches the screen, and nothing in the scene's source values changed between the two, so treat the corner figure as a reading to re-take whenever copy moves toward an edge. The scene's own source values are a linear ramp of #c8c8c6, #a3a3a1 and #6f6f6e with the clear colour and the fog at #a3a3a1; the numbers above are what was measured on screen, and they are the ones to design against. They are not the Neutral tone mapper's output on every tier: while a composer is mounted the renderer's tone mapping is off, so the medium and high tiers are not tone mapped, and only the low tier, which has no composer, gets Neutral at exposure 1 (The Machine, Lens).
- **Cover Ink** (#17191c, `ink`): headings, journey body copy, values in rows, a stage named inside a sentence (at 600), the ticked state of a chip, the filled state of a stage tab's edge, of a path dot, of a reached stop on the journey's rail and of a chosen stage row's disc, the rail's fill, the chosen segment of a pill track, the current page's dot in the phone menu, the focus ring on a filled button, the "Request logged" stamp, a link that stands over the set (underlined), the top rule of a data table, a chart's rule, range line and guideline, every callout leader and its dot ring. Sampled from the cover's lettering.
- **Second Ink** (#3e4348, `ink-2`): leads, section prose, row copy, answers, the quiet link and the quiet button at rest, and on the journey's rail the key beside the stop's name and the skip at rest (both on the pane, never on the set). About 10:1 on white.
- **Third Ink** (#676e75, `ink-3`): labels, captions, the note beside a figure, the stage number inside a tab title, a path dot before it lights, an answer's ring before it is chosen, a chart's bars, field placeholders, the idle line of a readout. 5.2:1 on white.
- **Hairline** (rgba(23, 25, 28, 0.12), `hairline`): every rule, border and row divider, and the one-pixel ring that stands in for a border on a rounded panel.

### Named Rules
**The One Blue Rule.** Action Blue is spent on the action and on what leads to it: one filled pill per surface, inline links, the counters that index a sequence, the mark that shows a control is chosen. It never tints a background, a heading or a decoration, and it never names a stage inside a sentence: the kettle readout and the taste answer set the stage in Cover Ink at 600 and leave the blue to the pill. Two filled blue pills on one screen means one of them is wrong, which is why the phone bar steps down wherever a page's own pill is showing, and why the journey's closing pill steps out on a phone, where the bar is already under it. The nav's pill is persistent chrome and is not counted: above 900px it has always shared the screen with a section's own pill. The blue is deliberately singular: there is no blue-100, no blue border token, no second accent.

**The Water Is Never Text Rule.** Carried over. Water marks water: a selection, a live dot, the fill under a live chip, and the visitor's own water in the journey, as a dot on their stage's disc and a live dot before the line said in their words. The words beside that dot are Cover Ink. At 2.7:1 on white Water is never a word.

**The Set Is Lit, The Page Is Not Rule.** The grey behind the machine is a gradient because it is a lit backdrop, and its falloff is produced by a shader, not by a CSS gradient. A gradient on the page itself is allowed in exactly two places, and both simulate a physical material rather than decorate: the nav's frosted pane (a 180-degree wash over a 16px backdrop blur) and the water-bead cursor (three radial gradients, a rim and one specular). No flat surface, no button and no heading carries a gradient fill, and no type sits on one except over the set, where it is placed on the pool of light and measured. A hard-stop gradient that paints a flat band on a chart's scale (the hardness chart's soft range) is a drawing with an edge, not a fill.

**The Machine Keeps Its Own Colours Rule.** The palette above is the page's. The machine is a manufactured object and carries the colours it is made in: a blue valve handle (#1f5fb0), blue cartridge caps (#2c48c9), a red gauge needle (#c8281e), brass, copper, stainless. Those live in `materials.ts`, they are not tokens, and they are not counted against the one-blue rule. Do not "correct" them toward the palette.

**The Borrowed Livery Rule.** The installer's band (`#installer`) is Aqua-Safe's, not Next Gen's, and it is the one bounded exception to this palette, to the one blue pill and to the Two Faces Rule. Its ground is their deep teal (#0a3f56). Its action is a white pill in their ink (#0c2b39) that fills their mist (#eef4f7) on hover, and its focus ring is a 2px white outline at 4px. Its secondary copy is mist at 86% (the lead, the quiet link) and 72% (fact keys, captions), which computes from the declared values at about 6:1 on the teal. Its fact rows are mist hairlines at 18% under a 55% top rule. Its heading is set in their Clash Display, and its lockup, fleet photograph and three job photographs are theirs. The values are declared as custom properties on the section itself (`.aq`), never on `:root`, and they are not page tokens. Nothing outside that band uses them, and no second section is dressed in anyone's livery.

**The Red Means Unsourced Rule.** A figure without a source is set as a red dashed `[PLACEHOLDER]` mark. It is never replaced with a plausible number and never softened to grey. Red has one other job, the form's line when a send fails. Nothing that worked is red: the "Request logged" stamp is Cover Ink, because a red stamp left a visitor wondering whether it had.

**The Contrast Floor Rule.** Every measured text-on-background pair on the shipping surface clears 4.5:1, and the floor is the journey's body copy over the set at 5.10:1, with the stage chips at 6.34:1 or better and the footer credit at 9.3:1. Copy over the set takes full Cover Ink, never Second Ink, because Second Ink falls under the floor toward the frame corners. The placeholder mark's tint was lightened from 10% to 7% Redline because it measured 4.44:1 on the Paper band; 7% brings it to about 4.6:1 there without touching the Redline token. Action Blue does not clear the floor over the set, so a link that stands there is Cover Ink with a 1.5px underline and takes the blue only on the phone's paper card.

## Typography

**Display Font:** Satoshi (400, 500, 700; self-hosted, with ui-sans-serif, system-ui fallback)
**Body Font:** Hanken Grotesk (variable 400 to 600; self-hosted, same fallback)
**Lockup Font:** Michroma, for the NEXT GEN line of the wordmark only (nav and footer). The cover's 3D lettering is the same face baked to outlines in `lockupPaths.ts`, not a web font.
**Borrowed Face:** Clash Display Semibold (600), for the heading of the installer's band and nowhere else. It is Aqua-Safe's display face, the same file their site ships; self-hosted, not preloaded because it sits far down the home page, and falling back to Satoshi.

**Character:** A geometric grotesque doing the talking and a humanist grotesque doing the reading. Satoshi Medium, tight, at very large sizes, then Hanken at ordinary sizes with generous leading. Nothing on a text surface is set in a monospace or a drafting face, and no label is tracked out in capitals. The installer's band speaks in the installer's own display face; its sentences stay in Hanken, which both sites share, so the two brands keep one voice in the prose.

### Hierarchy
- **Display** (500, clamp(38px, 4.2vw, 62px), 1, -0.035em): the hero line. Balanced wrap. This is the size on the three hero options whose copy column also carries a working list (the question, the free test, the open machine), and the home page opens on the question. The original option, a statement line with only the action under its lead, runs larger at clamp(42px, 5.4vw, 80px). The booking headline is the same weight at clamp(40px, 6.4vw, 84px) / 0.98, and a sheet's title runs clamp(34px, 6.4vw, 62px). On phones the hero line drops to clamp(31px, 8.6vw, 38px).
- **Headline** (500, clamp(30px, 4.2vw, 50px), 1.04, -0.03em): every section heading, on the home page and the interior pages alike, usually two lines with a hard break. One ramp step for all of them; the sections do not compete on size. The contact page's phone number sits on this step at clamp(30px, 5vw, 46px) / -0.02em, because on that page the number is the headline.
- **Beat** (700, clamp(28px, 3.3vw, 46px), 1.04, -0.02em): the journey's copy beats, each word rising out of its own overflow-clipped line on the clock once its beat is in, never scrubbed to the scroll (The Machine Is Scrubbed, The Copy Is Timed Rule). The one bold headline tier. Phones: clamp(22px, 6vw, 27px).
- **Title** (700, 19px, -0.01em): a stage tab's name, a path step's title, a chart's title, the headings in an article's foot. Siblings on the same tier: a package title and the kettle checklist's heading at 21px / -0.015em, a figure note's heading and a stage row's name at 17px / -0.01em, a read's title in the resources list at clamp(20px, 2.4vw, 24px) / -0.02em, a question at 19px in 600 (it is a control, so it takes the lighter weight), the footer index titles at 16.5px.
- **Lead** (400, clamp(16px, 1.5vw, 18px), 1.6): the one sentence under a headline, in Second Ink, on a 42 to 44ch measure. The hero lead runs clamp(17px, 1.5vw, 19px) / 1.6 on 42ch.
- **Body** (400, 16.5px, 1.65): a journey beat's paragraph (1.6, 40ch, full Cover Ink), a question's answer (1.65, 62ch), a stage panel's "what happens" at 17px / 1.65 on 62ch, prose on the interior sheets at 1.72 on 66ch. An answer row's label is this size in 500 and Cover Ink, because it is a control.
- **Row** (400, 15.5px, 1.5): the value side of a hairline row, a suburb in the service-area list, a read's description; a package list item, a path step's paragraph and a side-by-side table cell at 15px; a hero's answer, the open hero's job line and the kettle readout at 15px / 1.6 in Second Ink; the line a journey beat says in the visitor's own words at 15px / 1.55 in 500 and Cover Ink, and the booking's next steps at 15px / 1.5 in Cover Ink; a figure note's body and a stage tab's one-line summary at 14.5px. This is the tier that carries the commercial half of the page.
- **Label** (500, 13.5px, sentence case): caption heads and the key side of a hairline row, in Third Ink; the suburb check's label; the heads of the side-by-side table (13.5px) and of the chart (13px). Tracking is 0, or 0.02em on a table key and a taste chip. The journey's rail names its stop at this size with no tracking, the key in Second Ink at 500 and the title in Cover Ink at 600, and its tags and its skip are the same size; the 0.04em exception went with the old corner rail card and its stage marker. A sheet's byline sits at this size in 400.
- **Caption** (400, 13px): breadcrumbs, the note under a generated photograph, form field labels, the caption beside a figure, the note beside an action, the nav hint, a chart's caption, a source's detail line, a read's source line, the installer's photograph captions, the line under the booking's actions that says what happens next (13.5px on 56ch). Third Ink, or mist at 72% on the installer's band. Small print that would run long (the schedule's exclusions, a chart's caption, a photograph's note) is capped at 72ch.
- **Action** (Satoshi 600, 15.5px, 0 tracking): the pill's label, including the phone bar's and the phone menu's. Satoshi ships in 400, 500 and 700, so 600 resolves to the Bold file. The nav pill is 14px, and the phone bar's call button and the check button are 15px.

### Named Rules
**The Two Faces Rule.** Satoshi sets headings, titles and the action. Hanken sets everything else, every label and every number included. No third face appears on a Next Gen text surface. The one bounded exception is the installer's band, whose single heading is set in their Clash Display (The Borrowed Livery Rule); the wordmark's Michroma is lettering on a logo, not a text face. Enforcement is by override and, since 19 Sep 2026, by absence as well. The build re-points `--font-mono` and the `--font-draft` variables at Hanken, and names Hanken directly with `!important` on the label selectors the retired stylesheets used to set in a drafting face. The layout no longer applies Geist Mono's variable to `html` (it was what made the placeholder mark resolve to a monospace), and the drafting face's three `@font-face` rules are gone.

**The Sentence Case Rule.** Labels and keys are sentence case. No uppercase, no tracked small caps, no monospace for keys or numbers. Tabular figures are the only numeric treatment (`font-variant-numeric: tabular-nums` on a stage number, a row value and a chart's table).

**The Medium Weight Rule.** The bigger the line, the lighter the weight. Display and headline sit at 500 with tight tracking; 700 belongs to the title tier and to the journey beats; 600 to the action, to a control that reads as a heading, and to a stage named inside a sentence.

**The Counter Is Not A Kicker Rule.** Numbers that index the product are allowed: three stages, four steps in the path, three marks on the kettle photograph, three marks pinned to the bowls in the open-machine hero, four steps in the free-test hero's path row. They sit inside the thing they number (a tab's title, a step's dot, a row's disc, a mark on a picture) and count plainly, 1 2 3, with no leading zero. A number floating above a section as a `01` marker is furniture and is not used.

## Layout

The page is a stack of full-width sections over one fixed scene. The scene (`.stage-fixed`) is `position: fixed; inset: 0; z-index: -1`; the hero and the journey are transparent so it shows through; every other section paints Page White, Paper or, for the installer's band alone, their teal. Nothing else may be transparent. The fixed layer paints its own ground: Page White under the hero, where it is the hero's background until the canvas is up, and Pre-canvas Grey under the journey.

**The first viewport** (above 900px) is a two-column grid, `minmax(0, 10fr) minmax(0, 10fr)`, at `min-height: 100svh`, and all four hero options share it: the copy in the left column on a 44rem block with `clamp(22px, 6vw, 96px)` of left gutter; the machine's anchor box in the right column at `min-height: 66svh`, which the scene fits the closed cover into every frame (the hero writes the box's centre and size into `HERO`, and the set's pool of light follows it), with a hint pill at its foot; and the installer proof strip spanning both columns in the second grid row under a hairline. What changes between options is what the copy column asks of the visitor. The home page opens on the question (`DEFAULT_HERO` in `heroes/options.ts`): a lead that says what the product is before it asks anything (whole-house filtration for Perth homes, fitted at the mains by licensed plumbers), then a list of answers, each of which lifts the cover and opens its own stage in section, then the blue action with a quiet "See all three stages" beside it. The free test puts a suburb check, its result line, the action and the whole path in one row under the lead. The open machine lifts its own cover 1.4s after the scene is live and pins a numbered mark to each bowl, with a stage row per housing in the copy column. The original keeps the closed cover and the outcome line. The three options with a working list anchor the copy to the top of its column (`align-self: start`) with `clamp(96px, 12vh, 140px)` above it, so an answer opening under its row pushes only what sits below it; the original centres its copy with `clamp(120px, 16vh, 180px)` above.

On phones the grid is one column. The question and the open machine dissolve their copy column into the hero's grid (`display: contents`) so the order can be: heading (84px top padding), lead, the machine at `min-height: 34svh`, the answers or the stage rows, then the proof strip. The lead says "pick what sounds like yours", so the answers follow the machine directly and a tap on one shows its stage opening on the same screen. These two heroes' whole action row steps out below 900px, the pill and the quiet "See all three stages" with it: the phone action bar is the test action from load, a second pill under the answers only made the bar step down and come back as it scrolled past, and the quiet link on its own came to rest half under the bar. The stages are the next thing down the page. A tablet in portrait (600px to 900px) keeps the phone's order with more air: the heading at `clamp(40px, 6.8vw, 58px)` under 104px, 36px margins, a 17px lead on 44ch and the machine at `min-height: 40svh`. The open machine's pinned marks are dropped on phones and its rows carry the choice. The free test and the original stack copy (84px top padding), the machine (the original at `min-height: 42svh`), then the strip; the free test's path row goes two by two.

**The poster.** Until the scene is up, the hero shows a poster cut from the live scene at each layout (780 by 572 below 900px, 1440 by 1188 above), with the cover at the scene's own framing, 82% of the anchor box height. Its edges are pure white, so it sits on the page with no mask or feather. The scene reports itself ready only after 8 settled frames, and the poster then fades off over 0.25s: the handover is the same picture, and the machine never changes size or doubles. The poster is also the whole picture for anyone without WebGL or with reduced motion.

**The journey** is a pinned section of `1050svh` (`620svh` on phones) with a sticky `100svh` frame. It is written once, as one timeline on the scalar p, and paced twice (`journeyMap.ts`): the wide cut and the phone cut are two maps from the section's scroll onto the same p, so nothing in the scene knows which pacing it is on. The wide cut was re-paced on 19 Sep 2026: the cover's lift has about 100svh of scroll (it had 143) and the three beats that close the sale have 75, 75 and 70svh (they had 43 to 52). Its joins sit on the camera's own keys (`CAM` in `MachineStage.tsx`), where the camera is at rest, so a change of pace is not felt as a jolt. The phone cut takes the cover off at speed, plays the three stages at full dwell and jumps past the installer and servicing beats, whose copy lives in the still sections below; the jump is a timed dissolve, 140ms down to the layer's ground and 240ms back up, because a scrubbed dip left a ghost of the machine wherever a thumb stopped. As the section enters, the fixed scene rides up with it: the camera's view offset tracks the scroll against the point where the journey's top edge meets the top of the screen (`STAGE_RIDE` in `heroState.ts`), so the machine rises with the page instead of lowering onto it and no gap opens above the set. Copy beats are absolute, `max-width: min(430px, 33vw)`, at `left`/`right: clamp(24px, 6vw, 96px)`, the left beat centred and the right beat a touch above centre at 44%. Each is in or out on the clock (The Machine Is Scrubbed, The Copy Is Timed Rule), and the opening beat is in from the start. A beat's window can differ on the phone cut (`aPhone`, `bPhone` in `journeyStory.ts`): a wide beat waits for the pipe to clear its column, and a phone's card stands on its own paper, so stages 2 and 3 open earlier there and the stretch with no card, and so no Back or Next, stays about a tenth of a screen. The camera steps the machine aside on wide frames so the copy sits on clean set with no halo or scrim; at the servicing beat it is panned left of centre and held there while the copy reads, and it also rests through the house-out and installer beats (hold keys at p 0.815 and 0.88), because an orbit that started under the copy carried the machine into it. The picture scales with the frame's height while the copy keeps its measure, so on a shorter or narrower desktop (1024 by 768, 1280 by 720) the column takes more of the frame than it did at 1440 by 900 where the poses were composed. While a beat is up the whole picture steps sideways, away from that beat's column, by the width the column has gained: `margin + min(430, 0.33W, 344) - (W/2 - 290 * H/900)`, never less than zero, eased on a damp of 5 and applied as a camera view offset (`STAGE_RIDE.side`), with the set's pool of light going with it. At 1440 by 900 the step is zero. The rail runs along the foot of the frame and says where the visitor is (The Journey's Rail). Screen-space callouts live in the margin: a dot on the part, a 64px hairline leader, a paper tag at 74px, each anchored to a real point on the model in centimetres and in or out on the clock like the copy. Below 900px every beat speaks from a paper card at the base of the screen, above the phone action bar: `width: calc(100vw - 28px)`, `max-width: 440px`, `bottom: 84px + safe-area`, 6px corners, hairline, one soft shadow, with Back and Next along its foot; the rail tucks under the nav, and the callouts are dropped because a phone has no margin. In landscape on a short screen (`max-height: 500px`) the card stands beside the machine at `min(46vw, 400px)` and the rail moves to the top right.

**Sections** run `clamp(84px, 12vh, 150px)` top and bottom (`--sec-y`; the kettle closes at 0.8 of that and stands at least `100svh` tall, the specification and concept sections carry a literal `clamp(72px, 12vh, 150px)`, and the installer's band runs `clamp(84px, 12vh, 140px)`) and `clamp(20px, 5vw, 40px)` inline (`--gutter`). The specification and the cover band take that gutter on their inner containers like every other section; until 19 Sep 2026 they sat 26 to 40px off the page's grid. The content width is 1240px (`--maxw`); the stages section reads on 980px; the booking tail and the interior sheets read on 760px. A section head is a 7/5 grid, heading left and lead right, bottom-aligned, with the body `clamp(32px, 5vh, 56px)` below it. Two-column bodies are 4/8 (the stage explorer), 5/7 (the questions, the specification, the kettle's checklist), 7/5 (the packages), 6/6 (the installer's band) or four equal columns (the path). Every one of them collapses to a single column at 900px.

**Sticky columns.** Three columns park under the nav: the stage explorer's tab list at 104px, the cover band's copy at 104px and the questions' heading block at 110px. The kettle no longer holds the scroll: its plate sits in the flow with no pin and no runway, and its notes draw in by time once it is on screen (The Hotspot Plate). The journey is the one section that pins.

**Rhythm.** Facts are hairline-separated rows on a 6 to 22px vertical step: the spec table, the stage facts (`minmax(0, 170px)` key column), the installer's facts (150px keys, 128px below 520px), a package list (9px rows), the footer index, the side-by-side table (12px), the chart's rows (7px), the service-area suburbs (6px, set in columns), the resources list (22px). Inline gaps run 8, 12, 14, 16, 18, 20 and 28px; a section head gaps 24px by 48px; a two-column body gaps `clamp(24px, 4vw, 56px)`. Sizes are `clamp()` throughout; there is no spacing scale beyond the observed steps.

**Nav clearance.** `html` carries `scroll-padding-top: 96px` so an anchor jump and the browser's own scroll to a focused control both stop clear of the fixed nav, and below 900px it also carries `scroll-padding-bottom: calc(86px + safe-area)` for the phone action bar. A whole section cancels that padding for itself (`scroll-margin-top: -96px` on `main section[id]`), so a link to a section lands the section's own top edge at the top of the screen, with the nav floating over its top padding and no sliver of the section above showing. The callout driver fades any tag whose paper would land under the nav pill.

**Breakpoints.** 1180px drops the digits of the nav's phone number and keeps its glyph. 1100px takes the footer from three columns to two. 1080px shortens the rail's skip to one word and narrows its name column from 218px to 192px (the longest stop name measures 187px; at 168px four of the ten were cut). 900px is the cut: the journey plays the phone cut for a narrow camera, every multi-column grid stacks (the kettle's checklist included), the beats become cards with Back and Next, the callouts go, the rail tucks under the nav, the question and the open-machine heroes reorder so the machine comes up between the question and its answers and their own pill steps out, the open machine's pinned marks give way to its rows, and the phone action bar is available. 600px to 900px is the tablet block: the phone's order with a bigger line, 36px margins and a taller machine. 900px with `max-height: 500px` is the landscape case. 860px hides the nav links behind the burger, and on the kettle it drops the leaders and the notes, shrinks the marks to 30px on the plate and brings in the tappable key list under the photograph. 640px shrinks the compact lockup to 15px, left-aligns the taste question and drops the hardness chart's range columns. 560px sets the footer in one column. 520px tightens the installer's fact keys and the job photographs' gap. 380px narrows the rail's track from 236px to 204px and its targets from 36px to 32px.

### Named Rules
**The One Scene Rule.** The machine is one WebGL scene fixed behind the page. The hero and the journey are windows onto it and paint nothing; every other section is opaque, and an opaque section taller than a screen (the kettle) sits between the two windows so the scene changes hands unseen. A new section that lets the set show through is a bug.

**The Alternating Ground Rule.** Sections alternate Page White and Paper down the page. White carries the sections with a picture or a live object in them; Paper carries the sections that are mostly words. Two Paper sections must not touch. The installer's teal band stands outside the alternation, between the white packages and the white stage explorer; it is the one ground that is neither. Down the home page as built (`HomePage.tsx`): the white kettle, the journey's window, the Paper path, the white packages, the teal band, the white stage explorer, the Paper specification, the white cover band, the Paper questions, the white booking.

**The Hairline Row Rule.** Carried over from the previous world's Hairline Rule. Facts go in rows: key on the left, value on the right, a hairline between rows, one solid Cover Ink rule at the top of a table. A rounded panel is used only when a picture and its list are one object, never to hold a fact on its own. The installer's facts keep the row in their livery: mist hairlines under a mist top rule.

**The Machine Is Scrubbed, The Copy Is Timed Rule.** The scroll is the machine's timeline, and a half-open housing is a fine thing to stop on. Words are different: scrubbed copy left half-risen headings and ghosted cards wherever the scroll happened to rest. So a beat is in or out. Crossing into its window sets one class (`is-in`) and CSS runs the rest on the clock: each word rises out of its own line over 0.72s on `cubic-bezier(0.16, 1, 0.3, 1)`, 42ms apart, the body parts follow 90ms apart, and the exit is one 0.22s fade with the words reset behind it. The opening beat is already in when the section arrives. On a phone the card's paper arrives with its beat as one 0.3s fade, and the phone cut's jump is timed the same way, as a dissolve. The callout tags obey the rule too: a group shares one window and draws in order, dot, leader, tag, each tag 0.2s after the last. Nothing that carries words reads the scroll position.

## Elevation & Depth

Flat paper, with one exception that earns it. Surfaces sit on the page with a hairline and no shadow, and depth comes from three things: the set showing through the hero and journey windows, the machine's own light and shadow inside the scene, and a photographic plate. A drop shadow appears only on an element that floats over the page or over the set, or on a framed photograph, and every one is soft, ink-tinted and pulled in with a large negative spread. A rounded panel takes a one-pixel ring in place of a border, because a 1px border on a 16px corner and a 1px ring do not draw the same arc.

### Shadow Vocabulary
- **Ring** (`box-shadow: 0 0 0 1px var(--hairline)`): the border of a rounded panel, a package card, the booking tab track and the chart's sort track. Flat; it is a border, not a lift.
- **Action** (`0 8px 18px -12px rgba(11, 98, 184, 0.7)`): under the blue pill, the phone menu's booking pill included, tinted with the pill's own colour. Nothing else on Next Gen's surfaces carries a coloured shadow.
- **Plate** (`0 30px 70px -40px rgba(23, 25, 28, 0.5)` with a ring, and `0 30px 70px -44px rgba(23, 25, 28, 0.55)` on the stage frame): a photograph presented as a plate. The deepest shadow in the system, and the only one over 40px of blur.
- **Tile selected** (`0 18px 34px -26px rgba(23, 25, 28, 0.5)`): a stage tab once chosen. The only case where a shadow marks state; a chosen stage row in the hero takes Paper without it.
- **Note** (`0 0 0 1px rgba(23, 25, 28, 0.08), 0 18px 38px -22px rgba(23, 25, 28, 0.55)`): a note floating over a photographic plate. The callout tag over the set uses the same shape lighter, at `0 12px 26px -14px rgba(23, 25, 28, 0.45)`.
- **Floating card** (`0 20px 44px -26px rgba(23, 25, 28, 0.45)`): the phone journey card. The phone menu sheet uses the same shape at `0 22px 44px -22px rgba(28, 31, 34, 0.38)` with an inset hairline.
- **Action bar** (`0 0 0 1px var(--hairline), 0 18px 40px -18px rgba(23, 25, 28, 0.55)`): the phone's fixed call-and-book bar.
- **Rail pane** (`0 0 0 1px var(--hairline), 0 16px 34px -20px rgba(23, 25, 28, 0.5)`): the journey's rail, chrome over the set. A stop's tag over it takes the callout tag's shadow.
- **Mark ring** (`0 0 0 1.5px var(--ink)` plus `0 8px 18px -8px rgba(23, 25, 28, 0.55)` on a hotspot and on a mark pinned to a bowl, `0 2px 8px rgba(23, 25, 28, 0.35)` on a callout dot, `0 0 0 1.5px rgba(23, 25, 28, 0.25)` on a path dot before it lights): a 1.5px ink ring is how a mark reads on any ground, photograph, page or machine.
- **Nav seat** (`0 1px 0 0 rgba(28, 31, 34, 0.12)` while attached, cross-faded to `0 14px 30px -16px rgba(28, 31, 34, 0.32)` and `0 2px 6px -2px rgba(28, 31, 34, 0.1)` once detached): the header's frosted pane, interpolated by the scroll. The pane is the one surface with a heavy blur (16px, saturate 140%, brightness 1.03, with a 97% Paper fallback where backdrop-filter is unsupported); the journey's rail pane is the only other frosted surface, at 8px and saturate 140% over 93% near-white.
- **Borrowed** (scoped to the installer's band): their own shadows, kept with the rest of the livery. `0 6px 20px -12px rgba(10, 63, 86, 0.4)` under the white pill and `0 34px 80px -34px rgba(4, 22, 31, 0.6)` under the fleet photograph, which is their large shadow in a darker teal so it still reads on the teal ground.

### Named Rules
**The Floating Paper Rule.** Carried over from the previous world's Paper-and-Glass Rule. A shadow says the element is off the page. It says nothing about importance. Rows, tables, fields, tabs at rest and notes on the page are flat; the action, a floating card, a plate, a note over a plate, the phone bar and the chrome over the set cast one.

**The Ring Not Border Rule.** Anything with a 12px or 16px corner takes `0 0 0 1px var(--hairline)` instead of a border, so the inner fill and the edge share the same arc and a photograph inside it can bleed to the corner.

## Shapes

Two silhouettes and one scale between them. Anything you press is a pill (999px): the action, the nav pill, the phone bar's two buttons, the phone menu's booking pill, the quiet outline button, the check button, the booking tabs and the chart's sort and their tracks, the taste chips, the hint pill, the journey's rail pane and its skip, and on the installer's band their white pill. Anything you read flat is square (0): form fields (the suburb field included), table rows, the paper notes on the interior sheets. Between them a scale that is actually used, smallest to largest: 2px on the placeholder mark; 4px on a stat tag, a callout tag and a rail stop's tag; 6px on a floating card, a note over a plate, a reduced-motion still and the kettle's tappable key row; 8px on the kettle's photographic plate; 10px on chrome (the burger, the skip link's bottom corners, a package's inset photograph) and on the installer's job photographs, on their band and on a light page; 12px on a stage tab, a stage row in the open-machine hero and a path figure; 16px on a stage frame, a package card, the system panel, the interior sheets' closing card and the installer's fleet photograph. A mark is a full circle (50%): a hotspot at 36px (30px on a phone), a mark pinned to a bowl at 36px, a stage row's disc and a path dot at 34px, a path-row ring at 26px, a stage disc on the journey's rail at 24px (22px on a phone), an answer's ring at 18px, a callout dot and the dot before a visitor's own line at 10px, a plain rail stop and the dot that marks a visitor's stage at 9px, the current page's dot at 6px.

Borders are 1px hairlines in ink alpha, darkening to 26% on a tab or stage row hover and 32% on one chosen. A data table opens with a 1px solid Cover Ink rule and divides with hairlines; a question list and the answer list open with a 20% ink rule; a form field's edge is half-ink so it holds 3:1 on paper by itself. Marks are drawn, not set: a chevron is a 7px to 9px box with two 1.5px borders rotated 45 degrees, pointing down for "more below", up-right for "elsewhere" (a read in the resources list, an article's other reads, the installer's links) and up-left for "back"; a question's toggle is two 1.5px bars, the second rotated away on open; an answer's ring is an 18px circle with a 1.5px Third Ink inset edge that goes Action Blue when chosen while a dot inset 4px scales in from nothing; the path's connector is a 2px ink-14% rail with an ink fill scaled from the left as each step lights, and the journey's rail is the same line with the scroll as its fill; the chip's tick-box is a 12px square with a 1px Third Ink edge that fills with Action Blue when ticked; the phone bar's handset, the four route glyphs in the radial menu and the four proof glyphs in the hero strip are 24-unit, 1.5px to 1.8px-stroke SVGs drawn for this site. There is no icon library and no glyph font.

The wordmark is the one piece of geometry with its own rule: NEXT GEN sets the measure, and each line under it is spread letter by letter to that width, with a rule between the second and third lines on the full lockup.

## Components

### Buttons
Tactile in one way: colour. A button changes fill; it does not lift, scale or shimmer on hover.
- **Shape:** pill (999px), 1px transparent border on a filled one.
- **Primary** (`button-primary`): Action Blue fill, white label in Satoshi 600 at 15.5px, `16px 28px` on the hero, the section actions and the kettle checklist (whose label counts what was ticked: "Book a free test for these"), `14px 26px` on the booking submit, 48px tall at `0 24px` on an interior sheet, with the Action shadow under it. Above 900px the journey ends on this pill at `16px 28px` ("Book a free water test"); on a phone that cue steps out, because the action bar under the card already carries it. The phone menu's booking row is this pill at 48px and `0 22px` (`button-book-menu`).
- **Hover / Focus:** fill goes to Deep Blue; focus-visible adds a 2px Cover Ink outline offset 3px. Transition 0.22s on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Nav** (`button-nav`): the same treatment at `9px 16px` and 14px, beside the phone number.
- **Phone bar** (`button-book-phone`, `button-call-phone`): two buttons in a fixed pill at the foot of the screen below 900px, on solid white with the Action bar shadow (it was 97% white until 19 Sep 2026, and a row of type resting under it read through the pane behind the transparent call button). Book is the Action Blue fill, 46px, flexible width, labelled "Book a free water test"; call is transparent with a 22% ink inset ring at 46px and `0 18px`, the drawn handset and "Call" in Cover Ink at 15px 600. It is the test action from load: on the home page the question hero's own pill steps out below 900px, so nothing on the first screen makes the bar wait. It steps down wherever the screen already shows a blue pill: while a page's own pill is at least half in view (a sliver entering at the foot does not count), while the booking section is within 0.9 of a screen or the form is on screen, and while the phone menu is open. Through the journey it stays, under the caption card. It slides from `translateY(160%)` over 0.45s, steps down for the menu on translate and opacity over 0.3s, and is inert while it is down. It books at `#book` on the home page and at the water-test page elsewhere.
- **Check** (`button-check`): the suburb check's outline pill at the field's height, 50px at `0 22px`, a 32% ink edge, Satoshi 600 at 15px in Cover Ink. Hover fills 5% ink and darkens the edge to 50%. It checks and never books, so it is never blue.
- **Quiet outline** (`button-quiet`): a 20%-ink pill, 40px tall at `0 18px`, Second Ink at 14px with a drawn up-left chevron. Hover fills 5% ink, darkens the edge to 34% and sets the label in Cover Ink.
- **Quiet link** (`link-more`): Hanken 500 at 15.5px in Second Ink with a drawn chevron; Action Blue on hover and focus. Used for the second action beside every primary pill (the question hero's "See all three stages" above 900px and the kettle's "See the three stages" included), and for an article's other reads, so a section never carries two filled buttons.

### Chips
- **Style** (`chip-taste`): a pill on 72% paper with a hairline, Hanken 13.5px at 0.02em in Second Ink, a 9px gap to the drawn tick-box, `9px 13px 9px 11px`. The taste check and the kettle's signs checklist use the same chip.
- **State:** hover darkens the border to 32% ink and the text to Cover Ink; ticked keeps Cover Ink and sets the border to 55% accent while the tick-box fills; in the taste check the most recently ticked chip takes a 12% Water fill while its answer shows. An answer names its stage in Cover Ink at 600 inside the sentence; the blue stays with the pill.

### Tabs
Two kinds, and they look nothing alike on purpose.
- **Stage tabs** (`tab-stage`): a sticky column of three 12px tiles on the page's own white, hairline, `18px 20px 19px`, each carrying a Third Ink number inside a 19px Satoshi title and a 14.5px summary under it. Chosen: Paper fill, 32% ink edge, the Tile-selected shadow. On phones the column becomes a three-across row of 10px tiles at `12px 10px 13px` with the summary dropped.
- **Pill tracks** (`tab-booking`, `track-sort`): a track on Paper with a ring and a few pixels of padding, holding pills in Hanken 500. The booking tabs are the large one: centred, 4px of padding, two 38px pills at `0 18px` in 14.5px. The hardness chart's sort is the small one: 3px of padding, 32px pills at `0 14px` in 13.5px, its state carried by `aria-pressed`. Chosen: Cover Ink fill, white label. A solid ink fill marks the chosen segment of a track; a chosen tile takes Paper instead.

### Answer Rows (the question hero)
The home page's first control, and quiet on purpose. A list on a 34rem measure under a 20% ink top rule, one hairline row per answer. Each row is a full-width button (`row-answer`): Hanken 16.5px 500 in Cover Ink at `11px 4px 11px 0`, with an 18px ring before it. Chosen, the ring's edge goes Action Blue and its dot scales in over 0.25s, and the answer opens under its own row: a grid track grows from 0fr to 1fr over 0.42s on the open curve while the text fades in and settles 4px, indented 32px on a 46ch measure at 15px / 1.6 in Second Ink. The machine meanwhile lifts its cover and cuts open the stage for that answer. The hover colour is Action Blue only on a device that can hover (`@media (hover: hover)`), because a phone keeps the hover on a tapped row and it would read as a second blue. On phones the rows are 16px at `12px 0`.

### Stage Rows and Pinned Marks (the open-machine hero)
The stage tab's language at a smaller size, paired with marks on the machine itself. Three 12px tiles (`row-stage`): white, hairline, `11px 14px 12px`, a 34px numbered disc with a 1.5px ink ring, a 17px Satoshi 700 name over a 14px Second Ink media line. Hover darkens the edge to 26% ink; chosen takes Paper, a 32% edge and a Cover Ink disc with a white numeral, and no shadow. The same numbers are pinned to the bowls on the live machine as 36px marks (the kettle's hotspot, on a bowl), placed every frame from where the scene reports each housing and filling Cover Ink when chosen or hovered. A job line under the rows says what the chosen cartridge does (15px / 1.6 in Second Ink, Third Ink before a choice, its height held so nothing jumps), and its walkthrough link is a blue text link with a drawn down chevron. On phones the pinned marks are dropped and the rows carry the choice.

### Suburb Check (the free-test hero and the service-areas page)
A 13.5px 500 Third Ink label; then a square Paper field at 50px (`input-check`: `0 14px`, half-ink edge, Action Blue caret and focus ring) beside the check button; then a result line at 14.5px / 1.55 in Second Ink that names the suburb in Cover Ink at 600 and links on in Action Blue, its height (3.1em) held while empty so nothing jumps when it fills. In the hero a four-step path row follows under a hairline: 26px numbered rings (a 1.5px ink inset edge, Satoshi 700 at 12.5px) over 13.5px Second Ink, four across, two by two on phones.

### Cards / Containers
- **Package panels** (`panel-system`, `card-package`): the one rounded-panel family on the page. A 7/5 grid where the tall left panel is Paper with a 4:3 render bleeding to its top corners and `26px 30px 30px` of text under it, and the two right cards are white at `12px 12px 14px` with a 16:7 inset photograph at 10px corners, a 21px title and a hairline-row list. All three take the Ring and no shadow.
- **Figure frame** (`frame-figure`): a 4:3, 16px-cornered frame on #d3d7da with the Plate shadow, holding three stage photographs that cross-fade at 0.55s opacity and 0.9s scale from 1.02.
- **Note over a plate** (`note-figure`): 96% white at 6px corners, `14px 16px 15px`, a 17px Satoshi 700 title with a Third Ink index beside it and a 14.5px body, the Note shadow. It fades to 0.4 when another note is held.
- **Job photographs** (the installer's own): three across at 4:5 with 10px corners and a 13.5px 500 label under each; white on their band, Second Ink on a light page (the about page), where they show the installer's work without the livery.
- **Corner Style:** square for a note or panel on an interior sheet; 6px when a card floats; 16px on a package panel and the closing card.
- **Internal Padding:** `22px 24px 24px` on an interior note, `26px 30px 30px` on the system panel, `clamp(28px, 4vw, 44px)` on the closing card.

### Inputs / Fields
- **Style:** Paper fill, half-ink 1px edge, no radius, `12px 13px` (the suburb field at 50px and `0 14px`), Hanken 16px in Cover Ink, Action Blue caret, placeholder in Third Ink. The label is a 13px Hanken caption in Third Ink, 7px above the field, sentence case.
- **Focus:** the edge and a 1px ring both go Action Blue; no outline. Elsewhere the focus ring is a 2px Action Blue outline offset 3px (offset 4px on a question, 2px on a pill track), and a filled blue button takes a Cover Ink outline instead so the ring is visible against its own fill.
- **Error:** a 13px line in Redline under the actions, shown only when a send fails, with the phone number in it.
- **Success:** a paper panel with a rotated "Request logged" stamp in Cover Ink, one sentence, then the three next steps as hairline rows under a Cover Ink rule on 30rem: an Action Blue counter in 600 with tabular figures, the step at 15px / 1.5 in Cover Ink, and a call line under them at 14.5px in Second Ink.
- **The booking's order:** the fields are the booking, so they come first, two by two (name and suburb, phone and a preferred day; one column below 520px), where three and one left the fourth field alone on its row. What the visitor has already said rides above them as "What you told us", a 13.5px Third Ink label over their words in Cover Ink. The taste check is an optional extra between the fields and the button, under a hairline. Once the visitor has picked an answer in the hero or ticked a sign under the kettle it folds behind one quiet disclosure line ("Add how it tastes (optional)": Hanken 15px 500 in Second Ink with a drawn down chevron, 44px tall, Action Blue on hover and focus). A 13.5px Third Ink line under the actions, on 56ch, says what happens next before the button is pressed.
- **The schedule under the form:** three rows, one per stage, in sentence case (the stage, then what it is there for), each opening to the datasheet's terms and what is in the cartridge. What the system does not do follows, on the 72ch cap.

### Navigation
A fixed header that morphs continuously with the scroll rather than flipping between states. It has two states.
- **Attached** (scroll 0): a full-width bar at most 1240px, 72px tall, square, seated on the page by a one-pixel shadow. Compact lockup at left; at right the text links, a phone number with a drawn handset glyph, the Action Blue pill, and a 38px round quick-menu button that opens the radial route menu.
- **Detached** (scroll 260px): a floating pill at `min(920px, 100vw - 28px)`, 56px tall, 999px corners, 10px from the top, lifted by the Nav-seat shadow. Width, height, radius and inset are interpolated every frame from one scroll scalar; there is no transition on those four, because the scroll is the timeline.
- **Through the journey** the pill stays. It used to collapse to an orb; the phone number and the test action now stay one tap away the whole way down, and the quick menu is the round button inside the pill.
- **Links** are The system, Installation, Servicing and Questions, 14px in Second Ink, Cover Ink on hover, with a 1px Action Blue underline on the current page. Below 1180px the phone number keeps its glyph and drops its digits.
- **Moving around:** a link to a home section glides there rather than jumping. The travel time scales with distance between 0.75s and 1.9s on an expo-out that leaves quickly and lands slowly, and the section's own top edge lands at the top of the screen. The landing is checked once on arrival and the remainder glided over 0.45s if the page moved under the glide (an answer still opening in the hero, a picture arriving above the target); a visitor who takes over the scroll is left alone. The first jump away from the plain page is pushed and later jumps replace it, so Back returns to where the visitor was reading and never has to retrace every section in turn. A link to a target with no box (the journey under reduced motion, without WebGL, or once the scene has given up) lands on what follows it in the document, the static story. A link to another page fades the page and the footer out over 0.17s and the next page in over 0.44s on the open curve. The fade is opacity only, never a transform, because a transformed ancestor would turn the machine's fixed canvas into one that scrolls. The first page a visitor opens does not fade in.
- **Phone menu** (below 860px): the links and the quick-menu button hide behind a 42px, 10px-cornered burger, and the menu drops under the bar as a Paper sheet, falling open over 0.46s with a little give (`cubic-bezier(0.22, 1.04, 0.36, 1)`) while its rows arrive 40ms apart. It lists the nav's own links, then the rest of the site in two columns (Resources, Service areas, About, Contact) at 15px in Second Ink, then the booking row as the Action Blue pill. The page you are on is marked: 600 in Cover Ink with a 6px Cover Ink dot before it. While the menu is open the phone bar steps down, so one blue pill is on screen. A list is easier to hit and easier to read out than a ring.
- **Footer:** the whole site in three short columns (The product, Answers, The business), on Paper; two columns below 1100px and one below 560px.

### The Machine (signature)
One scene fixed behind the page, with the closed cover fitted into the hero's anchor box every frame while the hero is on screen. A drag turns it (yaw clamped to ±1.1), a tap lifts the cover as a rigid body, and the journey scalar then opens each housing in section, runs the water and sets the bowls down. The hero options drive the same scene: a chosen answer in the question hero, or a chosen stage row or pinned mark in the open-machine hero, lifts the cover and cuts that housing open in section with its water running. In the journey a housing under the pointer answers on its disc on the rail, and a click on it goes to its stage. The camera rail, the callout driver and the post driver share the one journey scalar, and the field of view narrows from 38 to 34 degrees as a housing opens while the focus rides the part being discussed. Every dimension is a centimetre in `dims.ts`. Materials (`materials.ts`) are the datasheet's: satin grey polypropylene housings, satin-black heads, a powder-coated frame and folded-sheet cover in #a1a3a5 with charcoal lettering, brass connectors, copper pipe, stainless and gauge glass. The media inside the cartridges (`media.ts`) are drawn on a canvas from a seeded random as macro beds with colour, height and roughness maps drawn together, so a still matches the page. None of these are UI tokens.
- **Lens** (`PostChain.tsx`): parked on 19 Sep 2026 (issue 75). The chain is written, in order: ambient occlusion, depth of field, bloom at 0.26 above a 0.92 luminance threshold, chromatic aberration at (0.0005, 0.0003), a 0.4 vignette and 0.14 grain. None of it had ever reached the screen, because a failed multisample resolve discarded the pass it had been merged into. The look that was signed off is the plain render, so that is what the page draws: the scene through the composer's 4x multisampled half-float buffer, copied to the screen. The chain is mended and sits behind `?nglens=` (`all`, or any of `ao,dof,bloom,ca,vig,grain`) for a look-dev round. As written it is heavy: the depth of field softens the housing labels and the grain sits on the white bowls. `/dev/machine?post=1` shows it whole. While the composer is mounted the renderer's tone mapping is off and the chain has no tone-mapping effect, so the medium and high tiers are not tone mapped. The low tier has no composer and gets Neutral at exposure 1.
- **Tiers** (`quality.ts`): high, medium and low, chosen from pointer type, cores, memory and screen, overridable with `?ngtier=`. High gets dpr up to 2, transmissive glass, decals, 130 condensation beads, full normal-map relief, the hardware details and a reflecting floor, and depth of field with the rest of the lens chain once the lens is switched on. Low gets dpr 1 and no post chain at all. A phone gets a scene that still looks like the machine; it does not get the film lens.
- **Floor:** the contact shadow's target is wiped every frame (`ClearedContactShadows` in `Studio.tsx`). The composer leaves the renderer's auto-clear off and drei never clears that target itself, so the bowls set down at servicing used to leave ring marks on the floor for the rest of the visit.
- **Fallbacks:** until WebGL is live the hero shows the poster (Layout, The poster), the live scene's own frame at each layout, handed over after 8 settled frames. Under `prefers-reduced-motion` the journey and the scene are removed outright (`display: none`) and a static story shows the same beats with a 6px-cornered still per stage. A visitor with no scene gets the same hand-over (`html[data-ngstatic]`): no WebGL, a context lost and not restored within four seconds, or a scene that has not come up in 25 seconds. The pinned section and the fixed layer go and the static story stands in, so nobody scrolls ten screens of empty set.

### The Journey's Rail (signature)
A ten-screen pin has to say where the visitor is in it. The rail is one line along the foot of the pinned frame, read left to right the way the water goes through the machine, and every stop on it is a jump. It borrows the numbered path's language and sits on a frosted pane like the nav's.
- **Pane** (`rail-pane`): a 50px pill, as wide as `min(1040px, 100vw less the two beat gutters)`, centred `clamp(18px, 3.2vh, 34px)` above the foot of the frame, on 93% near-white (rgba(250, 251, 251, 0.93)) over an 8px blur at saturate 140%, with the Rail pane shadow. It comes up over 0.35s once the section has pinned and leaves with the frame. Its own trigger starts 2px early, so a jump to the first stop still finds it, and it shows itself whenever it holds focus. The trigger's state is always handed to the class as a boolean and set again on every refresh: a trigger made before the first refresh reports `undefined`, which a bare `classList.toggle` reads as "flip", and the rail once rode up a phone's screen inside the entering set.
- **Line:** a 2px rail at 14% ink with a Cover Ink fill scaled from the left. There is a stop for every beat: a 9px disc on #fbfbfb with a 1.5px ring at 42% ink (`rail-stop`), and for each of the three stages a 24px numbered disc with a full ink ring and a Satoshi 700 numeral at 12.5px (`rail-stop-stage`). A stop that has been reached fills Cover Ink with a white numeral (`rail-stop-lit`), and the current one stands larger (1.45, or 1.16 on a numbered disc). Where hover exists, a stop under the pointer takes a second 4px ring at 14% ink and nothing moves.
- **Name:** the current stop is named at the left in 13.5px Hanken, the key in Second Ink at 500 ("Stage 2 of 3") and the title in Cover Ink at 600 ("Taste and smell"), cut with an ellipsis before it crowds the line.
- **Tags** (`rail-tip`): every stop names itself on hover or focus in the callout tag's paper: 97% white, 4px corners, `7px 11px 8px`, 13.5px, the tag's shadow, with "Yours" after a hairline on the visitor's own stage.
- **Skip** (`rail-skip`): a quiet ink "Skip the section" at the far end, a 36px pill in Hanken 13.5px 500 and Second Ink with a drawn down chevron, filling 5% ink and going Cover Ink on hover. It lands past the section, with the next section's top edge at the top of the screen. Between 901px and 1080px, and on a phone, it says "Skip".
- **Geometry:** on a wide screen a stop stands where its beat starts in the scroll and the fill is the scroll fraction, so the line is honest about how far there is to go. A stop becomes current the moment its beat opens (its p is the beat's own start), so the name at the left never trails the copy on screen. A jump parks where the beat's picture has settled, a stage with its housing fully open. The pin's start is re-measured whenever the page above it changes height (a hero answer opening, a ticked sign), so a jump never lands long.
- **On a phone** the rail tucks under the nav (`top: 74px`, 44px tall), where it cannot cross the housing being shown. It keeps its line and the skip: the name and the tags go, the two beats the phone cut skips are hidden, and the rest are spaced evenly on a 236px track, a thumb apart, as 36 by 44px targets (204px and 32px below 380px) with the fill running stop to stop. The caption card names the stop and carries Back and Next along its foot above a hairline: 44px tall, Hanken 14.5px, Next in Cover Ink at 600 ("Next: stage 2"), Back in Second Ink at 500, each with a drawn chevron.
- **Keyboard and screen reader:** the line is one tab stop, a toolbar with a roving tabindex on the current stop. The arrow keys, Home and End move along it, and the skip is the next tab stop. `aria-current="step"` marks the stop. Focus draws a 2px Action Blue ring outside a gap of the pane's white. A polite live region names the stop 600ms after the scroll settles on it, so a scroll through several beats is announced once.
- **The machine answers:** a housing under the pointer lights the ring of its disc, and a click on a housing goes to its stage, so the two read as one control. The reveal beat says so on wide screens ("Click a housing to go straight to its stage."). On a phone that sentence is dropped, because the card has Next.
- **The visitor's own water** (`content/yourWater.ts`): what was picked in the hero or ticked under the kettle points at a stage. That stage's disc carries a 9px Water dot ringed in the pane's white, and its label says it is the one for what they mentioned. Its beat carries one line in their words behind a 10px Water live dot (`dot-told`): 15px / 1.55 in 500 and Cover Ink on 40ch, under a 22% ink rule. The beat before the stages offers the jump ("Yours is stage 2. Go straight to it"), set in Cover Ink with a 1.5px underline over the set and in Action Blue on the phone's paper card. The line claims only that the stage is there for what they mentioned, never an outcome at the tap.

### The Screen-Space Callout (signature)
A dot on the part, a hairline leader and a paper tag in the margin, drawn as HTML over the canvas so the type stays crisp while the leader stays attached to the part. The dot is a 10px white disc with a 1.5px Cover Ink ring; the leader is a 1px Cover Ink line 64px long, scaled from the end nearest the dot; the tag is 95% white at 4px corners, `7px 11px 8px`, 14px Hanken 500, at 74px from the anchor and no wider than `min(230px, 18vw)`, so on a small desktop it wraps sooner and stays inside the frame. Each is anchored to a point on the model in centimetres and placed clear of the bowls' printed stage labels. It is timed, never scrubbed: crossing into its window sets `is-in` and CSS draws the dot (scaling in over 0.4s from 0.25s) and the leader along its length (0.5s from 0.4s), both on the open curve, then the tag (a 0.35s ease-out fade from 0.62s), with each tag in a group 0.2s after the last (`--d`); leaving is one 0.2s fade with everything where it stands. A tag that would cross the nav pill or leave the frame (8px guard) stays out. Desktop only.

### The Hotspot Plate (signature)
A photograph presented as a plate: 8px corners, the ring and the Plate shadow, sized so it is never taller than a screen less 150px, sitting in the flow of the page. It does not stick and has no runway. Once 45% of it is on screen its parts draw in by time, one after another, 0.55s apart: a 36px numbered hotspot scales in from 0.6, its 2.2px Cover Ink leader draws along its own length over 0.9s on the open curve, and its note rises 10px into place. A hover, focus or tap on a mark brings that one forward: the other leaders dim to 0.25 and the other notes to 0.4. Below 860px the leaders and notes are dropped, the marks stay on the plate at 30px, and a list of tappable 6px-cornered key rows under the photograph carries the same notes with the same numbered discs (a held row takes a Cover Ink edge and a filled disc). Under reduced motion the plate is drawn whole at once. A Third Ink caption under it says so in one short line: "A visualisation."

Under the plate, after a hairline, comes the signs checklist on a 5/7 grid: a 21px Satoshi 700 heading and a 15.5px note on 40ch, then the taste chips, then a readout that gives one sentence per stage for every ticked sign (signs that share a stage are grouped) and names that stage in Cover Ink at 600 inside the sentence, with a Third Ink idle line and its height held before anything is ticked. The blue pill and a quiet link close it, and what is ticked goes with the booking.

### The Numbered Path (signature)
Four equal columns, each a 4:3 photograph waiting at 0.8 opacity and `saturate(0.7)` until its step lights (it waited at 0.5 and 0.6 until 19 Sep 2026, which read as a picture that had failed to load), a 34px numbered disc on a 2px connector rail that fills from the left, a 19px Satoshi title and a 15px paragraph. On phones the columns stack, the rail is dropped and every photograph is lit, because a four-step rail read as decoration in one column. One line under the row says the four pictures are visualisations.

### The Placeholder Mark (signature)
Redline text on a 7% Redline tint with a 1px dashed 45% Redline border, 2px corners, `1px 6px`, at 0.86em, set in Hanken by its own rule in `sections.css`: the re-pointed mono variable was losing to Geist Mono's variable on `html`, which the layout no longer applies. The tint is 7% rather than 10% because at 10% the mark measured 4.44:1 on the Paper band. Set inline wherever a figure has no source. Apart from the form's line when a send fails, it is the only red on the page.

### The Water Bead Cursor (signature)
A 26px disc that follows the pointer and grows to 54px over anything marked `data-cursor`. It reads by its rim and one specular rather than by brightness, because a bright bead on pale paper disappears: three radial gradients (a white highlight at 34%/26%, a Water wash low and right, a Deep Blue edge), a 50%-alpha Deep Blue border, an inset shadow that lenses the paper darker under it, and a 0.6px backdrop blur. It is gated on the input rather than the width (`hover: none`, `pointer: coarse`) so a narrow desktop window keeps it and a hybrid device does not get a stuck bead.

### The Hairline Row (signature)
A definition list with a solid Cover Ink top rule, 9 to 20px rows divided by hairlines, keys in Label (Third Ink) on a `minmax(0, 170px)` column and values in Row (Cover Ink) with tabular figures. The spec table, the stage facts, the concept notes, the installer's facts, a package's contents and the footer index are all this one component. The new pages add its relatives, each opening on the Cover Ink rule or dividing on the hairline: the resources list (one read per row at `22px 40px 22px 0`, a Title-tier name, a 15.5px description, a 13px source line and an up-right chevron, the name and chevron going Action Blue on hover); the service-area suburbs set in columns (`columns: 3 9em`, 6px rows at 15.5px in Cover Ink); the side-by-side table (15px cells, 13.5px Third Ink heads, row heads at 600 across 28%); and an article's sources foot (a 19px heading over a hairline, a numbered list at 14.5px in Second Ink with Cover Ink links underlined at 30% that go Action Blue on hover, and a 13px Third Ink detail line under each). Where a block opens on a table, the table's ink rule stands alone and the heading drops its hairline, so two rules never stack.

### The Hardness Chart (signature)
A table drawn as a chart, so it reads as a chart and is still a table to a screen reader. A 19px Satoshi title with a 13px Third Ink line under it sits over a Cover Ink rule, beside the small pill track that sorts it. Each row is a suburb with its value in tabular figures and a bar on an 18px track: the bar is Third Ink, the measured range is a 1.5px Cover Ink line through it, the guideline is a 1px Cover Ink rule running across every row, and a 4% ink band marks the soft end of the scale. A row whose mean is over the guideline takes a Cover Ink bar and 600. Heads are 13px 500 in Third Ink, rows divide on hairlines, and below 640px the range columns drop. A 13px Third Ink caption names the source.

### The Sheet (the interior page shell)
Every page but the home page sits in one shell, reading on 760px. It opens on a trail (Home, any crumbs, then the page) in 13px, each crumb underlined at 25% ink and Action Blue on hover, never breaking inside itself. Then the title, the lead and, for a read, a byline under a hairline (13.5px Third Ink on 60ch). One photograph sits under the title block, cropped to the sheet's band or shown whole at its own proportions where its subject runs edge to edge, with a caption wherever it is generated. The body is plain blocks of heading and prose, with no card and no icon. An optional slot after the body carries an article's sources. The sheet closes on the one card with the one blue pill and a call link. The contact page puts its number first, on the headline step between a Cover Ink rule and a hairline, going Action Blue on hover.

## Do's and Don'ts

### Do:
- **Do** give every surface one filled pill in Action Blue and make its second action a quiet link or a hairline outline.
- **Do** step the phone bar down wherever the screen already shows a blue pill: a page's own pill at least half in view, the booking form, the open menu.
- **Do** name a stage inside a sentence in Cover Ink at 600; the blue belongs to the pill.
- **Do** set the big line in Satoshi Medium (500) at -0.03em or tighter, wrapped to two lines with a hard break, with one Hanken sentence under it in Second Ink on a 42 to 44ch measure.
- **Do** set labels and keys in Hanken 500 at 13.5px, sentence case, Third Ink, tracking 0 to 0.02em.
- **Do** put facts in hairline rows with a solid ink top rule, key left and value right, tabular figures.
- **Do** alternate Page White and Paper down the page, and paint an opaque ground on every new section so the set shows only through the hero and the journey.
- **Do** measure copy that sits over the set, place it in the pool of light, and give it full Cover Ink; 5.10:1 is the floor the build holds.
- **Do** give a rounded panel a one-pixel hairline ring instead of a border.
- **Do** keep the machine live: the scene is the picture, and a raster stands in only until WebGL is up or when motion is reduced.
- **Do** cut a hero poster from the live scene at the layout it serves, framed as the scene frames the cover, and hand over only once the scene has drawn settled frames.
- **Do** mark any unsourced figure with the red dashed `[PLACEHOLDER]`, caption a generated image on the page it appears on in one short plain line ("A visualisation."), and add a row to `public/photos/PROVENANCE.md` for any raster that ships.
- **Do** cut every still through the same lens chain the page uses, so a still never looks like a different camera.
- **Do** open a row by growing its grid track from 0fr to 1fr on the open curve (`cubic-bezier(0.22, 1, 0.36, 1)`), the way the questions and the hero's answers open.
- **Do** glide to a section and move between pages on opacity alone.
- **Do** keep the reduced-motion path whole: no pinned journey, no scene, the same story as a document with a still per stage, and every drawn-in part shown at once. Hand the same document to a visitor whose scene never comes up (no WebGL, a lost context, 25 seconds without a frame).
- **Do** leave the nav's four morph properties untransitioned; the scroll is the timeline and a transition on top of it reintroduces the lag.
- **Do** scrub the picture and time the copy: a beat is in or out, and its entrance and exit run on the clock.
- **Do** say where the visitor is in a pinned section and give them a way past it. The rail is one tab stop with a stop for every beat, and its skip lands past the section.
- **Do** mark the visitor's own stage with a Water dot and say their words back in Cover Ink. Claim only that the stage is there for what they mentioned.
- **Do** put a form's fields first and fold an optional extra behind one quiet line. Say what happens next before the button, and again after it.

### Don't:
- **Don't** introduce a third blue, a blue background or a blue border token; Action Blue fills the action and colours links, Deep Blue is its hover, Water marks water.
- **Don't** set type in Water, or in Second Ink over the set; both fall under the floor.
- **Don't** paint a gradient on a flat surface, a button or a heading. The set's falloff is a lit backdrop produced by a shader; the nav pane and the cursor are materials. Nothing else gets one.
- **Don't** use a monospace or a drafting face on a text surface, tracked uppercase, sheet numbers, sheet strips or registration ticks; the drawing set is retired and the two face variables are re-pointed so it cannot come back.
- **Don't** use the installer's teal, their ink, their shadows or Clash Display outside their band, and don't dress a second section in anyone's livery.
- **Don't** float a number above a section as an `01` marker. A counter belongs inside the thing it counts.
- **Don't** put a scrim, a halo or a text shadow behind copy over the set; move the copy or step the camera aside.
- **Don't** build a feature-card grid, a stats band or a testimonial carousel; the direction contract refuses the category's furniture. A rounded panel is for a picture and its list together, not for three parallel claims.
- **Don't** drift toward wellness: no sage or blush, no rounded friendly type, no droplets or leaves as decoration.
- **Don't** quote a reduction percentage or any figure without a source document; describe the mechanism instead, in the datasheet's own terms.
- **Don't** let a hover state move anything. A hover is a fill change, a border darkening or a colour change. A press may compress (the quick-menu button at 0.94) and a mark may scale in as it arrives; neither is a hover. A toggle that stays on screen after a tap takes its blue hover only under `(hover: hover)`.
- **Don't** pin a second section. The journey is the one place the scroll is held; the kettle draws its notes in by time once it is on screen.
- **Don't** scrub copy to the scroll. Words tied to the scroll position stop half-risen wherever the scroll rests; set a class at the window's edge and let CSS run the entrance and the exit.
- **Don't** put Action Blue type over the set; it falls under 4.5:1 there. A link on the set is Cover Ink with an underline, and the blue comes back on paper.
- **Don't** set anything that worked in red. Redline is for an unsourced figure and a failed send.
- **Don't** let a sticky column release over the next section; give it a runway inside its own.
- **Don't** put a transform on a page wrapper or on any ancestor of the scene; it turns the fixed canvas into one that scrolls.
- **Don't** add to `globals.css` or `brand.css`. They are the retired world's stylesheets, kept only until they are pruned; new rules go in `world.css` or `sections.css`. The `--ease` curve and the placeholder mark's base rule still live in them, so move those before pruning.
