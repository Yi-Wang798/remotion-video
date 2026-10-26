# Artwork, motion, color and overlays

Use this contract for version 4 projects. It adds choices to the existing creative brief, rather than creating a separate planning document.

## Visual choice and artwork

```json
{
  "creative": {
    "visualMode": "illustrated",
    "visualReason": "Show a character entering a hidden microscopic world",
    "artwork": "built-in-imagegen",
    "imageGenerationRequired": true
  },
  "design": {
    "palette": {"background": "#23114F", "subject": "#FF667D", "accent": "#FFD64D"},
    "colorDirection": {
      "intent": "Playful, luminous and tactile",
      "contrast": "Warm coral subjects against cool violet depth",
      "sequence": "Cool opening, warmer discovery, bright resolved ending",
      "material": "Soft key light, translucent membranes and restrained rim highlights"
    }
  }
}
```

The example illustrates field structure, not a palette to copy into every film. Follow [design-system.md](design-system.md) for color decisions. Record the user's actual requirement in `imageGenerationRequired`; generated illustration is still the default when the user delegates an illustrated film. `artwork: existing` supports suitable user assets and revision work. `artwork: procedural` supports original code-drawn illustration with source dependencies instead of mandatory raster references; it keeps the illustrated review requirements. A required ImageGen request still takes precedence.

Select keyframes at meaningful visual changes, following [visual-development.md](visual-development.md). Record provenance and `basedOn` links. Later generated images refer to selected references; independent text prompts do not establish continuity. Use as many keyframes as the story needs, without a per-sentence image quota.

Each generated/existing illustrated shot selects `referenceIds` and records project-relative `assetFiles` used in its rendered scene. Procedural artwork instead tracks the drawing source in shot dependencies. These may be backgrounds, transparent character layers, textures or clips prepared from the selected design. Put delivered art under `public/` or declare its source dependencies. The helpers check files, reference relationships and hashes; compare actual renders with the selected art to verify how it is used. A file declaration alone does not demonstrate visible use.

## Timed visual development

Every shot records `visual.beats`, using frame offsets relative to its start:

```json
{
  "visual": {
    "beats": [
      {"frame": 0, "kind": "reveal", "event": "A transparent shell surrounds the character"},
      {"frame": 45, "kind": "action", "event": "The shell bends on contact, redirecting the character"},
      {"frame": 105, "kind": "hold", "event": "The changed path remains visible", "reason": "Let viewers connect the collision and new direction"}
    ]
  },
  "overlays": []
}
```

Kinds are `action`, `reveal`, `camera`, `hold`, `loop`. Holds and loops need a reason. Record what actually happens; renaming identical movement does not create development. A >5-second interval in illustrated work prompts inspection, not an automatic rejection or a mandatory cut. Watch at planned speed. Look for a subject that acts, a changing relationship, an emerging mechanism or a perceptual discovery. Continuous action can last longer than a brief cut.

Build movement within and between selected designs: layer foreground/background, animate relevant parts, show anticipation, contact and consequence, preserve screen direction, and use match action or motivated scale changes. A pan over a still or crossfade between stills can support a beat; an entire illustrated film should not rely on that alone. Reduce narration or shorten a section when the image has finished explaining it.

## All visible text

Record every non-caption overlay in `shot.overlays` as `{text, purpose}`. Purposes are `title`, `label`, `credit`, `brand`, `chapter`. Use `[]` for none. Brand and chapter/page treatments require `requested: true`, reflecting an actual user request. Captions remain timed transcript text. Useful headings can appear briefly; avoid a permanent title band that shrinks every scene.

No automatic page counters, invented series names, repeated topic footers, decorative English, microcopy explaining the medium or redundant second subtitles. Check actual rendered corners and margins against the inventory. Small type is appropriate when it identifies a useful quantity or object; remove text whose only role is filling space. Keep source detail in accompanying documentation unless requested or necessary on screen.

## Review the film, not the form

Illustrated work uses an animatic and segment motion previews. Inspect key transitions, the longest holds and looping intervals at playback speed, plus rendered stills for geometry, artwork and overlays. When a player is unavailable, inspect a dense timed sequence and report the limitation accurately. Do not claim playback or listening that did not occur.

Version 4 final evidence includes `shotChecks`, one record per shot:

```json
{
  "shotId": "collision",
  "development": "At 1.5 s the shell bends; the subject changes direction before the final hold",
  "artwork": "Rendered shell and character match the selected keyframe; contact stays attached",
  "color": "Warm subject separates from violet depth; the translucent shell remains visible",
  "overlays": "Only the collision label appears; no header, footer or page counter"
}
```

Write observed details and time positions, including what was repaired. `review.mjs --all` creates empty observation fields and pending results. File checks and filled records do not establish taste, scientific truth or audience retention; the author must inspect the actual outcome and revise weak sections. Avoid generic pass text copied across shots. One current assembled review can cover design and final findings when it actually addresses both.
