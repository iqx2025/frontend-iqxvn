"use client";

import { useState, useEffect } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4" />;
      case "error":
        return <X className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300",
        getStyles(),
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="ml-2 hover:opacity-70"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

// Toast manager hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; props: ToastProps }>>([]);

  const showToast = (props: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, props }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(({ id, props }) => (
        <Toast
          key={id}
          {...props}
          onClose={() => removeToast(id)}
        />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer,
    success: (message: string) => showToast({ message, type: "success" }),
    error: (message: string) => showToast({ message, type: "error" }),
    info: (message: string) => showToast({ message, type: "info" }),
    warning: (message: string) => showToast({ message, type: "warning" }),
  };
}
