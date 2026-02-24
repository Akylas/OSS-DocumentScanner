# Maestro Screenshot Generation

This directory contains [Maestro](https://maestro.mobile.dev/) flows for automatically generating screenshots for the OSS Document Scanner documentation.

## Prerequisites

1. **Install Maestro CLI:**
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. **Running Device/Emulator:**
   - Android: Start an emulator via Android Studio or `emulator -avd <avd_name>`
   - iOS: Start a simulator via Xcode or `xcrun simctl boot <device_name>`

3. **App Installed:**
   - Build and install OSS Document Scanner on the device/emulator
   - App ID: `com.akylas.documentscanner`

## Quick Start

Generate all screenshots with one command:

```bash
# From repository root
./docs-site/maestro/generate-screenshots.sh android

# Or for iOS
./docs-site/maestro/generate-screenshots.sh ios
```

The script will automatically:
1. Push a test document image to the device/emulator
2. Run all screenshot flows
3. Save screenshots to `docs-site/static/img/`

Screenshots are automatically saved to `docs-site/static/img/`.

## How Document Setup Works

Some screenshots (edit, export) require a document to exist in the app. The Maestro flows handle this automatically:

1. **Test Image**: The script includes `test-document.png` which is pushed to the device before running flows
2. **Document Setup Flow**: The `flows/setup-test-document.yaml` flow checks if documents exist and imports one if needed
3. **Automatic Import**: If no documents exist, the flow:
   - Taps the import button
   - Selects the test image from gallery
   - Confirms the crop dialog
   - Saves the document

### Manual Image Setup

If the automatic setup fails, you can manually prepare:

**Android:**
```bash
# Push test image to device
adb push docs-site/maestro/test-document.png /sdcard/DCIM/test-document.png

# Trigger media scanner
adb shell am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE \
    -d file:///sdcard/DCIM/test-document.png
```

**iOS:**
```bash
# Add image to simulator Photos
xcrun simctl addmedia booted docs-site/maestro/test-document.png
```

## Individual Flows

Run individual screenshot flows:

```bash
# From repository root
cd docs-site/maestro

# Capture main screen
maestro test screenshots/capture-screenshot.yaml

# Settings screen
maestro test screenshots/settings-screenshot.yaml

# Sync settings
maestro test screenshots/sync-screenshot.yaml

# Export options (requires document)
maestro test screenshots/export-screenshot.yaml

# Edit screen (requires document)
maestro test screenshots/edit-screenshot.yaml
```

## Directory Structure

```
maestro/
├── generate-screenshots.sh     # Main script to generate all screenshots
├── generate-screenshots.yaml   # Combined flow (alternative)
├── test-document.png           # Test image for document import
├── README.md                   # This file
├── flows/                      # Reusable navigation flows
│   ├── navigate-to-settings.yaml
│   ├── navigate-to-sync.yaml
│   ├── setup-test-document.yaml  # Creates a test document if needed
│   ├── show-export.yaml
│   └── show-edit.yaml
└── screenshots/                # Individual screenshot flows
    ├── capture-screenshot.yaml
    ├── settings-screenshot.yaml
    ├── sync-screenshot.yaml
    ├── export-screenshot.yaml
    └── edit-screenshot.yaml
```

## Screenshot Output

Screenshots are saved directly to `docs-site/static/img/` with these filenames:

| Filename | Description |
|----------|-------------|
| `capture-1.png` | Main capture/document list screen |
| `settings-1.png` | Settings screen |
| `sync-1.png` | Sync/backup settings |
| `export-1.png` | Export options |
| `edit-1.png` | Edit/crop screen |

## Customizing Flows

### Adding New Screenshots

1. Create a new flow file in `screenshots/`:

```yaml
# screenshots/my-screenshot.yaml
appId: com.akylas.documentscanner

---

- launchApp:
    clearState: false

- waitForAnimationToEnd:
    timeout: 5000

# Navigation steps...
- tapOn: "Some Button"
- waitForAnimationToEnd

# Take screenshot - path relative to yaml file location
- takeScreenshot: ../static/img/my-screenshot
```

2. Add the flow name to `generate-screenshots.sh`:

```bash
FLOWS=(
    "capture-screenshot"
    "settings-screenshot"
    # ... existing flows ...
    "my-screenshot"  # Add your new flow
)
```

### Handling UI Variations

Maestro flows use conditional execution for UI variations:

```yaml
# Try multiple ways to find an element
- runFlow:
    when:
      visible: "Settings"
    commands:
      - tapOn: "Settings"

- runFlow:
    when:
      visible:
        id: ".*settings.*"
    commands:
      - tapOn:
          id: ".*settings.*"
```

## Troubleshooting

### Screenshots not being saved

1. Check that the output path is correct (relative to the YAML file)
2. Ensure the `static/img/` directory exists
3. Verify the app is installed and running

### Flow fails to find elements

1. Run Maestro Studio to inspect the app:
   ```bash
   maestro studio
   ```

2. Use Maestro's hierarchy view to find correct element identifiers

3. Update flows with correct selectors

### App not launching

1. Verify the app ID is correct: `com.akylas.documentscanner`
2. Check that the app is installed on the device/emulator
3. Try with `clearState: true` to reset the app

### Permission dialogs blocking

The flows include handlers for common permission dialogs. If new dialogs appear:

```yaml
- runFlow:
    when:
      visible: "Your Permission Text"
    commands:
      - tapOn: "Allow"  # or appropriate button
```

## CI Integration

To run screenshot generation in CI:

```yaml
# .github/workflows/screenshots.yml
name: Generate Screenshots

on:
  workflow_dispatch:

jobs:
  screenshots:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash
        
      - name: Setup Android Emulator
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 30
          script: |
            # Build and install app first
            # ...
            
            # Generate screenshots
            ./docs-site/maestro/generate-screenshots.sh android
            
      - name: Upload Screenshots
        uses: actions/upload-artifact@v4
        with:
          name: screenshots
          path: docs-site/static/img/*.png
```

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/docs)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli/test)
- [Flow Configuration](https://maestro.mobile.dev/api-reference/configuration)
