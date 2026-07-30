import pixelArt from '../assets/pixelArt.png';
import LV_THEVERYMANY_Milan1 from '../assets/LV_THEVERYMANY_Milan1.webp';
import revitAddIn from '../assets/RevitAddIn.png';
import theverymanyGlyphs from '../assets/theverymany_glyphs.svg';
import rsaRobotModel from '../assets/rsa_robot_model.png';
import rsaLoadPanels from '../assets/rsa_load_panels.png';
import rsaLoadVerification from '../assets/rsa_load_verification.png';
import thisSiteHome from '../assets/this_site_home.png';
import thisSiteThumb from '../assets/this_site_thumb.png';
import thisSiteGlitch from '../assets/this_site_glitch.gif';
import rhinoMcpShell from '../assets/rhino_mcp_shell.jpg';
import rhinoMcpThickness from '../assets/rhino_mcp_thickness.jpg';
import rhinoMcpHeatmapSmooth from '../assets/rhino_mcp_heatmap_smooth.jpg';
import rhinoMcpHeatmapFlat from '../assets/rhino_mcp_heatmap_flat.jpg';
import rhinoMcpDatumRedirect from '../assets/rhino_mcp_datum_redirect.jpg';
import rhinoMcpDatumCurve from '../assets/rhino_mcp_datum_curve.jpg';

