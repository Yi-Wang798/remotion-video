# Data brief / 数据摘要

An eight-second direct-code example with synthetic quarterly revenue values, 100 and 120 million CNY. The growth result is 20%. Edit `video-plan.json` to update the source periods and metrics; the composition reads its values from that plan. No artwork generation is needed.

这是一个 8 秒的直接制作示例，使用两组示例收入数据。修改计划中的来源、报告期和指标，即可更新图表。实际制作时替换为所需数据与来源。

Prepare project dependencies from the plugin's `runtime/package.json` and lock file with `npm ci`, then run:

```text
node <plugin>/scripts/review.mjs --project <this-directory> --composition DataBrief --design
node <plugin>/scripts/review.mjs --project <this-directory> --composition DataBrief --all
```
