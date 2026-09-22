#!/usr/bin/env bash
# Build the prototype as a static export for GitHub Pages.
#
# Unlike Quickhost, GH Pages serves `/foo/index.html` for `/foo/` requests
# out of the box, so we can rely on Next.js's plain trailing-slash export
# with no `.html` sibling emission, no runtime shims, no ForceHardNav.
#
# Usage: bash scripts/build-for-gh-pages.sh [repo-name]
#   repo-name defaults to "replenish" — set it to whatever the GitHub
#   repo is called (that becomes the basePath under user.github.io/<repo>).
set -euo pipefail

cd "$(dirname "$0")/.."

REPO="${1:-replenish}"
BASE_PATH="/${REPO}"
echo "Building for GitHub Pages with basePath=${BASE_PATH}"

echo "[1/4] Regenerate illustration manifest"
node scripts/inline-illustrations.mjs

echo "[2/4] Clean previous build"
rm -rf .next out

echo "[3/4] Static export (basePath baked in, no Quickhost shims)"
# NEXT_PUBLIC_STATIC_HTML_ROUTES intentionally unset — GH Pages doesn't
# need `.html` rewriting or hardNav.
NEXT_PUBLIC_BASE_PATH="$BASE_PATH" npx next build

echo "[4/4] Prefix @font-face url() paths with basePath (globals.css uses"
echo "      literal '/ds-fonts/...' which Next.js doesn't rewrite)"
for css in out/_next/static/css/*.css; do
  sed -i.bak -E "s|url\(/ds-fonts/|url(${BASE_PATH}/ds-fonts/|g" "$css"
  rm "${css}.bak"
done

# GH Pages ignores files/folders starting with `_` unless a .nojekyll marker
# is present at the site root. Next.js writes everything under `_next/`, so
# without this the entire JS/CSS bundle 404s.
touch out/.nojekyll

echo "Done. Extensions in out/:"
find out -type f | awk -F. '{print $NF}' | sort | uniq -c
du -sh out
