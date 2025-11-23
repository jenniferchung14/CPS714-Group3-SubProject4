// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // ✅ Use happy-dom instead of jsdom to avoid parse5 ESM issue
    environment: "happy-dom",
    setupFiles: "./src/setupTests.js",

    // ✅ Run ONLY firebase tests in node env (no DOM, no jsdom)
    environmentMatchGlobs: [
      ["src/__tests__/Firebase.test.{js,jsx,ts,tsx}", "node"],
    ],
  },
});
