# Pengelolaan Klaim KPR (BUM) — Dokumentasi Modul

Dokumentasi modul **Pengelolaan Klaim KPR (BUM)** pada prototipe Kepesertaan
YANDU NextGen. BUM = **Bantuan Uang Muka** KPR bagi peserta ASABRI. Modul ini
ada di prototipe root (bukan aplikasi terpisah), dengan lima sub menu di
sidebar. Aturan pengembangan (gaya, komponen, token warna) ada di
[CLAUDE.md](CLAUDE.md); cara menjalankan prototipe ada di [BACA-DULU.md](BACA-DULU.md).

Data hanya di memori — refresh browser selalu kembali ke kondisi awal.

> Modul ini **berbeda** dari **KPR (PUM)** di folder `pum/`. PUM adalah
> pengelolaan pinjaman KPR baru (pengajuan, approval, alokasi dana, pelunasan);
> BUM adalah pinjaman uang muka lama yang kini **dikelola/dipantau** di sini.
> Wizard Pengajuan PUM hanya *membaca* `DATA_BUM` untuk menolak peserta yang
> masih punya pinjaman BUM aktif.

---

## 1. Peta berkas

| Bagian | Lokasi |
|---|---|
| Tombol menu | `index.html` baris 43–50 (grup `Pengelolaan Klaim KPR (BUM)`) |
| Layar Klaim + Detail | `index.html` `s-bum`, `s-bum-detail` |
| Layar Upload / Verifikasi Bukti Angsuran + Detail | `index.html` `s-bum-angsuran`, `s-bum-verifikasi-angsuran`, `s-bum-angsuran-detail` |
| Layar Pelunasan + Detail | `index.html` `s-bum-pelunasan`, `s-bum-pelunasan-detail` |
| Layar Pembatalan + Detail | `index.html` `s-bum-pembatalan`, `s-bum-pembatalan-detail` |
| Logika Klaim, Pelunasan | `app.js` blok `BUM KPR` (± baris 1999) dan `PELUNASAN KPR (BUM)` (± baris 2243) |
| Logika Pembatalan | `app.js` blok `PEMBATALAN KPR (BUM)` (± baris 13065) |
| Logika Bukti Angsuran | `app.js` blok `BUKTI ANGSURAN KPR (BUM)` (± baris 13471) |
| Data | `data.js` blok 7 (`DATA_BUM`, `BUM_KPA_LOOKUP`), 25 (`DATA_BUM_PELUNASAN`), 26 (`DATA_BUM_PEMBATALAN`, `BUM_STATUS_PESERTA`, `BUM_PEMBATALAN_DOKUMEN`), 27 (`DATA_BUM_ANGSURAN`, `BUM_ANGSURAN_STATUS`) |

Tombol pintas "Rekonsiliasi BUM KPR" di dashboard (`index.html` baris 201) juga
mengarah ke layar Klaim KPR (BUM).

## 2. Navigasi (sidebar)

```
Pengelolaan Klaim KPR (BUM)
  ├─ Klaim KPR (BUM)             data-go="bum"
  ├─ Upload Bukti Angsuran       data-go="bum-angsuran"
  ├─ Verifikasi Bukti Angsuran   data-go="bum-verifikasi-angsuran"
  ├─ Pelunasan KPR (BUM)         data-go="bum-pelunasan"
  └─ Pembatalan KPR (BUM)        data-go="bum-pembatalan"
```

Layar detail (`bum-detail`, `bum-angsuran-detail`, `bum-pelunasan-detail`,
`bum-pembatalan-detail`) tidak punya tombol menu — dibuka dari tombol
**👁 Detail** di tiap baris tabel.

## 3. Konsep dasar

### 3.1 Jenis pinjaman BUM

Ada tiga jenis (`BUM_JENIS` di `app.js`), masing-masing punya warna badge:

| Jenis | Badge |
|---|---|
| BUM KPR YKPP PROGSUS | `pill-warn` |
| BUM KPR TWPAD | `pill-info` |
| BUM KPR YKPP PROGREG | `pill-ok` |

Hanya jenis **PROGREG** punya **Imbal Jasa Program Reguler** (muncul di Detail
Pelunasan). Jenis lain tidak memilikinya.

### 3.2 Pelaku (peran) dalam alur

