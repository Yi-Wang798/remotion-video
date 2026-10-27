# Remotion Video

Build animation with local drawing code and assets, then use Remotion for editing, sound and captions.

The plugin includes Huashu and Lemo drawing libraries, style guides and scene source. Reuse their implementations of strokes, contours and materials while designing a new cast and sequence for your subject. Use built-in image generation where the artwork needs it. Data briefs, charts and simple diagrams can be built directly.

[中文](README.md)

## Local styles

The catalog contains **36 implemented Huashu styles, 17 research recipes and 59 Lemo styles** at pinned commits. These files ship with the plugin; making a video does not require another GitHub search.

Each entry records its source, upstream status, asset gaps and wrapper verification. Some original demos need additional fonts, textures or models. The catalog lists known gaps. See the [render evidence](engines/verification.json) and [local backend guide](skills/remotion-video/references/local-style-backends.md).

```text
node scripts/styles.mjs list --backend huashu
node scripts/styles.mjs show huashu/09_postimp
node scripts/styles.mjs preview huashu/09_postimp --out <absolute-new-file.mp4> --seconds 3
```

`preview` runs the original upstream scene to show its drawing technique. For a new film, `create` copies the real engine and selected source references into a project where you author the cast, composition and story.

```text
node scripts/styles.mjs create --style huashu/09_postimp --project <new-absolute-directory>
node scripts/project.mjs init --project <same-directory> --kind illustration --artwork procedural
node scripts/styles.mjs render --project <same-directory> --out <absolute-new-clip.mp4> --seconds 8
```

Implement the new scene before rendering. Bring accepted native clips into Remotion for editing, narration, sound and captions. Portrait work needs its own composition; the output aspect ratio must match the design stage.

## Install and prepare

Add this repository in Codex and install `remotion-video`. A local checkout can also be registered as a marketplace:

```text
codex plugin marketplace add <repository-directory>
codex plugin add remotion-video@remotion-video-marketplace
```

With Node.js, Chrome or Edge, and ffmpeg installed, prepare a separate runtime:

```text
node scripts/setup.mjs --runtime <absolute-runtime-directory> --with styles
node scripts/video.mjs doctor
node scripts/styles.mjs doctor --verify
```

If the Remotion runtime is already prepared, run `node scripts/styles-setup.mjs` to add native engine dependencies. This installs pinned npm packages once and reuses them afterward. The native browser renderer blocks external requests and reports missing resource paths. Runtime files, projects and outputs live separately from the plugin.

Remotion projects use the dependencies in `runtime/package.json` and its lock file. Optional Manim and shot references can be prepared with:

```text
node scripts/setup.mjs --with manim,shotcraft
node scripts/video.mjs manim setup
```

Manim uses an isolated Python environment; formula scenes may need LaTeX. Source and version pins are recorded in [UPSTREAM.json](UPSTREAM.json).

## Production and review

Tell Codex the subject, audience and available material. You can delegate style and duration.

> Use the local styles to explain how a bacteriophage kills a bacterium, with cute characters and connected movement.

> Make a 20-second animation from these quarterly figures, focusing on revenue changes.

For complex animation, plan the visual progression and test the signature action before expanding the film. Choose procedural drawing, connected generated assets or a mix based on the treatment. Inspect the rough animation before detailed production. Simple data videos need layout frames and a complete preview. Design color, lighting and material for the subject; audience text consists of captions, useful labels and brief titles.

New version 4 plans support native engine clips alongside Remotion and Manim. Illustrated work uses a timed animatic and segment reviews. Explicit image-generation requests stay in the plan. Existing version 1–3 plans keep their prior checks.

```text
node scripts/project.mjs init --project <project> --kind data --profile briefing
node scripts/project.mjs design --project <project>
node scripts/review.mjs --project <project> --composition <id> --design
node scripts/project.mjs check-design --project <project>
node scripts/review.mjs --project <project> --composition <id> --all
node scripts/project.mjs check-final --project <project>
node scripts/video.mjs export --project <project> src/index.tsx <id> renders/final.mp4
node --test tests/*.test.mjs
```

After generating previews and frames, the authoring agent inspects them and records findings. Complex scenes get segment checks during production, followed by a complete pass for text, sound and continuity. Source or asset changes invalidate the affected reviews, which must be refreshed before export. See [motion and review](skills/remotion-video/references/motion-and-review.md).

## Examples and credits

- [Painted river](examples/native-river): an original fish-and-water study using Huashu's actual flow-field stroke library.
- [Data brief](examples/data-brief): a bar chart and growth comparison with example data.
- [Geometric motion](examples/manim-orbit): Manim trajectories assembled in Remotion.
- [Contact and release](examples/mechanism-motion): attached joints, deformation and shared sound events.

Drawing engines come from [huashu-art-motion](https://github.com/alchaincyf/huashu-art-motion) and [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar), with author, license, font and data notices preserved. Uses and pinned sources for Remotion, Remotion Bits, Manim and video-shotcraft are listed in [NOTICE.md](NOTICE.md). Original scripts and documentation use the [MIT license](LICENSE).
