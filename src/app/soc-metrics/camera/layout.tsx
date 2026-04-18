import { TabNav } from "@/components/layout/TabNav";

const tabs = [
  { label: "启动专项", href: "/soc-metrics/camera/startup" },
  { label: "切换专项", href: "/soc-metrics/camera/switching" },
  { label: "帧率帧间隔", href: "/soc-metrics/camera/frame-rate" },
  { label: "静态内存", href: "/soc-metrics/camera/static-memory" },
  { label: "峰值内存", href: "/soc-metrics/camera/peak-memory" },
  { label: "报告发送", href: "/soc-metrics/camera/report" },
];

export default function CameraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TabNav tabs={tabs} />
      <div className="mt-4">{children}</div>
    </div>
  );
}
