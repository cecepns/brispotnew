import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { createPengajuan, updatePengajuan, getPengajuanById, uploadsUrl } from '../lib/api';

const fields = [
  { key: 'nama', label: 'Nama', type: 'text' },
  { key: 'nik', label: 'NIK', type: 'text' },
  { key: 'npwp', label: 'NPWP (Bisa Text dan Numerik)', type: 'text' },
  { key: 'tempat_tgl_lahir', label: 'Tempat Tgl Lahir', type: 'text' },
  { key: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
  { key: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text' },
  { key: 'plafond', label: 'Plafond', type: 'number' },
  { key: 'tenor', label: 'Tenor', type: 'number' },
  { key: 'angsuran', label: 'Angsuran', type: 'number' },
  { key: 'suku_bunga_annuitas', label: 'Suku Bunga Annuitas', type: 'number' },
  { key: 'no_hp', label: 'No Hp', type: 'text' },
  { key: 'alamat', label: 'Alamat', type: 'text' },
  { key: 'status', label: 'Status (Input sendiri)', type: 'text' },
];

export default function InputDataPengajuan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [form, setForm] = useState(Object.fromEntries(fields.map((f) => [f.key, ''])));
  const [fotoSelfie, setFotoSelfie] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(!!editId);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editId) return;
    getPengajuanById(editId)
      .then((res) => {
        const d = res?.data || res || {};
        setForm({
          nama: d.nama != null ? String(d.nama) : '',
          nik: d.nik != null ? String(d.nik) : '',
          npwp: d.npwp != null ? String(d.npwp) : '',
          tempat_tgl_lahir: d.tempat_tgl_lahir ?? d.ttl ?? '',
          pekerjaan: d.pekerjaan != null ? String(d.pekerjaan) : '',
          jenis_kelamin: d.jenis_kelamin != null ? String(d.jenis_kelamin) : '',
          plafond: d.plafond ?? d.nominal_pengajuan ?? '',
          tenor: d.tenor ?? d.jangka_waktu ?? '',
          angsuran: d.angsuran != null ? String(d.angsuran) : '',
          suku_bunga_annuitas: d.suku_bunga_annuitas ?? d.bunga ?? '',
          no_hp: d.no_hp ?? d.nomor_hp ?? d.nomor_telepon ?? '',
          alamat: d.alamat != null ? String(d.alamat) : '',
          status: d.status != null ? String(d.status) : '',
        });
        const photo = d.foto_selfie_path || d.foto_path;
        if (photo) setPreview(uploadsUrl(photo));
      })
      .catch(() => setError('Data tidak ditemukan'))
      .finally(() => setLoadData(false));
  }, [editId]);

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoSelfie(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));

      // Append field aliases for backend compatibility
      if (form.no_hp) fd.append('nomor_hp', form.no_hp);
      if (form.tempat_tgl_lahir) fd.append('ttl', form.tempat_tgl_lahir);
      if (form.plafond) fd.append('nominal_pengajuan', form.plafond);
      if (form.tenor) fd.append('jangka_waktu', form.tenor);
      if (form.suku_bunga_annuitas) fd.append('bunga', form.suku_bunga_annuitas);

      if (fotoSelfie) {
        fd.append('foto_selfie', fotoSelfie);
        fd.append('foto', fotoSelfie);
      }
      if (editId) {
        await updatePengajuan(editId, fd);
      } else {
        await createPengajuan(fd);
      }
      navigate('/list-data-pengajuan');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  if (loadData) return <div className="min-h-screen bg-white flex items-center justify-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title={editId ? 'Edit Data Pengajuan' : 'Input Data Pengajuan'} showBack backTo={editId ? '/list-data-pengajuan' : '/'} />
      <main className="max-w-md m-4 md:mx-auto px-4 py-6 bg-white border border-gray-200 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto Selfie</label>
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center px-1">
                  Belum upload
                </div>
              )}
              <label className="rounded-full px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-200">
                Pilih File
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>

          <div>
            <p className="font-bold text-gray-900 mb-2">Input :</p>
            <div className="space-y-3">
              {fields.map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block font-bold text-gray-900 text-sm">{label}</label>
                  {key === 'alamat' ? (
                    <textarea
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
                      rows={3}
                    />
                  ) : (
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2A4B8F] text-white font-bold py-3 rounded-lg uppercase disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </main>
    </div>
  );
}
