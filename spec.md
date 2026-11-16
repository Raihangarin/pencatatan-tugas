# Spesifikasi — RuangTugas

## Ringkasan
RuangTugas adalah aplikasi web responsif untuk mencatat dan mengelola tugas pribadi. Pengguna dapat memecah rencana menjadi daftar sederhana, menetapkan tenggat dan prioritas, lalu menandai tugas yang selesai.

## Sasaran
- Menyediakan pengalaman pencatatan tugas yang mudah dipahami dalam Bahasa Indonesia.
- Menyimpan data secara persisten: Supabase untuk penggunaan akun, atau penyimpanan browser pada mode demo tanpa konfigurasi.
- Menjaga data antar pengguna tetap terisolasi menggunakan Supabase Auth dan Row Level Security.

## Pengguna dan autentikasi
- Saat Supabase tersedia, pengguna dapat mendaftar dan masuk dengan email serta kata sandi.
- Tugas pengguna tersimpan di Supabase dan tidak dapat dibaca/diubah pengguna lain.
- Tanpa konfigurasi Supabase, aplikasi berjalan dalam mode demo dan data tersimpan di `localStorage` browser yang sama.
- Aplikasi harus menampilkan mode demo dengan jelas. Data demo bukan sinkronisasi cloud.

## Fitur utama
1. Melihat daftar tugas yang belum selesai, tugas hari ini, tugas mendatang, dan tugas selesai.
2. Membuat, mengedit, menghapus, serta menandai tugas selesai/belum selesai.
3. Mencatat judul (wajib, maksimal 120 karakter), catatan (opsional, maksimal 500 karakter), tanggal tenggat (opsional), dan prioritas Rendah/Normal/Tinggi.
4. Mencari tugas berdasarkan judul atau catatan.
5. Melihat ringkasan jumlah tugas belum selesai, agenda hari ini, dan tugas selesai.
6. Menampilkan tenggat terlewat untuk tugas yang belum selesai.
7. Mengonfirmasi penghapusan dan menampilkan pesan ketika operasi gagal.

## Model data
Tabel `public.tasks`:
- `id`: UUID, primary key.
- `user_id`: UUID pemilik, merujuk `auth.users`.
- `title`: teks wajib, 1–120 karakter.
- `description`: teks opsional, maksimal 500 karakter.
- `due_date`: tanggal opsional.
- `priority`: Rendah, Normal, atau Tinggi.
- `is_completed`: status boolean.
- `created_at`: waktu pembuatan.

Skema dan kebijakan RLS ada di `supabase/schema.sql`.

## Teknologi dan deployment
- React 18, TypeScript, Vite.
- Supabase Auth dan Postgres.
- Source code dapat dipush ke GitHub; build produksi menggunakan `npm run build`.
- Dapat dideploy ke Vercel sebagai proyek Vite. Atur `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di environment variables Vercel.
- Kredensial publik Supabase tidak menggantikan RLS. Jangan menaruh `service_role` key di aplikasi browser.

## Kriteria penerimaan
- Build TypeScript dan Vite berhasil.
- CRUD, pencarian, filter daftar, toggle status, dan ringkasan bekerja.
- Mode demo tetap dapat digunakan tanpa environment Supabase.
- Mode Supabase meminta autentikasi dan menggunakan operasi data yang tunduk pada kebijakan RLS.
- Layout dapat digunakan pada layar desktop dan ponsel.

## Di luar cakupan versi awal
Kolaborasi, berbagi tugas, lampiran, notifikasi/pengingat, kategori khusus, dan sinkronisasi kalender.
