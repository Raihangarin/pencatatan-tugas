# RuangTugas

Aplikasi pencatatan tugas harian dengan React, TypeScript, dan Supabase.

## Menjalankan lokal

1. Pasang Node.js versi 20 atau lebih baru.
2. Jalankan `npm install`.
3. Untuk mencoba tanpa backend, jalankan `npm run dev`; aplikasi memakai mode demo dan menyimpan tugas di browser.
4. Untuk menggunakan Supabase, salin `.env.example` menjadi `.env`, lalu isi URL dan publishable key dari pengaturan proyek Supabase:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

5. Di Supabase SQL Editor, jalankan isi `supabase/schema.sql`.
6. Jalankan `npm run dev` dan buka URL lokal yang dicetak Vite.

Mode Supabase memerlukan email/password auth. Aktifkan provider Email di Supabase Authentication. Jika konfirmasi email aktif, pengguna perlu mengonfirmasi alamat email sebelum masuk.

## Pemeriksaan dan build

```bash
npm run build
npm run preview
```

## GitHub dan Vercel

1. Buat repository GitHub dan push source code proyek ini.
2. Impor repository tersebut di Vercel. Framework preset: **Vite**; build command: `npm run build`; output directory: `dist`.
3. Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` pada Vercel Project Settings → Environment Variables, untuk environment yang digunakan.
4. Deploy ulang setelah environment variables ditambahkan.
5. Tambahkan URL deployment Vercel ke Supabase Authentication → URL Configuration (Site URL dan Redirect URLs) bila diperlukan untuk alur konfirmasi email.

Jangan pernah memasukkan Supabase `service_role` key ke dalam aplikasi frontend. Akses tabel tugas dilindungi kebijakan RLS pada `supabase/schema.sql`.

Dokumen proyek: [AGENTS.md](./AGENTS.md), [spec.md](./spec.md), [plan.md](./plan.md), [history/README.md](./history/README.md).
