---
name: remotion-video
description: Create or edit authored videos with Remotion, optional Manim, data charts, connected ImageGen artwork, narration, captions and MP4 export. Choose a direct or image-led workflow and review the actual rendered result.
---

# Remotion Video

Resolve plugin paths two levels above this file. Follow the brief and preserve existing edits. When style and duration are delegated, decide and carry the video through rendering and review.

## Choose a production path

Read [routing.md](references/routing.md). Start a short framework: audience, message, sequence, timing and useful narration. Initialize `video-plan.json` with `scripts/project.mjs init --project <absolute-directory> --kind <kind>`.

- **Data, titles and simple diagrams:** directly build legible text, charts and reusable SVG geometry. Use [data-videos.md](references/data-videos.md) for data work. Image generation is optional.
- **Custom characters and complex illustrated scenes:** follow [visual-development.md](references/visual-development.md). Generate the necessary style and keyframe images with built-in ImageGen, carrying chosen references forward. Refine shot logic from the selected images, then animate layers and reusable geometry.
- **Mathematical or geometric motion:** use the optional Manim CE path in [manim.md](references/manim.md). Bring rendered clips into Remotion for editing, text and audio.
- **Product footage and richer motion:** select a useful Shotcraft recipe and its working demo through [shotcraft.md](references/shotcraft.md). Apply it where it explains the action.

These paths can coexist in one video. Select them by shot. Complexity comes from the visual task, not video length or subject category: a biology flowchart may need no new artwork; a financial brand film may need art direction.

## Build and inspect

1. Define shared palette, type, spacing, geometry and motion in [design-system.md](references/design-system.md). Reuse character parts and chart components across shots.
2. Give each shot an entry state, action, exit state and transition. Use deterministic frame-based animation. Read [motion-and-review.md](references/motion-and-review.md).
3. Match review effort to the scene. Simple projects get a complete preview plus frames at important states and cuts. Complex scenes get segment previews, representative frames and boundary checks during production. Inspect the actual outputs, repair visible defects, then record specific findings.
4. Read the complete script and check text, narration and visual continuity once in the assembled video. Apply [writing.md](references/writing.md). Check captions at playback speed and the ending. Export the requested video with editable source and selected assets.

Do not mark a review passed from render success alone. Review tools create evidence with `pending` status. Inspect frames and play the preview or inspect a sufficiently dense timed sequence before recording a pass. Recheck changed shots and their adjacent cuts; keep unaffected reviews when dependencies are explicitly declared.

## Writing

Use titles, labels and captions that help the viewer understand the subject. Delete production chatter, self-praise and obvious explanations of the medium. Do not add “拟人化科普动画”, “非真实显微影像”, “可爱外表 × 真实原理” or equivalent automatic footers. Keep useful scientific qualifications and source information. Authoring notes and review findings belong in project files.

Apply the adapted Humanizer and Humanizer ZH principles in [writing.md](references/writing.md) to scripts, narration and documentation. Delete empty sentences instead of paraphrasing them to preserve length.

## Tools

- `scripts/setup.mjs` prepares pinned Remotion/Bits and their guides. Read `vendor/remotion-best-practices/SKILL.md` and relevant references for actual API usage.
- For Bits, use `find_remotion_bits` then `fetch_remotion_bit`, or `scripts/video.mjs bits find/fetch ...`; adapt the useful example.
- `scripts/setup.mjs --with manim,shotcraft` fetches the optional guide packs. Manim runtime installation is separate: `scripts/video.mjs manim setup`.
- Use built-in ImageGen for needed new artwork, following its current skill and tool instructions. Reuse suitable existing artwork for revisions. The direct workflow does not require generated keyframes.
- Use installed frontend design skills as optional design references, as described in [design-system.md](references/design-system.md).

## Commands

```text
node <plugin>/scripts/project.mjs init --project <project> --kind data
node <plugin>/scripts/video.mjs doctor
node <plugin>/scripts/review.mjs --project <project> --composition <id> --all
node <plugin>/scripts/review.mjs --project <project> --composition <id> --shot <shot-id>
node <plugin>/scripts/project.mjs affected --project <project>
node <plugin>/scripts/project.mjs check-final --project <project>
node <plugin>/scripts/video.mjs export --project <project> src/index.tsx <id> renders/final.mp4
```

Use absolute project directories. Keep dependencies and render outputs outside the plugin cache. Report the checks actually completed and any concrete remaining issue.
