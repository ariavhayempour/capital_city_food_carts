#!/usr/bin/env bash
# Shrinks cart photos in client/public and generates the WebP variants the UI serves.
# Re-run after adding a new cart photo. Requires macOS `sips` and `cwebp` (brew install webp).
#
#   <name>.jpg      kept as the og:image / social-share fallback, capped in width
#   <name>.webp     full width, used by the cart detail hero and menu images
#   <name>-800.webp card-sized, used by the home page grid (photos only, not menus)
set -euo pipefail

PUBLIC_DIR="$(cd "$(dirname "$0")/../client/public" && pwd)"
PHOTO_MAX_WIDTH=1600
MENU_MAX_WIDTH=2000
CARD_WIDTH=800
JPEG_QUALITY=80
WEBP_QUALITY=78

width_of() { sips -g pixelWidth "$1" | awk '/pixelWidth/ {print $2}'; }

# Writes $2 from $1 only when $2 is missing or older than $1.
make_webp() {
  local src="$1" out="$2" resize_width="${3:-0}" quality="${4:-$WEBP_QUALITY}"
  [[ -f "$out" && "$out" -nt "$src" ]] && return
  if (( resize_width > 0 )); then
    cwebp -quiet -q "$quality" -resize "$resize_width" 0 "$src" -o "$out"
  else
    cwebp -quiet -q "$quality" "$src" -o "$out"
  fi
  echo "  wrote $(basename "$out")"
}

shopt -s nullglob
for jpg in "$PUBLIC_DIR"/*.jpg; do
  name="$(basename "$jpg" .jpg)"
  [[ "$name" == "og-image" ]] && continue

  is_menu=false
  [[ "$name" == *menu* ]] && is_menu=true
  max_width=$PHOTO_MAX_WIDTH
  $is_menu && max_width=$MENU_MAX_WIDTH

  if (( $(width_of "$jpg") > max_width )); then
    tmp="$(mktemp -t "$name").jpg"
    sips --resampleWidth "$max_width" -s formatOptions "$JPEG_QUALITY" "$jpg" --out "$tmp" >/dev/null
    # Already-compressed sources can grow when re-encoded; only keep a real saving.
    if (( $(stat -f %z "$tmp") < $(stat -f %z "$jpg") )); then
      mv "$tmp" "$jpg"
      echo "resized $name.jpg to ${max_width}px wide"
    else
      rm "$tmp"
    fi
  fi

  make_webp "$jpg" "$PUBLIC_DIR/$name.webp"
  if ! $is_menu && (( $(width_of "$jpg") > CARD_WIDTH )); then
    make_webp "$jpg" "$PUBLIC_DIR/$name-$CARD_WIDTH.webp" "$CARD_WIDTH"
  elif ! $is_menu; then
    make_webp "$jpg" "$PUBLIC_DIR/$name-$CARD_WIDTH.webp"
  fi
done

# Home page hero (also reused in the About section): two widths for srcset.
# It's the LCP image and sits under a dark gradient, so it takes heavier compression.
HERO_SRC="$(cd "$PUBLIC_DIR/../.." && pwd)/attached_assets/capitol-state-street.jpg"
HERO_QUALITY=62
make_webp "$HERO_SRC" "$PUBLIC_DIR/capitol-state-street-1600.webp" 0 "$HERO_QUALITY"
make_webp "$HERO_SRC" "$PUBLIC_DIR/capitol-state-street-960.webp" 960 "$HERO_QUALITY"
