// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OSS Document Scanner',
  tagline: 'Open Source Document Scanner for Android and iOS',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://akylas.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/OSS-DocumentScanner/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Akylas', // Usually your GitHub org/user name.
  projectName: 'OSS-DocumentScanner', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    format: 'mdx',
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'de'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
      fr: {
        label: 'Français',
        htmlLang: 'fr-FR',
      },
      es: {
        label: 'Español',
        htmlLang: 'es-ES',
      },
      de: {
        label: 'Deutsch',
        htmlLang: 'de-DE',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Akylas/OSS-DocumentScanner/tree/main/docs-site/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'OSS Document Scanner',
        logo: {
          alt: 'OSS Document Scanner Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/capture',
            label: 'Capture',
            position: 'left',
          },
          {
            to: '/export',
            label: 'Export',
            position: 'left',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/Akylas/OSS-DocumentScanner',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/getting-started',
              },
              {
                label: 'Capture',
                to: '/capture',
              },
              {
                label: 'Export',
                to: '/export',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Issues',
                href: 'https://github.com/Akylas/OSS-DocumentScanner/issues',
              },
              {
                label: 'Weblate Translations',
                href: 'https://hosted.weblate.org/engage/oss-document-scanner/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Akylas/OSS-DocumentScanner',
              },
              {
                label: 'Google Play',
                href: 'https://play.google.com/store/apps/details?id=com.akylas.documentscanner',
              },
              {
                label: 'App Store',
                href: 'https://apps.apple.com/us/app/oss-document-scanner/id6472918564',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} OSS Document Scanner. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