| Pelaku | Peran |
|---|---|
| **YPPSDP** | Penyedia program/penerbit surat pembatalan BUM |
| **Peserta** | Pemilik pinjaman BUM (aktif atau pensiun) |
| **Kantor Cabang ASABRI** | Merekam setoran angsuran; mengajukan Request Umum untuk pembatalan peserta pensiun |
| **Div. Kepesertaan** (bersama Pengembangan Manfaat) | Mendaftar ulang klaim, memverifikasi bukti angsuran, merekam pembatalan |
| **Divisi Keuangan** | Menerbitkan SP pembayaran pemotongan (pembatalan peserta pensiun) |

### 3.3 Kunci data

- **KPA** (Nomor Kartu Peserta ASABRI) adalah kunci utama untuk mengisi data
  peserta otomatis di semua form.
- **Nomor Piutang / Nomor Pinjaman** (mis. `BUM-2021-00114`) adalah kunci
  pinjaman; dipakai untuk menautkan Klaim → Angsuran → Pelunasan → Pembatalan.

### 3.4 Dua cara hutang BUM berkurang

```
Hutang BUM peserta
   ├─ (a) Dipotong dari hak asuransi      → layar Pelunasan KPR (BUM)
   └─ (b) Dibayar angsur oleh peserta     → layar Upload + Verifikasi Bukti Angsuran
```

Angsuran dipakai untuk hutang yang **tidak terpotong dari hak asuransi**
(teks bantuan layar Upload Bukti Angsuran).

---

## 4. Sub modul

### 4.1 Klaim KPR (BUM) — `bum`

**Tujuan:** daftar induk klaim/pinjaman BUM peserta; sumber data bagi empat
sub menu lainnya.

- **Filter:** Dari/Sampai Tanggal (terhadap TMT Pengangkatan Awal), Kantor
  Cabang, NRP/NIP, Nama, Nomor Pinjaman, Jenis Pinjaman.
- **Kolom:** KPA, NRP/NIP, NIK, Nama, Tanggal Lahir, TMT Pengangkatan Awal,
  TMT Akad Kredit, Nomor Piutang, Jenis Pinjaman, Jumlah Nominal BUM,
  Keterangan, Aksi.
- **Aksi:** `▤ Export Excel`, `👁 Detail`, dan tombol utama
  **+ Pendaftaran Ulang Klaim KPR (BUM)**.
- **Detail** (`bum-detail`): kartu baca-saja berisi *Data Peserta* dan *Data
  Akad BUM*.

**Pendaftaran Ulang Klaim (modal):**

1. Petugas mengetik **KPA**. Begitu valid (ada di `BUM_KPA_LOOKUP`), NRP, NIK,
   Nama, Tanggal Lahir, dan TMT Pengangkatan Awal **terisi otomatis dan
   terkunci**. KPA tidak dikenal → toast error, field dikosongkan.
2. Petugas mengisi data akad: **TMT Akad Kredit**, **Nomor Piutang**,
   **Jenis Pinjaman**, **Jumlah Nominal BUM** (wajib), serta Keterangan
   (opsional).
3. **Simpan** → baris baru masuk paling atas tabel. *Sisa Hutang* dan *Saldo
   Outstanding* **tidak diinput** — diambil dari data peserta yang tercatat
   sistem.

### 4.2 Upload Bukti Angsuran — `bum-angsuran`

**Tujuan:** sisi **Kantor Cabang** — merekam setoran angsuran peserta beserta
bukti setornya.

- **Filter:** Dari/Sampai Tanggal Bayar, Kantor Cabang, KPA, Nama, Jenis
  Pinjaman, Status.
- **Kolom:** KPA, NRP/NIP, Nama, Kantor Cabang, Nomor Pinjaman, Jenis
  Pinjaman, Angsuran Ke, Tanggal Bayar, Nominal Setor, Sisa Hutang, Bukti
  Angsuran, Status, Aksi.
- **Aksi:** `⬆ Upload Bukti Angsuran`, `▤ Export Excel`, `👁 Detail`, dan
  `⌫ Hapus` (hanya tampil selama status **Menunggu Verifikasi**).

**Form Upload (modal):**

