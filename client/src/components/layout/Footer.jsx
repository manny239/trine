export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-ink/10 bg-brand-green text-brand-cream">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">Trine Kitchen</p>
          <p className="mt-1 text-sm text-brand-cream/80">Traditional Ghanaian cooking, made daily.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">Hours</p>
          <p className="mt-1 text-sm text-brand-cream/80">Mon–Fri 11am–9pm</p>
          <p className="text-sm text-brand-cream/80">Sat–Sun 10am–10pm</p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-brand-cream/80">Built with React + Express</p>
          <p className="mt-1 text-xs text-brand-cream/60">
            &copy; {new Date().getFullYear()} Trine Kitchen
          </p>
        </div>
      </div>
    </footer>
  );
}
