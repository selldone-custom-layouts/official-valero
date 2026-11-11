/* Valero — the filters of a listing, read from Selldone's own filter record.

   An aisle's record (`parent.filters`, or `shop.filters` on the whole
   catalogue) holds:
     prices        [{ currency, min, max }]
     brands        ["…"]
     volumes, weights, packs, colors, styles, types   (variant values)
     <spec key>    ["…"]   one per spec key the merchant listed
     ignore        ["price", "discount", "original"]
   and the listing takes a filter in the shape SCategoryFilter emits:
     { only_is_original, only_has_discount, prices: { USD: [lo, hi] } | null,
       brands: [], selected_spec: { Key: [v] }, selected_variants: { volumes: [v] } }
   Pills in one group are OR, groups are AND (Selldone's own rule).

   Words (ES-06, 11 November 2026): a spec key ("Type") and its values
   ("Fruit") are the shop's own English words, and they are what the server
   filters by, so the filter and the address keep them as they are. Only
   what the shopper reads goes through shopText() (data/<lang>.json):
   "Tipo", "Fruta" in Spanish. The label is a getter, read when drawn, so a
   language pick redraws it. */
import { t } from "../../kalio/i18n/kalio-i18n";
import { shopText } from "../../kalio/i18n/shop-data";


export interface ValeroGroup {
  /** "spec" groups live in selected_spec, "variant" ones in selected_variants. */
  kind: "spec" | "variant" | "brand";
  key: string;
  label: string;
  values: string[];
}

export interface ValeroFilter {
  only_is_original?: boolean;
  only_has_discount?: boolean;
  prices?: Record<string, number[]> | null;
  brands?: string[];
  selected_spec?: Record<string, string[]>;
  selected_variants?: Record<string, string[]>;
}

/* Read when drawn, in the visitor's language. */
const VARIANT_LABEL: Record<string, () => string> = {
  volumes: () => t("valero.filter.size", "Size"),
  weights: () => t("compare.variant.weight", "Weight"),
  packs: () => t("compare.variant.pack", "Pack"),
  colors: () => t("valero.filter.color", "Color"),
  styles: () => t("compare.variant.style", "Style"),
  types: () => t("valero.filter.kind", "Kind"),
};
const RESERVED = ["prices", "brands", "ignore"];

function list(value: any): string[] {
  if (!value) return [];
  const out = Array.isArray(value) ? value : Object.values(value);
  return out.filter(Boolean).map(String);
}

/** Every group a shopper can narrow by, in the order Valero shows them:
 *  the sizes first (what a grocery shopper reaches for), then the
 *  merchant's spec keys in their own order, then the brands. */
export function groupsOf(filters: any): ValeroGroup[] {
  if (!filters) return [];
  const out: ValeroGroup[] = [];
  for (const key of Object.keys(VARIANT_LABEL)) {
    const values = list(filters[key]);
    if (values.length) out.push({ kind: "variant", key, get label() { return VARIANT_LABEL[key](); }, values });
  }
  for (const key of Object.keys(filters)) {
    if (RESERVED.includes(key) || VARIANT_LABEL[key]) continue;
    const values = list(filters[key]);
    if (values.length) out.push({ kind: "spec", key, get label() { return shopText(key); }, values });
  }
  const brands = list(filters.brands);
  if (brands.length > 1) out.push({ kind: "brand", key: "brands", get label() { return t("valero.filter.brand", "Brand"); }, values: brands });
  return out;
}

/** The values picked in one group. */
export function picked(filter: ValeroFilter | null, group: ValeroGroup): string[] {
  if (!filter) return [];
  if (group.kind === "brand") return filter.brands || [];
  if (group.kind === "variant") return filter.selected_variants?.[group.key] || [];
  return filter.selected_spec?.[group.key] || [];
}

/** A copy of the filter with one group's values replaced. */
export function withGroup(filter: ValeroFilter | null, group: ValeroGroup, values: string[]): ValeroFilter {
  const next = clone(filter);
  if (group.kind === "brand") next.brands = [...values];
  else if (group.kind === "variant") next.selected_variants = { ...(next.selected_variants || {}), [group.key]: [...values] };
  else next.selected_spec = { ...(next.selected_spec || {}), [group.key]: [...values] };
  return next;
}

export function clone(filter: ValeroFilter | null): ValeroFilter {
  const f = filter || {};
  return {
    only_is_original: !!f.only_is_original,
    only_has_discount: !!f.only_has_discount,
    prices: f.prices ? JSON.parse(JSON.stringify(f.prices)) : null,
    brands: [...(f.brands || [])],
    selected_spec: JSON.parse(JSON.stringify(f.selected_spec || {})),
    selected_variants: JSON.parse(JSON.stringify(f.selected_variants || {})),
  };
}

/** How many narrowing choices are on (each picked value and each switch). */
export function countOn(filter: ValeroFilter | null): number {
  if (!filter) return 0;
  let n = 0;
  if (filter.only_has_discount) n++;
  if (filter.prices && Object.keys(filter.prices).length) n++;
  n += (filter.brands || []).length;
  for (const v of Object.values(filter.selected_spec || {})) n += (v || []).length;
  for (const v of Object.values(filter.selected_variants || {})) n += (v || []).length;
  return n;
}

/** The filter the address carries (?filter=…), if any. */
export function fromRoute(query: any): ValeroFilter | null {
  try {
    return query?.filter ? JSON.parse(query.filter) : null;
  } catch {
    return null;
  }
}

/** A value as the shopper reads it: Selldone stores a variant's picture
 *  after a "|" in the value itself; a spec value in the visitor's language
 *  ("Fruit" is "Fruta" in Spanish). Display only: the value picked, sent
 *  and kept in the address stays the shop's own word. */
export function valueLabel(value: string): string {
  return shopText(String(value).split("|")[0].trim());
}

/* The names are read when drawn, in the visitor's language. */
export const SORTS = [
  {
    val: "bestselling",
    get name() {
      return t("valero.sort.bestselling", "Best selling");
    },
  },
  {
    val: "newest",
    get name() {
      return t("valero.sort.newest", "Newest");
    },
  },
  {
    val: "cheapest",
    get name() {
      return t("valero.sort.cheapest", "Price: low to high");
    },
  },
  {
    val: "most_expensive",
    get name() {
      return t("valero.sort.mostExpensive", "Price: high to low");
    },
  },
  {
    val: "most_popular",
    get name() {
      return t("valero.sort.mostLiked", "Most liked");
    },
  },
  {
    val: "most_visited",
    get name() {
      return t("valero.sort.mostViewed", "Most viewed");
    },
  },
];

/* The order a list keeps when no sort is picked: "Featured" in an aisle or
   a maker's shelf, "Best match" for a search. */
const FALLBACKS: Record<string, () => string> = {
  Featured: () => t("valero.sort.featured", "Featured"),
  "Best match": () => t("valero.sort.bestMatch", "Best match"),
};

export function sortName(val: string | null | undefined, fallback = "Featured"): string {
  return SORTS.find((s) => s.val === val)?.name || (FALLBACKS[fallback] ? FALLBACKS[fallback]() : fallback);
}
