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
- [x] Masuk ke Supabase melalui GitHub dan membuat organisasi gratis `RuangTugas`.
- [x] Membuat proyek Supabase gratis `RuangTugas`.
- [x] Menjalankan `supabase/schema.sql`; tabel `public.tasks` berhasil dibuat dengan RLS dan kebijakan per pengguna.
- [x] Mengatur URL dan publishable key Supabase di `.env` lokal (file tetap diabaikan Git).
- [x] Memverifikasi endpoint Supabase Auth merespons dengan publishable key.
- [ ] Uji daftar/masuk pengguna dan CRUD tugas memakai akun aplikasi.
- [x] Membuat akun Vercel melalui GitHub dan mengimpor repository `pencatatan-tugas`.
- [x] Mengatur environment variables Supabase untuk Production dan Preview di Vercel.
- [ ] Deploy ke Vercel; tertunda karena verifikasi akun masih dikirim ke email lama yang tidak bisa diakses.

## Catatan
Source sudah ada di GitHub dan proyek Supabase sudah memiliki skema. Konfigurasi Supabase hanya disimpan lokal; jangan menaruh secret di repository atau percakapan. Uji autentikasi/CRUD dengan akun aplikasi dan deployment Vercel masih menjadi tindak lanjut.
