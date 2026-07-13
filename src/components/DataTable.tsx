import React, { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  children: ReactNode;
}

export function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-zinc-50 dark:bg-zinc-900/40 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 ${
                    index === headers.length - 1 ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
