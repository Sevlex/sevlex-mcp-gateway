import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/console", "/api/"],
      },
    ],
    sitemap: "https://sevlex.com/sitemap.xml",
  };
}
