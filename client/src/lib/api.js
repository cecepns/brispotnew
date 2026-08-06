const BASE = import.meta.env.VITE_API_URL || 'https://api.kingcreativestudio.my.id/brispot/api';

export async function getPengajuanList(page = 1, pageSize = 10) {
  const query = new URLSearchParams({ page, pageSize }).toString();
  const res = await fetch(`${BASE}/pengajuan?${query}`);
  if (!res.ok) throw new Error('Gagal mengambil data');
  const resData = await res.json();

  if (resData && typeof resData === 'object' && !Array.isArray(resData)) {
    const data = Array.isArray(resData.data)
      ? resData.data
      : (Array.isArray(resData.pengajuan) ? resData.pengajuan : (Array.isArray(resData.rows) ? resData.rows : []));

    const meta = resData.meta || {
      total: data.length,
      page: Number(page),
      pageSize: Number(pageSize),
    };

    return { data, meta };
  }

  const data = Array.isArray(resData) ? resData : [];
  return {
    data,
    meta: {
      total: data.length,
      page: Number(page),
      pageSize: Number(pageSize),
    },
  };
}

export async function getPengajuanById(id) {
  const res = await fetch(`${BASE}/pengajuan/${id}`);
  if (!res.ok) throw new Error('Data tidak ditemukan');
  return res.json();
}

export async function createPengajuan(formData) {
  const res = await fetch(`${BASE}/pengajuan`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menyimpan data');
  }
  return res.json();
}

export async function updatePengajuan(id, formData) {
  const res = await fetch(`${BASE}/pengajuan/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal mengupdate data');
  }
  return res.json();
}

export async function updateProsesStatus(id, status) {
  const res = await fetch(`${BASE}/pengajuan/${id}/proses`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Gagal mengupdate status');
  return res.json();
}

export async function deletePengajuan(id) {
  const res = await fetch(`${BASE}/pengajuan/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Gagal menghapus data');
  return res.json();
}

export function uploadsUrl(path) {
  if (!path) return null;
  const base = import.meta.env.VITE_API_URL || 'https://api.kingcreativestudio.my.id/brispot';
  return path.startsWith('http') ? path : `${base}${path}`;
}
