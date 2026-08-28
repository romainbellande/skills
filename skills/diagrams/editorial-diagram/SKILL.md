---
name: editorial-diagram
description: Editorial house style for draw.io diagrams — white-smoke paper, one tangerine accent, eyebrow-chip nodes, mono sublabels, bottom legend. Load alongside drawio-skill for any architecture, data-flow, sequence, or system diagram; when the user asks for the editorial / house / reference diagram style; or when restyling an existing .drawio into it.
license: MIT
compatibility: Requires drawio-skill (draw.io desktop CLI). Fonts Geist / Geist Mono / Instrument Serif are optional — style strings carry fallbacks.
---

# Editorial Diagrams

A style contract layered on `drawio-skill`. That skill owns the mechanics (XML skeleton, shape search, autolayout, export, self-check); this one owns how the result **looks**: cool editorial — white-smoke paper, jet-black ink, exactly one tangerine accent, technical detail in mono, everything on a 4px grid.

Adapted from [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) — its `references/style-guide.md` is the upstream source of these tokens.

## Workflow

1. **Read `drawio-skill`** for the file skeleton, shape vocabulary, and export commands. Everything below overrides its default color/shape/font tables.
2. **Plan before drawing.** Name the diagram type, the **one** focal node, and what you are cutting. Complexity budget: ≤9 nodes flat, ≤24 when zoned into containers. Above 24, split into pages.
3. **Author the XML** using the tokens, node anatomy, and edge grammar below. [`assets/example.drawio`](assets/example.drawio) is a rendered-and-verified diagram in this style — copy its cells rather than retyping style strings.
4. **Export and look at it**: `drawio -x -f png -e -s 2 -b 24 -o out.drawio.png in.drawio`, then drawio-skill's `scripts/repair_png.py out.drawio.png`, then read the PNG back with vision and run the taste gate. Keep `-b 24` (breathing room) and drop `-t` (the paper background must be painted).

## Tokens

Set `background="#F5F5F5"` on `<mxGraphModel>` and export **without** `-t`.

| Role | Hex | Use |
|---|---|---|
| `paper` | `#F5F5F5` | Page background |
| `paper-2` | `#ECECEC` | Container fill |
| `ink` | `#2D3142` | Primary text, primary stroke |
| `muted` | `#4F5D75` | Sublabels, default arrows |
| `soft` | `#7A8399` | Eyebrows, boundary labels |
| `rule` | `#D5D6D8` | Hairlines, chip + container borders |
| `accent` | `#EB6C36` | Focal node, primary flow — **1–2 elements max** |
| `link` | `#2E5AA8` | HTTP / API / external calls |
| `ghost` | `#E3E4E5` | Oversized step ordinals behind node text |

### Node type → fill / stroke

| Type | fillColor | strokeColor |
|---|---|---|
| `focal` (1 per diagram) | `#F4EAE6` | `#EB6C36` |
| `backend` | `#FFFFFF` | `#2D3142` |
| `store` | `#EBEBEC` | `#4F5D75` |
| `external` | `#EFEFF0` | `#B9BABF` |
| `input` | `#E4E6E8` | `#7A8399` |
| `optional` | `#F1F1F2` | `#CDCED1` + `dashed=1;dashPattern=4 3` |
| `security` | `#F4EEEB` | `#F0B196` + `dashed=1;dashPattern=4 4` |
| `container` | `#ECECEC` | `#D5D6D8` |

### Type ramp

| Role | Family | Size | Weight |
|---|---|---|---|
| node name | `Geist, Inter, Helvetica` | 12 | 600 |
| sublabel (port, path, protocol) | `Geist Mono, JetBrains Mono, monospace` | 9 | 400 |
| eyebrow chip / container label | mono | 7 | uppercase, `letter-spacing:0.18em` |
| edge label | mono | 8 | uppercase, `letter-spacing:0.06em` |
| page title | `Instrument Serif, Georgia, serif` | 26 | 400 |

