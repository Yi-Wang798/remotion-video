# Remotion Video

Design a reason to keep watching, then build the images, movement and sound.

Build data summaries, charts and simple diagrams directly. Character stories, scene-based explainers and microscopic worlds start with connected keyframes from built-in ImageGen, followed by action within the artwork and transitions between shots. Manim can handle mathematical and geometric scenes; Remotion assembles the clips, captions, narration and other shots.

[中文](README.md)

## What it does

- Plans an opening, visual progression and payoff for the purpose: data brief, explanation, story, demonstration or atmosphere.
- Checks a rough sequence before detailed work. Simple videos use ordered layout frames; complex videos use a timed animatic to find weak or repetitive passages early.

- Generates connected artwork at openings, discoveries, scale changes and turning points where needed. Explicit image-generation requests stay part of the production plan.
- Designs vivid focal colors, warm/cool contrast, gradients, translucency and material lighting across the sequence. Characters stay recognizable as views and settings change. Requested brand colors and restrained styles are preserved.
- Uses Remotion Bits components and examples, with an optional Shotcraft pack for data, typography, camera and transition recipes with code.
- Reviews actual renders. Simple videos get a complete preview and key frames; complex shots get segment reviews during production. Dependency tracking keeps revisions focused on affected shots and adjacent cuts.
- Records data sources, periods, units and currencies, and checks differences and percentage changes.
- Applies Humanizer and Humanizer ZH to remove filler. Captions, useful labels and brief titles are the default; page counters, invented series headers and repeated footers are not added automatically.

## Install

Add this repository as a Codex plugin marketplace, then install `remotion-video`. For a local checkout:

```text
codex plugin marketplace add <repository-directory>
codex plugin add remotion-video@remotion-video-marketplace
```

With Node.js installed, prepare the runtime from the repository directory:

```text
node scripts/setup.mjs --runtime <absolute-runtime-directory>
node scripts/video.mjs doctor
```

Keep the runtime and video projects in their own directories so plugin upgrades are straightforward. Use matching project dependencies: copy `runtime/package.json` and its lock file into a project, then run `npm ci`. Rendering uses Chrome; set `browserExecutable` in the local `runtime.local.json` if needed. Pins are recorded in [UPSTREAM.json](UPSTREAM.json).

For optional guides and Manim:

```text
node scripts/setup.mjs --with manim,shotcraft
node scripts/video.mjs manim setup
node scripts/video.mjs manim doctor
```

Manim runs in an isolated Python environment and needs Python 3.11 or newer. Formula scenes may also use LaTeX. Ordinary Remotion charts and videos need Node.js and a browser.

## Make a video

Tell Codex the subject, audience and available data or artwork. You can delegate style and duration:

> Make a clean 20-second animation from these quarterly figures. Focus on revenue growth.

> Explain how a bacteriophage kills a bacterium, with cute characters and connected motion. Choose the duration.

To initialize a plan manually:

```text
node scripts/project.mjs init --project <project> --kind data --profile briefing
node scripts/project.mjs init --project <another-project> --kind illustration
```

New projects use version 4 plans. Choose the visual form with `--visual illustrated|schematic|data|geometry|footage|typography`. Illustrated films default to generated keyframes, a timed animatic and segment reviews; use `--artwork existing` for suitable supplied art. Add `--require-imagegen` when the brief requests generation. Simple data and diagrams remain direct. Choose expression with `--profile`; other modes can adjust `--workflow`, `--review` and `--preview`. Existing version 1–3 plans keep their prior checks. See [production routing](skills/remotion-video/references/routing.md) and [shot design](skills/remotion-video/references/creative-direction.md).

## Examples and review

- [Data brief](examples/data-brief): a direct-code bar chart and growth comparison using example data.
- [Geometric motion](examples/manim-orbit): a Manim trajectory clip assembled with a Remotion title.
- [Button story](examples/button-story): character motion built from two connected design images.

```text
node scripts/project.mjs design --project <project>
node scripts/review.mjs --project <project> --composition <rough-or-final-id> --design
node scripts/project.mjs check-design --project <project>
node scripts/review.mjs --project <project> --composition <id> --all
node scripts/review.mjs --project <project> --composition <id> --shot <shot-id>
node scripts/project.mjs affected --project <project>
node scripts/project.mjs check-final --project <project>
node scripts/video.mjs export --project <project> src/index.tsx <id> renders/final.mp4
node --test tests/*.test.mjs
```

`design` highlights repeated or dominant compositions for inspection. `export` checks current design and final review records before rendering the finished video. After generating previews and frames, the authoring agent inspects them and records findings alongside the video source. Design review checks the planned opening, progression and pace; the complete pass records shot-level observations on development, artwork match, color, overlays, sound and continuity. Explicit shot dependencies keep local rechecks focused. See [motion and review](skills/remotion-video/references/motion-and-review.md).

## Credits

This project combines Remotion and Remotion Bits with methods from Manim, video-shotcraft, the Humanizer projects and local design skills. Authors, pinned sources, uses and licenses are listed in [NOTICE.md](NOTICE.md) and [UPSTREAM.json](UPSTREAM.json). Original scripts and documentation use the [MIT license](LICENSE).
