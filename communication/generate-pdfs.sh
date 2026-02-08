#!/bin/bash

# Script pour générer les PDF à partir des fichiers markdown
# Usage: ./generate-pdfs.sh [fichier.md] (ou sans argument pour tout générer)

cd "$(dirname "$0")"

mkdir -p pdf

if [ -n "$1" ]; then
    # Générer un seul PDF
    file="$1"
    if [ -f "$file" ]; then
        echo "Génération de ${file%.md}.pdf..."
        npx md-to-pdf "$file" --pdf-options '{"margin": "20mm"}'
        mv "${file%.md}.pdf" pdf/
        echo "✓ pdf/${file%.md}.pdf généré"
    else
        echo "Fichier $file non trouvé"
        exit 1
    fi
else
    # Générer tous les PDF
    echo "Génération de tous les PDF..."
    for f in *.md; do
        echo "→ $f"
        npx md-to-pdf "$f" --pdf-options '{"margin": "20mm"}'
        mv "${f%.md}.pdf" pdf/
    done
    echo ""
    echo "✓ Tous les PDF ont été générés dans communication/pdf/"
fi
