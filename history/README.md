# Riwayat Progres

Catat tiap sesi pengerjaan dengan format berikut:

```text
## YYYY-MM-DD — Judul progres
- Tujuan:
- Perubahan:
- Pemeriksaan:
- Tindak lanjut:
```

## Contoh progres

### Contoh — Halaman katalog
- Tujuan: menampilkan daftar produk dan memudahkan pengunjung menemukan item.
- Perubahan: menyusun kartu katalog, kolom pencarian, dan kondisi katalog kosong.
- Pemeriksaan: cek build dan tampilan pada ukuran desktop serta ponsel.
- Tindak lanjut: hubungkan daftar produk dengan sumber data yang disepakati.

## 2026-11-16 — Inisialisasi RuangTugas
- Tujuan: menyiapkan aplikasi pencatatan tugas dan dokumen wajib proyek.
- Perubahan: membuat aplikasi React + TypeScript, dashboard CRUD tugas, autentikasi Supabase, mode demo lokal, SQL RLS, `AGENTS.md`, `spec.md`, dan `plan.md`.
- Pemeriksaan: `npm install` berhasil (0 vulnerability); `npm run build` berhasil; uji browser mode demo mencakup tambah, edit, selesai, filter, dan hapus, serta menghapus kembali tugas uji sementara.
- Perubahan lanjutan: membuat repository publik `https://github.com/Raihangarin/pencatatan-tugas` dan push seluruh source yang tidak diabaikan `.gitignore`.
- Pemeriksaan GitHub: `git ls-remote` memverifikasi branch `main` di GitHub pada commit `7bf7f88`.
- Tindak lanjut: buat/siapkan proyek Supabase dan akun Vercel, atur environment variables, jalankan skema, lalu deploy.
