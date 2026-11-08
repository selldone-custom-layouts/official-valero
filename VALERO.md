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

- **1.0.7 (8 November 2026):** the quick-buy sheet no longer shows "SellerPriceChoose" over its sellers (those column words belong to the product page's seller table). Contact us is designed at last (it was Selldone's page: a tall empty block, a form far below it on a fixed off-white card, and a red "Store profile not found" when the shop has written no contact page): the heading and three ways to a sooner answer (an order's own messages, the questions page, About) beside the form in a card, all in the Layout's tokens; a shop with no contact page shows no error. The questions page with no questions yet is a quiet card with its icon in a soft disc. Shoppers read "bag", never "basket": "1 in your bag, from Alina" on the product page, Selldone's "others have this in their bags!", the empty account, the cookie choices and a cart line's remove button. Found walking the shop as a buyer on a computer and a phone (the owner, 8 November 2026: "test it as a buyer, the full purchase, and fix the design bugs without asking").
- **1.0.6 (8 November 2026):** "CHOOSE OPTIONS" no longer runs out of a narrow card button (the owner's screenshot): in Valero's tracked capitals it is 133px of text, 161px with the padding. The card's foot is a size container, so a foot under 180px tightens the tracking (10.5px, 0.1em) and one under 130px says "OPTIONS"; checked from 240px down to 110px.
- **1.0.5 (8 November 2026):** the compare page Dino got in 1.0.7 (design 1 of the two mockups), in this Layout's own dress (the owner: "build it for them, but it must suit each site's own design, so change it a little"). The picks stay pinned at the top with their price, price per unit and the Layout's Add button ("− n +" in place), an empty column adds one more (the shop's search and three from the same aisle, up to four), the details come in the shop's own groups with differing rows marked and same values merged, "Only differences" hides the rest, then pros, reviews and a link to share. The Compare pill opens it instead of Selldone's full-screen table; ?list= keeps Selldone's format. Valero's dress: "Side by side" in large light Cormorant under a champagne "The comparison", the groups numbered 01, 02, … as hairline tables with no boxes, a differing value behind a champagne hairline, a square Everything / Only differences switch, tracked small-capital buttons, packshots on ivory squares, square corners. The page is `components/kalio/compare/` (the same in every molino Layout but Dino) with this Layout's words in `compare-skin.ts` and its look in `style/kalio-compare.scss`.
- **1.0.4 (8 November 2026):** no line under words or icons anywhere (the owner, after a line showed under "Compare" and its box icon: "never put these lines under text or icons"). Links, buttons, menus, tabs and chips carry no underline at rest, on hover, focus or press; the line under a product card's "Compare" came from the card being a link, whose hover underline reached every word inside it. The hover underline on filled buttons (a tester's colour-blind request of 7 November) is gone too; those buttons deepen in colour. Only links inside an article's own text keep their line, and struck-through old prices are untouched.
- **1.0.3 (8 November 2026):** the cart's "How do you want it?" card is laid out again: Valero hides the radio, but the card kept four columns, so the icon fell into the radio's 22px over the name and the name into the icon's 40px, one word a line (the owner's screenshot). Now the icon, then the name with the price under it. Also a delivery way's line no longer starts with "·" when the way has no message of its own ("· Pay on delivery"); and the Compare pill changes colour on hover and nothing else: no underline under the word and its icon, and not Selldone's widget-hover lift (a 50px shadow easing in over half a second) (the owner: "the hover animation is not good, remove the lines").
- **1.0.2 (8 November 2026):** "05 From the journal" is the home's last section, after the ways to get it (the owner: an article section as the home's last section). Each post shows its date: the blog list has no body to time, so every post had said "1 min read". The small photos come from the shop's resizer (256 or 384px instead of the 310KB original, which left them blank for seconds on a phone); the large one adds the 1600px original for sharp screens; a dark well holds the place while a photo loads.
- **1.0.1 (8 November 2026):** the product page says "Add to bag" like the rest of Valero (Selldone's own buy button said "Add to cart"; English words merged in kalio-brand.ts); an aisle's long types ("Nuts & trail mix") stay on one line on phones instead of a column a letter wide; the pages' corners are square (Selldone's storefront.scss, loaded later, still rounded the page card).
- **1.0.0 (7 November 2026):** first release: design D on every page. Selldone layout 28, pinned on valero.selldone.shop (domain 1236).
