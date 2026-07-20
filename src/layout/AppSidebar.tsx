"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  LayoutDashboard,
  Blocks,
  Settings,
  ChevronDown,
  HandCoins,
  MoreHorizontal,
  List,
  Users,
  LineChart,
  Compass,
  Image as ImageIcon,
  Tag,
  Grid,
  Gift,
  Megaphone,
  Star,
  Award,
  PanelBottom,
  Layout,
  MessageCircle,
  MapPin,
  FileText,
  HelpCircle,
  ShieldCheck,
  ShoppingCart,
  ListTodo
} from "lucide-react";
import SidebarWidget from "./SidebarWidget";
import { useRBAC } from "../hooks/useRBAC";
import { RouteAccess } from "../lib/auth/roles";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path?: string;
    pro?: boolean;
    new?: boolean;
    icon?: React.ReactNode;
    subtitle?: string;
    subItems?: {
      name: string;
      path: string;
      icon?: React.ReactNode;
    }[];
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />, // You can use a HomeIcon if available, but GridIcon works for now
    name: "Main Overview",
    path: "/",
  },
  {
    icon: <Blocks size={20} />,
    name: "Business Dashboard",
    subItems: [
      { name: "Sales Analytics", path: "/sales-analytics", icon: <LineChart size={18} />, subtitle: "Revenue & sales metrics" },
      {
        name: "Home Page Sections",
        icon: <Layout size={18} />,
        subtitle: "Manage landing page",
        subItems: [
          { name: "Navigation", path: "/navigation", icon: <Compass size={16} /> },
          { name: "Hero Banners", path: "/hero-banners", icon: <ImageIcon size={16} /> },
          { name: "Promotions", path: "/promotions", icon: <Tag size={16} /> },
          { name: "Categories", path: "/categories", icon: <Grid size={16} /> },
          { name: "Exclusive Offers", path: "/exclusive-offers", icon: <Gift size={16} /> },
          { name: "Ads", path: "/ads", icon: <Megaphone size={16} /> },
          { name: "Store Features", path: "/store-features", icon: <Star size={16} /> },
          { name: "Brands", path: "/brands", icon: <Award size={16} /> },
          { name: "Footer", path: "/footer", icon: <PanelBottom size={16} /> },
        ]
      },
      { name: "Customers", path: "/customers", icon: <Users size={20} /> },
      { name: "All Orders", path: "/allorders", icon: <ListTodo size={20} /> },
      { name: "About Page", path: "/about", icon: <Settings size={20} /> },
      { name: "Contact Page", path: "/contact", icon: <MessageCircle size={20} /> },
      { name: "Store Locator", path: "/stores", icon: <MapPin size={20} />, },
      { name: "FAQ Page", path: "/faq", icon: <HelpCircle size={20} /> },

      {
        icon: <ShoppingCart size={20} />,
        name: "Product Catalog",
        subItems: [
          { name: "Products", path: "/products", icon: <ListTodo size={20} /> },
        ],
      },

      {
        name: "Policies",
        icon: <FileText size={18} />,
        subtitle: "Manage Policies",
        subItems: [
          { name: "Cancellation Policy", path: "/cancellation-policy", icon: <FileText size={16} /> },
          { name: "Return Policy", path: "/return-policy", icon: <FileText size={16} /> },
          { name: "Disclaimer Policy", path: "/disclaimer-policy", icon: <FileText size={16} /> },
          { name: "Privacy Policy", path: "/privacy-policy", icon: <FileText size={16} /> },
          { name: "Terms & Conditions", path: "/terms-and-conditions", icon: <FileText size={16} /> },
          { name: "Shipping Policy", path: "/shipping-policy", icon: <FileText size={16} /> },
          { name: "Replacement Policy", path: "/replacement-policy", icon: <FileText size={16} /> },
        ]
      },
    ],
  },
  {
    icon: <HandCoins size={20} />,
    name: "Operations Dashboard",
    subItems: [
      { icon: <Blocks size={20} />, name: "Payments", path: "/payments", },
    ],
  },

];

