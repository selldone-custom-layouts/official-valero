# Valero — Selldone Layout

**Valero Market** (package `valero-market`) is a Layout of the Selldone shop **molino** (shop 15645), shown only on `valero.selldone.shop`. It is design **D** of the owner's request of 7 November 2026: "make designs C and D the same way A and B were made, one with a purple theme, one with a black theme; every page must have a new design; C on dino.selldone.shop, D on valero.selldone.shop; make them completely different from each other in everything." Design C is Dino (purple, a separate Layout); Valero is the black one.

It started as a copy of Tario Market (`tario-market`, layout 25, release 1.2.5), itself Molino Market Hall's code, so every behaviour the owner asked for stays:

- "Add to bag" turns into "− n in bag +" in place, and products with sizes open the quick-buy sheet;
- no "Added to bag" pop-up and no phone bottom bar;
- the two-step, map-first address sheet; the receipt that follows Selldone's bill; Pay leading to whatever is missing;
- the reviews, the buyer account (the "desk" side rail) and the content pages.

[`KALIO.md`](KALIO.md) explains each of them and every Selldone workaround. Read it before changing anything.

## The idea: an after-dark food hall

| Area | Valero |
| --- | --- |
| Page | black `#0b0b0c`, surfaces `#151516`, ivory type `#f4f1ea`, muted `#9a958c` |
| Accent | champagne `#c9a96e`, for hairlines, numbers and small capitals only |
| Action | ivory buttons with black type (`--k-green` is ivory, `--k-on-green` black) |
| Savings | champagne `#e2b97a` price, a small champagne "−20%" label |
| Type | Cormorant Garamond for headings (large, light), Jost for text; tracked small capitals for labels |
| Shape | square corners everywhere, 1px hairlines, no shadows; only avatars are round |
| Packshots | on ivory squares (`--k-well`), drawn at 120% so the pack fills about 84% |
| Selldone's own parts | Vuetify's dark theme in Valero's colours (`storefront.ts`), so fields, menus, dialogs and sheets are dark |
| Logo | a serif "V" in a hairline champagne square (`assets/brand/valero-mark.svg`) and the name in spaced serif capitals |

## Page by page (mockups: `kalio-design/cd-options/<page>-d.html`)

- **Header:** a champagne announcement line (the shop's free-shipping rule, free pickup, its makers); one black bar with Aisles (a numbered index of every aisle), Offers, Journal and Makers on the left, the wordmark in the middle, Search, Account and "Bag (n)" on the right. Search opens a full-width row under the bar. Phone: Menu, the wordmark, a search mark and the bag; the menu lists the aisles as a numbered index.
- **Home** (`components/valero/ValeroHome.vue`): a full-bleed photo with "The market, *after hours.*"; 01 The aisles as a numbered index with the hovered aisle's picture; 02 This week's edit, the biggest savings in a hairline grid; 03 Of the season, the fresh aisle beside a photo; 04 The makers; 05 From the journal as a magazine block; the ways to get it.
- **Card** (`ValeroCard.vue`): ivory square, who sells it in small capitals, the name, the price with the old one struck and the unit, a hairline "Add to bag +".
- **Aisle, catalogue, search:** a huge serif title, the types as tracked words, one hairline filter bar, Selldone's cards on ivory squares.
- **Product:** large serif title, the delivery choice as a square segmented control, the sellers as hairline rows, folding sections for the details.
- **Bag:** a full-height black panel with "Your bag", hairline rows, the free-shipping meter, View bag and Check out; the bag page with the same summary.
- **Maker (seller):** "The maker", the name in very large serif, the round mark in a champagne ring.
- **About, journal, article, terms, 404:** typographic: big serif headings, hairline numbers, "Not on the shelf." with an outlined 404.
- **Footer:** black columns, champagne small-capital heads.

## How the black theme was made

The Kalio and Tario stylesheets were written for a white page, with about 300 literal light colours. `scripts/valero-darken.mjs` and `scripts/valero-darken-tints.mjs` turned them into Valero's tokens once (white surfaces → `--k-card`, white text on the action colour → `--k-on-green`, light greys → hairlines), and literal radii were squared. Valero's own look is in `style/valero-d.scss` (base, header, footer, card, home) and `style/valero-d-pages.scss` (every other page), loaded last.

## Photos

The hero, "Of the season" and sign-in pictures are the four journal photos the owner already had made with Codex (`assets/valero/`). Prompts for further photos are in `kalio-design/cd-options/image-prompts-d.md`. Without a photo the sections draw packshots on ivory instead.

## Releases

- **1.0.0 (7 November 2026):** first release: design D on every page. Selldone layout 28, pinned on valero.selldone.shop (domain 1236).
