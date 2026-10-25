# Remotion Video

先想清楚观众为什么愿意看下去，再把画面、动作和声音做出来。

简单的数据播报、图表和流程图可以直接制作。需要新角色和复杂场景时，先用内置生图确定关键画面，再做连贯的动作与转场。数学和几何动画可以交给 Manim，最后在 Remotion 中合成字幕、旁白和其他镜头。

[English](README.en.md)

## 能做什么

- **先设计观看过程**：按用途安排开场、视觉推进和收尾。数据简报、机制解释、故事、产品演示、氛围短片各有合适的表达方式。
- **先预演再精修**：简单视频检查几张顺序布局图；复杂视频先看带时间的简易动态分镜，及早发现单调或拖沓的段落。

- **按内容选流程**：直接制作或先做分镜；同一视频可以混用。
- **保持画面统一**：共用配色、字体、间距、线条和角色部件，按内容改变机位、构图、尺度与场景，参考本地 UI/UX Pro Max、Impeccable、React Bits 的设计方法。
- **找到合适的动作**：Remotion Bits 提供组件与示例；可选 Shotcraft 参考包补充数据、文字、运镜和转场的镜头卡与代码。
- **检查实际成片**：简单视频看完整预览和关键帧；复杂镜头边做边检查，改动后复查相关镜头与相邻切点。
- **核对数据**：记录来源、报告期、单位和币种，检查差值与增长率。
- **把话说清楚**：参考 Humanizer 和 Humanizer ZH，删掉套话、自夸和无用的制作说明。

## 安装

在 Codex 插件市场中添加本仓库，然后安装 `remotion-video`。也可以从本地仓库注册：

```text
codex plugin marketplace add <repository-directory>
codex plugin add remotion-video@remotion-video-marketplace
```

安装 Node.js 后，在仓库目录准备运行环境：

```text
node scripts/setup.mjs --runtime <absolute-runtime-directory>
node scripts/video.mjs doctor
```

运行环境与视频项目各自放在独立目录，方便升级插件。项目使用与运行环境相同版本的依赖，可复制 `runtime/package.json` 与锁文件到项目后运行 `npm ci`。渲染使用 Chrome；可在本地 `runtime.local.json` 配置 `browserExecutable`。版本记录在 [UPSTREAM.json](UPSTREAM.json)。

需要更多镜头参考时：

```text
node scripts/setup.mjs --with manim,shotcraft
node scripts/video.mjs manim setup
node scripts/video.mjs manim doctor
```

Manim 使用独立 Python 环境，需要 Python 3.11 或更新版本；公式排版按所用场景准备 LaTeX。普通图表和 Remotion 视频只需 Node.js 与浏览器。

## 开始制作

直接告诉 Codex 想讲什么、给谁看，以及已有的数据或素材。风格与时长也可以交给它决定，例如：

> 用这份季度数据做一段 20 秒动画，重点讲收入变化，画面简洁。

> 做一段噬菌体杀死细菌的科普，角色可爱、动作连贯，时长你决定。

手动建项目时：

```text
node scripts/project.mjs init --project <project> --kind data --profile briefing
node scripts/project.mjs init --project <another-project> --kind illustration
```

`auto` 会根据是否需要新美术选择流程。可以用 `--workflow direct|designed` 和 `--review light|segments` 调整。表达方式可用 `--profile` 选择，设计预览可用 `--preview compact|animatic` 调整。新项目使用版本 3 计划，已有版本 1/2 项目沿用原检查方式。见 [制作路径](skills/remotion-video/references/routing.md) 和 [镜头设计](skills/remotion-video/references/creative-direction.md)。

## 示例与检查

- [数据摘要](examples/data-brief)：直接制作的柱状图与增长率，使用示例数据。
- [几何运动](examples/manim-orbit)：Manim 渲染轨迹，再由 Remotion 组合标题与画面。
- [按钮故事](examples/button-story)：沿用两张关联设计图，制作角色动作。

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

`design` 会提示连续同构图、构图占比集中等情况，供实际查看时参考。`export` 会先检查当前版本的设计审查和成片审查记录，再导出成片。预览和抽帧生成后，由制作代理实际查看并填写检查结果。设计预览检查开场、推进与节奏，成片检查实际效果、文字、声音与衔接。检查结果保存到项目文件中；镜头依赖明确时，局部修改只会使相关检查失效。见 [动作与检查](skills/remotion-video/references/motion-and-review.md)。

## 来源

本项目组合了 Remotion、Remotion Bits 的制作能力，并参考 Manim、video-shotcraft、Humanizer 系列及本地设计技能。作者、固定提交、使用方式与许可见 [NOTICE.md](NOTICE.md) 和 [UPSTREAM.json](UPSTREAM.json)。原创脚本与文档采用 [MIT 许可](LICENSE)。