Mono is for *technical* content only — ports, paths, commands, field types. Human-readable names go in sans. Install [Geist](https://vercel.com/font) and Instrument Serif for an exact match; the stacks above degrade cleanly without them.

### Geometry

`absoluteArcSize=1` everywhere. `arcSize=8` small tags · `12` node boxes · `16` containers. Stroke `1` default, `1.2` emphasis, `0.8` chips. Node `208×72`. Gap between nodes `≥64`. Container padding `24`. **Every coordinate, size, and gap divisible by 4.**

## Node anatomy

A node is a body plus a corner chip — and, on numbered flow steps only, a ghost ordinal. Chip and ordinal are children of the body (`parent="<bodyId>"`, geometry relative to it).

```xml
<mxCell id="origin" value="&lt;b&gt;Astro Origin&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-family:Geist Mono,JetBrains Mono,monospace;font-size:9px;color:#4F5D75&quot;&gt;SSR + MDX&lt;/span&gt;"
  style="rounded=1;absoluteArcSize=1;arcSize=12;html=1;whiteSpace=wrap;fillColor=#F4EAE6;strokeColor=#EB6C36;strokeWidth=1;fontFamily=Geist, Inter, Helvetica;fontSize=12;fontColor=#2D3142;verticalAlign=middle;spacingTop=8;"
  vertex="1" parent="1"><mxGeometry x="520" y="320" width="208" height="72" as="geometry"/></mxCell>

<mxCell id="origin-chip" value="ORIG"
  style="rounded=1;absoluteArcSize=1;arcSize=8;html=1;fillColor=#F5F5F5;strokeColor=#D5D6D8;strokeWidth=0.8;fontFamily=Geist Mono, JetBrains Mono, monospace;fontSize=7;fontColor=#7A8399;letterSpacing=1.2;"
  vertex="1" parent="origin"><mxGeometry x="12" y="8" width="48" height="16" as="geometry"/></mxCell>

<mxCell id="origin-num" value="02"
  style="text;html=1;fillColor=none;strokeColor=none;align=right;fontFamily=Geist Mono, JetBrains Mono, monospace;fontSize=36;fontColor=#E3E4E5;"
  vertex="1" parent="origin"><mxGeometry x="128" y="28" width="68" height="40" as="geometry"/></mxCell>
```

Containers carry their label as an eyebrow, centered at the top, not as a swimlane header:

```xml
<mxCell id="content" value="CONTENT"
  style="rounded=1;absoluteArcSize=1;arcSize=16;html=1;whiteSpace=wrap;fillColor=#ECECEC;strokeColor=#D5D6D8;strokeWidth=1;verticalAlign=top;spacingTop=8;fontFamily=Geist Mono, JetBrains Mono, monospace;fontSize=7;fontColor=#7A8399;letterSpacing=1.2;container=1;collapsible=0;"
  vertex="1" parent="1"><mxGeometry x="840" y="120" width="288" height="440" as="geometry"/></mxCell>
```

## Edge grammar

Four edge meanings, no more. Base for all:
`edgeStyle=orthogonalEdgeStyle;rounded=1;arcSize=12;html=1;endArrow=block;endFill=1;endSize=6;strokeWidth=1;fontFamily=Geist Mono, JetBrains Mono, monospace;fontSize=8;letterSpacing=0.5;verticalAlign=bottom;labelBackgroundColor=none;`

`verticalAlign=bottom` is load-bearing — it lifts the label clear of the line instead of letting the stroke run through it.

| Meaning | Append |
|---|---|
| default relation | `strokeColor=#4F5D75;fontColor=#4F5D75;` |
| primary flow (the spine) | `strokeColor=#EB6C36;fontColor=#EB6C36;strokeWidth=1.2;` |
| HTTP / API call | `strokeColor=#2E5AA8;fontColor=#2E5AA8;` |
| return / async | `strokeColor=#4F5D75;fontColor=#4F5D75;dashed=1;dashPattern=4 3;` |

Labels are uppercase mono verbs or protocols: `HTTPS`, `READ MDX`, `QUERY`, `RESP`. When edges stack at a shape boundary, run `drawio-skill`'s `scripts/edgeports.py`.

## Layout and legend

The primary flow runs **left→right on one horizontal band**, y-aligned. Grouped subsystems sit in a container to the right of the spine. Keep ≥40px page margin.

Every diagram ends with a legend: a hairline (`line` shape, `strokeColor=#D5D6D8`) spanning the diagram width, the word `LEGEND` in eyebrow type below its left end, then a swatch row — a 20×14 sample of each node type used and a 32px stub of each edge type used, each followed by a 10px sans label. **The legend covers every type present and nothing else.**

## Taste gate

Run before handing the diagram over — every box checked, or fix and re-render.

- [ ] Accent appears on ≤2 elements, and they are the ones that deserve focus.
- [ ] Every node can justify itself: nothing removable, nothing that always travels with its neighbour, no arrow the layout already implies.
- [ ] Sans for names, mono for technical strings — no leaks either way.
- [ ] Every coordinate and size divisible by 4; primary flow y-aligned.
- [ ] Legend matches the types used exactly.
- [ ] Within budget (≤9 flat, ≤24 zoned).
- [ ] PNG read back with vision: no clipped labels, no overlapping edges, background painted `#F5F5F5`.
