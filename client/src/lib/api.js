const BASE = import.meta.env.VITE_API_URL || 'https://api.kingcreativestudio.my.id/brispot/api';

export async function getPengajuanList() {
  const res = await fetch(`${BASE}/pengajuan`);
  if (!res.ok) throw new Error('Gagal mengambil data');
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.pengajuan)) return data.pengajuan;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.result)) return data.result;
  return [];
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
