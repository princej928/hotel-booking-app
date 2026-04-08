import PageContainer from './PageContainer';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <PageContainer className="grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900">StayScape</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
            A modern hotel booking frontend with clearer discovery, stronger trust signals, and a much cleaner booking journey.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm text-slate-400">Crafted with passion by</span>
            <span className="signature-font text-2xl text-teal-600 font-bold -rotate-2 inline-block">Prince</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Experience</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Premium discovery flow</li>
            <li>Responsive booking journey</li>
            <li>Admin-friendly hotel management</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Highlights</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Accessible inputs and actions</li>
            <li>Clear pricing and booking summaries</li>
            <li>Built to expand into details and listings pages</li>
          </ul>
        </div>
      </PageContainer>
    </footer>
  );
}
