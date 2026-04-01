export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/75 px-6 py-12 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
