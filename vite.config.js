import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    cssMinify: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Code splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
    // Enable compression
    reportCompressedSize: true
  },
  server: {
    port: 3000,
    open: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
