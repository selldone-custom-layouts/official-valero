// Valero (design D): turns the hard-coded light colours that Kalio's and
// Tario's styles were written with into Valero's dark tokens, so the shared
// stylesheets follow the black theme. Run once on the copied styles; kept
// for the record: node scripts/valero-darken.mjs <file.scss> [...]
import fs from "fs";

const B = String.raw`(?![0-9a-zA-Z])`; // end of a colour word
const W = String.raw`(?:#fff(?:fff)?|white)` + B;
const DARK = String.raw`(?:#1f1f1f|#1a1a1a|#111(?:111)?|#000(?:000)?|#222(?:222)?|black)` + B;
const LIGHTBG = String.raw`(?:#f7f7f7|#f5f5f5|#f2f2f2|#f4f4f4|#f6f6f6|#fafafa|#f0f0f0|#eee(?:eee)?|#ececec|#e9e9e9|#f8f8f8|#fdeeee|#fff1e0|#e7f4ea|#fff5f5|#fff8f0)` + B;
const LINES = String.raw`(?:#e3e3e3|#e6e6e6|#ddd(?:ddd)?|#d6d6d6|#cfcfcf|#ccc(?:ccc)?|#c9c9c9|#e0e0e0|#d9d9d9|#dadada|#e8e8e8|#bdbdbd)` + B;
const INK = String.raw`(?:#333(?:333)?|#2b2b2b|#3a3a3a|#444(?:444)?)` + B;
const MUTED = String.raw`(?:#555(?:555)?|#666(?:666)?|#757575|#777(?:777)?|#888(?:888)?|#6b6b6b|#4a4a4a|#999(?:999)?)` + B;
const BG = String.raw`(background(?:-color)?[ \t]*:[ \t]*)`;
const COLOR = String.raw`((?:^|[ \t;{])color[ \t]*:[ \t]*)`;

const rules = [
  [new RegExp(BG + W, "gi"), "$1var(--k-card)"],
  [new RegExp(BG + DARK, "gi"), "$1var(--k-green)"],
  [new RegExp(BG + LIGHTBG, "gi"), "$1var(--k-raise)"],
  [new RegExp(COLOR + W, "gim"), "$1var(--k-on-green)"],
  [new RegExp(COLOR + DARK, "gim"), "$1var(--k-ink)"],
  [new RegExp(COLOR + INK, "gim"), "$1var(--k-ink-2)"],
  [new RegExp(COLOR + MUTED, "gim"), "$1var(--k-muted)"],
  [new RegExp(LINES, "gi"), "var(--k-line-strong)"],
  [new RegExp(LIGHTBG, "gi"), "var(--k-raise)"],
  [new RegExp(String.raw`#fff(?:fff)?` + B, "gi"), "var(--k-paper)"],
];

let total = 0;
for (const file of process.argv.slice(2)) {
  let text = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const [re, to] of rules) {
    text = text.replace(re, (...m) => {
      n++;
      return to.replace("$1", m[1] && typeof m[1] === "string" ? m[1] : "");
    });
  }
  fs.writeFileSync(file, text);
  total += n;
  console.log(String(n).padStart(4), file);
}
console.log("total", total);
