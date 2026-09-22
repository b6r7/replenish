#!/usr/bin/env bash
# Produce a Quickhost-ready static bundle in out/ for a KNOWN presentation
# id. Next.js's `basePath` gets baked in so every asset URL and Link href
# is prefixed with `/viewer/<id>/` at build time — no runtime shims needed.
#
# Usage: bash scripts/build-for-quickhost.sh <presentation_id>
#   or set QH_PRESENTATION_ID in the environment.
#
# If the presentation id ever changes (fresh POST), rebuild with the new
# id and PUT-update — that's the only "bake" we need.
set -euo pipefail

cd "$(dirname "$0")/.."

PRES_ID="${1:-${QH_PRESENTATION_ID:-}}"
if [ -z "$PRES_ID" ]; then
  echo "Usage: $0 <presentation_id>   (or set QH_PRESENTATION_ID)" >&2
  exit 1
fi
BASE_PATH="/viewer/${PRES_ID}"
echo "Building for Quickhost with basePath=${BASE_PATH}"

echo "[1/6] Regenerate illustration manifest"
node scripts/inline-illustrations.mjs

echo "[2/6] Clean previous build"
rm -rf .next out

echo "[3/6] Build static export (basePath baked in)"
NEXT_PUBLIC_BASE_PATH="$BASE_PATH" NEXT_PUBLIC_STATIC_HTML_ROUTES="1" npx next build

echo "[4/6] Strip unused files"
rm -rf out/illustrations
find out -name "*.txt" -delete

