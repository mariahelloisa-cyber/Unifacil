import type { NextConfig } from "next";
import path from "path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  devIndicators: false,
  images: {
    /* No Next 16 o padrão passou a ser apenas [75]; qualquer outro valor de
       `quality` seria arredondado para 75. 95 libera a arte da seção "Por que a UniFácil?". */
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kassyyubowooufslipvt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

// Habilita o acesso a bindings do Cloudflare (env vars, KV, R2, etc.) durante
// `next dev`, usando a mesma wrangler.jsonc do build/deploy.
initOpenNextCloudflareForDev();
