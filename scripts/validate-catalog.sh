#!/usr/bin/env bash
set -euo pipefail

registry="${1:-registry.json}"
jq -e '.api == 1 and (.plugins | type == "array")' "$registry" >/dev/null

duplicates="$(jq -r '.plugins[].id' "$registry" | sort | uniq -d)"
if [[ -n "$duplicates" ]]; then
  echo "duplicate plugin ids: $duplicates" >&2
  exit 1
fi

while IFS= read -r encoded; do
  entry="$(printf '%s' "$encoded" | base64 --decode)"
  id="$(jq -r '.id' <<<"$entry")"
  if [[ ! "$id" =~ ^[a-z0-9]+([_-][a-z0-9]+)*$ ]]; then
    echo "invalid plugin id: $id" >&2
    exit 1
  fi

  folder="plugins/$id"
  manifest="$folder/manifest.json"
  module="$folder/plugin.wasm"
  test -s "$manifest"
  test -s "$module"

  jq -e --arg id "$id" '
    .id == $id and
    .api == 1 and
    (.name | type == "string" and length > 0) and
    (.publisher | type == "string" and length > 0) and
    (.version | type == "string" and length > 0) and
    (.capabilities | length > 0) and
    all(.capabilities[]; startswith("provider:")) and
    (.domains | type == "array")
  ' "$manifest" >/dev/null

  for field in id name publisher version capabilities domains homepage; do
    if ! diff -u \
      <(jq -cS ".$field" "$manifest") \
      <(jq -cS ".$field" <<<"$entry") >/dev/null; then
      echo "$id: registry and manifest disagree on $field" >&2
      exit 1
    fi
  done

  expected_url="https://usewoofer.com/plugins/$id/plugin.wasm"
  test "$(jq -r '.wasm' <<<"$entry")" = "$expected_url"
  test "$(jq -r '.size' <<<"$entry")" = "$(stat -c '%s' "$module")"
  test "$(jq -r '.sha256' <<<"$entry")" = "$(sha256sum "$module" | cut -d' ' -f1)"
done < <(jq -r '.plugins[] | @base64' "$registry")

echo "validated $(jq '.plugins | length' "$registry") plugins"
