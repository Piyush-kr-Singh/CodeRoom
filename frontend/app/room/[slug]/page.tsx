import type { Metadata } from "next";

import { RoomExperience } from "@/components/room/room-experience";
import { siteConfig } from "@/lib/site";

type RoomPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Room ${slug} | ${siteConfig.name}`,
    description: "Collaborate in a real-time anonymous code room with optional password protection and expiring access."
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params;

  return <RoomExperience slug={slug} />;
}
