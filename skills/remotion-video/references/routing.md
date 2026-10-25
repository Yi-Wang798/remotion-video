# Production routing

Use `version: 2` plans. `taskKind` accepts `general`, `data`, `diagram`, `illustration`, `product`. `workflow` accepts `auto`, `direct`, `designed`; `reviewLevel` accepts `auto`, `light`, `segments`.

| Need | Workflow | Typical tools | Review |
| --- | --- | --- | --- |
| Financial figures, KPI summary, chart | direct | Remotion + SVG | light |
| Flowchart, simple mechanism, geometric icons | direct | Remotion, optionally Manim | light |
| New characters, elaborate science scenes | designed | connected ImageGen assets + Remotion | segments |
| Formula, axes, geometry, mathematical transform | direct | Manim CE clips + Remotion | light or segments |
| Product walkthrough, brand film | direct or designed | real footage + Shotcraft references | match shot complexity |

`auto` selects designed when `needsCustomArt: true` or `taskKind: illustration`; otherwise it selects direct. Auto review selects segments for designed and light for direct. Set explicit choices after assessing the brief: a dense geometric proof can need segment review even with no images. Existing version 1 plans retain their image-led workflow and review behavior.

Keep only necessary planning detail. Start with one sentence per shot, then fill timing and state transitions. For mixed videos, use the designed project path if custom artwork is needed, and reuse a chosen visual reference for charts where relevant. `engine` is a per-shot `remotion` or `manim` field.

Image-led work follows framework → necessary connected artwork → refined shot logic → layered motion → segment review → complete pass. Direct work follows framework/data → layout and motion → complete preview and key frames → focused repairs → export.
