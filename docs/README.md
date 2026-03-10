# OSS Document Scanner & Card Wallet - Documentation Website

This directory contains the official documentation website for OSS Document Scanner and OSS Card Wallet, built with [VitePress](https://vitepress.dev/).

## 🌐 Website

The website is hosted at: [https://akylas.github.io/OSS-DocumentScanner/](https://akylas.github.io/OSS-DocumentScanner/)

## 📁 Structure

```
docs/
├── .vitepress/
│   ├── config.mts          # VitePress configuration
│   └── dist/               # Build output (generated)
├── public/                 # Static assets
│   ├── icon.png            # App icons
│   ├── scanner-images/     # Document Scanner screenshots
│   └── wallet-images/      # Card Wallet screenshots
├── document-scanner/       # Document Scanner documentation
│   ├── index.md
│   ├── features.md
│   ├── getting-started.md
│   └── screenshots.md
├── card-wallet/            # Card Wallet documentation
│   ├── index.md
│   ├── features.md
│   ├── getting-started.md
│   └── screenshots.md
├── index.md                # Homepage
├── download.md             # Download page
├── support.md              # Support & donation page
└── package.json
```

## 🚀 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
cd docs
npm install
```

### Development Server

Start the local development server:

```bash
npm run docs:dev
```

The site will be available at `http://localhost:5173/OSS-DocumentScanner/`

### Build

Build the static site:

```bash
npm run docs:build
```

The built site will be in `.vitepress/dist/`

### Preview Build

Preview the built site locally:

```bash
npm run docs:preview
```

## 📝 Content Guidelines

### Adding New Pages

1. Create a new `.md` file in the appropriate directory
2. Add front matter if needed
3. Update the sidebar in `.vitepress/config.mts`
4. Write content in Markdown

### Using Images

Images are sourced from:
- Root directory badges and icons
- `fastlane/metadata/` for app store images
- These are copied to `public/` directory

To update images:
```bash
# Copy from root
cp ../icon.png public/

# Copy from fastlane
cp -r ../fastlane/metadata/com.akylas.documentscanner/android/en-US/images public/scanner-images/
cp -r ../fastlane/metadata/com.akylas.cardwallet/android/en-US/images public/wallet-images/
```

### Markdown Features

VitePress supports:
- Standard Markdown
- GitHub Flavored Markdown
- Custom containers
- Code highlighting
- Vue components in Markdown

See [VitePress Markdown Guide](https://vitepress.dev/guide/markdown) for details.

## 🚢 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `master` branch.

### GitHub Actions Workflow

The deployment workflow:
1. Triggers on push to `master` (for `docs/**` changes)
2. Builds the VitePress site
3. Deploys to GitHub Pages

See `.github/workflows/deploy-docs.yml` for configuration.

### Manual Deployment

You can also trigger deployment manually:
1. Go to Actions tab on GitHub
2. Select "Deploy VitePress site to GitHub Pages"
3. Click "Run workflow"

## 🎨 Customization

### Theme Configuration

Edit `.vitepress/config.mts` to customize:
- Site title and description
- Navigation menu
- Sidebar structure
- Footer
- Social links
- Logo and icons

### Styling

Custom CSS can be added in `.vitepress/theme/` directory. See [VitePress Theme Guide](https://vitepress.dev/guide/custom-theme) for details.

## 📸 Screenshots

Screenshots are managed in two ways:

1. **Manual**: Place screenshots in `public/scanner-images/` and `public/wallet-images/`
2. **Automated**: Use Maestro scripts in `../.maestro/` directory

### Updating Screenshots with Maestro

```bash
# Run Maestro flows
cd ..
maestro test .maestro/screenshot_document_scanner_main.yaml

# Copy generated screenshots
cp ~/.maestro/tests/<test-run-id>/screenshots/*.png docs/public/scanner-images/phoneScreenshots/
```

See `../.maestro/README.md` for detailed instructions.

## 🔗 Links and Badges

The site uses badges and links from:
- GitHub repository stats (stars, downloads, releases)
- Play Store and App Store badges
- Weblate translation status
- Sponsor graphics

These are automatically updated as they reference external URLs.

## 🌍 Internationalization

Currently, the documentation is in English. To add more languages:

1. Create language directories (e.g., `fr/`, `de/`)
2. Translate content files
3. Update config for i18n
4. See [VitePress i18n Guide](https://vitepress.dev/guide/i18n)

## 🐛 Troubleshooting

### Build Warnings

The TypeScript config warning can be ignored - it's related to the parent project's config.

### Port Already in Use

If port 5173 is in use:
```bash
npm run docs:dev -- --port 5174
```

### Images Not Loading

Ensure:
- Images are in `public/` directory
- Paths start with `/` (e.g., `/icon.png`)
- Base URL is configured in config.mts

## 📚 Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages](https://pages.github.com/)
- [Maestro Mobile Testing](https://maestro.mobile.dev/)

## 🤝 Contributing

To contribute to the documentation:

1. Fork the repository
2. Create a feature branch
3. Make your changes in the `docs/` directory
4. Test locally with `npm run docs:dev`
5. Submit a pull request

## 📄 License

The documentation is part of the OSS-DocumentScanner repository and is released under the MIT License.
