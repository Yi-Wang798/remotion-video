# Motion and review

Give each shot an entry state, action and exit state. Use acceleration, anticipation and settling around that action. Keep contacts connected, body parts anchored and shapes consistent. Reuse geometry across shots. Check symmetry, outlines, joints, spacing, clipping, paths and changing objects at cuts. Effects and camera motion should leave the subject and captions clear.

## Review effort

`light`: render a complete preview with `review.mjs --all`. Inspect the preview and frames at important states, cuts and the ending. Add samples around fast actions. Record one final text/narration/visual-continuity pass.

`segments`: render each shot with `--shot <id>`. Inspect representative frames plus the motion preview or a sufficiently dense timed sequence. Check adjoining cuts. Record each segment, assemble the film, then make the same complete pass. Complex direct-code scenes may also use this level.

Default samples cover start, early/middle/late states, exit and neighboring cuts. Add absolute frame numbers with `--samples 43,44,45` for contacts or rapid events. Render success creates `pending` evidence. After viewing, copy the evidence into `plan.reviews.segments` or `plan.reviews.final`, set the observed results to `pass`, and record dated concrete findings. The final record includes `text`, `narration`, `visualContinuity`, `frames` and `preview`. For a silent video, record that there is no narration track when checking that field.

## Dependencies and revisions

Version 2 plans support:

- `sharedDependencies`: common source, fonts, audio and design tokens used throughout the video.
- Each shot's `dependencies`: source, art, clip and audio files used by that shot.
- Each shot's `referenceIds` and `metricIds`: artwork and data used by that shot.
- Each segment review's `shotRevision`: hash of the shot, its files and data, shared values and immediate neighbors. `review.mjs` generates this hash.

Declare dependencies completely, including imports. A change invalidates that shot and adjacent cut reviews; a shared design change invalidates all segments. Without explicit shot dependencies, the helper conservatively tracks all `src/` and `public/` files. `project.mjs affected --project <project>` lists stale passed segments. Version 1 records retain their global hash behavior.

The full source revision covers source files, assets, framework, artwork, data and timing; any such change invalidates the final pass. A full hash also includes explicitly declared dependencies outside `src/` and `public/`. Review findings do not change source hashes. Do not refresh a hash just to silence a stale review: inspect the affected interval again.

Run `project.mjs check-final` before delivery. It checks evidence files, current review records, data arithmetic and outcomes. Visual judgment comes from inspecting the actual rendered frames and motion. Repair a demonstrated problem and recheck the changed scope; finish once the result passes.
