# Specimen design system

Specimen is a scientific-editorial look for slides and web pages. It reads like a lab notebook laid out by a magazine: a light serif for ideas, a plain grotesk for explanation, monospace for every label and number, and flat fields of colour that hold generated data imagery. Use it for research, engineering and technical work where the data should feel present and the writing still carries the argument.

## Principles

- **Panels, not cards.** Content sits on flat, square, colour-blocked panels that butt against each other or overlap. No shadows, no rounded corners, no gradients.
- **Three voices of type, never mixed up.** The serif (`display`) makes claims. The grotesk (`text`) explains them. The mono (`mono`) labels, counts and indexes.
- **Data is the decoration.** The only imagery is plates: seeded dot plots with small value tags. No stock photos, no illustrations of people, no emoji.
- **One loud thing per view.** A giant word, a full violet panel or a dense plate. The rest of the view stays quiet paper and ink.

## Content fundamentals

- Write headlines as plain statements in sentence case: "Predicting engine faults early", "Every fault leaves a trace in the data first." Two to four lines. A full stop is fine on a statement headline.
- Body copy is short, specific and third person or "we". Name the real thing: the engine model, the dataset, the method. Cut adjectives before cutting facts.
- Labels are uppercase mono and terse: `NOTEBOOK 02 / FEATURES`, `BLOG / JULY 25 2026`, `N=4,110`, `FIG 1.30`, `P-1`. Use a slash to separate a category from its item.
- Numbers keep their precision and units: `0.67`, `72.3%`, `p<0.001`. Never round a real figure to make it look clean, and never invent one to fill a layout. Mark a missing figure as `[__]`.
- Titles of listed items may pair a name and a gloss with a spaced em dash: "Features — from signals to inputs".
- No emoji anywhere. No exclamation marks.

## Colour

The palette is fourteen pigments plus a small set of semantic tokens. Pigments are the same in both themes; semantic tokens switch.

- **Paper and ink carry reading.** Set running text in `ink` on `paper`, `bone`, `oat` or `mint-pale`, or in `paper` on `ink`, `umber`, `moss`, `forest` or `violet`. Every one of those pairs passes 4.5:1.
- **Violet is the accent.** Use `violet` for the accent strip, one full statement panel per deck or page, and links on paper. Paper text on violet reads at 5.5:1.
- **Lilac, mint, salmon and forest are fields.** Use them as whole panels or plate grounds. Text on `lilac`, `mint` and `salmon` is always `ink`. Never put paper text on mint or lilac.
- **Mint is also the signal.** One mint highlight per view: an icon tile, a "new" tag, a marker. More than one and it stops meaning anything.
- **Stone and sage are stages.** `stone` (or `sage`) is the ground that panels float on. Never put text directly on a stage; put a panel there.
- Pair grounds the way the plates do: ink with mint and lilac, bone with forest and violet, mint with forest and lilac, salmon with violet and mint, violet with lilac and salmon.
- On the web, wrap any coloured panel in its ground class (`sp-on-ink`, `sp-on-lilac` ...). It sets the background and re-points `--text`, `--text-muted`, `--rule` and `--accent-text` so components inside read correctly.

## Type

- `display`: Newsreader, a light editorial serif with optical sizes. Weights 330 to 400 only. Set it tight (`line-height` 0.98 to 1.1) with slight negative tracking at large sizes. Use `giant`, `display-xl`, `display-l`, `display-m`, `headline` and `title`.
- `text`: Hanken Grotesk at 400 for everything you read. Use `lead`, `body` and `body-s`. Narrow columns of `body-s` may be justified, as in a journal.
- `mono`: Geist Mono for `label`, `data` and `micro`. Labels are always uppercase with `0.06em` tracking. Data uses tabular figures.
- Hierarchy comes from size and voice, not weight. Do not bold the serif. Use italic Newsreader only for a quoted phrase or a species-style term.
- Headlines may stagger: indent the second line by about a fifth of the column and the third by about a tenth (`sp-stagger`). Use it on statement slides and article heroes, not on every heading.
- A headline may carry inline image chips (`sp-chip`): small plate crops the height of a lowercase letter, set between words. One or two per headline.

