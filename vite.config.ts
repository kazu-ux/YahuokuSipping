import { crx, defineManifest } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import fs from 'fs-extra';
import type PkgType from './package.json';

const pkg = (await fs.readJSON('./package.json')) as typeof PkgType;

const manifest = defineManifest({
  manifest_version: 3,
  name: 'ヤフオク送料自動計算機',
  description: pkg.description,
  version: pkg.version,
  content_scripts: [
    {
      matches: ['https://page.auctions.yahoo.co.jp/*'],
      js: ['src/content_script.ts'],
    },
  ],
  permissions: ['cookies'],
  background: {
    service_worker: 'src/background.ts',
  },
  host_permissions: ['https://page.auctions.yahoo.co.jp/*'],
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
