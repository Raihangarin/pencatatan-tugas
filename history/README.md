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
- Pemeriksaan GitHub: `git ls-remote` memverifikasi branch `main` di GitHub, termasuk commit pembaruan skema `7d05c00`.
- Perubahan Supabase: masuk melalui GitHub, membuat organisasi gratis `RuangTugas`, dan menambahkan GRANT eksplisit untuk role `authenticated` ke skema SQL.
- Tindak lanjut awal: membuat proyek Supabase, mengisi konfigurasi lokal, menerapkan skema, menguji endpoint, lalu menyiapkan Vercel.

## 2026-11-16 — Menghubungkan proyek Supabase
- Tujuan: mengaktifkan database Supabase untuk aplikasi RuangTugas.
- Perubahan: membuat proyek Supabase `RuangTugas`, menyimpan URL dan publishable key di `.env` lokal, serta menjalankan `supabase/schema.sql` melalui SQL Editor.
- Pemeriksaan: SQL Editor mengonfirmasi eksekusi berhasil; tabel `public.tasks` terlihat di Table Editor; endpoint Auth merespons dengan publishable key; `npm run build` berhasil; `.env` diabaikan Git.
- Tindak lanjut: uji daftar/masuk dan CRUD memakai akun aplikasi, lalu siapkan deployment Vercel.