### Slide scale (1920 x 1080 canvas)

| Role | Face | Size | Weight |
| --- | --- | --- | --- |
| Giant word | display | 360 to 440px, uppercase, cropped | 300 to 400 |
| Display | display | 120px | 300 |
| Headline | display | 72px | 300 |
| Title | display | 44px | 400 |
| Lead | text | 32px | 400 |
| Body | text | 26px | 400 |
| Label and data | mono | 24px, uppercase | 400 |

Keep slide margins at `space-10` (128px). Nothing on a slide goes below 24px.

## Layout and composition

- **Stage and panels.** For a hero or a showcase, set a `stage` ground and float one or two panels on it with `space-7` between them, like proofs laid on a table.
- **Inset panel.** The signature move. A plate fills a panel edge to edge; a `paper` card is inset from its top and left by `space-8` or more, running off the bottom and right edges. A `violet` strip (`strip-width`) sits against the card's left edge, starting `space-6` below its top. Mirror it with `sp-inset--right`.
- **Giant word.** One oversized uppercase serif word in `lilac` on `ink`, cropped by the panel's top or by the card that overlaps it. Scatter a few `micro` mono metadata blocks over it. One per page or per deck section.
- **Split panels.** Divide a view into two or three unequal colour fields (for example lilac statement over a bone plate, or a moss plate beside a paper article). Fields touch; there are no gutters between them.
- **Edge strips.** A thin lilac or violet plate strip down one edge of a paper page adds texture without taking space.
- Meta headers (`sp-meta`) open a panel: category on the left, identifier and count on the right, a dashed rule under them.
- Lists of facts use hairline rule lists (`sp-rules`), not bullets.
- Align headlines to the top of their panel and push body copy to the bottom; let the space between do the work.

## Imagery: plates

- Plates are generated, never drawn by hand and never stock. `Specimen.plate(element, { kind, palette, seed })` draws one on a canvas; `Specimen.svg({...})` returns the same plate as SVG. Add `data-plate="strands ink 12"` to any element and call `Specimen.mountAll()`.
- Five kinds: `strands` (beaded paths), `fan` (rays from one point), `cells` (a dotted cell network), `rings` (packed circles inside a curved boundary), `field` (particle clouds with detection boxes).
- Ten palettes, named by ground: `ink`, `moss`, `umber`, `forest`, `violet`, `bone`, `paper`, `mint`, `lilac`, `salmon`. Dark grounds get a fine grain.
- Each plate carries a few value tags. Tags on plates are texture. If a number means something, put it in a rule list or a caption, not only on a plate.
- Ready-made plates are in the Plates asset group (1600 x 1000 SVG) for decks and documents that cannot run scripts. Crop them with `object-fit: cover`.
- Fix the seed so a plate looks the same on every load; change the seed to get a sibling.

## Iconography

- No icon set is part of the language; the mono labels do most of that work. When a page needs an icon (a menu, a download, an external link), use Lucide at 1.5px stroke, sized to the cap height of the text beside it, in `currentColor`.
- An icon may sit in a square `mint` tile as a section emblem, with a mono version tag beside it, for example `(1.0)`. One per view.
- No emoji, ever.

## Shapes, borders and depth

- Every corner is square (`radius-none`). The two round shapes are the figure badge circle (`radius-round`) and the pill index (`radius-pill`).
- Lines are hairlines (`line-hairline`) in `rule` or `currentColor`. Dashed lines only under meta headers.
- No shadows and no blur. Depth comes from overlap: a card over a plate, a panel over a stage.

## Interaction and motion

