# DESIGN.md: Apple × ChatGPT UI system for coding agents

Version 2.0 · October 2026 · Light theme by default. Built from Apple's Human Interface Guidelines (2026 edition), OpenAI's ChatGPT plugin UI guidelines, the token files in `@openai/apps-sdk-ui` v0.2.2 (MIT), and a SaaS UI checklist supplied by the project owner. Everything below is written for implementation. It is not a copy of any source. See §21 for what was read.

---

## 0. How to use this file

You are a coding agent. Read this file in full before you write or change any UI.

**Precedence:** explicit user instruction > this file > component-library defaults > your own taste.

**Theme:** build the light theme only. Add the dark theme (§4.2, §17) only when the user explicitly asks for dark mode. Don't add a theme toggle or a `prefers-color-scheme` rule unless asked.

**Workflow for every UI task:**

1. Write down, in one sentence, the one job this page or view exists for (§7.1). Everything on the page must serve that sentence.
2. Pick the layout pattern from §7 and the components from §10 and §11. Prefer an existing pattern over inventing one.
3. Style only with the tokens in §4. No raw hex, px font sizes, or ad-hoc shadows inside components.
4. Use icons from one library, Lucide or Phosphor (§12). Never emoji.
5. Write every label with §13, using the action words in §13.2.
6. Fill the view with realistic, messy data (§14) and check every state: loading, empty, error, one item, many items.
7. Before you finish, run the checklist in §19 and fix anything that fails.

**Platform scope:** written for the web (HTML/CSS, React, Tailwind). If you are building a native Apple app, use the system components (SwiftUI/UIKit), SF Symbols and system colors instead of these tokens and icon libraries; the behavioral rules still apply.

---

## 1. The look in one paragraph

A light, near-white, flat interface that reads like a well-made document. Grays do almost all of the work; thin 1px borders separate things instead of shadows. Color appears only where it means something: in data, in statuses, in links and focus, and in the one near-black primary button. Text uses the platform's system font in a handful of sizes. Every button shares the same pill shape. Icons are monochrome outlines from a single library. There are no emoji, gradients, glows, or decorative illustrations, and nothing moves unless the movement tells the user something.

---

## 2. Principles

Use these to break ties when a rule below doesn't cover your case.

1. **Start with intent.** Each page answers one question for one kind of visit. Design for that question first; add features only when the user's intent grows, never because there was space to fill.
2. **Inform, don't decorate.** For every element ask: does this help the user finish the job they came for? If it is only decoration, delete it. Before adding anything, try deleting something.
3. **Quiet chrome, loud content.** Navigation and controls stay visually lighter than the content they act on.
4. **One obvious next step.** Each view has one prominent action. Everything else is secondary, quiet, or in a menu.
5. **Familiar beats clever.** Use patterns people already know and keep things where users expect them.
6. **Certainty over speed.** Every action gives visible feedback and a clear finished state. Destructive actions are undoable or confirmed in proportion to the damage they can do.
7. **Show something immediately.** People will wait for work that visibly progresses. They won't wait for a blank screen.
8. **Same thing, same way.** One word per action, one radius per control type, one icon per concept, one size scale. Inconsistency reads as amateur even when nobody can say why.
9. **Adapt to the person.** Respect text size, reduced motion, reduced transparency, keyboard-only use, touch vs pointer, and any width from 320px up.
10. **The conversation stays central (ChatGPT surfaces).** UI around a chat supports the conversation. It never duplicates the composer or replaces what the model can say in text.

---

## 3. Hard rules

Treat these as lint rules. Breaking one requires an explicit user instruction.

**MUST**

1. Use the light theme. Use dark only when the user explicitly asks for it.
2. Use the system font stack from §4. No webfonts for UI text.
3. Use tokens for every color, size, radius, shadow, and duration.
4. Use exactly one icon library per project: Lucide (default) or Phosphor. Every icon in the UI comes from it (§12).
5. Give every button the same radius (`--radius-button`). No mix of square and round buttons.
6. Meet WCAG AA: 4.5:1 for text below 18px regular (or below 14px bold), 3:1 for larger text, icons, focus rings, and the outlines of checkboxes, radios, and switches.
7. Give every tap target at least 44×44px on touch devices. Visual size can be smaller if the hit area is padded out.
8. Show a visible focus ring on keyboard focus (`:focus-visible`), 2px, accent color, 2px offset.
9. Make every action reachable by keyboard; Esc closes the topmost overlay.
10. Pair any status color with an icon or a word. Color is never the only signal.
11. Keep one primary button per view. Rank other buttons by variant, not size.
12. Use the action words in §13.2. The same action has the same label on every screen.
13. Show something in the first frame of every load: a skeleton or the real layout, never a blank region.
14. Give every action a visible finished state (§10.14).
15. Protect destructive actions with the tier that matches the damage (§10.7).
16. Honor `prefers-reduced-motion` and `prefers-reduced-transparency`.
17. Apply hover styles only under `@media (hover: hover) and (pointer: fine)`.
18. Keep text inputs at 16px or larger on touch devices (smaller sizes make iOS Safari zoom on focus).
19. Respect safe areas with `env(safe-area-inset-*)` for anything fixed to a screen edge.

**MUST NOT**

1. **Use emoji anywhere in the interface.** Not in headings, buttons, labels, menus, toasts, empty states, placeholders, page titles, alt text, landing-page copy, sample data, or seed data. The only exception is content a user typed themselves, rendered as they typed it.
2. Use Unicode symbols as icons (check marks, crosses, stars, arrows, bullets, warning signs, hamburger glyphs, chevron characters). Use the icon component. Status dots are CSS circles, not characters.
3. Mix icon libraries, or draw your own SVG for a concept the chosen library already covers.
4. Ship a dark theme, a theme toggle, or `prefers-color-scheme` styles unless the user asked for them.
5. Use gradients, patterns, glows, colored page backgrounds, or colored backgrounds behind text areas.
6. Put shadows on page content or buttons. Shadows are only for overlays, the onboarding "Start here" card, and items being dragged.
7. Use font weights below 400 or more than two type families (sans + mono).
8. Put more than one primary or accent-filled button in a view.
9. Repeat the same KPI or summary cards on several pages. Summary numbers live on the dashboard only.
10. Nest a scroll container inside a card, or add tabs or drill-in navigation inside a card.
11. Stack overlays: no modal on a modal, no second popover, never two alerts at once.
12. Animate content in on load or on scroll (fade-ins, fly-ins, staggered reveals), or use parallax or scroll-jacking.
13. Use infinite scroll on any page that has a footer or a list the user needs to finish.
14. Auto-dismiss anything the user must read or act on.
15. Hide or disable navigation destinations because a section is empty. Show an empty state instead.
16. Write "Oops", "Uh-oh", "Click here", "Yes/No" buttons, or blame the user.
17. Autoplay audio or video with sound.
18. Invent customer logos, testimonials, ratings, or usage numbers and present them as real. Use clearly marked placeholders and tell the user.

---

## 4. Tokens

### 4.1 Light theme (default)

Paste this block once, at the root of the app.

```css
:root {
  color-scheme: light;

  /* ---------- Type ---------- */
  --font-sans: ui-sans-serif, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
    "Noto Sans", "Helvetica Neue", Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji",
    sans-serif; /* emoji fonts are listed only so user-typed content renders */
  --font-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* size / line-height pairs (px). See §5 for usage. */
  --text-caption: 12px;   --leading-caption: 16px;
  --text-footnote: 13px;  --leading-footnote: 18px;
  --text-sm: 14px;        --leading-sm: 20px;
  --text-body: 16px;      --leading-body: 24px;
  --text-lg: 18px;        --leading-lg: 28px;
  --title-3: 20px;        --leading-title-3: 26px;
  --title-2: 24px;        --leading-title-2: 30px;
  --title-1: 28px;        --leading-title-1: 34px;
  --large-title: 34px;    --leading-large-title: 41px;
  --display: 48px;        --leading-display: 52px;
  --tracking-tight: -0.02em; /* only for 28px and up */

  /* ---------- Space (4px grid) ---------- */
  --space-0-5: 2px;  --space-1: 4px;   --space-1-5: 6px;  --space-2: 8px;
  --space-3: 12px;   --space-4: 16px;  --space-5: 20px;   --space-6: 24px;
  --space-8: 32px;   --space-10: 40px; --space-12: 48px;  --space-16: 64px;

  /* ---------- Radius ---------- */
  --radius-xs: 4px;    /* inline code, small tags */
  --radius-sm: 6px;    /* checkboxes, tags */
  --radius-md: 8px;    /* text fields, menu items */
  --radius-lg: 12px;   /* menus, popovers, tooltips, code blocks */
  --radius-xl: 16px;   /* cards, images, message bubbles */
  --radius-2xl: 20px;  /* dialogs, large cards */
  --radius-3xl: 28px;  /* sheets (top corners), composer */
  --radius-full: 9999px;
  --radius-button: var(--radius-full); /* every button, icon button, chip, segmented control */
  --radius-field: var(--radius-md);    /* every text field and select */

  /* ---------- Control sizes ---------- */
  --control-sm: 28px;
  --control-md: 32px;  /* desktop default */
  --control-lg: 36px;
  --control-xl: 40px;
  --control-touch: 44px;
  --control-default: var(--control-md);
  --icon-sm: 16px; --icon-md: 20px; --icon-lg: 24px;
  --hairline: 1px;

  /* ---------- Layout ---------- */
  --sidebar-width: 260px;
  --topbar-height: 52px;
  --content-max: 768px;   /* reading column, chat thread */
  --page-max: 1200px;     /* dashboards, tables, settings grids, landing-page container */
  --nav-height: 64px;     /* marketing nav (56px below 768px) */
  --grid-gap: 24px;       /* gap between cards and bento tiles (16px below 768px) */
  --card-pad-sm: 16px;    /* compact cards under ~280px wide, list-like cards */
  --card-pad: 24px;       /* default card and bento tile padding */
  --card-pad-lg: 32px;    /* pricing cards, tiles wider than ~560px at 1280px+ */
  --gutter: 16px;

  /* ---------- Surfaces ---------- */
  --bg: #ffffff;               /* main canvas */
  --bg-secondary: #f9f9f9;     /* sidebar, app frame, screenshot panels */
  --bg-grouped: #f4f4f4;       /* page behind inset-grouped settings lists */
  --surface: #ffffff;          /* cards, rows, tables */
  --surface-elevated: #ffffff; /* menus, popovers, dialogs, sheets */
  --fill-soft: #f4f4f4;        /* chips, user chat bubble, skeletons, icon circles */

  /* ---------- Text ---------- */
  --text: #0d0d0d;
  --text-2: #5d5d5d;           /* secondary text, descriptions */
  --text-3: #6e6e6e;           /* captions, timestamps, placeholders */
  --text-disabled: #a3a3a3;    /* disabled controls only */
  --text-inverse: #ffffff;

  /* ---------- Lines and interaction overlays ---------- */
  --border-subtle: rgb(13 13 13 / 0.06);
  --border: rgb(13 13 13 / 0.10);
  --border-strong: rgb(13 13 13 / 0.16);
  --control-border: #8a8a8a;   /* checkbox, radio and switch outlines (3.5:1) */
  --hover: rgb(13 13 13 / 0.05);
  --pressed: rgb(13 13 13 / 0.10);
  --selected: rgb(13 13 13 / 0.07);

  /* ---------- Actions ---------- */
  --primary-fill: #0d0d0d;     /* the one primary button */
  --primary-hover: #2f2f2f;
  --on-primary: #ffffff;
  --accent: #1762e0;           /* links, focus, selection, active state */
  --accent-fill: #1762e0;      /* brand CTA background (landing pages only) */
  --on-accent: #ffffff;
  --accent-soft: #ecf2fd;      /* selected row, info callout */
  --accent-line: #c5d8f7;
  --focus-ring: var(--accent);

  /* ---------- Status: text/icon, solid fill, soft background, thin border ---------- */
  --danger: #ba2623;   --danger-fill: #e02e2a;   --danger-soft: #fff0f0;   --danger-line: #f6c0bf;
  --success: #00692a;  --success-fill: #008635;  --success-soft: #edfaf2;  --success-line: #b2e3c6;
  --warning: #b9480d;  --warning-fill: #b9480d;  --warning-soft: #fff5f0;  --warning-line: #f6ccb5;
  /* info uses the accent tokens */

  /* ---------- Tags (user-defined labels, categories). Muted pastels. ---------- */
  --tag-gray-bg: #f4f4f4;   --tag-gray-text: #4f4f4f;
  --tag-blue-bg: #e5f3ff;   --tag-blue-text: #004f99;
  --tag-green-bg: #e6f7ec;  --tag-green-text: #00692a;
  --tag-yellow-bg: #fff6d9; --tag-yellow-text: #6e5400;
  --tag-orange-bg: #ffefe5; --tag-orange-text: #923b0f;
  --tag-red-bg: #ffecec;    --tag-red-text: #911e1b;
  --tag-purple-bg: #f3ecfe; --tag-purple-text: #6b3ab4;
  --tag-pink-bg: #ffeef6;   --tag-pink-text: #963c67;

  /* ---------- Elevation (overlays only) ---------- */
  --shadow-overlay: 0 0 0 1px rgb(0 0 0 / 0.06), 0 8px 24px -6px rgb(0 0 0 / 0.12);
  --shadow-raised: 0 0 0 1px rgb(0 0 0 / 0.04), 0 4px 12px -2px rgb(0 0 0 / 0.08); /* Start here card, dragged item */
  --backdrop-dim: rgb(0 0 0 / 0.30);

  /* ---------- Material (controls floating over photos, video or maps only, see §8) ---------- */
  --glass-tint: rgb(255 255 255 / 0.78);
  --glass-border: rgb(0 0 0 / 0.08);
  --glass-blur: 20px;

  /* ---------- Motion ---------- */
  --dur-instant: 100ms; /* press feedback */
  --dur-fast: 150ms;    /* hover, color, small toggles */
  --dur-base: 200ms;    /* menus, popovers, tooltips */
  --dur-slow: 300ms;    /* sheets, dialogs, drawers */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);     /* entering */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);         /* leaving */
  --ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);  /* sheet and drawer slide */

  /* ---------- Layers ---------- */
  --z-sticky: 10; --z-chrome: 20; --z-dropdown: 30; --z-sheet: 40;
  --z-dialog: 50; --z-toast: 60;  --z-tooltip: 70;
}

@media (resolution >= 2dppx) { :root { --hairline: 0.5px; } }
@media (pointer: coarse)     { :root { --control-default: var(--control-touch); } }
@media (max-width: 767px)    { :root { --nav-height: 56px; --grid-gap: 16px; } }
@media (min-width: 768px)    { :root { --gutter: 24px; } }
@media (min-width: 1280px)   { :root { --gutter: 32px; } }

html {
  font-family: var(--font-sans);
  font-size: 100%;
  font-synthesis-weight: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  background: var(--bg);
  color: var(--text);
}
```

