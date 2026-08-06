import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { getPengajuanList, uploadsUrl } from '../lib/api';

export default function ListDataPengajuan() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 10 });

  useEffect(() => {
    setLoading(true);
    setError('');
    getPengajuanList(page, 10)
      .then((res) => {
        setList(res.data || []);
        if (res.meta) {
          setMeta(res.meta);
        }
      })
      .catch(() => setError('Gagal memuat data'))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil((meta.total || 0) / (meta.pageSize || 10));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="List Data Pengajuan" showBack backTo="/" />
      <main className="max-w-md m-4 md:mx-auto px-4 py-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 uppercase text-sm font-medium">Identitas</p>
          {meta.total > 0 && (
            <p className="text-xs text-gray-500">Total: {meta.total} data</p>
          )}
        </div>

        {loading && <p className="text-gray-600 text-center py-6">Memuat...</p>}
        {error && <p className="text-red-600 text-center py-6">{error}</p>}
        {!loading && !error && (!Array.isArray(list) || list.length === 0) && (
          <p className="text-gray-600 text-center py-6">Belum ada data pengajuan.</p>
        )}

        <ul className="divide-y divide-gray-200">
          {Array.isArray(list) &&
            list.map((item) => (
              <li key={item.id} className="py-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  {item.foto_path || item.foto_selfie_path ? (
                    <img
                      src={uploadsUrl(item.foto_path || item.foto_selfie_path)}
                      alt={item.nama}
                      className="w-14 h-14 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
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
                    className="rounded-lg bg-[#2A4B8F] text-white text-xs font-bold px-3 py-2 uppercase text-center hover:bg-[#203a70] transition-colors"
                  >
                    Prakarsa
                  </Link>
                  <Link
                    to={`/input-data-pengajuan?edit=${item.id}`}
                    className="rounded-lg bg-[#2A4B8F] text-white text-xs font-bold px-3 py-2 uppercase text-center hover:bg-[#203a70] transition-colors"
                  >
                    Edit Data
                  </Link>
                </div>
              </li>
            ))}
        </ul>

        {!loading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={meta.total}
            pageSize={meta.pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </main>
    </div>
  );
}
