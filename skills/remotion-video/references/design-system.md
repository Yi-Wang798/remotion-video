# A shared visual language

Choose one palette, type scale, spacing scale, outline weight, corner radius, shadow treatment and motion vocabulary. Record the choices in `plan.design`; implement them in a shared source file and list it in `sharedDependencies`. Carry compatible values into Manim and imported artwork. Shared tokens establish a visual language; individual shots can change composition, lighting, staging and accent emphasis. Titles and captions appear where useful rather than occupying the same template in every shot.

Build intentional symmetry with a common coordinate system, centered anchors and reusable components. Keep limb joints attached to the parent. Preserve aspect ratio for sprites and clips. Align optical centers as well as bounding boxes. Reserve space for captions and test the final target aspect ratio. A vertical version needs a new composition, not just a center crop.

## Color and material

For playful explainers and expressive films, favor clear, saturated focal colors and a rich supporting environment. Avoid repeatedly defaulting to dark navy with one mint accent, grey pastel shapes or a uniformly muted palette. Respect a user's brand, documentary tone or deliberately quiet treatment. Data color remains semantically stable and readable.

Give colors roles: background/depth, subject, supporting subject, emphasis, text and signal meaning. Use warm/cool separation and differences in lightness as well as hue. The whole screen need not be equally saturated: let the focal subject carry stronger color while supporting areas give it room. Judge the actual full frame and the mobile-size thumbnail.

Design gradients around form and light: lit face to shaded side, foreground to depth, or a source of energy. Use related colors through the midtones so a gradient stays clean. Translucency can show membranes, glass, liquid and layered atmosphere; keep overlapping edges and opacity consistent. Combine soft volume shadows, contact shadows, rim light and selective specular highlights to make materials distinct. Bloom belongs around a light source or a luminous event, rather than covering every object. Keep captions on a stable readable surface.

Change color and lighting with the sequence: a new environment, discovery, danger or resolution can shift accent balance and illumination while preserving identity. Do not give every shot the same background and title color by habit. Nor should each cut introduce unrelated hues. Check lightness separation and full-color legibility when meaningful signals depend on color.

Record `design.colorDirection.intent`, `contrast`, `sequence` and `material`, plus named `design.palette` roles. Carry this direction into ImageGen prompts and code. Compare keyframes and actual renders for washed-out assets, muddy transparent overlaps, clipped highlights, excessive neon and unreadable saturated backgrounds. The review addresses these visible effects; the helper does not assign a numerical beauty or saturation score.

## Using local frontend design references

When installed, consult the relevant parts of UI/UX Pro Max, Impeccable and React Bits. Locate their current skill entry in the host's skill catalog. Use UI/UX Pro Max for palette/type choices; Impeccable for hierarchy, spacing, contrast and layout critique; React Bits for a selected motion pattern. These are optional references rather than required runtime dependencies.

Adapt the principle to a timed film. Readable holds follow narration and information density. Character anticipation or a small bounce can suit a playful film. A finance chart benefits from restrained motion and stable labels. Web interaction rules and micro-interaction durations do not set the pace of a video.

Convert scrolling, hover and pointer events into explicit frame intervals. Replace timers, `requestAnimationFrame`, `Date.now`, unseeded randomness and CSS animation timelines with `useCurrentFrame`, interpolation, springs and seeded values. Give adapted effects an explicit start, duration and end state. Compare renders of the same frame to catch nondeterministic motion.

Browser rendering supports HTML/CSS/SVG/Canvas/WebGL. It does not make every browser component render-safe. Load fonts and assets before capture, use Remotion-supported media components and test the actual renderer. A stylesheet preview is useful during development; inspect exported frames too.
