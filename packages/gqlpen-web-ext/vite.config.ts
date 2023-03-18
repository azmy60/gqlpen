import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: ['src/service_worker.ts'],
            output: {
                entryFileNames: (chunkInfo) => {
                    return chunkInfo.name === 'service_worker'
                        ? 'service_worker.js'
                        : '[name]-[hash].js';
                },
            },
        },
        outDir: 'dist/ext',
    },
});
