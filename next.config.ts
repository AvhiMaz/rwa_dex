import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "pino-elasticsearch": path.resolve(__dirname, "mocks/pino-elasticsearch.js"),
      "fastbench": path.resolve(__dirname, "mocks/fastbench.js"),
    },
  },
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream", "pino-elasticsearch", "rimraf"],
  webpack: (config, { webpack }) => {
    const path = require("path");
    config.resolve.alias = {
      ...config.resolve.alias,
      "pino-elasticsearch": path.resolve(__dirname, "mocks/pino-elasticsearch.js"),
      "fastbench": path.resolve(__dirname, "mocks/fastbench.js"),
    };
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(pino-elasticsearch|fastbench|pino-pretty|encoding)$/,
      })
    );
    return config;
  },
};

export default nextConfig;
