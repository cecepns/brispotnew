const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3001;
const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bri_input_data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, UPLOADS_DIR));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'selfie-' + unique + (path.extname(file.originalname) || '.jpg'));
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, UPLOADS_DIR)));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// GET serve image by filename
app.get('/api/image/:filename', async (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, UPLOADS_DIR, filename);
  try {
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch {
    res.status(404).json({ error: 'Gambar tidak ditemukan' });
  }
});

// GET semua pengajuan (list)
app.get('/api/pengajuan', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nama, nik, npwp, foto_selfie_path, plafond, tenor, angsuran, suku_bunga_annuitas, pekerjaan, jenis_kelamin, no_hp, alamat, status, tempat_tgl_lahir, proses_status, created_at FROM pengajuan ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data pengajuan' });
  }
});

// GET satu pengajuan by id
app.get('/api/pengajuan/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pengajuan WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
});

// POST buat pengajuan (dengan optional file)
app.post('/api/pengajuan', upload.single('foto_selfie'), async (req, res) => {
  try {
    const {
      nama,
      nik,
      npwp,
      tempat_tgl_lahir,
      pekerjaan,
      jenis_kelamin,
      plafond,
      tenor,
      angsuran,
      suku_bunga_annuitas,
      no_hp,
      alamat,
      status,
    } = req.body;

    const foto_selfie_path = req.file ? '/uploads/' + req.file.filename : null;

    const [result] = await pool.query(
      `INSERT INTO pengajuan (
        nama, nik, npwp, tempat_tgl_lahir, pekerjaan, jenis_kelamin,
        plafond, tenor, angsuran, suku_bunga_annuitas, no_hp, alamat, status, foto_selfie_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama,
        nik,
        npwp ?? null,
        tempat_tgl_lahir ?? null,
        pekerjaan ?? null,
        jenis_kelamin ?? null,
        plafond ? parseFloat(plafond) : null,
        tenor ? parseInt(tenor, 10) : null,
        angsuran ? parseFloat(angsuran) : null,
        suku_bunga_annuitas ? parseFloat(suku_bunga_annuitas) : null,
        no_hp ?? null,
        alamat ?? null,
        status ?? null,
        foto_selfie_path,
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Data berhasil disimpan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menyimpan data' });
  }
});

// PUT update pengajuan
app.put('/api/pengajuan/:id', upload.single('foto_selfie'), async (req, res) => {
  try {
    const {
      nama,
      nik,
      npwp,
      tempat_tgl_lahir,
      pekerjaan,
      jenis_kelamin,
      plafond,
      tenor,
      angsuran,
      suku_bunga_annuitas,
      no_hp,
      alamat,
      status,
    } = req.body;

    let foto_selfie_path = null;
    if (req.file) foto_selfie_path = '/uploads/' + req.file.filename;

    const updates = [];
    const values = [];

    [
      'nama',
      'nik',
      'npwp',
      'tempat_tgl_lahir',
      'pekerjaan',
      'jenis_kelamin',
      'plafond',
      'tenor',
      'angsuran',
      'suku_bunga_annuitas',
      'no_hp',
      'alamat',
      'status',
    ].forEach((key) => {
      if (req.body[key] !== undefined) {
        updates.push(`${key} = ?`);
        if (['plafond', 'angsuran', 'suku_bunga_annuitas'].includes(key)) values.push(parseFloat(req.body[key]));
        else if (key === 'tenor') values.push(parseInt(req.body[key], 10));
        else values.push(req.body[key]);
      }
    });
    if (foto_selfie_path) {
      updates.push('foto_selfie_path = ?');
      values.push(foto_selfie_path);
    }
    if (updates.length === 0) return res.status(400).json({ error: 'Tidak ada data untuk diupdate' });
    values.push(req.params.id);
    await pool.query(`UPDATE pengajuan SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengupdate data' });
  }
});

// DELETE hapus pengajuan
app.delete('/api/pengajuan/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT foto_selfie_path FROM pengajuan WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });

    if (rows[0].foto_selfie_path) {
      const filename = path.basename(rows[0].foto_selfie_path);
      const filePath = path.join(__dirname, UPLOADS_DIR, filename);
      await fs.unlink(filePath).catch(() => {});
    }

    await pool.query('DELETE FROM pengajuan WHERE id = ?', [req.params.id]);
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus data' });
  }
});

// PATCH update proses_status (untuk tombol PROSES)
app.patch('/api/pengajuan/:id/proses', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'proses', 'selesai'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' });
    }
    await pool.query('UPDATE pengajuan SET proses_status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status proses diupdate' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengupdate status' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
