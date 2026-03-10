import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OSS Document Scanner & Card Wallet",
  description: "Open Source Document Scanner and Card Wallet Apps",
  base: '/OSS-DocumentScanner/',
  
  themeConfig: {
    logo: '/icon.png',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Document Scanner', link: '/document-scanner/' },
      { text: 'Card Wallet', link: '/card-wallet/' },
      { text: 'Download', link: '/download' },
      { text: 'Support', link: '/support' }
    ],

    sidebar: {
      '/document-scanner/': [
        {
          text: 'Document Scanner',
          items: [
            { text: 'Overview', link: '/document-scanner/' },
            { text: 'Features', link: '/document-scanner/features' },
            { text: 'Getting Started', link: '/document-scanner/getting-started' },
            { text: 'Screenshots', link: '/document-scanner/screenshots' }
          ]
        }
      ],
      '/card-wallet/': [
        {
          text: 'Card Wallet',
          items: [
            { text: 'Overview', link: '/card-wallet/' },
            { text: 'Features', link: '/card-wallet/features' },
            { text: 'Getting Started', link: '/card-wallet/getting-started' },
            { text: 'Screenshots', link: '/card-wallet/screenshots' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Akylas/OSS-DocumentScanner' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Akylas'
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/OSS-DocumentScanner/icon.png' }]
  ]
})
