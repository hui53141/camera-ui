"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Camera,
  Calendar,
  ChevronDown,
  ChevronRight,
  BarChart3,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "soc-metrics": true,
  });

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] flex flex-col z-40">
      {/* App Title */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <BarChart3 className="w-6 h-6 text-blue-400" />
        <span className="text-lg font-bold tracking-wide">Camera UI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* SOC度量 - expandable */}
        <div>
          <button
            onClick={() => toggleExpand("soc-metrics")}
            className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--sidebar-hover)] ${
              isActive("/soc-metrics") ? "text-white" : "text-slate-300"
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">SOC度量</span>
            {expandedItems["soc-metrics"] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {expandedItems["soc-metrics"] && (
            <div className="ml-4">
              {/* Camera度量 */}
              <Link
                href="/soc-metrics/camera/startup"
                className={`flex items-center gap-3 px-5 py-2 text-sm transition-colors rounded-l-md ${
                  isActive("/soc-metrics/camera")
                    ? "bg-[var(--sidebar-active)] text-white"
                    : "text-slate-400 hover:bg-[var(--sidebar-hover)] hover:text-white"
                }`}
              >
                <Camera className="w-4 h-4 shrink-0" />
                <span>Camera度量</span>
              </Link>

              {/* 任务调度 */}
              <Link
                href="/soc-metrics/task-scheduler"
                className={`flex items-center gap-3 px-5 py-2 text-sm transition-colors rounded-l-md ${
                  isActive("/soc-metrics/task-scheduler")
                    ? "bg-[var(--sidebar-active)] text-white"
                    : "text-slate-400 hover:bg-[var(--sidebar-hover)] hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>任务调度</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