1. Ketik **KPA** → NRP, Nama, Kantor Cabang, Nomor Pinjaman, Jenis Pinjaman,
   dan Sisa Hutang terisi otomatis dari daftar Klaim KPR (BUM). Field
   **Angsuran Ke-** terisi otomatis = angsuran terakhir peserta + 1 (boleh
   diubah).
2. **Status Angsuran** terisi `Dalam Angsuran Pinjaman` bila sisa hutang > 0,
   atau `Lunas`.
3. Petugas mengisi **Tanggal Bayar**, **Nominal Setor**, dan mengunggah
   **bukti** (PDF/JPG/PNG, maks. 5 MB).
4. **Validasi:** semua field wajib terisi; **Nominal Setor tidak boleh
   melebihi Sisa Hutang**.
5. **Simpan & Kirim Verifikasi** → baris baru lahir dengan nomor bukti
   `ANG-<tahun>-<urut 4 digit>` dan status **Menunggu Verifikasi**, langsung
   muncul di layar Verifikasi.

### 4.3 Verifikasi Bukti Angsuran — `bum-verifikasi-angsuran`

**Tujuan:** sisi **Div. Kepesertaan** — memutuskan setiap setoran sebelum
diakui sebagai pengurang hutang.

- Daftar sama dengan layar Upload (satu sumber `bumAngsuranRows`), tetapi
  filter tanggalnya memakai **Tanggal Unggah** dan kolomnya menampilkan
  Tanggal Unggah, bukan Sisa Hutang. Tidak ada tombol Upload/Hapus.
- Tombol **👁 Detail** membuka halaman detail yang sama dengan layar Upload;
  bila dibuka dari layar Verifikasi dan status masih *Menunggu Verifikasi*,
  halaman itu menampilkan tombol putusan:
  - **✓ Setujui Verifikasi** → modal konfirmasi + catatan pemeriksa
    (opsional) → status **Terverifikasi**, setoran tidak bisa diubah lagi
    oleh Kantor Cabang.
  - **✕ Tolak Verifikasi** → modal wajib **Alasan Penolakan** → status
    **Ditolak**, setoran dikembalikan ke Kantor Cabang untuk diperbaiki dan
    diunggah ulang.
- Halaman detail juga memuat **Preview Bukti Angsuran** (gambar/PDF terunggah
  pada sesi berjalan; data contoh hanya menampilkan nama berkas).

### 4.4 Pelunasan KPR (BUM) — `bum-pelunasan`

**Tujuan:** daftar pelunasan pinjaman BUM yang **dipotong dari hak peserta**
(contoh data: `Tabungan Asuransi`).

- **Filter:** Dari/Sampai Tanggal SP, Kantor Cabang, NRP/NIP, Nama, Jenis
  Potongan, Jenis Pinjaman.
- **Kolom:** No, Jenis Pinjaman, Tanggal Rekonsiliasi, KPA, NRP/NIP, Nama,
  Jenis Potongan, Bruto, Nominal, Kantor Cabang, Tanggal SP, Tanggal DPS,
  Tanggal Periode, Notes, Aksi.
- **Detail** (`bum-pelunasan-detail`): baca-saja — *Data Peserta*, *Data
  Pinjaman* (No Pinjaman, Jenis, Jumlah, Sisa Hutang), *Rincian Pelunasan*
  (Bruto, Nominal, Tanggal Rekonsiliasi/SP/DPS/Periode, Notes). Untuk jenis
  **PROGREG** muncul tambahan **Imbal Jasa Program Reguler**.

**Unggah Data Pelunasan (modal, kolektif):**

1. Petugas memilih **Jenis Pinjaman**, **Tanggal Rekonsiliasi**, melampirkan
   berkas (.xls/.xlsx/.csv), dan Notes (opsional).
2. **Submit** → sistem menambahkan satu baris per peserta berjenis pinjaman
   itu yang **belum ada** di daftar pelunasan. Tidak ada peserta tersisa →
   toast error. *(Isi berkas tidak benar-benar dibaca di prototipe; baris
   dibangkitkan dari `DATA_BUM`.)*
3. Nilai turunan di prototipe: Jenis Potongan = `Tabungan Asuransi`,
   Nominal = Sisa Hutang + Outstanding, Bruto = Nominal × 1,05, Imbal Jasa
   (PROGREG) = 2% dari Jumlah.

### 4.5 Pembatalan KPR (BUM) — `bum-pembatalan`

