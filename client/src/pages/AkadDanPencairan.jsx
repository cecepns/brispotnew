import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { FileSignature } from 'lucide-react';

export default function AkadDanPencairan() {
  return (
    <div className="min-h-screen bg-white">
      <Header title="Akad dan Pencairan Dana" showBack backTo="/" />
      <main className="max-w-md mx-auto px-6 py-8">
        <p className="text-gray-600 mb-6">
          Untuk melakukan akad digital dan pencairan dana, pilih data pengajuan dari list lalu gunakan tombol Prakarsa dan lanjut ke Akad Digital.
        </p>
        <Link
          to="/list-data-pengajuan"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2A4B8F] text-white font-bold px-4 py-3"
        >
          <FileSignature className="w-5 h-5" />
          Ke List Data Pengajuan
        </Link>
      </main>
    </div>
  );
}
