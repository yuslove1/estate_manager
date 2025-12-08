interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={className || "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"}
      {...props}
    >
      {children}
    </button>
  );
}
