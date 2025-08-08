import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    transpilePackages: ["react-vant"],
    webpack(config, options) {
        // 处理 .svg 文件
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });
        config.externals["@solana/web3.js"] = "commonjs @solana/web3.js";
        config.externals["@solana/spl-token"] = "commonjs @solana/spl-token";
        return config;
    },
};

export default nextConfig;