- Links on paper are `accent-text` with an underline on hover. Buttons (`sp-btn`) are mono, square, filled with `text`, and end in `>>`; on hover they fill with `accent`.
- Focus is a 2px solid `focus` ring with a 2px offset on every interactive element.
- Motion is rare and mechanical: panels slide in along one axis, plates fade in. 150 to 250ms. Respect `prefers-reduced-motion`.

## Building a slide

1. Pick the slide's ground from the pigments; alternate light and dark slides, with one violet statement slide per section.
2. Open with a meta header or a tag at the top margin.
3. Set one headline in `display`; keep body copy to two short paragraphs or a rule list.
4. Add one plate, cropped into a panel, or one giant word. Not both.
5. Put labels, page numbers and sources in mono at 24px.

## Building a web page

1. Load `tokens.css`, `components/bundle.css` and, if you use plates, `components/bundle.js`.
2. Start with `sp-nav` on `oat`, then an inset-panel hero.
3. Alternate `sp-on-paper` sections with one coloured section per screen height.
4. Give the page a 16px gutter at phone width; inset panels shrink their offsets to `space-6` there.
5. Use real content. A missing figure is `[__]`, never a guess.

## Files

- `specimen.css`: fonts (Google Fonts), colour, type, spacing, radius and line tokens as CSS custom properties, the type classes (`giant`, `display-xl` ... `label`, `data`, `micro`) and every component class (`sp-*`).
- `specimen.js`: the plate generator. Exposes `window.Specimen` with `plate()`, `svg()` and `mountAll()`.
- Light (Paper) is the default theme. Set `data-theme="dark"` on `<html>` only when a dark page is asked for.

## Starting a page

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="specimen.css">
</head>
<body>
  <nav class="sp-nav" aria-label="Main">
    <a class="sp-nav__mark" href="/">Keyframe</a>
    <p class="sp-nav__tagline">Fault diagnosis for marine diesel engines</p>
    <div class="sp-nav__links"><a href="#data">Data</a><a href="#method">Method</a></div>
    <a class="sp-btn" href="#contact">Contact</a>
  </nav>
  <section class="sp-inset">
    <div class="sp-inset__plate" data-plate="strands ink 12"></div>
    <div class="sp-inset__card sp-on-paper">
      <h1 class="sp-headline display-xl">Predicting engine faults early</h1>
      <p class="lead">Keyframe learns from marine diesel test-bench data.</p>
      <ul class="sp-rules"><li><span>Dataset</span><span>Zenodo MEF v1.0</span></li></ul>
    </div>
  </section>
  <script src="specimen.js"></script>
  <script>Specimen.mountAll();</script>
</body>
</html>
```

## Component classes

| Component | Classes |
| --- | --- |
| Grounds | `sp-on-paper`, `sp-on-bone`, `sp-on-oat`, `sp-on-mint-pale`, `sp-on-lilac`, `sp-on-mint`, `sp-on-salmon`, `sp-on-ink`, `sp-on-umber`, `sp-on-moss`, `sp-on-forest`, `sp-on-violet` |
| Stage | `sp-stage` |
| Tag | `sp-tag`, `--outline`, `--signal`, `--accent` |
| Value tag | `sp-value`, `--forest`, `--violet`, `--paper`, `--outline` |
| Figure reference | `sp-fig`, `sp-fig__badge`, `sp-fig__label` |
| Index list | `sp-index-list`, `__item`, `__title`, `__desc`, `sp-index`, `sp-index--lead` |
| Meta header | `sp-meta`, `sp-meta--plain` |
| Rule list | `sp-rules` |
| Button | `sp-btn`, `--outline`, `--signal` |
| Navigation | `sp-nav`, `__mark`, `__tagline`, `__links`, `__menu` |
| Headline | `sp-headline`, `sp-stagger`, `sp-chip` |
| Inset panel | `sp-inset`, `__plate`, `__card`, `--right`, `--no-strip` |
| Giant word | `sp-giant`, `__word`, `__meta`, `__meta--bullet` |
| Plate | `sp-plate`, `--square`, `--tall`, `--band`, plus `data-plate="kind palette seed"` |
