/* The compare page's words and choices in Valero (8 November 2026).
   KalioCompare.vue is the same in every molino Layout; this file and
   style/kalio-compare.scss are what make it this Layout's own.
   The words are getters, so they follow the visitor's language. */
import { t } from "../i18n/kalio-i18n";

export const SKIN = {
  /** The page's heading (and the tab's title). */
  get title(): string {
    return t("compare.title", "Side by side");
  },
  /** A small line over the heading, or none. */
  get eyebrow(): string | null {
    return t("valero.compare.eyebrow", "The comparison");
  },
  /** Under "Your picks", beside the pinned cards. */
  get hint(): string {
    return t("compare.hint", "They stay above while you read on. Remove one with ×.");
  },
  /** "switch": one Only differences switch; "segmented": Everything / Only differences. */
  toggle: "segmented" as "switch" | "segmented",
  get emptyTitle(): string {
    return t("compare.empty.title", "Nothing on the table yet.");
  },
  get browse(): string {
    return t("compare.empty.browse", "Browse the aisles");
  },
  get shareTitle(): string {
    return t("compare.shareTitle", "Share this comparison");
  },
  /** The Layout's mark in the share card and on the empty page (else an icon). */
  mark: true,
  /** Number the groups 01, 02, … */
  numbered: true,
};
