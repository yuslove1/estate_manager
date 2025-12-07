interface GateCodeCardProps {
  code: string;
}

export default function GateCodeCard({ code }: GateCodeCardProps) {
  return (
    <div className="bg-teal-50 dark:bg-teal-900/30 rounded-2xl p-8 text-center mb-6">
      <div className="text-6xl font-bold tracking-widest text-teal-700 dark:text-teal-400 mb-3">
        {code}
      </div>

      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
        Valid until midnight
      </p>
    </div>
  );
}
