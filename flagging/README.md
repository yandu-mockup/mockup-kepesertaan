# Flagging Mitra Bayar — Dokumentasi Modul

Prototipe HTML/CSS/JS polos untuk modul **Pengelolaan Flagging Pinjaman Mitra**,
berdiri sendiri (tidak bergantung pada folder lain di repo ini). Lihat
[CLAUDE.md](../CLAUDE.md) di root repo untuk aturan pengembangan yang berlaku
di folder ini (gaya, komponen, batasan teknis).

## Isi folder

| File | Peran |
|---|---|
| `index.html` | Semua layar (36 `<section class="screen">`) |
| `data.js` | Seluruh data contoh, 19 blok bernomor |
| `app.js` | Router, render tabel, validasi, logika tiap sub modul |
| `style.css` | Design system (salinan dari `style.css` root) |
| `logo-asabri-white.png` | Logo navbar |
| `Template Check Booking Kolektif.xlsx` | Diunduh tombol di layar Check & Booking Kolektif |
| `Template Pengajuan Flagging.xlsx` | Diunduh tombol di layar Unggah Pengajuan Flagging |

Data hanya di memori — refresh browser selalu kembali ke kondisi awal.

## Navigasi (sidebar)

```
Dashboard
Pensiunan
Parameter Penetapan Tarif
Check dan Booking
  ├─ Individu
  └─ Kolektif
Pinjaman
  ├─ Pengajuan
  ├─ Flagging
  ├─ Take Over
  └─ Penagihan
Persetujuan
  ├─ Pengajuan
  └─ Top Up
Laporan
  ├─ Laporan Tagihan
  ├─ Laporan Booking
  ├─ Laporan Per Periode
  ├─ Laporan Per Mitra
  └─ Laporan Take Over
```

Role aktif dipilih lewat dropdown navbar (`#top-role`): beberapa peran ASABRI
(Pulminpes, Lojita, Pengembangan Manfaat, Kantor Cabang) dan beberapa mitra
bayar (Bank BRI, dst). Mengganti role memicu `renderTopNotif()` ulang — lonceng
notifikasi menampilkan pengajuan flagging milik role mitra yang sedang aktif
dan berstatus "Ditolak".

## Peta sub modul

### 1. Dashboard (`flagging-dashboard`)
Ringkasan akses/statistik, hanya tampilan — tidak ada logika filter berarti.

### 2. Pensiunan (`flagging-pensiunan`)
Rekap peserta berflagging per mitra bayar per periode (bulan/tahun), dipisah
peserta Aktif vs Pensiun beserta imbal jasanya, plus Jumlah Penerima/Jumlah
Netto. Filter: Periode Bulan, Tahun, Mitra Bayar.

### 3. Parameter Penetapan Tarif (`flagging-parameter-tarif`)
Tarif layanan per pasangan **Jenis Tarif × Jenis Peserta** (Checking, Booking,
Flagging, Top Up, Take Over × Aktif/Pensiun). Pasangan ini unik — layar
**Penetapan Tarif** (`flagging-tarif-tambah`) menolak pasangan yang sudah ada.
**Detail Tarif** (`flagging-tarif-detail`) baca-saja, menampilkan nominal.

### 4. Check dan Booking — Individu (`flagging-cb-individu`)
List + search + detail. Alur:
1. List menampilkan peserta yang sudah dibooking, dengan kolom **Status**
   (`Booked` / `Pengajuan`) dan **Aksi** (Detail/Ubah/Pembatalan — aktif hanya
   untuk status `Booked`, karena begitu status jadi `Pengajuan` datanya sudah
   masuk ke Pinjaman → Pengajuan).
2. Tombol **+ Check dan Booking Individu** → layar pencarian
   (`flagging-cb-individu-cari`), tiga mode: cari by Nama Peserta Aktif, by
   Nomor Pensiun (pensiun sendiri), atau by Nomor Pensiun Peminjam (pensiun
   waris — Info Peserta ≠ Info Peminjam).
3. **Detail** (`flagging-cb-booking-detail`) dan **Ubah**
   (`flagging-cb-booking-ubah`) adalah sepasang layar **yang dipakai bersama**
   oleh Individu maupun Kolektif, lewat pola `FCB_ASAL`/`fcbSetAsal()` —
   breadcrumb, tombol kembali, dan tujuan navigasi setelah submit menyesuaikan
   asal panggilannya secara dinamis.
4. Submit form Ubah (Data Pinjaman 18 field) mengubah status baris jadi
   `Pengajuan` dan baris itu otomatis muncul di Pinjaman → Pengajuan.

