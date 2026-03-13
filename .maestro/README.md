# Maestro Test Flows for Screenshot Generation

This directory contains Maestro test flows for automatically generating screenshots of the apps for documentation purposes.

## About Maestro

[Maestro](https://maestro.mobile.dev/) is a mobile UI testing framework that allows you to automate app interactions and capture screenshots.

## Installation

Install Maestro:

```bash
# On macOS or Linux
curl -Ls "https://get.maestro.mobile.dev" | bash

# On Windows
powershell -c "iwr https://get.maestro.mobile.dev/win | iex"
```

## Available Flows

### Document Scanner

- `screenshot_document_scanner_main.yaml` - Captures the main document list screen
- `screenshot_document_scanner_camera.yaml` - Captures the camera scanning view
- `screenshot_document_scanner_detail.yaml` - Captures a document detail view

### Card Wallet

- `screenshot_card_wallet_main.yaml` - Captures the main card list screen
- `screenshot_card_wallet_camera.yaml` - Captures the camera scanning view for cards
- `screenshot_card_wallet_detail.yaml` - Captures a card detail view with barcode

## Usage

### Prerequisites

1. Build and install the app on a connected device or emulator
2. Ensure Maestro is installed
3. Ensure the device/emulator is running

### Running Flows

To run a single flow:

```bash
# For Document Scanner
maestro test .maestro/screenshot_document_scanner_main.yaml

# For Card Wallet
maestro test .maestro/screenshot_card_wallet_main.yaml
```

To run all flows for an app:

```bash
# Document Scanner flows
maestro test .maestro/screenshot_document_scanner_*.yaml

# Card Wallet flows
maestro test .maestro/screenshot_card_wallet_*.yaml
```

### Capturing Screenshots

Screenshots are automatically saved by Maestro. By default, they are stored in:
- `~/.maestro/tests/<test-run-id>/screenshots/`

To specify a custom output directory:

```bash
maestro test --output /path/to/output .maestro/screenshot_document_scanner_main.yaml
```

### Updating Documentation Screenshots

After running the flows and capturing screenshots:

1. Review the generated screenshots
2. Copy the desired screenshots to the documentation:
   ```bash
   # For Document Scanner
   cp ~/.maestro/tests/<test-run-id>/screenshots/*.png docs/public/scanner-images/phoneScreenshots/
   
   # For Card Wallet
   cp ~/.maestro/tests/<test-run-id>/screenshots/*.png docs/public/wallet-images/phoneScreenshots/
   ```
3. Update the image references in the documentation if needed

## Customizing Flows

You can customize the flows to capture different screens or interactions:

1. Edit the YAML files
2. Use Maestro's [flow reference](https://maestro.mobile.dev/api-reference/commands) for available commands
3. Test the modified flows

## Tips

- Ensure the app has sample data for better screenshots
- Use a clean device/emulator state for consistent results
- Consider different screen sizes and orientations
- Test flows on both Android and iOS

## Troubleshooting

### Flow fails to find elements

- Check the element IDs in the app code
- Use Maestro Studio for interactive debugging: `maestro studio`
- Add longer timeouts if the app is slow to load

### Screenshots are blank or incomplete

- Increase `waitForAnimationToEnd` timeouts
- Ensure the device screen is unlocked
- Check device/emulator display settings

### Camera permission issues

- Grant camera permissions manually before running flows
- Add permission grant commands to the flow if needed

## CI/CD Integration

These flows can be integrated into CI/CD pipelines to automatically generate screenshots for different app versions or languages. See the GitHub Actions workflow in `.github/workflows/` for an example.

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro Flow Reference](https://maestro.mobile.dev/api-reference/commands)
- [Maestro Studio](https://maestro.mobile.dev/getting-started/maestro-studio)
