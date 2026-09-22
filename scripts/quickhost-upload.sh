#!/usr/bin/env bash
# Upload the static export in out/ to Quickhost as a multi-file presentation.
# Usage: bash scripts/quickhost-upload.sh <space_id> <presentation_name>
set -euo pipefail

SPACE_ID="${1:?space id required}"
NAME="${2:?presentation name required}"
DATE="$(date +%F)"

TOKEN="$(cat "$HOME/.config/quickhost/token")"
BASE="https://m4begr-affirm-affirmlive.snowflakecomputing.app"

cd "$(dirname "$0")/.."

# Build the curl -F args from every file under out/
ARGS=()
while IFS= read -r -d '' f; do
  rel="${f#out/}"
  ARGS+=( -F "files=@${f}" -F "paths=${rel}" )
done < <(find out -type f -print0)

echo "Uploading $(( ${#ARGS[@]} / 4 )) files to space ${SPACE_ID}..." >&2

curl -sf -X POST \
  -H "Authorization: Snowflake Token=\"$TOKEN\"" \
  -F "name=${NAME}" \
  -F "presented_date=${DATE}" \
  -F "is_public=false" \
  "${ARGS[@]}" \
  "$BASE/api/spaces/${SPACE_ID}/presentations"
