#!/usr/bin/env bash
# Met à jour la copie publique de l'offre CJD (après édition du HTML ou des images sources).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_HTML="$ROOT/communication/docs/partenariats/OFFRE-MECENE-CJD-AMIENS.html"
SRC_ASSETS="$ROOT/communication/docs/partenariats/assets"
DEST_DIR="$ROOT/public/offre-privee"
DEST_HTML="$DEST_DIR/cjd-mecene.html"
DEST_ASSETS="$DEST_DIR/cjd-assets"

mkdir -p "$DEST_ASSETS"
cp -R "$SRC_ASSETS/"* "$DEST_ASSETS/"
cp "$SRC_HTML" "$DEST_HTML"
sed -i '' 's|src="assets/|src="/offre-privee/cjd-assets/|g' "$DEST_HTML"
if ! grep -q 'name="robots"' "$DEST_HTML"; then
  sed -i '' '/<title>/a\
  <meta name="robots" content="noindex, nofollow" />
' "$DEST_HTML"
fi
echo "OK: $DEST_HTML + $DEST_ASSETS"
