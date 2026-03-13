# OSS Document Scanner Documentation Site

This directory contains the documentation website for OSS Document Scanner, built with [Docusaurus 3](https://docusaurus.io/).

## Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm

### Installation

```bash
cd docs-site
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Serve Built Site Locally

```bash
npm run serve
```

This serves the built website locally for testing before deployment.

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch via the GitHub Actions workflow at `.github/workflows/deploy.yml`.

The site will be available at: https://akylas.github.io/OSS-DocumentScanner/

## Project Structure

```
docs-site/
├── docs/                    # Documentation markdown files
│   ├── getting-started.md
│   ├── capture.md
│   ├── edit-and-enhance.md
│   ├── export.md
│   ├── sync-and-backup.md
│   ├── settings.md
│   └── faq.md
├── maestro/                 # Maestro screenshot automation
│   ├── generate-screenshots.sh
│   ├── README.md
│   ├── flows/               # Reusable navigation flows
│   └── screenshots/         # Individual screenshot flows
├── scripts/
│   └── copy-assets.sh       # Copies images from root/fastlane at build time
├── src/
│   ├── css/
│   │   └── custom.css      # Custom styles
│   └── pages/
│       ├── index.js        # Homepage
│       └── index.module.css
├── static/
│   └── img/                # Images and screenshots
│       ├── apps/           # Feature graphics (copied from fastlane)
│       ├── badges/         # Store badges (copied from root)
│       ├── icons/          # App icons (copied from root)
│       ├── screenshots/    # Phone screenshots (copied from fastlane)
│       └── logo.svg
├── i18n/                    # Internationalization files
│   └── fr/                  # French translations
├── docusaurus.config.js    # Docusaurus configuration
├── sidebars.js             # Sidebar configuration
└── package.json
```

## Asset Management

Images are **NOT** duplicated in this directory. Instead, the `scripts/copy-assets.sh` script copies images from the main repository during build:

- **Feature graphics** from `fastlane/metadata/*/android/en-US/images/featureGraphic.png`
- **App icons** from root level (`icon.png`, `icon_cardwallet.png`, etc.)
- **Store badges** from root level (`badge_github.png`, `appstore.png`)
- **Phone screenshots** from `fastlane/metadata/*/android/en-US/images/phoneScreenshots/`

### How it works

The `npm run build` and `npm run start` commands automatically run `copy-assets.sh` first:

```json
{
  "scripts": {
    "copy-assets": "bash scripts/copy-assets.sh",
    "start": "npm run copy-assets && docusaurus start",
    "build": "npm run copy-assets && docusaurus build"
  }
}
```

### Manual asset copy

If needed, you can run the script manually:

```bash
npm run copy-assets
```

## Generating Screenshots with Maestro

The `maestro/` directory contains [Maestro](https://maestro.mobile.dev/) flows for automatically generating screenshots directly to `static/img/`.

### Quick Start

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Generate all screenshots (requires running emulator with app installed)
./docs-site/maestro/generate-screenshots.sh android

# Or for iOS
./docs-site/maestro/generate-screenshots.sh ios
```

### Individual Screenshots

Run specific screenshot flows:

```bash
cd docs-site/maestro

maestro test screenshots/capture-screenshot.yaml
maestro test screenshots/settings-screenshot.yaml
maestro test screenshots/sync-screenshot.yaml
maestro test screenshots/export-screenshot.yaml
maestro test screenshots/edit-screenshot.yaml
```

### Screenshot Files

Screenshots are saved directly to `static/img/` with these names:

| Filename | Screen |
|----------|--------|
| `capture-1.png` | Main capture/camera screen |
| `edit-1.png` | Edit/crop screen |
| `export-1.png` | Export options screen |
| `sync-1.png` | Sync settings screen |
| `settings-1.png` | Settings screen |

See [maestro/README.md](maestro/README.md) for detailed documentation on customizing flows and CI integration.

## Internationalization (i18n)

The site is configured for multiple languages:

- **English (en)** - Default
- **French (fr)** - Placeholder
- **Spanish (es)** - Placeholder
- **German (de)** - Placeholder

### Adding Translations

1. **Generate translation files:**

   ```bash
   npm run write-translations -- --locale fr
   ```

   This creates JSON files in `i18n/fr/` with all translatable strings.

2. **Translate documentation:**

   Copy docs to `i18n/fr/docusaurus-plugin-content-docs/current/`:

   ```bash
   mkdir -p i18n/fr/docusaurus-plugin-content-docs/current
   cp -r docs/* i18n/fr/docusaurus-plugin-content-docs/current/
   ```

   Then translate the copied markdown files.

3. **Translate theme strings:**

   Edit the generated JSON files in `i18n/fr/`:
   - `code.json` - Theme UI strings
   - `docusaurus-theme-classic/navbar.json` - Navbar items
   - `docusaurus-theme-classic/footer.json` - Footer items

4. **Build for a specific locale:**

   ```bash
   npm run build -- --locale fr
   ```

5. **Start dev server with a specific locale:**

   ```bash
   npm run start -- --locale fr
   ```

### Translation File Structure

After running `write-translations`, you'll have:

```
i18n/
└── fr/
    ├── code.json
    ├── docusaurus-theme-classic/
    │   ├── navbar.json
    │   └── footer.json
    └── docusaurus-plugin-content-docs/
        └── current/
            ├── getting-started.md
            ├── capture.md
            └── ... (translated docs)
```

## Customization

### Theme Colors

Edit `src/css/custom.css` to modify the color scheme:

```css
:root {
  --ifm-color-primary: #2e8555;
  /* ... */
}
```

### Sidebar Structure

Edit `sidebars.js` to modify the documentation structure:

```js
const sidebars = {
  docsSidebar: [
    'getting-started',
    {
      type: 'category',
      label: 'How to',
      items: ['capture', 'edit-and-enhance', ...],
    },
  ],
};
```

### Navigation

Edit the `navbar` section in `docusaurus.config.js` to modify top navigation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes to docs
4. Test locally with `npm start`
5. Build to verify with `npm run build`
6. Submit a pull request

## Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Features](https://docusaurus.io/docs/markdown-features)
- [i18n Guide](https://docusaurus.io/docs/i18n/tutorial)
- [Deployment Guide](https://docusaurus.io/docs/deployment)
