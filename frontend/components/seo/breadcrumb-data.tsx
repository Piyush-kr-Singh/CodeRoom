import { siteConfig } from "@/lib/site";
import { StructuredData } from "./structured-data";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type BreadcrumbDataProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbData({ items }: BreadcrumbDataProps) {
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.domain
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.name,
      item: `${siteConfig.domain}${item.path}`
    }))
  ];

  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement
      }}
    />
  );
}
