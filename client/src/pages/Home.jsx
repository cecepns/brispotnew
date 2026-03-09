import { Link } from 'react-router-dom';
import { FileInput, List, FileSignature, ShieldCheck } from 'lucide-react';
import { Header } from '../components/Header';

const menuItems = [
  { to: '/input-data-pengajuan', label: 'Input Data Pengajuan', icon: FileInput },
  { to: '/list-data-pengajuan', label: 'List Data Pengajuan', icon: List },
  { to: '/akad-dan-pencairan', label: 'Akad dan Pencairan Dana', icon: FileSignature },
  { to: '/admin', label: 'Admin Pengajuan', icon: ShieldCheck },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header title="" showBack={false} />
      <main className="max-w-md mx-auto px-6 py-8">
        <nav className="flex flex-col gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="font-bold text-gray-900 text-lg py-3 border-b border-gray-100 hover:text-[#2A4B8F] focus:outline-none focus:ring-2 focus:ring-[#2A4B8F] focus:ring-offset-2 rounded"
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-[#2A4B8F]" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
