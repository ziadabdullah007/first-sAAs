export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-[#e4e2df]">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={`h-3.5 ${j === 0 ? "w-36" : j === cols - 1 ? "w-16" : "w-24"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-[#e4e2df] rounded-lg p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-[#e4e2df] rounded-lg p-4 space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="bg-white border border-[#e4e2df] rounded-lg p-4 space-y-3">
          <Skeleton className="h-3 w-24" />
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </div>
      </div>
    </div>
  );
}