**Breakpoints:** 380 (small phone), 576, 768 (tablet), 1024 (sidebar appears), 1280, 1536. Prefer container queries for components and use these only for the page shell.

**Why these colors:** the neutrals follow ChatGPT's pure-neutral gray ramp. The light treatment (white canvas, near-white panels, thin borders, no shadows on content, pastel tags) follows the Attio and Airtable style from the SaaS checklist. The accent is a darkened Apple blue that passes AA as text and as a fill under white text; Apple's default `#0088ff` only reaches 3.5:1 on white.

### 4.2 Dark theme (opt-in only)

**Do not add this block unless the user explicitly asks for dark mode.** When they do, append it after §4.1 and set `data-theme="dark"` on `<html>`.

```css
:root[data-theme="dark"] {
  color-scheme: dark;

  --bg: #212121;
  --bg-secondary: #181818;
  --bg-grouped: #131313;
  --surface: #212121;
  --surface-elevated: #303030;
  --fill-soft: #303030;

  --text: #ffffff;
  --text-2: #afafaf;
  --text-3: #9b9b9b;
  --text-disabled: #6b6b6b;
  --text-inverse: #0d0d0d;

  --border-subtle: rgb(255 255 255 / 0.06);
  --border: rgb(255 255 255 / 0.12);
  --border-strong: rgb(255 255 255 / 0.20);
  --control-border: #8f8f8f;
  --hover: rgb(255 255 255 / 0.06);
  --pressed: rgb(255 255 255 / 0.12);
  --selected: rgb(255 255 255 / 0.10);

  --primary-fill: #f3f3f3;
  --primary-hover: #dcdcdc;
  --on-primary: #0d0d0d;
  --accent: #5cb8ff;
  --accent-fill: #1762e0;
  --on-accent: #ffffff;
  --accent-soft: #2a3945;
  --accent-line: #395d7a;

  --danger: #ff6764;   --danger-soft: #442626;   --danger-line: #7a3d3c;
  --success: #40c977;  --success-soft: #1c3928;  --success-line: #2d6443;
  --warning: #ff8549;  --warning-soft: #442d21;  --warning-line: #7a4931;

  --tag-gray-bg: #333333;   --tag-gray-text: #cdcdcd;
  --tag-blue-bg: #1b3349;   --tag-blue-text: #99ceff;
  --tag-green-bg: #1c3928;  --tag-green-text: #8cdfad;
  --tag-yellow-bg: #40381c; --tag-yellow-text: #ffdb66;
  --tag-orange-bg: #442d21; --tag-orange-text: #ffb790;
  --tag-red-bg: #442626;    --tag-red-text: #ffa4a2;
  --tag-purple-bg: #352948; --tag-purple-text: #ceb0fb;
  --tag-pink-bg: #452c37;   --tag-pink-text: #ffbada;

  --shadow-overlay: 0 0 0 1px rgb(255 255 255 / 0.10), 0 8px 24px -6px rgb(0 0 0 / 0.50);
  --shadow-raised: 0 0 0 1px rgb(255 255 255 / 0.10), 0 4px 12px -2px rgb(0 0 0 / 0.40);
  --backdrop-dim: rgb(0 0 0 / 0.50);
  --glass-tint: rgb(33 33 33 / 0.72);
  --glass-border: rgb(255 255 255 / 0.10);
}
```

If the user asks for dark mode that follows the operating system, wrap the same declarations in `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` as well. Set the theme before first paint to avoid a white flash.

---

## 5. Typography

| Token | Size / line | Weight | Apple equivalent | Use for |
|---|---|---|---|---|
| `display` | 48 / 52 | 600, tight | Extra-large title | Landing-page hero only. Never in app chrome. |
| `large-title` | 34 / 41 | 700, tight | Large Title | Top of a root screen on mobile; collapses into the top bar on scroll |
| `title-1` | 28 / 34 | 600, tight | Title 1 | Page title on desktop |
| `title-2` | 24 / 30 | 600 | Title 2 | Section titles, value-tracker numbers |
| `title-3` | 20 / 26 | 600 | Title 3 | Card titles, sheet and dialog titles |
| `lg` | 18 / 28 | 400 | n/a | Lead paragraph, hero subhead, empty-state text |
| `body` | 16 / 24 | 400 | Body | Reading text, chat messages, inputs |
| `body` + 600 | 16 / 24 | 600 | Headline | Row titles, emphasized labels |
| `sm` | 14 / 20 | 400 / 500 | Subhead / Callout | UI labels, buttons, menus, tables, sidebar items |
| `footnote` | 13 / 18 | 400 | Footnote | Helper text under fields, metadata |
| `caption` | 12 / 16 | 400 / 500 | Caption 1 | Badges, tags, timestamps, chart axes. The floor: nothing smaller. |

**Rules**

- Four weights only: 400, 500, 600, 700. Never 100–300.
- Every screen has one subject. Pick the single element that matters most and make it the largest or boldest; turn everything around it down with smaller size and `--text-2` / `--text-3`. Bold titles over muted secondary text is usually the whole system.
- Keep to about four type sizes on a screen. Inside cards and rows, use `body` and `sm` almost exclusively.
- Line length for reading: 60–75 characters, which is the 768px column at 16px.
- Long passages get the body leading. Constrained rows can tighten to 1.25, but never tighten text that runs three lines or more.
- Start-align body text. Center only short headings, hero copy, and empty states.
- Use `font-variant-numeric: tabular-nums` for numbers in columns or numbers that change in place.
- Apply `--tracking-tight` at 28px and above only.
- Use `--font-mono` only for code, IDs, keys, and file paths.
- Don't ship SF Pro, New York, or SF Symbols files on the web; Apple licenses them for Apple platforms. The `-apple-system` / `ui-sans-serif` entries already give Apple users the real system font.

**Text resizing:** size type in `rem` (1rem = 16px at default) so browser text-size settings work. At 200% zoom the layout must still work: let horizontal groups wrap or stack, let rows grow taller, drop columns, and avoid truncating primary content.

---

## 6. Color usage

The interface is grayscale. Color is reserved for things that are trying to show something.

**Where color is allowed**

1. **Data:** charts, status chips, tags, deltas in the value tracker.
2. **Interaction:** links, focus rings, selection, checked controls (`--accent`).
3. **Meaning:** errors, warnings, success (`--danger`, `--warning`, `--success`), always with an icon or word.
4. **Third-party logos** in their own colors (customer logos, integrations).

**Where color is not allowed:** page or section backgrounds, headings, decorative borders, non-interactive icons, card backgrounds, or buttons other than the primary and destructive ones. A dashboard full of colored buttons looks cheap; the same dashboard in grays with color only on charts and statuses looks expensive.

**Buttons in light theme:** the primary button is near-black (`--primary-fill`). Secondary buttons are white with a thin border. Actions you'd rather users didn't take (Discard, Skip) are quiet ghost buttons in `--text-2`. Example, an email composer: **Send** (primary), **Save Draft** (secondary), **Discard** (ghost).

**Status chips** (muted, thin border, Attio-style): `--*-soft` background, 1px `--*-line` border, `--*` text, `caption` 500, a leading 12–14px icon or an 8px dot. Example: a lead score of 82 shows as a green chip; everything around it stays gray.

**Tags** (user-defined categories): the eight muted pairs in §4. Assign colors by meaning or let users pick. Never use tag colors for buttons or statuses.

| Tag | Background | Text | Contrast |
|---|---|---|---|
| Gray | `#f4f4f4` | `#4f4f4f` | 7.5 |
| Blue | `#e5f3ff` | `#004f99` | 7.2 |
| Green | `#e6f7ec` | `#00692a` | 6.2 |
| Yellow | `#fff6d9` | `#6e5400` | 6.6 |
| Orange | `#ffefe5` | `#923b0f` | 6.6 |
| Red | `#ffecec` | `#911e1b` | 7.7 |
| Purple | `#f3ecfe` | `#6b3ab4` | 6.3 |
| Pink | `#ffeef6` | `#963c67` | 6.0 |

**Meaning stays fixed.** Once blue means "interactive", nothing non-interactive is blue. Red is destructive or error everywhere. Color meaning varies by culture (in some markets red signals a rising price); for financial data, let locale or the user decide.

**Verified contrast, light theme (WCAG 2.x, computed):**

