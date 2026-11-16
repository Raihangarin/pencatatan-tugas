# Panduan Agent

## Konteks
- Proyek ini adalah aplikasi pencatatan tugas berbasis React, TypeScript, Vite, dan Supabase.
- Antarmuka dan dokumentasi untuk pengguna menggunakan Bahasa Indonesia.
- Ikuti spesifikasi di `spec.md`; catat tahapan kerja di `history/`.

## Cara kerja
- Baca `spec.md`, `plan.md`, serta kode terkait sebelum mengubah perilaku.
- Buat perubahan sekecil mungkin dan pertahankan pola komponen serta tipe yang sudah ada.
- Jangan menaruh kunci rahasia atau file `.env` di Git. Gunakan `.env.example` sebagai templat.
- Akses data Supabase harus tetap dilindungi Row Level Security (RLS); jangan membuat kebijakan akses publik untuk tabel tugas.
- Laporkan kegagalan operasi kepada pengguna; jangan mengubahnya menjadi keberhasilan semu.
- Perbarui `spec.md` atau dokumentasi terkait jika perilaku produk berubah.
- Sebelum menyelesaikan perubahan aplikasi, jalankan `npm run build`.

## Perintah
- `npm run dev` — menjalankan server pengembangan.
- `npm run build` — pemeriksaan TypeScript dan build produksi.
- `npm run preview` — melihat build produksi secara lokal.

## Riwayat
Tambahkan ringkasan bertanggal, file yang berubah, pemeriksaan, dan tindak lanjut ke `history/README.md`.
