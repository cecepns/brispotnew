import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getPengajuanById, updateProsesStatus, uploadsUrl } from '../lib/api';

function formatRupiah(n) {
  if (n == null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function Prakarsa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prosesLoading, setProsesLoading] = useState(false);

  useEffect(() => {
    getPengajuanById(id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  const prosesStatus = data?.proses_status || 'pending';
  const isGreen = prosesStatus === 'selesai' || prosesStatus === 'proses';

  const handleProses = async () => {
    if (!data) return;
    setProsesLoading(true);
    try {
      const next = prosesStatus === 'pending' ? 'proses' : prosesStatus === 'proses' ? 'selesai' : 'pending';
      await updateProsesStatus(data.id, next);
      setData((d) => ({ ...d, proses_status: next }));
    } finally {
      setProsesLoading(false);
    }
  };

  const handleLanjutkanAkad = () => navigate(`/akad-digital/${id}`);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Memuat...</div>;
  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">Data tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Prakarsa" showBack backTo="/list-data-pengajuan" />
      <main className="max-w-md m-4 md:mx-auto px-4 py-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex gap-4 items-start mb-6">
          <div className="flex-shrink-0">
            {data.foto_selfie_path ? (
              <img
                src={uploadsUrl(data.foto_selfie_path)}
                alt="Foto"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#2A4B8F]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-[#2A4B8F] text-xs text-center px-1">
                Foto yang sudah di upload
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-700">NIK {data.nik}</p>
            <p className="text-gray-700">NPWP {data.npwp || '-'}</p>
            <button
              type="button"
              onClick={handleProses}
              disabled={prosesLoading}
              className={`mt-2 px-2 py-1 rounded text-white text-xs ${isGreen ? 'bg-green-600' : 'bg-red-600'}`}
            >
              {prosesLoading ? '...' : data.status}
            </button>
          </div>
        </div>

               <div className="space-y-3 text-gray-900 mb-3">
          <div>
            <p className="font-bold">Nama:</p>
            <p className="text-gray-700">{data.nama || '-'}</p>
          </div>
          <div>
            <p className="font-bold">Pekerjaan:</p>
            <p className="text-gray-700">{data.pekerjaan || '-'}</p>
          </div>
          <div>
            <p className="font-bold">Jenis Kelamin:</p>
            <p className="text-gray-700">{data.jenis_kelamin || '-'}</p>
          </div>
          <div>
            <p className="font-bold">Plafond:</p>
            <p className="text-gray-700">{formatRupiah(data.plafond)}</p>
          </div>
          <div>
            <p className="font-bold">Tenor:</p>
            <p className="text-gray-700">{data.tenor ? `${data.tenor} Bulan` : '-'}</p>
          </div>
          <div>
            <p className="font-bold">Angsuran:</p>
            <p className="text-gray-700">{data.angsuran != null ? formatRupiah(data.angsuran) : '-'}</p>
          </div>
          <div>
            <p className="font-bold">No HP:</p>
            <p className="text-gray-700">{data.no_hp || '-'}</p>
          </div>
          <div>
            <p className="font-bold">Alamat:</p>
            <p className="text-gray-700">{data.alamat || '-'}</p>
          </div>
          <div>
            <p className="font-bold">Tempat Tgl Lahir:</p>
            <p className="text-gray-700">{data.tempat_tgl_lahir || '-'}</p>
          </div>
          <div>
            <p className="font-bold">Suku Bunga Annuitas:</p>
            <p className="text-gray-700">{data.suku_bunga_annuitas != null ? `${data.suku_bunga_annuitas}%` : '-'}</p>
          </div>
          <div>
            <p className="font-bold">Status:</p>
            <p className="text-gray-700">{data.status || '-'}</p>
          </div>
        </div>

        {/* <p className="text-gray-500 text-sm mt-6 mb-2">Ini tombol paling bawah</p> */}
        <button
          type="button"
          onClick={handleLanjutkanAkad}
          className="w-full bg-[#2A4B8F] text-white font-bold py-3 rounded-lg uppercase"
        >
          Lanjutkan Akad
        </button>
      </main>
    </div>
  );
}
