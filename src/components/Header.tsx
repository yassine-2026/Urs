import { Link } from 'react-router';
import { Gamepad2, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold tracking-tight text-white">FreeFire Cloud</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            <Settings className="h-4 w-4" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
