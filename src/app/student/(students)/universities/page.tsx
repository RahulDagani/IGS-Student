import { Metadata } from "next";
import Universities from "./Universities";

export const metadata: Metadata = {
  title: "Universities",
  description: "Browse universities and explore programs",
};

export default function UniversitiesPage() {
  return (
    <div>
      <div className="space-y-6">
        <Universities />
      </div>
    </div>
  );
}
