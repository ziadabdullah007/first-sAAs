interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, perPage, onChange }: PaginationProps) {
  const pages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#e4e2df] bg-white">
      <span className="text-xs text-[#9b9895]">
        {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="h-7 w-7 flex items-center justify-center rounded text-[#6b6966] hover:bg-[#f0efed] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`h-7 w-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                p === page
                  ? "bg-[#1d4ed8] text-white"
                  : "text-[#6b6966] hover:bg-[#f0efed]"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === pages}
          className="h-7 w-7 flex items-center justify-center rounded text-[#6b6966] hover:bg-[#f0efed] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}
