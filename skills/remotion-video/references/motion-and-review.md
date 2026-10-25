# Motion and review

Give every shot an entry state, action and exit state. Use motion to express that change. Choose acceleration, settling, anticipation and camera movement around it instead of making every object oscillate. Contacts must stay connected after docking or joining. Keep body parts anchored to their parent.

Reuse geometry and assets across shots. Check intended symmetry, outlines, joints, small characters inside containers and text clearance. Effects support the subject: particles must not obscure the event, and camera movement must leave the whole subject and captions visible. Connect cuts through compatible positions, direction or a planned transition.

## Project plan

`project.mjs init --project <absolute-directory>` creates `video-plan.json` and working directories without overwriting existing work. Fill it while making the video:

- `framework`: story, audience and visual approach.
- `references`: `id`, `file`, `generatedWith` and `basedOn` IDs; recurring characters point to stable chosen images.
- `shots`: `id`, `intent`, `narration`, `screenText`, `referenceIds`, `from`, `durationInFrames`, `entryState`, `action`, `exitState`, `transitionOut`.
- `reviews.segments`: `shotId`, `status`, `sourceRevision`, `frames`, `preview`, `findings`, `checkedAt`.
- `reviews.final`: `status`, `sourceRevision`, `preview`, `text`, `narration`, `visualContinuity`, `findings`, `checkedAt`.

Run `project.mjs revision --project <project>` for a SHA-256 over `src/`, `public/`, chosen reference file contents and the plan's framework, characters, references and shots. Review records do not affect it. A source or asset change makes reviews stale. Inspect the affected segment and its connections, then update the relevant records. Unchanged shots may be carried forward with a finding explaining why they are unaffected. Do not mark reviews current without checking their scope.

## Segment loop

1. Render the segment preview and frames with `review.mjs`. Default samples cover early, middle and exit states plus nearby cuts. Add samples around contact, assembly, overlap and fast effects.
2. Actually open the frames. Play the short preview or inspect a sufficiently dense frame sequence across the movement. One middle frame does not establish motion quality.
3. Inspect proportions, joints, identity, spacing, clipping, stretching, labels, trajectories, pauses and timing.
4. Compare the adjoining cut: direction, position, pose and changing objects through the transition.
5. Fix a visible defect, render the changed interval and inspect again. Record concrete findings, evidence paths and the result. Pass a good segment without inventing extra changes.

Helpers gather evidence. The agent performs visual judgment; scripts never mark a pass because a render succeeded.

## Complete pass

Assemble passed segments. Make a simple complete pass for words, narration and visual continuity, including captions at actual speed and the ending. Repair a demonstrated problem and recheck that interval. Keep this pass focused rather than starting an unrelated redesign.

Run `project.mjs check-final` before delivery. It verifies assets, evidence, current review records and text/narration/continuity outcomes. It does not certify aesthetics or imply frame-by-frame human inspection.
