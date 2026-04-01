export default function StatusBanner({ type = 'info', children }) {
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    error: 'border-rose-200 bg-rose-50 text-rose-700',
    info: 'border-sky-200 bg-sky-50 text-sky-700'
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[type] || styles.info}`}>
      {children}
    </div>
  );
}
