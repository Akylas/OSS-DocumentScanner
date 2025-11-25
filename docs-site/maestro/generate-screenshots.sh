#!/bin/bash
#
# generate-screenshots.sh
# Generates all documentation screenshots using Maestro
#
# Prerequisites:
# - Maestro CLI installed: curl -Ls "https://get.maestro.mobile.dev" | bash
# - Android emulator running OR iOS simulator running
# - OSS Document Scanner app installed on the device/emulator
#
# Usage:
#   ./docs-site/maestro/generate-screenshots.sh [android|ios]
#
# Screenshots are saved directly to docs-site/static/img/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_SITE_DIR="$(dirname "$SCRIPT_DIR")"
SCREENSHOTS_DIR="$DOCS_SITE_DIR/static/img"

# Platform selection
PLATFORM="${1:-android}"

echo "🎯 OSS Document Scanner - Screenshot Generator"
echo "================================================"
echo "Platform: $PLATFORM"
echo "Output directory: $SCREENSHOTS_DIR"
echo ""

# Check if Maestro is installed
if ! command -v maestro &> /dev/null; then
    echo "❌ Maestro CLI not found!"
    echo "Install it with: curl -Ls \"https://get.maestro.mobile.dev\" | bash"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$SCREENSHOTS_DIR"

echo "📱 Running screenshot tests..."
echo ""

# Run each screenshot flow
FLOWS=(
    "capture-screenshot"
    "settings-screenshot"
    "sync-screenshot"
    "export-screenshot"
    "edit-screenshot"
)

SUCCESS_COUNT=0
FAIL_COUNT=0

for flow in "${FLOWS[@]}"; do
    echo "📸 Running: $flow"
    
    if maestro test "$SCRIPT_DIR/screenshots/${flow}.yaml" --platform "$PLATFORM" 2>/dev/null; then
        echo "   ✅ Success"
        ((SUCCESS_COUNT++))
    else
        echo "   ⚠️  Warning: $flow may have had issues (screenshot might still be generated)"
        ((FAIL_COUNT++))
    fi
done

echo ""
echo "================================================"
echo "📊 Results: $SUCCESS_COUNT successful, $FAIL_COUNT with warnings"
echo ""
echo "📁 Screenshots saved to: $SCREENSHOTS_DIR"
echo ""

# List generated screenshots
if compgen -G "$SCREENSHOTS_DIR"/*.png > /dev/null 2>&1; then
    echo "Generated files:"
    for file in "$SCREENSHOTS_DIR"/*.png; do
        if [ -f "$file" ]; then
            echo "   $(basename "$file")"
        fi
    done
else
    echo "Note: PNG screenshots will replace SVG placeholders"
fi

echo ""
echo "🚀 Next steps:"
echo "   1. Review screenshots in $SCREENSHOTS_DIR"
echo "   2. Run 'npm run build' from docs-site/ to build with new screenshots"
echo "   3. Run 'npm run serve' to preview the site"
