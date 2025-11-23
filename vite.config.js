import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Default for most tests (React components, etc.)
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",

    // Override environment just for the Firebase tests
    environmentMatchGlobs: [
      // Match your actual file path & name from the Vitest logs:
      ["src/__tests__/Firebase.test.{js,jsx,ts,tsx}", "node"],
    ],
  },
});
