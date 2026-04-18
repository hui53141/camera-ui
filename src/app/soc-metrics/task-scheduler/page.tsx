"use client";

import { useState } from "react";
import { Plus, Pause, Play, Pencil } from "lucide-react";

type TaskStatus = "active" | "paused" | "completed";

interface ScheduledTask {
  id: string;
  name: string;
  cron: string;
  type: string;
  status: TaskStatus;
  lastRun: string;
  nextRun: string;
}

const initialTasks: ScheduledTask[] = [
  {
    id: "1",
    name: "Camera启动性能采集",
    cron: "0 2 * * *",
    type: "数据采集",
    status: "active",
    lastRun: "2024-01-15 02:00",
    nextRun: "2024-01-16 02:00",
  },
  {
    id: "2",
    name: "帧率自动化测试",
    cron: "0 3 * * 1",
    type: "自动化测试",
    status: "active",
    lastRun: "2024-01-15 03:00",
    nextRun: "2024-01-22 03:00",
  },
  {
    id: "3",
    name: "内存泄漏检测",
    cron: "0 4 * * *",
    type: "检测任务",
    status: "paused",
    lastRun: "2024-01-14 04:00",
    nextRun: "—",
  },
  {
    id: "4",
    name: "性能报告自动发送",
    cron: "0 9 * * 5",
    type: "报告发送",
    status: "active",
    lastRun: "2024-01-12 09:00",
    nextRun: "2024-01-19 09:00",
  },
  {
    id: "5",
    name: "数据清理任务",
    cron: "0 0 1 * *",
    type: "维护任务",
    status: "completed",
    lastRun: "2024-01-01 00:00",
    nextRun: "2024-02-01 00:00",
  },
];

const statusConfig: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  active: {
    label: "运行中",
    className: "bg-green-50 text-green-700 ring-green-600/20",
  },
  paused: {
    label: "已暂停",
    className: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  },
  completed: {
    label: "已完成",
    className: "bg-gray-50 text-gray-600 ring-gray-500/10",
  },
};

export default function TaskSchedulerPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>(initialTasks);

  const toggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === "completed") return t;
        return {
          ...t,
          status: t.status === "active" ? "paused" : "active",
          nextRun: t.status === "active" ? "—" : t.nextRun,
        };
      }),
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">任务调度</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理定时任务，包括数据采集、自动化测试和报告发送等
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          新建任务
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                任务名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cron表达式
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                任务类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                上次执行
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                下次执行
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => {
              const badge = statusConfig[task.status];
              return (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {task.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-gray-600">
                    {task.cron}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {task.type}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {task.lastRun}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {task.nextRun}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        编辑
                      </button>
                      {task.status !== "completed" && (
                        <button
                          type="button"
                          onClick={() => toggleStatus(task.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          {task.status === "active" ? (
                            <>
                              <Pause className="h-3.5 w-3.5" />
                              暂停
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5" />
                              恢复
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
