"use client";

import * as React from "react";
import Image from "next/image";
import { Home, LogOut, Package } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export function AppSidebar({
  dir = "ltr",
  ...props
}: React.ComponentProps<typeof Sidebar> & { dir?: "ltr" | "rtl" }) {
  const t = useTranslations("sidebar");
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const pathname = usePathname();
  const { theme } = useTheme();

  const items = [
    { title: t("home"), url: "/", icon: Home },
    { title: t("products"), url: "/products", icon: Package },
  ];

  const MenuLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof Link>
  >(({ href, children, ...props }, ref) => (
    <Link href={href} ref={ref} {...props}>
      {children}
    </Link>
  ));
  MenuLink.displayName = "MenuLink";

  return (
    <TooltipProvider>
      <Sidebar
        dir={dir}
        collapsible="offcanvas"
        side={dir === "rtl" ? "right" : "left"}
        className="data-[state=collapsed]:w-0"
        {...props}
      >
        <SidebarHeader className="border-b">
          <Link href="/dashboard" className="flex items-center">
            {theme === "dark" ? (
              <Image
                src="/logo-dark.png"
                alt="Company Logo"
                width={150}
                height={40}
              />
            ) : (
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={150}
                height={40}
              />
            )}
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className={isExpanded ? "" : "sr-only"}>
              Application
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <MenuLink
                            href={item.url}
                            className="flex items-center w-full"
                          >
                            <item.icon className={isExpanded ? "mr-2" : ""} />
                            {isExpanded && <span>{item.title}</span>}
                          </MenuLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {!isExpanded && (
                        <TooltipContent side={dir === "rtl" ? "left" : "right"}>
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
