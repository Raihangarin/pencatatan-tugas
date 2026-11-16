# Rencana Pengerjaan

## Tahap 1 — Fondasi
- [x] Menyiapkan proyek React + TypeScript + Vite.
- [x] Menyusun struktur aplikasi dan aturan kontribusi untuk agent.

## Tahap 2 — Pencatatan tugas
- [x] Membuat dashboard dan navigasi daftar tugas.
- [x] Menambahkan pembuatan, pengubahan, penghapusan, pencarian, dan status selesai.
- [x] Menyediakan filter hari ini, mendatang, dan selesai serta ringkasan.
- [x] Membuat tampilan responsif dan status kosong/pesan kesalahan.

## Tahap 3 — Data dan autentikasi
- [x] Menghubungkan operasi tugas ke Supabase.
- [x] Menambahkan Supabase Auth email/kata sandi.
- [x] Menyediakan mode demo localStorage tanpa kredensial.
- [x] Menambahkan skema Postgres dan kebijakan RLS.

## Tahap 4 — Siap dijalankan dan dipublikasikan
- [x] Menambahkan template environment dan instruksi GitHub/Vercel.
- [x] Menjalankan `npm install` dan `npm run build`.
- [x] Menguji CRUD tugas mode demo di browser; tugas uji sementara sudah dihapus.
- [x] Membuat repository publik `Raihangarin/pencatatan-tugas` dan push source ke branch `main`.
- [ ] Buat/siapkan akun dan proyek Supabase, lalu jalankan `supabase/schema.sql` dan atur environment variables.
- [ ] Buat/siapkan akun Vercel dan deploy repository.

## Catatan
Source sudah ada di GitHub. Integrasi database dan deployment belum selesai karena akun Supabase dan Vercel belum tersedia. Jangan menaruh secret di repository atau percakapan.
