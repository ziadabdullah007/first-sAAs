import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-medium text-[#111110]">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          {...props}
          className={`
            w-full h-8 text-sm rounded-md border bg-white text-[#111110] appearance-none px-3
            ${error ? "border-red-400" : "border-[#e4e2df] focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]"}
            outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:bg-[#f7f6f5]
            ${className}
          `}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9b9895]">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
