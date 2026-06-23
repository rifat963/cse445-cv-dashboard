import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const longLivedPublicAssetHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
      {
        key: "CDN-Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
      {
        key: "Vercel-CDN-Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];

    return [
      {
        source: "/:path*\\.(webp|png|jpg|jpeg|svg|ico|ipynb)",
        headers: longLivedPublicAssetHeaders,
      },
      {
        source: "/notebooks/:path*",
        headers: [
          ...longLivedPublicAssetHeaders,
          {
            key: "X-Robots-Tag",
            value: "noindex, noarchive",
          },
        ],
      },
      {
        source: "/api/drive-html/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, noarchive",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
