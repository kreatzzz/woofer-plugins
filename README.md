# Woofer Plugins

The catalog and the site for [Woofer](https://github.com/kreatzzz/woofer)
plugins, live at [usewoofer.com](https://usewoofer.com). Hand-written
static: three HTML pages, one stylesheet, one script — no build step, no
framework.

## Shape

    index.html      the landing page: download first, the feature grid, and the plugin teaser
    plugins.html    the catalog, rendered from registry.json
    guide.html      getting started, lyrics, plugins — one page
    registry.json   the catalog the site renders and the app's deep links trust
    plugins/<id>/   one folder per plugin: plugin.wasm + the manifest.json it was built from
    main.js         renders the cards from registry.json
    style.css       the brand: dark, green, pill buttons, quiet grays

## registry.json

The whole catalog is one JSON file: an `api` version, an `updated` date,
and one entry per plugin. The app pins the digests, so `sha256`, `wasm`,
and `size` are never edited by hand after the fact.

| Field | What it is |
| --- | --- |
| `api` | the plugin ABI version the catalog targets; the host refuses anything newer |
| `updated` | the date of the last reviewed change, shown in the catalog footer |
| `id` | the plugin's identifier; the `woofer://install?plugin=<id>` deep link uses it |
| `name` | the display name on the card |
| `publisher` | who maintains it |
| `version` | the plugin's own version |
| `category` | the chip on the card ("Providers" for the data providers so far) |
| `description` | the card copy — what it does, honestly |
| `capabilities` | the host capabilities it answers (e.g. `translation-provider:translate`) |
| `domains` | every host the plugin may ask Woofer to fetch from, enforced by the host |
| `homepage` | where the readable source lives |
| `wasm` | the served path of the module, e.g. `/plugins/translate/plugin.wasm` |
| `size` | the wasm's size in bytes, shown as KB |
| `sha256` | the digest of the exact committed wasm; re-verified by the app at install and on every launch |

## Publishing a plugin

Fork, add `plugins/<your-id>/` (wasm, manifest, README) and a
`registry.json` entry, open a pull request. CI checks the schema, the
digest, the api version, and the declared domains; a human reads your
source link and your manifest before anything is listed. The whole flow,
checks, and what a reviewer looks for: [CONTRIBUTING.md](CONTRIBUTING.md).

## Deploying the site

The site is static. On Vercel: import this repository, framework
"Other", deploy — the three HTML pages and `registry.json` are the whole
story. With the CLI instead: `vercel --prod` from this folder.

The catalog lives at [usewoofer.com](https://usewoofer.com): in the
Vercel project, Settings → Domains → add `usewoofer.com`, then point the
domain's DNS at Vercel — an `A` record for the apex (`76.76.21.21`) and
a `CNAME` for `www` (`cname.vercel-dns.com`). Vercel provisions the
certificate once the records resolve.

## Authoring a plugin

A plugin is one `wasm32-unknown-unknown` module built with the
[`woofer-plugin-sdk`](https://github.com/kreatzzz/woofer/tree/main/plugins/sdk)
in the main repository: two pure functions — `plan` decides what to
fetch, `fulfil` reads what came back — and a manifest declaring the
domains it needs. The SDK wires the ABI and the offline test harness;
[`plugins/README.md`](https://github.com/kreatzzz/woofer/blob/main/plugins/README.md)
in the main repository is the handbook, and
[`docs/plugins.md`](https://github.com/kreatzzz/woofer/blob/main/docs/plugins.md)
is the design.
