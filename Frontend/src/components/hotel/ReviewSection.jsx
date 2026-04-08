import React from 'react';

const mockReviews = [
  {
    id: 1,
    name: 'Sarah & James',
    type: 'Couple',
    rating: 5,
    date: 'March 2024',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+James&background=0D8ABC&color=fff',
    comment: 'Absolutely stunning property. The staff was incredibly welcoming, and the room was immaculate. The highlight was definitely the easy access to local dining. We can\'t wait to return!'
  },
  {
    id: 2,
    name: 'Michael T.',
    type: 'Solo Traveler',
    rating: 4,
    date: 'February 2024',
    avatar: 'https://ui-avatars.com/api/?name=Michael+T&background=10B981&color=fff',
    comment: 'Perfect for a quiet getaway. The booking process was seamless. The only minor issue was the WiFi being slightly slow in the evenings, but the overall experience was excellent.'
  },
  {
    id: 3,
    name: 'The Patel Family',
    type: 'Family',
    rating: 5,
    date: 'January 2024',
    avatar: 'https://ui-avatars.com/api/?name=Patel+Family&background=F59E0B&color=fff',
    comment: 'Our kids loved the spacious rooms and the amazing pool. It genuinely felt like a premium experience without breaking the bank. Highly recommend for families needing extra space.'
  }
];

export default function ReviewSection() {
  return (
    <section className="mt-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Guest Reviews</h2>
          <p className="mt-1 text-sm text-slate-500">Real feedback from recent visitors.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-2">
          <span className="text-2xl font-bold text-teal-800">4.8</span>
          <span className="text-sm font-medium text-teal-700">Excellent</span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {mockReviews.map((review) => (
          <div key={review.id} className="group rounded-[24px] border border-slate-100 bg-slate-50 p-6 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-md">
            <div className="flex items-center gap-4">
              <img src={review.avatar} alt={review.name} className="h-12 w-12 rounded-full object-cover shadow-sm" />
              <div>
                <h4 className="font-bold text-slate-900">{review.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{review.type}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-slate-300'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-4 group-hover:line-clamp-none transition-all">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
