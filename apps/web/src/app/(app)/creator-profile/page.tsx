import type { Metadata } from "next";
import { CreatorProfileClient } from "./creator-profile-client";

export const metadata: Metadata = {
  title: "Creator Profile",
};

export default function CreatorProfilePage() {
  return <CreatorProfileClient />;
}
