# Contact and release

An eight-second abstract mechanism study. The carrier approaches, reaches, contacts a membrane, opens a gate and releases its payload. It demonstrates animation controls rather than a specific biological transport mechanism. There is no narration or on-screen text.

Copy this example to your video workspace. Use the runtime dependencies described in the root README, then run from the plugin repository:

```text
node scripts/motion-kit.mjs install --project <copied-example>
node scripts/sound-cues.mjs <copied-example>/timeline.json --out <copied-example>/public/cues.wav
node scripts/review.mjs --project <copied-example> --composition SoftMechanism --shot encounter --study
node scripts/video.mjs render --project <copied-example> src/index.tsx SoftMechanism renders/soft.mp4
node scripts/video.mjs render --project <copied-example> src/index.tsx PaperMechanism renders/paper.mp4
```

`SoftMechanism` uses translucent volume, gradients and soft shadows. `PaperMechanism` uses saturated flat fills, outlines and offset shadows. Both use the same action and event timeline. Reuse the primitives, then design the subject, timing and composition for your own topic.

Reviews start pending. Inspect the actual study and completed film before recording a production pass. Commands here render development examples; a user video is delivered through the reviewed export workflow.
