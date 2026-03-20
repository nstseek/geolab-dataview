/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { resolve } from "node:path";

const NEWSDATA_BASE = "https://newsdata.io/api/1/news";

function newsProxyPlugin(apiKey: string) {
  return {
    name: "news-proxy",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use("/api/news", async (req, res) => {
        try {
          const qs = req.url?.includes("?")
            ? req.url.slice(req.url.indexOf("?"))
            : "";
          const params = new URLSearchParams(qs);
          params.set("apikey", apiKey);
          params.set("category", "environment,science,technology");

          const upstream = await fetch(`${NEWSDATA_BASE}?${params}`);
          const body = await upstream.text();

          res.statusCode = upstream.status;
          res.setHeader("Content-Type", "application/json");
          res.end(body);
        } catch (err) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      ...(env.NEWSDATA_API_KEY ? [newsProxyPlugin(env.NEWSDATA_API_KEY)] : []),
    ],
    resolve: {
      alias: {
        "@api": resolve(__dirname, "src/api"),
        "@hooks": resolve(__dirname, "src/hooks"),
        "@components": resolve(__dirname, "src/components"),
        "@context": resolve(__dirname, "src/context"),
        "@pages": resolve(__dirname, "src/pages"),
        "@queries": resolve(__dirname, "src/queries"),
        "@test": resolve(__dirname, "src/test"),
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.ts",
    },
  };
});
