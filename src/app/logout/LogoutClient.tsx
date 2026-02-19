"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LogoutClient() {
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType") || "";

  useEffect(() => {
    const performLogout = async () => {
      try {
        logout(userType);

        if (userType === "agent") {
          router.push("/signin/agent");
        } else if (userType === "student") {
          router.push("/signin/student");
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        router.push("/signin");
      }
    };

    performLogout();
  }, [logout, router, userType]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Logging out
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we securely sign you out...
        </p>
      </div>
    </div>
  );
}
