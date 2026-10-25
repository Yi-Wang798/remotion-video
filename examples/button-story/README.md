# Connected keyframe smoke example / 连贯分镜验证样例

Frame A was generated with the built-in image tool. Frame B was generated with frame A as an explicit image reference. The robot, palette, pedestal and button are retained while the action changes from approach to press. `src/index.tsx` is a simplified reusable vector reconstruction for a short motion/review test, not a pixel-identical conversion.

两张图通过实际图片引用生成。代码复用同一个角色组件，连续完成靠近、伸手和按下；没有叠加制作说明。该样例用于验证生图引用、代码制作和分段审查工具，没有配音。

Install dependencies in this directory, matching `../../runtime/package.json`. Then run the plugin's review helper from the repository root. Review frames and generated media are local outputs, excluded from Git; the record is not automatically marked as passed.

Artwork: generated using OpenAI built-in ImageGen for this example. Source code: MIT, Yi-Wang798.
