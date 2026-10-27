# Remotion Video

用本地绘制代码和素材制作动画，再由 Remotion 合成声音、字幕和镜头。

插件内附花叔与 Lemo 的绘制库、风格说明和场景源码。做视频时可以直接读取这些文件，沿用笔触、轮廓和材质的实现，为新题材重新设计角色与动作。需要插画素材时使用内置生图；简单的数据播报、图表和流程图可以直接制作。

[English](README.en.md)

## 本地风格库

目录收录花叔的 **36 种已有实现、17 条研究配方**，以及 Lemo 的 **59 种风格**。源码固定到具体提交，更新随插件发布，不在每次制作时重新搜索 GitHub。

风格入口分别记录源码位置、上游状态、素材缺口和本插件的验证情况。部分原始样例需要额外字体、纹理或模型；目录里已有清单。当前试渲染结果见 [验证记录](engines/verification.json)，完整用法见 [本地绘制引擎](skills/remotion-video/references/local-style-backends.md)。

```text
node scripts/styles.mjs list --backend huashu
node scripts/styles.mjs show huashu/09_postimp
node scripts/styles.mjs preview huashu/09_postimp --out <absolute-new-file.mp4> --seconds 3
```

`preview` 运行上游场景，用来查看画法。制作新内容时，`create` 复制实际引擎和所选风格源码；角色、构图和故事在项目里重新编写。

```text
node scripts/styles.mjs create --style huashu/09_postimp --project <new-absolute-directory>
node scripts/project.mjs init --project <same-directory> --kind illustration --artwork procedural
node scripts/styles.mjs render --project <same-directory> --out <absolute-new-clip.mp4> --seconds 8
```

新场景需要先完成绘制代码，再渲染。原生镜头完成后放入 Remotion，统一安排剪辑、旁白、音效和字幕。竖屏项目要按竖屏重新布局；输出尺寸与设计画布的比例保持一致。

## 安装与准备

在 Codex 中添加本仓库并安装 `remotion-video`。本地仓库也可以注册为插件市场：

```text
codex plugin marketplace add <repository-directory>
codex plugin add remotion-video@remotion-video-marketplace
```

安装 Node.js、Chrome 或 Edge，以及 ffmpeg 后，准备独立运行环境：

```text
node scripts/setup.mjs --runtime <absolute-runtime-directory> --with styles
node scripts/video.mjs doctor
node scripts/styles.mjs doctor --verify
```

已有 Remotion 运行环境时，只需运行 `node scripts/styles-setup.mjs` 补齐原生引擎依赖。首次准备会安装锁定版本的 npm 包，以后直接复用。本地浏览器渲染会阻止外网请求，缺失素材会报出路径。运行环境、项目和输出各自保存，升级插件时方便保留。

Remotion 项目使用 `runtime/package.json` 与锁文件中的依赖。额外的 Manim 与镜头参考按需准备：

```text
node scripts/setup.mjs --with manim,shotcraft
node scripts/video.mjs manim setup
```

Manim 使用独立 Python 环境；公式场景按需准备 LaTeX。固定版本与来源见 [UPSTREAM.json](UPSTREAM.json)。

## 制作与检查

直接告诉 Codex 题材、受众和已有素材，风格与时长也可以交给它决定。

> 用本地风格库做一段噬菌体杀死细菌的科普，角色可爱，动作连贯。

> 用这份季度数据做一段 20 秒动画，重点讲收入变化。

复杂动画先确定镜头推进，再试做关键动作。按画法选择程序绘制、关联生图或两者配合，检查动态预演后展开整片。简单数据视频检查布局与完整预览即可。配色、光影和材质随内容设计；画面文字保留字幕、必要标签和简短标题。

新项目使用版本 4 计划，支持原生引擎镜头与 Remotion、Manim 混合制作。插画路线使用动态预演和分段检查，明确要求生图的任务保留生图流程。已有版本 1–3 计划继续使用原检查方式。

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

预览和抽帧生成后，由制作代理查看并记录具体问题。复杂镜头在制作中分段检查，最后核对整片文字、声音和衔接。修改源码或素材会使相关检查失效；导出前重新检查受影响的部分。见 [动作与检查](skills/remotion-video/references/motion-and-review.md)。

## 示例与来源

- [绘画河流](examples/native-river)：新题材短镜头，使用花叔实际笔触库绘制水流和游鱼。
- [数据摘要](examples/data-brief)：示例数据的柱状图与增长率。
- [几何运动](examples/manim-orbit)：Manim 轨迹与 Remotion 合成。
- [接触与释放](examples/mechanism-motion)：关节、形变和共享音效时间线。

绘制引擎来自 [huashu-art-motion](https://github.com/alchaincyf/huashu-art-motion) 与 [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)，保留原作者、许可及字体和数据声明。Remotion、Remotion Bits、Manim 与 video-shotcraft 的使用范围和固定来源见 [NOTICE.md](NOTICE.md)。原创脚本与文档采用 [MIT 许可](LICENSE)。
