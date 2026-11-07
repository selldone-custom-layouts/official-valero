/*
 * Kalio — typefaces.
 *
 * Fraunces sets the headings, DM Sans everything else. They are requested
 * from the app at start-up rather than from index.html: in production the
 * Layout runs inside the HTML Selldone renders for the shop, and index.html
 * never reaches the visitor — Market Hall's fonts, linked there, only ever
 * loaded on the dev server. Roboto stays where Selldone's page asks for it;
 * Vuetify components name it.
 */

const FONTS_HREF =
  "https://fonts.googleapis.com/css2" +
  "?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500" +
  "&family=Jost:wght@300..600" +
  "&display=swap";

function addLink(attrs: Record<string, string>) {
  if (document.head.querySelector(`link[href="${attrs.href}"]`)) return;
  const link = document.createElement("link");
  Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
  document.head.appendChild(link);
}

addLink({ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" });
addLink({ rel: "stylesheet", href: FONTS_HREF });
