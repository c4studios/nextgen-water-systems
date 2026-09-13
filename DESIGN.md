---
name: Next Gen Water Systems
description: One machine at the mains, shown as a drawing set. A near-black void with one pool of light, ice type, and cyan only where water or light is.
colors:
  void: "#0a0a0b"
  pool: "#1a1b1d"
  pool-mid: "#0e0e10"
  surface: "#151617"
  ice: "#f4f9fc"
  prose: "#d3dce2"
  steel: "#b5b9bd"
  muted: "#7d838a"
  line: "rgba(244, 249, 252, 0.1)"
  rule: "rgba(203, 224, 236, 0.13)"
  rule-soft: "rgba(203, 224, 236, 0.055)"
  cyan: "#29c2ee"
  deep: "#0f6fb0"
  glass: "rgba(250, 252, 254, 0.86)"
  glass-ink: "#0d1216"
  glass-link: "#47535c"
  metal: "#d8ecf6"
  metal-ink: "#04222f"
typography:
  display:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(40px, 5.1vw, 74px)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.034em"
  headline:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(30px, 5vw, 56px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(17px, 2vw, 22px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(16px, 1.5vw, 18.5px)"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "normal"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Routed Gothic, Geist Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.16em"
  readout:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.16em"
    fontFeature: "tnum"
  dimension:
    fontFamily: "Routed Gothic Narrow, Geist Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  note:
    fontFamily: "Routed Gothic Half Italic, Geist Mono, ui-monospace, monospace"
    fontSize: "clamp(11px, 1.35vw, 16px)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0"
  tag: "2px"
  chrome: "4px"
  rail: "10px"
  photo: "14px"
  pill: "999px"
spacing:
  hairline: "1px"
  gutter: "clamp(18px, 5vw, 34px)"
  cover-inset: "clamp(22px, 6vw, 96px)"
  strip: "clamp(28px, 5vh, 56px)"
  section-tight: "clamp(56px, 8vh, 96px)"
  section: "clamp(88px, 12vh, 148px)"
  maxw: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.metal}"
    textColor: "{colors.metal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "16px 26px"
  button-primary-hover:
    backgroundColor: "{colors.metal}"
    textColor: "{colors.metal-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
  button-ghost-hover:
    backgroundColor: "rgba(244, 249, 252, 0.08)"
    textColor: "{colors.ice}"
  button-ice:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.void}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  chip-taste:
    backgroundColor: "rgba(21, 22, 23, 0.55)"
    textColor: "{colors.steel}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "9px 13px 9px 11px"
  chip-taste-on:
    backgroundColor: "rgba(21, 22, 23, 0.55)"
    textColor: "{colors.ice}"
  chip-taste-live:
    backgroundColor: "rgba(41, 194, 238, 0.1)"
    textColor: "{colors.ice}"
  input-drafted:
    backgroundColor: "rgba(10, 18, 27, 0.7)"
    textColor: "{colors.ice}"
    typography: "{typography.readout}"
    rounded: "{rounded.none}"
    padding: "12px 13px"
  input-drafted-focus:
    backgroundColor: "rgba(41, 194, 238, 0.06)"
    textColor: "{colors.ice}"
  sheet-strip:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    padding: "0 0 12px"
  note-panel:
    backgroundColor: "rgba(21, 22, 23, 0.5)"
    textColor: "{colors.steel}"
    rounded: "{rounded.none}"
    padding: "22px 24px 24px"
  nav-glass-bar:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.glass-ink}"
    rounded: "{rounded.none}"
    height: "72px"
  nav-glass-pill:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.glass-ink}"
    rounded: "{rounded.pill}"
    height: "56px"
    width: "760px"
  nav-glass-orb:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.glass-ink}"
    rounded: "{rounded.pill}"
    height: "62px"
    width: "62px"
  chrome-titleblock:
    backgroundColor: "rgba(8, 14, 20, 0.78)"
    textColor: "#aeb9c2"
    typography: "{typography.label}"
    rounded: "{rounded.chrome}"
    width: "220px"
---

# Design System: Next Gen Water Systems

## Overview

**Creative North Star: "The Living Drawing"**

The site is one engineering drawing set for one machine. A cover sheet says what the thing is in the visitor's own words, shows the machine live, and names who fits it. Five sheets follow in the order a set would file them: the evidence (your water, a kettle marked up like a site photograph), the general arrangement (the machine in section, scrubbed by the scroll), the hydraulic services plan (where it goes), the installer's note, and the booking sheet, where the set is stamped APPROVED FOR ISSUE. Every section carries the set's own furniture. A sheet strip runs along its top edge, registration ticks hang off each divider, and a fixed title block re-stamps as each sheet enters. The visitor learns the filing system once and then reads a site with an index instead of a long dark scroll.

