// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'getting-started',
    {
      type: 'category',
      label: 'How to',
      items: [
        'capture',
        'edit-and-enhance',
        'export',
        'sync-and-backup',
        'settings',
        'faq',
      ],
    },
  ],
};

export default sidebars;
