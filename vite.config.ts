// This config file is used by Remix
import { vitePlugin as remix } from "@remix-run/dev";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import stylex from "vite-plugin-stylex";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// eslint-disable-next-line no-restricted-syntax
export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    stylex({
      aliases: {
        "~/*": [path.resolve(__dirname, "app", "*")],
      },
    }),
  ],
});
