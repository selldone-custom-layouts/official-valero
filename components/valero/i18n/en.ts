/*
 * Valero's own words, in English (the shop's first language). Another
 * language is a file beside this one with the same keys (da.ts…), added to
 * index.ts when the owner enables that language in the shop; a missing key
 * falls back to English. Use them through t() from the region switcher.
 */
export const en: Record<string, string> = {
  // The region switcher (the strip's pill, its panel, the phone row and sheet)
  "region.title": "Language & currency",
  "region.language": "Language",
  "region.currency": "Currency",
  "region.done": "Done",
  "region.close": "Close",
  "region.note": "Prices everywhere change at once: cards, filters, the bag and checkout.",
};
