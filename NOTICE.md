# 引用与许可声明 / Attribution and licenses

## Original work

The adaptive production workflow, creative design and preview review helpers, setup wrapper and bilingual documentation are maintained by Yi-Wang798. Their original portions are covered by the root MIT license. This license does not replace any upstream license.

## Remotion and official Agent Skills

- Authors: Remotion contributors / Remotion team.
- Runtime: https://github.com/remotion-dev/remotion ; terms: https://www.remotion.dev/license .
- Guidance: https://github.com/remotion-dev/skills . The exact commit and downloaded subdirectory are recorded in `UPSTREAM.json`.
- Use: video authoring, Studio, rendering and API guidance. Runtime dependencies are installed from npm. Guides are fetched locally by setup, not redistributed in this Git repository. The pinned skills snapshot has no root license file; this project does not assign it a new license.

## Remotion Bits

- Author: av and contributors. Source: https://github.com/av/remotion-bits .
- Use: reusable components and find/fetch example tools. npm package `remotion-bits` declares MIT. Guides are downloaded locally from the pinned source rather than bundled in Git. The component library is not authored by this project.

## Humanizer ZH and Humanizer

- Humanizer ZH by op7418: https://github.com/op7418/Humanizer-zh . Local reference version: 0.1.0, MIT; license preserved in `licenses/humanizer-zh-MIT.txt`.
- Humanizer by blader: https://github.com/blader/humanizer . Local reference version: 2.8.2, MIT; license preserved in `licenses/humanizer-MIT.txt`.
- Use: natural expression, concrete wording, varied spoken rhythm, removal of inflated language and filler. `writing.md` adapts these principles to short video scripts. It intentionally allows deleting empty sentences and does not preserve draft length or expose editing reports inside the video. The original skills are not required installations and their full instructions are not copied into this plugin.
- Both projects cite the Wikipedia community page https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing as background. That page is acknowledged here; its text is not reproduced in this repository.

## Built-in image generation

Image generation is provided by the host's built-in OpenAI ImageGen tool and is called by the agent. No image model, API credentials or image-generation SDK is bundled in this repository. Host and tool terms continue to apply to generated assets.

## 中文说明

本插件的原创流程与脚本采用根目录 MIT 许可。Remotion、Remotion Bits、Humanizer 与 Humanizer ZH 的作者及许可保持不变。去 AI 味规则是在本地技能基础上针对视频文案重新整理的，引用不代表上游作者为本插件背书。Remotion 等可选制作指南由安装脚本按固定提交下载；下列 Huashu 与 Lemo 源码包随本插件分发。本项目不代表任何上游项目的官方联合产品。


## Manim

- Manim Community: https://github.com/ManimCommunity/manim , MIT. Optional runtime installed from PyPI in a separate environment, pinned in `runtime/manim.json`.
- adithya-s-k/manim_skill: https://github.com/adithya-s-k/manim_skill , MIT. The optional CE guide pack provides geometry, updater, transform and camera references.
- Yusuke710/manim-skill: https://github.com/Yusuke710/manim-skill , MIT. The optional narration guide informs audio-led timing and timestamp review.
- Exact guide commits and paths are recorded in `UPSTREAM.json`. Guides and their license files are fetched locally. Original upstream notices remain in the checkout under the runtime's `.upstream/` directory.

## video-shotcraft

- Vincentwei1021 and contributors: https://github.com/Vincentwei1021/video-shotcraft , Apache-2.0 for the selected code and documentation.
- Setup fetches the pinned selection listed in `UPSTREAM.json`, including LICENSE and shot-card ATTRIBUTION. This integration uses data, camera, typography, transition and review methods. Original files and comments retain their attribution in the local vendor directory.
- Upstream audio has separate terms; the selected guide pack contains no audio assets. Preserve notices and review asset-specific terms when bringing a demo's external artwork or audio into a video.

## Optional frontend design references

- UI/UX Pro Max by nextlevelbuilder and contributors: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill , MIT. Palette, type and layout guidance.
- Impeccable by pbakaus and contributors: https://github.com/pbakaus/impeccable , Apache-2.0. Hierarchy, spacing, typography and visual critique.
- React Bits by DavidHDev and contributors: https://github.com/DavidHDev/react-bits , MIT with Commons Clause. Optional local motion references; its component source is not bundled here.
- The adapter describes how to use installed skills and translate browser interaction into frame-based video. These projects are not runtime dependencies of this plugin.


## Bundled native drawing engines

- Huashu / alchaincyf: https://github.com/alchaincyf/huashu-art-motion , commit `8a0d7d72ca65fcce6f8ba82c4a6c8dfe35b8422c`. Code and documentation retain the original MIT license at `engines/huashu/LICENSE`. The selected `scripts/engine` source, style recipes and fonts are redistributed unchanged; exact byte hashes are listed in `engines/huashu/BUNDLE.json`.
- Huashu exceptions: bundled fonts retain their OFL notices under `scripts/engine/lib/fonts`; stroke median data in `reference_films/spacex/spacex_wb/assets/strokes.js` retains its embedded Arphic Public License. Author-persona image/frame directories, original films, audio and other binary artwork are excluded. Demo characters, mascot appearances and original compositions are references for technique; production creates a new cast and subject.
- LemoLab: https://github.com/lemomo-ai/lemo-opuscar , commit `413a6bd6d78ebd3bdd5abaec9538a26867f890df`. Code and documentation retain MIT at `engines/lemo/LICENSE`. The selected `core`, `styles` source and guides are redistributed unchanged; exact hashes are listed in `engines/lemo/BUNDLE.json`. Upstream README licensing and per-style credits remain in the bundle.
- Lemo's original demo films and stills are CC BY 4.0 with asset/voice exceptions described in its README. Those media files and voice tracks are excluded. Running included demo code as a benchmark is recorded as upstream work, not a newly authored film. New production adapts drawing techniques to new subjects.
- Supplemental Baloo 2, Titan One, VT323 and Bungee fonts complete the Sci-Fi Toon demo's existing CSS. They are downloaded once from Google Fonts and bundled under their OFL licenses in `engines/lemo/licenses`. Their download URLs, sizes and hashes are separate in `SUPPLEMENTAL.json`; they are not claimed as files present at the pinned Lemo Git commit.
- The adapter, native renderer wrapper, asset-gap catalog and original river scene are this project's work under the root MIT license. Native libraries and fonts retain their own notices when copied into editable projects. Known excluded demo resources appear in the catalog; rendering a selected style exposes any additional dynamic dependencies.
- https://github.com/zhuyansen/awesome-claude-video-skills was used to discover and compare approaches, not as an animation dependency.
