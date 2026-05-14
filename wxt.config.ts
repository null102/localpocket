import { defineConfig } from 'wxt';

export default defineConfig({
  manifestVersion: 3,
  outDir: 'output',
  manifest: {
    name: 'LocalPocket',
    description: 'Local-first Pocket alternative — save pages to plain files you own.',
    version: '0.0.1',
    permissions: ['storage', 'activeTab', 'contextMenus', 'scripting'],
    action: {
      default_title: 'Save to LocalPocket',
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        96: 'icon/96.png',
        128: 'icon/128.png',
      },
    },
  },
});
