# Remotion Video

用代码做视频，也把画面、动作和文字一起做好。

简单的数据播报、图表和流程图可以直接制作。需要新角色和复杂场景时，先用内置生图确定关键画面，再做连贯的动作与转场。数学和几何动画可以交给 Manim，最后在 Remotion 中合成字幕、旁白和其他镜头。

[English](README.en.md)

## 能做什么

- **按内容选流程**：直接制作或先做分镜；同一视频可以混用。
- **保持画面统一**：共用配色、字体、间距、线条和角色部件，参考本地 UI/UX Pro Max、Impeccable、React Bits 的设计方法。
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
node scripts/project.mjs init --project <project> --kind data
node scripts/project.mjs init --project <another-project> --kind illustration
```

`auto` 会根据是否需要新美术选择流程。可以用 `--workflow direct|designed` 和 `--review light|segments` 调整。详细说明见 [制作路径](skills/remotion-video/references/routing.md)。

## 示例与检查

- [数据摘要](examples/data-brief)：直接制作的柱状图与增长率，使用示例数据。
- [几何运动](examples/manim-orbit)：Manim 渲染轨迹，再由 Remotion 组合标题与画面。
- [按钮故事](examples/button-story)：沿用两张关联设计图，制作角色动作。

```text
node scripts/review.mjs --project <project> --composition <id> --all
node scripts/review.mjs --project <project> --composition <id> --shot <shot-id>
node scripts/project.mjs affected --project <project>
node scripts/project.mjs check-final --project <project>
node scripts/video.mjs export --project <project> src/index.tsx <id> renders/final.mp4
node --test tests/*.test.mjs
```

`export` 会先检查当前版本的审查记录，再导出成片。预览和抽帧生成后，由制作代理实际查看并填写检查结果。检查记录与视频源文件一起保存；镜头依赖明确时，局部修改只会使相关检查失效。见 [动作与检查](skills/remotion-video/references/motion-and-review.md)。

## 来源

本项目组合了 Remotion、Remotion Bits 的制作能力，并参考 Manim、video-shotcraft、Humanizer 系列及本地设计技能。作者、固定提交、使用方式与许可见 [NOTICE.md](NOTICE.md) 和 [UPSTREAM.json](UPSTREAM.json)。原创脚本与文档采用 [MIT 许可](LICENSE)。
