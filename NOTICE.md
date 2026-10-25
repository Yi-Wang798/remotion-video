# 引用与许可声明 / Attribution and licenses

## Original work

The integrated image-led workflow, review helpers, setup wrapper and bilingual documentation are maintained by Yi-Wang798. Their original portions are covered by the root MIT license. This license does not replace any upstream license.

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

本插件的原创流程与脚本采用根目录 MIT 许可。Remotion、Remotion Bits、Humanizer 与 Humanizer ZH 的作者及许可保持不变。去 AI 味规则是在本地技能基础上针对视频文案重新整理的，引用不代表上游作者为本插件背书。上游制作指南由安装脚本按固定提交下载，本仓库不重新分发这些指南。本项目不代表任何上游项目的官方联合产品。
