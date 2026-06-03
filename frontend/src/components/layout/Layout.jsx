import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-ink-50 text-ink-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-8 py-10">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-ink-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-4 text-xs text-ink-400">
            <span className="font-mono uppercase tracking-wider">
              Sygle - ESEO Angers
            </span>
            <span>Année 2025 - 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
