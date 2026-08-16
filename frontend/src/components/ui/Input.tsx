import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, leftIcon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-medium text-[#111110]">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#9b9895]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              w-full h-8 text-sm rounded-md border bg-white text-[#111110] placeholder:text-[#9b9895]
              ${error ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#e4e2df] focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]"}
              ${leftIcon ? "pl-8" : "px-3"} pr-3
              outline-none transition-colors disabled:opacity-50 disabled:bg-[#f7f6f5]
              ${className}
            `}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9b9895]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