echo "[5/6] Rename fonts .otf -> .ttf and prefix CSS url() refs with basePath"
( cd out/ds-fonts && for f in *.otf; do [ -e "$f" ] && mv "$f" "${f%.otf}.ttf"; done )
for css in out/_next/static/css/*.css; do
  # `globals.css` writes @font-face `url(/ds-fonts/...)` literally, so Next.js
  # doesn't prefix them with basePath. We do it here, and swap .otf -> .ttf
  # to match what Quickhost accepts.
  sed -i.bak -E "s|url\(/ds-fonts/([^)]+)\.otf\)|url(${BASE_PATH}/ds-fonts/\\1.ttf)|g" "$css"
  rm "${css}.bak"
done

echo "[6/6] Emit .html siblings and rewrite trailing-slash hrefs -> .html"

# 6a. Copy every out/PATH/index.html to a sibling out/PATH.html so hard
#     navigations to /viewer/<id>/PATH.html hit a real file.
while IFS= read -r -d '' idx; do
  rel="${idx#out/}"
  dir="${rel%/index.html}"
  [ "$dir" = "index.html" ] && continue
  cp "$idx" "out/${dir}.html"
done < <(find out -name "index.html" -print0)

# 6b. Strip any leftover injected <base> / bootstrap scripts from prior
#     build strategies. With basePath baked in we don't need either.
node - <<'NODE'
const fs = require("fs");
const path = require("path");
const walk = (dir) => fs.readdirSync(dir).flatMap((n) => {
  const p = path.join(dir, n);
  return fs.statSync(p).isDirectory() ? walk(p) : [p];
});
// Minified inline; kept human-readable in the source of truth below.
//
//   (function(){
//     var m = location.pathname.match(/^(\/viewer\/[^\/]+)/);
//     if (!m) return;                    // not on Quickhost — leave as is
//     var prefix = m[1];                 // "/viewer/<id>"
//     function fix(url){
//       if (typeof url !== "string") return url;
//       if (/^https?:/i.test(url)) return url;
//       // Already prefixed AND has a file extension — good as-is.
//       if (url.indexOf(prefix + "/") === 0 && /\.[a-z0-9]+(\?|#|$)/i.test(url)) return url;
//       // Split off query/hash so we can normalize just the path.
//       var q = url.search(/[?#]/); var suffix = q === -1 ? "" : url.slice(q);
//       var p = q === -1 ? url : url.slice(0, q);
//       // Strip a leading / if bare, then re-anchor onto the viewer prefix.
//       if (p.indexOf(prefix) === 0) p = p.slice(prefix.length);
//       if (p.charAt(0) !== "/") p = "/" + p;
//       if (p.slice(-1) === "/") p = p.slice(0, -1);
//       if (!/\.html?$/i.test(p)) p = p + ".html";
//       return prefix + p + suffix;
//     }
//     ["pushState","replaceState"].forEach(function(k){
//       var orig = history[k];
//       history[k] = function(state, title, url){
//         if (url == null) return orig.apply(this, arguments);
//         var fixed = fix(url);
//         if (fixed !== url) { location.assign(fixed); return; }
//         return orig.call(this, state, title, url);
//       };
//     });
//   })();
// Runtime shim: (1) strip the `/viewer/<id>` prefix and `.html` extension
// from every `location.pathname` read so Next.js's App Router matches its
// SSG'd routes (`/`, `/app/payments`, `/app/purchasing-power/intro`, …);
// (2) intercept every history.pushState / replaceState so any Next.js
// client-side nav that would leave the viewer prefix (or drop the `.html`)
// is forced through `location.assign` to a valid Quickhost URL.
// Source, formatted:
//
//   (function(){
//     var d = Object.getOwnPropertyDescriptor(Location.prototype, "pathname");
//     var origGet = d.get;
//     var raw = origGet.call(location);
//     var m = raw.match(/^\/viewer\/[^\/]+/);
//     if (!m) return;
//     var p = m[0];                                     // "/viewer/<id>"
//     Object.defineProperty(Location.prototype, "pathname", {
//       configurable: true, enumerable: true, set: d.set,
//       get: function(){
//         var v = origGet.call(this);
//         if (v.indexOf(p) !== 0) return v;
//         var s = v.slice(p.length);
//         if (/\.html?$/i.test(s)) s = s.replace(/\.html?$/i, "");
//         return s || "/";
//       }
//     });
//     function fix(u){
//       if (typeof u !== "string") return u;
//       if (u === "" || u.charAt(0) === "?" || u.charAt(0) === "#") return u;
//       if (/^https?:/i.test(u)) return u;
//       if (u.indexOf(p + "/") === 0 && /\.[a-z0-9]+(\?|#|$)/i.test(u)) return u;
//       var q = u.search(/[?#]/), s = q === -1 ? "" : u.slice(q), x = q === -1 ? u : u.slice(0, q);
//       if (x.indexOf(p) === 0) x = x.slice(p.length);
//       if (x.charAt(0) !== "/") x = "/" + x;
//       if (x === "/" || x === "") return p + "/" + s;
//       if (x.slice(-1) === "/") x = x.slice(0, -1);
//       if (!/\.html?$/i.test(x)) x = x + ".html";
//       return p + x + s;
//     }
//     ["pushState","replaceState"].forEach(function(k){
//       var o = history[k];
//       history[k] = function(a,b,u){
//         if (u == null) return o.apply(this, arguments);
//         var f = fix(u);
//         if (f === u) return o.call(this, a, b, u);
//         // Compare against the ACTUAL (un-overridden) URL so hydration
//         // no-op syncs don't loop-reload.
//         var actual = origGet.call(location) + location.search + location.hash;
//         if (f === actual) return o.call(this, a, b, f);
//         location.assign(f);
//       };
//     });
//   })();
let cleaned = 0;
for (const f of walk("out")) {
  if (!f.endsWith(".html")) continue;
  let html = fs.readFileSync(f, "utf8");
  const before = html;
  // Strip legacy runtime shims from earlier strategies (idempotent).
  html = html.replace(/<script>\(function\(\)\{try\{var m=location\.pathname[^<]*<\/script>/g, "");
  html = html.replace(/<script>\(function\(\)\{var m=location\.pathname[^<]*<\/script>/g, "");
  html = html.replace(/<script>\(function\(\)\{var dP=Object[^<]*<\/script>/g, "");
  html = html.replace(/<base href="[^"]*">/g, "");
  if (html !== before) { fs.writeFileSync(f, html); cleaned += 1; }
}
console.log(`Cleaned legacy shims from ${cleaned} HTML files (if any).`);
NODE

# 6c. Rewrite every internal trailing-slash href to its `.html` sibling so
#     Quickhost can serve it. IMPORTANT: leave the root link `${BASE_PATH}/`
#     alone (it maps to `index.html`, Quickhost serves it fine) and skip any
#     value that contains a `.` (asset URLs).
BASE_PATH="$BASE_PATH" node - <<'NODE'
const fs = require("fs");
const path = require("path");
const BASE_PATH = process.env.BASE_PATH;
const walk = (dir) => fs.readdirSync(dir).flatMap((n) => {
  const p = path.join(dir, n);
  return fs.statSync(p).isDirectory() ? walk(p) : [p];
});
// Match href="..." or action="..." where value ends in `/` (optionally
// followed by ?query or #hash) and contains no `.` in the pre-slash part.
const RE = /(href|action)="([^".?#]+)\/(\?[^"]*|#[^"]*)?"/g;
let touched = 0;
for (const f of walk("out")) {
  if (!f.endsWith(".html")) continue;
  let html = fs.readFileSync(f, "utf8");
  const next = html.replace(RE, (m, attr, pathPart, tail = "") => {
    // Preserve the app root link — `${BASE_PATH}/` serves out/index.html.
    if (pathPart === BASE_PATH || pathPart === "") return m;
    return `${attr}="${pathPart}.html${tail}"`;
  });
  if (next !== html) { fs.writeFileSync(f, next); touched += 1; }
}
console.log(`Rewrote trailing-slash hrefs -> .html in ${touched} HTML files.`);
NODE

echo "Done. Extensions in out/:"
find out -type f | awk -F. '{print $NF}' | sort | uniq -c
du -sh out