const othersItems: NavItem[] = [
  {
    icon: <Settings size={20} />,
    name: "Settings",
    subItems: [
      {
        icon: <ShieldCheck size={20} />,
        name: "User Management",
        path: "/users",
      },
    ],
  },


];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { hasRole } = useRBAC();

  const filterNavItems = (items: NavItem[]): NavItem[] => {
    return items
      .map((item) => {
        if (item.subItems) {
          const filteredSubItems = item.subItems
            .map((subItem) => {
              if (subItem.subItems) {
                const filteredNested = subItem.subItems.filter((nested) => {
                  const allowed = RouteAccess[nested.path];
                  return allowed ? hasRole(allowed) : hasRole(["ADMINISTRATOR"]);
                });
                if (filteredNested.length === 0) return null;
                return { ...subItem, subItems: filteredNested };
              }
              if (subItem.path) {
                const allowed = RouteAccess[subItem.path];
                const isAllowed = allowed ? hasRole(allowed) : hasRole(["ADMINISTRATOR"]);
                return isAllowed ? subItem : null;
              }
              return subItem;
            })
            .filter(Boolean) as typeof item.subItems;
          if (!filteredSubItems || filteredSubItems.length === 0) return null;
          return { ...item, subItems: filteredSubItems };
        }
        if (item.path) {
          if (item.path === "/") return item;
          const allowed = RouteAccess[item.path];
          const isAllowed = allowed ? hasRole(allowed) : hasRole(["ADMINISTRATOR"]);
          return isAllowed ? item : null;
        }
        return item;
      })
      .filter(Boolean) as NavItem[];
  };

  const filteredNavItems = filterNavItems(navItems);
  const filteredOthersItems = filterNavItems(othersItems);

  const renderMenuItems = (
    itemsToRender: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {itemsToRender.map((nav, index) => (
        <li key={`nav-${nav.name}-${index}`}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              className={`grid transition-all duration-300 ease-in-out ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
                }`}
            >
              <div className="overflow-hidden">
                <ul className="mt-2 space-y-1 ml-5">
                  {nav.subItems.map((subItem, subIndex) => (
                    <li key={`sub-${subItem.name}-${subIndex}`}>
                      {subItem.subItems ? (
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleNestedSubmenuToggle(index, subIndex)}
                            className={`menu-dropdown-item flex items-center gap-3 py-2 px-3 w-full text-left rounded-md ${openNestedSubmenu?.parentIndex === index && openNestedSubmenu?.nestedIndex === subIndex
                              ? "bg-brand-50/50 dark:bg-white/[0.02]"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-white/[0.02] dark:hover:text-gray-200"
                              }`}
                          >
                            {subItem.icon && (
                              <span className={`shrink-0 ${openNestedSubmenu?.parentIndex === index && openNestedSubmenu?.nestedIndex === subIndex ? "text-brand-500" : "text-gray-400 dark:text-gray-500"}`}>
                                {subItem.icon}
                              </span>
                            )}
                            <div className="flex flex-col flex-1">
                              <span className={`font-medium text-sm ${openNestedSubmenu?.parentIndex === index && openNestedSubmenu?.nestedIndex === subIndex ? "text-brand-500" : ""}`}>{subItem.name}</span>
                              {subItem.subtitle && (
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{subItem.subtitle}</span>
                              )}
                            </div>
                            <ChevronDown
                              className={`ml-auto w-4 h-4 transition-transform duration-200 ${openNestedSubmenu?.parentIndex === index && openNestedSubmenu?.nestedIndex === subIndex
                                ? "rotate-180 text-brand-500"
                                : ""
                                }`}
                            />
                          </button>

                          <div
                            className={`grid transition-all duration-300 ease-in-out ${openNestedSubmenu?.parentIndex === index && openNestedSubmenu?.nestedIndex === subIndex
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                              }`}
                          >
                            <div className="overflow-hidden">
                              <ul className="mt-1 space-y-1 ml-6 border-l border-gray-200 dark:border-gray-800 pl-3">
                                {subItem.subItems.map((nestedItem, nestedIndex) => (
                                  <li key={`nested-${nestedItem.name}-${nestedIndex}`}>
                                    <Link
                                      href={nestedItem.path}
                                      className={`flex items-center gap-3 py-1.5 px-2 rounded-md transition-colors ${isActive(nestedItem.path)
                                        ? "bg-brand-50/50 dark:bg-white/[0.02] text-brand-600 dark:text-brand-400"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-white/[0.02] dark:hover:text-gray-200"
                                        }`}
                                    >
                                      {nestedItem.icon && (
                                        <span className={`shrink-0 ${isActive(nestedItem.path) ? "text-brand-500" : "text-gray-400 dark:text-gray-500"}`}>
                                          {nestedItem.icon}
                                        </span>
                                      )}
                                      <span className="font-medium text-[13px]">{nestedItem.name}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        subItem.path && (
                          <Link
                            href={subItem.path}
                            className={`menu-dropdown-item flex items-start gap-3 py-2 px-3 ${isActive(subItem.path)
                              ? "menu-dropdown-item-active bg-brand-50/50 dark:bg-white/[0.02]"
                              : "menu-dropdown-item-inactive"
                              }`}
                          >
                            {subItem.icon && (
                              <span className={`shrink-0 mt-0.5 ${isActive(subItem.path) ? "text-brand-500" : "text-gray-400 dark:text-gray-500"}`}>
                                {subItem.icon}
                              </span>
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{subItem.name}</span>
                              {subItem.subtitle && (
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{subItem.subtitle}</span>
                              )}
                            </div>
                            <span className="flex items-center gap-1 ml-auto">
                              {subItem.new && (
                                <span
                                  className={`ml-auto ${isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                    } menu-dropdown-badge `}
                                >
                                  new
                                </span>
                              )}
                              {subItem.pro && (
                                <span
                                  className={`ml-auto ${isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                    } menu-dropdown-badge `}
                                >
                                  pro
                                </span>
                              )}
                            </span>
                          </Link>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<{
    parentIndex: number;
    nestedIndex: number;
  } | null>(null);

  const handleNestedSubmenuToggle = (parentIndex: number, nestedIndex: number) => {
    setOpenNestedSubmenu((prev) => {
      if (prev && prev.parentIndex === parentIndex && prev.nestedIndex === nestedIndex) {
        return null;
      }
      return { parentIndex, nestedIndex };
    });
  };

  const isActive = useCallback((path: string) => {
    if (path === pathname) return true;
    if (path === '/customers' && pathname.startsWith('/customers/')) return true;
    if (path === '/users' && pathname.startsWith('/users/')) return true;
    return false;
  }, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    let nestedMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem, subIndex) => {
            if (subItem.path && isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            } else if (subItem.subItems) {
              subItem.subItems.forEach((nestedItem) => {
                if (isActive(nestedItem.path)) {
                  setOpenSubmenu({
                    type: menuType as "main" | "others",
                    index,
                  });
                  setOpenNestedSubmenu({
                    parentIndex: index,
                    nestedIndex: subIndex
                  });
                  submenuMatched = true;
                  nestedMatched = true;
                }
              });
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
    if (!nestedMatched) {
      setOpenNestedSubmenu(null);
    }
  }, [pathname, isActive]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
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
        className={`py-8 flex items-center justify-center  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="rounded-lg overflow-hidden">
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={100}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                width={100}
                height={40}
              />
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <MoreHorizontal />
                )}
              </h2>
              {renderMenuItems(filteredOthersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
