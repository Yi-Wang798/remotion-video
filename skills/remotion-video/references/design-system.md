# A shared visual language

Choose one palette, type scale, spacing scale, outline weight, corner radius, shadow treatment and motion vocabulary. Record the choices in `plan.design`; implement them in a shared source file and list it in `sharedDependencies`. Carry the same values into Manim and any imported artwork.

Build intentional symmetry with a common coordinate system, centered anchors and reusable components. Keep limb joints attached to the parent. Preserve aspect ratio for sprites and clips. Align optical centers as well as bounding boxes. Reserve space for captions and test the final target aspect ratio. A vertical version needs a new composition, not just a center crop.

## Using local frontend design references

When installed, consult the relevant parts of UI/UX Pro Max, Impeccable and React Bits. Locate their current skill entry in the host's skill catalog. Use UI/UX Pro Max for palette/type choices; Impeccable for hierarchy, spacing, contrast and layout critique; React Bits for a selected motion pattern. These are optional references rather than required runtime dependencies.

Adapt the principle to a timed film. Readable holds follow narration and information density. Character anticipation or a small bounce can suit a playful film. A finance chart benefits from restrained motion and stable labels. Web interaction rules and micro-interaction durations do not set the pace of a video.

Convert scrolling, hover and pointer events into explicit frame intervals. Replace timers, `requestAnimationFrame`, `Date.now`, unseeded randomness and CSS animation timelines with `useCurrentFrame`, interpolation, springs and seeded values. Give adapted effects an explicit start, duration and end state. Compare renders of the same frame to catch nondeterministic motion.

Browser rendering supports HTML/CSS/SVG/Canvas/WebGL. It does not make every browser component render-safe. Load fonts and assets before capture, use Remotion-supported media components and test the actual renderer. A stylesheet preview is useful during development; inspect exported frames too.
