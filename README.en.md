# Remotion Video

English · [中文](README.md)

A Codex plugin for making videos from a story framework, connected ImageGen keyframes, planned motion and segment reviews. It combines Remotion rendering and Remotion Bits examples with a practical authoring workflow.

## The v2 workflow

1. **Outline the story.** Set the subject, audience, narrative progression and approximate duration.
2. **Generate connected keyframes.** Establish character and style references. Reuse selected images and the relevant previous frame in later generations to preserve identity, objects, palette, framing and state.
3. **Refine the motion plan.** Use the actual images to improve the outline, transitions, object actions and effects.
4. **Build and inspect segments.** Render a short preview and review frames for each segment. Inspect geometry, contacts, spacing, trajectories and adjacent cuts. Repair the affected section before continuing.
5. **Review and deliver the complete video.** Make a simple complete pass for words, narration and visual continuity. Export when it passes and keep editable source and selected assets.

Built-in ImageGen is the default. Codex calls the image tool during authoring; setup scripts do not call an image API. Revisions can reuse existing suitable images. When the user delegates creative decisions, the workflow does not ask for approval at every stage.

## Installation

Requires Codex, Node.js 22 or newer, npm and Git. The local integration has been verified on Windows.

```sh
git clone https://github.com/Yi-Wang798/remotion-video.git
cd remotion-video
node scripts/setup.mjs
codex plugin marketplace add .
codex plugin add remotion-video@remotion-video-marketplace
```

Update an existing installation rather than enabling two copies. The current local installation continues to use the Personal marketplace.

Setup installs pinned rendering dependencies, downloads pinned upstream guides and writes a local `runtime.local.json`. The default runtime is `.local/share/remotion-video/runtime` in the user's home directory. To choose another directory:

```sh
node scripts/setup.mjs --runtime /absolute/path/to/video-runtime
node scripts/video.mjs doctor
```

Use `--reuse` to verify an existing matching runtime. `REMOTION_VIDEO_RUNTIME` and `REMOTION_VIDEO_BROWSER` override local settings. Runtime locations, browser paths, project media and credentials stay out of Git. Each authored project still needs its own `package.json` and dependencies, with matching Remotion package versions.

## Example request

> Use remotion-video to explain how a bacteriophage infects a bacterium. Generate consistent characters and connected keyframes first, then build and inspect each segment. Choose the style and duration, export an MP4 and keep the source.

Keep useful titles, necessary labels and captions. Do not automatically add production footers such as “AI-generated illustration” or obvious explanations of the medium. Preserve facts that matter to understanding the subject.

## Review helpers

```sh
node scripts/project.mjs init --project /absolute/project
node scripts/project.mjs revision --project /absolute/project
node scripts/review.mjs --project /absolute/project --shot shot-01 --composition MyVideo
node scripts/project.mjs check --project /absolute/project
node scripts/project.mjs check-final --project /absolute/project
node --test tests/project.test.mjs
```

The project plan records the framework, image provenance and reference relationships, shot states, segment reviews and final review. `review.mjs` exports staged frames, nearby cut boundaries and a motion preview. Its result starts as `pending`; the agent must inspect the evidence before recording a pass.

The check commands verify file existence, review records, source/asset revisions and the final text, narration and continuity outcomes. They do not equate a successful render with good visual design. See the [motion and review guide](skills/remotion-video/references/motion-and-review.md) for fields and usage.

## Attribution and licenses

| Source | Use |
|---|---|
| [Remotion](https://github.com/remotion-dev/remotion) | Video framework, preview and rendering |
| [Remotion Agent Skills](https://github.com/remotion-dev/skills) | Authoring and API guidance downloaded at pinned commits |
| [Remotion Bits](https://github.com/av/remotion-bits) | Animation components, example lookup and usage guidance |
| [Humanizer ZH by op7418](https://github.com/op7418/Humanizer-zh) | Adapted Chinese writing principles |
| [Humanizer by blader](https://github.com/blader/humanizer) | Adapted English and general editing principles |
| OpenAI built-in ImageGen | Reference artwork generation and editing in the host |

Original workflow material and helper scripts are [MIT licensed](LICENSE). Upstream projects retain their own licenses. See [NOTICE.md](NOTICE.md), `licenses/` and [UPSTREAM.json](UPSTREAM.json). This is a personal integration, not an official joint product. Upstream guides are downloaded from their sources during setup rather than redistributed in Git. The Remotion runtime retains its own license.
