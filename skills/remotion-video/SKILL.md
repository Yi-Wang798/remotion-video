---
name: remotion-video
description: Create or edit videos with audience-led visual storytelling, rough previews, Remotion, optional Manim, connected ImageGen artwork, narration, captions and MP4 export. Use for data briefs, explainers, stories, demos and mood films.
---

# Remotion Video

Resolve plugin paths two levels above this file. Follow the user's brief and preserve existing edits. When creative choices are delegated, make them and finish the requested video. Use this entrypoint for production stages and review requirements; use vendor guides for APIs and selected techniques. Adapt their genre-specific pacing and delivery defaults to the current brief.

## Plan the viewing experience

Read [creative-direction.md](references/creative-direction.md) for every new video and substantial redesign. Establish the audience, useful or emotional promise, opening, progression and payoff. Choose an expression profile appropriate to the purpose. Plan what viewers will see change, discover, compare or feel; connect shots through that progression.

Read [routing.md](references/routing.md) to choose the production path and review effort independently. Initialize `video-plan.json` with `scripts/project.mjs init --project <absolute-directory> --kind <kind>`. New plans use version 3 and carry the creative decisions alongside the shot list.

## Develop and preview

1. Design each shot's visible event, setup, view, scale, focus, reveal and role in the sequence. `action` and `transitionOut` remain the movement and cut specifications. Review the sequence as a whole before polishing one attractive frame.
2. Define a shared visual language with [design-system.md](references/design-system.md). Preserve character identity and style while changing framing, staging, setting or scale when the content benefits.
3. For custom illustrated work, use built-in ImageGen and [visual-development.md](references/visual-development.md) to develop the necessary connected keyframes, then refine the shot logic from those images. Data, text and simple diagrams can be built directly. Use [data-videos.md](references/data-videos.md), [manim.md](references/manim.md) or [shotcraft.md](references/shotcraft.md) when relevant.
4. Inspect a rough preview before detailed production. `compact` uses ordered layout frames and their planned timing; `animatic` uses a timed motion preview with rough art and temporary narration where useful. Judge whether the opening earns attention, the sequence develops, and holds are readable. Resolve demonstrated weak sections and record the design review. This is an agent work step; ask the user only when their input is needed or requested.

## Produce and finish

Build from the reviewed sequence using deterministic frame-based motion. Read [motion-and-review.md](references/motion-and-review.md). Simple projects get a complete preview and key frames; complex scenes get segment reviews during production. Inspect actual renders for geometry, identity, movement, spacing, captions and cuts. Repair visible problems and recheck the affected scope.

Make one assembled pass for engagement, text, narration and visual continuity. Check whether the finished motion delivers the planned progression and pacing. Apply [writing.md](references/writing.md). Keep useful labels and captions; delete production chatter, self-praise and obvious descriptions of the medium. Authoring notes belong in project files.

Review tools create pending evidence. Inspect the output before marking a pass. Repetition reports prompt judgment; they do not impose a scene quota or certify viewer retention. When timing or shot design changes, refresh the affected design review using the changed interval or the current complete preview. Reuse the same inspection for design and final records when it covers both.

Export the requested video and preserve editable source and selected assets. `export` checks the current review records. Version 1/2 projects keep their existing checks; adopt the creative fields when redesigning them.

## Tools

- `scripts/setup.mjs` prepares pinned Remotion/Bits and their guides. Read relevant API references under `vendor/remotion-best-practices/`.
- For Bits, use `find_remotion_bits` then `fetch_remotion_bit`, or `scripts/video.mjs bits find/fetch ...`. Adapt the useful example to the shot's purpose.
- `scripts/setup.mjs --with manim,shotcraft` fetches optional guides. Install the optional Manim runtime with `scripts/video.mjs manim setup`.
- Use built-in ImageGen for needed artwork, following its current skill/tool instructions. Reuse suitable existing art for revisions. A direct-code project can complete the entire workflow without image generation.
- Installed frontend design skills are optional references through [design-system.md](references/design-system.md).

## Commands

```text
node <plugin>/scripts/project.mjs init --project <project> --kind data --profile briefing
node <plugin>/scripts/project.mjs design --project <project>
node <plugin>/scripts/review.mjs --project <project> --composition <rough-or-final-id> --design
node <plugin>/scripts/project.mjs check-design --project <project>
node <plugin>/scripts/review.mjs --project <project> --composition <id> --all
node <plugin>/scripts/review.mjs --project <project> --composition <id> --shot <shot-id>
node <plugin>/scripts/project.mjs affected --project <project>
node <plugin>/scripts/project.mjs check-final --project <project>
node <plugin>/scripts/video.mjs export --project <project> src/index.tsx <id> renders/final.mp4
```

Use absolute project directories. Keep project dependencies and outputs outside the plugin cache. Report the checks actually completed and any concrete remaining issue.
