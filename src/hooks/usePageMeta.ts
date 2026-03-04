import { useEffect } from "react";

interface PageMetaOptions {
  title: string;
  description: string;
}

/** Sets document title and meta description. Reverts on unmount. */
export function usePageMeta({ title, description }: PageMetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, [title, description]);
}