**Tujuan:** merekam **surat pembatalan BUM KPR dari YPPSDP** dan menarik data
pembatalan peserta. Alurnya **bercabang menurut status peserta** saat surat
masuk.

- **Filter:** Dari/Sampai Tanggal Surat, Kantor Cabang, KPA, NRP/NIP, Nama,
  Status Peserta, Status.
- **Kolom:** No, Nama, NRP/NIP, KPA, Status Peserta, Nomor Pinjaman, Jenis
  Pinjaman, Nominal, Nomor Surat, Tanggal Surat, Kantor Cabang, Aksi.
- **Aksi:** `+ Proses Pembatalan BUM KPR`, `▤ Export Excel`, `👁 Detail`, dan
  `🧾 Terbitkan SP` (hanya untuk status **Menunggu SP**).

**Status pembatalan:**

| Status | Arti | Badge |
|---|---|---|
| Tercatat | Peserta aktif; data pembatalan siap ditarik | `pill-info` |
| Menunggu SP | Peserta pensiun; SP pembayaran belum diterbitkan Div. Keuangan | `pill-warn` |
| Selesai | Peserta pensiun; SP pembayaran sudah terbit | `pill-ok` |

**Proses Pembatalan (modal):**

1. Ketik **KPA** → NRP, Nama, Kantor Cabang, Nomor Pinjaman, Jenis Pinjaman,
   dan **Status Peserta** (Aktif/Pensiun, dari `BUM_STATUS_PESERTA`) terisi
   otomatis. Banner info menyesuaikan jalur.
2. Untuk peserta **Pensiun** muncul blok **Pengajuan Kantor Cabang**:
   *Nomor Request Umum* dan dua dokumen wajib — *Surat Permohonan Pembatalan
   BUM KPR* dan *Surat Pembatalan BUM KPR dari YPPSDP*.
3. Semua peserta mengisi **Nomor Surat**, **Tanggal Surat**, **Nominal
   Pembatalan** (wajib), dan Keterangan (opsional).
4. **Simpan** → status awal `Tercatat` (Aktif) atau `Menunggu SP` (Pensiun).

**Terbitkan SP (modal, Divisi Keuangan):** mengisi **Nomor SP Pembatalan**,
**Nomor DPS**, dan **Tanggal DPS** (ketiganya wajib) → status menjadi
**Selesai**; ketiga kolom itu ikut tertarik pada data pembatalan.

---

## 5. Flow bisnis

### 5.1 Gambaran besar siklus hidup BUM

```
                       ┌──────────────────────────────────────────┐
                       │  Klaim KPR (BUM)  — daftar induk         │
                       │  (Pendaftaran Ulang data akad dari       │
                       │   arsip YPPSDP, berkunci pada KPA)       │
                       └───────────────────┬──────────────────────┘
                                           │ pinjaman BUM aktif (ada sisa hutang)
         ┌─────────────────────────────────┼──────────────────────────────────┐
         ▼                                 ▼                                  ▼
 Hutang dibayar ANGSUR           Hutang DIPOTONG dari               Pinjaman DIBATALKAN
 oleh peserta                    hak asuransi                       (surat YPPSDP)
 Upload → Verifikasi             Pelunasan KPR (BUM)                Pembatalan KPR (BUM)
 Bukti Angsuran                  (unggah kolektif)                  (jalur Aktif / Pensiun)
```

Klaim KPR (BUM) adalah **hulu**: Upload Bukti Angsuran, Pelunasan, dan
Pembatalan semuanya mencari peserta lewat `DATA_BUM` (berdasarkan KPA /
jenis pinjaman).

### 5.2 Alur A — Pendaftaran Ulang Klaim

1. Petugas Div. Kepesertaan membuka **Klaim KPR (BUM)** → **+ Pendaftaran
   Ulang Klaim**.
2. Mengetik KPA → data peserta terisi dan terkunci.
3. Melengkapi data akad (TMT Akad, Nomor Piutang, Jenis, Nominal).
4. Simpan → klaim muncul di daftar dan **siap dipakai** sub menu lain.

### 5.3 Alur B — Angsuran oleh peserta

