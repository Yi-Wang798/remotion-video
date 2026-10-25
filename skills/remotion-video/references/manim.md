# Manim CE clips

Use Manim for geometry, coordinate systems, formulas and linked mathematical motion. Keep Remotion as the assembly layer for captions, layout, narration and other scenes. Simple charts can stay entirely in Remotion.

```text
node <plugin>/scripts/setup.mjs --with manim
node <plugin>/scripts/video.mjs manim setup
node <plugin>/scripts/video.mjs manim doctor
node <plugin>/scripts/video.mjs manim render --project <project> --entry src/scene.py --scene Orbit --quality h --fps 30 --output public/clips/orbit.mp4
```

The wrapper uses an isolated Python environment inside the selected runtime and pins the version in `runtime/manim.json`. The current pin needs Python 3.11 or newer. Set `REMOTION_VIDEO_PYTHON` to a suitable interpreter for first setup. Use `--reuse` to check an existing environment. `MathTex`/`Tex` scenes also need a working LaTeX installation. Use ordinary text or geometric labels when typesetting is unnecessary.

Read `vendor/manimce-best-practices/SKILL.md` and the relevant geometry, updater, transformation and camera rules. Read `vendor/manim-narration/SKILL.md` for narration-led timing and timestamp review practices. Adapt those practices to the existing project; keep the selected voice and folder structure. Use CE imports (`from manim import ...`) consistently.

Match resolution, frame rate, background, palette, stroke weight and text sizes to the Remotion composition. Render clips before bundling the final composition. Put clips in `public/clips/`, import with `staticFile()` and Remotion's supported video component, then trim with explicit frame counts. Record the Python source and final clip in the shot's dependencies. Update clip length and shot timing together; test the first and last visible frames at the cut.

Use solid matching backgrounds for the default H.264 path. For an alpha workflow, choose a supported alpha-capable codec and verify the result with the actual renderer. Render a short test scene before committing to a large formula or 3D sequence.