| Pair | Ratio |
|---|---|
| `--text` on `--bg` / `--fill-soft` | 19.4 / 17.7 |
| `--text-2` on `--bg` / `--bg-secondary` / `--fill-soft` | 6.6 / 6.3 / 6.0 |
| `--text-3` on `--bg` / `--bg-secondary` / `--fill-soft` | 5.1 / 4.8 / 4.6 |
| `--accent` on `--bg` / `--accent-soft` | 5.4 / 4.8 |
| `--on-primary` on `--primary-fill` | 19.4 |
| `--on-accent` on `--accent-fill` | 5.4 |
| `--danger` / `--success` / `--warning` on `--bg` | 6.2 / 6.9 / 5.3 |
| `--danger` / `--success` / `--warning` on their `-soft` | 5.6 / 6.4 / 4.9 |
| white on `--danger-fill` / `--success-fill` / `--warning-fill` | 4.6 / 4.7 / 5.3 |
| `--control-border` on `--bg` (non-text, needs 3:1) | 3.5 |

`--text-disabled` is intentionally low contrast and only allowed on disabled controls. Text-field borders (`--border-strong`) are lighter than 3:1 by design; every field has a visible label, so the border is not the only cue. If a project needs strict WCAG 1.4.11 conformance, set field borders to `--control-border`.

---

## 7. Page intent and layout

### 7.1 One job per page

- Before building a page, write its job as one question: "Who is on my guest list?", "Which invoices are unpaid?", "How is the team doing this month?".
- Put on the page only what answers that question. A guest list is a list of guests: no growth chart, no "guests this year" card. If someone wants analytics, they go to the analytics page.
- Summary numbers and KPI cards live on the dashboard (and its value tracker, §10.19). Don't copy them onto the team, billing, or settings pages.
- Audit every page after building it: list each element and delete anything that doesn't serve the page's question.
- Add features when the user's intent expands (a browsing user needs filters; a searching user needs search), never because there's empty space.
- Ask "how little can this page get away with?" before "what else could go here?".

### 7.2 Spacing scale in practice

| Gap | Token | Where |
|---|---|---|
| 2–4px | `space-0-5`, `space-1` | Icon to its label inside a chip; badge padding |
| 6–8px | `space-1-5`, `space-2` | Icon and text in a button, buttons in a group, label and field |
| 12–16px | `space-3`, `space-4` | Card padding (16), row padding, between form fields |
| 20–24px | `space-5`, `space-6` | Dialog padding, between card groups, sheet padding |
| 32–48px | `space-8`–`space-12` | Between page sections |
| 64px+ | `space-16` | Landing-page sections only |

Group by proximity first: related things sit closer together than unrelated things. Add a border only when space alone doesn't separate the groups.

### 7.3 App shell

```
>=1024px                                   <1024px
+----------+------------------------+     +------------------------+
| sidebar  | top bar (52px, white,  |     | [menu]  title   [more] |
| 260px    | hairline bottom border)|     +------------------------+
| bg-      +------------------------+     |  content (16px gutter) |
| secondary|   content              |     |                        |
| + right  |   (768 reading column  |     |                        |
|  hairline|    or 1200 for tables) |     |                        |
+----------+------------------------+     +------------------------+
                                           sidebar becomes a drawer
```

- Sidebar: `--bg-secondary` with a 1px `--border` on its trailing edge. Visible at 1024px and up, collapsible from a top-bar button, and a slide-in drawer below 1024px. Never hidden by default on desktop.
- Top bar: solid `--bg`, sticky. Its bottom border appears once content scrolls under it (§8).
- Mobile apps that aren't chat-first use a bottom tab bar (§10.12) instead of the drawer.

### 7.4 Settings (Apple-style inset grouped)

- Page background `--bg-grouped`; rows on `--surface` in rounded blocks (`--radius-xl`, 1px `--border`) with 16px side inset.
- Section header above each block in `footnote`, `--text-2`; optional footer note below in `footnote`.
- Rows at least 44px tall, 16px horizontal padding, separators inset to align with the row text.

### 7.5 Forms: dialog, side panel, or page

| Form size | Container |
|---|---|
| Up to about 5 fields, one purpose ("Invite Member", "Rename Project") | Centered dialog, 400–480px wide, 24px padding |
| Editing many properties of one item while seeing the list behind it | Side panel (inspector), 360–480px |
| Several sections, or more than about 10 fields | Its own page with a back link |

Never open a full-height side panel for three fields. An empty panel looks broken.

### 7.6 Alignment, corners, targets, responsiveness

- Put the most important item at the top and on the leading side. Align everything to a small number of leading edges. Indentation means "belongs to the thing above".
- Use progressive disclosure (disclosure rows, "Show More", menus, secondary pages) instead of showing every option at once.
- **Concentric corners.** A rounded element nested in another uses `inner radius = outer radius − padding`. A 20px dialog with 12px padding holds 8px inner elements.
- **Targets.** Touch: 44×44px minimum, with at least 8px between adjacent targets. Pointer-only desktop UI can draw 28–32px controls but extends the hit area when they sit close together.
- **Responsiveness.** Lay out by available width, not device type. Keep the same features at every width; change arrangement, not capability. Test 320px and the widest layout first.
- **Safe areas.** Elements fixed to a screen edge pad themselves with `env(safe-area-inset-*)`, and the viewport meta includes `viewport-fit=cover`.

### 7.7 Containers, grids and bento layouts

**One container per page.** Every section on a page (nav, hero, grids, pricing, footer) sits in the same container: `max-width: var(--page-max); margin-inline: auto; padding-inline: var(--gutter)`. The logo, section headings and the left edge of every grid line up on one vertical line. Narrower content (hero text, FAQ) is centered inside that container, never in a container of its own width.

**Grids must fill every row.** A row of cards or tiles never ends with a gap, and a tile is never left alone on a row at partial width. Never use `flex-wrap` or `repeat(auto-fill, …)` for feature cards or bento grids; the browser will strand the last tile. Use an explicit grid and pick a layout from the table for the exact number of tiles.

**Equal card grids** (lists of similar cards: projects, integrations, templates): `repeat(3, minmax(0, 1fr))` at 1024px and up, 2 columns from 768px, 1 column below. If the count doesn't fill the last row, either the last row is allowed to be partial *because more items load* (a real list), or you change the number of items. Marketing sections always use counts that fill the rows (3, 6, 9 for thirds; 2, 4 for halves).

**Bento layouts** run on a 6-column grid at 1024px and up. Spans in each row must add up to 6.

| Tiles | Layout at 1024px+ (column spans per row) | When |
|---|---|---|
| 2 | 3 + 3 | Two equal features |
| 3 | 2 + 2 + 2 | Three equal features (default) |
| 3 | 4 (spanning 2 rows) beside 2 stacked over 2 | One lead feature and two supporting ones |
| 4 | 4 + 2, then 2 + 4 | Default for four |
| 5 | 4 + 2, then 2 + 2 + 2 | Lead feature first |
| 6 | 2 + 2 + 2, then 2 + 2 + 2 | Six equal features |

More than 6 tiles: split into two sections, or cut features. A bento grid with 7 tiles is a sign the page is doing too much (§7.1).

Between 768px and 1023px the grid has 2 equal columns; with an odd number of tiles, the last tile spans both columns. Below 768px every tile is full width.

```css
.bento { display: grid; gap: var(--grid-gap); grid-template-columns: minmax(0, 1fr); }

@media (min-width: 768px) and (max-width: 1023px) {
  .bento { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .bento > :last-child:nth-child(odd) { grid-column: 1 / -1; }
}

@media (min-width: 1024px) {
  .bento { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .bento > * { grid-column: span 2; }                                  /* 3 and 6 tiles */
  .bento[data-count="2"] > * { grid-column: span 3; }
  .bento[data-count="3"][data-layout="lead"] > :first-child { grid-column: span 4; grid-row: span 2; }
  .bento[data-count="4"] > :nth-child(1),
  .bento[data-count="4"] > :nth-child(4) { grid-column: span 4; }
  .bento[data-count="5"] > :first-child { grid-column: span 4; }
}
```

