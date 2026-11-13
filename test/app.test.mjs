import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../dist/app.js", import.meta.url), "utf8");
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");

test("is wired to Quest 19183 and six cross-lab models", () => {
  assert.match(html, /Quest #19183/);
  assert.equal((js.match(/id: \"[^\"]+\"/g) || []).length, 6);
  for (const lab of ["OpenAI", "DeepSeek", "Z.ai", "NVIDIA", "Meta", "Moonshot"]) assert.match(js, new RegExp(lab.replace('.', '\\.')));
});

test("every model receives one identical question and option pair", () => {
  assert.match(js, /MODELS\.map\(\(model\) => askModel\(model, data\)\)/);
  assert.match(js, /The wording above is identical for every respondent/);
});

test("live reveal uses BYOP and a direct-click spending guard", () => {
  assert.match(js, /Authorization: `Bearer \$\{connect\.apiKey\}`/);
  assert.match(js, /event\.isTrusted/);
  assert.match(html, /temporary Pollinations key/);
});

test("ships a zero-Pollen demo and code-computed forecast score", () => {
  assert.match(html, /ZERO-POLLEN DEMO/);
  assert.match(js, /100 - Math\.abs\(forecast - aShare\) \* 2/);
});

test("ships the Pollinations badge without a secret key", () => {
  assert.match(readme, /badge-made-with\.svg/);
  assert.doesNotMatch(`${html}\n${js}`, /sk_[A-Za-z0-9_-]+/);
});
