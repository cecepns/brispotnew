import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const headerClass = 'bg-[#2A4B8F] text-white flex items-center justify-center min-h-[56px] px-4 relative';

export function Header({ title, showBack = false, backTo = '/' }) {
  return (
    <header className={headerClass}>
      {showBack && (
        <Link
          to={backTo}
          className="absolute left-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
      )}
      <h1 className="font-bold text-lg uppercase tracking-wide">
        {title}
      </h1>
    </header>
  );
}
