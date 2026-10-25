# Visual development and continuity

Write the causal or narrative spine before generating images. For each beat, specify the viewer's takeaway and visible action. Keep timing approximate until narration and motion have been tried. Generate the keyframes needed to establish the visual world and explain important changes, rather than a decorative image for every sentence.

## Shared identity

Create a character/style reference with recognizable shapes, proportions, colors, material and line weight. Distinguish identity anchors from shot choices: camera, framing, location, layout, light and physical scale can change with the planned action. Use the same environment when continuity calls for it. Design additional views when a new shot needs them. Record stable character IDs and a short description of what must remain recognizable. For diagrams, fix the meaning of colors and component shapes.

Inspect the chosen reference with the image viewer. Check intended content, symmetry where appropriate, connected parts, clean edges and readable silhouettes. Repair a reference defect before using it in later frames.

## Connected built-in ImageGen calls

For each later keyframe, supply the chosen character/style reference and the relevant previous frame. Describe the change, persistent elements and entry/exit states. Use `referenced_image_paths` when all target references have local paths; inspect them first. For a target without a local path, follow the tool's conversation-image mechanism. Do not combine the two mechanisms. Use the current tool schema.

Prompt starting point:

> Use the attached character/style reference and preceding storyboard frame. Keep [identity, proportions and style anchors]. The next shot shows [visible event and reveal], from [viewpoint] at [scale], in [setting]. Carry forward [objects/state that remain relevant]. Change [framing/staging/light] to serve this shot. Compose for [aspect ratio] with room for [necessary overlay]. No decorative labels or watermark.

Respect the user's reference and brief rather than imposing a fixed style. Keep a cumulative chain of chosen references; repeating descriptive words in independent prompts does not establish continuity.

Copy chosen results into `assets/references/` and `storyboard/`. In `video-plan.json`, record each image's `id`, relative `file`, `generatedWith: "built-in-imagegen"`, and `basedOn` reference IDs. Existing user art can use `generatedWith: "user"` or `"existing"`. Do not leave project assets only in the tool's session/default output directory.

## From designs to motion

Revisit the framework after viewing actual frames. Define what moves, what stays fixed and what is visible before a cut. Match the last state of a shot with the next entry state. Preserve object identity, orientation, screen direction and count unless the story deliberately changes them.

Use layered image assets where the illustration style matters. Use built-in edits for clean character, foreground and background layers, preserving transparency when needed. Rebuild geometric elements as vectors when that preserves the chosen silhouette and composition. Reuse components for recurring body parts. Do not stretch a complete illustration differently on each axis or hide a continuity error behind a dissolve.

Inspect the selected keyframes as an ordered strip for purposeful changes in view, staging, scale and visible events. Make the compact preview or animatic described in [creative-direction.md](creative-direction.md) before detailed production. Compare the first representative coded shot to its keyframe at matching framing. Resolve obvious differences before building the full video. Text-only or timing-only revisions do not require new images.
