# Design the viewing experience

Use this reference for every video type. Scale the work to the brief: a short data update may need five planning sentences and a few layout frames; a character film benefits from a timed rough cut. Keep planning in the existing project rather than producing a stack of separate approval documents.

## Start with a reason to watch

Choose the audience and what the video gives them: a useful comparison, a mechanism they can see, a story outcome, a demonstrated result, or a sustained mood. Design an opening that delivers or raises that promise promptly, then a progression that earns its running time and an ending that completes it. A question, joke or reversal is useful when it fits; a direct result or a striking sensory image may be the better opening.

| Expression profile | Progression to design | Typical visual choices |
| --- | --- | --- |
| briefing | important result → comparison → supported meaning | stable chart scales, selective highlights, changes tied to the numbers |
| explanation | question or observation → causal steps → understanding | reveal hidden structure, change scale or viewpoint, compare before/after |
| story | situation → action and discovery → consequence | staging, character decisions, reactions and a resolved action |
| demonstration | need → meaningful operation → visible result | real actions, relevant close-ups, result comparison |
| atmosphere | sensory promise → evolving texture, space or tension → release | deliberate duration, restrained movement, sound and visual development |
| custom | the user's intended experience | choose the visual structure that serves it |

Profiles describe expression; the version 4 visual route in [routing.md](routing.md) governs artwork and review requirements. Profiles are independent of software and artwork needs. Combine them where useful and select the dominant intent. A story can use code-native geometry; an illustrated video can be a briefing. Preserve the user's requested form, pace and tone.

## Design actual shots

For each shot, specify `visual.setup` (composition/staging identity), `view` (camera/viewpoint), `scale`, `focus`, `reveal` (new information, outcome or perceptual development) and `role` (why this shot belongs here). Use the existing `action`, states, timing and `transitionOut` for movement and cuts. Shot records describe the actual plan rather than adding different labels to identical frames.

Look across the sequence. Changes in subject, event, perspective, scale, staging, light, layout or information can renew attention. Choose the changes the material needs. New locations and camera movement each need a purpose. One room can sustain a developing event; one chart can sustain a clear comparison. A static hold can let a viewer read, notice a difference or feel tension. Keep it when that is its job.

Recurring characters and a coherent visual language support continuity. Camera position, background, composition and physical scale remain creative choices. Reuse an asset when it supports a shot, and create a different view when reusing it would flatten the intended sequence. A labeled background with drifting decoration is weak evidence of progression when the main action never changes.

## Inspect a rough sequence

After selecting the necessary artwork and refining the shot logic, make a rough sequence before detailed animation and final sound work:

- `compact`: inspect ordered representative layout frames together with planned duration, narration and visible changes. For a simple direct-code video, its first working layout can serve this role. A single-chart video can use frames of its initial, comparison and result states.
- `animatic`: inspect a timed rough motion preview. Use rough keyframes, simple blocking and temporary narration or sound where they affect pace. A rough composition in the same project can be rendered with `review.mjs --design`.

Check whether the opening creates the intended interest, each section develops the subject, the middle avoids needless waiting, and the ending delivers the promise. Try viewing without captions to identify narration-only progression. Inspect a thumbnail strip to find accidental sameness, then judge it at planned playback speed. Fix the weak passage and its connections; keep passages that already work.

The agent records this review and continues. Routine creative choices do not create a user approval gate. Explicit user requests for storyboard approval still apply.

## Repetition reports

`project.mjs design` reports consecutive shots with the same setup/view/scale, dominant composition share and identical adjacent reveal descriptions. These are metadata-based prompts for review. A repeated label is not a measured visual match; changing a label does not improve a film. Inspect the actual preview and record why a flagged passage develops well or how it was revised. Thresholds are reminders rather than export failures, scene quotas or predictions of popularity.

## Plan and review records

The creative fields introduced in version 3 remain in version 4. Add the visual, color, beat and overlay fields in [production-design.md](production-design.md). The shared creative brief includes:

```json
{
  "creative": {
    "profile": "briefing",
    "previewMode": "compact",
    "audience": "People checking this quarter's results",
    "promise": "See the main change and the comparison behind it",
    "opening": "Lead with the important result",
    "progression": "Build the comparison on a stable scale, then isolate the change",
    "payoff": "Hold the supported conclusion with final values visible",
    "dependencies": []
  }
}
```

Profiles accept `auto` plus the six table entries. Preview mode accepts `auto`, `compact`, `animatic`. Add project-relative design source files to `creative.dependencies` if the rough design relies on them. Keep generated evidence in `reviews/` rather than declaring it as its own dependency.

`review.mjs --design` writes pending evidence under `reviews/design/`. After inspection, copy it into `reviews.design`, set `status: pass`, date it and describe concrete findings. Both modes require frames; animatic also requires a motion preview. `project.mjs check-design` checks the record and its design revision.

The design hash tracks the framework, creative brief, shot design/timing/narration, selected artwork, data and declared design dependencies. Source-level animation polish is handled by production review hashes. A changed shot, artwork or timing needs a focused design recheck; the current full preview may supply its evidence. For the completed film, `reviews.final.engagement: pass` records that the actual result still develops the intended experience. The same viewing can support both records when they are current and the findings cover both questions.
