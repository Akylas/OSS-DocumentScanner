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
├── src/
│   ├── css/
│   │   └── custom.css      # Custom styles
│   └── pages/
│       ├── index.js        # Homepage
│       └── index.module.css
├── static/
│   └── img/                # Images and screenshots
│       ├── capture-1.png   # Placeholder - replace with Maestro screenshots
│       ├── edit-1.png
│       ├── export-1.png
│       ├── sync-1.png
│       ├── settings-1.png
│       └── logo.svg
├── docusaurus.config.js    # Docusaurus configuration
├── sidebars.js             # Sidebar configuration
└── package.json
```

## Replacing Screenshots with Maestro-Generated Images

The `static/img/` directory contains placeholder SVG images. These should be replaced with real screenshots generated using [Maestro](https://maestro.mobile.dev/).

### Screenshot Naming Convention

Keep these exact filenames to match references in documentation:

| Filename | Screen |
|----------|--------|
| `capture-1.png` | Main capture/camera screen |
| `edit-1.png` | Edit/crop screen |
| `export-1.png` | Export options screen |
| `sync-1.png` | Sync settings screen |
| `settings-1.png` | Settings screen |

### Maestro Integration Script

After running Maestro tests that generate screenshots, use this script to copy them:

```bash
#!/bin/bash
# copy-maestro-screenshots.sh

MAESTRO_OUTPUT="${1:-./maestro-output}"
DOCS_IMG="./docs-site/static/img"

# Ensure target directory exists
mkdir -p "$DOCS_IMG"

# Copy and rename screenshots (adjust source names as needed)
cp "$MAESTRO_OUTPUT/capture_screen.png" "$DOCS_IMG/capture-1.png" 2>/dev/null && echo "✓ capture-1.png"
cp "$MAESTRO_OUTPUT/edit_screen.png" "$DOCS_IMG/edit-1.png" 2>/dev/null && echo "✓ edit-1.png"
cp "$MAESTRO_OUTPUT/export_screen.png" "$DOCS_IMG/export-1.png" 2>/dev/null && echo "✓ export-1.png"
cp "$MAESTRO_OUTPUT/sync_screen.png" "$DOCS_IMG/sync-1.png" 2>/dev/null && echo "✓ sync-1.png"
cp "$MAESTRO_OUTPUT/settings_screen.png" "$DOCS_IMG/settings-1.png" 2>/dev/null && echo "✓ settings-1.png"

echo "Screenshots copied to docs site"
```

Usage:
```bash
chmod +x copy-maestro-screenshots.sh
./copy-maestro-screenshots.sh /path/to/maestro/screenshots
```

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
