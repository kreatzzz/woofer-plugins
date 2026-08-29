# Woofer Plugins

The catalog of sandboxed plugins for
[Woofer](https://github.com/kreatzzz/woofer), served at the site this
repository deploys.

## Shape

- `registry.json` — the catalog the site and the app read: api version,
  updated date, and one entry per plugin (manifest fields, wasm address,
  size, sha256).
- `plugins/<id>/` — one folder per plugin: `plugin.wasm`, the
  `manifest.json` it was built from, and (as it grows) its README.

## Proposing a plugin

Open a pull request that adds `plugins/<your-id>/` and a `registry.json`
entry. A plugin is one wasm module built against
[`woofer-plugin-sdk`](https://github.com/kreatzzz/woofer) with the two
pure functions the ABI asks for — `plan` decides what to fetch, `fulfil`
reads what came back — plus a manifest declaring the domains it needs.
Every merge is reviewed by hand: the sandbox contains a plugin, the
review keeps the catalog honest.

## Deploying the site

The site is static. On Vercel: import this repository, framework
"Other", deploy — `index.html` and `registry.json` are the whole story.
With the CLI instead: `vercel --prod` from this folder.

The catalog lives at [usewoofer.com](https://usewoofer.com): in the
Vercel project, Settings → Domains → add `usewoofer.com`, then point
the domain's DNS at Vercel — an `A` record for the apex
(`76.76.21.21`) and a `CNAME` for `www` (`cname.vercel-dns.com`).
Vercel provisions the certificate once the records resolve.
