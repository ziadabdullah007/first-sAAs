import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon ? (
        <div className="text-[#c9c7c3] mb-4">{icon}</div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#f0efed] flex items-center justify-center mb-4">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[#9b9895]">
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.25"/>
            <path d="M9 6v3M9 12h.01" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#111110] mb-1">{title}</h3>
      <p className="text-xs text-[#9b9895] max-w-xs mb-4 leading-relaxed">{description}</p>
      {action && (
        <Button size="sm" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
