# Data videos

Start from the user's files or authoritative releases. For “recent” figures, retrieve the current release and record its date and reporting period. Read the source rather than inferring numbers from an animated chart.

Each `dataSources` item has `id`, `period`, `unit`, optional `currency`, and a `url` or project-relative `file` snapshot. Each raw metric has `id`, numeric `value`, and `sourceId`. Derived metrics use `formula: {kind: "difference" | "pctChange", current: "id", previous: "id"}`. For percentage change, the value is expressed as percent (20 means 20%). Source periods distinguish YoY from QoQ; state the comparison in the script and labels. The helper checks arithmetic and unit/currency compatibility; read the source to verify accounting definitions and the intended periods.

Use `taskKind: data`. List the metric IDs each shot uses. Build labels and chart values from the same data object so that revisions update both. Preserve raw precision for computation; round for display. Separate a percentage change from a percentage-point change. Convert currency or units explicitly before comparing them. A nonpositive growth baseline needs a written interpretation rather than the percentage-change helper. Example projects use `purpose: example` and `kind: example` data sources.

Prefer a useful sequence: what changed → the comparison → the implication supported by the numbers. Choose a zero baseline for bars; show units and reporting periods with the chart. Use one accent for the main comparison and consistent semantic colors. Hold the final values long enough to read. Do not make viewers read a dense source paragraph while numbers move.

Direct code is usually enough: titles, counters, bars, lines, highlights and smooth position changes. A background image or elaborate camera move needs a specific role. Image generation remains available for a custom visual, rather than being a routine step.

Review final values, chart geometry, axes, label spacing, signs, units, source periods and spoken numbers. Check subtitles against the same values. Save the source links and calculation notes with the project; include concise visible source credit where it helps the audience check the claim.
