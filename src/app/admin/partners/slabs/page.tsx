
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import SlabsTable from "./Slabs";

export const metadata: Metadata = {
  title: "Commissions",
  description:
    "List of Commissions Slabs on your Partner Platform",
  // other metadata
};

export default function Commissions() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Slabs" />
      <div className="space-y-6">
        
          <SlabsTable />
       
      </div>
    </div>
  );
}
