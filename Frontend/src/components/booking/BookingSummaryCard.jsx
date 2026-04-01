export default function BookingSummaryCard({ hotel, selectedDate, count }) {
  const subtotal = Number(hotel?.price || 0);
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-30px_rgba(15,23,42,0.28)]">
      <div className="overflow-hidden rounded-3xl">
        <img
          src={hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
          alt={hotel?.name || 'Hotel preview'}
          className="h-52 w-full object-cover"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-500">{hotel?.location || 'Select a hotel'}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">{hotel?.name || 'Booking summary'}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          {selectedDate ? `Check-in on ${new Date(selectedDate).toLocaleDateString()}` : 'Choose your preferred stay date.'}
        </p>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Hotels available</span>
          <span className="font-semibold text-slate-900">{count}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>Nightly rate</span>
          <span className="font-semibold text-slate-900">${subtotal || '--'}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>Taxes & fees</span>
          <span className="font-semibold text-slate-900">${subtotal ? taxes : '--'}</span>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between text-base font-bold text-slate-900">
            <span>Estimated total</span>
            <span>${subtotal ? total : '--'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
