# Motion and review

Give each shot an entry state, action and exit state. Use acceleration, anticipation and settling around that action. Keep contacts connected, body parts anchored and shapes consistent. Reuse geometry across shots. Inspect symmetry, outlines, joints, spacing, clipping, paths and changing objects at cuts. Effects and camera motion leave the subject and captions clear.

## Design review before polish

Follow [creative-direction.md](creative-direction.md). `review.mjs --design` renders the rough composition's representative frames; animatic mode also renders its timed preview. Compact mode can use the first direct-code layout, without generated artwork or an extra movie render. Inspect the sequence, its planned timing and the viewing promise, then record `reviews.design`. Design findings address progression, useful variation and pace; production findings address the finished visual execution.

## Production review

`light`: render a complete preview with `review.mjs --all`. Inspect its motion and frames at important states, cuts and the ending. Add samples around fast actions.

`segments`: render each shot with `--shot <id>`. Inspect representative frames plus the motion preview or a sufficiently dense timed sequence. Check adjoining cuts and record each segment. Then inspect the assembled film.

Default samples cover start, early/middle/late states, exit and neighboring cuts. Add absolute frame numbers with `--samples 43,44,45` for contacts or rapid events. Render success creates `pending` evidence. After viewing, copy the evidence into the corresponding plan review field, set the observed results to `pass`, and record dated concrete findings. Helpers gather evidence; the agent makes the visual and creative judgment.

## Complete pass

Check engagement, words, narration and visual continuity in the assembled video. Inspect whether the opening delivers its promise, the middle develops, the reading holds are useful, and the ending resolves the intended experience. Consider the chosen profile: a stable explanatory diagram or a quiet atmospheric shot can work well. Repair a demonstrated weak passage and its connections rather than starting an unrelated redesign.

For version 3, the final record includes `engagement: pass` alongside `text`, `narration`, `visualContinuity`, `status`, `sourceRevision`, `frames`, `preview`, `findings` and `checkedAt`. For a silent video, record that no narration track is intended when reviewing that field. Reuse the current complete preview to refresh a design review if only later timing/design changes need rechecking; one inspection can support both records when it addresses both scopes.

## Revisions and dependencies

- `sharedDependencies`: common source, fonts, audio and visual tokens used throughout the video.
- Shot `dependencies`: source, art, clip and audio files used by that shot, including imports.
- Shot `referenceIds` and `metricIds`: artwork and data used by the shot.
- Segment review `shotRevision`: shot, its files/data, shared values and immediate neighbors.

A local source change invalidates that shot and adjacent cut reviews; shared visual changes invalidate all segments. Without explicit shot dependencies, the helper conservatively tracks all `src/` and `public/` files. `project.mjs affected` lists stale passed segments. The full source hash also covers declared dependencies outside those folders; it invalidates the final pass when source, assets, data, creative brief or timing changes.

The separate design hash tracks planned experience, shot timing, selected artwork/data and `creative.dependencies`. Animation implementation can be polished without repeatedly failing the rough design check; the finished result still needs the complete engagement pass. Review notes do not change source/design hashes. Inspect the relevant changed scope before updating a record.

Version 1 records retain their global segment hash. Version 1/2 projects keep their original review schema unless they adopt a creative plan. Run `project.mjs check-final` before delivery. It checks current records, evidence and data arithmetic. Repetition warnings guide judgment and do not independently block export.
