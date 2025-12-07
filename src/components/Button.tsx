"use client";

export default function Button({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-turquoise)] px-4 py-2 font-semibold hover:brightness-95 transition ${className}`}
    >
      {children}
    </button>
  );
}
