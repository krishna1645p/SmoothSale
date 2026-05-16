"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Kanban,
  LinkedinLogo,
  ChartBar,
  Package,
} from "@phosphor-icons/react";

const navItems = [
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/lead-intel", label: "Lead Intel", icon: LinkedinLogo },
  { href: "/analytics", label: "Analytics", icon: ChartBar },
  { href: "/add-product", label: "Add Product/Service", icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-gray-50 border-r border-gray-200 flex flex-col z-20">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-900 tracking-tight">
          SmoothSale
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Sales Copilot</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "text-gray-900 bg-white shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white"
              }`}
            >
              <Icon size={18} weight="light" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            CK
          </div>
          <span className="text-sm text-gray-700">Chinmaya</span>
        </div>
      </div>
    </aside>
  );
}
