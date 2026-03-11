import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { getPengajuanList, uploadsUrl } from '../lib/api';

export default function ListDataPengajuan() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPengajuanList()
      .then(setList)
      .catch(() => setError('Gagal memuat data'))
      .finally(() => setLoading(false));
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="List Data Pengajuan" showBack backTo="/" />
      <main className="max-w-md m-4 px-4 py-6 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-500 uppercase text-sm font-medium mb-4">Identitas</p>
        {loading && <p className="text-gray-600">Memuat...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && list.length === 0 && (
          <p className="text-gray-600">Belum ada data pengajuan.</p>
        )}
        <ul className="divide-y divide-gray-200">
          {list.map((item) => (
            <li key={item.id} className="py-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                {item.foto_selfie_path ? (
                  <img
                    src={uploadsUrl(item.foto_selfie_path)}
                    alt={item.nama}
                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    Foto
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 uppercase truncate">{item.nama}</p>
                <p className="text-gray-600 text-sm">{item.nik}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  to={`/prakarsa/${item.id}`}
                  className="rounded-lg bg-[#2A4B8F] text-white text-xs font-bold px-3 py-2 uppercase text-center"
                >
                  Prakarsa
                </Link>
                <Link
                  to={`/input-data-pengajuan?edit=${item.id}`}
                  className="rounded-lg bg-[#2A4B8F] text-white text-xs font-bold px-3 py-2 uppercase text-center"
                >
                  Edit Data
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
