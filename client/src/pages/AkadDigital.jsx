import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { getPengajuanById, uploadsUrl } from "../lib/api";
import AkadDigitalImage from "../assets/icon.png";

function formatRupiah(n) {
  if (n == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AkadDigital() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPengajuanById(id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Memuat...
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Data tidak ditemukan.
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Akad Digital" showBack backTo="/list-data-pengajuan" />
      <main className="max-w-md mx-auto w-full flex-1 px-4 py-6 flex flex-col">
        <div className="flex flex-col items-center mb-6">
          {data.foto_selfie_path ? (
            <img
              src={uploadsUrl(data.foto_selfie_path)}
              alt="Foto"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#2A4B8F] mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-[#2A4B8F] text-xs text-center px-2 mb-3">
              Foto yang sudah di upload
            </div>
          )}
          <p className="text-gray-700">NIK {data.nik}</p>
          <p className="text-gray-700">NPWP {data.npwp || "-"}</p>
          <p className="text-gray-700 font-medium">Nama: {data.nama}</p>
        </div>

        <div className="flex justify-center items-center mb-6">
          <img src={AkadDigitalImage} className="w-44 h-auto" />
        </div>

        <div className="bg-gray-100 rounded-xl p-5">
          <p className="text-2xl font-bold text-[#2A4B8F] mb-3">
            {formatRupiah(data.plafond)}
          </p>
          <p className="text-gray-700 text-sm">
            Jangka Waktu {data.tenor || "-"} Bulan
          </p>
          <p className="text-gray-700 text-sm">
            Suku Bunga Annuitas{" "}
            {data.suku_bunga_annuitas != null
              ? `${data.suku_bunga_annuitas}% / Tahun`
              : "-"}
          </p>
          <p className="text-[#2A4B8F] font-semibold mt-1">
            Angsuran Per Bulan {formatRupiah(data.angsuran)}
          </p>
        </div>
      </main>
    </div>
  );
}
