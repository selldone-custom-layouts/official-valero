/*
 * The shop's own data in the visitor's language, for the parts Selldone does
 * not translate itself (11 November 2026, the owner: a Spanish shopper who
 * reads no English must understand every page, with no slips).
 *
 * Selldone translates per language on its own server (the request's
 * x-localization header): product names (title, title_en), category names
 * and descriptions, and each product's article (one article per language).
 * Those are written in the shop (Selldone's translation and article APIs).
 * It has no translation for a product's spec table, its pros and cons, its
 * rating names or its sale unit ("per pack"). Those come from a dictionary
 * per language here, data/<lang>.json (the English text → the translation),
 * fetched only when a visitor picks that language, and applied to every
 * product in an API response before anything (our components or Selldone's)
 * draws it.
 *
 * The English stays on the product for code that reads English words:
 * _spec_en (the price per unit looks for "Net Weight", "Pack Size") and
 * _unit_en. A string the dictionary does not know is shown as it is.
 *
 * Only objects that are products are touched (an id, a title and a price),
 * so a filter's own spec values, which go back to the server as they are,
 * never change.
 */
import { currentLanguage } from "../../region-switcher/region";

type Dict = Record<string, string>;

const LOADERS: Record<string, () => Promise<{ default: Dict } | Dict>> = {
  es: () => import("./data/es.json"),
};
const dicts: Record<string, Dict> = {};
const loading: Record<string, Promise<Dict>> = {};

function dictFor(lang: string): Promise<Dict> | null {
  if (dicts[lang]) return Promise.resolve(dicts[lang]);
  const load = LOADERS[lang];
  if (!load) return null;
  if (!loading[lang])
    loading[lang] = load()
      .then((m: any) => (dicts[lang] = (m && m.default) || m || {}))
      .catch(() => (dicts[lang] = {}));
  return loading[lang];
}

function tr(d: Dict, s: any): any {
  if (typeof s !== "string") return s;
  const hit = d[s] ?? d[s.trim()];
  return hit === undefined ? s : hit;
}

function isProduct(o: any): boolean {
  return o && typeof o === "object" && !Array.isArray(o) && "id" in o && "title" in o && ("price" in o || "final_price" in o || "spec" in o);
}

function translateProduct(p: any, d: Dict): void {
  if (p.__kalioLang) return;
  p.__kalioLang = true;
  const spec = p.spec;
  if (spec && typeof spec === "object" && !Array.isArray(spec)) {
    p._spec_en = spec;
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(spec)) out[tr(d, k)] = v === "group" ? v : Array.isArray(v) ? v.map((x) => tr(d, x)) : tr(d, v);
    p.spec = out;
    if (Array.isArray(p.spec_order)) {
      p._spec_order_en = p.spec_order;
      p.spec_order = p.spec_order.map((k: string) => tr(d, k));
    }
  }
  for (const f of ["pros", "cons"]) {
    const o = p[f];
    if (o && typeof o === "object" && !Array.isArray(o)) {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(o)) out[tr(d, k)] = tr(d, v);
      p[f] = out;
    }
  }
  if (Array.isArray(p.ratings)) for (const r of p.ratings) if (r && typeof r.name === "string") r.name = tr(d, r.name);
  if (typeof p.unit === "string" && p.unit) {
    p._unit_en = p.unit;
    p.unit = tr(d, p.unit);
  }
}

/* Selldone's own translations, where an endpoint sends them without using
   them: products/list (the compare page, rails) and the category lists send
   `translations: { es: { title, title_en, description } }` beside the
   English, while products/<id>/info already answers in the language. The
   English stays as _<field>_en. Any language, dictionary or not. */
const NATIVE = ["title", "title_en", "description"];
function applyNative(o: any, lang: string): void {
  const t = o.translations;
  const own = t && typeof t === "object" && !Array.isArray(t) ? t[lang] : null;
  if (!own || typeof own !== "object" || o.__kalioNative === lang) return;
  o.__kalioNative = lang;
  for (const f of NATIVE) {
    const v = own[f];
    if (typeof v === "string" && v.trim() && typeof o[f] === "string") {
      if (!(`_${f}_en` in o)) o[`_${f}_en`] = o[f];
      o[f] = v;
    }
  }
}

function walk(node: any, d: Dict | null, lang: string, depth = 0): void {
  if (!node || typeof node !== "object" || depth > 8) return;
  if (Array.isArray(node)) {
    for (const n of node) walk(n, d, lang, depth + 1);
    return;
  }
  if ("translations" in node) applyNative(node, lang);
  if (d && isProduct(node)) translateProduct(node, d);
  for (const [k, v] of Object.entries(node)) if (k !== "translations" && v && typeof v === "object") walk(v, d, lang, depth + 1);
}

/** Puts the shop's data in the visitor's language in every API response (any language but English). */
export function installShopData(axios: any): void {
  if (!axios?.interceptors?.response) return;
  axios.interceptors.response.use(async (res: any) => {
    try {
      const lang = currentLanguage();
      if (!lang || lang === "en" || !res || !res.data || typeof res.data !== "object") return res;
      const d = LOADERS[lang] ? await dictFor(lang) : null;
      walk(res.data, d && Object.keys(d).length ? d : null, lang);
    } catch (e) {
      /* never stop a response over a missing word */
    }
    return res;
  });
  /* Fetch the dictionary early when the visitor already reads that language. */
  dictFor(currentLanguage());
}

/** A shop string (a unit, a spec word) in the visitor's language, once the dictionary is in. */
export function shopText(s: string): string {
  const d = dicts[currentLanguage()];
  return d ? tr(d, s) : s;
}
