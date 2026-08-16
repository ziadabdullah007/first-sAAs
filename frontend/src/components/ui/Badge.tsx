interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "default";
  children: React.ReactNode;
  size?: "sm" | "default";
}

const variantStyles: Record<string, string> = {
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
  neutral: "bg-gray-100 text-gray-600 border border-gray-200",
  default: "bg-gray-100 text-gray-700 border border-gray-200",
};

export default function Badge({ variant = "default", children, size = "default" }: BadgeProps) {
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5";
  return (
    <span className={`inline-flex items-center rounded font-medium ${sizeClass} ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}

export function statusBadge(status: string) {
  const map: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
    active: { variant: "success", label: "Active" },
    expired: { variant: "warning", label: "Expired" },
    suspended: { variant: "danger", label: "Suspended" },
    pending: { variant: "info", label: "Pending" },
    paid: { variant: "success", label: "Paid" },
    failed: { variant: "danger", label: "Failed" },
    inactive: { variant: "neutral", label: "Inactive" },
    trial: { variant: "info", label: "Trial" },
  };
  const cfg = map[status] ?? { variant: "neutral" as BadgeProps["variant"], label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
