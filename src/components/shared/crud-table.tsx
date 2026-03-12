import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react';
import { TableColumn } from '@/types/crud';
import { cn } from '@/lib/utils';

interface CrudTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    isLoading: boolean;
    pagination?: {
        page: number;
        pageSize: number;
        onPageChange: (page: number) => void;
        hasMore?: boolean;
        totalElements?: number;
    };
    className?: string;
}

export function CrudTable<T>({ data, columns, isLoading, pagination, className }: CrudTableProps<T>) {
    if (isLoading) {
        return (
            <div className={cn(
                "w-full h-64 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950",
                className
            )}>
                <div className="w-8 h-8 border-[3px] border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white rounded-full animate-spin mb-4" />
                <span className="text-sm text-zinc-400 font-medium">Loading data...</span>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={cn(
                "w-full h-64 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-xl border-dashed bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-500 text-sm",
                className
            )}>
                No records found.
            </div>
        );
    }

    return (
        <div className={cn(
            "w-full flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden",
            className
        )}>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 dark:text-zinc-400 font-semibold tracking-wider">
                        <tr>
                            {columns.map((col, idx) => (
                                <th 
                                    key={idx} 
                                    className={cn(
                                        "px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap",
                                        col.align === 'center' && "text-center",
                                        col.align === 'right' && "text-right"
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                                {columns.map((col, colIdx) => (
                                    <td 
                                        key={colIdx} 
                                        className={cn(
                                            "px-4 sm:px-6 py-3 whitespace-nowrap text-zinc-700 dark:text-zinc-300",
                                            col.align === 'center' && "text-center",
                                            col.align === 'right' && "text-right"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center",
                                            col.align === 'center' && "justify-center",
                                            col.align === 'right' && "justify-end"
                                        )}>
                                            {col.render ? col.render(row) : (row as any)[col.accessorKey as string]}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sticky Pagination Footer */}
            {pagination && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Page {pagination.page + 1}
                        {pagination.totalElements !== undefined && (
                            <span className="ml-1">
                                of {Math.max(1, Math.ceil(pagination.totalElements / Math.max(1, pagination.pageSize)))} ({pagination.totalElements} records)
                            </span>
                        )}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => pagination.onPageChange(0)}
                            disabled={pagination.page === 0 || isLoading}
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Go to first page"
                        >
                            <ChevronsLeft size={18} />
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(Math.max(0, pagination.page - 1))}
                            disabled={pagination.page === 0 || isLoading}
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Previous page"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={!pagination.hasMore || isLoading}
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Next page"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
