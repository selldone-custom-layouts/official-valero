// Valero (design D), second pass after valero-darken.mjs: every remaining
// light tint (pinks, creams, pale blues of Tario's and Kalio's light pages).
// As a background it becomes a dark surface; as text (it sat on a coloured
// button that is ivory now) the dark "on action" colour; anywhere else (a
// border, a ring, a shadow) a hairline.
// usage: node scripts/valero-darken-tints.mjs <file.scss> [...]
import fs from "fs";

const lum = (hex) => {
  const h = hex.length === 4 ? hex.slice(1).split("").map((c) => c + c).join("") : hex.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const f = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

let total = 0;
for (const file of process.argv.slice(2)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let n = 0;
  const out = lines.map((line) => {
    if (/^\s*(\/\*|\*|\/\/)/.test(line)) return line;
    return line.replace(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-zA-Z])/g, (hex) => {
      if (lum(hex) < 0.55) return hex;
      n++;
      const prop = (line.match(/^\s*([a-z-]+)\s*:/) || [])[1] || "";
      if (/^background/.test(prop)) return "var(--k-raise)";
      if (prop === "color" || prop === "fill" || prop === "-webkit-text-fill-color") return "var(--k-on-green)";
      return "var(--k-line)";
    });
  });
  fs.writeFileSync(file, out.join("\n"));
  total += n;
  console.log(String(n).padStart(4), file);
}
console.log("total", total);
