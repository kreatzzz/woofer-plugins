# Contributing a plugin

The catalog is approval-only: nothing reaches usewoofer.com without a
reviewed pull request. The sandbox contains a plugin; the review keeps
the catalog honest.

## What a plugin PR adds

A pull request that creates two things:

    plugins/<your-id>/
      plugin.wasm      the built module (wasm32-unknown-unknown, no imports)
      manifest.json    the manifest the module was built from
      README.md        what it does, in a sentence or three

and one appended entry in `registry.json` (the schema is documented in
the README). The wasm's `sha256` goes in the entry, computed from the
exact file you commit:

    shasum -a 256 plugins/<your-id>/plugin.wasm

## What CI and the review check

- **The registry parses** and the entry carries every field.
- **The digest is honest.** `sha256` must match `plugin.wasm` byte for
  byte. The app re-verifies it at install and on every launch, so a
  wrong digest is a plugin that never installs.
- **The api version is current** (1 at the moment). The host refuses
  anything newer than itself.
- **The manifest matches the module.** What `manifest.json` says must
  agree with what the module's own `manifest()` answers.
- **The domains are declared and justified.** Every fetch a plugin makes
  goes through the host, which enforces the manifest's `domains`. A
  plugin can only ask; the manifest is where it asks. Fewer is better.
- **The size is sane.** The sandbox caps memory at 64 MB and responses
  at 5 MB; a module an order of magnitude larger than its neighbours
  will be asked why.

## The review, in plain words

A human reads your source link and your manifest before anything is
listed. Concretely, a reviewer will:

- follow the `homepage` link and expect real, readable source that
  builds this wasm;
- read the manifest and expect it to declare only what the plugin uses;
- read the card description and expect it to match what the plugin does;
- check that nothing lies about its identity — no borrowed names, no
  surprise domains.

If it all checks out, the merge is the approval: the site picks the new
entry up on the next deploy, and **Open in Woofer** works from your
card.

## Building the module

Plugins are written against the `woofer-plugin-sdk` in the
[main repository](https://github.com/kreatzzz/woofer), which wires the
ABI and runs the module offline on the same interpreter the host uses.
`plugins/README.md` there is the handbook: the two pure functions
(`plan` decides what to fetch, `fulfil` reads what came back), the test
harness, and the build commands.
