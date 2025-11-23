import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/setupTests.js",

    environmentMatchGlobs: [
      ["src/__tests__/Firebase.test.{js,jsx,ts,tsx}", "node"],
    ],
  },
});
