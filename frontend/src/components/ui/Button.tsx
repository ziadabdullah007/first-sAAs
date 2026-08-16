import { type ReactNode, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "default" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: "bg-[#1d4ed8] text-white hover:bg-[#1e40af] border border-[#1d4ed8] hover:border-[#1e40af]",
  secondary: "bg-white text-[#111110] hover:bg-[#f5f4f2] border border-[#e4e2df]",
  ghost: "bg-transparent text-[#111110] hover:bg-[#f0efed] border border-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600",
  outline: "bg-transparent text-[#1d4ed8] hover:bg-[#eff6ff] border border-[#1d4ed8]",
};

const sizes = {
  sm: "text-xs px-2.5 py-1.5 h-7",
  default: "text-sm px-3.5 py-2 h-8",
  lg: "text-sm px-5 py-2.5 h-10",
};

export default function Button({ variant = "primary", size = "default", loading, children, disabled, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#1d4ed8] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-0.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
