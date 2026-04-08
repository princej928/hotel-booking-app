import { getFallbackImage, handleImageError } from '../../utils/hotelHelpers';

export default function BookingSummaryCard({ hotel, checkInDate, checkOutDate, roomType, days, subtotal, taxes, finalTotal }) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-30px_rgba(15,23,42,0.28)]">
      <div className="overflow-hidden rounded-3xl">
        <img
          src={hotel?.image || getFallbackImage(hotel?._id)}
          alt={hotel?.name || 'Hotel preview'}
          onError={(e) => handleImageError(e, hotel?._id)}
          className="h-52 w-full object-cover"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-500">{hotel?.location || 'Select a hotel'}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">{hotel?.name || 'Booking summary'}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          {checkInDate && checkOutDate ? `${new Date(checkInDate).toLocaleDateString()} to ${new Date(checkOutDate).toLocaleDateString()}` : 'Select your check-in and check-out dates.'}
        </p>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Room Type</span>
          <span className="font-semibold text-slate-900">{roomType}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>Length of Stay</span>
          <span className="font-semibold text-slate-900">{days ? `${days} nights` : '--'}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>Room Subtotal</span>
          <span className="font-semibold text-slate-900">{subtotal ? `₹${subtotal}` : '--'}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>Taxes (12%)</span>
          <span className="font-semibold text-slate-900">{taxes ? `₹${taxes}` : '--'}</span>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between text-base font-bold text-slate-900">
            <span>Estimated total</span>
            <span>{finalTotal ? `₹${finalTotal}` : '--'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
