interface AvatarProps {
  initials: string;
  size?: "sm" | "default" | "lg";
  color?: string;
}

const sizes = {
  sm: "w-7 h-7 text-[10px]",
  default: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-indigo-100 text-indigo-700",
];

function pickColor(initials: string) {
  const sum = initials.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[sum % colors.length];
}

export default function Avatar({ initials, size = "default" }: AvatarProps) {
  return (
    <div className={`${sizes[size]} ${pickColor(initials)} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}
