# BRI Input Data

Aplikasi input data pengajuan sederhana: React (Vite + JSX) + Tailwind CSS + Lucide React, backend Express.js + MySQL.

## Struktur

- **client/** – Frontend React Vite, Tailwind, React Router, Lucide
- **server/** – Backend Express.js (satu file: `server.js`), MySQL (mysql2), multer untuk upload foto
- **server/database/schema.sql** – Script pembuatan database dan tabel MySQL

## Persiapan Database

1. Pastikan MySQL berjalan.
2. Buat database dan tabel:

```bash
mysql -u root -p < server/database/schema.sql
```

Atau jalankan isi `server/database/schema.sql` di MySQL client (phpMyAdmin, DBeaver, dll).

## Backend (Express)

```bash
cd server
cp .env.example .env
# Edit .env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
npm install
npm run dev
```

API berjalan di `http://localhost:3001`. Endpoint:

- `GET /api/pengajuan` – list pengajuan
- `GET /api/pengajuan/:id` – detail pengajuan
- `POST /api/pengajuan` – buat pengajuan (body: FormData, optional file `foto_selfie`)
- `PUT /api/pengajuan/:id` – update pengajuan (FormData)
- `PATCH /api/pengajuan/:id/proses` – update status proses (body: `{ "status": "pending"|"proses"|"selesai" }`)

## Frontend (React)

```bash
cd client
cp .env.example .env
# Opsional: set VITE_API_URL jika API di host/port lain
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Alur UI (sesuai referensi)

1. **Home** – Menu: Input Data Pengajuan, List Data Pengajuan, Akad dan Pencairan Dana
2. **Input Data Pengajuan** – Form + upload foto selfie, simpan ke backend
3. **List Data Pengajuan** – Daftar identitas (foto, nama, NIK), tombol Prakarsa & Edit Data
4. **Prakarsa** – Detail data, NIK/NPWP, tombol PROSES (warna hijau/merah), Lanjutkan Akad
5. **Akad Digital** – Ringkasan data + ringkasan finansial (plafond, jangka waktu, suku bunga, angsuran/bulan)
6. **Akad dan Pencairan Dana** – Halaman informasi + link ke list pengajuan
# brispotnew
