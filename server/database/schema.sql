-- BRI Input Data - MySQL Schema
-- Jalankan script ini untuk membuat database dan tabel

CREATE DATABASE IF NOT EXISTS bri_input_data;
USE bri_input_data;

-- Tabel data pengajuan (submission)
CREATE TABLE IF NOT EXISTS pengajuan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  nik VARCHAR(20) NOT NULL,
  npwp VARCHAR(50) NULL COMMENT 'Bisa text dan numerik',
  tempat_tgl_lahir VARCHAR(255) NULL,
  pekerjaan VARCHAR(255) NULL,
  jenis_kelamin VARCHAR(20) NULL,
  plafond DECIMAL(18, 2) NULL,
  tenor INT NULL COMMENT 'Dalam bulan',
  angsuran DECIMAL(18, 2) NULL,
  suku_bunga_annuitas DECIMAL(5, 2) NULL COMMENT 'Persen per tahun',
  no_hp VARCHAR(20) NULL,
  alamat TEXT NULL,
  status VARCHAR(100) NULL COMMENT 'Input sendiri',
  foto_selfie_path VARCHAR(500) NULL,
  proses_status ENUM('pending', 'proses', 'selesai') DEFAULT 'pending' COMMENT 'Untuk tombol PROSES (hijau/merah)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nik (nik),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
