import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-teal-600 text-white hover:bg-teal-500 focus-visible:ring-teal-500',
  secondary: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-400',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500'
};

export default function Button({
  as,
  to,
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  const sharedClassName = `inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variants[variant]} ${className}`;

  if (as === Link) {
    return (
      <Link to={to} className={sharedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={sharedClassName} {...props}>
      {children}
    </button>
  );
}