Set `data-count` to the actual number of tiles. Tiles in the same row stretch to equal height (the grid default; don't set `align-items`). Inside each tile, use the same structure as every other tile (§10.10). Give the media area a fixed height (or `aspect-ratio`) that is the same for every tile in a row, and let the text block below take the leftover space (`flex: 1`), so titles start on the same line across the row. Only the lead tile in the 3-tile lead layout lets its media grow (`flex: 1`) to fill the two-row height; its text block stays `flex: none`, so no empty space opens up under the description.

---

## 8. Surfaces and elevation

The light theme is flat. Borders separate; shadows are rare.

| Layer | Examples | Treatment |
|---|---|---|
| Canvas | page background | `--bg`, or `--bg-grouped` behind settings |
| Content | cards, rows, tables, messages, images | `--surface` + 1px `--border`. No shadow. Never translucent. |
| Chrome | top bar, sidebar, tab bar, composer | Solid `--bg` / `--bg-secondary` with a 1px `--border` edge |
| Overlays | menus, popovers, dialogs, sheets, toasts | `--surface-elevated` + `--shadow-overlay`; dialogs and sheets add `--backdrop-dim` |

**Rules**
- Shadows appear only on overlays, the onboarding "Start here" card, and an item while it is being dragged (`--shadow-raised`). Cards, buttons, inputs, and the composer have none.
- Sticky bars show their bottom border only once content scrolls beneath them. Use a 1px sentinel element and an `IntersectionObserver` to toggle a `data-scrolled` attribute; don't listen to every scroll event.
- Translucent material ("glass") is only for controls that float over photos, video, or maps (an image viewer toolbar, map zoom buttons):

```css
.glass {
  background: var(--glass-tint);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  box-shadow: 0 0 0 var(--hairline) var(--glass-border);
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass { background: var(--bg); }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--bg); backdrop-filter: none; -webkit-backdrop-filter: none; }
}
```

---

## 9. Motion

**The test:** does this motion tell the user something (where a thing came from, where it went, what changed, that work is happening, that a job finished)? If not, don't add it.

**Allowed**

| What | Duration | Easing | Notes |
|---|---|---|---|
| Press, hover, focus | `--dur-instant`–`--dur-fast` | `--ease-standard` | Color and opacity only. No scaling, no lifting cards on hover. |
| Menu, popover, tooltip open | `--dur-base` | `--ease-out` | Fade + 4px translate from the trigger side |
| Same, close | ~75% of open | `--ease-in` | |
| Dialog open and close | `--dur-slow` | `--ease-out` / `--ease-in` | Fade, scaling from `0.98` to `1` |
| Sheet, drawer | `--dur-slow` | `--ease-sheet` | Slides from the edge it lives on and leaves the same way |
| Expand / collapse | `--dur-base` | `--ease-standard` | Height via `grid-template-rows` from `0fr` to `1fr` |
| Skeleton shimmer, spinners, progress bars | continuous | linear | Only while loading |
| Completion check | `--dur-base` | `--ease-out` | Icon swap, see §10.14 |
| Milestone celebration | ≤1.5s, once | n/a | Rare; see §10.14 |

**Not allowed:** fade-in or fly-in of page content on load, staggered list reveals, scroll-triggered animation, parallax, scroll-jacking, animated or shifting backgrounds, hover zoom, bouncing icons, looping decorative animation, number count-up effects.

Never make anyone wait for an animation: inputs stay live and every animation can be interrupted. Animate only `transform` and `opacity`. Landing pages have one extra allowance for showing the product in motion (§15).

**Reduced motion**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

Under reduced motion also replace slides with a plain fade, stop shimmer (show static skeleton blocks), and replace celebrations with a static success state.

---

## 10. Components

All interactive components need: default, hover (fine pointer only), pressed, focus-visible, disabled, and, where an action can take time, loading and done states. Icon names refer to the library chosen in §12.

### 10.1 Buttons

| Variant | Look | Use |
|---|---|---|
| Primary | `--primary-fill`, `--on-primary` text; hover `--primary-hover` | The one main action in a view |
| Secondary | `--surface`, 1px `--border-strong`, `--text`; hover `--hover` | Other useful actions next to the primary |
| Ghost | transparent, `--text-2`; hover `--hover` and `--text` | Toolbar actions, Cancel, actions you'd rather users skip (Discard) |
| Destructive | `--danger-fill`, white text | Confirming a delete inside a confirmation dialog |
| Destructive ghost | transparent, `--danger` text | Delete items inside menus and settings rows |
| Accent | `--accent-fill`, `--on-accent` | Landing-page CTA for brands with a color. Replaces Primary, never sits beside it. |

- **One shape.** Every button, icon button, chip, and segmented control uses `--radius-button` (pill). Don't make some buttons square.
- Heights: 28 / 32 / 36 / 40 / 44. Default 32 on desktop, 44 on touch. Horizontal padding: 12px at 32px, 16px at 36–44px.
- Label: `sm` (14px) weight 500; 16px at the 44px size. Icon 16–20px with a 6px gap, leading the label.
- No shadows on buttons.
- Order in a row: ghost, then secondary, then primary at the trailing end. In a vertical stack: primary on top.
- Never make a destructive action the default (the one Enter triggers).
- **Loading:** keep the button's width, replace the leading icon with a 16px spinner icon, change the label to the present participle ("Saving…"), block repeat presses.
- **Done:** swap the spinner for a check icon and the label to the past tense ("Saved") for about 1.5 seconds, then return to normal (§10.14).
- Disabled: `--text-disabled` label, 50% fill opacity, no hover. Prefer an inline explanation of what's missing over a silent disabled state.
- Append "…" to the label when the button opens something that needs more input before the action completes ("Export…").

### 10.2 Icon buttons

- Circles at the button heights; icon 20px at 32–36px, 24px at 44px. Ghost variant by default.
- Always have an accessible name (`aria-label`) and, on pointer devices, a tooltip after ~500ms.
- Icon-only buttons only for universally known actions: close, more, search, share, copy, send, back. Everything else gets a text label.

### 10.3 Text fields and text areas

- Height 36–40px desktop, 44px touch. Radius `--radius-field`. Search fields may use `--radius-full`.
- `--surface` fill with 1px `--border-strong`; hover darker border; focus 2px `--focus-ring`; invalid `--danger` border plus message.
- Label above the field (`sm`, 500). The placeholder only shows format or an example ("name@example.com") and never replaces the label.
- Helper text below in `footnote`, `--text-2`. An error replaces it in `--danger`, with an error icon, phrased as an instruction.
- Validate format on blur, completeness on submit. Don't show errors while the user is typing for the first time.
- Size the field to its expected content. Use the right `type`, `inputmode`, and `autocomplete`. Never prefill passwords.
- A clear button (x icon) appears at the trailing edge once a single-line field has content.
- Text areas grow with content up to a max height, then scroll.
- Prefer pickers, menus, segmented controls, and sensible defaults over typing.
- Primary submit stays disabled until required fields are valid, and required fields are marked before the user tries.

### 10.4 Selection controls

| Need | Control |
|---|---|
| A single setting that takes effect immediately | Switch (in a list row) |
| Options in a form that apply on submit, or nested options | Checkbox (with an indeterminate state for parents) |
| 2–5 mutually exclusive options | Radio group, or a segmented control for short view/filter choices |
| 6+ mutually exclusive options | Select menu |
| Switching between closely related views | Segmented control |
| Switching between app sections | Tabs or tab bar |

- Switch: 51×31px track on touch, about 36×20 on dense desktop. Off track `--fill-soft` with a `--control-border` outline; on track `--accent`. The row label describes the on-state ("Save chat history").
- Checkbox and radio: 18–20px, outline `--control-border`, filled `--accent` with a white check icon when on; dash for indeterminate. Label on the trailing side; the whole row is clickable.
- Segmented control: `--fill-soft` track, selected segment `--surface` with 1px `--border` (no shadow), `--radius-button` shape. Equal-width segments, about 5 on phones, up to 7 on wide layouts. Text or icons, never mixed. Noun labels.
- State is never shown by color alone: a check, a knob position, a filled dot, or a label change must change too.

### 10.5 Menus and popovers

- `--surface-elevated`, radius `--radius-lg`, padding 6px, `--shadow-overlay`. Min width 180px, max about 320px.
- Items: 32px tall on desktop (44 on touch), padding 6px 8px, radius `--radius-md`, `sm` text, highlight `--hover`. Optional 16px leading icon.
- Icons are all-or-nothing within a group, and only when the icon clearly means the action.
- Most-used items first. Separate groups with a 1px `--border` line. Destructive items go last, in `--danger`, in their own group.
- Keyboard shortcuts trailing in `--text-3`.
- Submenus: one level deep at most, about five items.
- Unavailable items are dimmed, not removed.
- Close on Esc, outside click, or selection; return focus to the trigger. One menu or popover open at a time.
- Popovers hold small related functionality, point at their source, save work when closed by an outside click, and become bottom sheets on narrow screens. Never put warnings in a popover.

### 10.6 Dialogs and alerts

Use an alert only for something critical that needs a decision now. Not for routine confirmation, success messages, tips, or anything on app launch.

- Width 320–480px, radius `--radius-2xl`, padding 24px, `--surface-elevated`, `--shadow-overlay`, backdrop `--backdrop-dim`.
- Title: `title-3`, says what happened or what will happen, two lines max. Never just "Error".
- Message: optional, one or two short sentences in `sm`, `--text-2`. Don't restate the buttons.
- Three buttons at most. Labels are specific verbs from §13.2. "OK" only for a purely informational alert. Never "Yes" / "No".
- The cancel action is labeled exactly "Cancel", sits on the leading side (or at the bottom when stacked), and is never the default.
- Focus the least destructive button on open. Enter triggers the default; Esc triggers Cancel. Trap focus inside and restore it on close.
- Never show two dialogs at once.

### 10.7 Destructive actions: three tiers

Match the friction to the damage. Too little friction and users lose work or doubt the action happened; too much and every routine task becomes a chore.

| Tier | When | What happens |
|---|---|---|
| **1. Undo** | Reversible or low-cost: delete a draft, a comment, a row, a file that goes to trash; remove a tag or a member | Act immediately. The item disappears with a short collapse. A toast says what happened ("Comment deleted") with an **Undo** button, visible at least 5 seconds and paused on hover or focus. |
| **2. Confirm** | Permanent, expensive, or affects other people: delete a project and its tasks, cancel a subscription, send to a large list, charge a card | A dialog names the object and the consequence, then a destructive button that repeats the verb and object. After it completes, a toast confirms it. |
| **3. Type to confirm** | Critical and irreversible: delete a workspace, database, account, or production data; bulk deletes | Same dialog plus a text field. The destructive button stays disabled until the user types the object's name (or the word "delete" when there's no name) exactly. |

Tier 2 example:

> **Delete “Q3 Launch Plan”?**
> This deletes the project and its 24 tasks. You can't undo this.
> [Cancel] [Delete Project]

Then: toast "Project deleted".

Tier 3 example: the same dialog with a field labeled "Type Q3 Launch Plan to confirm".

Rules: never a destructive default button; name the thing being deleted; state what else goes with it; never confirm Tier 1 actions with a dialog; never skip the confirmation on Tier 2 or 3, even for power users.

### 10.8 Sheets, drawers and full-screen views

- Bottom sheet (mobile): `--radius-3xl` top corners, 36×5px grabber 8px from the top, `--surface-elevated`, backdrop dim. A medium (about 50%) and large detent when the content can grow. Drag down or tap the backdrop to dismiss.
- Side sheet (desktop inspector): 360–480px, full height, slides from its edge, 1px `--border` on its inner edge plus `--shadow-overlay`.
- Header: title, Cancel on the leading side, Done (primary) on the trailing side. Never Done without a way out.
- Multi-step sheets: Back replaces Cancel after the first step; Done enables on the final step.
- If dismissing would lose input, confirm first ("Discard Changes" / "Keep Editing").
- One sheet at a time. Full-screen views (editors, maps, media) keep an obvious close button top-leading.

### 10.9 Lists, rows and tables

**Rows**
- Min height 44px (touch) / 36px (desktop), 16px horizontal padding.
- Anatomy, leading to trailing: icon or avatar (24–40px), then the title (`body` 600, or `sm` 500 in dense UI) with one line of secondary text (`footnote`, `--text-2`) beneath it, then the one number or status that matters, then a "more" icon button.
- **Compact by default.** A row or card shows only what the user scans for. Collapse secondary actions into a single "more" (ellipsis) menu instead of a row of buttons. Replace text chips like "Company: Lumio AI" or "Date: Sep 30" with a 16px icon (building, calendar) beside the value. Push the number that matters (amount, score, count) to the trailing edge, right-aligned, tabular.
- Status in rows: a word ("In progress") in `--text-2`, plus color only for what needs attention (an 8px red dot or a red "High" chip for priority). Don't color every attribute.
- A chevron-right icon means "opens a deeper screen". An info icon means "shows details without navigating".
- Navigation lists keep the current row highlighted (`--selected`). Choice lists show a check icon on the chosen row.
- Swipe actions on touch are shortcuts only: the same actions exist in the "more" menu.

**Tables**
- Column headings: nouns, Title Case, `sm` 500, `--text-2`. Sortable by clicking (click again to reverse), with a sort icon on the active column.
- 1px `--border` row separators, no zebra striping, no vertical lines. Numbers right-aligned with tabular figures.
- Hover row `--hover`; selected row `--accent-soft`.
- Long tables use numbered pagination with a page-size option. Lists and feeds use a **Load More** button (§10.15). Never infinite scroll.

### 10.10 Cards and carousels

Cards hold one self-contained thing.

- `--surface`, 1px `--border`, radius `--radius-xl`. No shadow at rest or on hover. A clickable card shows `--border-strong` and `--hover` on hover.
- Order inside, top to bottom: media (fixed aspect ratio, `object-fit: cover`), title, one or two lines of metadata (`sm`, `--text-2`, icons instead of label words), the key number or status, actions.

**Padding**
- Equal on all four sides. One value per card, from the scale: `--card-pad-sm` (16px) for compact cards under about 280px wide, `--card-pad` (24px) by default, `--card-pad-lg` (32px) for pricing cards and tiles wider than about 560px on screens 1280px and up.
- Every card in the same grid uses the same padding, even if one tile is bigger.
- Internal rhythm: media to title 20px, title to description 8px, description to actions or footer 16px. Use `gap` on a flex column rather than margins on individual elements.
- Title `title-3` 600 (`body` 600 in compact cards). Description `sm` or `body` at weight 400 (never 500 or 600), `--text-2`, at most 3 lines, `max-width: 60ch`.
- Make the card a flex column. Media gets a fixed height or aspect ratio, never `flex: 1` (except the lead bento tile), so titles line up across a row. Push the actions or footer to the bottom with `margin-top: auto` so they line up too.

**Media inside a card: pick one of two treatments**
1. **Full-bleed (preferred for bento tiles and feature cards).** The media touches the card's top, left and right edges with no padding, no border and no radius of its own; the card's `overflow: hidden` rounds its top corners. A 1px `--border` separates media from the text below. Padding applies only to the text block. Product screenshots inside a full-bleed area sit on a `--bg-secondary` backdrop, offset 24px from the top and leading edge, and may run off the trailing and bottom edges (cropped by the card).
2. **Inset.** The media sits inside the card padding with radius `card radius − padding` (16px card with 16px padding: inner radius 4px; 20px card with 12px padding: 8px). Use only for small thumbnails and avatars.

