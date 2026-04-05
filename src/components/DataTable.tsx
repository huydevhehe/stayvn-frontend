import React from "react";
import { cn } from "../lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  onRowClick,
  isLoading,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-white/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b tracking-wider">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={cn("px-6 py-5 font-bold", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    "group hover:bg-primary/5 transition-all duration-200",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((column, index) => (
                    <td key={index} className={cn("px-6 py-4 text-foreground/80 group-hover:text-foreground transition-colors", column.className)}>
                      {typeof column.accessor === "function"
                        ? column.accessor(item)
                        : (item[column.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <p className="text-lg font-medium">Không tìm thấy kết quả</p>
                    <p className="text-sm">Hãy thử điều chỉnh bộ lọc hoặc thêm mục mới.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
