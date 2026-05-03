"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";

export default function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the build-time env var as the initial value so SSR/prerendering always
  // has a GoogleOAuthProvider in the tree (required by useGoogleLogin).
  // After hydration we fetch the real client ID from the database and swap it in.
  const [clientId, setClientId] = useState<string>(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
  );

  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
    fetch(`${BASE_URL}/auth/google/config`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.client_id) {
          setClientId(data.client_id);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
