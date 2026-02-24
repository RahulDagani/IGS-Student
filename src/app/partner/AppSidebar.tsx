"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  ChevronDownIcon,
  HorizontaLDots,
} from "@/icons/index";

import {
  LayoutDashboard,
  Users,
  Book,
  FileText,
  Mail,
  Wallet,
  Settings,
  ArrowLeft,
  Percent,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Types for API response
interface ChildModule {
  id: number;
  module_id: number;
  name: string;
  slug: string;
  icon: string;
  route: string;
  sort_order: number;
  status: number;
  child_modules: ChildModule[];
}

interface Module {
  id: number;
  name: string;
  sort_order: number;
  status: number;
  sub_modules: ChildModule[];
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: NavItem[];
}

// Static items that don't come from API
const staticNavItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/",
  },
];

const AppSidebar: React.FC = () => {
  const router = useRouter();
  const { adminToken, adminReLoginFromAgent, user } = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // State for dynamic modules
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
  const isAgent = user ? user.panel_type == "agent" : false;

  const {token} = useAuth();

  // Fetch modules from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/modules`,{
          headers:{
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const data = await response.json();
        setModules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load modules');
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Convert HTML icon string to React component
  const parseIcon = (iconString: string): React.ReactNode => {
    // This is a simplified approach - you might need a more robust solution
    // to parse SVG strings into React components
    const iconMap: Record<string, React.ReactNode> = {
      'dashboard': <LayoutDashboard size={18} />,
      'users': <Users size={18} />,
      'university': <Book size={18} />,
      'file-text': <FileText size={18} />,
      'percent': <Percent size={18} />,
      'wallet': <Wallet size={18} />,
      'mail': <Mail size={18} />,
      'settings': <Settings size={18} />,
    };

    // Try to determine which icon to use based on the name or slug
    const iconKey = iconString.toLowerCase();
    if (iconKey.includes('dashboard')) return iconMap['dashboard'];
    if (iconKey.includes('users') || iconKey.includes('student')) return iconMap['users'];
    if (iconKey.includes('program') || iconKey.includes('university')) return iconMap['university'];
    if (iconKey.includes('application') || iconKey.includes('file')) return iconMap['file-text'];
    if (iconKey.includes('commission') || iconKey.includes('percent')) return iconMap['percent'];
    if (iconKey.includes('wallet')) return iconMap['wallet'];
    if (iconKey.includes('mail') || iconKey.includes('resource')) return iconMap['mail'];
    if (iconKey.includes('account') || iconKey.includes('setting')) return iconMap['settings'];
    
    // Default icon
    return <LayoutDashboard size={18} />;
  };

  // Recursive function to convert API modules to NavItems
  const convertToNavItems = (modules: ChildModule[]): NavItem[] => {
    return modules
      .filter(module => module.status === 1) // Only include active modules
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(module => {
        const navItem: NavItem = {
          name: module.name,
          icon: parseIcon(module.icon),
          path: module.child_modules && module.child_modules.length > 0 
            ? undefined 
            : `/${module.route}`,
        };

        if (module.child_modules && module.child_modules.length > 0) {
          navItem.subItems = convertToNavItems(module.child_modules);
        }

        return navItem;
      });
  };

  // Create dynamic nav items from API modules
  const dynamicNavItems = modules
    .filter(module => module.status === 1)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(module => ({
      section: module.name,
      items: convertToNavItems(module.sub_modules || [])
    }));

  // Create computed navigation items based on adminToken
  const [computedNavItems, setComputedNavItems] = useState<NavItem[]>(staticNavItems);
  
  useEffect(() => {
    const updatedItems = [...staticNavItems];
    
    if (adminToken) {
      updatedItems.unshift({
        name: "Go to Admin Panel",
        icon: <ArrowLeft size={18} />,
        path: "#",
      });
    }
    
    setComputedNavItems(updatedItems);
  }, [adminToken]);

  const isActive = useCallback((path: string | undefined): boolean => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(path + '/');
  }, [pathname]);

  const handleAdminReLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/agent/admin/login`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      
      const data = await response.json();

      if (data.status == "success") {
        const { user, token } = data.data;
        adminReLoginFromAgent(user, token);
        router.push("/admin/partners/agents");
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      alert("Login failed");
    }     
  };

  const NavItemComponent: React.FC<{ 
    item: NavItem; 
    level?: number;
    parentKey?: string;
    section?: string;
  }> = ({ item, level = 0, parentKey = '', section = '' }) => {
    const itemKey = parentKey 
      ? `${section}-${parentKey}-${item.name}` 
      : `${section}-${item.name}`;
      
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isSubmenuOpen = openSubmenus.has(itemKey);
  
    return (
      <li>
        {hasSubItems ? (
          <>
            <button
              onClick={() => handleSubmenuToggle(itemKey)}
              className={`menu-item group w-full text-left ${
                isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
              style={{ paddingLeft: `${level * 20 + 16}px` }}
            >
              <span className={isSubmenuOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                {item.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{item.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
            
            {(isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => { subMenuRefs.current[itemKey] = el; }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen ? `${subMenuRefs.current[itemKey]?.scrollHeight || 0}px` : "0px",
                }}
              >
                <ul className="flex flex-col gap-1 mt-1">
                  {item.subItems!.map((subItem) => (
                    <NavItemComponent 
                      key={subItem.name} 
                      item={subItem} 
                      level={level + 1}
                      parentKey={itemKey}
                      section={section}
                    />
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          item.path && (
            <Link
              href={"/partner" + item.path}
              className={`menu-item group ${
                isActive(item.path) ? "menu-item-active" : "menu-item-inactive"
              }`}
              style={{ paddingLeft: `${level * 20 + 16}px` }}
            >
              <span className={isActive(item.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                {item.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{item.name}</span>
              )}
            </Link>
          )
        )}
      </li>
    );
  };

  const renderMainMenuItems = () => (
    <ul className="flex flex-col gap-4">
      {computedNavItems.map((item) => {
        if (item.name === "Go to Admin Panel" && adminToken) {
          return (
            <li key={item.name}>
              <div
                onClick={handleAdminReLogin}
                className={`menu-item group cursor-pointer`}
                style={{ paddingLeft: `16px` }}
              >
                <span className={"menu-item-icon-inactive"}>
                  <ArrowLeft size={19}/>
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text dark:text-white">
                    {item.name}
                  </span>
                )}
              </div>
            </li>
          );
        }
        return (
          <NavItemComponent 
            key={item.name} 
            item={item} 
            section="main" 
          />
        );
      })}
    </ul>
  );

  const renderDynamicSections = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-sm py-2">
          Failed to load menu items
        </div>
      );
    }

    return dynamicNavItems.map((section, index) => (
      <div key={index} className="mt-4">
        <h2
          className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
            !isExpanded && !isHovered
              ? "lg:justify-center"
              : "justify-start"
          }`}
        >
          {isExpanded || isHovered || isMobileOpen ? (
            section.section
          ) : (
            <HorizontaLDots />
          )}
        </h2>
        <ul className="flex flex-col gap-4">
          {section.items
            .filter(item => {
              // Filter items based on user type
              if (!isAgent && item.name === "Wallet") {
                return false;
              }
              return true;
            })
            .map((item) => (
              <NavItemComponent 
                key={item.name} 
                item={item} 
                section={section.section} 
              />
            ))}
        </ul>
      </div>
    ));
  };

  const handleSubmenuToggle = (itemKey: string) => {
    setOpenSubmenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  // Auto-open submenus based on current path
  useEffect(() => {
    const findAndOpenParentMenus = (items: NavItem[], currentPath: string, parentKeys: string[] = []): boolean => {
      for (const item of items) {
        const itemKey = parentKeys.length > 0 ? `${parentKeys.join('-')}-${item.name}` : item.name;
        
        if (item.path === currentPath) {
          parentKeys.forEach((key, index) => {
            const parentKey = parentKeys.slice(0, index + 1).join('-');
            setOpenSubmenus(prev => new Set(prev).add(parentKey));
          });
          return true;
        }

        if (item.subItems) {
          const found = findAndOpenParentMenus(item.subItems, currentPath, [...parentKeys, item.name]);
          if (found) {
            setOpenSubmenus(prev => new Set(prev).add(itemKey));
            return true;
          }
        }
      }
      return false;
    };

    setOpenSubmenus(new Set());
    
    // Find and open menus for main nav items
    findAndOpenParentMenus(staticNavItems, pathname);
    
    // Find and open menus for dynamic items
    dynamicNavItems.forEach(section => {
      findAndOpenParentMenus(section.items, pathname);
    });
  }, [pathname, dynamicNavItems]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/partner">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex justify-center items-center">
                <Image
                  className=""
                  src="/images/logo/logo.png"
                  alt="Logo"
                  width={45}
                  height={45}
                />
                <span className="dark:text-white ms-1 text-black font-semibold text-2xl">
                  ApplyTech
                </span>
              </div>
            </>
          ) : (
            <Image
              className=""
              src="/images/logo/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Main Menu Section */}
           

            {/* Dynamic Sections from API */}
            {renderDynamicSections()}
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? null : null}
      </div>
    </aside>
  );
};

export default AppSidebar;