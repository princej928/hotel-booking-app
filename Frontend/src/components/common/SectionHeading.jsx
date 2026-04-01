export default function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-600">
            {eyebrow}
          </div>
        )}
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-7 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
