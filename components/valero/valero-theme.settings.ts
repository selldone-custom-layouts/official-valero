/*
 * Valero's theme: the one file to edit (for a merchant, or the merchant's AI).
 *
 * These settings are the Layout's designed default on any shop, painted
 * before the first paint. On a shop that does not show the visitor switcher
 * (see themeSwitcher) they are the only theme. After a change: build and
 * upload (bash scripts/release.sh <new-version> desk), see AGENTS.md "Theme".
 *
 * palette        one of: "ivory" (Valero ivory on black, the default),
 *                "gold", "emerald", "sapphire", "rose"
 * brandColor     any colour, "#RRGGBB"; when set it replaces `palette` (the
 *                colour is made readable automatically: buttons, links, both modes)
 * mode           "dark" (Valero is black: the default) | "light" (an ivory page)
 * themeSwitcher  "showcase" (the visitor switcher only on Valero's own showcase
 *                shop, the default) | "on" (your visitors get it) | "off"
 * textOnBrand    with brandColor: "auto" (a light brand such as yellow keeps
 *                its colour, with dark words on its buttons) |
 *                "white" (white words; a light colour is darkened until they read)
 */
import type { ThemeSettings } from "../theme-switcher/theme-switcher";

export const THEME_SETTINGS: ThemeSettings = {
  palette: "ivory",
  // brandColor: "#F5C400",
  mode: "dark",
  themeSwitcher: "showcase",
  textOnBrand: "auto",
};
