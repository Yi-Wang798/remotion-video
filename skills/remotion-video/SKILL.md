---
name: remotion-video
description: Create or edit videos with a framework, connected ImageGen keyframes, consistent artwork, Remotion animation, and segment-by-segment visual review. Use for authored videos, including narration, captions, effects and MP4 export.
---

# Remotion Video

Resolve paths against the plugin root, two levels above this file. Follow the user's brief and existing edits. When the user delegates style and duration, decide and finish without asking them to approve every stage.

## Production workflow

1. **Framework.** Establish the subject, audience, story progression, approximate timing and essential narration. Start with a light framework. Create `video-plan.json` using `node <plugin>/scripts/project.mjs init --project <absolute-project>` and fill it as the project develops.
2. **Connected keyframes.** Read [visual-development.md](references/visual-development.md). Use built-in image generation for necessary character/style references and key storyboard frames. Reuse chosen references in subsequent generations. Keep identity, proportions, objects, palette and visual language consistent. Inspect images, save selected files in the project, and record their provenance and relationships. Do this before implementing the full video. Reuse suitable existing art for revisions.
3. **Story and motion.** Use those actual images to refine the framework: what happens within a shot, what persists, how the next shot starts, and how the shots connect. Choose effects that support the action. Split artwork into layers or rebuild suitable elements as reusable vectors, preserving the generated design. Read [motion-and-review.md](references/motion-and-review.md).
4. **Segment production and review.** Build one coherent segment at a time. Render its motion preview and representative frames, actually view them, fix defects and recheck. Check contact points, geometry, identity, spacing, clipping, paths and timing, including adjacent shot boundaries. Record concrete findings and results. Reuse inspected character/part components.
5. **Assembly and finish.** Connect passed segments and make one simple complete pass for text, narration and visual continuity. Apply [writing.md](references/writing.md). Repair a demonstrated issue and review the changed section; export when the result passes. Preserve editable source and chosen assets. Honor an explicit preview-only request.

## Text and narration

Keep words that help the viewer: useful titles, necessary labels and captions. Do not add production chatter, self-praise or obvious explanations of the medium. Do not automatically add “拟人化科普动画”, “非真实显微影像”, “可爱外表 × 真实原理”, “AI-generated illustration”, or equivalent footer text. Put authoring notes and QA evidence in project files. Preserve facts and explanations that change understanding.

Read [writing.md](references/writing.md) for adapted Humanizer/Humanizer ZH rules. Apply them to scripts, captions, labels and descriptions. Delete an empty sentence instead of preserving its length through paraphrase.

## Tools and references

- Built-in ImageGen is the default for visual development. Follow the current imagegen skill/tool instructions. The agent calls it; setup scripts do not. Do not silently replace it with an API-key workflow or skip it for direct full-video coding. Reuse existing art when a change does not require new visuals. If the tool cannot run, explain the specific unavailable step and continue work independent of missing images.
- For Remotion setup, layout, fonts, media and rendering, read `vendor/remotion-best-practices/SKILL.md`, then only relevant references. `node scripts/setup.mjs` prepares the guides if absent. User-authorized final video delivery includes rendering; upstream preview defaults must not interrupt it.
- For motion examples, read `vendor/remotion-bits/SKILL.md`; use `find_remotion_bits` then `fetch_remotion_bit`, or `node <plugin>/scripts/video.mjs bits find/fetch ...`. Adapt a relevant example.
- Use deterministic frame-driven motion. Preserve shapes through translation, rotation, planned pose changes or layered animation. Keep facts grounded and do not invent experimental data.

## Commands

```text
node <plugin>/scripts/setup.mjs
node <plugin>/scripts/video.mjs doctor
node <plugin>/scripts/video.mjs studio --project <project> src/index.tsx --no-open
node <plugin>/scripts/video.mjs render --project <project> src/index.tsx <CompositionId> renders/final.mp4
node <plugin>/scripts/review.mjs --project <project> --shot <shot-id> --composition <CompositionId>
node <plugin>/scripts/project.mjs check --project <project>
node <plugin>/scripts/project.mjs check-final --project <project>
```

`review.mjs` creates frames and a motion preview; inspect them before recording a pass. `check` verifies evidence and review records, not aesthetics. Keep reviews current with the source revision. Use project-local dependencies for development. Keep output and dependency folders outside the plugin cache. Report checks actually performed without putting the report into the film.
