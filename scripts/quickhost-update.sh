#!/usr/bin/env bash
# Replace the file set of an existing Quickhost presentation with everything
# under out/, in small batches. Each batch is guaranteed to contain at least
# one .html file (API requires it). Batches that time out (HTTP 504) get
# retried a few times before giving up.
#
# Usage: bash scripts/quickhost-update.sh <presentation_id> [batch_size]
set -uo pipefail
FAILED_BATCHES=()

PRES_ID="${1:?presentation id required}"
BATCH="${2:-8}"

TOKEN="$(cat "$HOME/.config/quickhost/token")"
BASE="https://m4begr-affirm-affirmlive.snowflakecomputing.app"

cd "$(dirname "$0")/.."

# Split the file set into HTML and non-HTML lists so we can guarantee each
# outgoing batch contains at least one HTML file.
HTML_FILES=()
OTHER_FILES=()
while IFS= read -r -d '' f; do
  case "$f" in
    *.html) HTML_FILES+=("$f");;
    *)      OTHER_FILES+=("$f");;
  esac
done < <(find out -type f -print0)

html_count=${#HTML_FILES[@]}
other_count=${#OTHER_FILES[@]}
total=$((html_count + other_count))
echo "Uploading ${total} files (${html_count} HTML + ${other_count} other) to ${PRES_ID} in batches of ${BATCH}..." >&2

put_batch() {
  local -a batch_files=("$@")
  local args=()
  local f rel
  for f in "${batch_files[@]}"; do
    rel="${f#out/}"
    args+=( -F "files=@${f}" -F "paths=${rel}" )
  done
  local attempt code
  for attempt in 1 2 3 4 5 6; do
    code=$(curl -s --http1.1 --connect-timeout 30 --max-time 120 \
      -H "Authorization: Snowflake Token=\"$TOKEN\"" \
      -H "Expect:" \
      -X PUT \
      "${args[@]}" \
      -o /tmp/quickhost-put.log \
      -w "%{http_code}" \
      "$BASE/api/presentations/${PRES_ID}/files" || true)
    if [ "$code" = "200" ] || [ "$code" = "201" ] || [ "$code" = "204" ]; then
      echo "    HTTP ${code}"
      return 0
    fi
    echo "    HTTP ${code} (attempt ${attempt}) body: $(head -c 160 /tmp/quickhost-put.log)"
    # 401 = expired token. Retrying won't help; bail immediately so the
    # caller can re-auth and re-run instead of watching 15 min of retries.
    if [ "$code" = "401" ]; then
      echo "    Token appears expired — refresh it in Cursor and re-run." >&2
      exit 2
    fi
    sleep $((attempt * 4))
  done
  echo "    FAILED after 6 attempts"
  FAILED_BATCHES+=("${batch_files[*]}")
  return 0
}

# Interleave: each batch = 1 HTML + up to (BATCH-1) other files, until one
# list is empty; then run out the leftover of whichever list has more files.
hi=0
oi=0
batch_num=1
per_other=$((BATCH - 1))
while [ $hi -lt $html_count ]; do
  BATCH_FILES=("${HTML_FILES[$hi]}")
  hi=$((hi + 1))
  for _ in $(seq 1 $per_other); do
    [ $oi -ge $other_count ] && break
    BATCH_FILES+=("${OTHER_FILES[$oi]}")
    oi=$((oi + 1))
  done
  echo "  batch ${batch_num}: ${#BATCH_FILES[@]} files (1 html + $((${#BATCH_FILES[@]} - 1)) other)"
  put_batch "${BATCH_FILES[@]}"
  batch_num=$((batch_num + 1))
done

# Any remaining non-HTML files still need to go up. Attach the LAST HTML
# file we already sent to each remaining batch so the "must include HTML"
# constraint is satisfied (re-sending the same HTML is a no-op).
if [ $oi -lt $other_count ]; then
  reused="${HTML_FILES[$((html_count - 1))]}"
  while [ $oi -lt $other_count ]; do
    BATCH_FILES=("$reused")
    for _ in $(seq 1 $per_other); do
      [ $oi -ge $other_count ] && break
      BATCH_FILES+=("${OTHER_FILES[$oi]}")
      oi=$((oi + 1))
    done
    echo "  batch ${batch_num} (leftover other): ${#BATCH_FILES[@]} files"
    put_batch "${BATCH_FILES[@]}"
    batch_num=$((batch_num + 1))
  done
fi

echo
if [ ${#FAILED_BATCHES[@]} -gt 0 ]; then
  echo "!! ${#FAILED_BATCHES[@]} batch(es) failed after all retries:"
  for b in "${FAILED_BATCHES[@]}"; do
    echo "    $b"
  done
  exit 1
fi
echo "Done."
