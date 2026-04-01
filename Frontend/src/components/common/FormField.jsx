export default function FormField({ label, id, children, hint }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
