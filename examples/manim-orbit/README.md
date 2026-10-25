# Manim + Remotion / 几何运动

A six-second Manim CE scene with a fixed-radius orbit, assembled in Remotion with a shared palette and title. It uses geometry without LaTeX. Render the clip before running the Remotion preview.

这是一个 6 秒的混合示例：Manim 制作圆周运动，Remotion 合成标题，配色与线条统一。

```text
node <plugin>/scripts/video.mjs manim setup
node <plugin>/scripts/video.mjs manim render --project <this-directory> --entry src/scene.py --scene Orbit --quality h --fps 30 --output public/clips/orbit.mp4
node <plugin>/scripts/review.mjs --project <this-directory> --composition OrbitFilm --all
```

Prepare matching Node project dependencies as described in the main README. The generated `public/clips/orbit.mp4` is created locally from the included Python source.
