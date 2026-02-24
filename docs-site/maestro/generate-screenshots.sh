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
TEST_IMAGE="$SCRIPT_DIR/test-document.png"

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

# Push test image to device/emulator (needed for edit/export screenshots)
echo "📤 Pushing test document to device..."
if [ "$PLATFORM" = "android" ]; then
    # Check if adb is available
    if command -v adb &> /dev/null; then
        # Create DCIM directory if it doesn't exist and push the test image
        adb shell mkdir -p /sdcard/DCIM 2>/dev/null || true
        if [ -f "$TEST_IMAGE" ]; then
            adb push "$TEST_IMAGE" /sdcard/DCIM/test-document.png 2>/dev/null && \
                echo "   ✅ Test image pushed to /sdcard/DCIM/test-document.png" || \
                echo "   ⚠️ Warning: Could not push test image (screenshots may fail)"
            # Trigger media scanner to make image visible in gallery
            adb shell am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file:///sdcard/DCIM/test-document.png 2>/dev/null || true
        else
            echo "   ⚠️ Warning: Test image not found at $TEST_IMAGE"
        fi
    else
        echo "   ⚠️ Warning: adb not found, cannot push test image"
        echo "   Please manually add an image to the emulator gallery"
    fi
elif [ "$PLATFORM" = "ios" ]; then
    echo "   ℹ️ For iOS, please add test-document.png to the simulator's Photos app manually"
    echo "   Or use: xcrun simctl addmedia booted \"$TEST_IMAGE\""
    if command -v xcrun &> /dev/null; then
        # Check if there's a booted simulator
        if xcrun simctl list devices | grep -q "Booted"; then
            xcrun simctl addmedia booted "$TEST_IMAGE" 2>/dev/null && \
                echo "   ✅ Test image added to iOS simulator Photos" || \
                echo "   ⚠️ Warning: Could not add test image to simulator"
        else
            echo "   ⚠️ Warning: No booted iOS simulator found"
            echo "   Start a simulator with: xcrun simctl boot <device_name>"
        fi
    fi
fi
echo ""

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