### 5. Check dan Booking — Kolektif (`flagging-cb-kolektif`)
List peserta kolektif dengan kolom yang sama (Peserta + Penerima + Status +
Aksi), filter Mitra. Tombol **+ Check & Booking Flagging Kolektif** membuka
layar unggah berkas (`flagging-cb-check`, pakai
`Template Check Booking Kolektif.xlsx`). Pembatalan booking pada baris
berstatus `Booked` mengubah statusnya jadi `Dibatalkan` (baris tidak dihapus).

### 6. Pinjaman — Pengajuan (`flagging-pinjaman-pengajuan`)
Hanya memuat baris berstatus `"Pengajuan"` (`FPG_STATUS_PINJAMAN`) — begitu
disetujui/ditolak di Persetujuan, baris pindah status ke `Booked`/`Dibatalkan`
dan otomatis hilang dari daftar ini. Tombol **Unggah** membuka
`flagging-pengajuan-unggah` (pakai `Template Pengajuan Flagging.xlsx`).
**Detail Pengajuan** (`flagging-pengajuan-detail`) **baca-saja sepenuhnya** —
tidak ada aksi ubah, dengan banner permanen yang menjelaskan alasannya
(datanya sudah masuk antrean Persetujuan dengan aktivitas "Pengajuan
Pinjaman"). **Riwayat** (`flagging-pengajuan-riwayat`) menampilkan jejak
perubahan status per baris.

### 7. Pinjaman — Flagging (`flagging-pinjaman-flagging`)
Daftar pinjaman yang flagging-nya sudah aktif (`DATA_FLAGGING_PINJAMAN`),
dengan filter pencarian + Status (`Disetujui`/`Lunas`) dan tombol **⤓ Export
Excel** (mengekspor persis hasil filter yang sedang aktif, seluruh halaman —
bukan cuma yang tampil — sebagai CSV ber-BOM, nama berkas mengikuti filter).
Per baris tersedia aksi:
- **Detail** (`flagging-flagging-detail`) — bisa diubah (`✎ Ubah`).
- **Pelunasan** (`flagging-pelunasan`) — hanya aktif untuk status `Disetujui`;
  submit-nya otomatis membuat entri Persetujuan baru dengan aktivitas
  **"Pelunasan Flagging"**.
- **Top Up** — hanya aktif untuk status `Disetujui`; membuka alur Top Up
  (lihat bagian Persetujuan → Top Up) dengan aktivitas **"Pengajuan Top Up"**.
- **Riwayat** (`flagging-flagging-riwayat`).

### 8. Pinjaman — Take Over (`flagging-pinjaman-takeover`)
List + filter (pencarian + Status: `Tertunda`/`Diterima`/`Ditolak`, dari
`FTO_STATUS`). Kolom mengelompokkan **Mitra** (Awal/Pengajuan), **Takeover**,
**Mitra Takeover**, **ASABRI** (masing-masing Tanggal/User) — tiga tahap
pemrosesan take over. Tombol **+ Tambahkan Take Over**
(`flagging-takeover-tambah`) dan **Detail** (`flagging-takeover-detail`) yang
bisa diubah.

### 9. Pinjaman — Top Up (`flagging-pinjaman-topup`)
Terpisah dari menu sidebar (diakses lewat tombol Top Up di halaman Flagging),
list + filter Status (`FTU_STATUS`). Tombol **+ Tambahkan Top Up**
(`flagging-topup-tambah`): alur dua tahap — isi KPA & cari dulu, baru form
Data Pinjaman tampil setelah hasil pencarian ketemu; mengosongkan/mengubah
field KPA otomatis menyembunyikan & mereset form (`ftutSembunyikanHasil()`)
supaya tidak ada data basi yang nyangkut. **Detail**
(`flagging-topup-detail`) baca-saja.

### 10. Pinjaman — Penagihan (`flagging-pinjaman-penagihan`)
Satu halaman scroll, dua tabel dari sumber data yang sama (`fpnRows`):
- **Mitra** — satu baris = satu **batch** penagihan, filter Mitra + Status
  Peserta, aksi **Detail** (`flagging-penagihan-detail`, baca-saja).
- **Peserta** — meratakan `peserta[]` dari **seluruh** batch jadi satu daftar
  (`fppDaftar()`), filter KPA/NRP/NIP/Nama + Status Peserta, kolom **Status
  Tagih** sendiri (`Ditagih`/`Terbayar`/`Gagal`, pill berwarna) — beda dari
  Status Peserta (Aktif/Pensiun).

Tombol **+ Tambah Penagihan Pinjaman** (`flagging-penagihan-tambah`): isi
Kriteria Penagihan (Mitra Bayar — search/autocomplete, Status Peserta —
Semua/Aktif/Pensiun, rentang Tanggal, Catatan opsional) → **Cari Data**
mengambil peserta dari pinjaman Flagging berstatus `Disetujui` milik mitra
tsb. → **Simpan** membuat batch baru (`statusTagih` seluruh pesertanya mulai
dari `"Ditagih"`) dan kembali ke daftar. Tidak ada aksi untuk mengubah Status
Tagih dari UI — nilainya hanya berubah lewat data seed atau saat batch baru
dibuat.

### 11. Persetujuan — Pengajuan (`flagging-persetujuan`)
Antrean umum semua jenis pengajuan (Pengajuan Pinjaman, Pelunasan Flagging,
dll) **kecuali** aktivitas "Pengajuan Top Up" (disaring lewat
`FPS_AKTIVITAS_TOPUP`, supaya tidak dobel dengan antrean Top Up khusus di
bawah). **Detail** (`flagging-persetujuan-detail`) punya tombol Setujui/Tolak
dengan pop up alasan wajib diisi untuk penolakan. **Riwayat Persetujuan**
(`flagging-persetujuan-riwayat`) — halaman penuh (bukan modal), 11 kolom,
menampilkan seluruh keputusan yang sudah diambil.

### 12. Persetujuan — Top Up (`flagging-persetujuan-topup`)
Antrean khusus untuk aktivitas "Pengajuan Top Up" saja. **Detail**
(`flagging-persetujuan-topup-detail`) menampilkan detail top up-nya, dengan
tombol Setujui/Tolak + pop up alasan yang sama seperti Persetujuan Pengajuan.

### 13–17. Laporan (`flagging-laporan-*`)
Lima sub halaman laporan, pola yang konsisten di semuanya:

| Halaman | Data | Status filter |
|---|---|---|
| Laporan Tagihan | `DATA_FLAGGING_LAPORAN_TAGIHAN` | Pending / Disetujui / Ditolak |
| Laporan Booking | `DATA_FLAGGING_LAPORAN_BOOKING` | Booked / Pengajuan / Dibatalkan |
| Laporan Per Periode | `DATA_FLAGGING_LAPORAN_PERIODE` | Disetujui / Pelunasan |
| Laporan Per Mitra | — (tabel menyusul sesuai referensi FSD) | Booked / Pengajuan / Disetujui / Pelunasan / Ditolak |
| Laporan Take Over | `DATA_FLAGGING_LAPORAN_TAKEOVER` | Pengajuan / Disetujui / Take Over |

Filter yang sama di tiap halaman: **Mitra** (search/autocomplete, lewat
`bindMitraAutocomplete()`), **Tanggal Dari/Sampai**, **Status Peserta**
(Aktif/Pensiun), **Status** (tabel di atas), tombol **⌕ Cari**, **🖶 Download
PDF** (`window.print()`), **⤓ Download Excel** (CSV+BOM mengikuti hasil
filter, bukan cuma halaman yang tampil). Laporan Per Mitra baru berisi UI
filter — tabelnya belum ada spesifikasi, jadi Cari/Download untuk sementara
hanya menampilkan toast "masih dalam pengembangan".

## Pola & konvensi teknis khusus modul ini

- **Layar bersama (shared screen) via "asal"** — Detail/Ubah Check & Booking
  dipakai baik dari Individu maupun Kolektif; `FCB_ASAL` menyimpan dari mana
  layar dibuka supaya breadcrumb, tombol kembali, dan redirect setelah submit
  ikut menyesuaikan.
- **Export Excel = CSV+BOM+`;`** — tidak ada library .xlsx yang boleh
  ditambah (lihat [CLAUDE.md](../CLAUDE.md)), jadi "Download Excel" di mana
  pun di modul ini selalu berupa CSV berawalan BOM UTF-8 (`"﻿" + isi`)
  dengan pemisah `;` (supaya Excel berlokal Indonesia memecah kolom dengan
  benar), diunduh lewat `Blob` + elemen `<a download>` sementara. Nama berkas
  selalu mengikuti filter yang sedang aktif.
- **Download PDF = `window.print()`** — bukan berkas `.pdf` sungguhan, pola
  yang sama dipakai "Cetak PDF" di prototipe utama (`app.js` root,
  Pratinjau Cetak KPA).
- **Export selalu mengikuti seluruh hasil filter**, bukan hanya halaman
  paginasi yang sedang tampil di layar.
- **`.field{position:relative}`** di `style.css` wajib ada supaya
  `.autocomplete-list` (search field mitra) menempel tepat di bawah input-nya
  — tanpa ini dropdown-nya melayang ke posisi yang salah di halaman.
- **Validasi non-blocking** — contoh di Check & Booking Individu: peserta
  usia ≥75 tahun tetap menampilkan info peserta dan tetap bisa lanjut booking,
  hanya diberi peringatan (`tone:"warn", lanjut:true` di `FCBI_VALIDASI`),
  bukan diblokir.
- **Status "Dibatalkan" tidak pernah menghapus baris** — baik di Check &
  Booking Kolektif maupun di tempat lain, pembatalan selalu mengubah field
  `status`, bukan `splice`/menghapus baris dari array.
