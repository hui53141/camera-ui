"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useReportStore } from "@/stores/report-store";

export function EmailForm() {
  const [ccInput, setCcInput] = useState("");

  const ccList = useReportStore((s) => s.ccList);
  const addCc = useReportStore((s) => s.addCc);
  const removeCc = useReportStore((s) => s.removeCc);
  const subject = useReportStore((s) => s.subject);
  const setSubject = useReportStore((s) => s.setSubject);
  const versionInfo = useReportStore((s) => s.versionInfo);
  const setVersionInfo = useReportStore((s) => s.setVersionInfo);
  const topIssues = useReportStore((s) => s.topIssues);
  const setTopIssues = useReportStore((s) => s.setTopIssues);

  const handleCcKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const email = ccInput.trim();
      if (email) {
        addCc(email);
        setCcInput("");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Row 1 – CC List */}
      <section className="border-b border-gray-200 pb-6">
        <label className="block text-sm font-medium text-gray-500 mb-2">
          邮件抄送人：
        </label>
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          {ccList.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
            >
              {email}
              <button
                type="button"
                onClick={() => removeCc(email)}
                className="inline-flex items-center justify-center rounded-full hover:bg-blue-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={ccInput}
            onChange={(e) => setCcInput(e.target.value)}
            onKeyDown={handleCcKeyDown}
            placeholder="输入邮箱后按 Enter 添加"
            className="flex-1 min-w-[180px] border-none outline-none text-sm py-1 bg-transparent"
          />
        </div>
      </section>

      {/* Row 2 – Subject */}
      <section className="border-b border-gray-200 pb-6">
        <label className="block text-sm font-medium text-gray-500 mb-2">
          邮件主题：
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="请输入邮件主题"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </section>

      {/* Row 3 – Version Info */}
      <section className="border-b border-gray-200 pb-6">
        <label className="block text-sm font-medium text-gray-500 mb-2">
          验证版本信息：
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">平台</label>
            <input
              type="text"
              value={versionInfo.platform}
              onChange={(e) =>
                setVersionInfo({ ...versionInfo, platform: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">产品</label>
            <input
              type="text"
              value={versionInfo.product}
              onChange={(e) =>
                setVersionInfo({ ...versionInfo, product: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              最近一次测试版本信息
            </label>
            <input
              type="text"
              value={versionInfo.version}
              onChange={(e) =>
                setVersionInfo({ ...versionInfo, version: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Row 4 – Top Issues */}
      <section>
        <label className="block text-sm font-medium text-gray-500 mb-2">
          Top问题：
        </label>
        <textarea
          value={topIssues}
          onChange={(e) => setTopIssues(e.target.value)}
          placeholder="请输入单号及关键问题描述..."
          rows={5}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        />
      </section>
    </div>
  );
}
