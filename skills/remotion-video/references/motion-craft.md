# Build the action before the whole film

Use this reference when a film needs character performance, mechanisms, organic motion or a distinctive material. For a distinctive code-rendered art style, first use the bundled upstream drawing libraries and selected scene source through [local-style-backends.md](local-style-backends.md). The small original motion kit below supplies geometry helpers when needed; it is not the main art renderer for every subject.

## Choose what must be controllable

Describe the important action as preparation → contact/change → consequence. Decide what must move independently: joints, expression, membrane, opening, payload, background, camera. A complete painted frame can set composition, but does not supply those controls.

Use ImageGen for model sheets, expression/pose variations, complicated silhouettes, cutout parts, separate backgrounds and material references. Reference the selected design when making later views. Preserve transparency for cutouts and mark pivots in project notes. Build simple deforming objects procedurally when their shape must change continuously and the chosen drawing style has been demonstrated. Keep a user-requested ImageGen step; hybrid code motion still uses the generated identity or materials. Do not substitute a generic code figure for a carefully selected character.

In a version 4 plan, `artwork: procedural` supports illustrated work whose artwork is rendered by code. It retains the designed workflow, animatic and segment review; it does not require raster references or `assetFiles`. Track its drawing source in shot dependencies. Generated/existing artwork keeps the existing reference and actual-asset checks. `imageGenerationRequired: true` still requires built-in ImageGen, including in a hybrid project. The initializer continues to default illustrated work to ImageGen; choose procedural deliberately for a suitable visual language.

## First prove the difficult passage

Before generating all artwork or polishing every scene, implement a short motion study of the hardest or signature action, usually about 5–8 seconds. Use the real drawing code and selected material. Temporary sound is enough. Render with:

```text
node <plugin>/scripts/motion-kit.mjs install --project <project>
node <plugin>/scripts/review.mjs --project <project> --composition <id> --shot <shot-id> --study
```

The study writes a motion clip and 0.2-second frame samples to `reviews/studies/<shot-id>/`, with pending evidence separate from final reviews. Inspect at normal speed, then examine the contact and pose changes closely. Fix floating joints, incorrect hand/object contact, detached parts, abrupt pose switches or texture that slides over the form. User approval is only needed when requested or when a missing preference matters; the study is normally an agent work step.

## The bundled motion kit

The installer copies `kits/motion/` into `src/motion-kit/` without overwriting project edits. Import the local modules so the editable project owns its implementation. No extra animation dependency is needed beyond the project's Remotion/React runtime.

| Export | What it does |
| --- | --- |
| `keyframes(frame, [{frame,value,hold?}])` | bounded scalar pose interpolation; use several tracks for a pose |
| `solveTwoBone(root,target,upper,lower,bend)` / `<Limb>` | attached two-segment limbs, clamping unreachable targets |
| `bezierPoint([p0,p1,p2,p3], t)` | continuous position and heading along a cubic path |
| `blobPoints` / `closedPath` / `<OrganicShape>` | deformable organic contours with stable topology |
| `morphPoints(a,b,t)` | interpolate matching contours; preserve point order and count |
| `impact(frame,at,decay)` | a damped response after a contact event |
| `<World>` / `worldToScreen` | shared camera coordinates for subjects, attachments and effects |
| `<SpritePart>` | image cutout rotation at an explicit pixel pivot |
| `eventById` / `eventProgress` | use one event time for picture and sound |

All time is passed in explicitly. Render arbitrary frames in any order; no mutable playback state, timers or unseeded randomness. A limb solver is a geometric tool, not a complete actor: design the target path, anticipation, weight, gaze and emotional response for the action. A sprite part is one layer; put attached layers in a shared parent and test their joints. Use actual pose frames for a substantial change of view.

## Two runnable material studies

`examples/mechanism-motion/` implements one continuous encounter: approach, attached reach, membrane response, gate opening, payload release and an arrival response. Its shared timeline also generates the synchronized sound effects.

- **Soft volume** (`SoftMechanism`): gradients follow volume, translucent membrane, contact shadow, restrained highlights.
- **Cut paper** (`PaperMechanism`): flat saturated fills, crisp outlines and offset layer shadows; the same action remains attached.

These are small editable demonstrations of movement and material, not templates for every topic. Reuse the functions and action structure, then redesign the subject and composition. New painterly, 3D or shader styles need their own tested renderer; the kit does not claim those capabilities.

## Shared sound events

`timeline.json` contains `fps`, `durationInFrames`, and `events` with `id`, `frame`, `durationInFrames`, `type`, `gain`, optional `pan`. Types `tap`, `pop`, `whoosh`, `pulse` are synthesized locally:

```text
node <plugin>/scripts/sound-cues.mjs <project>/timeline.json --out <project>/public/cues.wav
```

Drive visible contacts and consequences from the same IDs. Add ambience and music only where the film needs them; avoid sounding every decorative particle. This small foley generator is not a full score, voice system or loudness master. When artwork timing changes, regenerate the track and recheck the mix.

## Inspect motion in the actual render

```text
node <plugin>/scripts/analyze-motion.mjs <project>/reviews/final/motion.mp4 --out <project>/reviews/motion-analysis.json
```

Requires ffmpeg and ffprobe on PATH. It samples actual pixels at 6 fps, excludes the bottom caption band and estimates simple translation/scale compensation. It lists near-still and global-motion-dominant intervals for viewing. It does not assign a beauty score or make motion quantity an export gate. Quiet atmosphere, deliberate reading holds and camera reveals can be appropriate; object motion can also be meaningless. Small motions, texture changes, complex camera motion and transitions can confuse this coarse analysis.

Use the report to find what to watch. Inspect the subject's action, its consequence and the sound together. If only the whole image drifts while the narration explains everything, redesign that passage. Keep this check proportional: a simple financial chart can be complete without a rig, generated art, foley or a motion study.
