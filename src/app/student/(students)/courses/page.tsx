import { Metadata } from "next";
import { Suspense } from "react";
import ProgramCards from "./Programs";

export const metadata: Metadata = {
  title: "Programs",
  description: "All Programs",
};

export default function Programs() {
  return (
    <div>
      <div className="space-y-6">
        <Suspense>
          <ProgramCards />
        </Suspense>
      </div>
    </div>
  );
}