Never put a bordered, rounded box inside a bordered, rounded box with the same or similar radius and a gray fill (the "box in a box" look). Never let an inner radius be equal to or larger than the outer one.
- At most two visible actions (one primary or secondary, one ghost). Everything else goes in a "more" menu.
- No internal scrolling, no tabs, no multi-level navigation inside a card. If it needs those, it opens a full view.
- Lists inside a card show the first few items and a "Show More" control.
- Carousels: 3–8 items, each with an image, title, up to two lines of metadata, an optional badge, and at most one action, all in identical structure. Show part of the next item at the edge; provide arrow buttons on pointer devices.

### 10.11 Status, tags and badges

- **Status chip:** height 22px, padding 0 8px, `--radius-button`, `caption` 500, `--*-soft` background, 1px `--*-line` border, `--*` text, leading 12px icon or 8px dot.
- **Status dot:** an 8px CSS circle (`border-radius: 50%`, background `--*-fill`) beside a word. Never a bullet or circle character.
- **Tags:** height 22px, padding 0 8px, `--radius-button`, `caption` 500, tag palette (§6). Truncate after about 15 characters with the full name in a tooltip.
- **Count badges:** 18–20px tall, `--danger-fill` with white `caption` 600 for things needing attention; `--fill-soft` with `--text-2` for neutral counts.
- Use as few chips per row as possible. Two is plenty; more than three means the row needs redesigning.

### 10.12 Navigation

**Sidebar**
- `--bg-secondary`, 260px, items 36px tall (`sm`, padding 0 8px, `--radius-md`), hover `--hover`, current item `--selected` and weight 500.
- Two levels at most; collapse groups with disclosure. Group headings in `footnote` 500, `--text-3`.
- Item icons optional, 16–20px, `--text-2`. Account and settings may sit in the sidebar footer.

**Marketing nav (landing pages and public site)**
- Height `--nav-height` (64px, 56px below 768px), solid `--bg`, sticky, 1px `--border` bottom edge once the page scrolls.
- Inner content uses the page container (§7.7), so the logo lines up with the hero and every section below.
- Logo: 24px mark plus wordmark in `lg` (18px) 600. Links: `body` (16px) 500, `--text-2`, hover `--text`, 32px apart, centered or right after the logo. CTAs: 40px tall buttons, `sm` 500 label, 16–20px horizontal padding; "Sign In" as a ghost button, the primary CTA as the primary button.
- Below 768px: logo, the primary CTA, and a menu icon button that opens the links in a full-width sheet.
- Never shrink the nav below these sizes to "look minimal". Small text and 32px buttons in a 37px bar read as unfinished.

**App top bar / toolbar**
- 52px, solid `--bg`, sticky. Leading: back or sidebar toggle, then the title. Trailing: search, a "more" menu, and at most one primary action.
- Titles are short (about 15 characters), describe the current place, and are never just the app name.
- Up to three groups of controls. Text buttons sit in their own group apart from icon buttons.