The world is a near-black void with one pool of light in it. The machine is photoreal brushed steel, rendered once in WebGL and fixed behind the page; the cover and the journey are two windows onto it, and every other sheet is an opaque page laid over it. Type is ice on the void. Cyan appears only where water or light is. The drawing letters in Routed Gothic, the digitised draughting-template face. The brand speaks in Satoshi and the sentences are set in Hanken Grotesk. Restraint is the premium signal: the ground carries a paper grain and a faint ruling you feel rather than read, and nothing is decorated.

Confirmed rejections, from the build and the brief: the product-hero, three-cards, testimonials, form page order; the chrome-less scroll film this set replaced; graph-paper backdrops (the measurement grid exists once, diegetically, on the plate during the trace); cream paper (the sheet is a lit dark drafting surface); a blue-tinted backdrop (the pool is neutral graphite so the steel reads as steel); type over a photograph with a scrim; the wellness register the client rejected (sage, blush, rounded friendly type, leaves or droplets as decoration); card grids where a schedule will do; and any figure, review or endorsement that cannot be substantiated.

**Key Characteristics:**
- One fixed scene, two windows onto it, opaque sheets over it
- Sheet strips, title blocks, a revision rail and registration ticks as the navigation furniture
- Ice type on a neutral void, with cyan reserved for water and light
- Four faces with one job each: Satoshi, Hanken Grotesk, Routed Gothic, Geist Mono
- The scroll is the timeline: the nav morphs, the plate traces itself, headings form out of water, the plan fills
- Every motion has a reduced-motion equivalent that tells the same story standing still
- Stadium pills for actions, square furniture for the drawing, hairlines for everything structural

## Colors

A neutral dark ground with ice type and one chromatic accent, held back until there is water or light for it to be.

