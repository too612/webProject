import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (
            id.includes("@tiptap/") ||
            id.includes("prosemirror-") ||
            id.includes("@floating-ui/")
          ) {
            return "editor-vendor";
          }

          if (
            id.includes("@mui/") ||
            id.includes("@emotion/") ||
            id.includes("date-fns")
          ) {
            return "mui-vendor";
          }

          if (
            id.includes("ag-grid-community") ||
            id.includes("ag-grid-react")
          ) {
            return "ag-grid-vendor";
          }

          if (id.includes("@dnd-kit/")) {
            return "dnd-vendor";
          }

          if (
            id.includes("sortablejs") ||
            id.includes("@sortablejs/") ||
            id.includes("react-beautiful-dnd") ||
            id.includes("@hello-pangea/dnd")
          ) {
            return "sortable-vendor";
          }

          if (
            id.includes("react-router-dom") ||
            id.includes("react-dom") ||
            /[\\/]react[\\/]/.test(id) ||
            id.includes("zustand") ||
            id.includes("axios")
          ) {
            return "react-vendor";
          }

          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/data": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
