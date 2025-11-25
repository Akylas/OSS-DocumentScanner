// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Document Scanner',
      collapsed: false,
      items: [
        'getting-started',
        'capture',
        'edit-and-enhance',
        'export',
      ],
    },
    {
      type: 'category',
      label: 'CardWallet',
      collapsed: false,
      items: [
        'cardwallet/getting-started',
        'cardwallet/scanning-cards',
        'cardwallet/managing-cards',
      ],
    },
    {
      type: 'category',
      label: 'Common Features',
      collapsed: false,
      items: [
        'sync-and-backup',
        'settings',
        'faq',
      ],
    },
  ],
};

export default sidebars;
