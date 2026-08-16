import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastCtx {
  toast: (message: string, variant?: ToastVariant) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });

const icons: Record<ToastVariant, string> = {
  success: "#15803d",
  error: "#b91c1c",
  warning: "#b45309",
  info: "#0369a1",
};

const bgColors: Record<ToastVariant, string> = {
  success: "#f0fdf4",
  error: "#fef2f2",
  warning: "#fffbeb",
  info: "#f0f9ff",
};

const borderColors: Record<ToastVariant, string> = {
  success: "#bbf7d0",
  error: "#fecaca",
  warning: "#fed7aa",
  info: "#bae6fd",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-72">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-md border shadow-md text-sm"
            style={{ background: bgColors[t.variant], borderColor: borderColors[t.variant] }}
          >
            <span className="mt-0.5 flex-shrink-0" style={{ color: icons[t.variant] }}>
              {t.variant === "success" && <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0a7 7 0 100 14A7 7 0 007 0zm3.07 5.47L6.54 8.99a.5.5 0 01-.71 0L4.07 7.23a.5.5 0 11.71-.71l1.4 1.4 3.18-3.16a.5.5 0 01.71.71z"/></svg>}
              {t.variant === "error" && <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0a7 7 0 100 14A7 7 0 007 0zm.75 9.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7 7.5a.5.5 0 01-.5-.5V4a.5.5 0 011 0v3a.5.5 0 01-.5.5z"/></svg>}
              {t.variant === "warning" && <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7.87 1.5L13.3 11a1 1 0 01-.87 1.5H1.57A1 1 0 01.7 11L6.13 1.5a1 1 0 011.74 0zM7 5a.5.5 0 00-.5.5V8a.5.5 0 001 0V5.5A.5.5 0 007 5zm.75 5.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>}
              {t.variant === "info" && <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0a7 7 0 100 14A7 7 0 007 0zm.5 10a.5.5 0 01-1 0V6.5a.5.5 0 011 0V10zm-.5-5a.75.75 0 110-1.5.75.75 0 010 1.5z"/></svg>}
            </span>
            <span className="text-[#111110] leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
