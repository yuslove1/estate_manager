import React from "react";

interface PrimaryButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function PrimaryButton({
  onClick,
  disabled = false,
  loading = false,
  children,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-semibold active:scale-95 transition disabled:opacity-50 ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
