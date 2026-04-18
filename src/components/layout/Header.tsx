"use client";

import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  "soc-metrics": "SOC度量",
  camera: "Camera度量",
  "task-scheduler": "任务调度",
  startup: "启动专项",
  switching: "切换专项",
  "frame-rate": "帧率帧间隔",
  "static-memory": "静态内存",
  "peak-memory": "峰值内存",
  report: "报告发送",
};

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-14 border-b border-[var(--border)] bg-white flex items-center px-6 shrink-0">
      <nav className="flex items-center text-sm text-[var(--muted)]">
        {segments.map((segment, index) => {
          const label = labelMap[segment] || segment;
          const isLast = index === segments.length - 1;

          return (
            <span key={segment + index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-300">/</span>}
              <span className={isLast ? "text-gray-900 font-medium" : ""}>
                {label}
              </span>
            </span>
          );
        })}
        {segments.length === 0 && (
          <span className="text-gray-900 font-medium">首页</span>
        )}
      </nav>
    </header>
  );
}