### Primary
- **Cyan** (#29c2ee): water and light. The run filling on the plan, the fitting it reaches, the vessel the taste check lights, the leader drawn onto the kettle, the tick in a checkbox, the sheet numeral in the strip, the focus ring and the text selection. It is also the word *water.* in the booking headline, and nothing else in a heading. On the void it is a line, a dot, a numeral, or a 6-20% tint (`rgba(41, 194, 238, 0.06)` to `0.2`) behind an active row. It is never a fill behind a paragraph.

### Secondary
- **Deep** (#0f6fb0): cyan's job on the light glass, where cyan would not hold contrast. The active-link underline in the nav bar, the numerals and the call to action in the phone menu sheet, the lower stop of the logo mark's gradient. It does not appear on the dark ground.

### Neutral
- **Void** (#0a0a0b): the page. Also the theme colour and the far stop of every pool of light.
- **Pool** (#1a1b1d through #0e0e10 to void): the one radial pool of light (50% by 42%, centred at 50% 40%). The CSS ground and the GL backdrop are generated from the same three stops, so the machine floats in one atmosphere with no seam. Its chroma is zero on purpose: a blue pool tinted every reflection on the steel.
- **Surface** (#151617): a raised panel. Used at 50-55% alpha behind the taste chips and the installer's notes, and solid behind the interior sheets' closing panel.
- **Ice** (#f4f9fc): headings, values, active labels, and the ink of the plate's trace before it settles. The journey's beat headings and the booking headline run a hair cooler (#eef7fc); treat that as drift toward ice, not a second token.
- **Prose** (#d3dce2): sentences on the void. Body copy inside sheets, answers, schedule details. Lighter than steel because a paragraph needs it; leads stay steel.
- **Steel** (#b5b9bd): leads, captions, secondary values, resting chip labels, the sheet strip's title.
- **Muted** (#7d838a): tertiary. Field labels, the strip's count, resting rail stops, footnotes, the label half of a fact pair.
- **Line** (rgba(244, 249, 252, 0.1)): the hairline. Every border, divider and row rule in the document is this, one pixel wide.
- **Rule** (rgba(203, 224, 236, 0.13)) and **Rule, soft** (rgba(203, 224, 236, 0.055)): the sheet furniture. Divider rules with their registration ticks, the 64px ruling under a ruled section, the plate's tie rules and corner marks.
- **Glass** (rgba(250, 252, 254, 0.86) fading to rgba(238, 244, 248, 0.78)): the frosted nav band, with **Glass ink** (#0d1216) and **Glass link** (#47535c) as its own text pair. It is the one light surface on the site.
- **Metal** (#d8ecf6) and **Metal ink** (#04222f): the liquid-metal pill's resting surface and its label. The brushed bands run only in the light half of the range (#ffffff, #cfe6f2, #f2fafd, #b7d8e9) so the label holds 4.5:1 against the darkest band.

The machine is a palette the page never states in CSS: brushed steel (#c9cecf, metalness 1, roughness 0.33, clearcoat 0.5, anisotropic), charcoal caps and heads (#79848e, #23272c), a powder-coated frame (#2c3034), brass ports (#b28a4e), under a neutral three-point rig (key #f2f3f4 at 0.85, rim #e9ebed at 0.6, fill #c9ced2 at 0.22, ambient 0.12). A vessel the taste check names lights from inside (emissive #29c2ee on a #7fe4ff core).

The two approval stamps, on the general arrangement and on the logged booking, print in a redline ink (#e2765c on the plate, #e15b41 on the REQUEST LOGGED stamp). It is recorded here as a mark on a document, not as a colour role.

### Named Rules
**The Water-or-Light Rule.** Cyan is used only where water or light physically is: a run filling, a fitting served, a vessel lit, a leader onto evidence, a tick, a focus ring, a numeral in the index. Never a heading colour, never a gradient, never a background wash.

**The Neutral Ground Rule.** The void and its pool of light carry no chroma. Every reflection on the steel is therefore neutral, and the one colour that does appear is deliberate.

**The Hairline Rule.** Structure is drawn, not filled. One-pixel rules at 10-13% ice, with registration ticks where a sheet edge is, instead of boxes with backgrounds.

## Typography

**Display Font:** Satoshi (with ui-sans-serif, system-ui, sans-serif), self-hosted at 400, 500 and 700
**Body Font:** Hanken Grotesk (with ui-sans-serif, system-ui, sans-serif), self-hosted variable 400-600
**Label/Mono Font:** Routed Gothic, Routed Gothic Narrow and Routed Gothic Half Italic (the digitised Leroy draughting-template lettering, SIL OFL), and Geist Mono at 400 and 500

**Character:** A calm geometric grotesque for the brand's voice, a humanist grotesque for reading, and a draughtsman's hand for everything the drawing itself says. Headings are set tight and low; labels are small, tracked and in capitals, the way a template letters a sheet. Nothing is italic for warmth. The half-italic exists for one thing: the draughtsman's note.

### Hierarchy
- **Display** (500, clamp(40px, 5.1vw, 74px), 1.02, -0.034em): the cover's outcome line only. Medium weight, not bold, because the line under it is the machine. On phones it drops to clamp(36px, 10.4vw, 46px).
- **Headline** (700, clamp(30px, 5vw, 56px), 1.04, -0.02em to -0.032em): the title of each sheet. The booking sheet runs larger (clamp(40px, 6.4vw, 84px), 0.98) because it is the close; the interior sheets run clamp(34px, 6.4vw, 62px). Headings are two lines, broken by hand.
- **Beat heading** (700, clamp(26px, 3.2vw, 44px), 1.04, -0.01em): the journey's copy beats. These form out of water: two blurred copies through an alpha threshold, driven by the beat's own scroll scalar.
- **Title** (700, 17-22px, 1.2, -0.02em): a stage name, a note's heading, a question, a footer index entry. Satoshi, never Hanken bold.
- **Lead** (400, clamp(16px, 1.5vw, 18.5px), 1.62-1.65): the paragraph under a headline. Steel, 44-54ch.
- **Body** (400, 15.5-16.5px, 1.62-1.72): sentences inside a sheet. Prose colour, 58-66ch, `text-wrap: pretty`.
- **Label** (400, 10.5-13.5px, 0.1-0.22em, uppercase): Routed Gothic. The sheet strip (11.5px, 0.16em), the cover's action (13.5px, 0.1em), the taste chips (12px, 0.12em), the inspector strip (12px, 0.1em), a view title under a beat heading (11px, 0.16em), a form field's name (10px, 0.2em), a stamp.
- **Readout** (400, 9.5-12px, 0.12-0.22em, tabular numerals): Geist Mono. The sheet numerals in the footer, the 404 and the trail; stage numbers; the exhibit's key numbers and its title strip; room and fixture names on the plan; the stage marker and the journey rail; the radial menu's label; the value typed into a field.
- **Dimension** (400, 14-15px, 0.02-0.06em): Routed Gothic Narrow, the 3.5mm template. Dimension values, balloon numerals and the plate's hover tips, all inside the SVG.
- **Note** (400, clamp(11px, 1.35vw, 16px), 1.5): Routed Gothic Half Italic, the 22.5 degree slant. The one lowercase line on the plate.

### Named Rules
**The Readout Rule.** Data letters; sentences are typeset. Routed Gothic and Geist Mono carry labels, figures, stamps and index numerals. Anything that reads as a sentence is Hanken Grotesk, and anything that reads as a heading is Satoshi. Monospace under a paragraph is costume, and it is what made an earlier journey read cheap.

**The Four Hands Rule.** Each face has one job. Satoshi is the brand's voice, Hanken the reading voice, Routed Gothic the drawing's own lettering (strips, view titles, dimensions, title blocks, stamps, field names), Geist Mono the page's index and instruments (sheet numerals, stage numbers, plan labels, rails, typed values). No face is chosen for a mood.

**The Tracked-Caps Rule.** Labels are capitals with positive tracking (0.1-0.22em) and small (10-13.5px). Headings are mixed case with negative tracking (-0.02 to -0.034em) and low leading (0.98-1.04). The two never borrow from each other. On phones, functional labels rise to a 12px floor; decorative sheet furniture keeps its size.

## Layout

One scene, fixed behind everything. The WebGL canvas sits at `z-index: -1` inside a fixed, full-viewport stage that also paints the pool of light. The cover and the pinned journey are the only two sections with a transparent background; every other section is an opaque `.ground` laid over the scene. The pool's centre follows whichever window owns the machine (the cover parks it under the machine anchor, the journey brings it back to 50% 40%). Pointer events fall through the windows to the machine and nowhere else.

The page measures 1240px (`--maxw`) with a horizontal gutter of clamp(18px, 5vw, 34px) inside sheets, and clamp(20px, 4vw, 40px) inside the nav wrap. The cover insets its copy at clamp(22px, 6vw, 96px) from the left edge. Reading measures are narrower: the how-it-works schedule runs at 980px, the interior sheets, the booking column and the static story at 760px.

The cover is a two-column grid, 11fr for the copy and 9fr for the machine anchor, with the inspector strip spanning both columns along the bottom edge. Copy is vertically centred with clamp(112px, 15vh, 168px) of top padding to clear the fixed nav. The machine anchor is at least 62svh tall and the scene fits the machine to it every frame. Below 900px the copy column dissolves (`display: contents`) and the grid re-orders: outcome line, body, action, the machine (30svh), the taste check, then the inspector strip, so a tick still lights something on screen.

Sheets open with their sheet strip (SHEET n, title, an optional note, n / 05) and close on a drawn edge: a divider rule that dies away before the page edge, registration ticks every 10% of its width, and a centring mark mid-edge. Vertical rhythm is one token, `--sec-y` (clamp(88px, 12vh, 148px)), used as the top and bottom padding of every sheet; `--sec-y-tight` (clamp(56px, 8vh, 96px)) is the footer's floor. Section heads are a two-column grid (1fr 1fr, aligned to the end) with the headline left and the lead right; the installer sheet runs 7fr 5fr with its notes on the right. All of them stack to one column at 900px.

Anything that scrolls in place is held by a sticky plate inside a bounded block, with progress measured off a runway that never sticks: the exhibit's plate (top clamp(84px, 11vh, 128px), a 96vh runway) and the plan (top clamp(84px, 11vh, 132px), a 52vh runway). The sticky's containing block ends where the runway ends, so the plate lets go before the copy underneath it. The journey pins for 1050svh on desktop and 620svh on phones, which play a shorter cut of the same timeline; it hangs 24svh into the section above it, and that section reserves the overlap in its bottom padding.

Breakpoints as built: 640px (strip notes and captions simplify, chips compact, exploded-part cards become a bottom sheet), 760px (the drawing chrome hides, journey beats move to the base of the frame), 860px (the nav bar becomes a burger and a dropping sheet, the exhibit's leaders give way to a numbered key), 900px (the mobile cut, the cover stack, the plan goes static, form fields go to 16px so iOS does not zoom), 1080px (detail callouts flow into a list), 1500px (the revision rail hides and the title block collapses to its two cells). Safe-area insets are honoured with `viewport-fit=cover`; pinch zoom stays available.

## Elevation & Depth

Depth is tonal and atmospheric, not stacked. The page has one light source, the pool, and things sit in it at different opacities: a dark panel at 42-55% alpha with a 6px backdrop blur reads as chrome floating over the drawing, a panel at 78-92% reads as a title block, and the ground's paper grain (a desaturated fractal noise at 5.5% alpha, blended soft-light) gives the void a surface without a gradient. Shadows exist only under two physical objects: paper and glass.

### Shadow Vocabulary
- **Paper** (`box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6)`): under the plate's sheet, and only while the paper exists; the shadow rises with the vellum and leaves with it, so there is never a shadow outlining an invisible card.
- **Glass** (`box-shadow: 0 18px 46px -20px rgba(0, 0, 0, 0.8)`, scaled by the detach scalar): under the nav once it has come off the top edge. While attached it has only a one-pixel seat (`0 1px 0 0 rgba(12, 18, 24, 0.1)`) and a hairline inside its own edge (`inset 0 0 0 1px rgba(12, 18, 24, 0.08)`). No bevel.
- **Halo** (`radial-gradient(closest-side, rgba(4, 8, 12, 0.85), rgba(4, 8, 12, 0.45) 55%, transparent)` plus `text-shadow: 0 1px 12px rgba(10, 10, 11, 0.85)`): behind every journey beat, so copy stays legible where bright steel passes behind it. A legibility device, not an elevation.
- **Water glow** (`filter: drop-shadow(0 0 6px rgba(41, 194, 238, 0.55))` and `box-shadow: 0 0 9px rgba(41, 194, 238, 0.65)`): on the filled run and a served fitting's marker. Light, not lift.

### Named Rules
**The Pool-of-Light Rule.** There is one light in the world, a neutral radial pool generated once and shared by the CSS ground and the GL backdrop. It moves with the machine. Nothing else casts light except water.

**The Paper-and-Glass Rule.** A box-shadow belongs only to something that is physically a sheet of paper or a pane of glass. Panels, notes, chips and rows are flat and drawn with hairlines; their depth is their opacity over the pool.

## Shapes

Two geometries, kept apart. Actions are stadium pills (999px): the liquid-metal button, the ghost pill, the interior sheets' ice pill, the nav in its pill and orb states, the hints and the stage marker. Drawing furniture is square: title blocks, revision tables, the bill of materials, the exhibit's plate and notes, form fields, schedule rows and the installer's notes carry no radius at all, and the taste chips carry 2px, the corner a stamp leaves. Between the two sit the chrome that floats over the drawing (3-5px on the title block, its rail rows and the small count tags; 10px on the journey rail and the burger) and, on the interior sheets, the photographs (14px) and the closing panel (16px).

Borders are hairlines at `--line`; the plate's inner frame is the one heavy rule (1.6px, #dce8f0). Stamps are bordered in their own ink and rotated a degree or two off square (-1.2 to -3 degrees). Sheet edges carry ISO-style registration ticks and a centring mark. The exhibit's plate is tied into its sheet by rules that run 50vw off both edges and by corner registration marks drawn 7px inside its frame. The focus ring is 2px cyan, offset 3px, with a 3px radius. Photographs are held in the site's cold register with a filter (saturate 0.6-0.88, contrast up to 1.1, brightness 0.8-0.96) rather than a tint overlay.

## Components

### Buttons
The primary action is a piece of liquid metal. Everything else is a hairline.

- **Shape:** stadium (999px) for every action on the site.
- **Primary, the liquid pill (`.lm`):** metal surface (#d8ecf6) with metal ink (#04222f), a 1px border at rgba(60, 120, 150, 0.42), padding 16px 26px, lettered in Routed Gothic uppercase at 13.5px with 0.1em tracking. The material is a `::before` layer inset by -30% carrying fine repeating brushed bands (#ffffff, #cfe6f2, #f2fafd, #b7d8e9 at 5-21px periods) displaced by a slowly animating turbulence filter (`#ng-liquid-metal`, scale 26, 14s cycle); the button's own `overflow: hidden` keeps the edge crisp while only the material moves. Applied to the three buttons that close the sale: the cover's action, the exhibit's hand-off, the booking submit. Nowhere else.
- **Primary hover / focus:** a specular sweep crosses once (`::after`, translateX from -118% to 118% over 0.86s on cubic-bezier(0.3, 0.7, 0.2, 1)); the border darkens to rgba(30, 90, 120, 0.7). Active: translateY(1px). Reduced motion drops the filter and the sweep; the banded gradient alone still reads as brushed metal.
- **Ghost pill:** transparent, 1px border at rgba(244, 249, 252, 0.22-0.28), steel or ice text, 14-15px, 38-48px tall. Hover fills rgba(244, 249, 252, 0.08-0.1) and lifts the border to 0.34-0.5. The nav's call to action, "Watch this stage in the drawing", the trail's home link, the 404's action (which tints cyan at 8-17%).
- **Ice pill:** solid ice on void, 48px tall, padding 0 24px, 600 weight at 16px; hover goes white and rises 1px. The interior sheets' closing action.
- **Text actions:** Routed Gothic uppercase at 12px with a chevron drawn from two hairlines (`.opening-more`), or a Hanken underline in steel (`.doc-call`). Hover turns ice.

### Chips
- **Style:** the taste chips are drafted checkboxes. Surface at 55% alpha, a hairline border, 2px corners, Routed Gothic uppercase at 12px and 0.12em in steel, with a 12px square box whose fill (cyan, inset 2px) scales in from zero.
- **State:** on: ice text, border cyan at 55%, box filled. Live (the one the machine is answering): a cyan wash at 10%. Hover: border to 30% ice, text ice. Ticked chips ride into the booking as a carried line.

### Cards / Containers
- **Corner Style:** square. No radius on anything that belongs to the drawing.
- **Background:** surface at 50% (`rgba(21, 22, 23, 0.5)`) for the installer's notes; rgba(244, 249, 252, 0.015-0.03) for the schedule's frame and head; rgba(6, 10, 13, 0.9) with a 7px backdrop blur for an exhibit note; opaque void with paper grain (`.ground`) for a sheet, plus a 64px ruling (`.ground--ruled`) on the schedule and booking sheets.
- **Shadow Strategy:** none. See Elevation.
- **Border:** hairline `--line` all round; an exhibit note carries a 2px cyan left edge; the schedule's exclusions block is set off by a hairline top and a darker fill (rgba(4, 10, 14, 0.5)).
- **Internal Padding:** 22px 24px 24px on a note; 13-15px vertical and clamp(14px, 2.4vw, 22px) horizontal on a schedule row; 11px 13px 12px on an exhibit note.
- **Schedule rows** (`.hiw-bar`, `.sched-row`): a grid of stage number (Geist Mono, cyan), name (Satoshi 700), a one-line value (muted), and a plus drawn from two 1.5px cyan strokes that rotates and loses its vertical when open. Panels open to a measured height on cubic-bezier(0.33, 0.02, 0.2, 1) over 0.46s and release to auto.

### Inputs / Fields
- **Style:** a drafted field on the dark sheet. Background rgba(10, 18, 27, 0.7), 1px border at rgba(127, 216, 245, 0.28), ice text in Geist Mono at 14px (16px on phones), padding 12px 13px, no radius. The field's name sits above it in Routed Gothic at 10px with 0.2em tracking in #7fa4bb; placeholders are #5b7181.
- **Focus:** no outline; the border goes cyan and the field takes a 6% cyan wash.
- **Error / Logged:** an error line in #ff9d8a. A logged request replaces the form with a bordered panel (cyan at 35%) carrying a rotated redline stamp, REQUEST LOGGED, and one sentence.
- **Grid:** `repeat(auto-fit, minmax(220px, 1fr))` with 16px by 18px gaps; the submit is the liquid pill with "or call" beside it as a Routed Gothic text action.

### Navigation
- **The band:** one fixed element that morphs continuously with the scroll. At the top it is a full-width bar of frosted glass (72px tall, up to 1240px wide, no radius); over the first 260px of scroll it detaches into a floating pill (56px tall, up to 760px wide, 10px from the top); inside the pinned journey it collapses to a 62px orb, 16px from the top, whose contents cross-fade from the bar to a single menu glyph. Width, height, radius, top and the two opacities are CSS variables written every frame from two scalars; the journey scalar runs through a time-integrated spring (stiffness 120, damping 18) so it overshoots and settles. Never add transitions to those variables.
- **The glass:** a light gradient (rgba(250, 252, 254, 0.86) to rgba(238, 244, 248, 0.78)) with `backdrop-filter: blur(16px) saturate(150%) brightness(1.06)`, refracted by a turbulence displacement (`#ng-liquid`, scale 12) applied to a bleed layer inside a clipped pane, so the silhouette never tears. One hairline inside the edge. No bevel. Where backdrop-filter is unsupported, a near-opaque rgba(243, 247, 250, 0.97).
- **Typography and states:** the brand is Satoshi 700 at 17px beside a 30px logo mark (a droplet, cyan to deep). Links are Hanken 14px in glass link (#47535c), ice-dark (#0d1216) on hover, with a 1px deep underline when current. The call to action is a hairline pill in glass ink that fills #0d1216 with ice text on hover. A ring button (38px, hairline circle) opens the radial menu from any page.
- **Phone treatment (below 860px):** the links leave; a burger (42px, 10px radius) drops a sheet whose rows arrive one behind another on cubic-bezier(0.22, 1.04, 0.36, 1), each row a sheet numeral in Geist Mono (deep) beside its title.
- **The radial menu:** a veil (rgba(8, 9, 10, 0.42), 3px blur) and a 268px ring that pops in on cubic-bezier(0.34, 1.52, 0.44, 1). The outer ring is the same brushed metal as the nav under the same refraction; wedges are rgba(20, 26, 32, 0.86) with a 16% ice stroke, cyan at 16% with a cyan stroke when active; glyphs are hairline drafting symbols in steel, ice when active; the label reads in the centre in Geist Mono uppercase at 11px. Opens from the ring button, from the orb, or on right-click anywhere in the journey; on phones it opens low, in the thumb arc.
- **The drawing chrome:** a fixed title block in the bottom-right corner (220px, rgba(8, 14, 20, 0.78), 6px blur, 4px radius, Routed Gothic at 9-10px) printing DWG, SHEET n / 05 and the current VIEW in cyan, with a stamp that reads INDICATIVE until the booking sheet, where it turns APPROVED FOR ISSUE in cyan. A revision rail beside it accrues a row per sheet reached and doubles as a jump list. The rail hides below 1500px, the whole chrome below 760px.
- **The journey rail and stage marker:** inside the pin, a stage list (rgba(10, 10, 11, 0.42), 6px blur, 10px radius, Geist Mono uppercase at 10px) with a hairline that lengthens and turns cyan at the current stop, plus a skip; and a centred pill under the orb naming the stage (cyan numeral, steel title) with a 132px progress hairline. On phones the rail becomes a row of dots at the top of the frame.
- **The footer:** the drawing set's index. A two-column grid, sheet numerals in Geist Mono cyan beside Satoshi titles and one muted line each; the phone number in Satoshi 700; the licences as plain text. Background #0c0d0e under a hairline.

### The Sheet Strip
Where you are in the set. A flex row at the head of every sheet, 11.5px Routed Gothic uppercase with 0.16em tracking: the number in cyan, the title in steel, an optional note, and the count pushed to the right in muted, over a hairline with clamp(28px, 5vh, 56px) below it. Below 640px the note drops and the size goes to 10.5px. The home set counts five; the interior sheets still print their number over nine from the route map, and one count should win.

### The General Arrangement
The signature. A 4:3 sheet (min(92vw, 105svh) wide) pinned for 1050svh, over which the machine at rest dissolves from a photograph into the live render, cyan construction lines measure it, white ink (#f4f9fc) traces it stroke by stroke at constant pen speed with a riding pencil tip and hand jitter, then a lit dark vellum (#1d242b to #0e1216) rises, the ink settles to #b9cbd8, the media beds hatch in vessel by vessel (#28506f patterns), dimensions snap on in Routed Gothic Narrow, balloons drop, section cuts A-A, B-B, C-C land, and the furniture writes itself in: the draughtsman's note top-left (with the redline stamp, BOOK YOUR FREE WATER TEST), a revision table and bill of materials on the right, a title block bottom-right stamped last. Line weights: centre #4d6a7d at 1, hairline #5d90ad at 1.3, heavy #eaf4fa at 2.4. The measurement grid (#dce8f0 at 10% and 16%) exists only here. Hovering a vessel or its BOM row draws a dashed inspection glow (#1f8fb8) and a drafted tip; clicking flies the scroll to that vessel's beat. The copy beats ride the same scalar, each part of a beat lettering in on its own slice, the heading forming out of water first and the view title arriving under it.

### The Exhibit
A photograph treated as evidence. A title strip across its head (SHEET, SUBJECT, SCALE NTS, NOTES), registration marks in the corners, tie rules running off both edges to the sheet margin, and cyan leaders (2.2px, non-scaling) that draw from a note to the thing they point at, ending in a ring (r 46 in image space) and a dot. Notes are placed in the photograph's own pixel space over its quiet areas, numbered in Geist Mono, titled in Hanken, and slide up as their leader lands. The caption is an honesty line, ILLUSTRATION, in the corner. Below 860px the leaders go and a numbered key carries it.

### The Plan
A hydraulic services plan, not a wireframe. Walls as bands with thickness (rgba(203, 224, 236, 0.2) fill), door swings, window lines, fixture symbols a plumber reads, wet areas hatched at 45 degrees, a north point, a scale bar, a legend and the honesty line. The cold-water service is a 5px dark trunk with a 3px cyan run filling along it on the scroll; each fitting lights (cyan stroke, 10% fill, ice label) at the measured moment the water reaches it, and a drafted tip appears on hover or focus. On phones the labels drop, fittings are ballooned and named in a list below, and a count ("4 of 6") sits in a hairline tag.

### Water Text
A heading that forms out of water. Two copies of the text stacked, the lower one cyan under `mix-blend-mode: screen`, blurred by 9/f - 9 (capped at 42px) and passed through an alpha threshold (`feColorMatrix` alpha row 26, -11), so the letters bleed into blobs and re-form with surface tension rather than fading. Driven by the beat's own scroll scalar; the plain text stays in the DOM for screen readers; reduced motion removes the filter.

### The Cursor
A bead of water on glass: a 26px ring in rgba(214, 240, 251, 0.95) with a bright specular near the top and a soft cyan glow, growing to 54px with a cyan rim over interactive targets. Hidden on touch, on coarse pointers and under reduced motion.

### Imagery Bands
A full-bleed photograph (clamp(320px, 62svh, 640px) tall) held in the cold register with `filter: saturate(0.72) contrast(1.04) brightness(0.92)`, captioned as a drawing note: a Geist Mono tag in cyan at 11px with 0.18em, then a steel sentence at 15.5px. Bands carry the problem or the place, never a result, and say when they are a visualisation.

## Do's and Don'ts

### Do:
- **Do** lay every opaque section on `.ground` (void plus 5.5% soft-light grain) and open it with a sheet strip; give it a `sheet-edge` divider with registration ticks, and `ground--ruled` only where a 64px ruling earns its place.
- **Do** keep the machine one scene: a fixed canvas at `z-index: -1`, the cover and the journey as transparent windows, everything else opaque over it, and the pool of light following the machine.
- **Do** use cyan (#29c2ee) only where water or light is, and deep (#0f6fb0) for cyan's job on the light glass.
- **Do** letter the drawing in Routed Gothic uppercase at 10.5-13.5px with 0.1-0.22em tracking, and set the page's index numerals and instrument readouts in Geist Mono with tabular figures.
- **Do** set headings in Satoshi at 0.98-1.04 leading and -0.02 to -0.034em tracking, and sentences in Hanken Grotesk at 1.62-1.72 in prose (#d3dce2) or steel.
- **Do** title a view under its heading (a Routed Gothic reference with an 18px hairline before it), the way a drawing titles a view.
- **Do** give every action a stadium (999px) and every piece of drawing furniture a square corner (0 or 2px).
- **Do** reserve the liquid-metal surface for the actions that close the sale, and make its label hold 4.5:1 against the darkest band.
- **Do** draw structure with 1px hairlines at `--line` and depth with opacity over the pool; a box-shadow goes only under paper or glass.
- **Do** pin scrolling plates inside a bounded block and measure progress off a runway; reserve any overlap the next section hangs into.
- **Do** ship a reduced-motion path that tells the same story standing still: the static story, the finished plate, the filled plan, no cursor, no filters.
- **Do** hold generated stills in the site's cold register with a filter, and label every visualisation as one.
- **Do** measure contrast against the dark ground rather than assume it, and raise functional labels to a 12px floor on phones.
- **Do** write a `*` or a plain NOT IN SCOPE line where a figure would otherwise go; mechanism is the proof.

### Don't:
- **Don't** put a graph grid behind anything. The measurement grid exists once, on the plate, during the trace.
- **Don't** make the sheet cream, or tint the pool of light blue. The drawing surface is lit dark vellum and the pool is neutral graphite.
- **Don't** set type over a photograph with a scrim; split the composition instead, or mark the photograph up as evidence.
- **Don't** use cyan as a heading colour, a gradient, gradient text, or a wash behind a paragraph.
- **Don't** set a sentence in Geist Mono or Routed Gothic, and don't choose a face for a mood.
- **Don't** add transitions to the nav's morph variables (`--nw`, `--nh`, `--nr`, `--nt`); the scroll is the timeline.
- **Don't** give the glass a bevel, a second edge, or a machined highlight; one hairline inside the edge is the whole edge.
- **Don't** apply the liquid-metal surface to secondary actions, or displace an element that has its own border.
- **Don't** lay stages, benefits or facts out as a card grid; set them as a schedule, a fact list or a numbered sequence with hairline rows.
- **Don't** put a box-shadow under a panel, note, chip or row, or outline an invisible sheet with one.
- **Don't** use a sage, blush or muted-earth wellness palette, rounded friendly type, or leaves and droplets as decoration.
- **Don't** print a percentage, a review, a rating or an endorsement that cannot be pointed at.
