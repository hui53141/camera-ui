import Link from "next/link";
import { Camera, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SOC度量平台</h1>
        <p className="text-gray-500 text-lg">
          Camera性能度量与任务调度管理平台，提供启动专项、切换专项、帧率帧间隔、内存等多维度数据分析。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/soc-metrics/camera/startup"
          className="group block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Camera className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Camera度量</h2>
          </div>
          <p className="text-gray-500">
            查看Camera启动、切换、帧率、内存等性能度量数据与趋势分析。
          </p>
        </Link>

        <Link
          href="/soc-metrics/task-scheduler"
          className="group block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-100 transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">任务调度</h2>
          </div>
          <p className="text-gray-500">
            管理和监控自动化测试任务的调度与执行状态。
          </p>
        </Link>
      </div>
    </div>
  );
}
