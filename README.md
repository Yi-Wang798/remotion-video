# Remotion Video

[English](README.en.md) · 中文

一个用于 Codex 的视频制作插件。先搭框架，用内置生图工具制作相互关联的关键分镜，再完善衔接和动作，分段制作、检查和修正，最后导出完整视频。

Remotion 负责代码动画与渲染，Remotion Bits 提供动效组件。插件把视觉设计、制作和审查组织成同一个入口。

## v2 的制作流程

1. **基本框架**：确定讲什么、给谁看、故事怎样展开和大致片长。
2. **连贯的关键分镜**：先建立角色与风格参考，后续生图继续引用选定图片和前一个相关画面，保持角色、物件、色彩、构图与状态一致。
3. **完善动作逻辑**：根据实际生成的图片调整框架，设计镜头之间如何衔接、画面中什么在动，以及特效怎样配合动作。
4. **分段制作与视觉检查**：每段生成短预览和检查帧，实际查看造型、连接、间距、运动路径和前后镜头。发现问题后修正对应部分，再继续制作。
5. **完整检查与交付**：通看文字、旁白和视觉是否连贯；通过就导出，有问题就修改。保留源码和使用的素材。

默认使用内置 ImageGen。生图由 Codex 在制作过程中调用，安装脚本不会自行调用图像 API。已有合适素材的修改任务可以复用原图；不要求每次重新生成。

用户说“你自己决定”时，插件按流程自主完成，不会在每个阶段反复要求确认。

## 安装

需要 Codex、Node.js 22 或更新版本、npm 和 Git。当前版本的本地集成在 Windows 上验证。

```powershell
git clone https://github.com/Yi-Wang798/remotion-video.git
cd remotion-video
node scripts/setup.mjs
codex plugin marketplace add .
codex plugin add remotion-video@remotion-video-marketplace
```

已有同一个插件时更新现有安装，避免同时安装两份。当前电脑沿用 Personal 插件库中的安装。

`setup.mjs` 安装固定版本的渲染依赖，下载固定提交的上游指南，并写入本机 `runtime.local.json`。依赖目录默认位于用户目录下的 `.local/share/remotion-video/runtime`；也可指定：

```powershell
node scripts/setup.mjs --runtime "D:/video-runtime"
node scripts/video.mjs doctor
```

使用 `--reuse` 可验证并复用已有的匹配依赖。`REMOTION_VIDEO_RUNTIME` 和 `REMOTION_VIDEO_BROWSER` 可覆盖本机设置。运行环境、浏览器路径、项目素材和账户凭据不会写进仓库。项目本身仍需要自己的 `package.json` 和依赖，Remotion 相关包应保持相同版本。

## 使用

例如：

> 用 remotion-video 做一段介绍噬菌体如何感染细菌的科普视频。先生成角色和连贯分镜，再分段制作与检查。风格和片长由你决定，导出 MP4 并保留源码。

默认只保留有用的标题、必要标签和字幕。不会主动添加“拟人化科普动画”“非真实显微影像”等制作说明；科学内容中影响理解的事实仍会保留。

## 检查工具

```powershell
node scripts/project.mjs init --project "D:/videos/example"
node scripts/project.mjs revision --project "D:/videos/example"
node scripts/review.mjs --project "D:/videos/example" --shot shot-01 --composition MyVideo
node scripts/project.mjs check --project "D:/videos/example"
node scripts/project.mjs check-final --project "D:/videos/example"
```

`video-plan.json` 记录框架、图片来源和引用关系、镜头状态，以及分段与最终检查结果。`review.mjs` 导出阶段帧、相邻剪切点和该段短预览，结果初始为 `pending`。实际查看后才记录通过。

`check` 和 `check-final` 检查素材是否存在、审查记录是否完整、源码和素材是否已改变，以及最终文字、旁白和视觉连贯性是否通过。它们不会根据“能渲染”自动判定画面好看。完整字段见 [制作与审查说明](skills/remotion-video/references/motion-and-review.md)。

```powershell
node --test tests/project.test.mjs
```

## 来源与许可

| 来源 | 本插件中的用途 |
|---|---|
| [Remotion](https://github.com/remotion-dev/remotion) | 视频框架、预览与渲染 |
| [Remotion Agent Skills](https://github.com/remotion-dev/skills) | 制作与 API 指南，安装时下载固定提交 |
| [Remotion Bits](https://github.com/av/remotion-bits) | 动效组件、示例检索与使用指南 |
| [Humanizer ZH · op7418](https://github.com/op7418/Humanizer-zh) | 中文写作规则参考 |
| [Humanizer · blader](https://github.com/blader/humanizer) | 英文及通用写作规则参考 |
| OpenAI 内置 ImageGen | 在宿主中生成和编辑参考画面 |

原创建作流程与辅助脚本使用 [MIT License](LICENSE)。各上游项目保持各自许可，详见 [引用与许可声明](NOTICE.md)、`licenses/` 和固定版本记录 [UPSTREAM.json](UPSTREAM.json)。本项目是个人集成，不代表上述项目的官方联合产品。上游指南不随 Git 仓库重新分发；安装脚本从来源下载。Remotion 运行时使用其自身许可。