```
Peserta menyetor angsuran ke rekening
        │
        ▼
Kantor Cabang: Upload Bukti Angsuran
 (KPA → autofill; Angsuran Ke-, Tgl Bayar, Nominal, bukti)
 Validasi: nominal ≤ sisa hutang
        │ status: MENUNGGU VERIFIKASI
        │ (boleh dihapus selama belum diputus)
        ▼
Div. Kepesertaan: Verifikasi Bukti Angsuran
        │
        ├── Setujui (+ catatan opsional) ──► TERVERIFIKASI
        │       setoran diakui sebagai pengurang hutang; terkunci
        │
        └── Tolak (alasan WAJIB) ─────────► DITOLAK
                dikembalikan ke Kantor Cabang untuk diperbaiki / diunggah ulang
```

Aturan kunci:
- Baris baru selalu lahir **Menunggu Verifikasi**.
- Hanya status Menunggu Verifikasi yang bisa dihapus (Kantor Cabang) atau
  diputus (Div. Kepesertaan).
- Penolakan **tanpa alasan tidak dapat disimpan**.
- Setoran **tidak boleh melebihi Sisa Hutang**.
- Setoran terakhir yang melunasi sisa hutang ditandai Status Angsuran `Lunas`.

### 5.4 Alur C — Pelunasan lewat potongan

1. Hak peserta (mis. Tabungan Asuransi) dipotong untuk melunasi pinjaman BUM,
   melalui SP dan DPS.
2. Petugas membuka **Pelunasan KPR (BUM)** → **Unggah Data Pelunasan**,
   memilih Jenis Pinjaman + Tanggal Rekonsiliasi + berkas.
3. Sistem menambah baris pelunasan per peserta (Bruto, Nominal, Tgl SP,
   Tgl DPS, Tgl Periode). Jenis PROGREG membawa Imbal Jasa Program Reguler.
4. Hasil dapat dilihat di Detail dan diekspor ke Excel.

### 5.5 Alur D — Pembatalan (bercabang)

**Jalur 1 — Peserta masih Aktif** (belum klaim THT):

```
YPPSDP kirim surat pembatalan (hardcopy) langsung ke ASABRI
   → Div. Kepesertaan / Pengembangan Manfaat rekam:
     Nomor & Tgl Surat, Nominal, Keterangan
   → status: TERCATAT  (selesai; data siap diekspor)
```

**Jalur 2 — Peserta Pensiun** (sudah proses klaim THT / pensiun):

```
Peserta minta surat pembatalan ke YPPSDP
   → bawa ke Kantor Cabang + Surat Permohonan
   → Kantor Cabang ajukan Request Umum (+ 2 dokumen kelengkapan)
   → Div. Kepesertaan rekam data pembatalan
   → status: MENUNGGU SP
   → Divisi Keuangan terbitkan SP pembayaran pemotongan
     (Nomor SP, Nomor DPS, Tanggal DPS)
   → status: SELESAI
```

Perbedaan data hasil tarikan:

| | Aktif | Pensiun |
|---|---|---|
| Request Umum + 2 dokumen | — | wajib |
| Nomor SP, Nomor DPS, Tanggal DPS | — | terisi setelah SP terbit |
| Status akhir | Tercatat | Selesai |

Keterangan pembatalan pada data contoh: *Batal Akad Kredit*, *Pembatalan
Sebagian*, *Pembatalan Seluruhnya*, *Rumah Batal Serah Terima*,
*Pengunduran Diri Peserta*.

### 5.6 Ringkasan status per sub modul

| Sub modul | Status |
|---|---|
| Klaim KPR (BUM) | tanpa status (daftar induk) |
| Bukti Angsuran | Menunggu Verifikasi → Terverifikasi / Ditolak |
| Pelunasan | tanpa status (data hasil unggah) |
| Pembatalan | Tercatat · Menunggu SP → Selesai |

---

## 6. Catatan prototipe

- Semua data dummy; berkas unggahan (Excel pelunasan, dokumen pembatalan)
  tidak benar-benar dibaca. Pengecualian: bukti angsuran yang diunggah pada
  sesi berjalan bisa dipratinjau.
- Tombol **Export Excel** hanya menampilkan toast.
- Tidak ada penyimpanan lintas refresh (sesuai aturan emas `CLAUDE.md`).
- Layar **Sejarah Hutang** di modul lain menampilkan *Tanggal Rekonsiliasi*
  untuk transaksi piutang BUM KPR YKPP PROGSUS.
