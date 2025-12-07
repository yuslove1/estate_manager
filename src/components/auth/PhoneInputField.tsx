"use client";

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInputField({ value, onChange }: PhoneInputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    onChange(inputValue);
  };

  return (
    <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-700 px-4 py-4 rounded-xl border border-neutral-300 dark:border-neutral-600">
      <span className="text-neutral-700 dark:text-neutral-300 font-semibold whitespace-nowrap text-lg">+234</span>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="e.g., 801 234 5678"
        className="flex-1 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none text-lg font-medium"
      />
    </div>
  );
}
