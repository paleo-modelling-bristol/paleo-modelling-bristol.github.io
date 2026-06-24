import type { NextConfig } from "next";

// The site is built as a fully static export (HTML/CSS/JS) for GitHub Pages.
// Docs: https://nextjs.org/docs/app/guides/static-exports
//
// BASE_PATH:
//   - Empty for a user/organisation site served at the domain root, i.e.
//     https://paleo-modelling-bristol.github.io  (BASE_PATH unset).
//   - Set to "/repo-name" when hosting under a *project* page, e.g. when testing
//     on a personal account at https://<user>.github.io/<repo>  (BASE_PATH=/<repo>).
const basePath = process.env.BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  // Emit /about/index.html instead of /about.html so GitHub Pages serves clean
  // URLs without any server-side rewrite rules.
  trailingSlash: true,
  // basePath only when hosting under a sub-path; omitted (root) by default.
  ...(basePath ? { basePath } : {}),
  images: {
    // GitHub Pages has no image-optimization server; images are pre-compressed
    // to WebP and committed, so serve them as-is.
    unoptimized: true,
  },
};

export default nextConfig;
