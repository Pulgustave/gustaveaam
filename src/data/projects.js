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
        description: `# RSA — Native Format Integration: Writing Directly to Robot's File Format

*Grasshopper, Python, Autodesk Robot Structural Analysis*

A curved concrete shell — around 7,800 triangular finite elements, three thickness zones, asymmetric soil loading — needed to move from Grasshopper into Robot Structural Analysis fully loaded and analysis-ready, on a tight deadline, and re-importable every time the geometry changed.

![Concrete shell geometry, top and bottom views](${rsaRobotModel})

---

## The Problem With "The Right Way"

The obvious paths all led somewhere worse:

- **BHoM** pushes elements to Robot one at a time over COM. For 7,800 elements that's 20+ minutes per iteration — not viable for a model that needed to change daily.
- **Excel VBA** can drive Robot through \`RobotOM.dll\`, but hit unresolvable method signature errors on \`FEServer.Create\`.
- **GHPython + win32com** got close — node creation and thickness labels worked — but Python can't construct Robot's proprietary COM array types, so finite element creation stalled entirely.

Three approaches, three dead ends, all trying to talk to Robot through its API.

---

## The Way In Nobody Documents

Robot opens its own native \`.str\` format directly via File → Open. It's plain text. No API, no COM, no middleware — just a file format Robot happens to read.

\`Grasshopper mesh → GHPython exporter → shell_import.str → Robot\`

7,800 elements, 3 load cases, correct geometry and thicknesses, imported in **seconds** instead of 20+ minutes.

![Discretized mesh, divided into 3 zones for load application and thickness definition](${rsaLoadPanels})

---

## Loads Without Panels

Robot wants **panel objects** to apply surface loads correctly on shells — without them, a \`PZ=\` load on a raw element is read as a linear load (kip/ft) instead of a surface load (kip/ft²). One panel per triangle hangs Robot on import; one panel per zone loses the per-face variation the asymmetric soil load needed.

The fix: skip panels entirely. Convert every surface load to **equivalent nodal forces** before writing the file —

\`total_force = load × face_area\`, then \`nodal_force = total_force / 3\`

— and let shared boundary nodes accumulate contributions from adjacent faces automatically. Robot's solver picks up nodal forces correctly with or without panels; the only cost is that the viewport shows point loads instead of a pressure diagram. Verified against hand calculations: self-weight + SDL (1,356 kips) and live load (~330 kips) both matched Robot's results exactly.

![Mesh imported into Robot, with SDL (asymmetric soil load) and LL (constant) applied](${rsaLoadVerification})

---

## The Format Itself

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

A few rules cost real debugging time: the file **must be UTF-16 LE** — ASCII fails silently, with no error. \`ROBOT97\` has to be the first line and \`END\` the last. \`NUMbering DIScontiguous\` allows non-sequential IDs. Material names have to match Robot's database exactly (\`CONCR\`, \`A36\`, \`A992\`...). And every import has to start from a blank Robot project — re-importing into an existing model produces duplicate ID errors.

Adjacent zone meshes also needed coincident-node deduplication — snapping points to a rounded coordinate key (0.1mm tolerance) so zone boundaries connect structurally instead of leaving the mesh split into disconnected islands.

---

## Key Lessons

- Robot's COM API is effectively closed to Python — its proprietary array types are VBA-only.
- \`dir()\` is the real documentation. Method names rarely match what the SDK implies.
- The "unsupported" route — writing the native file format directly — turned out faster, simpler, and more reliable than anything built on the official API.
- The model was analysis-ready the same day the geometry was finalized. With COM, that wasn't on the table.`
    },
    {
        id: 8,
        title: 'CRAFT - REVIT ADD-IN - MULTIPLE AUTOMATIONS',
        categories: ['Programming', 'Automations'],
        image: revitAddIn,
        description: `# Building CRAFT Aladdin: Automating the Invisible Work of Structural Engineering

Structural engineering has a public-facing story: you calculate loads, size members, make the decisions that keep a building standing. Then there's the other work — forty gridlines renamed by hand, two hundred columns tagged one by one, twelve framing plan sheets aligned by eye. Systematic, repetitive, necessary, and consuming time that should have gone to thinking about the structure.

CRAFT Aladdin started as an attempt to make that work disappear.

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

*CRAFT Aladdin is under active development. Current commands cover project setup, grid management, arch model coordination, documentation, and model cleanup.*`
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
