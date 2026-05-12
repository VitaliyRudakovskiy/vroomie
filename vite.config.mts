/// <reference types="vitest" />

import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
	plugins: [angular(), viteTsConfigPaths()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['src/test-setup.ts'],
		include: ['**/*.spec.ts'],
		reporters: ['default'],
		snapshot: {
			enabled: false,
		},
	},
	define: {
		'import.meta.vitest': mode !== 'production',
	},
}));
