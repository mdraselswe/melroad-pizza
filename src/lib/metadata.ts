import type { Metadata } from "next";
import { stripAccent } from "@/components/ui/rich-text";
import { pageUrl } from "@/constants/routes";

/** Per-page metadata; titles may contain [accent] markup, which is stripped. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const plain = stripAccent(title);
  return {
    title: plain,
    description,
    alternates: { canonical: pageUrl(path) },
    openGraph: { title: plain, description, url: pageUrl(path) },
  };
}
