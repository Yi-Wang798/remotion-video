---
name: remotion-video
description: Create or edit videos with audience-led visual storytelling, rough previews, Remotion, optional Manim, connected ImageGen artwork, narration, captions and MP4 export. Use for data briefs, explainers, stories, demos and mood films.
---

# Remotion Video

Resolve plugin paths two levels above this file. Follow the user's brief and preserve existing edits. When creative choices are delegated, make them and finish the requested video. Use this entrypoint for production stages and review requirements; use vendor guides for APIs and selected techniques. Bundled upstream skill files are source references, not additional orchestration: keep this workflow, the current brief and its authorization. Do not run their clone/install steps when local source already exists. Adapt their genre-specific pacing and delivery defaults to the current brief.

## Plan the viewing experience

Read [creative-direction.md](references/creative-direction.md) for every new video and substantial redesign. Establish the audience, useful or emotional promise, opening, progression and payoff. Choose an expression profile appropriate to the purpose. Plan what viewers will see change, discover, compare or feel; connect shots through that progression.

Read [routing.md](references/routing.md) and [production-design.md](references/production-design.md). Choose the visual treatment from the brief before choosing the engine. For character, environment and microscopic storytelling, decide which parts must move before making assets. Use connected ImageGen designs and separated parts where illustration needs them; use a tested procedural drawing style for controllable geometry and continuous shape changes. For an artistic code treatment, read [local-style-backends.md](references/local-style-backends.md), select the actual local drawing source and prove it on the new subject. Read [motion-craft.md](references/motion-craft.md). Simple schematic/data/geometry/typography work can remain direct. A science subject alone does not make a film a schematic. Preserve explicit image-generation requests in the plan. Initialize `video-plan.json` with `scripts/project.mjs init --project <absolute-directory> --kind <kind>`; new plans use version 4.

## Develop and preview

1. Design each shot's visible event, setup, view, scale, focus, reveal and role in the sequence. `action` and `transitionOut` remain the movement and cut specifications. Review the sequence as a whole before polishing one attractive frame.
2. Define a shared visual language with [design-system.md](references/design-system.md). Use vivid focal colors, warm/cool relationships, gradients, translucency and material lighting where they suit the subject; keep text readable and honor a requested restrained style. Plan color and light changes across the sequence. Preserve character identity while changing framing, staging, setting or scale when the content benefits.
3. Use [visual-development.md](references/visual-development.md) for connected model sheets, key poses, layered backgrounds and selected composition references. Generate only the assets needed for the chosen motion. Use [motion-craft.md](references/motion-craft.md) to prove the difficult action with the real renderer before making the full asset set. Reuse suitable existing artwork. Keep requested generation; hybrid code animation can use generated identity and layers without treating each keyframe as a full-screen slide. Use [data-videos.md](references/data-videos.md), [manim.md](references/manim.md) or [shotcraft.md](references/shotcraft.md) when relevant.
4. Inspect a rough preview before detailed production. Illustrated films require a timed animatic and segment reviews. Simple direct work can use compact layout frames. At playback speed, distinguish action development from repeated particles, wing flaps or background movement. Resolve weak sections and record specific observations. This is an agent work step; ask the user only when their input is needed or requested.

## Produce and finish

Build from the reviewed motion study and sequence using deterministic frame-based motion. Use the selected native style renderer for its strokes, contours, shading and material. The small motion kit supplies optional attached limbs, pose tracks, paths, organic contours, sprite pivots, camera coordinates and shared sound events. Adapt these to the action rather than simulating activity with generic particle loops. Read [motion-and-review.md](references/motion-and-review.md). Simple projects get a complete preview and key frames; complex scenes get segment reviews during production. Inspect actual renders for geometry, identity, movement, spacing, captions and cuts. Repair visible problems and recheck the affected scope.

Use `scripts/analyze-motion.mjs` on illustrated motion previews to locate near-still or mainly global-motion intervals, then inspect those intervals with sound; the report remains advisory. Make one assembled pass for engagement, text, narration and visual continuity. Check the rendered artwork against selected keyframes, color/light, action development and all overlays. Apply [writing.md](references/writing.md). Default to captions and necessary labels or brief titles. Add no unrequested page counters, series headers, repeated title footers or decorative small print. Record actual non-caption text in shot `overlays`; inspect the render for text omitted from the plan. Authoring notes belong in project files.

Review tools create pending evidence. Inspect the output before marking a pass. Repetition reports prompt judgment; they do not impose a scene quota or certify viewer retention. When timing or shot design changes, refresh the affected design review using the changed interval or the current complete preview. Reuse the same inspection for design and final records when it covers both.

Export the requested video and preserve editable source and selected assets. `export` checks the current review records. Versions 1–3 keep their existing checks; use version 4 when substantially redesigning them. [production-design.md](references/production-design.md) defines the added fields.

## Tools

- `scripts/styles.mjs list/show` reads the bundled Huashu and Lemo source locally; no per-video GitHub lookup. `scripts/styles-setup.mjs` prepares the separate pinned native runtime once. `preview` tests original upstream code; `create` makes a project for a new subject; `render` exports its native clip.
- `scripts/setup.mjs` prepares pinned Remotion/Bits and their guides. Read relevant API references under `vendor/remotion-best-practices/`.
- For Bits, use `find_remotion_bits` then `fetch_remotion_bit`, or `scripts/video.mjs bits find/fetch ...`. Adapt the useful example to the shot's purpose.
- `scripts/setup.mjs --with manim,shotcraft` fetches optional guides. Install the optional Manim runtime with `scripts/video.mjs manim setup`.
- Use built-in ImageGen for the selected artwork route, following its current skill/tool instructions. If required generation is unavailable, report the concrete blocker; do not quietly deliver a code-only substitute. Suitable existing art can be reused for revisions.
- Installed frontend design skills are optional references through [design-system.md](references/design-system.md).

## Commands

```text
node <plugin>/scripts/project.mjs init --project <project> --kind data --profile briefing
node <plugin>/scripts/motion-kit.mjs install --project <project>
node <plugin>/scripts/review.mjs --project <project> --composition <id> --shot <shot-id> --study
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
