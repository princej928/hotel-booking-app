export default function AuthLayout({ title, subtitle, children, asideTitle, asideText }) {
  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_35%)]" />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.95)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">StayScape access</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{asideTitle}</h1>
          <p className="mt-4 max-w-md text-base leading-8 text-slate-300">{asideText}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ['Fast booking', 'Smooth hotel discovery and checkout flow'],
              ['Admin control', 'Manage listings without cluttering the guest UI']
            ].map(([heading, copy]) => (
              <div key={heading} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold">{heading}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-30px_rgba(15,23,42,0.32)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Account</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-3 text-base leading-7 text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
