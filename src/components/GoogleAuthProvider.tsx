"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";

export default function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
    fetch(`${BASE_URL}/auth/google/config`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.client_id) {
          setClientId(data.client_id);
        }
      })
      .catch(() => {
        // silently fail — Google login button will simply not work
      });
  }, []);

  if (!clientId) {
    // Render children without the provider while the client ID is loading.
    // The GoogleLoginButton won't be functional yet but the rest of the page renders normally.
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
