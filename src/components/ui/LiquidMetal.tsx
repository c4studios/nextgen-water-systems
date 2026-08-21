"use client";

/**
 * LIQUID METAL — the supplied component's look, without its runtime.
 *
 * The component Aaron sent renders this with @paper-design/shaders, which means
 * a WebGL context per button. This site already runs three.js for the journey,
 * and standing up a second GL runtime to decorate a submit button is a bad
 * trade: more bundle, more contexts, and on the phones this site is mostly read
 * on, a real risk of losing the journey's context to the browser's limit.
 *
 * The look itself is three things stacked, and all three are native:
 *
 *   1. a brushed gradient, with the bright bands off-centre so it reads as
 *      rolled metal rather than as a gradient
 *   2. a turbulent displacement of that gradient, which is what makes the metal
 *      look liquid rather than printed
 *   3. a specular sweep that crosses on hover, because metal is only convincing
 *      when the highlight moves and the object does not
 *
 * The filter is applied to a ::before layer inset behind the button rather than
 * to the button itself. Displacing an element that has a border pulls its edge
 * apart into a ragged line; displacing a layer INSIDE a clip leaves the edge
 * crisp and only the material moves. Same reason the nav glass is built that
 * way.
 *
 * Mounted once per page. The filters are referenced by id from CSS.
 */
export function LiquidMetalDefs() {
  return (
    <svg className="lm-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="ng-liquid-metal" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          {/* low frequency on x, higher on y: the distortion runs ACROSS the
              brushing, which is what reads as a poured surface rather than as
              noise */}
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.05" numOctaves="3" seed="17" result="n">
            <animate
              attributeName="baseFrequency"
              dur="14s"
              values="0.011 0.05; 0.017 0.038; 0.011 0.05"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feGaussianBlur in="n" stdDeviation="0.9" result="ns" />
          <feDisplacementMap in="SourceGraphic" in2="ns" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <linearGradient id="ng-metal-band" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#dff2fb" />
          <stop offset="22%" stopColor="#7fb9d6" />
          <stop offset="38%" stopColor="#eaf7fd" />
          <stop offset="55%" stopColor="#4a8fb2" />
          <stop offset="72%" stopColor="#cfe9f6" />
          <stop offset="100%" stopColor="#6aa6c4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
