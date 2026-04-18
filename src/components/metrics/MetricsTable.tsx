"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef as TanstackColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { checkHighlight } from "@/lib/highlight-rules";

interface HighlightRule {
  condition: string;
  color: string;
  ruleName: string;
}

interface ColumnDef {
  key: string;
  label: string;
  unit?: string;
  highlightRules?: HighlightRule[];
  baselineKey?: string;
  thresholdKey?: string;
}

interface MetricsTableProps {
  data: Array<Record<string, unknown>>;
  columns: ColumnDef[];
  title: string;
}

export function MetricsTable({ data, columns, title }: MetricsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const tanstackColumns = useMemo<TanstackColumnDef<Record<string, unknown>>[]>(
    () =>
      columns.map((col) => ({
        accessorKey: col.key,
        header: () => (
          <span className="flex items-center gap-1">
            {col.label}
            {col.unit && (
              <span className="text-xs font-normal text-gray-400">
                ({col.unit})
              </span>
            )}
          </span>
        ),
        cell: ({ row }) => {
          const value = row.getValue(col.key);

          if (col.highlightRules && typeof value === "number") {
            const baseline = col.baselineKey
              ? (row.original[col.baselineKey] as number | null) ?? null
              : null;
            const threshold = col.thresholdKey
              ? (row.original[col.thresholdKey] as number | null) ?? null
              : null;

            const result = checkHighlight(
              value,
              baseline,
              threshold,
              col.highlightRules,
            );

            if (result.highlighted) {
              return (
                <span
                  className="inline-block rounded px-2 py-0.5 font-bold"
                  style={{ backgroundColor: result.color + "20", color: result.color }}
                  title={result.reason}
                >
                  {value}
                </span>
              );
            }
          }

          if (typeof value === "number") {
            return value;
          }

          return String(value ?? "");
        },
      })),
    [columns],
  );

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 text-base font-semibold text-gray-800">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer select-none px-4 py-3 text-left font-medium text-gray-600 hover:text-gray-900"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: <ArrowUp className="h-3.5 w-3.5" />,
                        desc: <ArrowDown className="h-3.5 w-3.5" />,
                      }[header.column.getIsSorted() as string] ?? (
                        <ArrowUpDown className="h-3.5 w-3.5 text-gray-300" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                  idx % 2 === 1 ? "bg-gray-50/50" : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