**Tab bar (mobile apps that aren't chat-first)**
- Bottom, solid `--bg` with a 1px `--border` top edge, 3–5 tabs, each a 24px icon above a single-word label (`caption` 500). Selected tab: `--text` and the filled icon variant (Phosphor) or the accent color (Lucide).
- Tabs navigate; they never perform actions. Always visible, never disabled.
- At 1024px and up, the same destinations move into the sidebar.

**In-page tabs**
- Text tabs with a 2px `--text` underline indicator, or a segmented control. Noun labels. Keep the current tab in the URL.

### 10.13 Search

- If search matters, give it one prominent home (a field in the top bar or a dedicated tab) and keep it there everywhere.
- Field: pill, 36–44px, leading search icon, placeholder names the scope ("Search contacts"), clear button once there's text, a `⌘K` / `Ctrl K` hint rendered as text in a `<kbd>` element on desktop.
- Before typing: recent searches with a way to clear them. While typing: live suggestions, highlighted matches, arrow-key navigation.
- No results: say so, repeat the query, and offer a next step (check spelling, broaden filters).

### 10.14 Feedback and completion states

People need proof that an action worked. An action that finishes without a visible result nags at them until they refresh to check.

- **Match the interruption to the importance.** Status: passive, inline, next to the thing it describes. Errors blocking a task: inline at the problem. Critical decisions only: a dialog.
- **Every action has a done state:**
  - Buttons: spinner while working, then a check icon and past-tense label ("Saved", "Sent") for about 1.5 seconds.
  - Rows and cards: the change appears in place (new row appears at the top, edited value updates).
  - Invisible or remote results (email sent, file exported, invite delivered): a toast.
- **Toast:** bottom center on desktop (top on mobile if the bottom is busy), `--surface-elevated`, `--radius-lg`, `--shadow-overlay`, `sm` text, a leading status icon, at most one action ("Undo", "View"). Visible at least 5 seconds, paused on hover or focus, dismissable, announced with `aria-live="polite"`. Never the only place an error appears.
- **Banner / callout:** full width of its container, `-soft` background, 1px `-line` border, matching icon, `sm` text, optional action and close button.
- **Milestone celebrations:** reserved for real firsts and goals: first project created, onboarding finished, first account connected, a usage milestone. A short confetti burst (≤1.5s, once, small particle count, using `canvas-confetti` or similar) or a success illustration with a one-line message ("First account connected. Connect the next one."). Never for routine actions. Under reduced motion, show the static message only.

### 10.15 Loading

- Under about 300ms: show nothing extra. Longer: show the layout immediately with skeleton placeholders where content will land, then swap in real content as it arrives.
- Skeletons: `--fill-soft` blocks that match the real content's size and radius, with a slow shimmer (stopped under reduced motion). Skeleton buttons and skeleton text lines too, wherever data is fetched.
- An action that takes time shows progress inside the control that started it.
- Over one second: show a progress indicator. Known duration: determinate bar or ring, advancing evenly. Unknown: spinner (the `loader-circle` / `circle-notch` icon, rotating). Switch to determinate once progress becomes measurable. Never swap a spinner for a bar mid-task.
- Long jobs (over about 10 seconds): show the current step in words ("Enriching 240 of 1,000 contacts"), keep the rest of the app usable, and offer Cancel.
- Stalled work is explained ("Still uploading. Your connection is slow.").
- **Load More:** lists and feeds load the first page (20–50 items) and end with a secondary **Load More** button and a count ("Showing 40 of 312"). This keeps users in control and the footer reachable. The only exception is chat history, which loads older messages when the user scrolls to the top, with a visible loading row.
- Pull-to-refresh on mobile lists, plus automatic refresh so users don't have to.

### 10.16 Empty states

- Center a short heading (`title-3`), one sentence of explanation (`sm`, `--text-2`), and the one action that fills the space ("New Project", "Import Contacts"). Optional 32–48px icon in a `--fill-soft` circle, `--text-3`.
- Explain why it's empty when it isn't first use ("No results for “tanker”", "No starred chats yet").
- Never a blank area or a raw "No data". Never an emoji or a cartoon.

### 10.17 Tooltips

- `--primary-fill` background, `--on-primary` text, `caption`, padding 4px 8px, `--radius-md`. Appear after ~500ms hover or on keyboard focus; vanish immediately on leave.
- Tooltips add a name, a shortcut, or the full text of something truncated. They never hold information that isn't available elsewhere, and they don't exist on touch.

### 10.18 Avatars, icon circles and chips

- Avatars: circle, 24 / 32 / 40px, initials fallback on `--fill-soft` with `--text-2`.
- **Icon circles:** an entity icon (company, file type, integration) sits centered in a 32px `--fill-soft` circle (16px icon, `--text-2`). The solid circle keeps it legible on any background and aligns it with avatars.
- Chips (filters, suggestions, attachments): 32px tall (36–40 touch), `--radius-button`, 1px `--border` on `--surface` or a `--fill-soft` fill, `sm` text, optional leading icon and trailing x icon to remove.

### 10.19 Dashboards and the value tracker

The dashboard answers "what has this product done for me, and what needs my attention?" It is the only page with summary numbers.

- **Value tracker** at the top: a row of 3–4 outcome stats for the current period, titled plainly ("This month").
  - Outcomes, not activity: hours saved, tasks automated, leads found, revenue influenced. Avoid vanity counts like "logins".
  - Each stat: the number in `title-2` 600 tabular, a short label in `sm` `--text-2` ("hours saved"), and an optional change versus the previous period in `footnote` with an arrow-up-right or arrow-down-right icon, `--success` or `--danger`.
  - Plain container: one card with thin dividers between stats, or no container at all. No colored tiles, no icons in colored circles, no sparkline unless the trend is the point.
  - Numbers must come from real usage. For brand-new accounts with no data, show the onboarding checklist (§10.20) in its place.
  - Crossing a meaningful threshold (first 10 hours saved, 100th task) can trigger a milestone celebration (§10.14).
- Below it: what needs attention (overdue items, failed jobs), then recent activity. Charts follow the color rules in §6.

### 10.20 Onboarding

The first minutes after sign-up decide whether people stay. Teach by letting them do the first real thing, not by lecturing.

- **No forced tours.** No modal carousels on first login, no chains of tooltips pointing at the interface.
- **"Start here" checklist** on the home page or dashboard: 3–5 steps, each one action that produces real value ("Connect your first account", "Import contacts").
  - It is the one element on the page allowed to stand out: `--shadow-raised`, a 1px `--accent-line` border, and a "Start here" label in `caption` 600 `--accent`.
  - A progress bar and count ("2 of 4 done").
  - Done steps show a check-circle icon and `--text-3` text; open steps show a circle icon. Only the current step has a primary button; later steps stay quiet until reached.
  - Finishing the list triggers a milestone celebration, then the card collapses to "Setup complete" and disappears on the next visit.
  - Dismissable from its "more" menu ("Hide Checklist") and reachable again from Help.
- **Contextual tips** appear next to a feature the first time it's used, once, and are dismissable.
- Defer account setup, profile details, and permission requests until the moment they're needed. Use sensible defaults.
- If the product shows sample data for new users, label it clearly ("Sample data") and make it removable in one click.

---

## 11. Chat and AI patterns (ChatGPT surfaces)

### 11.1 Thread

- Centered column, max `--content-max` (768px), 16px gutter on mobile.
- User messages: right-aligned bubble, `--fill-soft`, radius `--radius-xl`, padding 10px 16px, max 70% of the column width.
- Assistant messages: no bubble. Plain text on the canvas, full column width, `body` 16/24 (long prose can use 16/28).
- 24–32px between turns.
- Message actions (copy, regenerate, thumbs-up, thumbs-down, share, more) sit under the assistant message as 32px ghost icon buttons with tooltips: always visible on touch and on the latest message; revealed on hover and keyboard focus otherwise.
- A round "scroll to bottom" button (36px, `--surface-elevated`, 1px `--border`, arrow-down icon) appears above the composer when the user has scrolled up.

### 11.2 Markdown inside messages

- Headings inside answers stay small: `title-3` for h1/h2, `body` 600 for h3 and below.
- Paragraph spacing 12–16px. Lists: 4–8px between items, hanging indent, CSS bullets.
- Inline code: `--font-mono` at 0.875em, `--fill-soft`, `--radius-xs`, padding 2px 4px.
- Code blocks: `--radius-lg`, `--bg-secondary` with 1px `--border`, a header row with the language name (`caption`, `--text-2`) and a Copy button that switches to a check icon and "Copied" for 1.5 seconds. Horizontal scroll inside the block; never overflow the column.
- Tables: full column width, horizontal scroll if wide, `sm` text, header row 500, 1px row separators.
- Links: `--accent`, underline on hover. Citations: small numbered pills (`caption`, `--fill-soft`) that open a popover with the source title and domain.

### 11.3 Composer

```
+------------------------------------------------------------+
| [chip: report.pdf  x]                                      |  attachments (optional)
| Ask anything                                               |  text area, auto-grows
| [plus icon]  [Tools]                          [send icon]  |  leading actions, send
+------------------------------------------------------------+
```

- Container: `--surface`, 1px `--border-strong`, radius `--radius-3xl`, padding 8–12px, no shadow. Pinned to the bottom of the thread with `env(safe-area-inset-bottom)` padding.
- Text area: `body` 16px, placeholder in `--text-3`, grows to about 40% of viewport height, then scrolls.
- Send button: 32–36px circle, `--primary-fill` with an arrow-up icon; disabled (`--fill-soft`, `--text-disabled`) while empty. While a response streams it becomes a Stop button (square icon) in the same spot.
- Enter sends, Shift+Enter inserts a newline. On touch keyboards, Enter inserts a newline and the button sends. Esc stops streaming.
- The plus button opens attachments and tools in a menu. Attached files appear as removable chips.
- One composer only. Embedded views and fullscreen modes reuse it.

### 11.4 Streaming, thinking and errors

- Waiting for the first token: a short shimmering label ("Thinking", "Searching the web") in `sm`, `--text-2`. No full-screen spinner.
- Keep the viewport pinned to the bottom only if the user was already there.
- Long reasoning or tool steps collapse into one disclosure row ("Thought for 12s") with a chevron icon.
- Errors appear inline where the answer would have been: `--danger` icon, one-line reason, and a "Retry" button. Keep the user's message.

### 11.5 Empty chat

- Vertically centered: one greeting line (`title-2`), the composer, and 2–4 suggestion chips below. No feature tour.

### 11.6 Embedded app UI inside a chat

Use embedded UI only when seeing or touching something beats reading text.

| Mode | Use when | Rules |
|---|---|---|
| **Inline card** | One decision, a small structured result, or a self-contained mini tool | §10.10 rules: ≤2 actions at the bottom, no internal scroll, no tabs or drill-ins, edits persist, height fits content up to the viewport. "Expand" opens fullscreen for rich media. |
| **Inline carousel** | Choosing among 3–8 similar visual items | Image + title + ≤2 lines metadata + optional badge + ≤1 action each, identical structure |
| **Fullscreen** | Rich work that won't fit a card (map, editor, detailed browsing) | Close button top-leading; the chat composer stays available and the view responds to typed requests |
| **Picture-in-picture** | Something running alongside the chat (game, video, live quiz) | Pins to the top while the thread scrolls, updates when the user types, closes itself when the session ends |

- The host draws the app's name and logo above the widget; the widget doesn't repeat its logo.
- Text the model writes after a widget suggests next steps; it doesn't restate the card.
- Brand color only on accents (primary button, badges, small icons). No custom fonts, even in fullscreen. No rebuilt chat features inside a widget.

---

## 12. Icons

### 12.1 One library, never emoji

- Use **Lucide** by default. Use **Phosphor** if the project already uses it or the user asks for it. Pick one per project and use it for every icon.
- **Never use emoji** as icons, bullets, status markers, decoration, or illustrations, and never in UI text (§3). If you're about to type an emoji, use the matching icon from the table below, or no icon at all.
- **Never use Unicode symbols as icons:** no check marks, crosses, stars, arrows, warning signs, bullets, middle dots as separators in place of spacing, or hamburger and chevron characters. Use the icon component.
- Don't mix in Heroicons, Font Awesome, Material Icons, Feather, or hand-drawn SVG for a concept the chosen library already has.
- Third-party logos (customers, integrations, payment methods) are images, not icons: use the brand's official SVG in its own colors, sized to match adjacent icons. Phosphor includes some brand marks (`github-logo`, `slack-logo`) in its own style.

### 12.2 Install and use

**Lucide (default)**

```bash
npm i lucide-react
```

```jsx
import { Trash2, Ellipsis } from "lucide-react";

<Trash2 size={20} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
```

Plain HTML: inline the SVG from `lucide-static`, or load the `lucide` package and call `lucide.createIcons()` on `<i data-lucide="trash-2"></i>`.

**Phosphor (alternative)**

```bash
npm i @phosphor-icons/react
```

```jsx
import { TrashIcon, DotsThreeIcon } from "@phosphor-icons/react";

<TrashIcon size={20} weight="regular" aria-hidden="true" />
```

Use the `…Icon` export names; the plain names (`Trash`) are deprecated in `@phosphor-icons/react` 2.1. Plain HTML: `@phosphor-icons/web` with `<i class="ph ph-trash"></i>` (regular) or `<i class="ph-fill ph-trash"></i>` (fill).

### 12.3 Style

- **Sizes:** 16 (inline with `sm` text, chips, menu items), 20 (default UI), 24 (tab bar, prominent actions). Nothing else.
- **Stroke:** Lucide at `strokeWidth={1.5}` with `absoluteStrokeWidth` so stroke stays 1.5px at every size. Phosphor at `weight="regular"`. Never mix weights in one view.
- **Color:** `currentColor`, inheriting `--text-2` by default, `--text` when active, `--accent` for links and selection, status tokens for status. Never multicolor.
- **Selected state:** Phosphor uses `weight="fill"`. Lucide has no fill variants, so show selection with `--accent` color plus a `--selected` or `--accent-soft` background on the control.
- **Spinner:** Lucide `loader-circle` or Phosphor `circle-notch`, rotating with a CSS animation (stopped under reduced motion in favor of a static icon and a text label).
- With text: icon leads, 6px gap, vertically centered on the text. Icon-only buttons need `aria-label`; icons beside text are `aria-hidden="true"`.
- Flip directional icons (arrows, chevrons, reply) in RTL layouts.
- No text inside icons.

### 12.4 Concept map

Use these names so the same concept always gets the same icon.

| Concept | Lucide (name / React) | Phosphor (name / React) |
|---|---|---|
| Close, dismiss, remove chip | `x` / `X` | `x` / `XIcon` |
| Done, selected, success inline | `check` / `Check` | `check` / `CheckIcon` |
| Success status | `circle-check` / `CircleCheck` | `check-circle` / `CheckCircleIcon` |
| Onboarding step not done | `circle` / `Circle` | `circle` / `CircleIcon` |
| Add, new | `plus` / `Plus` | `plus` / `PlusIcon` |
| Delete | `trash-2` / `Trash2` | `trash` / `TrashIcon` |
| Edit | `pencil` / `Pencil` | `pencil-simple` / `PencilSimpleIcon` |
| Search | `search` / `Search` | `magnifying-glass` / `MagnifyingGlassIcon` |
| Filter | `list-filter` / `ListFilter` | `funnel` / `FunnelIcon` |
| Sort | `arrow-up-down` / `ArrowUpDown` | `arrows-down-up` / `ArrowsDownUpIcon` |
| Settings | `settings` / `Settings` | `gear-six` / `GearSixIcon` |
| More (row, card, toolbar) | `ellipsis` / `Ellipsis` | `dots-three` / `DotsThreeIcon` |
| More (vertical kebab) | `ellipsis-vertical` / `EllipsisVertical` | `dots-three-vertical` / `DotsThreeVerticalIcon` |
| Menu (mobile nav) | `menu` / `Menu` | `list` / `ListIcon` |
| Back | `chevron-left` / `ChevronLeft` | `caret-left` / `CaretLeftIcon` |
| Opens deeper screen | `chevron-right` / `ChevronRight` | `caret-right` / `CaretRightIcon` |
| Expand, select menu | `chevron-down` / `ChevronDown` | `caret-down` / `CaretDownIcon` |
| Sidebar toggle | `panel-left` / `PanelLeft` | `sidebar-simple` / `SidebarSimpleIcon` |
| Share | `share` / `Share` | `export` / `ExportIcon` |
| Copy | `copy` / `Copy` | `copy` / `CopyIcon` |
| Download / Upload | `download` / `upload` | `download-simple` / `upload-simple` |
| External link | `external-link` / `ExternalLink` | `arrow-square-out` / `ArrowSquareOutIcon` |
| Send (composer) | `arrow-up` / `ArrowUp` | `arrow-up` / `ArrowUpIcon` |
| Stop streaming | `square` / `Square` | `stop` / `StopIcon` |
| Attach | `paperclip` / `Paperclip` | `paperclip` / `PaperclipIcon` |
| Undo | `undo-2` / `Undo2` | `arrow-u-up-left` / `ArrowUUpLeftIcon` |
| Retry, refresh | `rotate-cw` / `RotateCw` | `arrow-clockwise` / `ArrowClockwiseIcon` |
| Info | `info` / `Info` | `info` / `InfoIcon` |
| Warning | `triangle-alert` / `TriangleAlert` | `warning` / `WarningIcon` |
| Error | `circle-alert` / `CircleAlert` | `warning-circle` / `WarningCircleIcon` |
| Help | `circle-help` / `CircleHelp` | `question` / `QuestionIcon` |
| Loading | `loader-circle` / `LoaderCircle` | `circle-notch` / `CircleNotchIcon` |
| Account, person | `circle-user` / `CircleUser` | `user-circle` / `UserCircleIcon` |
| Team, members | `users` / `Users` | `users` / `UsersIcon` |
| Invite | `user-plus` / `UserPlus` | `user-plus` / `UserPlusIcon` |
| Company | `building-2` / `Building2` | `buildings` / `BuildingsIcon` |
| Date | `calendar` / `Calendar` | `calendar-blank` / `CalendarBlankIcon` |
| Money, price | `dollar-sign` / `DollarSign` | `currency-dollar` / `CurrencyDollarIcon` |
| Email | `mail` / `Mail` | `envelope` / `EnvelopeIcon` |
| Notifications | `bell` / `Bell` | `bell` / `BellIcon` |
| Home | `house` / `House` | `house` / `HouseIcon` |
| Favorite | `star` / `Star` | `star` / `StarIcon` |
| Link | `link` / `Link` | `link` / `LinkIcon` |
| Lock, private | `lock` / `Lock` | `lock` / `LockIcon` |
| Show / hide | `eye` / `eye-off` | `eye` / `eye-slash` |
| File / document | `file` / `file-text` | `file` / `file-text` |
| Folder | `folder` / `Folder` | `folder` / `FolderIcon` |
| Image / missing image | `image` / `image-off` | `image` / `image-broken` |
| Archive | `archive` / `Archive` | `archive` / `ArchiveIcon` |
| Chart, analytics | `chart-column` / `ChartColumn` | `chart-bar` / `ChartBarIcon` |
| Drag handle | `grip-vertical` / `GripVertical` | `dots-six-vertical` / `DotsSixVerticalIcon` |
| Trend up / down | `arrow-up-right` / `arrow-down-right` | `arrow-up-right` / `arrow-down-right` |
| Good / bad response | `thumbs-up` / `thumbs-down` | `thumbs-up` / `thumbs-down` |
| Microphone | `mic` / `Mic` | `microphone` / `MicrophoneIcon` |
| Sign out | `log-out` / `LogOut` | `sign-out` / `SignOutIcon` |

All names verified against `lucide-static` 1.52 and `@phosphor-icons/core` 2.1 in October 2026. If a name is ever missing, search the library's site for the concept rather than substituting an emoji or symbol.

### 12.5 Images

- Fixed aspect ratios (1:1, 4:3, 16:9, 3:2) with `object-fit: cover`, `--radius-xl` (or the concentric value), and a 1px `--border-subtle` inner outline so light images don't bleed into the canvas.
- Always set `width` and `height` to avoid layout shift.
- Meaningful images get `alt` text; decorative images get `alt=""`.
- No stock photos of people, no 3D blobs, no decorative gradients, no AI-generated illustrations.

---

## 13. Writing

### 13.1 Voice and rules

Calm, direct, plain. Talk like a capable person helping, not a brand performing.

- Cut every word that doesn't change the meaning.
- Button and menu labels start with a verb and name the outcome: "Save Changes", "Export PDF…", "New Project".
- **Capitalization:** Title Case for buttons, menu items, tab and segment labels, table column headings, and dialog titles that are fragments. Sentence case for everything else: headings, body text, descriptions, helper text, placeholders, toasts, and dialog titles written as sentences.
- Multi-step flows: "Get Started", then "Continue", then "Done".
- Errors say what happened and how to fix it, next to the problem: "Use at least 8 characters", not "Password too short". "Can't connect. Check your internet and try again.", not "Network error 503".
- Phrase instructions positively: "Use letters only", not "Don't use numbers or symbols".
- Avoid "we" ("Unable to load messages", not "We're having trouble…"). Use "your" only when needed for clarity.
- Settings labels describe the on-state: "Show previews".
- Empty states say what goes here and how to add the first one.
- Placeholders show format ("name@example.com"), not instructions.
- Use "tap" on touch, "click" with a pointer, or "choose/select" when you can't know.
- Digits, not words, for numbers ("3 files"). Locale-aware dates, currency and units.
- No emoji, no exclamation marks in errors, no "Oops", no jokes when something went wrong, no "Click here".
- Marketing and landing copy promises the outcome, not the mechanism (§15).

### 13.2 Action words

One word per action, everywhere. If a button says Delete on one screen, it never says Remove, Trash, or Erase on another.

| Use | Meaning | Never use |
|---|---|---|
| **New** [thing] | Opens a flow to create something | Create New, Add New, + Add |
| **Create** [thing] | Submits that creation flow | Submit, Save (for creation), Make |
| **Add** [thing] | Puts an existing thing into a collection (Add Member, Add Tag) | Attach (unless files), Include |
| **Edit** | Opens something for changes | Modify, Change, Update |
| **Save** / **Save Changes** | Commits edits | Submit, Apply, Update, Confirm |
| **Delete** | Destroys the thing (soft or hard) | Remove, Trash, Erase, Destroy, Bin |
| **Remove** | Takes a thing out of a collection; the thing still exists (Remove from Project) | Delete (for this case), Unlink, Detach |
| **Archive** | Hides from active lists, fully restorable | Hide, Store |
| **Cancel** | Abandons a flow, nothing changes | Close (in forms), Abort, Never Mind |
| **Close** | Dismisses a view that has nothing to save | Exit, Dismiss, Done (when nothing was done) |
| **Done** | Finishes a flow whose changes are already applied | Finish, OK, Complete |
| **Discard** / **Discard Changes** | Throws away unsaved edits or a draft | Revert, Throw Away, Lose Changes |
| **Duplicate** | Makes a copy of an object | Clone, Copy (for objects) |
| **Copy** | Copies text or a link to the clipboard | Duplicate (for text) |
| **Export** / **Import** | Moves data out of / into the product in a file format | Download (for data exports), Ingest |
| **Download** / **Upload** | Moves a file to / from the user's device | Save to Device, Attach |
| **Share** | Gives other people access or sends a link | Send (for access), Publish |
| **Invite** | Asks a person to join | Add User (for new people) |
| **Search** | Finds by typing | Find, Look Up |
| **Filter** | Narrows a list by attributes | Refine, Narrow |
| **Retry** | Repeats a failed action | Try Again (pick one: Retry) |
| **Sign In** / **Sign Out** / **Sign Up** | Account access | Log In, Login, Log Out, Register |
| **Settings** | Product and account configuration | Preferences, Options, Config |
| **Continue** / **Back** | Moves through steps | Next Step, Proceed, Previous |

**Calls to action:** pick one primary CTA label for the whole product and marketing site (for example "Start for Free") and one secondary ("Book a Demo"). Never mix "Get Started", "Try It Free", "Start Trial", and "Get the Demo" for the same destination. Same label, same place.

Add product-specific nouns and verbs to this table as they appear, and reuse them exactly.

---

## 14. Designing for real data

Demo data is short, tidy and flattering. Real data isn't. Design and test with the ugly version.

**Truncation**
- Single-line text truncates with an ellipsis at the container's edge (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`), never by cutting characters in code.
- Chips, tags and badges cap at about 15 characters.
- Descriptions in cards clamp to two lines (`line-clamp: 2`).
- File names and paths truncate in the middle so the start and extension stay visible.
- Whenever text is truncated, the full value is available in a tooltip (`title` attribute plus the tooltip component) and in the detail view.
- Never truncate the key number, a price, or the only identifying name in a row; let the layout give them room first.

**Values**
- Missing values: an en dash in `--text-3` in tables, "Not set" in forms and detail views. Never "null", "undefined", "NaN", "N/A", "0" for unknown, or an empty cell.
- Large numbers abbreviate in compact spaces (12.4K, 3.1M) with the exact value in a tooltip.
- Dates: relative under a week ("2 hours ago"), short absolute after that ("Sep 30"), full date and time in a tooltip.
- Plurals handled for 0, 1, and many ("No files", "1 file", "12 files").
- Names from 1 to 60+ characters, non-Latin scripts, and RTL text all fit without breaking the layout.
- Missing avatars fall back to initials; missing images show an image-off icon on `--fill-soft`.

**States.** Every data view designs five states: loading (skeleton), empty (§10.16), error (inline with Retry), partial (some items failed), and full.

**Test data.** Seed and sample data must include: very long names and titles, empty optional fields, zero, one, and 1,000+ items, very large and negative numbers, slow responses, and failed requests. No emoji and no lorem ipsum in sample data that ships.

---

## 15. Landing pages

A landing page has one job: make it obvious what is being sold, who it is for, and what to do next. It is presentation, not complexity.

**Structure, top to bottom**

1. **Nav:** logo, 3–5 links, the secondary CTA as a ghost button and the primary CTA as a button. A mega menu only when the product has several areas with several pages each.
2. **Hero, stacked and centered:** headline promising the outcome (`display`), one-line subhead (`lg`, `--text-2`, max-width about 60ch), primary and secondary CTA side by side, then a real product screenshot below. 96–128px from the nav to the headline, 16px headline to subhead, 32px subhead to buttons, 64px buttons to screenshot.
3. **Proof row:** real customer logos in their own colors at equal visual weight, or a single real metric. Nothing invented.
4. **Features as a bento grid:** 3–5 tiles of different sizes. Each tile is a cropped product screenshot that proves one point, a short headline, and one sentence.
5. **How it works:** three steps, numbered, one line each.
6. **Testimonials:** real, attributed quotes (name, role, company, photo or logo).
7. **Pricing:** one section, plans side by side, the recommended plan marked with a small badge, not a different color scheme.
8. **FAQ:** an accordion of the 5–8 real objections.
9. **Final CTA:** the same two labels as the hero.
10. **Footer.**

**Rules**
- **No alternating zigzag** of text-left/image-right sections down the page.
- **No stock photos, no illustrations of people, no abstract 3D shapes.** Show the actual product.
- **Crop screenshots** to the part that proves the section's point instead of showing the whole dashboard. Export at 2x.
- **Hero CTAs are bigger than app buttons:** 44px tall, `body` (16px) 500 label, 24px horizontal padding, 12px apart. The nav CTA is 40px. Never use 32px app-sized buttons in a hero.
- **Hero screenshot frame:** one frame only. Either the screenshot with a 1px `--border`, `--radius-xl`, on the page background, or a `--bg-secondary` panel (`--radius-2xl`, 1px `--border`, 8–12px padding) holding the screenshot at the concentric radius (`--radius-lg` with 8px padding). It is as wide as the container, up to 1200px, at a 16:10 or 16:9 ratio. No gray placeholder box inside a gray panel with matching radii.
- **Feature tiles** follow the bento table in §7.7 and the card rules in §10.10 (full-bleed screenshot on top, text below, 24px padding, same structure in every tile).
- **Pricing cards:**
  - 2–4 plans in one row on an equal grid (§7.7), all the same height, same `--card-pad-lg` padding, same internal order: plan name, one-line description, price (`title-1` 600, tabular, with "/month" in `sm` `--text-2`), CTA button, then the feature list with check icons.
  - The CTA sits in the same position in every card. Put the feature list after it, or pin the CTA to the bottom with `margin-top: auto`; either way the buttons line up.
  - The recommended plan gets a 2px `--text` border instead of the 1px `--border`, a primary CTA (the others get secondary), and a "Recommended" badge on the same line as the plan name, inside the card padding: a pill, `caption` 600, `--primary-fill` with `--on-primary` text. No blue outline, no colored card, and never text sitting on the border line.
- **Every CTA with the same destination has the same label** (§13.2).
- **Copy sells the result.** "Collect and analyze your data quickly" describes; "Turn your data into decisions" promises. Lead with the promise, then explain.
- Same light theme, tokens, icon library, and no-emoji rule as the app. Accent fill is allowed for the primary CTA if the brand has a color; otherwise near-black.
- **Motion:** showing the product in motion is the exception landing pages get. Short (≤10 seconds), muted, looping clips or animations of the real product, with a poster frame, pause control, and a static image under reduced motion. A soft blur between panels in a feature carousel is fine. Still no parallax, scroll-jacking, or fade-in-on-scroll.
- **Placeholders:** if real logos, quotes, or numbers aren't available, use clearly marked placeholders (`[Customer logo]`, `[Quote from a real customer]`) and tell the user they need replacing. Never invent them.

---

## 16. Accessibility

Non-negotiable. Test each item.

- **Semantics:** real `<button>`, `<a href>`, `<input>`, `<label>`, `<nav>`, `<main>`, headings in order. ARIA only when no native element fits.
- **Names:** every control has an accessible name; icon buttons use `aria-label`; decorative icons are `aria-hidden="true"`; images have `alt`.
- **Keyboard:** everything reachable with Tab in visual order; Enter/Space activate; arrows move inside menus, tabs, radios and listboxes; Esc closes the top overlay; focus is trapped in modals and returned to the trigger. Don't override browser or OS shortcuts.
- **Focus:** `:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }` on every interactive element.
- **Contrast:** §6 values. With `prefers-contrast: more`, swap `--text-3` for `--text-2` and borders for `--border-strong`.
- **Color independence:** no state or status expressed by hue alone. Avoid red/green and blue/orange as the only distinction in charts.
- **Text size:** works at 200% zoom and with larger browser defaults; no fixed-height containers around text.
- **Motion and transparency:** §8 and §9 media queries in place.
- **Timing:** no auto-dismiss for anything that needs reading or action; no auto-advancing carousels; media never autoplays with sound.
- **Live regions:** streaming answers and toasts use `aria-live="polite"`; blocking errors use `role="alert"`.
- **Touch:** 44px targets, simple gestures, and a tap alternative for every swipe or drag.
- **Type-to-confirm fields** (§10.7) have a visible label that states the exact text to type.

---

## 17. Theming: light by default, dark on request

- Ship light only: `color-scheme: light`, the §4.1 tokens, no `prefers-color-scheme` rules, no theme toggle.
- Add dark only when the user explicitly asks. Then: append §4.2, set `data-theme="dark"` (or add the OS-following media query if they ask for that), and offer a System / Light / Dark setting only if they ask for a toggle.
- When dark is on: the canvas is #212121, not black; higher surfaces get lighter instead of relying on shadow; check images, logos and charts on the dark background and supply dark variants where something disappears.
- Test dark with increased contrast and reduced transparency.
- Every new custom color added to §4.1 needs a matching entry in §4.2, even in light-only projects, so dark can be added later without a redesign.

---

## 18. Anti-patterns

If you catch yourself doing one of these, stop and use the alternative.

| Don't | Do instead |
|---|---|
| Emoji in headings, buttons, empty states, toasts, or sample data | No emoji; a Lucide/Phosphor icon if an icon helps at all |
| Check-mark, cross, star, arrow or warning characters typed as icons | The icon component from §12.4 |
| Icons from two or three different libraries | One library for the whole project |
| Dark theme by default, or a theme toggle nobody asked for | Light only until the user asks for dark |
| Gradient hero backgrounds, glowing buttons, mesh blobs | Flat white canvas; content and type carry the page |
| Saturated blue or purple everywhere plus a second bright accent | Grays, one near-black primary, color only for data and status |
| Shadows on every card and button | 1px borders; shadows on overlays only |
| Some buttons square, some round | One `--radius-button` for every button |
| The same four KPI cards on the dashboard, analytics, and billing pages | Summary numbers on the dashboard only; each page answers one question |
| A card with four colored buttons, three chips, and a timestamp | Title, key number on the right, a "more" menu, icons instead of chips |
| Delete on one screen, Remove on another, Trash on a third | The §13.2 word, everywhere |
| "Get Started", "Try Free", "Start Trial" for the same signup | One CTA label |
| A side panel holding three fields | A centered dialog |
| Delete that silently vanishes | Tier 1 undo toast, or Tier 2/3 confirmation (§10.7) |
| "Are you sure?" dialog on every small delete | Undo toast for reversible actions |
| Spinner over a blank page | Skeleton of the real layout |
| Infinite scroll that hides the footer | Load More with a count |
| Content fading or flying in as you scroll | Content is simply there |
| Forced product tour on first login | "Start here" checklist with real first steps |
| Confetti for saving a form | Check icon and "Saved"; confetti for real milestones only |
| Text-left/image-right zigzag down the landing page | Stacked hero and a bento grid |
| Three feature tiles where one wraps alone onto a second row | A layout from the §7.7 bento table that fills every row |
| `flex-wrap` or `auto-fill` grids for feature cards | Explicit column spans with `data-count` |
| A gray rounded box inside a bordered rounded card | Full-bleed media, or an inset with a concentric radius |
| A 37px nav with 14px links and 32px buttons | 64px nav, 16px links, 40px CTAs |
| "Recommended" text sitting on a blue card border | Badge inside the card next to the plan name; 2px `--text` border |
| Stock photos of people at laptops | Cropped screenshots of the product |
| Invented testimonials, logos, or "10,000+ teams" | Real proof, or marked placeholders |
| "Oops! Something went wrong" | "Couldn't save your changes. Try again." with Retry |
| Placeholder text instead of a label | Visible label above the field |
| `undefined`, `null`, or blank cells | En dash or "Not set" |

---

## 19. Pre-ship checklist

Run this before calling a UI task done. Fix failures; don't just report them.

**Intent**
- [ ] The page's one job is written down, and every element serves it.
- [ ] No summary cards or KPIs outside the dashboard.

**Visual**
- [ ] Light theme only, unless the user asked for dark.
- [ ] Zero emoji anywhere. Search code, copy and seed data with the regex `\p{Extended_Pictographic}` (Unicode flag on); only ©, ® and ™ in legal text may match.
- [ ] Every icon comes from the one chosen library; no Unicode symbols used as icons.
- [ ] Tokens only: no raw hex, px font sizes, or ad-hoc shadows in components.
- [ ] No shadows on content or buttons; 1px borders do the separating.
- [ ] All buttons share `--radius-button`; radii are concentric where elements nest.
- [ ] Color appears only on data, statuses, links/focus/selection, and the primary button.
- [ ] At most ~4 type sizes per screen; weights 400–700 only.

**Interaction**
- [ ] One primary button per view.
- [ ] Hover (fine pointer only), pressed, focus-visible, disabled, loading and done states exist where relevant.
- [ ] Every action has a visible finished state.
- [ ] Destructive actions use the right tier from §10.7.
- [ ] Short forms open in a centered dialog, not a side panel.
- [ ] Lists use Load More or pagination, never infinite scroll.
- [ ] No load or scroll animations; reduced motion handled.
- [ ] Esc closes overlays; focus returns to the trigger.

**Content and data**
- [ ] Labels use the §13.2 words in Title Case; other text in sentence case.
- [ ] Errors say how to fix the problem; empty states offer the next action.
- [ ] Tested with long names, missing values, 0 / 1 / 1,000+ items, slow and failed loads.
- [ ] Truncated text has a tooltip with the full value.

**Accessibility**
- [ ] Contrast meets §6.
- [ ] Full keyboard path works; visible focus everywhere.
- [ ] Touch targets ≥44px; inputs ≥16px on touch.
- [ ] Status never conveyed by color alone; images have alt text.
- [ ] Works at 200% zoom.

**Chat surfaces**
- [ ] Single composer; send and stop states; Enter/Shift+Enter behavior.
- [ ] Assistant text unbubbled in a ≤768px column; user bubbles in `--fill-soft`.
- [ ] Streaming doesn't hijack scroll; errors inline with Retry.

**Layout**
- [ ] Every section shares one container; logo, headings and grid edges align.
- [ ] No grid row ends with a gap or a stranded tile; bento layouts come from the §7.7 table.
- [ ] Every card in a grid has the same padding on all sides; no box-in-a-box media; inner radii concentric.
- [ ] Card buttons and footers line up across a row.
- [ ] If a browser is available, screenshot the page at 375, 768, 1280 and 1440px wide and check the items above in the images before finishing.

**Landing pages**
- [ ] Stacked hero, no zigzag, no stock photos, cropped real screenshots.
- [ ] Nav 64px with 16px links and 40px CTAs; hero CTAs 44px.
- [ ] Pricing cards equal height with aligned CTAs; badge inside the recommended card.
- [ ] One CTA label per destination across the whole page.
- [ ] No invented proof; placeholders flagged to the user.

---

## 20. Tailwind mapping (optional)

For Tailwind v4: paste §4.1 after `@import "tailwindcss"` (unlayered, so it wins over Tailwind's theme layer), then add the mapping below. Mapped names are chosen so nothing references itself. If the user asks for dark mode, append §4.2 and the mapping keeps working because it points at the same variables.

```css
@import "tailwindcss";

/* §4.1 :root block goes here */

/* Values that never change with theme: literal, so utilities exist */
@theme {
  --font-sans: ui-sans-serif, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
    "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --text-caption: 0.75rem;     --text-caption--line-height: 1rem;
  --text-footnote: 0.8125rem;  --text-footnote--line-height: 1.125rem;
  --text-sm: 0.875rem;         --text-sm--line-height: 1.25rem;
  --text-body: 1rem;           --text-body--line-height: 1.5rem;
  --text-lg: 1.125rem;         --text-lg--line-height: 1.75rem;
  --text-title-3: 1.25rem;     --text-title-3--line-height: 1.625rem;
  --text-title-2: 1.5rem;      --text-title-2--line-height: 1.875rem;
  --text-title-1: 1.75rem;     --text-title-1--line-height: 2.125rem;
  --text-large-title: 2.125rem; --text-large-title--line-height: 2.5625rem;
  --text-display: 3rem;        --text-display--line-height: 3.25rem;
  --radius-xs: 4px; --radius-sm: 6px; --radius-md: 8px; --radius-lg: 12px;
  --radius-xl: 16px; --radius-2xl: 20px; --radius-3xl: 28px;
  --radius-button: 9999px; --radius-field: 8px;
  --breakpoint-xs: 380px;
}

/* Values that would switch if dark mode is added: reference the §4 variables */
@theme inline {
  --color-bg: var(--bg);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-grouped: var(--bg-grouped);
  --color-surface: var(--surface);
  --color-surface-elevated: var(--surface-elevated);
  --color-fill-soft: var(--fill-soft);
  --color-fg: var(--text);
  --color-fg-2: var(--text-2);
  --color-fg-3: var(--text-3);
  --color-fg-disabled: var(--text-disabled);
  --color-line: var(--border);
  --color-line-subtle: var(--border-subtle);
  --color-line-strong: var(--border-strong);
  --color-control-line: var(--control-border);
  --color-hover: var(--hover);
  --color-pressed: var(--pressed);
  --color-selected: var(--selected);
  --color-primary: var(--primary-fill);
  --color-primary-hover: var(--primary-hover);
  --color-on-primary: var(--on-primary);
  --color-accent: var(--accent);
  --color-accent-fill: var(--accent-fill);
  --color-accent-soft: var(--accent-soft);
  --color-accent-line: var(--accent-line);
  --color-danger: var(--danger);
  --color-danger-fill: var(--danger-fill);
  --color-danger-soft: var(--danger-soft);
  --color-danger-line: var(--danger-line);
  --color-success: var(--success);
  --color-success-fill: var(--success-fill);
  --color-success-soft: var(--success-soft);
  --color-success-line: var(--success-line);
  --color-warning: var(--warning);
  --color-warning-fill: var(--warning-fill);
  --color-warning-soft: var(--warning-soft);
  --color-warning-line: var(--warning-line);
  --shadow-overlay: var(--shadow-overlay);
  --shadow-raised: var(--shadow-raised);
}

/* Hover styles only for a precise pointer */
@custom-variant hover {
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      @slot;
    }
  }
}
```

This gives utilities such as `bg-surface`, `text-fg-2`, `border-line`, `bg-primary text-on-primary`, `bg-success-soft border-success-line text-success`, `text-body`, `rounded-button`, `rounded-xl`, `shadow-overlay`. Tailwind's default spacing is already on a 4px base (`p-4` = 16px = `--space-4`). Don't use Tailwind's built-in palette classes (`bg-blue-500`, `text-purple-600`) or its default `shadow-*` sizes; they bypass these tokens.

---

## 21. Sources and coverage

**Read in full or section by section (October 2026):**
- OpenAI: [Plugin UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines) (display modes, card and carousel limits, color, type, spacing, icons, accessibility).
- OpenAI: `@openai/apps-sdk-ui` v0.2.2 package stylesheets on npm (gray ramp, semantic colors, type scale, radii, control sizes, shadows, motion, dialog and menu tokens), MIT license.
- Apple HIG: [index](https://developer.apple.com/design/human-interface-guidelines), Design principles, Foundations, Patterns and Components indexes, Typography, Color, Layout, Materials, Accessibility, Motion, Dark Mode, Writing, Icons, Feedback, Loading, Modality, Entering data, Onboarding, Searching, Buttons, Sheets, Alerts, Popovers, Menus, Toggles, Segmented controls, Text fields, Lists and tables, Tab bars, Sidebars, Toolbars, Progress indicators.
- "SaaS UI: The Checklist That Makes Software Look Like a Product People Pay For" (supplied by the project owner): no emoji and a real icon set, restrained color with data carrying the color, the Attio/Airtable light treatment, one job per page, compact cards, designing for messy data, action vocabulary and CTA consistency, tiered destructive actions, completion states, motion restraint, Load More, progressive onboarding, the value tracker, and landing-page structure.
- Icon names checked against `lucide-static` / `lucide-react` 1.52 and `@phosphor-icons/core` 2.1.1 / `@phosphor-icons/react` 2.1.10.

**Not read page by page:** the remaining HIG pages, which are mostly platform-specific (watchOS, visionOS, tvOS, CarPlay, games, Wallet, HealthKit, Siri). Consult the originals for native platform work.

**Decisions this file makes that no single source dictates:**
- Light theme as the default with dark as opt-in (project owner's preference); Apple and ChatGPT both follow the OS setting.
- Flat light surfaces with borders instead of Apple's Liquid Glass chrome; glass kept only for controls over media.
- Near-black primary button (ChatGPT) combined with white secondary and quiet ghost buttons (Attio).
- Accent blue and tertiary gray darkened from the source values so they pass WCAG AA (verified values in §6).
- Tiered destructive actions merging Apple's "warn only about irreversible loss" with the checklist's "confirm destructive, expensive or final actions".
- The action-word table, tag palette, motion durations and easing curves.
