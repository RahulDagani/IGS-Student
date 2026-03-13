"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/app/student/AppHeader";
import AppSidebar from "@/app/student/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import RoleGuard from "@/components/RoleGuard";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Check if the current path is under /student or is the root path
  const isStudentRoute = pathname?.startsWith('/student') || pathname === '/';

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  // If it's not a student route (and not root), render children normally
  if (!isStudentRoute) {
    return <>{children}</>;
  }

  // For root path and /student/* paths, render with student layout
  return (
    <RoleGuard allowedRoles={["student"]}>
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}