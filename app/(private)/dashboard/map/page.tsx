import { MapPageClient } from "@/components";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function MapPage() {
  return <MapPageClient />;
}
