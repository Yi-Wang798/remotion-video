# Production routing

Choose visual treatment from what viewers should see, then select production tools. `taskKind` describes the subject; it does not override the treatment or an explicit image-generation request.

| Visual mode | Use when | Artwork and preview |
| --- | --- | --- |
| illustrated | characters, environments, spatial events, microscopic worlds or stylized narratives | connected generated designs/layers, suitable existing art or a deliberately chosen procedural drawing style; timed animatic and segment reviews |
| schematic | a simple labeled relationship or process is the intended form | direct code and compact layouts |
| data | numbers and chart comparisons carry the film | direct code and compact layouts |
| geometry | formulas, axes and geometric transformations carry the film | Remotion or optional Manim; compact layouts or an animatic as needed |
| footage | existing clips or recordings carry the film | selected footage; preview effort follows editing complexity |
| typography | the text itself carries the film | code typography; preview movement at intended speed |

A playful science explainer with characters and changing scales belongs in `illustrated`, even if it explains a mechanism. A financial brief need not generate illustrations. Honor a deliberately requested diagram, brand palette or minimalist treatment. Read [production-design.md](production-design.md) for plan fields and [creative-direction.md](creative-direction.md) for expression profiles.

## Settings and precedence

New plans use version 4. `creative.visualMode` selects the table row; `visualReason` explains the choice. `creative.artwork` is `built-in-imagegen`, `existing`, `procedural` or `none`. Procedural illustrated work keeps the designed workflow, animatic and segment reviews while using its drawing source in place of raster references. See [motion-craft.md](motion-craft.md). Record an explicit generation request with `imageGenerationRequired: true`. The request survives task-kind changes and cannot be overridden by direct workflow settings.

`init` defaults general, illustration and product work to illustrated generation. Data defaults to data; diagram defaults to schematic. These are starter choices: read the actual brief, then correct the mode before building. Use `--visual`, `--artwork` and `--require-imagegen` to set them at initialization.

Illustrated plans resolve to `workflow: designed`, `reviewLevel: segments`, `previewMode: animatic`; conflicting explicit settings are rejected. A generation-required plan also resolves to designed. Other modes retain `workflow: auto|direct|designed`, `reviewLevel: auto|light|segments` and `creative.previewMode: auto|compact|animatic`. Auto uses an animatic for designed/segment work, compact otherwise. Increase review effort for dense animation.

Each shot may use `engine: remotion|manim`. Code can animate geometric mechanisms within an illustrated film while sharing its art direction. References need not be newly generated for every shot.

Versions 1–3 retain their prior behavior and review records. For a substantial redesign, adopt version 4 and complete its fields; old passes cannot certify a new design. The sequence remains brief → visual route and shot design → necessary artwork → rough preview → production and scoped checks → assembled review → export. No routine user approval gate is added.
