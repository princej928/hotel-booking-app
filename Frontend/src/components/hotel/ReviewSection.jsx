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
    <section className="mt-12 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-lg lg:mt-16">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-8 sm:px-10 sm:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Guest Experiences</h2>
            <p className="mt-2 text-lg text-teal-100">See why 98% of visitors recommend this property.</p>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-full bg-white/10 px-6 py-3 backdrop-blur-md border border-white/20">
            <svg className="h-8 w-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div>
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-xs font-medium uppercase tracking-wider text-amber-200">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-3">
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