export const projects = [
    {
        id: 13,
        title: 'THIS SITE - A PORTFOLIO BUILT WITH CLAUDE CODE',
        categories: ['Web Tool', 'Programming', 'Creative Coding'],
        image: thisSiteThumb,
        description: `# Building This Site: A Portfolio That Doesn't Look Like a Template

*React, Vite, p5.js, Claude Code*

This portfolio is itself a project — built, redesigned, and iterated on almost entirely through conversation with **Claude Code**, running inside the actual project repo: reading the codebase, rewriting components, restyling, and pushing to GitHub Pages.

![This site's homepage](${thisSiteHome})

---

## Starting Point

A React 19 + Vite single-page app, routed with \`react-router-dom\`, styled with CSS Modules and a small set of global design tokens, deployed via \`gh-pages\`. Functional, but visually generic — the kind of layout that could belong to anyone.

---

## The Redesign, in Two Passes

The first pass leaned into a bold color-block, neo-brutalist-lite look — punchy, playful, easy to build. It read well on its own, but next to other AI-assisted portfolios it felt like a template with the names swapped: competent, but not *me*.

The second pass started from a different question: what actually feels personal? Simulations and simulacra. Code as a material. Mystery, science, machines. The answer became the **Glitch / Simulacra Terminal** look this site has now — near-black, CRT scanlines, JetBrains Mono everywhere, RGB-split glitch text on hover, terminal-green and magenta accents, bracket-styled buttons and tags (\`[ like this ]\`).

---

## The Background Is the Point

The centerpiece is a recolored **Conway's Game of Life**, running live in p5.js behind every page — green cells with the occasional magenta "glitch" cell, full automaton rules, click-and-drag to seed new patterns. Not decoration so much as the thesis of the site: small, simple, deterministic rules quietly producing something that looks alive. *"The machine thinking,"* running underneath everything else.

![The Game of Life background animating behind the homepage](${thisSiteGlitch})

---

## Working With an AI Pair

The interesting part wasn't the code — Claude Code can write CSS modules and React components quickly. The interesting part was the back-and-forth: showing a first pass, hearing "this looks like Codecademy," and figuring out together what would actually feel different. The personalization came from describing taste in words — *simulations, robots, mystery, "you know what actually feels like me? it doesn't exist"* — and watching that get translated into a palette, a font, and a set of UI motifs.

This project entry, and the one about the RSA \`.str\` integration above it, were both added the same way: pointing Claude Code at a Notion doc and a folder of assets and letting it draft the case study, then editing from there.

---

## Stack

- **React 19 + Vite 7** — SPA, routed with \`react-router-dom\` v7
- **p5.js** — the Game of Life background simulation
- **CSS Modules + design tokens** — per-component styling on top of a shared palette
- **react-markdown + rehype-raw** — project case studies written as markdown with embedded images and iframes
- **gh-pages** — one-command deploy to GitHub Pages`
    },
    {
        id: 12,
        title: 'RSA - NATIVE FORMAT INTEGRATION',
        categories: ['Computational Design', 'Structural Engineering', 'Automations'],
        image: rsaRobotModel,
        description: `# RSA — Native Format Integration: Bypassing the API to Ship 7,800 Elements in Seconds

*Grasshopper, Python, Autodesk Robot Structural Analysis*

A curved concrete shell with around 7,800 triangular finite elements, three thickness zones, and asymmetric soil loading needed to move from Grasshopper into Robot Structural Analysis fully loaded and analysis-ready, on a tight deadline, and re-importable every time the geometry changed.

![Concrete shell geometry, top and bottom views](${rsaRobotModel})

---

## Why the Usual Approaches Didn't Work

- **BHoM** pushes elements to Robot one at a time over COM. For 7,800 elements that's 20+ minutes per iteration, which isn't workable for a model that needed to change daily.
- **Excel VBA** can drive Robot through \`RobotOM.dll\`, but hit unresolvable method signature errors on \`FEServer.Create\`.
- **GHPython + win32com** got close: node creation and thickness labels worked, but Python can't construct Robot's proprietary COM array types, so finite element creation stalled entirely.

All three were trying to talk to Robot through its API.

---

## Writing the .str File Directly

Robot can open its own native \`.str\` format directly via File → Open. It's plain text, with no API, COM, or middleware involved — just a file format Robot happens to read.

\`Grasshopper mesh → GHPython exporter → shell_import.str → Robot\`

7,800 elements and 3 load cases, with correct geometry and thicknesses, imported in seconds instead of 20+ minutes.

![Discretized mesh, divided into 3 zones for load application and thickness definition](${rsaLoadPanels})

---

## Handling Surface Loads Without Panels

Robot needs panel objects to apply surface loads correctly on shells. Without them, a \`PZ=\` load on a raw element is read as a linear load (kip/ft) instead of a surface load (kip/ft²). But one panel per triangle hangs Robot on import, and one panel per zone loses the per-face variation the asymmetric soil load needed.

Instead, every surface load is converted to equivalent nodal forces before writing the file:

\`total_force = load × face_area\`, then \`nodal_force = total_force / 3\`

Shared boundary nodes accumulate contributions from adjacent faces automatically, and Robot's solver picks up nodal forces correctly with or without panels — the only tradeoff is that the viewport shows point loads instead of a pressure diagram. This was checked against hand calculations: self-weight + SDL (1,356 kips) and live load (~330 kips) both matched Robot's results exactly.

![Mesh imported into Robot, with SDL (asymmetric soil load) and LL (constant) applied](${rsaLoadVerification})

---

## The .str Format

A working \`.str\` file is structured roughly as:

\`\`\`
ROBOT97
SHEll
NUMbering DIScontiguous
NODes {n}  ELEments {n}
UNIts
LENgth=ft  Force=kip
NODes
  {id}  {x}  {y}  {z}
ELEments
TRIangular 3
  {id}  {n1}  {n2}  {n3}
PROperties
"{material_name}"
  {e1} {e2} ...  TH={thickness_ft}
LOAds
CASe # 1 SW
SELf-weight
  {e1} {e2} ...  PZ MINus
CASe # 2 SDL
NODes
  {node_id}  FZ={force_kips}
END
\`\`\`

A few details cost real debugging time. The file must be UTF-16 LE; ASCII fails silently with no error. \`ROBOT97\` has to be the first line and \`END\` the last. \`NUMbering DIScontiguous\` allows non-sequential IDs. Material names have to match Robot's database exactly (\`CONCR\`, \`A36\`, \`A992\`...). And every import has to start from a blank Robot project, since re-importing into an existing model produces duplicate ID errors.

Adjacent zone meshes also needed coincident-node deduplication, snapping points to a rounded coordinate key (0.1mm tolerance) so zone boundaries connect structurally instead of leaving the mesh split into disconnected islands.

---

## Takeaways

Robot's COM API is effectively closed to Python, since its proprietary array types are VBA-only, and \`dir()\` ended up being the real documentation, as method names rarely matched what the SDK implied. Writing the native file format directly turned out faster, simpler, and more reliable than anything built on the official API, and the model was analysis-ready the same day the geometry was finalized — with COM, that wasn't on the table.`
    },
    {
        id: 14,
        title: 'RHINO MCP — SHELL THICKNESS ANALYSIS',
        categories: ['Computational Design', 'Structural Engineering'],
        image: rhinoMcpShell,
        description: `# Rhino MCP — Shell Thickness Analysis

*Rhino 8, Python, Claude, Model Context Protocol*

This is yet another working case study of Claude operating a live Rhino 8 session through the Rhino MCP Platform — not a plugin the user clicks through. We can call it "a conversational workflow where Claude writes and runs Python directly inside Rhino, reads geometry back, makes judgment calls about what it's seeing, and iterates with the user in real time", or the afternoon I started to feel weird.

The task was not as simple as it seemed: build a full 3D wall-thickness map of a freeform architectural shell, a continuous heatmap and per-inch (per-inch! yeah, that monstrous Imperial System…) contour system across the entire surface, plus a derived "datum" curve marking a specific structural transition, driven entirely through natural-language requests, with Claude handling the mesh generation, geometric measurement, visualization, and labeling.

In the end, this is another good excuse to test AI against Computational Design Workflows in AEC and have a little fun. This is the geometry we operated on.

![Freeform shell geometry in Rhino, two-skin Brep](${rhinoMcpShell})

---

## Why MCP matters here

Traditional AI-assisted CAD workflows are usually one of two things: a static script the user runs once, or a chat window bolted onto the side of the software with no real read/write access. I have lived that and I don't love it. The Rhino MCP Platform gives Claude:

- **Direct read access** to the live document: object geometry, layers, selection state, viewport — so Claude can inspect what's actually there rather than guess from a file.
- **Direct write access**: Claude can mesh, measure, bake geometry, create layers, and manage document state, in the same session the user is looking at.
- **A visual feedback loop**: Claude can pull viewport screenshots to check its own work, and the user can screenshot/mark up results back to Claude to redirect it.

This case study is really a demonstration of that loop: \`build → check → get corrected → rebuild\`, several times over, converging on a result neither a fixed script nor a blind one-shot AI generation would have reached.

---

## Thickness measurement

With two separate, non-touching skins, thickness is a two-body problem: for each point on the external surface, how far is it to the internal surface?

**Approach:** hybrid ray-cast + closest-point fallback.

1. Mesh both Breps with explicitly tuned \`MeshingParameters\` — Rhino's defaults over-tessellate curvy freeform surfaces badly (curvature-driven refinement can produce 5-10x more vertices than needed). Explicit control over \`Tolerance\`, \`MinimumEdgeLength\`, \`MaximumEdgeLength\`, and disabling \`ComputeCurvature\`/\`RefineGrid\` brought both meshes down to a manageable, predictable density (~7,600 / ~7,300 vertices here).
2. For every vertex on the external mesh, cast a ray along its normal in both directions into the internal mesh (\`Intersection.MeshRay\`); take whichever direction hits first.
3. If neither ray hits (rare, near edges/creases), fall back to a closest-point query on the internal mesh.
4. Sanity-check the resulting histogram before committing to anything. This caught real problems in earlier iterations — ray escapes producing false long-distance hits showed up as a clean second bump in the distribution, distinguishable from the real, smoothly tapering data. This iteration's histogram was clean on the first pass: no artifact tail, smooth decline from a peak at 11".

\`\`\`python
best_t = None
t1 = Rhino.Geometry.Intersect.Intersection.MeshRay(int_mesh, Rhino.Geometry.Ray3d(p, nrm))
if t1 >= 0:
    best_t = t1
t2 = Rhino.Geometry.Intersect.Intersection.MeshRay(int_mesh, Rhino.Geometry.Ray3d(p, -nrm))
if t2 >= 0:
    if best_t is None or t2 < best_t:
        best_t = t2
if best_t is not None:
    thickness_ft[i] = best_t
else:
    cp = int_mesh.ClosestPoint(p)
    thickness_ft[i] = p.DistanceTo(cp)
\`\`\`

*Thickness measurement logic we worked out after chatting a bit.*

![Thickness histogram — clean distribution, no artifact tail](${rhinoMcpThickness})

---

## Visualization

Two heatmap variants, both on a turbo/rainbow colormap:

**Smooth** — standard per-vertex Gouraud-shaded mesh, colors blending continuously across each triangle.

![Smooth heatmap](${rhinoMcpHeatmapSmooth})

**Flat** — every triangle rebuilt with three unique unwelded vertices, all colored identically from that triangle's rounded average thickness, so adjacent triangles in different bands show a hard edge instead of a blend, making the discrete patches that match the contour lines directly visible.

![Flat heatmap](${rhinoMcpHeatmapFlat})

Contours were extracted with a per-triangle marching-squares approach at 1-inch intervals. Each inch level got its own Rhino layer holding both its contour lines and labels together, so any thickness band can be shown or hidden independently.

---

## The datum curve (the interesting part)

This is where the human-in-the-loop iteration mattered most.

**First attempt:** looked for a curvature sign flip along vertical section profiles of the external surface, sampled radially from the shell's centroid. Found inconsistent results: some sections flipped near the crown, others near the base, plus a couple of outright noisy outliers. All of this was presented back rather than silently picking one and moving on.

**Redirect:** check the internal surface instead, near the base — a real, pronounced transition was expected around 4" up.

**Second attempt:** found a strong curvature-sign flip at ~3–4" up. A follow-up screenshot from the user, marked up by hand, showed they meant a different, much higher, more visually prominent fold line entirely.

![User-annotated screenshot redirecting the datum search](${rhinoMcpDatumRedirect})

**The actual criterion**, given directly by me after a few minutes of frustration using "normal" language: find where the internal surface's true normal vector has zero Z-component, i.e., points exactly parallel to the floor. This is a precise, physically meaningful, and far more numerically robust criterion than curvature sign-flipping.

\`\`\`python
result = int_brep.ClosestPoint(pt, 2.0)
success, cp, ci, u, v, nrm = result
# ... sample nrm.Z along the profile, find where it crosses zero
\`\`\`

Rerun with this criterion: 62 of 66 sampled angles found a clean crossing, clustering tightly between 3.64 ft and 3.96 ft above the base (mean 3.77 ft) — zero outliers. A dramatically cleaner result, because it was measuring the thing I actually meant.

The final curve was interpolated through the 62 found points (periodic, since it wraps the full perimeter), tagged with a visible \`TextDot\` reading its measured height, and projected onto the external surface using a horizontal ray cast — ensuring exact height preservation, since a horizontal ray can only hit a surface at the same Z it started at.

![Final datum curve projected onto the external shell surface](${rhinoMcpDatumCurve})

---

## What this demonstrates

- **Screenshots as a feedback channel work in both directions.** Claude pulled viewport captures to self-check; I annotated a screenshot by hand to redirect Claude toward the actual feature I meant — a correction that would have been very hard to convey in text alone.
- **Wrong-but-plausible results get caught by cross-checking, not by getting lucky.** The first two datum-curve attempts produced clean, confident-looking numbers that were nonetheless measuring the wrong thing. Histograms, outlier clustering, and direct visual confirmation each caught a different failure mode.
- **The loop is genuinely iterative, not one-shot.** Nothing here was a single prompt → single script → done. Each technique was proposed, tested, validated, and only then run at full scale — several results were revised after user feedback.
- **The document stays live.** Because Claude has write access to the same Rhino session the user is looking at, the deliverable isn't a file handed over at the end — it's the actual working document, updated in place, ready to keep iterating next session.

The most important thing is that this enhances our capabilities, allowing us to build incredible things if we are knowledgeable enough to know where we are going. Otherwise, we might get somewhere — not necessarily worth our time and tokens.`
    },
    {
        id: 8,
        title: 'CRAFT - REVIT ADD-IN - MULTIPLE AUTOMATIONS',
        categories: ['Programming', 'Automations'],
        image: revitAddIn,
        description: `# Building the CRAFT Revit Plugin: Automating the Invisible Work of Structural Engineering

Structural engineering has a public-facing story: you calculate loads, size members, make the decisions that keep a building standing. Then there's the other work — forty gridlines renamed by hand, two hundred columns tagged one by one, twelve framing plan sheets aligned by eye. Systematic, repetitive, necessary, and consuming time that should have gone to thinking about the structure.

The CRAFT Revit plugin started as an attempt to make that work disappear.

---

## The Insight

Repetitive engineering tasks follow deterministic rules. Vertical grids are sorted left to right and named S-1, S-2, S-3. Always. A column tagged UP has a top level above the current reference level. Every time. When a task has rules that never change, the question stops being *how do I do this* and becomes *why am I the one doing it*.

If it has rules, it can be code.

---

## The Commands

<iframe src="${import.meta.env.BASE_URL}aladdin-viz.html" style="width: 100%; height: 500px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; margin: 2rem 0; background: var(--bg-color);"></iframe>

**B1 — Column UP/DOWN Tags** reads each column's base and top level elevations, compares them to the view's reference level with a floating-point tolerance, and places one of three tag types. The engineer confirms the column selection and tag family assignments before anything is placed.

**B2 & B3 — Grid Renaming and Dimensions** determine orientation from each grid's direction vector, sort by midpoint coordinate, apply the S-1/S-A naming convention, and place dimension strings in the active view. Two buttons, two minutes, same result every project.

**B4 — Align Framing Views** finds the engineering plan viewport on each target sheet, computes the exact offset from a template sheet's viewport center, and moves it. Twelve sheets aligned precisely in forty seconds.

**B5 & B6 — Wall Openings** place structural openings matching the architect's windows — B5 automatically, filtering the linked model by construction phase; B6 manually, using the window's known host wall to avoid nearest-wall ambiguity. Both exist because B5 has cases where B6 is right.

**B7 — Clean Slate** resets a template model in dependency order: annotations first, then beam systems, slabs, framing, columns, walls — so nothing fails trying to delete a parent before its children. Levels and views are protected unconditionally. A report shows exactly what was removed and what was skipped.

---

## Adoption

Each button went through the same arc: skepticism, a first use on a live project, quiet adoption. The skepticism was rational — automated tools in engineering don't fail loudly, they fail silently, and a wrong tag on a construction document is a real error. What earned trust was specificity: not "it works," but "here is exactly what it checks, here is what it cannot know, here is what you still confirm yourself."

By the third project on each tool, no one asked anymore.

---

## What Was Gained

Time, obviously. But more importantly, consistency — every project's grids follow the same convention, every framing plan set is aligned to the same reference, regardless of who ran the tool or when.

And something harder to name: permission. When repeatable work is automated, the energy it used to consume goes somewhere else. The half-hour on grid dimensions becomes time spent on the section layout. That was the point all along.

---

*The CRAFT Revit plugin is under active development. Current commands cover project setup, grid management, arch model coordination, documentation, and model cleanup.*`
    },
    {
        id: 1,
        title: 'THEVERYMANY PAVILIONS - THEVERYMANY / CRAFT - MILAN / LONDON / SINGAPORE',
        categories: ['Computational Design', 'Structural Design', 'Confidential'],
        image: theverymanyGlyphs,
        description: `Projects include Pavilion Nomad (Milan 2023), TheVeryMany London, and TheVeryMany Singapore.
These projects and their specific structural engineering details are confidential.

<iframe src="${import.meta.env.BASE_URL}theverymany_glyphs_showcase.html" style="width: 100%; height: 500px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin: 2rem 0; background: transparent;"></iframe>`
    },
    {
        id: 11,
        title: 'PIXELIZER - IN-BROWSER PIXEL ART GENERATOR',
        categories: ['Creative Coding', 'Web Tool'],
        image: pixelArt,
        description: `# Pixel Art Generator
*JavaScript, HTML5 Canvas*

A browser-based image pixelizer that converts photographs into retro pixel art using a two-pass rendering pipeline. The first pass downscales the source image to a low-resolution grid using bilinear averaging, condensing each pixel block into a single representative color. The second pass upscales the result with nearest-neighbor interpolation to produce hard pixel edges without smoothing artifacts.

Color quantization is handled in two modes: posterization, which snaps each RGB channel to a set of evenly-spaced discrete levels, and palette matching, which maps every pixel to the closest color in a fixed palette using squared Euclidean distance in RGB space. The tool ships with five historically accurate palettes including the original Game Boy DMG four-shade green, Game Boy Color, Pico-8, CGA, and Endesga 32.

Built as a single self-contained HTML file with no external dependencies.

<iframe src="${import.meta.env.BASE_URL}pixelizer.html" style="width: 100%; height: 750px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin: 2rem 0; background: var(--bg-color);"></iframe>`
    }
];
