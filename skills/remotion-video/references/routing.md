# Production routing

Choose three things independently: how to build the visuals, what experience the video offers, and how much review it needs.

## Production path

`taskKind` accepts `general`, `data`, `diagram`, `illustration`, `product`. `workflow` accepts `auto`, `direct`, `designed`.

| Need | Typical production path |
| --- | --- |
| Numbers, titles, charts, simple processes | direct Remotion + SVG |
| New characters or elaborate illustrated scenes | designed, with connected ImageGen references |
| Formula, axes or geometric transformations | direct, optionally Manim CE clips assembled in Remotion |
| Product walkthrough or brand film | direct or designed using suitable footage and assets |

Auto chooses designed for `needsCustomArt: true` or `taskKind: illustration`, otherwise direct. Explicit workflow choices override it. Paths can coexist in a project; choose `shot.engine: remotion | manim` per shot. A designed project uses chosen references for its shots, including appropriate shared art direction for code-native portions.

## Expression and preview

Read [creative-direction.md](creative-direction.md). `creative.profile` accepts `auto`, `briefing`, `explanation`, `story`, `demonstration`, `atmosphere`, `custom`. Auto maps data to briefing, diagram/general to explanation, illustration to story and product to demonstration; choose a better explicit profile when the brief calls for it. A profile guides expression and never forces an engine, generated artwork, a location count or a theatrical story.

`creative.previewMode` accepts `auto`, `compact`, `animatic`. Auto uses animatic for a designed workflow or segment review, and compact otherwise. Override it to match the design problem. A compact preview uses ordered layout frames and the planned sequence; an animatic uses a timed motion preview. Both receive actual design judgment before detailed production.

## Production review effort

`reviewLevel` accepts `auto`, `light`, `segments`. Auto uses segments for designed, light for direct. Dense direct-code demonstrations may also need segments. Light means a complete preview and key states/cuts; segments adds local production reviews. Both finish with an assembled engagement/text/narration/continuity pass.

The shared sequence is framework and viewing promise → shot design → necessary artwork or direct rough layout → inspected rough sequence → production → proportional visual checks → complete pass and export. Develop artwork and shot logic together where useful. Final narration can wait until the rough sequence works; use temporary timing for the first preview.

New projects use version 3. Existing version 1/2 plans retain their prior production and export checks. To adopt design review during a redesign, add the `creative` brief, shot `visual` fields and design review record, or update the plan version to 3 and fill those fields. Do not silently rewrite old projects or carry over stale passes.
