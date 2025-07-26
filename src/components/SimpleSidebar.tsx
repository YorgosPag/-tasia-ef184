
import Link from 'next/link';

export default function SimpleSidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 min-h-screen">
      <nav>
        <ul className="space-y-2">
          <li><Link href="/dashboard" className="block p-2 rounded hover:bg-gray-200">Dashboard</Link></li>
          <li><Link href="/settings" className="block p-2 rounded hover:bg-gray-200">Ρυθμίσεις</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
