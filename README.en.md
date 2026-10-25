# Remotion Video

Make videos with code, with attention to artwork, motion and words.

Build data summaries, charts and simple diagrams directly. For custom characters and elaborate scenes, develop connected reference images with built-in ImageGen, then animate the selected designs. Manim can handle mathematical and geometric scenes; Remotion assembles the clips, captions, narration and other shots.

[中文](README.md)

## What it does

- Chooses a direct or image-led workflow for the subject. Both can appear in one video.
- Shares palette, typography, spacing, outlines and character parts across shots. Optional local UI/UX Pro Max, Impeccable and React Bits skills provide design references.
- Uses Remotion Bits components and examples, with an optional Shotcraft pack for data, typography, camera and transition recipes with code.
- Reviews actual renders. Simple videos get a complete preview and key frames; complex shots get segment reviews during production. Dependency tracking keeps revisions focused on affected shots and adjacent cuts.
- Records data sources, periods, units and currencies, and checks differences and percentage changes.
- Applies Humanizer and Humanizer ZH writing principles to remove filler and keep scripts clear.

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
node scripts/project.mjs init --project <project> --kind data
node scripts/project.mjs init --project <another-project> --kind illustration
```

Auto routing follows the need for custom artwork. Override it with `--workflow direct|designed` and `--review light|segments`. See [production routing](skills/remotion-video/references/routing.md).

## Examples and review

- [Data brief](examples/data-brief): a direct-code bar chart and growth comparison using example data.
- [Geometric motion](examples/manim-orbit): a Manim trajectory clip assembled with a Remotion title.
- [Button story](examples/button-story): character motion built from two connected design images.

```text
node scripts/review.mjs --project <project> --composition <id> --all
node scripts/review.mjs --project <project> --composition <id> --shot <shot-id>
node scripts/project.mjs affected --project <project>
node scripts/project.mjs check-final --project <project>
node scripts/video.mjs export --project <project> src/index.tsx <id> renders/final.mp4
node --test tests/*.test.mjs
```

`export` checks the current review records before rendering the final video. After generating previews and frames, the authoring agent inspects them and records findings alongside the video source. Explicit shot dependencies let local changes invalidate only the related reviews. See [motion and review](skills/remotion-video/references/motion-and-review.md).

## Credits

This project combines Remotion and Remotion Bits with methods from Manim, video-shotcraft, the Humanizer projects and local design skills. Authors, pinned sources, uses and licenses are listed in [NOTICE.md](NOTICE.md) and [UPSTREAM.json](UPSTREAM.json). Original scripts and documentation use the [MIT license](LICENSE).
