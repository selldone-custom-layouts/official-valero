/*
 * Valero — the theme switcher's config (the header's "Theme" link: the
 * owner's rule of 9 November 2026, the same on every molino Layout as on
 * Digito and Besti).
 *
 * Valero is dark first: black floor, ivory type, the action colour is ivory
 * with black words, gold for the small accents. Its stylesheets were turned
 * into --k-* tokens when it was made (scripts/valero-darken*.mjs), and its
 * :root holds the dark values; so Dark is Valero as designed, and Light is
 * the same tokens on an ivory page (config.light). In dark mode every
 * palette keeps Valero's way: a light action colour with black words. In
 * light mode the action colour is deep, with white words.
 *
 * Contrast (WCAG 2.1, measured): white on each light primary — ivory (black)
 * 19.67, gold 6.20, emerald 6.99, sapphire 6.70, rose 8.02. Black on each
 * dark primary — 17.44, 8.79, 12.91, 10.91, 10.40, each 8:1 or more against
 * the dark card #151516.
 */
import type { ThemeSwitcherConfig } from "../theme-switcher/theme-switcher";
import { THEME_SETTINGS } from "./valero-theme.settings";

export const VALERO_THEME: ThemeSwitcherConfig = {
  settings: THEME_SETTINGS,

  /* The owner (9 November 2026): a merchant who imports Valero into their
     own shop must not see the switcher. With themeSwitcher "showcase" it
     shows only on these shops (window.shop.id, else <meta name="shop-name">). */
  showcaseShops: [
    { id: 15549, name: "digini-hzgablru" }, // Digini: Digito, Besti
    { id: 15645, name: "molino" }, // Molino: Molino, Tario, Walio, Dino, Valero
  ],

  storageKey: "valero-theme",
  darkClass: "vl-dark",
  defaultMode: "dark",

  palettes: [
    {
      id: "ivory",
      name: "Ivory",
      light: { primary: "#0b0b0c", deep: "#2a2a2c", soft: "#f1ece2", onPrimary: "#ffffff", text: "#0b0b0c", accent: "#7a5c28" },
      dark: { primary: "#f4f1ea", deep: "#ffffff", soft: "#241f17", onPrimary: "#0b0b0c", text: "#f4f1ea", accent: "#c9a96e" },
    },
    {
      id: "gold",
      name: "Gold",
      light: { primary: "#7a5c28", deep: "#5e461d", soft: "#f5eedf", onPrimary: "#ffffff", text: "#7a5c28", accent: "#7a5c28" },
      dark: { primary: "#c9a96e", deep: "#d9bd88", soft: "#2a2318", onPrimary: "#0b0b0c", text: "#c9a96e", accent: "#c9a96e" },
    },
    {
      id: "emerald",
      name: "Emerald",
      light: { primary: "#05664a", deep: "#064e3b", soft: "#e3f6ee", onPrimary: "#ffffff", text: "#05664a", accent: "#7a5c28" },
      dark: { primary: "#6ee7b7", deep: "#a7f3d0", soft: "#12261f", onPrimary: "#0b0b0c", text: "#6ee7b7", accent: "#c9a96e" },
    },
    {
      id: "sapphire",
      name: "Sapphire",
      light: { primary: "#1d4ed8", deep: "#1e40af", soft: "#eaf0fe", onPrimary: "#ffffff", text: "#1d4ed8", accent: "#7a5c28" },
      dark: { primary: "#93c5fd", deep: "#bfdbfe", soft: "#141d2b", onPrimary: "#0b0b0c", text: "#93c5fd", accent: "#c9a96e" },
    },
    {
      id: "rose",
      name: "Rose",
      light: { primary: "#9f1239", deep: "#881337", soft: "#fdecef", onPrimary: "#ffffff", text: "#9f1239", accent: "#7a5c28" },
      dark: { primary: "#fda4af", deep: "#fecdd3", soft: "#2a1519", onPrimary: "#0b0b0c", text: "#fda4af", accent: "#c9a96e" },
    },
  ],

  /* Palette value -> the Kalio variables that carry it. In Valero
     --k-green is the action colour (ivory when dark) and --k-on-green the
     words on it; --v-link carries the action colour as words. */
  tokens: {
    "--k-green": "primary",
    "--k-green-deep": "deep",
    "--k-green-lift": "deep",
    "--k-green-soft": "soft",
    "--k-on-green": "onPrimary",
    "--v-link": "text",
    "--v-primary-rgb": "primary:rgb",
    "--v-on-brand-rgb": "onPrimary:rgb",
    /* The dark mode's action colour, for the parts that stay dark in light
       mode (the hero on its photo). */
    "--v-primary-dark": "dark.primary",
    "--v-on-primary-dark": "dark.onPrimary",
    "--v-link-dark": "dark.text",
    "--v-accent-dark": "dark.accent",
    "--k-gold": "accent",
    "--k-leaf": "accent",
  },

  /* While dark: Valero as designed (its :root values), so nothing to set. */
  dark: {},

  /* While light: the same tokens on an ivory page. */
  light: {
    "--k-ink": "#121212",
    "--k-ink-2": "#2e2c28",
    "--k-muted": "#6b665c",
    "--k-paper": "#faf8f3",
    "--k-wash": "#f1ede4",
    "--k-card": "#ffffff",
    "--k-raise": "#f4f1ea",
    "--k-line": "rgba(11, 11, 12, 0.14)",
    "--k-line-strong": "rgba(11, 11, 12, 0.32)",
    "--k-line-soft": "rgba(11, 11, 12, 0.08)",
    "--k-coral": "#8a4b00",
    "--k-coral-soft": "rgba(138, 75, 0, 0.1)",
    "--k-amber": "#8a5800",
    "--k-star-off": "#8f8a80",
  },

  vuetify: {
    light: "light",
    dark: "dark",
    paletteColors: { primary: "primary", "on-primary": "onPrimary" },
    /* Valero's black: Selldone's fields, menus, dialogs and sheets are dark
       too, not white islands on a black page. */
    darkColors: {
      background: "#0b0b0c",
      surface: "#151516",
      "surface-bright": "#1d1d1f",
      "surface-variant": "#2a2a2c",
      "on-background": "#f4f1ea",
      "on-surface": "#f4f1ea",
      "on-surface-variant": "#d9d4ca",
      secondary: "#c9a96e",
      "on-secondary": "#0b0b0c",
      accent: "#c9a96e",
      error: "#e07a6a",
      info: "#c9a96e",
      success: "#8fbf8a",
      warning: "#e2b97a",
    },
    lightColors: {
      background: "#faf8f3",
      surface: "#ffffff",
      "on-background": "#121212",
      "on-surface": "#121212",
      secondary: "#7a5c28",
      "on-secondary": "#ffffff",
      error: "#c4122f",
    },
  },

  metaThemeColor: false,
  ui: { ink: "var(--k-ink)", muted: "var(--k-muted)", line: "var(--k-line)", surface: "var(--k-card)", font: "var(--k-body)" },
  labels: { theme: "Theme", palettes: "Colour", mode: "Light or dark", modeTitle: "Mode", light: "Light", dark: "Dark", custom: "Custom colour", adjusted: "Adjusted for readability", brand: "Brand colour" },

  /* "Custom colour" (the owner, 9 November 2026): any colour, made readable
     by paletteFromColor() against Valero's own surfaces. */
  custom: {
    headerContrast: 4.5,
    darkSurfaces: ["#0b0b0c", "#151516", "#1d1d1f"],
    lightSurfaces: ["#ffffff", "#faf8f3"],
    darkText: "#0b0b0c",
    extras: (_v, mode) => ({ accent: mode === "light" ? "#7a5c28" : "#c9a96e" }),
  },
};
