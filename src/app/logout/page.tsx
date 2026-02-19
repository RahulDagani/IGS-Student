import { Suspense } from "react";
import LogoutClient from "./LogoutClient";

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Logging out...</div>}>
      <LogoutClient />
    </Suspense>
  );
}
