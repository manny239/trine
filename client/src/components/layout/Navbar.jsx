import { useState } from 'react';
import { NavLink, Link } from 'react-router';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function linkClasses({ isActive }) {
  return [
    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
    isActive ? 'bg-brand-gold/20 text-brand-red' : 'text-brand-ink/70 hover:bg-brand-ink/5 hover:text-brand-ink',
  ].join(' ');
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-brand-ink/10 bg-brand-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" onClick={close} className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold tracking-tight text-brand-red">Trine Kitchen</span>
          <span className="hidden text-sm font-medium text-brand-green sm:inline">Taste of Ghana</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
          {/* Cart link slot — filled in Phase 4. */}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="rounded-full px-3 py-2 text-sm font-semibold text-brand-ink hover:bg-brand-ink/5 md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-brand-ink/10 px-4 pb-3 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={close} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
