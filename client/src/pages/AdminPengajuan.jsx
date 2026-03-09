import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { getPengajuanList, updateProsesStatus, deletePengajuan, uploadsUrl } from '../lib/api';
import { Trash2, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'proses', 'selesai'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  proses: 'bg-blue-100 text-blue-800 border-blue-300',
  selesai: 'bg-green-100 text-green-800 border-green-300',
};

function formatRupiah(n) {
  if (n == null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function AdminPengajuan() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = () => {
    setLoading(true);
    getPengajuanList()
      .then(setList)
      .catch(() => setError('Gagal memuat data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await updateProsesStatus(id, newStatus);
      setList((prev) => prev.map((item) => (item.id === id ? { ...item, proses_status: newStatus } : item)));
    } catch {
      alert('Gagal mengubah status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    try {
      await deletePengajuan(id);
      setList((prev) => prev.filter((item) => item.id !== id));
      setDeleteConfirm(null);
    } catch {
      alert('Gagal menghapus data');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Pengajuan" showBack backTo="/" />
      <main className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 uppercase text-sm font-medium">
            Total: {list.length} data
          </p>
        </div>

        {loading && <p className="text-gray-600 text-center py-8">Memuat...</p>}
        {error && <p className="text-red-600 text-center py-8">{error}</p>}
        {!loading && !error && list.length === 0 && (
          <p className="text-gray-600 text-center py-8">Belum ada data pengajuan.</p>
        )}

        <ul className="space-y-3">
          {list.map((item) => {
            const status = item.proses_status || 'pending';
            const isDeleting = deleteConfirm === item.id;

            return (
              <li key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {item.foto_selfie_path ? (
                        <img
                          src={uploadsUrl(item.foto_selfie_path)}
                          alt={item.nama}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 uppercase truncate text-sm">{item.nama}</p>
                      <p className="text-gray-500 text-xs">NIK: {item.nik}</p>
                      <p className="text-gray-500 text-xs">{formatRupiah(item.plafond)} &middot; {item.tenor || '-'} bln</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="relative flex-1">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        disabled={actionLoading === item.id}
                        className={`w-full appearance-none text-xs font-bold px-3 py-2 pr-8 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2A4B8F] ${STATUS_COLORS[status]}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(isDeleting ? null : item.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus data"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {isDeleting && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-700 text-xs font-medium mb-2">
                        Yakin ingin menghapus data <span className="font-bold">{item.nama}</span>?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={actionLoading === item.id}
                          className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoading === item.id ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-300"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
