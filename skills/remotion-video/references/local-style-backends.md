# Local drawing backends

Use this path for an artistic code-rendered film. The plugin bundles Huashu and Lemo drawing code, rather than a list of style adjectives. It does not fetch their repositories while making a video. Select for the subject, intended movement and material; simple data/diagram work can stay in Remotion.

## Choose and prove a style

```text
node <plugin>/scripts/styles.mjs list --backend huashu
node <plugin>/scripts/styles.mjs show huashu/09_postimp
node <plugin>/scripts/styles-setup.mjs
node <plugin>/scripts/styles.mjs doctor --verify
node <plugin>/scripts/styles.mjs preview huashu/09_postimp --out <absolute-new-file.mp4> --seconds 3
```

Setup installs the pinned Playwright Core and Three packages in the separate runtime's `style-tools` directory once. It reuses installed Chrome/Edge and needs ffmpeg. Style files and supported fonts stay in the plugin. The browser renderer blocks external requests; missing resources fail with their paths. `show` exposes missing font counts and omitted demo media. `engines/asset-gaps.json` lists the CSS font gaps; an actual render may uncover further dynamic dependencies. Prepare a chosen style's missing assets locally with their terms before production.

The catalog holds 36 Huashu implemented styles, 17 research recipes and 59 Lemo styles at pinned commits. Implemented upstream is different from verified in this wrapper. Check `verification` and `availability`; research recipes need implementation. A successful benchmark proves loading and rendering for the recorded interval, not adaptation quality or an entire style catalog. Full source inventories and supplemental font sources are recorded separately. View `engines/verification.json` for release evidence.

For Huashu Canvas, read the chosen `scenes/<id>.js` plus `lib/paint.js`, `brush.js`, `medium.js` and any libraries the scene uses. Preserve how strokes follow form, material passes, clipping, contours and seeded time work. Huashu's separate SVG Rick/Morty study supports benchmark preview; new projects for that study follow its dedicated SVG guide. For Lemo, inspect the chosen demo's `main.js` and local material/character modules, plus the used `core/` modules. Its styles are individual implementations, not interchangeable presets on one character.

## Author the new subject

```text
node <plugin>/scripts/styles.mjs create --style huashu/09_postimp --project <new-absolute-directory>
node <plugin>/scripts/project.mjs init --project <same-directory> --kind illustration --artwork procedural
```

`create` copies actual engine source and selected style references with licenses. It refuses a nonempty destination. The new scene deliberately throws until authored: replace the stub rather than delivering the original demo film. The Huashu entry is `src/native/scenes/project_scene.js`, with its timeline in `src/native/eras.js`. The Lemo entry is `src/main.js`; use the copied `src/library/core` and move the needed selected demo modules/assets from `reference/demo` into the new production source with imports adjusted. Preserve their notices. Create a fresh cast, composition and events for the brief. Remove demo badges, date counters, signs, credits and labels from production unless the new film needs them.

`native-style.json` records the source commit and design-stage dimensions (default 1920×1080). Set the stage and redesign the scene for portrait work; changing the export dimensions alone cannot fix composition. `--size` sets the output video size and must match the stage aspect ratio. `--still` exports a PNG at the design-stage resolution. Supplied benchmark scenes retain their original 16:9 layout.

For example, create a Huashu post-impressionist project and copy `examples/native-river/scene.js` over its new scene stub. This original fish/river composition reuses upstream flow-field strokes and color sampling. It is a material/movement study, with no narration or final-film review.

## Render, inspect, assemble

```text
node <plugin>/scripts/styles.mjs render --project <native-project> --out <new-absolute-file.mp4> --seconds 8 --fps 30 --size 960x540
```

Render the signature action first. Inspect the exported clip at normal speed and sample contact/turning frames. Check stable anatomy, controlled contours, spacing, material attached to the object and visible action consequences. Fix failures in the actual scene code. A renderer report starts at `pending-inspection`; it never certifies aesthetics or listening automatically.

Copy the accepted clip into a Remotion finishing project's `public/clips/`. Use `<OffthreadVideo src={staticFile('clips/shot.mp4')}/>` inside a `<Sequence>` with matching frame rate and duration, then add narration, captions, cuts and selected sound. The native clip is continuous rendered movement, not a still image to pan. Keep the native project with the editable delivery. Record `engine: huashu|lemo`, matching `styleId` and dependencies on the descriptor, scene source, material modules and output clip. The Remotion composition still drives preview, design/segment/final reviews and gated final export.

Use connected ImageGen references and separated assets where the chosen technique benefits from them. Preserve explicit generation requests. A tested native drawing treatment can remain entirely procedural; do not add raster keyframes just to satisfy a past example. Avoid rebuilding every artistic treatment with the small generic motion kit.
