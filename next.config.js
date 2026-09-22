/** @type {import('next').NextConfig} */
// Quickhost (SPCS) serves each presentation under
// /viewer/<presentation_id>/. Next.js emits absolute paths for `_next/*`
// assets and internal <Link> hrefs, so without a matching basePath every
// asset 404s and the whole app renders unstyled.
//
// Set NEXT_PUBLIC_BASE_PATH="/viewer/<id>" at build time to bake it in.
// Leave it unset for local dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

const nextConfig = {
  reactStrictMode: true,
  // Static HTML export so the prototype can be hosted on Affirm's Quickhost
  // (Snowflake SPCS), which serves static files only.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Quickhost assigns each POST a fresh presentation id, so we CAN'T bake
  // `/viewer/<id>/` into the bundle. Instead we ship with no prefix and
  // let a tiny bootstrap script in <head> compute the current viewer prefix
  // from `location.pathname` and set `<base href=...>` before Next.js loads.
  // A post-build pass rewrites all root-anchored refs to root-relative so
  // the `<base>` tag actually catches them.
  basePath,
  assetPrefix: basePath || undefined,
  experimental: {
    typedRoutes: false
  }
}

module.exports = nextConfig
