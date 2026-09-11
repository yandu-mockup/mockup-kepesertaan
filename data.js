/* ===========================================================================
   data.js — SEMUA DATA CONTOH PROTOTIPE
   ---------------------------------------------------------------------------
   File ini sengaja dipisah supaya mudah diubah tanpa menyentuh logika aplikasi.
   Aman untuk diedit sendiri. Aturan singkat:
     - Teks selalu diapit tanda kutip "..."
     - Angka TANPA titik/koma  →  benar: 1250000000   salah: 1.250.000.000
     - Tiap baris data dipisah koma, baris terakhir boleh tanpa koma
     - Jangan hapus tanda kurung [ ] { } yang membungkusnya
   Setelah diedit: simpan file, lalu refresh browser (Ctrl+R / Cmd+R).
   =========================================================================== */


/* ---------------------------------------------------------------------------
   1. DAFTAR KOLOM DATA PESERTA
   Dipakai bersama oleh alur Kolektif: tabel List Kotor, form Revisi,
   tabel Preview & Simpan, dan tabel batch di Verifikasi Kolektif.
   (Pendaftaran Perorangan punya daftar kolomnya sendiri di app.js.)
   Format: ["kunci_data", "JUDUL KOLOM YANG TAMPIL"]
   Menambah kolom di sini otomatis menambahkannya di semua tampilan tersebut.
   --------------------------------------------------------------------------- */
const FIELDS = [
  ["nrp",        "NRP/NIP"],
  ["nama",       "NAMA"],
  ["sts",        "STS PERSONIL"],
  ["unor",       "UNOR"],
  ["angkatan",   "ANGKATAN"],
  ["pangkat",    "PANGKAT"],
  ["kdPangkat",  "KODE PANGKAT"],
  ["noSkep",     "NO SKEP"],
  ["tglSkep",    "TGL SKEP"],
  ["tmtSkep",    "TMT SKEP"],
  ["kesatuan",   "KESATUAN"],
  ["kdKesatuan", "KODE KESATUAN"],
  ["kdKancab",   "KODE KANCAB"],
  ["jnsKel",     "JNS KEL"],
  ["tmpLahir",   "TEMPAT LAHIR"],
  ["tglLahir",   "TGL LAHIR"],
  ["alamat",     "ALAMAT"],
  ["kelurahan",  "KELURAHAN"],
  ["kecamatan",  "KECAMATAN"],
  ["kota",       "KOTA"],
  ["propinsi",   "PROPINSI"],
  ["noHp",       "NO HP"],
  ["email",      "EMAIL"],
  ["nik",        "NIK"],
  ["npwp",       "NPWP"]
];

/* Field yang wajib diisi (ditandai bintang merah + divalidasi saat simpan) */
const FIELD_WAJIB = ["nrp", "nama", "nik"];

/* Field yang ditampilkan lebih lebar (2 kolom) di form */
const FIELD_LEBAR = ["alamat", "kesatuan", "email"];


/* ---------------------------------------------------------------------------
   2. DATA LIST KOTOR — baris yang gagal validasi saat upload batch
   Kunci "_err" menandai field bermasalah beserta pesan errornya — pesan ini
   yang dipakai untuk mengelompokkan baris di tabel "Rekap List Kotor".
   Contoh menambah error lain:  _err: { nik: "NIK harus 16 digit" }
   Kalau baris tidak punya error, hapus saja seluruh baris "_err".

   Untuk memudahkan bikin banyak baris contoh sekaligus, dipakai fungsi
   bantu buatBarisKotor() di bawah — silakan ubah angka "jumlah" atau
   "errMsg" kalau mau ganti skenario contohnya.
   --------------------------------------------------------------------------- */
function buatBarisKotor(jumlah, opsi) {
  const { prefixNama, mulai, errKey, errMsg, tglLahir, nik } = opsi;
  const baris = [];
  for (let i = 0; i < jumlah; i++) {
    const n = mulai + i;
    baris.push({
      nrp:`19930425202321${2000 + n}`, nama:`${prefixNama} ${i + 1}`,
      sts:"1", unor:"3", angkatan:"3", pangkat:"PRADA", kdPangkat:"1001",
      noSkep:`KEP/${1400 + n}/X/2023`, tglSkep:"10/26/2023", tmtSkep:"11/1/2023",
      kesatuan:"KEMENTERIAN PERTAHANAN", kdKesatuan:"638012", kdKancab:"2000",
      jnsKel: n % 2 === 0 ? "1" : "2", tmpLahir:"Tulungagung",
      tglLahir: tglLahir || "15/08/1996",
      alamat:`Perumahan Purimas Blok ${n}`, kelurahan:"Botoran", kecamatan:"Botoran",
      kota:"Kabupaten Tulungagung", propinsi:"Jawa Timur",
      noHp:`0868390${40000 + n}`, email:`peserta${n}@gmail.com`,
      nik: nik || `321794285232${1000 + n}`, npwp:`432427341${8000 + n}`,
      _err:{ [errKey]: errMsg }
    });
  }
  return baris;
}

const DATA_LIST_KOTOR = [
  ...buatBarisKotor(5, {
    prefixNama:"Peserta Muda", mulai:100, errKey:"tglLahir",
    errMsg:"Peserta dibawah umur 17 Tahun", tglLahir:"12/05/2015"
  }),
  ...buatBarisKotor(2, {
    prefixNama:"Peserta Format", mulai:200, errKey:"nik",
    errMsg:"NIK Tidak Sesuai Format", nik:"12345"
  }),
  ...buatBarisKotor(15, {
    prefixNama:"Peserta Invalid", mulai:300, errKey:"tglLahir",
    errMsg:"Tanggal Lahir Tidak Valid", tglLahir:"31/02/1995"
  })
];

/* ---------------------------------------------------------------------------
   3. KESATUAN PENGAJU — pilihan dropdown "Kesatuan Pengaju" pada form
   Pendaftaran Peserta Baru » Kolektif.
   --------------------------------------------------------------------------- */
const DATA_KESATUAN_PENGAJU = ["Mabes TNI", "Mabes Polri", "Kementerian Pertahanan"];

/* ---------------------------------------------------------------------------
   4. MASTER DATA PESERTA (mensimulasikan data yang ditarik dari ASABRI —
      dipakai validasi "NRP/NIP sudah terdaftar" di Pendaftaran Peserta Baru)
   --------------------------------------------------------------------------- */
const DATA_MASTER_PESERTA = [
  { kpa:"CD317049", nrp:"119596",             npwp:"73.104.502.7-009.000", nik:"3171015001850101", nama:"Intan M. Sari",
    angkatan:"TNI-AL", uker:"Polres Jakarta Barat" },
  { kpa:"CY104869", nrp:"197804081998032003", npwp:"89.231.218.2-603.000", nik:"3174014208780102", nama:"Made Wardani",
    angkatan:"TNI-AL", uker:"Polres Jakarta Selatan" },
  { kpa:"CE360625", nrp:"132170",             npwp:"85.465.740.0-514.000", nik:"3173012701820103", nama:"Kenedi",
    angkatan:"TNI-AL", uker:"Kodim 0501 Jakarta Pusat" },
  { kpa:"CE358403", nrp:"127485",             npwp:"95.023.091.2-643.000", nik:"3216011505790104", nama:"Firman Dewantoro",
    angkatan:"TNI-AL", uker:"Polres Bekasi" },
  { kpa:"CD319552", nrp:"126284",             npwp:"92.704.589.8-126.000", nik:"3671012403810105", nama:"Aprildo Anang Riyadi",
    angkatan:"TNI-AL", uker:"Polres Tangerang" },
  { kpa:"CC306323", nrp:"14621/P",            npwp:"08.544.963.5-603.000", nik:"3271010208750106", nama:"Heriyanto, S.KM",
    angkatan:"TNI-AL", uker:"Polres Bogor" },
  { kpa:"CD400871", nrp:"148820",             npwp:"77.310.229.4-882.000", nik:"3374011712880107", nama:"Yusuf Pratama",
    angkatan:"TNI-AD", uker:"Kodim 0733 Semarang" },
  { kpa:"BP000111", nrp:"84071073",           npwp:"12.345.678.9-001.000", nik:"3273012909830108", nama:"Andi Saputra",
    angkatan:"Polri",  uker:"Polres Bandung" },
  { kpa:"EP000112", nrp:"199801152020121003", npwp:"23.456.789.0-002.000", nik:"3404010604860109", nama:"Eko Prasetyo",
    angkatan:"TNI-AU", uker:"Lanud Adisutjipto" },

  { kpa:"AD500221", nrp:"142376",             npwp:"14.257.836.9-114.000", nik:"3305011106790110", nama:"Bambang Setiawan",
    angkatan:"TNI-AD", uker:"Kodim 0709 Kebumen" },
  { kpa:"AL600334", nrp:"198502102010121004", npwp:"25.368.947.0-225.000", nik:"3578012407880211", nama:"Dewi Anggraini",
    angkatan:"TNI-AL", uker:"Lanal Surabaya" },
  { kpa:"AU700445", nrp:"156234",             npwp:"36.479.058.1-336.000", nik:"3172011302810112", nama:"Rudi Hartono",
    angkatan:"TNI-AU", uker:"Lanud Halim Perdanakusuma" },
  { kpa:"PL800556", nrp:"87023456",           npwp:"47.580.169.2-447.000", nik:"3578012009840113", nama:"Siti Nurhaliza",
    angkatan:"Polri",  uker:"Polres Surabaya" },
  { kpa:"AD500667", nrp:"199003152015031002", npwp:"58.691.270.3-558.000", nik:"3211012803900114", nama:"Joko Widiyanto",
    angkatan:"TNI-AD", uker:"Kodim 0610 Sumedang" },
  { kpa:"AL600778", nrp:"163890",             npwp:"69.702.381.4-669.000", nik:"3510011411870115", nama:"Maria Christina",
    angkatan:"TNI-AL", uker:"Lanal Banyuwangi" },
  { kpa:"PL800889", nrp:"91045678",           npwp:"70.813.492.5-770.000", nik:"3276012706930116", nama:"Agus Salim",
    angkatan:"Polri",  uker:"Polres Depok" },

  { kpa:"TA910123", nrp:"178432",             npwp:"81.924.605.6-881.000", nik:"3271051205870001", nama:"Slamet Riyadi",
    angkatan:"TNI-AD", uker:"Kodim 0610 Cimahi" },
  { kpa:"TB920234", nrp:"199105202018081005", npwp:"92.035.716.7-992.000", nik:"5171200812900002", nama:"Nur Aisyah",
    angkatan:"TNI-AD", uker:"Kodim 0714 Salatiga" },
  { kpa:"LA930345", nrp:"185673",             npwp:"03.146.827.8-103.000", nik:"3578301103950003", nama:"Hendra Gunawan",
    angkatan:"TNI-AL", uker:"Lanal Batam" },
  { kpa:"LB940456", nrp:"199206182019022003", npwp:"14.257.938.9-214.000", nik:"1271030508880004", nama:"Putri Ramadhani",
    angkatan:"TNI-AL", uker:"Lanal Ambon" },
  { kpa:"UA950567", nrp:"192784",             npwp:"25.368.049.0-325.000", nik:"7371151212920005", nama:"Yayan Kusuma",
    angkatan:"TNI-AU", uker:"Lanud Iswahjudi" },
  { kpa:"UB960678", nrp:"199308142020051004", npwp:"36.479.150.1-436.000", nik:"3573011007960122", nama:"Lestari Handayani",
    angkatan:"TNI-AU", uker:"Lanud Sulaiman" },
  { kpa:"PA970789", nrp:"88056789",           npwp:"47.580.261.2-547.000", nik:"3573012112890123", nama:"Fajar Nugroho",
    angkatan:"Polri",  uker:"Polres Malang" },
  { kpa:"PB980890", nrp:"90067890",           npwp:"58.691.372.3-658.000", nik:"3374011809910124", nama:"Ratna Sari",
    angkatan:"Polri",  uker:"Polres Semarang" },
  { kpa:"PC990901", nrp:"92078901",           npwp:"69.702.483.4-769.000", nik:"3404012504930125", nama:"Wahyu Saputro",
    angkatan:"Polri",  uker:"Polres Yogyakarta" },
  { kpa:"TC911012", nrp:"165789",             npwp:"70.813.594.5-770.000", nik:"3372010306820126", nama:"Indra Permana",
    angkatan:"TNI-AD", uker:"Kodim 0733 Solo" },

  /* Prajurit dengan Masa Kerja Dinas < 2 Tahun (TMT baru, lihat
     DATA_RIWAYAT_KEPANGKATAN di bawah) — dipakai untuk simulasi jalur
     dokumen "Surat Pernyataan Kesanggupan" bagi peserta Polri baru, dan
     kasus umum peserta TNI dengan masa kerja dinas masih pendek. */
  { kpa:"AD500992", nrp:"175002",             npwp:"31.560.772.4-992.000", nik:"3372011203010127", nama:"Dimas Aditya",
    angkatan:"TNI-AD", uker:"Kodim 0735 Surakarta" },
  { kpa:"AL600992", nrp:"175003",             npwp:"42.671.883.5-992.000", nik:"8103011805020128", nama:"Reza Firmansyah",
    angkatan:"TNI-AL", uker:"Lanal Tual" },
  { kpa:"AU700992", nrp:"175004",             npwp:"53.782.994.6-992.000", nik:"1471010207030129", nama:"Bagas Wicaksono",
    angkatan:"TNI-AU", uker:"Lanud Roesmin Nurjadin" },
  { kpa:"AD900123", nrp:"199105102016121003",  npwp:"64.183.275.9-123.000", nik:"3374012004890130", nama:"Yusuf Maulana",
    angkatan:"TNI-AD", uker:"Kodim 0731 Kudus" }
];

/* NRP/NIP dummy yang sengaja dibuat gampang diingat untuk menguji validasi
   "NRP/NIP sudah terdaftar" di form Pendaftaran Peserta Baru — ketik salah
   satu nomor di bawah pada field NRP/NIP, pesan error langsung muncul.
   Formatnya mewakili tiap pola nomor yang dipakai di prototipe: NRP prajurit
   6 digit, NRP Polri 8 digit, dan NIP PNS/PPPK 18 digit. Ikut didorong ke
   DATA_MASTER_PESERTA supaya sumber validasinya sama dengan peserta lain.
   Daftar nomornya juga ditampilkan sebagai catatan di bawah field NRP/NIP. */
const DATA_NRP_TERDAFTAR_DEMO = [
  { kpa:"DM000001", nrp:"111111",             npwp:"11.111.111.1-111.000", nama:"Dedi Kurniawan",
    angkatan:"TNI-AD", uker:"KODIM 0602/SERANG" },
  { kpa:"DM000002", nrp:"222222",             npwp:"22.222.222.2-222.000", nama:"Sri Wahyuni",
    angkatan:"TNI-AL", uker:"LANTAMAL III JAKARTA" },
  { kpa:"DM000003", nrp:"333333",             npwp:"33.333.333.3-333.000", nama:"Bayu Anggara",
    angkatan:"TNI-AU", uker:"LANUD HALIM PERDANAKUSUMA" },
  { kpa:"DM000004", nrp:"88001122",           npwp:"44.444.444.4-444.000", nama:"Rina Puspita",
    angkatan:"Polri",  uker:"POLRES JAKARTA SELATAN" },
  { kpa:"DM000005", nrp:"199001012015011001", npwp:"55.555.555.5-555.000", nama:"Hendra Saputra",
    angkatan:"KEMHAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN" }
];
DATA_MASTER_PESERTA.push(...DATA_NRP_TERDAFTAR_DEMO);

/* Pilihan "Nama Instansi / Kesatuan Pengirim" pada form Pendaftaran Peserta Baru */
const DATA_INSTANSI_PENGIRIM = [
  "PUSKERSIN", "Mabes TNI AD", "Mabes TNI AL", "Mabes TNI AU", "Mabes Polri", "Kementerian Pertahanan"
];

/* Pilihan dropdown "Unit Kerja (UKER)" pada form Data Peserta — Pendaftaran
   Peserta Baru. Sebagian entri sudah punya kode (format "KODE - NAMA"),
   sebagian belum (format "- NAMA"), sesuai referensi data ASABRI. */
const DATA_UKER = [
  "344281 - KOREM-084/W DAM V/BRW",
  "639869 - GABRAH 84",
  "- KOREM 084",
  "- KOREM 084/BJ",
  "- KODIM 0827 REM 084/BJ",
  "- SECABA MILSUK ZI TA 1984/1985",
  "- KODIM 0830 REM 084/BJ",
  "- KODIM 0828 REM 084/BJ",
  "- KODIM 0829 REM 084/BJ",
  "- KODIM 0826 REM 084/BJ",
  "- KODIM 0817 REM 084/BJ",
  "- KODIM 0831 REM 084/BJ",
  "- MILSUK PAL TA1984/1985",
  "- MILSUK ARHANUD TA 1984/1985",
  "- SECABA MILSUK KODIKLATDAM VI/SLW TA 1983/1984",
  "- KOMANDO RESORT KEPOLISIAN 1084 JOMBANG"
];

/* Pilihan "Kantor Cabang" pada form Data Peserta */
const DATA_KANTOR_CABANG = [
  "Kanca Jakarta Pusat", "Kanca Jakarta Selatan", "Kanca Jakarta Barat", "Kanca Jakarta Timur",
  "Kanca Bandung", "Kanca Yogyakarta", "Kanca Surabaya", "Kanca Bekasi", "Kanca Tangerang",
  "Kanca Semarang", "Kanca Medan", "Kanca Makassar", "Kanca Denpasar"
];

/* Saran otomatis Kantor Cabang berdasarkan kabupaten/kota hasil pilihan
   Desa/Kelurahan — dipakai untuk auto-isi field "Kantor Cabang". */
const DATA_KANTOR_CABANG_MAP = {
  "Jakarta Barat":    "Kanca Jakarta Barat",
  "Jakarta Selatan":  "Kanca Jakarta Selatan",
  "Jakarta Timur":    "Kanca Jakarta Timur",
  "Kota Bandung":     "Kanca Bandung",
  "Sleman":           "Kanca Yogyakarta",
  "Kota Surabaya":    "Kanca Surabaya",
  "Kota Bekasi":      "Kanca Bekasi",
  "Kota Tangerang":   "Kanca Tangerang"
};

/* Alamat Kantor Cabang & UKER — dipakai field "Alamat" (nonaktif, terisi
   otomatis) pada modal Cetak Surat Pengantar di layar Daftar Nominatif.
   Kuncinya harus persis sama dengan isi DATA_KANTOR_CABANG / DATA_UKER. */
const DATA_ALAMAT_KANTOR_CABANG = {
  "Kanca Jakarta Pusat":   "Jl. Mayjen Sutoyo No. 11, Cililitan, Jakarta Timur, DKI Jakarta",
  "Kanca Jakarta Selatan": "Jl. RS Fatmawati Raya No. 39, Cilandak, Jakarta Selatan, DKI Jakarta",
  "Kanca Jakarta Barat":   "Jl. Daan Mogot No. 108, Grogol, Jakarta Barat, DKI Jakarta",
  "Kanca Jakarta Timur":   "Jl. Raya Bogor No. 24, Kramat Jati, Jakarta Timur, DKI Jakarta",
  "Kanca Bandung":         "Jl. Ir. H. Juanda No. 78, Lebakgede, Bandung, Jawa Barat",
  "Kanca Yogyakarta":      "Jl. Ipda Tut Harsono No. 40, Muja Muju, Yogyakarta, DI Yogyakarta",
  "Kanca Surabaya":        "Jl. Raya Darmo No. 155, Wonokromo, Surabaya, Jawa Timur",
  "Kanca Bekasi":          "Jl. Ahmad Yani No. 12, Marga Jaya, Bekasi, Jawa Barat",
  "Kanca Tangerang":       "Jl. Perintis Kemerdekaan No. 5, Babakan, Tangerang, Banten",
  "Kanca Semarang":        "Jl. Pemuda No. 118, Sekayu, Semarang, Jawa Tengah",
  "Kanca Medan":           "Jl. Gatot Subroto No. 88, Sei Sikambing, Medan, Sumatera Utara",
  "Kanca Makassar":        "Jl. Urip Sumoharjo No. 61, Panaikang, Makassar, Sulawesi Selatan",
  "Kanca Denpasar":        "Jl. Cok Agung Tresna No. 9, Renon, Denpasar, Bali"
};

const DATA_ALAMAT_UKER = {
  "344281 - KOREM-084/W DAM V/BRW":                  "Jl. Ahmad Yani No. 190, Gayungan, Surabaya, Jawa Timur",
  "639869 - GABRAH 84":                              "Jl. Kesatrian No. 21, Sawahan, Surabaya, Jawa Timur",
  "- KOREM 084":                                     "Jl. Ahmad Yani No. 190, Gayungan, Surabaya, Jawa Timur",
  "- KOREM 084/BJ":                                  "Jl. Ahmad Yani No. 190, Gayungan, Surabaya, Jawa Timur",
  "- KODIM 0827 REM 084/BJ":                         "Jl. Trunojoyo No. 8, Kolor, Sumenep, Jawa Timur",
  "- SECABA MILSUK ZI TA 1984/1985":                 "Jl. Raya Malang-Surabaya Km. 9, Singosari, Malang, Jawa Timur",
  "- KODIM 0830 REM 084/BJ":                         "Jl. Kedung Cowek No. 74, Bulak, Surabaya, Jawa Timur",
  "- KODIM 0828 REM 084/BJ":                         "Jl. Raya Sampang No. 15, Sampang, Jawa Timur",
  "- KODIM 0829 REM 084/BJ":                         "Jl. Panglima Sudirman No. 3, Bangkalan, Jawa Timur",
  "- KODIM 0826 REM 084/BJ":                         "Jl. Panglima Sudirman No. 76, Pamekasan, Jawa Timur",
  "- KODIM 0817 REM 084/BJ":                         "Jl. Sunan Giri No. 12, Gresik, Jawa Timur",
  "- KODIM 0831 REM 084/BJ":                         "Jl. Kedung Cowek No. 74, Bulak, Surabaya, Jawa Timur",
  "- MILSUK PAL TA1984/1985":                        "Jl. Ujung Surabaya, Semampir, Surabaya, Jawa Timur",
  "- MILSUK ARHANUD TA 1984/1985":                   "Jl. Raya Karangploso No. 4, Malang, Jawa Timur",
  "- SECABA MILSUK KODIKLATDAM VI/SLW TA 1983/1984": "Jl. Terusan Buah Batu No. 2, Bandung, Jawa Barat",
  "- KOMANDO RESORT KEPOLISIAN 1084 JOMBANG":        "Jl. KH. Wahid Hasyim No. 40, Jombang, Jawa Timur"
};

/* Saran dokumen yang bisa ditambahkan secara dinamis di step "Berkas
   Persyaratan" — Pendaftaran Peserta Baru. "KTP" dan "Surat Pengangkatan
   Pertama" sengaja tidak dimasukkan karena sudah jadi baris tetap/wajib. */
const DATA_BERKAS_SARAN = [
  "KTP", "Surat Pengangkatan Pertama", "Berkas Lainnya",
  "Kartu Tanda Peserta Asabri", "Kartu Tanda Anggota", "Surat Ijin Mengemudi", "Pasport",
  "Kartu Keluarga", "Surat Nikah / KPI", "Daftar Riwayat Hidup Singkat", "Buku Tabungan",
  "Akte Kelahiran / Surat Kenal Lahir", "Ijazah Sekolah Umum / Pendidikan Militer",
  "Struk Gaji/Carik Gaji Terakhir", "Surat Pengantar dari Kesatuan", "SKEP Pensiun",
  "SKEP Berhenti Karena Meninggal Dunia", "SKEP Pemberhentian", "SKEP Gugur / Tewas",
  "SKEP Cacat", "Surat Keterangan Pemberhentian Pembayaran",
  "Surat Keterangan Ahli Waris / Kuasa Ahli Waris", "Surat Keterangan Kematian",
  "Surat Keterangan Kehilangan dari Kepolisian", "PasPhoto", "Surat Keterangan Kuliah",
  "Kartu Penunjukan Istri dari Kesatuan", "Surat Keterangan Perwalian dari Pengadilan",
  "Surat Tanggungan Keluarga", "Surat Keterangan Janda / Duda",
  "Surat Keterangan Belum Menikah dan Belum Bekerja", "Daftar Keluarga",
  "Nomor Pokok Wajib Pajak", "KU-107", "Surat Permohonan Pembayaran", "Carik Dapem",
  "Surat Pembatalan BUM KPR", "Surat Pernyataan Kantor Bayar", "Request Umum",
  "Pinjaman Mitra", "Take Over :: Bukti Pelunasan", "Surat Kontrak",
  "Bukti Pelunasan dari Mitra", "Dokumen Cerai", "Surat Persetujuan Penunjukan Istri",
  "Bukti Setor", "Rincian Hutang"
];

/* Wilayah untuk autocomplete field "Kelurahan" — memilih satu baris otomatis
   mengisi Kecamatan, Kabupaten/Kota, Provinsi, dan Kode Pos */
const DATA_WILAYAH = [
  { kelurahan:"Kebon Jeruk",  kecamatan:"Kebon Jeruk",         kabupaten:"Jakarta Barat",    provinsi:"DKI Jakarta",     kodepos:"11530" },
  { kelurahan:"Kemanggisan",  kecamatan:"Palmerah",            kabupaten:"Jakarta Barat",    provinsi:"DKI Jakarta",     kodepos:"11480" },
  { kelurahan:"Kemang",       kecamatan:"Mampang Prapatan",    kabupaten:"Jakarta Selatan",  provinsi:"DKI Jakarta",     kodepos:"12730" },
  { kelurahan:"Cibubur",      kecamatan:"Ciracas",             kabupaten:"Jakarta Timur",    provinsi:"DKI Jakarta",     kodepos:"13720" },
  { kelurahan:"Sukajadi",     kecamatan:"Sukajadi",            kabupaten:"Kota Bandung",     provinsi:"Jawa Barat",      kodepos:"40162" },
  { kelurahan:"Sukaluyu",     kecamatan:"Cibeunying Kaler",    kabupaten:"Kota Bandung",     provinsi:"Jawa Barat",      kodepos:"40123" },
  { kelurahan:"Ngaglik",      kecamatan:"Ngaglik",             kabupaten:"Sleman",           provinsi:"D.I. Yogyakarta", kodepos:"55581" },
  { kelurahan:"Rungkut",      kecamatan:"Rungkut",             kabupaten:"Kota Surabaya",    provinsi:"Jawa Timur",      kodepos:"60293" },
  { kelurahan:"Jatiasih",     kecamatan:"Jatiasih",            kabupaten:"Kota Bekasi",      provinsi:"Jawa Barat",      kodepos:"17423" },
  { kelurahan:"Cikokol",      kecamatan:"Tangerang",           kabupaten:"Kota Tangerang",   provinsi:"Banten",          kodepos:"15117" }
];

/* 13 mitra bayar terdaftar untuk penyaluran KPR (PUM) */
const DATA_MITRA_BAYAR = [
  "Bank BRI", "Bank BNI", "Bank Mandiri", "Bank BTN", "Bank BCA",
  "Bank Syariah Indonesia (BSI)", "Bank DKI", "Bank Jabar Banten (BJB)",
  "Bank Jatim", "Bank Sumut", "Bank Nagari", "Bank Riau Kepri", "Bank Kalbar"
];


/* ---------------------------------------------------------------------------
   7. PENGELOLAAN KLAIM KPR (BUM)
   Satu baris = satu klaim KPR (BUM) peserta.
   tmt           : TMT Pengangkatan Awal peserta.
   tmtAkad       : TMT Akad Kredit BUM.
   nomorPinjaman : Nomor Piutang BUM.
   jumlah        : Jumlah Nominal BUM yang pernah dicairkan.
   jenisPinjaman : "BUM KPR Program Khusus ASABRI" | "BUM KPR TWPAD" |
                   "BUM KPR Program Reguler YPPSDP"
   cabang, sisaHutang, dan outstanding ikut data peserta yang tercatat sistem —
   tidak diinput petugas dan hanya tampil di modal detail.
   --------------------------------------------------------------------------- */
const DATA_BUM = [
  { kpa:"TA910123", nrp:"19870512001", nik:"3271051205870001", nama:"Intan M. Sari",     tglLahir:"1987-05-12", tmt:"2009-08-01", tmtAkad:"2021-03-01",
    cabang:"KC Jakarta Utama", nomorPinjaman:"BUM-2021-00114", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:120000000, sisaHutang:64500000,  outstanding:3500000,
    keterangan:"Pendaftaran ulang data akad dari arsip YPPSDP." },
  { kpa:"TB920234", nrp:"19900820002", nik:"5171200812900002", nama:"Made Wardani",      tglLahir:"1990-08-20", tmt:"2012-04-01", tmtAkad:"2020-07-15",
    cabang:"KC Denpasar",      nomorPinjaman:"BUM-2020-00087", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:95000000,  sisaHutang:21000000,  outstanding:1500000,
    keterangan:"Hutang tidak terpotong hak asuransi, dibayar angsur." },
  { kpa:"LA930345", nrp:"19951130003", nik:"3578301103950003", nama:"Kenedi",            tglLahir:"1995-11-30", tmt:"2017-03-01", tmtAkad:"2022-01-10",
    cabang:"KC Surabaya",      nomorPinjaman:"BUM-2022-00203", jenisPinjaman:"BUM KPR TWPAD",                  jumlah:150000000, sisaHutang:112000000, outstanding:6000000,
    keterangan:"Perbaikan nomor piutang hasil rekonsiliasi semester I." },
  { kpa:"LB940456", nrp:"19880305004", nik:"1271030508880004", nama:"Firman Dewantoro",  tglLahir:"1988-03-05", tmt:"2010-02-15", tmtAkad:"2019-11-05",
    cabang:"KC Medan",         nomorPinjaman:"BUM-2019-00042", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:80000000,  sisaHutang:9500000,   outstanding:500000,
    keterangan:"Sisa hutang mendekati lunas, menunggu setoran terakhir." },
  { kpa:"UA950567", nrp:"19921215005", nik:"7371151212920005", nama:"Aprildo A. R.",     tglLahir:"1992-12-15", tmt:"2014-09-01", tmtAkad:"2023-04-20",
    cabang:"KC Makassar",      nomorPinjaman:"BUM-2023-00311", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:135000000, sisaHutang:121000000, outstanding:7500000,
    keterangan:"Akad terbaru, potongan mulai periode berjalan." },
  { kpa:"UB960678", nrp:"19870910006", nik:"3374100909870006", nama:"Wati Handayani",    tglLahir:"1987-09-10", tmt:"2009-11-01", tmtAkad:"2021-09-12",
    cabang:"KC Semarang",      nomorPinjaman:"BUM-2021-00176", jenisPinjaman:"BUM KPR TWPAD",                  jumlah:110000000, sisaHutang:58000000,  outstanding:3200000,
    keterangan:"Pendaftaran ulang karena nomor piutang lama ganda." },
  { kpa:"PA970789", nrp:"19930422007", nik:"1671220404930007", nama:"Yuni Kartika",      tglLahir:"1993-04-22", tmt:"2015-05-01", tmtAkad:"2020-02-28",
    cabang:"KC Palembang",     nomorPinjaman:"BUM-2020-00033", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:90000000,  sisaHutang:14000000,  outstanding:800000,
    keterangan:"Angsuran berjalan lewat Kantor Cabang." },
  { kpa:"PB980890", nrp:"19850617008", nik:"5171170606850008", nama:"Sri Wahyuni",       tglLahir:"1985-06-17", tmt:"2007-08-01", tmtAkad:"2022-08-01",
    cabang:"KC Denpasar",      nomorPinjaman:"BUM-2022-00265", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:125000000, sisaHutang:98000000,  outstanding:5500000,
    keterangan:"Imbal jasa Program Reguler dihitung sampai BUP." },
  { kpa:"PC990901", nrp:"19910304009", nik:"6471030409910009", nama:"Ratna Dewi",        tglLahir:"1991-03-04", tmt:"2013-06-01", tmtAkad:"2019-05-17",
    cabang:"KC Balikpapan",    nomorPinjaman:"BUM-2019-00019", jenisPinjaman:"BUM KPR TWPAD",                  jumlah:70000000,  sisaHutang:6200000,   outstanding:400000,
    keterangan:"Tinggal sisa outstanding kecil, siap dilunasi." },
  { kpa:"TA911012", nrp:"19890128010", nik:"7171280101890010", nama:"Hendra Gunawan",    tglLahir:"1989-01-28", tmt:"2011-02-01", tmtAkad:"2023-01-09",
    cabang:"KC Manado",        nomorPinjaman:"BUM-2023-00298", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:140000000, sisaHutang:133000000, outstanding:8000000,
    keterangan:"Akad 2023, belum ada pemotongan hak asuransi." },
  { kpa:"TB921123", nrp:"19940512011", nik:"1371120505940011", nama:"Fitri Ramadhani",   tglLahir:"1994-05-12", tmt:"2016-07-01", tmtAkad:"2021-06-23",
    cabang:"KC Padang",        nomorPinjaman:"BUM-2021-00152", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:85000000,  sisaHutang:19500000,  outstanding:1200000,
    keterangan:"Dibayar angsur, bukti setor diunggah Kantor Cabang." },
  { kpa:"LA931234", nrp:"19860303012", nik:"3172030303860012", nama:"Andi Saputra",      tglLahir:"1986-03-03", tmt:"2008-04-01", tmtAkad:"2020-10-30",
    cabang:"KC Jakarta Utama", nomorPinjaman:"BUM-2020-00121", jenisPinjaman:"BUM KPR TWPAD",                  jumlah:118000000, sisaHutang:71000000,  outstanding:4000000,
    keterangan:"Pendaftaran ulang setelah pemutakhiran data kesatuan." },
  { kpa:"LB941345", nrp:"19920815013", nik:"3273150808920013", nama:"Lina Marlina",      tglLahir:"1992-08-15", tmt:"2014-10-01", tmtAkad:"2022-12-04",
    cabang:"KC Bandung",       nomorPinjaman:"BUM-2022-00340", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:145000000, sisaHutang:139000000, outstanding:8500000,
    keterangan:"Akad terbaru pada Kantor Cabang Bandung." },
  { kpa:"UA951456", nrp:"19830706014", nik:"3578060707830014", nama:"Joko Purnomo",      tglLahir:"1983-07-06", tmt:"2005-09-01", tmtAkad:"2019-08-14",
    cabang:"KC Surabaya",      nomorPinjaman:"BUM-2019-00027", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:75000000,  sisaHutang:5000000,   outstanding:300000,
    keterangan:"Mendekati BUP, sisa hutang dipotong saat klaim." },
  { kpa:"AD900123", nrp:"199105102016121003", nik:"3374012004890130", nama:"Yusuf Maulana",    tglLahir:"1989-04-20", tmt:"2016-12-01", tmtAkad:"2022-06-15",
    cabang:"KC Semarang",      nomorPinjaman:"BUM-2022-00456", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:110000000, sisaHutang:85000000,  outstanding:4500000,
    keterangan:"Peserta baru terverifikasi memiliki Pinjaman KPR (BUM) aktif." }
];

/* Lookup KPA → data peserta, dipakai untuk autofill form "Pendaftaran Ulang
   Klaim KPR (BUM)" begitu KPA diinput. jk: "L" | "P".
   nominalPinjaman  : plafon pinjaman BUM yang pernah dicairkan.
   sisaHutang       : pokok pinjaman yang belum terbayar.
   saldoOutstanding : tagihan berjalan yang jatuh tempo saat ini.
   Ketiganya 0 berarti peserta tidak punya pinjaman BUM berjalan. */
const BUM_KPA_LOOKUP = {
  "TA910123": { nrp:"19870512001", nik:"3271051205870001", nama:"Intan M. Sari",    tglLahir:"1987-05-12", tmtMasuk:"2009-08-01", jk:"P", cabang:"KC Jakarta Utama",     nominalPinjaman:120000000, sisaHutang:64500000, saldoOutstanding:3500000 },
  "LB940456": { nrp:"19880305004", nik:"1271030508880004", nama:"Firman Dewantoro", tglLahir:"1988-03-05", tmtMasuk:"2010-02-15", jk:"L", cabang:"KC Medan",             nominalPinjaman:80000000,  sisaHutang:9500000,  saldoOutstanding:500000  },
  "PC990901": { nrp:"19910304009", nik:"6471030409910009", nama:"Ratna Dewi",       tglLahir:"1991-03-04", tmtMasuk:"2013-06-01", jk:"P", cabang:"KC Balikpapan",        nominalPinjaman:70000000,  sisaHutang:6200000,  saldoOutstanding:400000  },
  "UB961567": { nrp:"19960718031", nik:"3175071896960031", nama:"Sandi Pratama",    tglLahir:"1996-07-18", tmtMasuk:"2018-09-01", jk:"L", cabang:"KC Jakarta Selatan",   nominalPinjaman:65000000,  sisaHutang:0,        saldoOutstanding:0       },
  "PA971678": { nrp:"19940122032", nik:"3204012294940032", nama:"Melati Anggun",    tglLahir:"1994-01-22", tmtMasuk:"2016-03-10", jk:"P", cabang:"KC Bandung",           nominalPinjaman:55000000,  sisaHutang:0,        saldoOutstanding:0       }
};


/* ---------------------------------------------------------------------------
   8. DISTRIBUSI BDN (multi-channel)
   Status tiap kanal: "ok" (terkirim) | "wait" (pending) | "bad" (gagal)
   --------------------------------------------------------------------------- */
const KANAL = [
  ["cetak",  "Cetak"],
  ["wa",     "WhatsApp"],
  ["email",  "Email"],
  ["push",   "Push mobile"],
  ["lojita", "Sync Lojita"]
];

const DATA_DISTRIBUSI = [
  { kpa:"B/000118/VII/2026", nama:"Intan M. Sari",    cetak:"ok",   wa:"ok",   email:"ok",  push:"ok",   lojita:"ok" },
  { kpa:"B/000119/VII/2026", nama:"Made Wardani",     cetak:"ok",   wa:"wait", email:"bad", push:"wait", lojita:"ok" },
  { kpa:"B/000120/VII/2026", nama:"Kenedi",           cetak:"ok",   wa:"ok",   email:"bad", push:"ok",   lojita:"ok" },
  { kpa:"B/000121/VII/2026", nama:"Firman Dewantoro", cetak:"wait", wa:"ok",   email:"ok",  push:"ok",   lojita:"ok" }
];


/* ---------------------------------------------------------------------------
   9. DASHBOARD — kartu ringkasan di halaman depan
   warna: "" (normal) | "ok" (hijau) | "warn" (kuning) | "bad" (merah)
   --------------------------------------------------------------------------- */
const DATA_DASHBOARD = [
  { label:"KPA terbit hari ini",        nilai:"128",        sub:"seluruhnya tersinkron ke Lojita", warna:"ok"   },
  { label:"Batch menunggu approval",    nilai:"3 batch",    sub:"1 batch lewat SLA 2 hari",        warna:"warn" },
  { label:"Pelunasan menunggu approval",nilai:"42 peserta", sub:"Rp 1.260.000.000",                warna:""     }
];


/* ---------------------------------------------------------------------------
   13. PEREMAJAAN DATA — PEMUTAKHIRAN DATA
   Kolom tabel & baris contoh hasil validasi, dibedakan menurut Jenis
   Pemutakhiran yang dipilih di step "Unggah Berkas".
   --------------------------------------------------------------------------- */
const DATA_PEREMAJAAN = {
  pokok: {
    label:        "Data Pokok Peserta",
    templateNama: "Pemutakhiran Data Peserta",
    templateFile: "Pemutakhiran Data Peserta.xlsx",
    kolom:      ["NRP/NIP", "Nama", "Alamat", "No. HP", "Email"],
    kolomError: ["NRP/NIP", "Nama"],
    rows: [
      { nilai:["148820",             "Yusuf Pratama",     "Jl. Melati No. 12, Jakarta Timur", "0812-3456-7890", "yusuf.pratama@mail.com"], status:"valid" },
      { nilai:["84071073",           "Andi Saputra",      "Jl. Anggrek No. 5, Bandung",        "0813-2233-4455", "andi.saputra@mail.com"],  status:"valid" },
      { nilai:["199801152020121003", "Eko Prasetyo",      "Jl. Kenanga No. 8, Yogyakarta",     "0857-1122-3344", "eko.prasetyo@mail.com"],  status:"tanpa-perubahan" },
      { nilai:["XD222424",           "Nama Tidak Dikenal","-",                                 "-",              "-"],
        status:"ditolak", alasan:["NRP_NIP tidak ditemukan di data peserta"] }
    ]
  },
  pangkat: {
    label:        "Data Riwayat Pangkat",
    templateNama: "Pemutakhiran Data Riwayat Pangkat Peserta",
    templateFile: "Pemutakhiran Data Riwayat Pangkat Peserta.xlsx",
    kolom:      ["NRP/NIP", "Nama", "Pangkat Baru", "TMT Pangkat"],
    kolomError: ["NRP/NIP", "Nama"],
    rows: [
      { nilai:["148820", "Yusuf Pratama",      "Kolonel",                "01 Januari 2026"], status:"valid" },
      { nilai:["132170", "Kenedi",             "Komisaris Besar Polisi", "01 April 2026"],   status:"valid" },
      { nilai:["127485", "Firman Dewantoro",   "Letnan Kolonel",         "01 Juli 2026"],    status:"tanpa-perubahan" },
      { nilai:["XD222424", "Nama Tidak Dikenal","Mayor",                 "1 Agustus 2026"],
        status:"ditolak", alasan:["NRP_NIP tidak ditemukan di data peserta"] }
    ]
  },
  keluarga: {
    label:        "Data Keluarga Peserta",
    templateNama: "Pemutakhiran Data Keluarga Peserta",
    templateFile: "Pemutakhiran Data Keluarga Peserta.xlsx",
    kolom:      ["NRP/NIP", "NIK Anggota", "Nama Anggota", "Hubungan Keluarga", "Tanggal Lahir"],
    kolomError: ["NRP/NIP", "NIK"],
    rows: [
      { nilai:["148820",   "3271011203800001", "Siti Aminah",       "ISTRI", "12 Maret 1988"],  status:"valid" },
      { nilai:["148820",   "3271011203150002", "Raka Pratama",      "ANAK",  "05 Mei 2015"],     status:"valid" },
      { nilai:["84071073", "3273011501920001", "Rina Saputri",      "ISTRI", "15 Januari 1992"], status:"tanpa-perubahan" },
      { nilai:["XD222424", "5363563545422190", "Nama Tidak Dikenal","ANAK",  "-"],
        status:"ditolak", alasan:["NRP_NIP tidak ditemukan di data peserta"] }
    ]
  }
};

/* ---------------------------------------------------------------------------
   14. PEREMAJAAN DATA — APPROVAL PEMUTAKHIRAN DATA
   Daftar batch yang sudah diunggah & disubmit dari "Pemutakhiran Data",
   menunggu (atau sudah mendapat) persetujuan. Baris baru ditambahkan ke sini
   otomatis begitu "Submit Data Batch" ditekan di modul Pemutakhiran Data.
   --------------------------------------------------------------------------- */
const DATA_PEMUTAKHIRAN_BATCH = [
  { noBatch:"TNI-AD/07/2026/0001", jenis:"keluarga", waktu:"26 Jul 2026, 05:51", userUpload:"Adm. Wirata Atmaja", unor:"TNI-AD", jumlahBaris:1, status:"Pending",
    kolom: ["NRP/NIP", "NIK Anggota", "Nama Anggota", "Hubungan Keluarga", "Tanggal Lahir"],
    rows: [ { nilai:["148820", "3271011203800001", "Siti Aminah", "ISTRI", "12 Maret 1988"], status:"valid" } ] },
  { noBatch:"POLRI/07/2026/0001", jenis:"keluarga", waktu:"26 Jul 2026, 05:50", userUpload:"Adm. Rika Pratiwi", unor:"POLRI", jumlahBaris:1, status:"Pending",
    kolom: ["NRP/NIP", "NIK Anggota", "Nama Anggota", "Hubungan Keluarga", "Tanggal Lahir"],
    rows: [ { nilai:["84071073", "3273011501920001", "Rina Saputri", "ANAK", "15 Januari 1992"], status:"valid" } ] }
];

/* ---------------------------------------------------------------------------
   15. PENDAFTARAN PESERTA BARU — data bersama antar sub modul Perorangan,
   Upload (Kolektif), Verifikasi Upload, dan Approval Pendaftaran Peserta Baru.

   DATA_PENDAFTARAN_PERORANGAN → disubmit dari sub modul Perorangan (Step 4),
   langsung masuk antrean Approval (approvalStatus "Tertunda").

   DATA_UPLOAD_BATCH → disubmit dari sub modul Upload (Kolektif, Step 3
   Pratinjau dan Simpan). Satu field "status" dipakai bersama di 3 halaman:
   "Belum Terverifikasi" (awal) → "Tertunda" (begitu "Setujui Verifikasi"
   ditekan di Verifikasi Upload — otomatis masuk antrean Approval) →
   "Diterima"/"Ditolak" (setelah diproses di Approval). Halaman Verifikasi
   Upload menampilkannya sebagai "Lolos Verifikasi" untuk status apa pun
   selain "Belum Terverifikasi" (karena dari sudut pandang verifikasi,
   yang penting sudah lolos atau belum — proses approval selanjutnya
   bukan urusan halaman ini).
   --------------------------------------------------------------------------- */
const DATA_PENDAFTARAN_PERORANGAN = [
  {
    id: 1,
    tglPengajuan: "5 Agustus 2026",
    kesatuanPengaju: "PUSKERSIN",
    nomorBatch: "-",
    nomorAgenda: "0001/wirata.atmaja",
    jenis: "Perorangan",
    approvalStatus: "Tertunda",
    catatanApproval: "",
    dataPengajuan: {
      jenis:"Perorangan", nomorSurat:"B/210/VIII/2026",
      instansi:"PUSKERSIN", tglSurat:"04 Agustus 2026"
    },
    dataPeserta: {
      nama:"Rahmat Hidayat", nrp:"199005152012011003", nik:"3271051505900003",
      npwp:"567890123004000",
      jk:"Laki-laki", tglLahir:"15 Mei 1990", tmpLahir:"Bandung",
      status:"Prajurit", angkatan:"TNI AD", unor:"Mabes TNI AD", uker:"- KOREM 084/BJ", pangkat:"Kapten",
      tmt:"01 Januari 2021", nomorSkep:"SKEP/210/I/2021", tglSkep:"01 Januari 2021",
      alamat:"Jl. Merdeka No. 10", rt:"03", rw:"02",
      kelurahan:"Kemanggisan, Palmerah, Jakarta Barat, DKI Jakarta",
      kodepos:"11480", telp:"081234567810", email:"rahmat.hidayat@mail.com", kancab:"Kancab Jakarta Barat"
    },
    berkas: [
      { label:"KTP", file:"ktp-rahmat.jpg" },
      { label:"Surat Pengangkatan Pertama", file:"sk-pengangkatan-rahmat.pdf" },
      { label:"Surat Pengantar", file:null }
    ]
  },
  {
    id: 2,
    tglPengajuan: "1 Agustus 2026",
    kesatuanPengaju: "Mabes Polri",
    nomorBatch: "-",
    nomorAgenda: "0002/wirata.atmaja",
    jenis: "Perorangan",
    approvalStatus: "Ditolak",
    catatanApproval: "Berkas SKEP Pengangkatan Pertama tidak terbaca jelas, harap unggah ulang.",
    dataPengajuan: {
      jenis:"Perorangan", nomorSurat:"B/188/VIII/2026",
      instansi:"Mabes Polri", tglSurat:"31 Juli 2026"
    },
    dataPeserta: {
      nama:"Siti Rahayu", nrp:"88034521", nik:"3273016006920004", npwp:"",
      jk:"Perempuan", tglLahir:"20 Juni 1992", tmpLahir:"Surabaya",
      status:"Prajurit", angkatan:"Polri", unor:"Mabes Polri", uker:"- KODIM 0827 REM 084/BJ", pangkat:"Ajun Komisaris Polisi",
      tmt:"01 Maret 2019", nomorSkep:"SKEP/95/III/2019", tglSkep:"01 Maret 2019",
      alamat:"Jl. Anggrek No. 5", rt:"01", rw:"04",
      kelurahan:"Rungkut, Rungkut, Kota Surabaya, Jawa Timur",
      kodepos:"60293", telp:"081298765432", email:"siti.rahayu@mail.com", kancab:"Kancab Surabaya"
    },
    berkas: [
      { label:"KTP", file:"ktp-siti.jpg" },
      { label:"Surat Pengangkatan Pertama", file:null },
      { label:"Surat Pengantar", file:"surat-pengantar-siti.pdf" }
    ]
  }
];

const DATA_UPLOAD_BATCH = [
  {
    id: 1,
    tglPengajuan: "6 Agustus 2026",
    kesatuanPengaju: "Mabes TNI",
    nomorBatch: "B-KOLEKTIF/2026/08060001",
    nomorAgenda: "B/220/VIII/2026/0003/wirata.atmaja",
    status: "Belum Terverifikasi",
    catatanApproval: "",
    dataPengajuan: {
      jenis:"Kolektif", nomorSurat:"B/220/VIII/2026",
      instansi:"Mabes TNI", tglSurat:"5 Agustus 2026"
    },
    peserta: [
      { nrp:"199203102015031001", nama:"Andika Pratama", suamiIstri:"Ny. Larasati Dewi", sts:"1", unor:"3", angkatan:"3",
        pangkat:"LETDA", kdPangkat:"3760", noSkep:"KEP/2001/VIII/2026", tglSkep:"05/08/2026", tmtSkep:"1/9/2026",
        kesatuan:"MABES TNI", kdKesatuan:"100001", kdKancab:"1000",
        jnsKel:"1", tmpLahir:"Semarang", tglLahir:"10/03/1992",
        alamat:"Jl. Diponegoro No. 20", kelurahan:"Botoran", kecamatan:"Botoran",
        kota:"Kabupaten Tulungagung", propinsi:"Jawa Timur",
        noHp:"081211122233", email:"andika.pratama@mail.com", nik:"3221031003920001", npwp:"12.987.654.3-100.000",
        berkas:[
          { label:"KTP", file:"ktp-andika.jpg" },
          { label:"Surat Pengangkatan Pertama", file:"sk-pengangkatan-andika.pdf" },
          { label:"Surat Pengantar", file:null }
        ] },
      { nrp:"199407222016022002", nama:"Yulia Wardhani", suamiIstri:"Tn. Bagas Nugroho", sts:"1", unor:"3", angkatan:"3",
        pangkat:"LETDA", kdPangkat:"3760", noSkep:"KEP/2002/VIII/2026", tglSkep:"05/08/2026", tmtSkep:"1/9/2026",
        kesatuan:"MABES TNI", kdKesatuan:"100001", kdKancab:"1000",
        jnsKel:"2", tmpLahir:"Yogyakarta", tglLahir:"22/07/1994",
        alamat:"Jl. Kaliurang No. 8", kelurahan:"Ngaglik", kecamatan:"Ngaglik",
        kota:"Sleman", propinsi:"D.I. Yogyakarta",
        noHp:"081233344455", email:"yulia.wardhani@mail.com", nik:"3404026207940002", npwp:"23.876.543.2-200.000",
        berkas:[
          { label:"KTP", file:"ktp-yulia.jpg" },
          { label:"Surat Pengangkatan Pertama", file:"sk-pengangkatan-yulia.pdf" },
          { label:"Surat Pengantar", file:"surat-pengantar-yulia.pdf" }
        ] }
    ]
  },
  {
    id: 2,
    tglPengajuan: "30 Juli 2026",
    kesatuanPengaju: "Mabes Polri",
    nomorBatch: "B-KOLEKTIF/2026/07300002",
    nomorAgenda: "B/198/VII/2026/0004/wirata.atmaja",
    status: "Tertunda",
    catatanApproval: "",
    dataPengajuan: {
      jenis:"Kolektif", nomorSurat:"B/198/VII/2026",
      instansi:"Mabes Polri", tglSurat:"29 Juli 2026"
    },
    peserta: [
      { nrp:"87056781", nama:"Deni Kurniawan", suamiIstri:"Ny. Sari Utami", sts:"1", unor:"3", angkatan:"3",
        pangkat:"IPDA", kdPangkat:"2870", noSkep:"KEP/1870/VII/2026", tglSkep:"28/07/2026", tmtSkep:"1/8/2026",
        kesatuan:"MABES POLRI", kdKesatuan:"200002", kdKancab:"2000",
        jnsKel:"1", tmpLahir:"Medan", tglLahir:"12/11/1987",
        alamat:"Jl. Sisingamangaraja No. 15", kelurahan:"Cikokol", kecamatan:"Tangerang",
        kota:"Kota Tangerang", propinsi:"Banten",
        noHp:"081344455566", email:"deni.kurniawan@mail.com", nik:"3671121211870003", npwp:"34.765.432.1-300.000",
        berkas:[
          { label:"KTP", file:"ktp-deni.jpg" },
          { label:"Surat Pengangkatan Pertama", file:"sk-pengangkatan-deni.pdf" },
          { label:"Surat Pengantar", file:"surat-pengantar-deni.pdf" }
        ] },
      { nrp:"90067892", nama:"Maya Puspita", suamiIstri:"Tn. Rizky Ananda", sts:"1", unor:"3", angkatan:"3",
        pangkat:"IPDA", kdPangkat:"2870", noSkep:"KEP/1871/VII/2026", tglSkep:"28/07/2026", tmtSkep:"1/8/2026",
        kesatuan:"MABES POLRI", kdKesatuan:"200002", kdKancab:"2000",
        jnsKel:"2", tmpLahir:"Palembang", tglLahir:"03/09/1990",
        alamat:"Jl. Sudirman No. 33", kelurahan:"Sukajadi", kecamatan:"Sukajadi",
        kota:"Kota Bandung", propinsi:"Jawa Barat",
        noHp:"081355566677", email:"maya.puspita@mail.com", nik:"3273030309900004", npwp:"45.654.321.0-400.000",
        berkas:[
          { label:"KTP", file:"ktp-maya.jpg" },
          { label:"Surat Pengangkatan Pertama", file:null },
          { label:"Surat Pengantar", file:"surat-pengantar-maya.pdf" }
        ] }
    ]
  },
  {
    id: 3,
    tglPengajuan: "20 Juli 2026",
    kesatuanPengaju: "Kementerian Pertahanan",
    nomorBatch: "B-KOLEKTIF/2026/07200003",
    nomorAgenda: "B/172/VII/2026/0005/wirata.atmaja",
    status: "Diterima",
    catatanApproval: "Data lengkap dan sesuai, disetujui.",
    tglApproval: "21 Juli 2026",
    dataPengajuan: {
      jenis:"Kolektif", nomorSurat:"B/172/VII/2026",
      instansi:"Kementerian Pertahanan", tglSurat:"18 Juli 2026"
    },
    peserta: [
      { nrp:"199501012018121001", nama:"Fajar Ramadhan", suamiIstri:"Ny. Anisa Rahmawati", sts:"1", unor:"3", angkatan:"3",
        pangkat:"LETDA", kdPangkat:"3760", noSkep:"KEP/1500/VII/2026", tglSkep:"18/07/2026", tmtSkep:"1/8/2026",
        kesatuan:"KEMENTERIAN PERTAHANAN", kdKesatuan:"638012", kdKancab:"2000",
        jnsKel:"1", tmpLahir:"Makassar", tglLahir:"01/01/1995",
        alamat:"Jl. Sam Ratulangi No. 7", kelurahan:"Cibubur", kecamatan:"Ciracas",
        kota:"Jakarta Timur", propinsi:"DKI Jakarta",
        noHp:"081366677788", email:"fajar.ramadhan@mail.com", nik:"3175010101950005", npwp:"56.543.210.9-500.000",
        berkas:[
          { label:"KTP", file:"ktp-fajar.jpg" },
          { label:"Surat Pengangkatan Pertama", file:"sk-pengangkatan-fajar.pdf" },
          { label:"Surat Pengantar", file:"surat-pengantar-fajar.pdf" }
        ] }
    ]
  }
];

/* ---------------------------------------------------------------------------
   15B. APPROVAL CETAK SURAT PENGANTAR
   Pengajuan cetak Surat Pengantar dari layar Daftar Nominatif menunggu
   persetujuan di sini. Status: "Tertunda" | "Diterima" | "Ditolak".
   --------------------------------------------------------------------------- */
const DATA_APPROVAL_SURAT = [
  {
    id: 1,
    tglPengajuan: "3 September 2026",
    nomorSurat:   "412/PA.01.01/G/IX/2026",
    nomorBatch:   "B-KOLEKTIF/2026/08060001",
    tujuanKirim:  "Kantor Cabang",
    namaTujuan:   "Kanca Surabaya",
    alamatTujuan: "Jl. Raya Darmo No. 155, Wonokromo, Surabaya, Jawa Timur",
    atasNama:     "Kepala Divisi Kepesertaan dan Pengembangan",
    pejabat:      "Sonny Widjaja",
    jabatan:      "Kepala Divisi Kepesertaan dan Pengembangan",
    ttdFile:      "ttd-sonny-widjaja.png",
    jumlahPeserta: 2,
    status:       "Tertunda",
    catatanApproval: ""
  },
  {
    id: 2,
    tglPengajuan: "1 September 2026",
    nomorSurat:   "398/PA.01.01/G/IX/2026",
    nomorBatch:   "B-KOLEKTIF/2026/07200003",
    tujuanKirim:  "UKER",
    namaTujuan:   "- KOREM 084/BJ",
    alamatTujuan: "Jl. Ahmad Yani No. 190, Gayungan, Surabaya, Jawa Timur",
    atasNama:     "Kepala Divisi Kepesertaan dan Pengembangan",
    pejabat:      "Rachmat Hidayat",
    jabatan:      "Kepala Bidang Pendaftaran Peserta",
    ttdFile:      "ttd-rachmat-hidayat.png",
    jumlahPeserta: 1,
    status:       "Diterima",
    catatanApproval: "Nomor surat dan tujuan kirim sudah sesuai."
  },
  {
    id: 3,
    tglPengajuan: "28 Agustus 2026",
    nomorSurat:   "365/PA.01.01/G/VIII/2026",
    nomorBatch:   "B-KOLEKTIF/2026/08200002",
    tujuanKirim:  "Pengirim",
    namaTujuan:   "Letkol Adm. Bagus Prasetyo",
    alamatTujuan: "",
    atasNama:     "Kepala Divisi Kepesertaan dan Pengembangan",
    pejabat:      "Sonny Widjaja",
    jabatan:      "Kepala Divisi Kepesertaan dan Pengembangan",
    ttdFile:      "ttd-sonny-widjaja.png",
    jumlahPeserta: 2,
    status:       "Ditolak",
    catatanApproval: "Nama pengirim belum lengkap dengan kesatuannya."
  }
];

/* ---------------------------------------------------------------------------
   10. PENGATURAN UMUM
   --------------------------------------------------------------------------- */
const PENGATURAN = {
  namaUser:      "Adm. Wirata Atmaja",
  inisialUser:   "AW",
  /* Dipakai sebagai potongan terakhir Nomor Agenda */
  username:      "wirata.atmaja",
  role:          "User Pemerintahan / TNI / POLRI",
  /* Jeda simulasi status "pending" berubah jadi "terkirim" (milidetik) */
  jedaSimulasi:  6000
};

/* ---------------------------------------------------------------------------
   16. PENGELOLAAN IURAN PREMI THT, JKK, DAN JKm — daftar peserta aktif untuk
   simulasi perhitungan premi (SIMPRE). Baris dengan ktpa/pangkat/kesatuan
   kosong merepresentasikan data peserta yang belum lengkap tersinkron dari
   Data Peserta — tombol "Hitung Premi"-nya nonaktif.
   --------------------------------------------------------------------------- */
const DATA_IURAN_PREMI_PESERTA = [
  { ktpa:"ED424185", nrp:"74020098",   nik:"3174012702740003", nama:"Mulyadi",
    pangkat:"AIPTU",    kesatuan:"POLRES METRO JAKSEL",   unor:"POLRI",
    tglLahir:"1974-02-07", tmtMasuk:"1993-11-27", tglPensiun:"2032-03-01", gaji:4965156 },
  { ktpa:"EY116960", nrp:"K10004501", nik:"3271025605850002", nama:"Betty Mewahani Nst",
    pangkat:"GOL.II/A", kesatuan:"POLRI",                 unor:"POLRI",
    tglLahir:"1985-05-16", tmtMasuk:"2008-03-01", tglPensiun:"2043-05-16", gaji:5210000 },
  { ktpa:"CE338860", nrp:"99916",     nik:"3671011203800004", nama:"Muhamad Arifin",
    pangkat:"KOPKA",    kesatuan:"KODIKMAR KOBANGDIKAL",  unor:"TNI AL",
    tglLahir:"1980-03-12", tmtMasuk:"2002-07-15", tglPensiun:"2038-03-12", gaji:4550000 },
  { ktpa:"",         nrp:"5354",      nik:"",                 nama:"Slamet Riyanto",
    pangkat:"",         kesatuan:"",                       unor:"",
    tglLahir:"", tmtMasuk:"", tglPensiun:"", gaji:0 },
  { ktpa:"",         nrp:"1234",      nik:"",                 nama:"Joni Hermawan",
    pangkat:"",         kesatuan:"",                       unor:"",
    tglLahir:"", tmtMasuk:"", tglPensiun:"", gaji:0 },
  { ktpa:"AD500221", nrp:"142376",    nik:"3273010512650005", nama:"Bambang Setiawan",
    pangkat:"SERKA",    kesatuan:"MABES TNI AD",           unor:"TNI AD",
    tglLahir:"1978-12-05", tmtMasuk:"1999-04-01", tglPensiun:"2036-12-05", gaji:4380000 },
  { ktpa:"AL600334", nrp:"156234",    nik:"3273025010830006", nama:"Dewi Anggraini",
    pangkat:"PENDA TK.I / III-B", kesatuan:"KEMENTERIAN PERTAHANAN", unor:"KEMHAN",
    tglLahir:"1983-02-10", tmtMasuk:"2010-12-01", tglPensiun:"2041-02-10", gaji:5620000 },
  { ktpa:"PL800556", nrp:"87023456",  nik:"3671022307820007", nama:"Rudi Hartono",
    pangkat:"SERTU",    kesatuan:"MABES TNI AU",           unor:"TNI AU",
    tglLahir:"1982-07-23", tmtMasuk:"2003-09-01", tglPensiun:"2040-07-23", gaji:4790000 }
];

/* ---------------------------------------------------------------------------
   17. HOME — Notifikasi & Pengumuman di halaman portal (Dashboard)
   Notifikasi.tingkat: "Kritis" | "High" | "Sedang"
   Notifikasi.untuk  : role yang boleh melihat entri ini. Kalau tidak diisi,
                       entri tampil untuk semua role kecuali Divisi Layanan
                       (role itu hanya menerima yang ditujukan kepadanya).
   Pengumuman.tag: [{label, jenis:"kebijakan"|"baru"|"info"}]
   --------------------------------------------------------------------------- */
const DATA_HOME_NOTIFIKASI = [
  /* Satu pengajuan yang sama, dibaca dua divisi dengan konteks berbeda. */
  { judul:"Pengajuan Request Umum Kantor Cabang Jakarta", untuk:"Divisi Kepesertaan dan Pengembangan Manfaat",
    detail:"Pengajuan Request Umum terkait dengan Peremajaan Data dengan KPA Peserta KPA-10023 a.n. Budi Santoso dari Kantor Cabang Asabri Jakarta, tenggat waktu Pengajuan tersisa 3 hari kerja tenggat waktu penyelesaian 02-09-2026.",
    tanggal:"29/08/2026", tingkat:"Kritis", go:"request-umum", ruKpa:"KPA-10023" },
  { judul:"Pengajuan Request Umum Kantor Cabang Jakarta", untuk:"Divisi Layanan",
    detail:"Pengajuan Request Umum terkait dengan Klaim Online dengan KPA Peserta KPA-10023 a.n. Budi Santoso dari Kantor Cabang Asabri Jakarta, tenggat waktu Pengajuan tersisa 3 hari kerja tenggat waktu penyelesaian 02-09-2026.",
    tanggal:"29/08/2026", tingkat:"Kritis", go:"request-umum", ruKpa:"KPA-10023" },
  /* Contoh notifikasi untuk Kantor Cabang: balasan dan penyelesaian request
     umum dari kedua divisi. Notifikasi sejenis juga dibuat otomatis setiap
     kali divisi membalas atau menekan Selesai di panel Detail Request Umum. */
  { judul:"Reply Request Umum dari Divisi Layanan", untuk:"Kantor Cabang",
    detail:"Terdapat Reply baru dari Divisi Layanan terkait Request Umum KPA-10030 a.n. Sri Wahyuni.",
    tanggal:"18/07/2026", tingkat:"High", go:"request-umum", ruKpa:"KPA-10030" },
  { judul:"Request Umum Terselesaikan dari Divisi Layanan", untuk:"Kantor Cabang",
    detail:"Request Umum KPA-10028 a.n. Wati Handayani sudah diselesaikan oleh Divisi Layanan.",
    tanggal:"16/07/2026", tingkat:"Sedang", go:"request-umum", ruKpa:"KPA-10028" },
  { judul:"Request Umum Terselesaikan dari Divisi Kepesertaan", untuk:"Kantor Cabang",
    detail:"Request Umum KPA-10026 a.n. Dewi Lestari sudah diselesaikan oleh Divisi Kepesertaan.",
    tanggal:"14/07/2026", tingkat:"Sedang", go:"request-umum", ruKpa:"KPA-10026" },
  { judul:"Reply Request Umum dari Divisi Kepesertaan", untuk:"Kantor Cabang",
    detail:"Terdapat Reply baru dari Divisi Kepesertaan terkait Request Umum KPA-10023 a.n. Budi Santoso.",
    tanggal:"10/07/2026", tingkat:"High", go:"request-umum", ruKpa:"KPA-10023" },
  { judul:"Persetujuan Klaim JKK",           id:"FLKK-2025-00871",  lokasi:"KC Bandung",       modul:"Modul Klaim JKK",                    tanggal:"23/06/2026", tingkat:"Kritis" },
  { judul:"Verifikasi e-SPTB Peserta",       id:"SPTB-2025-04412",  lokasi:"KC Jakarta Pusat", modul:"Modul e-SPTB",                       tanggal:"22/06/2026", tingkat:"Kritis" },
  { judul:"Input LKPP Cabang",               id:"LKPP-2025-KC03",   lokasi:"KC Surabaya",      modul:"Modul LKPP Cabang",                  tanggal:"21/06/2026", tingkat:"High" },
  { judul:"Validasi Data Mitra Bayar",       id:"MITRA-2025-0071",  lokasi:"KC Medan",         modul:"Modul Mitra Bayar",                  tanggal:"20/06/2026", tingkat:"High" },
  { judul:"Review KKA Audit Internal",       id:"AUDIT-2025-0093",  lokasi:"KC Bandung",       modul:"Modul Audit Internal",               tanggal:"19/06/2026", tingkat:"High" },
  { judul:"Verifikasi Upload Pendaftaran Peserta Baru", id:"BATCH-2026-0087", lokasi:"KC Yogyakarta", modul:"Modul Pendaftaran Peserta Baru", tanggal:"17/06/2026", tingkat:"Sedang" }
];

const DATA_HOME_PENGUMUMAN = [
  { tag:[{label:"KEBIJAKAN BARU", jenis:"kebijakan"}, {label:"BARU", jenis:"baru"}], dot:"kebijakan",
    judul:"Pembaruan Ketentuan Batas Plafon Kredit Pensiun 2026",
    body:"Menunjuk Surat Edaran Direksi SE-24/DIR/2026 mengenai penyesuaian plafon kredit pensiun bulanan sesuai indeks kelayakan…",
    divisi:"Divisi Regulasi", tanggal:"23 Juni 2026" },
  { tag:[{label:"KEBIJAKAN BARU", jenis:"kebijakan"}], dot:"kebijakan",
    judul:"Revisi Prosedur Klaim JKm – Berlaku Agustus 2026",
    body:"Revisi alur proses pengajuan berkas klaim Jaminan Kematian untuk mempercepat Service Level Agreement (SLA)…",
    divisi:"Divisi Pelayanan", tanggal:"20 Juni 2026" },
  { tag:[{label:"INFO PENTING SISTEM", jenis:"info"}, {label:"BARU", jenis:"baru"}], dot:"info",
    judul:"Scheduled Maintenance – 27 Juni 2026 Pukul 23.00–03.00 WIB",
    body:"Pemeliharaan terjadwal server database kepesertaan YANDU NG guna pembersihan log transaksional…",
    divisi:"Divisi IT", tanggal:"24 Juni 2026" }
];

/* ---------------------------------------------------------------------------
   18. DASHBOARD E-DOSIR — Manajemen Dokumen Peserta (E-Dosir)
   bulan: [Jan..Des] jumlah dokumen masuk per bulan, tahun berjalan.
   real: pembanding data real di cabang (hanya diisi utk 5 cabang dengan
   capaian terendah — dipakai panel "5 Capaian Terendah"; cabang lain null
   karena rincian real per-cabang tidak ditampilkan di tabel manapun).
   --------------------------------------------------------------------------- */
const EDOSIR_DATA_REAL_NASIONAL = 441442;
const DATA_EDOSIR_CABANG = [
  { nama:"AMBON",         saldoAwal:3945,  bulan:[138,11,51,135,35,50,68,52,0,0,0,0] },
  { nama:"BALIKPAPAN",    saldoAwal:21352, bulan:[27,17,2,218,268,83,308,1045,0,0,0,0] },
  { nama:"BANDA ACEH",    saldoAwal:4870,  bulan:[22,6,6,58,45,103,1354,871,0,0,0,0] },
  { nama:"BANDUNG",       saldoAwal:77320, bulan:[524,721,551,442,945,2095,4250,620,0,0,0,0] },
  { nama:"BANJARMASIN",   saldoAwal:7395,  bulan:[4,35,32,35,114,3,372,68,0,0,0,0] },
  { nama:"BATAM",         saldoAwal:2088,  bulan:[42,0,0,69,3,147,352,76,0,0,0,0], real:2572 },
  { nama:"BENGKULU",      saldoAwal:1317,  bulan:[4,6,21,27,49,60,548,57,0,0,0,0] },
  { nama:"CIREBON",       saldoAwal:6516,  bulan:[5,61,183,213,141,132,165,82,0,0,0,0] },
  { nama:"DENPASAR",      saldoAwal:13013, bulan:[234,171,125,174,199,194,282,195,0,0,0,0] },
  { nama:"JAKARTA",       saldoAwal:74573, bulan:[1285,1084,1455,3095,1858,2276,2192,845,0,0,0,0] },
  { nama:"JAYAPURA",      saldoAwal:6459,  bulan:[64,132,5,32,109,41,343,162,0,0,0,0] },
  { nama:"KENDARI",       saldoAwal:422,   bulan:[195,80,4,4,204,141,2097,676,0,0,0,0] },
  { nama:"KUPANG",        saldoAwal:3188,  bulan:[49,70,43,99,71,136,161,151,0,0,0,0] },
  { nama:"LAMPUNG",       saldoAwal:6467,  bulan:[89,64,42,1,1,82,76,25,0,0,0,0], real:6575 },
  { nama:"LHOKSEUMAWE",   saldoAwal:1534,  bulan:[0,0,0,0,1,749,190,1617,0,0,0,0] },
  { nama:"MADIUN",        saldoAwal:19412, bulan:[1127,940,206,1299,279,540,848,298,0,0,0,0] },
  { nama:"MAKASSAR",      saldoAwal:24755, bulan:[80,347,23,115,218,339,992,586,0,0,0,0] },
  { nama:"MALANG",        saldoAwal:25316, bulan:[182,150,260,242,557,1075,1950,1086,0,0,0,0] },
  { nama:"MANADO",        saldoAwal:3915,  bulan:[144,133,77,238,162,399,296,130,0,0,0,0] },
  { nama:"MATARAM",       saldoAwal:2101,  bulan:[9,72,34,71,38,47,64,247,0,0,0,0] },
  { nama:"MEDAN",         saldoAwal:18070, bulan:[19,18,17,26,241,2828,3076,1612,0,0,0,0] },
  { nama:"PADANG",        saldoAwal:7413,  bulan:[203,203,334,202,129,200,252,96,0,0,0,0] },
  { nama:"PALANGKARAYA",  saldoAwal:2302,  bulan:[38,50,31,43,80,48,325,44,0,0,0,0] },
  { nama:"PALEMBANG",     saldoAwal:20535, bulan:[174,150,101,137,184,466,313,948,0,0,0,0], real:21929 },
  { nama:"PALU",          saldoAwal:3424,  bulan:[99,36,1,9,22,32,351,773,0,0,0,0] },
  { nama:"PEKANBARU",     saldoAwal:5551,  bulan:[6,824,417,19,15,19,641,677,0,0,0,0] },
  { nama:"PONTIANAK",     saldoAwal:8593,  bulan:[86,66,72,119,108,241,304,46,0,0,0,0], real:9058 },
  { nama:"SEMARANG",      saldoAwal:44126, bulan:[1015,426,209,467,577,653,1258,567,0,0,0,0] },
  { nama:"SERANG",        saldoAwal:3946,  bulan:[80,75,78,245,250,304,476,193,0,0,0,0] },
  { nama:"SORONG",        saldoAwal:1364,  bulan:[36,5,9,13,18,42,88,63,0,0,0,0] },
  { nama:"SURABAYA",      saldoAwal:50314, bulan:[93,995,45,908,340,1861,2245,1631,0,0,0,0] },
  { nama:"TERNATE",       saldoAwal:1761,  bulan:[3,1,0,4,1,285,221,58,0,0,0,0], real:2208 },
  { nama:"YOGYAKARTA",    saldoAwal:14782, bulan:[457,746,265,82,864,2224,2104,968,0,0,0,0] }
];

/* ---------------------------------------------------------------------------
   19. MONITORING SPTB — Pengelolaan Surat Pernyataan Tanda Bukti Diri
   status         (Status SPTB)     : "Sudah SPTB" | "Belum SPTB"
   statusApproval (Status Approval) : "Disetujui" | "Ditolak" | "Pengajuan"
                                      null jika peserta belum mengajukan
   sptbTerakhir / tglPengajuan / tglApproval: null jika belum ada
   (semua kolom tanggal tampil "—" saat kosong)
   --------------------------------------------------------------------------- */
const SPTB_CABANG = ["KC Jakarta Pusat","KC Jakarta Selatan","KC Bandung","KC Surabaya","KC Medan",
  "KC Makassar","KC Yogyakarta","KC Denpasar","KC Semarang","KC Palembang","KC Balikpapan","KC Manado","KC Padang","KC Pekanbaru"];
const SPTB_MITRA = ["BRI","BNI","Mandiri","BTN"];
const SPTB_JENIS_PENSIUN = ["Pensiun Sendiri","Pensiun Waris","Tunjangan Orang Tua","Tunjangan Yatim Piatu"];

const DATA_SPTB = [
  { cabang:"KC Jakarta Pusat",   nopens:"0501234567", nrpNip:"NRP-19830011", nama:"Budi Santoso",       tglLahir:"1958-03-12", mitra:"BRI",     jenisPensiun:"Pensiun Sendiri",       unor:"KODAM JAYA",         sptbTerakhir:"2024-01-15", payTerakhir:"2026-06-01", status:"Sudah SPTB", tglPengajuan:"2024-01-10", tglApproval:"2024-01-15", statusApproval:"Disetujui" },
  { cabang:"KC Jakarta Pusat",   nopens:"0501234568", nrpNip:"NRP-19840022", nama:"Siti Rahayu",        tglLahir:"1960-07-05", mitra:"BNI",     jenisPensiun:"Pensiun Waris",         unor:"POLDA METRO",        sptbTerakhir:null,         payTerakhir:"2026-06-01", status:"Belum SPTB", tglPengajuan:"2026-05-12", tglApproval:null,         statusApproval:"Pengajuan" },
  { cabang:"KC Bandung",         nopens:"0501234569", nrpNip:"NIP-19620811", nama:"Ahmad Hidayat",      tglLahir:"1962-08-18", mitra:"Mandiri", jenisPensiun:"Pensiun Sendiri",       unor:"KODIKLAT AD",        sptbTerakhir:"2023-12-20", payTerakhir:"2026-06-01", status:"Sudah SPTB", tglPengajuan:"2023-12-14", tglApproval:"2023-12-20", statusApproval:"Disetujui" },
  { cabang:"KC Surabaya",        nopens:"0501234570", nrpNip:"NRP-19810033", nama:"Suprianto",          tglLahir:"1957-11-22", mitra:"BRI",     jenisPensiun:"Pensiun Sendiri",       unor:"LANTAMAL V",         sptbTerakhir:null,         payTerakhir:"2026-06-01", status:"Belum SPTB", tglPengajuan:null,         tglApproval:null,         statusApproval:null        },
  { cabang:"KC Medan",           nopens:"0501234571", nrpNip:"NRP-19800044", nama:"Hotman Sihombing",   tglLahir:"1959-10-03", mitra:"BTN",     jenisPensiun:"Tunjangan Orang Tua",   unor:"KODAM I/BB",         sptbTerakhir:"2024-02-10", payTerakhir:"2026-06-01", status:"Sudah SPTB", tglPengajuan:"2024-02-05", tglApproval:"2024-02-10", statusApproval:"Disetujui" },
  { cabang:"KC Makassar",        nopens:"0501234572", nrpNip:"NRP-19650422", nama:"Andi Mappanyukki",   tglLahir:"1965-04-14", mitra:"BRI",     jenisPensiun:"Pensiun Waris",         unor:"POLDA SULSEL",       sptbTerakhir:null,         payTerakhir:"2026-06-01", status:"Belum SPTB", tglPengajuan:"2026-04-22", tglApproval:"2026-04-28", statusApproval:"Ditolak"   },
  { cabang:"KC Yogyakarta",      nopens:"0501234573", nrpNip:"NRP-19820055", nama:"Sri Wahyuni",        tglLahir:"1961-12-29", mitra:"BNI",     jenisPensiun:"Tunjangan Yatim Piatu", unor:"LANUD ADISUTJIPTO",  sptbTerakhir:"2024-03-05", payTerakhir:"2026-06-01", status:"Sudah SPTB", tglPengajuan:"2024-02-28", tglApproval:"2024-03-05", statusApproval:"Disetujui" },
  { cabang:"KC Jakarta Selatan", nopens:"0501234574", nrpNip:"NRP-19781234", nama:"Wahyu Setiawan",     tglLahir:"1963-05-09", mitra:"Mandiri", jenisPensiun:"Pensiun Sendiri",       unor:"MABES TNI",          sptbTerakhir:"2024-04-11", payTerakhir:"2026-06-01", status:"Sudah SPTB", tglPengajuan:"2024-04-03", tglApproval:"2024-04-11", statusApproval:"Disetujui" },
  { cabang:"KC Denpasar",        nopens:"0501234575", nrpNip:"NRP-19701122", nama:"Made Wirawan",       tglLahir:"1966-02-17", mitra:"BTN",     jenisPensiun:"Pensiun Sendiri",       unor:"POLDA BALI",         sptbTerakhir:null,         payTerakhir:"2026-06-01", status:"Belum SPTB", tglPengajuan:null,         tglApproval:null,         statusApproval:null        },
  { cabang:"KC Semarang",        nopens:"0501234576", nrpNip:"NIP-19590733", nama:"Endang Kartini",     tglLahir:"1964-09-25", mitra:"BRI",     jenisPensiun:"Pensiun Waris",         unor:"KODIM 0733",         sptbTerakhir:"2024-01-30", payTerakhir:"2026-06-01", status:"Sudah SPTB", tglPengajuan:"2024-01-24", tglApproval:"2024-01-30", statusApproval:"Disetujui" },
  { cabang:"KC Palembang",       nopens:"0501234577", nrpNip:"NRP-19881245", nama:"Rudi Alamsyah",      tglLahir:"1968-06-01", mitra:"BNI",     jenisPensiun:"Pensiun Sendiri",       unor:"POLDA SUMSEL",       sptbTerakhir:null,         payTerakhir:"2026-06-01", status:"Belum SPTB", tglPengajuan:"2026-06-03", tglApproval:null,         statusApproval:"Pengajuan" },
  { cabang:"KC Balikpapan",      nopens:"0501234578", nrpNip:"NRP-19770812", nama:"Muhammad Yusuf",     tglLahir:"1969-03-19", mitra:"Mandiri", jenisPensiun:"Tunjangan Orang Tua",   unor:"LANUD BALIKPAPAN",   sptbTerakhir:"2024-05-08", payTerakhir:"2026-06-01", status:"Sudah SPTB", tglPengajuan:"2024-05-02", tglApproval:"2024-05-08", statusApproval:"Disetujui" },
  { cabang:"KC Manado",          nopens:"0501234579", nrpNip:"NRP-19631204", nama:"Christine Rumondor", tglLahir:"1970-08-14", mitra:"BTN",     jenisPensiun:"Pensiun Waris",         unor:"KODAM XIII/MDK",     sptbTerakhir:null,         payTerakhir:"2026-06-01", status:"Belum SPTB", tglPengajuan:"2026-03-18", tglApproval:"2026-03-25", statusApproval:"Ditolak"   },
  { cabang:"KC Padang",          nopens:"0501234580", nrpNip:"NIP-19551109", nama:"Zainal Abidin",      tglLahir:"1955-11-09", mitra:"BRI",     jenisPensiun:"Pensiun Sendiri",       unor:"KODIM 0312",         sptbTerakhir:"2023-11-19", payTerakhir:"2026-06-01", status:"Sudah SPTB", tglPengajuan:"2023-11-12", tglApproval:"2023-11-19", statusApproval:"Disetujui" },
  { cabang:"KC Pekanbaru",       nopens:"0501234581", nrpNip:"NRP-19850317", nama:"Rina Marlina",       tglLahir:"1972-01-28", mitra:"BNI",     jenisPensiun:"Tunjangan Yatim Piatu", unor:"POLDA RIAU",         sptbTerakhir:null,         payTerakhir:"2026-06-01", status:"Belum SPTB", tglPengajuan:null,         tglApproval:null,         statusApproval:null        }
];

/* ---------------------------------------------------------------------------
   25. PENGELOLAAN REQUEST UMUM
   Permintaan pemutakhiran/informasi data peserta yang dikirim Kantor Cabang
   kepada Divisi Kepesertaan dan Pengembangan Manfaat. `riwayat` adalah utas
   percakapan per request — entri pertama selalu dari Kantor Cabang (pengirim
   request), entri berikutnya balasan dari Div. Kepersertaan (atau sebaliknya).
   "User Request", "User Terakhir Reply", "Diperbarui", dan Status pada tabel
   daftar tidak disimpan terpisah — semua diturunkan dari `riwayat` supaya
   selalu konsisten begitu ada balasan baru ditambahkan.
   Status (lihat ruStatus() di app.js): baru dibuat Kantor Cabang tanpa balasan
   = "Belum Selesai", begitu ada balasan = "Dalam Proses", dan `selesai:true`
   (ditandai Divisi Kepesertaan atau Divisi Layanan lewat tombol Selesai) =
   "Selesai". tglLahir: ISO (YYYY-MM-DD), sama dengan 8 digit awal NRP/NIP.
   noRequest: Nomor Request Umum — angka urut dari sistem; boleh ada nomor
   yang terlewat (tidak harus bersambung).
   --------------------------------------------------------------------------- */
const RU_KPA_LOOKUP = {
  "KPA-10023": { nama:"Budi Santoso",    nrp:"19870512001", tglLahir:"1987-05-12", cabang:"KC Jakarta Utama" },
  "KPA-10031": { nama:"Ratna Dewi",      nrp:"19910304006", tglLahir:"1991-03-04", cabang:"KC Semarang" },
  "KPA-10045": { nama:"Yusuf Hidayat",   nrp:"19860721007", tglLahir:"1986-07-21", cabang:"KC Palembang" }
};

/* Parameter Kategori Request Umum — daftar kategori per divisi penanggung
   jawab (Subjek). Isinya menjadi pilihan Kategori di form Tambah Request
   Umum. Nama kategori boleh sama di dua divisi (mis. "Lainnya"), tapi tidak
   boleh kembar di dalam satu divisi.
   subjek: "Divisi Kepesertaan" | "Divisi Layanan" */
const DATA_RU_KATEGORI = [
  { subjek:"Divisi Kepesertaan", kategori:"Peremajaan Data" },
  { subjek:"Divisi Kepesertaan", kategori:"Lainnya" },
  { subjek:"Divisi Layanan",     kategori:"Klaim Online" },
  { subjek:"Divisi Layanan",     kategori:"Lainnya" }
];

const DATA_REQUEST_UMUM = [
  { noRequest:35992, kpa:"KPA-10023", nama:"Budi Santoso",      nrp:"19870512001", tglLahir:"1987-05-12", cabang:"KC Jakarta Utama", tujuan:"Kepesertaan", subjek:"Update Data NIK",
    tglRequest:"10 Jul 2026", selesai:false,
    riwayat:[
      { jam:"10 Jul 2026 09:14", user:"Rina / KC Jakarta",    isi:"Perubahan NIK peserta dari 3271... menjadi 3271... sesuai dokumen terlampir.", file:"bukti-nik.pdf" },
      { jam:"10 Jul 2026 14:32", user:"Fauzi / Div. Kepers.", isi:"Data sedang dalam proses verifikasi dengan tabel referensi ASABRI.", file:null }
    ] },
  { noRequest:35993, kpa:"KPA-10024", nama:"Siti Rahayu",       nrp:"19900820002", tglLahir:"1990-08-20", cabang:"KC Bandung", tujuan:"Pelayanan", subjek:"Pemutakhiran Alamat",
    tglRequest:"11 Jul 2026", selesai:false,
    riwayat:[
      { jam:"11 Jul 2026 08:40", user:"Agus / KC Bandung", isi:"Alamat peserta berubah ke Jl. Cihampelas No. 45, Bandung sesuai KTP baru.", file:"ktp-baru-siti.jpg" }
    ] },
  { noRequest:35994, kpa:"KPA-10025", nama:"Ahmad Fauzi",       nrp:"19951130003", tglLahir:"1995-11-30", cabang:"KC Surabaya", tujuan:"Kepesertaan", subjek:"Koreksi Pangkat",
    tglRequest:"13 Jul 2026", selesai:false,
    riwayat:[
      { jam:"13 Jul 2026 10:05", user:"Dewi / KC Surabaya", isi:"Pangkat awal peserta salah input, seharusnya Sersan Dua bukan Sersan Satu.", file:"sk-pangkat.pdf" }
    ] },
  { noRequest:35995, kpa:"KPA-10026", nama:"Dewi Lestari",      nrp:"19880305004", tglLahir:"1988-03-05", cabang:"KC Medan", tujuan:"Pelayanan", subjek:"Update No. Telepon",
    tglRequest:"14 Jul 2026", selesai:true,
    riwayat:[
      { jam:"14 Jul 2026 09:00", user:"Hendra / KC Medan",    isi:"Nomor HP peserta berubah menjadi 0812-7788-9900.", file:null },
      { jam:"14 Jul 2026 15:20", user:"Fauzi / Div. Kepers.", isi:"Data nomor telepon sudah diperbarui pada sistem YANDU.", file:null }
    ] },
  { noRequest:35996, kpa:"KPA-10027", nama:"Eko Prasetyo",      nrp:"19921215005", tglLahir:"1992-12-15", cabang:"KC Makassar", tujuan:"Kepesertaan", subjek:"Perubahan UNOR",
    tglRequest:"15 Jul 2026", selesai:false,
    riwayat:[
      { jam:"15 Jul 2026 11:12", user:"Sari / KC Makassar", isi:"Peserta pindah satuan dari KODAM VII/WRB ke KODAM XIV/HSN, mohon UNOR diperbarui.", file:"surat-mutasi.pdf" }
    ] },
  { noRequest:35997, kpa:"KPA-10028", nama:"Wati Handayani",    nrp:"19870910006", tglLahir:"1987-09-10", cabang:"KC Semarang", tujuan:"Pelayanan", subjek:"Update Email Peserta",
    tglRequest:"16 Jul 2026", selesai:true,
    riwayat:[
      { jam:"16 Jul 2026 08:15", user:"Joko / KC Semarang",   isi:"Email peserta berubah menjadi wati.handayani@mail.com.", file:null },
      { jam:"16 Jul 2026 13:47", user:"Rina / Div. Layanan",  isi:"Email peserta sudah diperbarui.", file:null }
    ] },
  { noRequest:35998, kpa:"KPA-10029", nama:"Yuni Kartika",      nrp:"19930422007", tglLahir:"1993-04-22", cabang:"KC Palembang", tujuan:"Kepesertaan", subjek:"Update Data NPWP",
    tglRequest:"17 Jul 2026", selesai:false,
    riwayat:[
      { jam:"17 Jul 2026 09:33", user:"Bambang / KC Palembang", isi:"NPWP peserta belum tercatat pada sistem, mohon ditambahkan sesuai lampiran.", file:"npwp-yuni.jpg" }
    ] },
  { noRequest:35999, kpa:"KPA-10030", nama:"Sri Wahyuni",       nrp:"19850617008", tglLahir:"1985-06-17", cabang:"KC Denpasar", tujuan:"Pelayanan", subjek:"Permintaan Salinan Kartu Peserta",
    tglRequest:"18 Jul 2026", selesai:false,
    riwayat:[
      { jam:"18 Jul 2026 10:50", user:"Made / KC Denpasar", isi:"Peserta kehilangan kartu peserta ASABRI, mohon dicetakkan salinan.", file:null },
      { jam:"18 Jul 2026 15:05", user:"Yoga / Div. Layanan", isi:"Permintaan salinan kartu sedang diproses, mohon lampirkan surat keterangan kehilangan dari kepolisian.", file:null }
    ] },
  { noRequest:36000, kpa:"KPA-10031", nama:"Ratna Dewi",        nrp:"19910304009", tglLahir:"1991-03-04", cabang:"KC Balikpapan", tujuan:"Kepesertaan", subjek:"Koreksi Nama Peserta",
    tglRequest:"19 Jul 2026", selesai:false,
    riwayat:[
      { jam:"19 Jul 2026 08:05", user:"Andi / KC Balikpapan", isi:"Ejaan nama peserta pada sistem salah, seharusnya Ratna Dewi bukan Ratna Dewy.", file:"ktp-ratna.jpg" }
    ] },
  { noRequest:36001, kpa:"KPA-10032", nama:"Hendra Gunawan",    nrp:"19890128010", tglLahir:"1989-01-28", cabang:"KC Manado", tujuan:"Pelayanan", subjek:"Perubahan Data Rekening",
    tglRequest:"20 Jul 2026", selesai:true,
    riwayat:[
      { jam:"20 Jul 2026 09:22", user:"Christine / KC Manado", isi:"Rekening pencairan manfaat berubah ke Bank BRI cabang Manado.", file:"buku-tabungan-hendra.jpg" },
      { jam:"20 Jul 2026 16:03", user:"Fauzi / Div. Kepers.",  isi:"Data rekening baru sudah tersimpan dan siap digunakan untuk pencairan berikutnya.", file:null }
    ] },
  { noRequest:36002, kpa:"KPA-10033", nama:"Fitri Ramadhani",   nrp:"19940512011", tglLahir:"1994-05-12", cabang:"KC Padang", tujuan:"Kepesertaan", subjek:"Update Data Angkatan",
    tglRequest:"21 Jul 2026", selesai:false,
    riwayat:[
      { jam:"21 Jul 2026 10:40", user:"Zainal / KC Padang", isi:"Data angkatan peserta belum sesuai, seharusnya TNI AU bukan TNI AD.", file:"sk-pengangkatan-fitri.pdf" }
    ] },
  { noRequest:36003, kpa:"KPA-10034", nama:"Andi Saputra",      nrp:"19860303012", tglLahir:"1986-03-03", cabang:"KC Jakarta Utama", tujuan:"Pelayanan", subjek:"Permintaan Info Saldo THT",
    tglRequest:"22 Jul 2026", selesai:true,
    riwayat:[
      { jam:"22 Jul 2026 08:00", user:"Rina / KC Jakarta",    isi:"Peserta menanyakan info saldo THT terakhir untuk keperluan pengajuan KPR.", file:null },
      { jam:"22 Jul 2026 11:30", user:"Fauzi / Div. Kepers.", isi:"Info saldo THT sudah dikirimkan langsung ke peserta melalui Kantor Cabang.", file:"info-saldo-andi.pdf" }
    ] },
  { noRequest:36004, kpa:"KPA-10035", nama:"Lina Marlina",      nrp:"19920815013", tglLahir:"1992-08-15", cabang:"KC Bandung", tujuan:"Kepesertaan", subjek:"Koreksi Nomor SKEP",
    tglRequest:"23 Jul 2026", selesai:false,
    riwayat:[
      { jam:"23 Jul 2026 09:18", user:"Agus / KC Bandung", isi:"Nomor SKEP pengangkatan salah ketik, seharusnya KEP/1123/VII/2026.", file:"skep-koreksi-lina.pdf" }
    ] },
  { noRequest:36005, kpa:"KPA-10036", nama:"Joko Purnomo",      nrp:"19830706014", tglLahir:"1983-07-06", cabang:"KC Surabaya", tujuan:"Pelayanan", subjek:"Pemutakhiran Alamat",
    tglRequest:"24 Jul 2026", selesai:false,
    riwayat:[
      { jam:"24 Jul 2026 07:55", user:"Dewi / KC Surabaya", isi:"Alamat domisili peserta pindah ke Jl. Kertajaya No. 88, Surabaya.", file:null }
    ] },
  { noRequest:36006, kpa:"KPA-10037", nama:"Bambang Wijaya",    nrp:"19870219015", tglLahir:"1987-02-19", cabang:"KC Medan", tujuan:"Kepesertaan", subjek:"Perubahan Status Personil",
    tglRequest:"25 Jul 2026", selesai:false,
    riwayat:[
      { jam:"25 Jul 2026 10:10", user:"Hendra / KC Medan", isi:"Status personil peserta berubah dari Aktif menjadi Purnawirawan.", file:"sk-purnawirawan.pdf" }
    ] },
  { noRequest:36007, kpa:"KPA-10038", nama:"Nur Aisyah",        nrp:"19950927016", tglLahir:"1995-09-27", cabang:"KC Makassar", tujuan:"Pelayanan", subjek:"Update No. Telepon",
    tglRequest:"26 Jul 2026", selesai:true,
    riwayat:[
      { jam:"26 Jul 2026 08:30", user:"Sari / KC Makassar",   isi:"Nomor HP peserta diperbarui menjadi 0813-4455-6677.", file:null },
      { jam:"26 Jul 2026 12:15", user:"Rina / Div. Kepers.",  isi:"Nomor telepon sudah diperbarui pada sistem.", file:null }
    ] },
  { noRequest:36008, kpa:"KPA-10039", nama:"Rudi Hartono",      nrp:"19840411017", tglLahir:"1984-04-11", cabang:"KC Semarang", tujuan:"Kepesertaan", subjek:"Update Data NIK",
    tglRequest:"27 Jul 2026", selesai:false,
    riwayat:[
      { jam:"27 Jul 2026 09:45", user:"Joko / KC Semarang", isi:"NIK peserta pada sistem tertukar dengan peserta lain, mohon dikoreksi.", file:"ktp-rudi.jpg" }
    ] },
  { noRequest:36009, kpa:"KPA-10040", nama:"Maya Anggraini",    nrp:"19960130018", tglLahir:"1996-01-30", cabang:"KC Palembang", tujuan:"Pelayanan", subjek:"Permintaan Salinan Kartu Peserta",
    tglRequest:"28 Jul 2026", selesai:false,
    riwayat:[
      { jam:"28 Jul 2026 08:20", user:"Bambang / KC Palembang", isi:"Kartu peserta ASABRI rusak, mohon dicetakkan ulang.", file:null }
    ] },
  { noRequest:36014, kpa:"KPA-10041", nama:"Doni Kusuma",       nrp:"19891005019", tglLahir:"1989-10-05", cabang:"KC Denpasar", tujuan:"Kepesertaan", subjek:"Koreksi Pangkat",
    tglRequest:"29 Jul 2026", selesai:false,
    riwayat:[
      { jam:"29 Jul 2026 10:00", user:"Made / KC Denpasar", isi:"Pangkat peserta belum diperbarui sejak kenaikan pangkat terakhir bulan lalu.", file:"sk-kenaikan-doni.pdf" }
    ] },
  { noRequest:36016, kpa:"KPA-10042", nama:"Wulandari",         nrp:"19970822020", tglLahir:"1997-08-22", cabang:"KC Balikpapan", tujuan:"Pelayanan", subjek:"Perubahan Data Rekening",
    tglRequest:"30 Jul 2026", selesai:true,
    riwayat:[
      { jam:"30 Jul 2026 09:12", user:"Andi / KC Balikpapan", isi:"Rekening peserta ditutup, mohon diperbarui ke rekening baru BNI.", file:"buku-tabungan-wulan.jpg" },
      { jam:"30 Jul 2026 14:50", user:"Fauzi / Div. Kepers.", isi:"Rekening baru sudah tercatat dan aktif untuk pencairan manfaat.", file:null }
    ] },
  { noRequest:36017, kpa:"KPA-10043", nama:"Teguh Prasetya",    nrp:"19820314021", tglLahir:"1982-03-14", cabang:"KC Manado", tujuan:"Kepesertaan", subjek:"Update Data Angkatan",
    tglRequest:"31 Jul 2026", selesai:false,
    riwayat:[
      { jam:"31 Jul 2026 08:00", user:"Christine / KC Manado", isi:"Data angkatan peserta kosong pada sistem, mohon dilengkapi sesuai SK terlampir.", file:"sk-teguh.pdf" }
    ] }
];

/* ===========================================================================
   20. PEMBENTUKAN DAPEM
   ---------------------------------------------------------------------------
   Parameter run — di proses manual, nilai-nilai ini di-hardcode dan diulang
   ratusan kali di file SQL (dengan catatan "ubah bulan bayar"). Di sini
   diisi SEKALI saat periode dibuka, lalu dipakai semua tahap & pemeriksaan.
   =========================================================================== */
const DAPEM_PARAM = {
  blnbyr:        "202607",       // bulan bayar dapem yang dibentuk
  blnbyrPrev:    "202606",       // bulan bayar sebelumnya (pembanding)
  jnsbyr:        "20",           // 20 = Induk, 23 = Susulan
  jenis:         "Induk",
  tglCutoff:     "15 Jun 2026",  // entri < 16 Jun 2026
  tglDapem:      "01 Jul 2026",
  otenDari:      "01 Jun 2026",
  otenSampai:    "16 Jun 2026",
  tahunPajakAwal:"202601"
};

/* Enam tahap. 26 langkah di dokumen proses dikelompokkan ke sini. */
const DAPEM_TAHAP = [
  { no:1, kode:"generate",    nama:"Generate & Cleansing",   aktor:"TI (Manajemen Data)",  status:"aktif" },
  { no:2, kode:"kepesertaan", nama:"Validasi Kepesertaan",   aktor:"Div. Kepesertaan",     status:"terkunci" },
  { no:3, kode:"tunsil",      nama:"Tunjuk Silang & NIK",    aktor:"TI + Kepesertaan",     status:"terkunci" },
  { no:4, kode:"pajak",       nama:"Validasi Pajak",         aktor:"Bagian Pajak",         status:"terkunci" },
  { no:5, kode:"sipp",        nama:"Validasi SIPP",          aktor:"SIPP",                 status:"terkunci" },
  { no:6, kode:"yar",         nama:"Upload YAR & Kode OTEN", aktor:"TI + Keuangan",        status:"terkunci" }
];

/* Angka kontrol per tahap. Menggantikan kebiasaan mencatat "Generate 1 -> 1.845"
   sebagai komentar di file SQL. */
const DAPEM_RINGKAS = {
  generate:    { nopens:245310, delta:128,  bruto:1024800000000, netto:983400000000 },
  kepesertaan: { nopens:245297, delta:-13,  bruto:1024310000000, netto:982950000000 },
  tunsil:      { nopens:245297, delta:0,    bruto:1024310000000, netto:982950000000 },
  pajak:       { nopens:245297, delta:0,    bruto:1026880000000, netto:982950000000 },
  sipp:        { nopens:245297, delta:0,    bruto:1026880000000, netto:982950000000 },
  yar:         { nopens:245297, delta:0,    bruto:1026880000000, netto:982950000000 }
};

/* Langkah tanpa keputusan — dijalankan sistem, tidak perlu tombol.
   Ditampilkan ringkas supaya tetap bisa diaudit. */
const DAPEM_OTOMATIS = {
  generate: [
    { nama:"Isi kode cabang dari mitra bayar",        param:"CAB IN ('0','1000') / NULL", baris:412 },
    { nama:"Bersihkan koma pada NRP_NIP & NOPENS",    param:"LIKE '%,%'",                 baris:3 },
    { nama:"Bersihkan spasi pada rekening BRI",       param:"BANK = 'AAA'",               baris:27 },
    { nama:"Hitung ulang bruto, potongan & netto",    param:"seluruh baris periode",      baris:245310 },
    { nama:"Pembulatan netto ke kelipatan 100",       param:"seluruh baris periode",      baris:245310 }
  ],
  kepesertaan: [
    { nama:"Terapkan pemutakhiran NIK dari Kepesertaan", param:"berkas balikan", baris:0 }
  ],
  tunsil: [
    { nama:"Tandai penanggung PPh per NIK",          param:"agregasi per NIK",     baris:238104 },
    { nama:"Susun ADK tunjuk silang",                param:"BLNBYR = 202607",      baris:245297 }
  ],
  pajak: [
    { nama:"Bentuk data bruto sebelum pajak",        param:"seluruh baris periode", baris:245297 },
    { nama:"Hitung PPh 21 dengan tarif TER",         param:"per NIK, status PTKP",  baris:238104 }
  ],
  sipp: [
    { nama:"Bentuk berkas master & bayar ADK",       param:"BLNBYR 202607 / JNSBYR 20", baris:245297 },
    { nama:"Deteksi mutasi terhadap bulan lalu",     param:"pembanding 202606",         baris:1842 }
  ],
  yar: [
    { nama:"Salin data dapem ke tabel pembayaran",   param:"BLNBYR 202607", baris:245297 }
  ]
};

/* Pemeriksaan (gate). Kolom `param` memperlihatkan parameter SQL yang dipakai,
   supaya operator tahu persis dasar pemeriksaannya. */
const DAPEM_GATE = [
  /* --- Tahap 1: Generate & Cleansing --- */
  { tahap:"generate", kode:"D-01", nama:"Nomor pensiun ganda",
    param:"COUNT(NOPENS) > 1", sev:"tinggi", temuan:0 },
  { tahap:"generate", kode:"D-02", nama:"Cabang / bank / MAK kosong",
    param:"CAB, BANK, BRANCH, MAK, F_BYR IS NULL", sev:"tinggi", temuan:0 },
  { tahap:"generate", kode:"D-03", nama:"Pensiun pertama sendiri tidak terbit",
    param:"JNSBYR 10 · entri 01–15 Jun 2026", sev:"tinggi", temuan:0 },
  { tahap:"generate", kode:"D-04", nama:"Pensiun wari & tunjangan tidak terbit",
    param:"JNSBYR 10 · tgl dapem end = tgl lahir/SM", sev:"tinggi", temuan:0 },
  { tahap:"generate", kode:"D-05", nama:"Kancab Aceh selain POS & BSI",
    param:"CAB IN ('2200','2201') AND BANK NOT IN ('AAG','ABE')", sev:"sedang", temuan:0 },
  { tahap:"generate", kode:"D-06", nama:"Bank Mandiri masih terpakai",
    param:"BANK = 'ABD'", sev:"sedang", temuan:0 },
  { tahap:"generate", kode:"D-07", nama:"Bank BNC sudah tidak berlaku PKS",
    param:"BANK = 'AAD'", sev:"sedang", temuan:0 },
  { tahap:"generate", kode:"D-08", nama:"Pembayaran tunai",
    param:"F_BYR = 'T'", sev:"sedang", temuan:0 },
  { tahap:"generate", kode:"D-09", nama:"Tunjangan anak di atas 21 tahun",
    param:"KODE_JIWA IN ('0001','0002') · umur > 20 per 01 Jul 2026", sev:"tinggi", temuan:13 },
  { tahap:"generate", kode:"D-10", nama:"Tunjangan cacat tidak sama dengan master",
    param:"TUNJ_CACAT <> master tunjangan cacat", sev:"tinggi", temuan:7 },
  { tahap:"generate", kode:"D-11", nama:"Tunjangan IRJA tanpa provinsi Papua",
    param:"prov_id IN (35,36,37,38,…) AND TUNJ_IRJA = 0", sev:"sedang", temuan:0 },
  { tahap:"generate", kode:"D-12", nama:"Pensiun bagi PNS — 1 KTPA lebih dari 1 nopens",
    param:"KODE_JIWA IN ('0100','0101','0102','0001','0002') · status personil = 2", sev:"tinggi", temuan:2 },
  { tahap:"generate", kode:"D-13", nama:"Rekening flagging berbeda dengan set dapem",
    param:"status flagging = 3 AND norek dapem = norek flagging", sev:"tinggi", temuan:5 },
  /* --- Tahap 2: Validasi Kepesertaan --- */
  { tahap:"kepesertaan", kode:"K-01", nama:"Belum otentikasi 2 bulan terakhir",
    param:"tidak ada otentikasi sejak 202605", sev:"tinggi", temuan:34 },
  { tahap:"kepesertaan", kode:"K-02", nama:"Seharusnya terbit tapi tidak muncul",
    param:"balikan Kepesertaan", sev:"tinggi", temuan:6 },
  { tahap:"kepesertaan", kode:"K-03", nama:"Seharusnya tidak terbit",
    param:"balikan Kepesertaan", sev:"tinggi", temuan:9 },
  { tahap:"kepesertaan", kode:"K-04", nama:"Mitra calon dapem ≠ mitra flagging kredit",
    param:"mitra dapem <> mitra flagging", sev:"sedang", temuan:3 },
  /* --- Tahap 3: Tunjuk Silang & NIK --- */
  { tahap:"tunsil", kode:"T-01", nama:"NIK kosong",
    param:"NIK IS NULL OR NIK = ''", sev:"tinggi", temuan:0 },
  { tahap:"tunsil", kode:"T-02", nama:"NIK ganda lebih dari 2 nopens",
    param:"COUNT(*) > 2 GROUP BY NIK", sev:"sedang", temuan:11 },
  { tahap:"tunsil", kode:"T-03", nama:"Penanggung PPh ganda dalam satu NIK",
    param:"kode jiwa kembar dalam satu NIK", sev:"tinggi", temuan:2 },
  /* --- Tahap 4: Validasi Pajak --- */
  { tahap:"pajak", kode:"P-01", nama:"Selisih PPh terhadap balikan Bagian Pajak",
    param:"PPh sistem <> PPh balikan", sev:"tinggi", temuan:0 },
  { tahap:"pajak", kode:"P-02", nama:"Sudah masuk dapem terusan tahun berjalan",
    param:"BLNBYR 202601–202607 · sudah dilaporkan", sev:"sedang", temuan:0 },
  /* --- Tahap 5: Validasi SIPP --- */
  { tahap:"sipp", kode:"S-01", nama:"Pensiun pokok ≠ penetapan pokok ADK",
    param:"PENS_POKOK <> penspok per kode jiwa", sev:"tinggi", temuan:0 },
  { tahap:"sipp", kode:"S-02", nama:"Ada tunjangan cacat tapi gaji pokok kosong",
    param:"TUNJ_CACAT > 0 AND GAPOK IS NULL", sev:"tinggi", temuan:0 },
  { tahap:"sipp", kode:"S-03", nama:"Kode provinsi tidak terbaca SIPP",
    param:"prov_id di luar 33–38", sev:"sedang", temuan:0 },
  { tahap:"sipp", kode:"S-04", nama:"Potongan hutang padahal sudah lunas",
    param:"POT_HUTANG > 0 AND sisa hutang = 0", sev:"tinggi", temuan:0 },
  { tahap:"sipp", kode:"S-05", nama:"Selisih rekap SIPP dengan data internal",
    param:"per MAK · jumlah, bruto, netto", sev:"tinggi", temuan:0 },
  /* --- Tahap 6: Upload YAR & Kode OTEN --- */
  { tahap:"yar", kode:"Y-01", nama:"Kode otentikasi masih kosong",
    param:"OTEN IS NULL", sev:"tinggi", temuan:0 },
  { tahap:"yar", kode:"Y-02", nama:"Kode cabang kosong di tabel pembayaran",
    param:"CAB IS NULL · BLNBYR 202607", sev:"tinggi", temuan:0 },
  { tahap:"yar", kode:"Y-03", nama:"Tanggal entri tidak seragam",
    param:"TG_INP1 <> 01 Jul 2026", sev:"sedang", temuan:0 }
];

/* Rincian temuan. Sengaja hanya beberapa gate yang diisi — cukup untuk
   memperagakan alur tinjau → pilih → terapkan. */
const DAPEM_TEMUAN = {
  "D-09": {
    aturan:"Anak berumur lebih dari 21 tahun per 01 Jul 2026 dan tanggal dapem end-nya sudah terlewat, sehingga tunjangan seharusnya tidak terbit. Anak yang masih kuliah dikecualikan.",
    aksi:"Keluarkan dari dapem",
    kolom:["Nopens","Nama","Kode Jiwa","Umur","Tgl Dapem End","Catatan"],
    baris:[
      { pilih:true,  sel:["2013110847","ANANDA PRATAMA","0001","22","01 Mei 2026",""] },
      { pilih:true,  sel:["2011210299","BAGAS SETIAWAN","0001","23","01 Apr 2026",""] },
      { pilih:false, sel:["2014140204","CITRA DEWANTI","0002","21","01 Ags 2027","Masih kuliah — dikecualikan"] },
      { pilih:true,  sel:["2012110558","DIMAS ANGGARA","0001","22","01 Mar 2026",""] },
      { pilih:true,  sel:["2013110992","ERIKA PUTRI","0002","24","01 Feb 2026",""] },
      { pilih:false, sel:["2015110331","FARHAN MAULANA","0001","21","01 Des 2027","Masih kuliah — dikecualikan"] },
      { pilih:true,  sel:["2011210447","GITA RAHAYU","0001","23","01 Jan 2026",""] }
    ]
  },
  "D-10": {
    aturan:"Nilai tunjangan cacat pada calon dapem berbeda dengan master tunjangan cacat. Peserta yang sudah meninggal (dapem terusan) tidak berhak atas tunjangan cacat.",
    aksi:"Samakan dengan master",
    kolom:["Nopens","Nama","Tunj. Cacat Dapem","Tunj. Cacat Master","Selisih","Catatan"],
    baris:[
      { pilih:true,  sel:["1997110357","HADI SUSANTO","1.808.300","904.150","+904.150",""] },
      { pilih:true,  sel:["2000110100","INDRA GUNAWAN","1.731.600","1.298.700","+432.900",""] },
      { pilih:false, sel:["1990120012","JOKO WIDODO","1.448.400","0","+1.448.400","Sudah meninggal — nolkan lewat koreksi manual"] },
      { pilih:true,  sel:["2002110253","KARTIKA SARI","2.284.900","1.713.675","+571.225",""] },
      { pilih:true,  sel:["2002110562","LUKMAN HAKIM","1.731.600","1.298.700","+432.900",""] }
    ]
  },
  "D-12": {
    aturan:"Satu nomor KTPA memiliki lebih dari satu nomor pensiun dengan status personil PNS. Pensiun pokoknya harus dibagi, bukan diberikan penuh ke masing-masing.",
    aksi:"Bagi pensiun pokok",
    kolom:["KTPA","Nopens","Nama","Kode Jiwa","Pens. Pokok","Seharusnya"],
    baris:[
      { pilih:true, sel:["CZ103326","CZ10332612","SITI AMINAH","0100","1.591.200","795.600"] },
      { pilih:true, sel:["CZ103326","CZ10332613","RIZKY AMANDA","0001","1.591.200","795.600"] }
    ]
  },
  "D-13": {
    aturan:"Nomor rekening pada calon dapem mengikuti rekening flagging pinjaman milik peserta lain dalam satu KTPA. Rekening yatim seharusnya mengikuti set rekening dapem, bukan rekening flagging.",
    aksi:"Kembalikan ke set dapem",
    kolom:["KTPA","Nopens","Nama","Norek Dapem","Norek Set Dapem","Mitra"],
    baris:[
      { pilih:true, sel:["EZ109152","EZ10915213","NOVITA SARI","1448****0502","1448****0502","BRI KK ASABRI"] },
      { pilih:true, sel:["BE385294","BE38529413","OKTAVIAN HANIF","0002****4929","0187****1704","SMBC KCP Wonosari"] },
      { pilih:true, sel:["DE306629","DE30662913","PUTRI HAWI","2006****8890","2006****8890","Mantap KC Tasikmalaya"] },
      { pilih:true, sel:["ED366529","ED36652913","QORI ANANDA","0177****5502","0177****5502","BRI KC Trenggalek"] },
      { pilih:false,sel:["BZ115850","BZ11585013","RAHMA ELSA","0000****6756","0000****6756","KPRK Ujungberung"] }
    ]
  },
  "K-01": {
    aturan:"Peserta belum melakukan otentikasi dalam dua bulan terakhir. Sesuai ketentuan semester II, dapem tetap dibentuk tetapi diberi kode otentikasi blokir sampai peserta melakukan otentikasi.",
    aksi:"Beri kode blokir",
    kolom:["Nopens","Nama","Otentikasi Terakhir","Kanal","Kantor Bayar","Catatan"],
    baris:[
      { pilih:true, sel:["1996140026","SUPARMAN","12 Mar 2026","Digital","BRI KC Solo",""] },
      { pilih:true, sel:["1991140523","TUTI HERAWATI","28 Feb 2026","Manual","POS Yogyakarta",""] },
      { pilih:true, sel:["1999120053","UMAR BAKRI","05 Mar 2026","Digital","BSI KC Medan",""] }
    ]
  },
  "K-02": {
    aturan:"Menurut Kepesertaan nopens berikut seharusnya terbit pada dapem bulan ini, tetapi tidak muncul saat pembentukan.",
    aksi:"Terbitkan ke dapem",
    kolom:["Nopens","Nama","Kode Jiwa","Alasan Kepesertaan","Tgl Dapem End"],
    baris:[
      { pilih:true, sel:["2006140118","AGUS SALIM","1000","SK pensiun sudah terbit 12 Mei 2026","—"] },
      { pilih:true, sel:["2007140226","BUDIONO","0100","Perbaikan tanggal batas sudah dilakukan","—"] }
    ]
  },
  "K-03": {
    aturan:"Menurut Kepesertaan nopens berikut seharusnya tidak terbit pada dapem bulan ini karena haknya sudah berakhir.",
    aksi:"Keluarkan dari dapem",
    kolom:["Nopens","Nama","Kode Jiwa","Alasan Kepesertaan","Tgl Dapem End"],
    baris:[
      { pilih:true, sel:["1994110552","CAHYONO","1000","Meninggal 03 Jun 2026","01 Jul 2026"] },
      { pilih:true, sel:["2003120884","DEWI ANGGRAINI","0100","Menikah lagi, hak wari berakhir","01 Jun 2026"] },
      { pilih:true, sel:["2009140337","EKO PRASETYO","0001","Sudah bekerja tetap","01 Mei 2026"] }
    ]
  },
  "K-04": {
    aturan:"Mitra bayar pada calon dapem berbeda dengan mitra flagging kredit yang tercatat di Kepesertaan.",
    aksi:"Sesuaikan mitra bayar",
    kolom:["Nopens","Nama","Mitra Dapem","Mitra Flagging","Catatan"],
    baris:[
      { pilih:true, sel:["2002140771","FAJAR NUGROHO","BRI KC Solo","Mantap KC Solo","Flagging aktif sejak Mei 2026"] },
      { pilih:true, sel:["1998110443","GALIH SAPUTRA","SMBC KCP Wonosari","BWS KC Cirebon","Take over Juni 2026"] }
    ]
  },
  "T-02": {
    aturan:"Satu NIK dipakai oleh lebih dari dua nomor pensiun. Perlu dipastikan memang satu keluarga penerima, karena PPh 21 dihitung atas gabungan penghasilan per NIK.",
    aksi:"Tandai sudah diverifikasi",
    kolom:["NIK","Jumlah Nopens","Nopens","Hubungan","Total Bruto"],
    baris:[
      { pilih:true, sel:["3174****0117","3","2008140xxx, 2008140yyy, 2008140zzz","Janda + 2 anak","7.240.600"] },
      { pilih:true, sel:["3273****0442","3","2011210xxx, 2011210yyy, 2011210zzz","Janda + 2 anak","6.880.150"] },
      { pilih:true, sel:["3515****0908","4","2005110xxx dan 3 lainnya","Janda + 3 anak","9.120.400"] }
    ]
  },
  "T-03": {
    aturan:"Dalam satu NIK terdapat lebih dari satu baris dengan kode jiwa yang sama, sehingga penanggung PPh tidak dapat ditentukan secara tunggal. Jika dibiarkan, PPh atas bruto gabungan berpotensi dipotong dua kali.",
    aksi:"Tetapkan penanggung",
    kolom:["NIK","Nopens","Nama","Kode Jiwa","Bruto","Status"],
    baris:[
      { pilih:true, sel:["3174****0001","2010110447","VINA MARLINA","0100","4.820.400","Kandidat penanggung"] },
      { pilih:true, sel:["3174****0001","2010110448","VINA MARLINA","0100","4.820.400","Kandidat penanggung"] }
    ]
  }
};

/* Riwayat kirim–terima dengan pihak luar. Loop ini bisa terjadi berkali-kali
   dan di proses manual hanya terekam di rantai email. */
const DAPEM_PUTARAN = {
  pajak: [
    { putaran:1, kirim:"18 Jun 2026 16:20", oleh:"Menda", berkas:"dapem-202607-pajak.xlsx", balas:"20 Jun 2026 09:45", hasil:"Selisih pada 12 nopens", status:"Selesai" },
    { putaran:2, kirim:"20 Jun 2026 14:10", oleh:"Menda", berkas:"dapem-202607-pajak-rev1.xlsx", balas:"—", hasil:"Menunggu balasan", status:"Menunggu" }
  ],
  sipp: [
    { putaran:1, kirim:"22 Jun 2026 17:00", oleh:"Menda", berkas:"6 berkas (master, bayar, susulan, mutasi, stop, tunjuk silang)", balas:"23 Jun 2026 11:20", hasil:"Penspok tidak sama pada 8 nopens", status:"Selesai" },
    { putaran:2, kirim:"23 Jun 2026 15:40", oleh:"Menda", berkas:"2 berkas (master, bayar)", balas:"—", hasil:"Menunggu balasan", status:"Menunggu" }
  ]
};

/* Berkas ADK untuk SIPP. Penamaan dibentuk sistem — di proses manual diketik
   tangan dan penanggalannya mudah salah. */
const DAPEM_BERKAS_SIPP = [
  { urut:1, jenis:"Master",          nama:"Master 20260721100001_16-06-2026", baris:245297, status:"Siap" },
  { urut:2, jenis:"Bayar",           nama:"20260721100001_16-06-2026",        baris:245297, status:"Siap" },
  { urut:3, jenis:"Susulan",         nama:"20260722100001_16-06-2026",        baris:1845,   status:"Siap" },
  { urut:4, jenis:"Mutasi",          nama:"20260723100001_16-06-2026",        baris:1842,   status:"Siap" },
  { urut:5, jenis:"Stop",            nama:"20260724100001_16-06-2026",        baris:612,    status:"Siap" },
  { urut:6, jenis:"ADK Tunjuk Silang",nama:"ADK_TUNJUK_SILANG_202607",        baris:245297, status:"Siap" }
];

/* Daftar periode pada layar utama. */
const DAPEM_PERIODE = [
  { periode:"202607", jenis:"Induk",   tahap:"Generate & Cleansing", tahapNo:1, status:"Berjalan", menunggu:"TI (Manajemen Data)",
    nopens:245310, bruto:1024800000000, netto:983400000000, temuan:27, cutoff:"15 Jun 2026" },
  { periode:"202607", jenis:"Susulan", tahap:"Belum dimulai",        tahapNo:0, status:"Draft",    menunggu:"—",
    nopens:0, bruto:0, netto:0, temuan:0, cutoff:"30 Jun 2026" },
  { periode:"202606", jenis:"Induk",   tahap:"Selesai",              tahapNo:6, status:"Selesai",  menunggu:"—",
    nopens:245182, bruto:1021400000000, netto:980100000000, temuan:0, cutoff:"15 Mei 2026" },
  { periode:"202606", jenis:"Susulan", tahap:"Selesai",              tahapNo:6, status:"Selesai",  menunggu:"—",
    nopens:1793,   bruto:7480000000,    netto:7190000000,   temuan:0, cutoff:"31 Mei 2026" },
  { periode:"202605", jenis:"Induk",   tahap:"Selesai",              tahapNo:6, status:"Selesai",  menunggu:"—",
    nopens:245044, bruto:1019800000000, netto:978600000000, temuan:0, cutoff:"15 Apr 2026" }
];

/* ===========================================================================
   21. PEMBENTUKAN NON DAPEM
   Jenis bayar 10 (pensiun pertama), 11 (kekurangan pensiun), 12 (uang duka).
   =========================================================================== */
const NONDAPEM_PARAM = {
  blnbyr:      "202606",   // bulan bayar data non dapem yang ditarik
  blnbyrDapem: "202607",   // dibentuk berbarengan dapem induk bulan berikutnya
  jnsbyr:      "10, 11, 12"
};

const NONDAPEM_RINGKAS = { nopens:2627, jenis10:844, jenis11:1591, jenis12:192, bruto:41280000000, netto:39640000000 };

/* Tiga lajur aktor. Sama seperti dapem, yang membedakan perlakuan adalah jenis
   batasnya: Pajak tidak memakai YANDU sehingga penyerahannya di luar sistem. */
const NONDAPEM_LANE = [
  { kode:"ti",       nama:"TI (Menda)", jenis:"dalam sistem" },
  { kode:"pajak",    nama:"Pajak",      jenis:"luar sistem" },
  { kode:"keuangan", nama:"Keuangan",   jenis:"dalam sistem" }
];

/* F1.2.1 & F1.2.2 — rekonsiliasi ringkasan vs rincian.
   Di proses manual dua tabel ditarik lalu dicocokkan di Excel. */
const NONDAPEM_SELISIH = [
  { pilih:true, nopens:"1995210160", nama:"WAHYU SANTOSO",  jenis:"11", ringkasan:"1.250.000", rincian:"1.250.050", selisih:"50",      sebab:"Nilai bruto rincian berbeda" },
  { pilih:true, nopens:"1993110284", nama:"XAVERIUS DONI",  jenis:"11", ringkasan:"2.480.000", rincian:"0",         sebab:"Tanggal entri tidak cocok", rincianKosong:true },
  { pilih:true, nopens:"2001120039", nama:"YULIANA DEWI",   jenis:"11", ringkasan:"3.120.000", rincian:"3.120.000", selisih:"0",       sebab:"Nomor pengajuan berbeda" },
  { pilih:true, nopens:"1998110771", nama:"ZAINAL ABIDIN",  jenis:"11", ringkasan:"960.000",   rincian:"1.920.000", selisih:"-960.000",sebab:"Rincian terhitung dua kali" }
];

/* F1.2.3 — kelengkapan data. N-01 angkanya mengikuti sisa selisih di atas. */
const NONDAPEM_GATE = [
  { kode:"N-01", nama:"Ringkasan tidak sama dengan rincian",
    param:"JNSBYR 11 · bruto ringkasan vs rincian", sev:"tinggi", temuan:4 },
  { kode:"N-02", nama:"Kode cabang kosong atau tidak valid",
    param:"CAB IN ('0','1000') OR CAB IS NULL", sev:"tinggi", temuan:0 },
  { kode:"N-03", nama:"Kantor bayar POS tanpa kode juru bayar",
    param:"BANK = 'AAG' AND KD_JBY IS NULL", sev:"sedang", temuan:0 },
  { kode:"N-04", nama:"Uang duka wafat terkena potongan pajak",
    param:"JNSBYR 12 AND POT_PPH21 <> 0", sev:"tinggi", temuan:2 }
];

/* Rincian temuan yang bisa ditinjau. N-02 dan N-03 bersih pada periode ini,
   jadi tidak punya rincian — sengaja dibiarkan begitu. */
const NONDAPEM_TEMUAN = {
  "N-04": {
    aturan:"Uang duka wafat (jenis bayar 12) tidak dikenakan PPh 21. Baris berikut masih memiliki potongan PPh, sehingga netto yang dibayarkan kurang dari yang seharusnya.",
    aksi:"Nolkan potongan PPh",
    kolom:["Nopens","Nama Penerima","Jenis Bayar","Bruto","POT PPh21","Netto Seharusnya"],
    baris:[
      { pilih:true, sel:["1997120884","SUMIYATI","12","29.380.000","1.469.000","29.380.000"] },
      { pilih:true, sel:["2001120147","HERLINA WATI","12","24.120.000","1.206.000","24.120.000"] }
    ]
  }
};

/* F1.2.4 — backup ke DB Dev sebelum data diserahkan ke Pajak.
   Langkah ini tidak punya kotak keputusan, tetapi wajib dan mudah terlewat. */
const NONDAPEM_BACKUP = {
  sumber: "DB_PROD.asabri_peserta.dbo.AP3_TBL_YAR_ALL",
  tujuan: "x_AP3_TBL_YAR_ALL_NONDAPEM_BCK (DB Dev)",
  param:  "JNSBYR IN ('10','11','12') AND BLNBYR = '202606'",
  baris:  2627
};

/* F1.2.5 – F1.2.7 — satu putaran penyerahan ke Pajak.
   Berbeda dengan dapem: Pajak MENARIK sendiri datanya, bukan dikirimi berkas. */
const NONDAPEM_PUTARAN = {
  putaran: 1,
  info:    "02 Jul 2026 10:15",
  oleh:    "Menda",
  sumber:  "Aplikasi Pensiun (Dropping Dana) + Yandu (Report UKP)",
  balas:   "03 Jul 2026 14:30",
  berkas:  "NON DAPEM JUN KIRIM SISFO.xlsx",
  tabel:   "x_tbl_nondapem_ALL_202606",
  hasil:   "Selisih PPh pada 6 nopens",
  lama:    "1 hari 4 jam"
};

/* F1.2.8 — perhitungan ulang setelah balikan pajak masuk.
   Perhatikan jenis bayar: PPh & potongan hanya 10 dan 11, sedangkan bruto dan
   pembulatan mencakup 12 — karena uang duka wafat tidak dikenakan pajak. */
const NONDAPEM_HITUNG = [
  { urut:1, nama:"Perbarui PPh 21 dari balikan Pajak",
    rumus:"POT_PPH21 = [PPH 21] pada tabel balikan", param:"JNSBYR 10, 11",     baris:2435 },
  { urut:2, nama:"Hitung ulang jumlah potongan",
    rumus:"JML_POTONG = POT_ASKES + POT_HUTANG + POT_LAIN + POT_PPH21", param:"JNSBYR 10, 11", baris:2435 },
  { urut:3, nama:"Hitung ulang tunjangan lain",
    rumus:"TUNJ_LAIN = TUNJ_CACAT + POT_PPH21 + TUNJ_IRJA", param:"JNSBYR 10, 11", baris:2435 },
  { urut:4, nama:"Hitung ulang jumlah bruto",
    rumus:"JML_BRUTO = JML_NETTO + JML_POTONG", param:"JNSBYR 10, 11, 12", baris:2627 },
  { urut:5, nama:"Hitung ulang pembulatan",
    rumus:"PEMBULATAN = JML_BRUTO − (PENS_POKOK + TUNJ_ISTRI + TUNJ_ANAK + TUNJ_BERAS + TUNJ_LAIN)",
    param:"JNSBYR 10, 11, 12", baris:2627 }
];

/* F1.2.10 — Rekap III Non Dapem yang dicetak Div. Keuangan.
   Jumlah nopens tidak dijumlahkan antar mata anggaran: satu peserta dapat
   muncul pada beberapa mata anggaran sekaligus. */
const NONDAPEM_REKAP_MAK = [
  { mak:"51311", uraian:"Pensiun Pokok",          jumlah:2435, bruto:28640000000, netto:27980000000 },
  { mak:"51312", uraian:"Tunjangan Keluarga",     jumlah:1982, bruto: 3410000000, netto: 3310000000 },
  { mak:"51313", uraian:"Tunjangan Beras",        jumlah:2435, bruto: 2180000000, netto: 2120000000 },
  { mak:"51322", uraian:"Tunjangan Cacat",        jumlah:  41, bruto:  180000000, netto:  176000000 },
  { mak:"51324", uraian:"Tunjangan Lain & Pajak", jumlah:2435, bruto: 1230000000, netto:  894000000 },
  { mak:"51411", uraian:"Uang Duka Wafat",        jumlah: 192, bruto: 5640000000, netto: 5160000000 }
];

/* ---------------------------------------------------------------------------
   22. LINTAS UNIT — siapa yang sedang memegang proses
   Tiga jenis batas yang berbeda perlakuannya:
     dalam sistem    → serah terima tugas, status berpindah pemilik seketika
     luar sistem     → tukar berkas (unit ASABRI yang belum pakai YANDU)
     luar organisasi → putaran asinkron, tidak bisa dikejar lewat sistem
   --------------------------------------------------------------------------- */
const DAPEM_LANE = [
  { kode:"ti",          nama:"TI (Menda)",   jenis:"dalam sistem" },
  { kode:"kepesertaan", nama:"Kepesertaan",  jenis:"dalam sistem" },
  { kode:"pajak",       nama:"Pajak",        jenis:"luar sistem" },
  { kode:"sipp",        nama:"SIPP",         jenis:"luar organisasi" },
  { kode:"keuangan",    nama:"Keuangan",     jenis:"dalam sistem" }
];

/* tahap → lane pemiliknya */
const DAPEM_TAHAP_LANE = {
  generate:"ti", kepesertaan:"kepesertaan", tunsil:"ti",
  pajak:"pajak", sipp:"sipp", yar:"ti"
};

/* Keadaan menunggu per tahap. Lama menunggu sengaja nilai tetap supaya
   tampilan prototipe selalu sama tiap kali didemokan. */
const DAPEM_MENUNGGU = {
  kepesertaan:{ sejak:"18 Jun 2026 16:40", lama:"1 hari 3 jam",  oleh:"Menda",
                rincian:"10 temuan dikirim untuk diperiksa",
                aksi:"buka", aksiLabel:"Buka Layar Kepesertaan", tujuan:"dapem-validasi" },
  pajak:      { sejak:"20 Jun 2026 14:10", lama:"2 hari 4 jam",  oleh:"Menda",
                rincian:"putaran 2 · 12.350 baris dikirim",
                aksi:"unggah", aksiLabel:"⬆ Unggah Balikan Pajak" },
  sipp:       { sejak:"23 Jun 2026 15:40", lama:"3 hari 1 jam",  oleh:"Menda",
                rincian:"putaran 2 · 2 dari 6 berkas dikirim ulang",
                aksi:"unggah", aksiLabel:"⬆ Unggah Balikan SIPP" }
};

/* ---------------------------------------------------------------------------
   23. VALIDASI DAPEM — SISI DIV. KEPESERTAAN
   Layar terpisah dengan data yang sama tetapi kewenangan berbeda: hanya
   menyatakan sesuai / tidak sesuai, tanpa tombol perbaikan apa pun.
   --------------------------------------------------------------------------- */
const DAPEM_VALIDASI_KEP = {
  periode:"202607", jenis:"Induk",
  dikirim:"18 Jun 2026 16:40", oleh:"Menda (TI Manajemen Data)",
  batas:"20 Jun 2026",
  pengantar:"Mohon diperiksa daftar berikut sebelum dapem diproses ke tahap berikutnya. Tandai setiap baris Sesuai atau Tidak Sesuai; yang ditandai tidak sesuai akan dikembalikan ke TI untuk diperbaiki."
};

/* ---------------------------------------------------------------------------
   24. REKAP III — SISI KEUANGAN
   Ujung alur: F1.1.25 (TI menginformasikan) → F1.1.26 (Keuangan mencetak).
   Di YANDU lama ini menu YARPEN → KU 000 - REK III.
   --------------------------------------------------------------------------- */
const DAPEM_REKAP_MAK = [
  { mak:"51311", uraian:"Pensiun Pokok",            jumlah:245297, bruto:812450000000, netto:790120000000 },
  { mak:"51312", uraian:"Tunjangan Keluarga",       jumlah:198442, bruto: 96180000000, netto: 93640000000 },
  { mak:"51313", uraian:"Tunjangan Beras",          jumlah:245297, bruto: 74310000000, netto: 72880000000 },
  { mak:"51321", uraian:"Tunjangan IRJA",           jumlah:  1284, bruto:  1280000000, netto:  1240000000 },
  { mak:"51322", uraian:"Tunjangan Cacat",          jumlah:   612, bruto:  1090000000, netto:  1060000000 },
  { mak:"51324", uraian:"Tunjangan Lain & Pajak",   jumlah:238104, bruto: 41570000000, netto: 24010000000 }
];

/* Empat langkah di tahap akhir. Dua di antaranya (mode pemeliharaan dan kode
   otentikasi) tidak punya kotak sendiri di bagan proses, padahal menentukan
   peserta dibayar atau tidak. */
const DAPEM_LANGKAH_YAR = [
  { urut:1, nama:"Aktifkan mode pemeliharaan",             ket:"Mencegah transaksi lain masuk saat data dipindahkan ke tabel pembayaran" },
  { urut:2, nama:"Unggah data dapem ke tabel pembayaran",  ket:"Beserta proses potong hutang dapem" },
  { urut:3, nama:"Tetapkan kode otentikasi",               ket:"Dijamin / bayar langsung / blokir sampai peserta melakukan otentikasi" },
  { urut:4, nama:"Nonaktifkan mode pemeliharaan",          ket:"Dikembalikan setelah seluruh proses selesai" }
];

/* ===========================================================================
   26. DATA DAPEM — seluruh baris dapem yang sudah terbentuk
   Satu baris = satu nomor pensiun pada satu bulan bayar. Di proses manual
   daftar ini hanya bisa dilihat dengan menarik tabel langsung dari basis data.
   Jumlah bruto, pembulatan, dan netto TIDAK disimpan: dihitung ulang di app.js
   memakai rumus yang sama dengan dapem, supaya angkanya tidak mungkin
   bertentangan satu sama lain.
     JML_BRUTO  = pokok + istri + anak + beras + lain + PEMBULATAN
     JML_NETTO  = JML_BRUTO - JML_POTONG   (kelipatan 100)
   =========================================================================== */
const DAPEM_DATA = [
  { periode:"202607", jenis:"Induk", nopens:"198411000", nama:"SUPARMAN", jiwa:"1000", nik:"3174****0100", mak:"51311",
    bank:"BRI KC Solo", cab:"1201", norek:"0177****5502", pokok:1736400, istri:173640, anak:86820, beras:289680, lain:52092,
    pot:57163, bulat:31, oten:"00" },
  { periode:"202607", jenis:"Induk", nopens:"198511007", nama:"TUTI HERAWATI", jiwa:"1000", nik:"3175****0103", mak:"51311",
    bank:"POS Yogyakarta", cab:"1401", norek:"AAG****1704", pokok:1744600, istri:174460, anak:0, beras:289680, lain:52338,
    pot:55218, bulat:40, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"198601014", nama:"UMAR BAKRI", jiwa:"1000", nik:"3176****0106", mak:"51311",
    bank:"BSI KC Medan", cab:"2200", norek:"0002****4929", pokok:1752700, istri:175270, anak:0, beras:289680, lain:52581,
    pot:55441, bulat:10, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"198711021", nama:"ANANDA PRATAMA", jiwa:"0100", nik:"3177****0109", mak:"51312",
    bank:"Mantap KC Tasikmalaya", cab:"1300", norek:"2006****8890", pokok:1760800, istri:0, anak:0, beras:144840, lain:52824,
    pot:47641, bulat:77, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"198821028", nama:"KARTIKA SARI", jiwa:"0100", nik:"3178****0112", mak:"51313",
    bank:"SMBC KCP Wonosari", cab:"1401", norek:"0187****1704", pokok:1768900, istri:0, anak:0, beras:144840, lain:53067,
    pot:47843, bulat:36, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"198911035", nama:"HADI SUSANTO", jiwa:"0001", nik:"3179****0115", mak:"51322",
    bank:"BRI KC Trenggalek", cab:"1502", norek:"0177****9021", pokok:620800, istri:0, anak:0, beras:144840, lain:922774,
    pot:19141, bulat:27, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"199011042", nama:"AGUS SALIM", jiwa:"0002", nik:"3180****0118", mak:"51321",
    bank:"KPRK Ujungberung", cab:"1300", norek:"0000****6756", pokok:620900, istri:0, anak:0, beras:144840, lain:1298627,
    pot:19143, bulat:76, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"199111049", nama:"RASYID HALIM", jiwa:"0102", nik:"3181****0121", mak:"51311",
    bank:"BRI KC Banjar", cab:"1300", norek:"0162****9503", pokok:1793300, istri:0, anak:0, beras:289680, lain:53799,
    pot:52074, bulat:95, oten:"00" },
  { periode:"202607", jenis:"Induk", nopens:"199201056", nama:"SITI AMINAH", jiwa:"1000", nik:"3182****0124", mak:"51311",
    bank:"Mantap KCP Jakarta ASABRI", cab:"2000", norek:"2003****4135", pokok:1801400, istri:180140, anak:0, beras:289680, lain:54042,
    pot:56780, bulat:18, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"199311063", nama:"BUDIONO", jiwa:"1000", nik:"3183****0127", mak:"51311",
    bank:"BRI KK ASABRI Jakarta", cab:"2000", norek:"1448****0502", pokok:1809500, istri:180950, anak:90475, beras:289680, lain:54285,
    pot:59265, bulat:75, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"199421070", nama:"EKO PRASETYO", jiwa:"1000", nik:"3184****0130", mak:"51312",
    bank:"BRI KC Solo", cab:"1201", norek:"0177****5502", pokok:1817600, istri:181760, anak:0, beras:289680, lain:54528,
    pot:57226, bulat:58, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"199511077", nama:"CAHYONO", jiwa:"0100", nik:"3185****0133", mak:"51313",
    bank:"POS Yogyakarta", cab:"1401", norek:"AAG****1704", pokok:1825700, istri:0, anak:0, beras:144840, lain:54771,
    pot:49263, bulat:52, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"199611084", nama:"DEWI ANGGRAINI", jiwa:"0100", nik:"3186****0136", mak:"51322",
    bank:"BSI KC Medan", cab:"2200", norek:"0002****4929", pokok:1833800, istri:0, anak:0, beras:144840, lain:959164,
    pot:49466, bulat:62, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"199711091", nama:"FAJAR NUGROHO", jiwa:"0001", nik:"3187****0139", mak:"51321",
    bank:"Mantap KC Tasikmalaya", cab:"1300", norek:"2006****8890", pokok:621900, istri:0, anak:0, beras:144840, lain:1298657,
    pot:19168, bulat:71, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"199801098", nama:"GALIH SAPUTRA", jiwa:"0002", nik:"3188****0142", mak:"51311",
    bank:"SMBC KCP Wonosari", cab:"1401", norek:"0187****1704", pokok:622000, istri:0, anak:0, beras:144840, lain:18660,
    pot:19171, bulat:71, oten:"00" },
  { periode:"202607", jenis:"Induk", nopens:"199911105", nama:"INDRA GUNAWAN", jiwa:"0102", nik:"3189****0145", mak:"51311",
    bank:"BRI KC Trenggalek", cab:"1502", norek:"0177****9021", pokok:1858200, istri:0, anak:0, beras:289680, lain:55746,
    pot:53697, bulat:71, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"200021112", nama:"JOKO PURNOMO", jiwa:"1000", nik:"3190****0148", mak:"51311",
    bank:"KPRK Ujungberung", cab:"1300", norek:"0000****6756", pokok:1866300, istri:186630, anak:0, beras:289680, lain:55989,
    pot:58565, bulat:66, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"200111119", nama:"LUKMAN HAKIM", jiwa:"1000", nik:"3191****0151", mak:"51312",
    bank:"BRI KC Banjar", cab:"1300", norek:"0162****9503", pokok:1874400, istri:187440, anak:0, beras:289680, lain:56232,
    pot:58788, bulat:36, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"200211126", nama:"MARYAM SOLEHA", jiwa:"1000", nik:"3192****0154", mak:"51313",
    bank:"Mantap KCP Jakarta ASABRI", cab:"2000", norek:"2003****4135", pokok:1882500, istri:188250, anak:94125, beras:289680, lain:56475,
    pot:61363, bulat:33, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"200311133", nama:"NOVITA SARI", jiwa:"0100", nik:"3193****0157", mak:"51322",
    bank:"BRI KK ASABRI Jakarta", cab:"2000", norek:"1448****0502", pokok:1890700, istri:0, anak:0, beras:144840, lain:960871,
    pot:50888, bulat:77, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"200401140", nama:"OKTAVIAN HANIF", jiwa:"0100", nik:"3194****0160", mak:"51321",
    bank:"BRI KC Solo", cab:"1201", norek:"0177****5502", pokok:1898800, istri:0, anak:0, beras:144840, lain:1336964,
    pot:51091, bulat:87, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"200511147", nama:"PUTRI HAWI", jiwa:"0001", nik:"3195****0163", mak:"51311",
    bank:"POS Yogyakarta", cab:"1401", norek:"AAG****1704", pokok:623000, istri:0, anak:0, beras:144840, lain:18690,
    pot:19196, bulat:66, oten:"00" },
  { periode:"202607", jenis:"Induk", nopens:"200621154", nama:"QORI ANANDA", jiwa:"0002", nik:"3196****0166", mak:"51311",
    bank:"BSI KC Medan", cab:"2200", norek:"0002****4929", pokok:623100, istri:0, anak:0, beras:144840, lain:18693,
    pot:19198, bulat:65, oten:"31" },
  { periode:"202607", jenis:"Induk", nopens:"200711161", nama:"RAHMA ELSA", jiwa:"0102", nik:"3197****0169", mak:"51311",
    bank:"Mantap KC Tasikmalaya", cab:"1300", norek:"2006****8890", pokok:1923100, istri:0, anak:0, beras:289680, lain:57693,
    pot:55319, bulat:46, oten:"31" },
  { periode:"202606", jenis:"Induk", nopens:"200811168", nama:"SLAMET RIYADI", jiwa:"1000", nik:"3198****0172", mak:"51312",
    bank:"SMBC KCP Wonosari", cab:"1401", norek:"0187****1704", pokok:1931200, istri:193120, anak:96560, beras:289680, lain:57936,
    pot:62764, bulat:68, oten:"31" },
  { periode:"202606", jenis:"Induk", nopens:"200911175", nama:"TRI WAHYUNI", jiwa:"1000", nik:"3199****0175", mak:"51313",
    bank:"BRI KC Trenggalek", cab:"1502", norek:"0177****9021", pokok:1939400, istri:193940, anak:0, beras:289680, lain:58182,
    pot:60575, bulat:73, oten:"31" },
  { periode:"202606", jenis:"Induk", nopens:"198401182", nama:"USMAN EFENDI", jiwa:"1000", nik:"3200****0178", mak:"51322",
    bank:"KPRK Ujungberung", cab:"1300", norek:"0000****6756", pokok:1947500, istri:194750, anak:0, beras:289680, lain:962575,
    pot:60798, bulat:93, oten:"31" },
  { periode:"202606", jenis:"Induk", nopens:"198511189", nama:"VINA MARLINA", jiwa:"0100", nik:"3201****0181", mak:"51321",
    bank:"BRI KC Banjar", cab:"1300", norek:"0162****9503", pokok:1955600, istri:0, anak:0, beras:144840, lain:1338668,
    pot:52511, bulat:3, oten:"31" },
  { periode:"202606", jenis:"Induk", nopens:"198621196", nama:"WAWAN SETIAWAN", jiwa:"0100", nik:"3202****0184", mak:"51311",
    bank:"Mantap KCP Jakarta ASABRI", cab:"2000", norek:"2003****4135", pokok:1963700, istri:0, anak:0, beras:144840, lain:58911,
    pot:52713, bulat:62, oten:"00" },
  { periode:"202606", jenis:"Induk", nopens:"198711203", nama:"YANTI KUSUMA", jiwa:"0001", nik:"3203****0187", mak:"51311",
    bank:"BRI KK ASABRI Jakarta", cab:"2000", norek:"1448****0502", pokok:624100, istri:0, anak:0, beras:144840, lain:18723,
    pot:19223, bulat:60, oten:"31" },
  { periode:"202606", jenis:"Susulan", nopens:"198811210", nama:"ZULKIFLI NUR", jiwa:"0002", nik:"3204****0190", mak:"51311",
    bank:"BRI KC Solo", cab:"1201", norek:"0177****5502", pokok:624200, istri:0, anak:0, beras:144840, lain:18726,
    pot:19226, bulat:60, oten:"31" },
  { periode:"202606", jenis:"Susulan", nopens:"198911217", nama:"ADI SUCIPTO", jiwa:"0102", nik:"3205****0193", mak:"51312",
    bank:"POS Yogyakarta", cab:"1401", norek:"AAG****1704", pokok:1988100, istri:0, anak:0, beras:289680, lain:59643,
    pot:56944, bulat:21, oten:"31" },
  { periode:"202606", jenis:"Susulan", nopens:"199001224", nama:"BAMBANG IRAWAN", jiwa:"1000", nik:"3206****0196", mak:"51313",
    bank:"BSI KC Medan", cab:"2200", norek:"0002****4929", pokok:1996200, istri:199620, anak:0, beras:289680, lain:59886,
    pot:62137, bulat:51, oten:"31" },
  { periode:"202606", jenis:"Susulan", nopens:"199111231", nama:"CHANDRA WIJAYA", jiwa:"1000", nik:"3207****0199", mak:"51322",
    bank:"Mantap KC Tasikmalaya", cab:"1300", norek:"2006****8890", pokok:2004300, istri:200430, anak:100215, beras:289680, lain:964279,
    pot:64865, bulat:61, oten:"31" },
  { periode:"202605", jenis:"Induk", nopens:"199221238", nama:"DIAN PERTIWI", jiwa:"1000", nik:"3208****0202", mak:"51321",
    bank:"SMBC KCP Wonosari", cab:"1401", norek:"0187****1704", pokok:2012400, istri:201240, anak:0, beras:289680, lain:1340372,
    pot:62583, bulat:91, oten:"31" },
  { periode:"202605", jenis:"Induk", nopens:"199311245", nama:"ENDANG SRI", jiwa:"0100", nik:"3209****0205", mak:"51311",
    bank:"BRI KC Trenggalek", cab:"1502", norek:"0177****9021", pokok:2020500, istri:0, anak:0, beras:144840, lain:60615,
    pot:54133, bulat:78, oten:"00" },
  { periode:"202605", jenis:"Induk", nopens:"199411252", nama:"FIRMAN SYAH", jiwa:"0100", nik:"3210****0208", mak:"51311",
    bank:"KPRK Ujungberung", cab:"1300", norek:"0000****6756", pokok:2028700, istri:0, anak:0, beras:144840, lain:60861,
    pot:54338, bulat:37, oten:"31" },
  { periode:"202605", jenis:"Induk", nopens:"199511259", nama:"GUNAWAN HADI", jiwa:"0001", nik:"3211****0211", mak:"51311",
    bank:"BRI KC Banjar", cab:"1300", norek:"0162****9503", pokok:625200, istri:0, anak:0, beras:144840, lain:18756,
    pot:19251, bulat:55, oten:"31" }
];

/* ---------------------------------------------------------------------------
   27. DOKUMEN BALIKAN DARI SIPP
   SIPP di luar organisasi: berkas ADK dikirim dan hasil validasinya diterima
   lewat SharePoint Validasi SIPP. Di proses manual berkas-berkas ini hanya
   tersimpan di folder pribadi, tidak terlacak per putaran.
   --------------------------------------------------------------------------- */
const DAPEM_SIPP_JENIS = [
  "Hasil Validasi Master",
  "Hasil Validasi Bayar",
  "Rekap Selisih per MAK",
  "Berita Acara Validasi",
  "Lain-lain"
];

const DAPEM_SIPP_DOK = [
  { putaran:1, jenis:"Hasil Validasi Master", nama:"Hasil_Validasi_Master_202607.xlsx",
    ukuran:"1,8 MB", oleh:"Menda", tgl:"23 Jun 2026 11:20",
    catatan:"Penspok tidak sama pada 8 nopens" },
  { putaran:1, jenis:"Hasil Validasi Bayar", nama:"Hasil_Validasi_Bayar_202607.xlsx",
    ukuran:"2,4 MB", oleh:"Menda", tgl:"23 Jun 2026 11:22",
    catatan:"Sesuai" }
];

/* ---------------------------------------------------------------------------
   28. DATA NON DAPEM — peserta yang masuk pembayaran di luar dapem
   Jenis bayar 10 (pensiun pertama), 11 (kekurangan pensiun), 12 (uang duka).
   Yang disimpan hanya komponennya; TUNJ_LAIN, bruto, potongan, dan netto
   dihitung ulang di app.js dengan rumus yang sama seperti SQL non dapem:
     TUNJ_LAIN  = TUNJ_CACAT + POT_PPH21 + TUNJ_IRJA
     JML_POTONG = potongan lain + POT_PPH21
     JML_BRUTO  = pokok + istri + anak + beras + TUNJ_LAIN + PEMBULATAN
     JML_NETTO  = JML_BRUTO - JML_POTONG   (kelipatan 100)
   Dua baris jenis 12 masih memiliki PPh — itulah temuan N-04 yang bisa
   ditinjau di layar Pembentukan NON DAPEM.
   --------------------------------------------------------------------------- */
const NONDAPEM_JENIS_LABEL = {
  "10": "Pensiun Pertama", "11": "Kekurangan Pensiun", "12": "Uang Duka Wafat"
};

const NONDAPEM_DATA = [
  { nopens:"2006140118", nama:"AGUS SALIM", jenis:"10", nik:"3174****0200", mak:"51312",
    bank:"BRI KC Solo", cab:"1201", norek:"0177****5502", pokok:2664300, istri:266430, anak:133215, beras:289680,
    cacat:0, irja:0, pph:79929, potLain:66607, bulat:82 },
  { nopens:"2007140226", nama:"BUDIONO", jenis:"10", nik:"3175****0205", mak:"51311",
    bank:"POS Yogyakarta", cab:"1401", norek:"AAG****1704", pokok:1892400, istri:0, anak:0, beras:144840,
    cacat:0, irja:0, pph:56772, potLain:47310, bulat:70 },
  { nopens:"2010110447", nama:"VINA MARLINA", jenis:"10", nik:"3176****0210", mak:"51311",
    bank:"BSI KC Medan", cab:"2200", norek:"0002****4929", pokok:2320800, istri:232080, anak:0, beras:289680,
    cacat:0, irja:0, pph:69624, potLain:58020, bulat:60 },
  { nopens:"2011210299", nama:"BAGAS SETIAWAN", jenis:"10", nik:"3177****0215", mak:"51311",
    bank:"Mantap KC Tasikmalaya", cab:"1300", norek:"2006****8890", pokok:1745600, istri:0, anak:0, beras:144840,
    cacat:0, irja:0, pph:52368, potLain:43640, bulat:0 },
  { nopens:"2012110558", nama:"DIMAS ANGGARA", jenis:"10", nik:"3178****0220", mak:"51312",
    bank:"SMBC KCP Wonosari", cab:"1401", norek:"0187****1704", pokok:2088900, istri:208890, anak:104445, beras:289680,
    cacat:0, irja:0, pph:62667, potLain:52222, bulat:7 },
  { nopens:"2013110992", nama:"ERIKA PUTRI", jenis:"10", nik:"3179****0225", mak:"51311",
    bank:"BRI KC Trenggalek", cab:"1502", norek:"0177****9021", pokok:1960400, istri:0, anak:0, beras:144840,
    cacat:0, irja:0, pph:58812, potLain:49010, bulat:70 },
  { nopens:"2014140204", nama:"CITRA DEWANTI", jenis:"10", nik:"3180****0230", mak:"51311",
    bank:"KPRK Ujungberung", cab:"1300", norek:"0000****6756", pokok:2470100, istri:247010, anak:0, beras:289680,
    cacat:0, irja:0, pph:74103, potLain:61752, bulat:62 },
  { nopens:"1995210160", nama:"WAHYU SANTOSO", jenis:"11", nik:"3181****0235", mak:"51311",
    bank:"BRI KC Banjar", cab:"1300", norek:"0162****9503", pokok:986400, istri:98640, anak:0, beras:144840,
    cacat:0, irja:0, pph:29592, potLain:24660, bulat:80 },
  { nopens:"1993110284", nama:"XAVERIUS DONI", jenis:"11", nik:"3182****0240", mak:"51311",
    bank:"Mantap KCP Jakarta ASABRI", cab:"2000", norek:"2003****4135", pokok:2480000, istri:248000, anak:0, beras:289680,
    cacat:0, irja:0, pph:74400, potLain:62000, bulat:20 },
  { nopens:"1998110771", nama:"ZAINAL ABIDIN", jenis:"11", nik:"3183****0245", mak:"51311",
    bank:"BRI KK ASABRI Jakarta", cab:"2000", norek:"1448****0502", pokok:960000, istri:96000, anak:0, beras:144840,
    cacat:0, irja:0, pph:28800, potLain:24000, bulat:60 },
  { nopens:"2001120039", nama:"YULIANA DEWI", jenis:"11", nik:"3184****0250", mak:"51312",
    bank:"BRI KC Solo", cab:"1201", norek:"0177****5502", pokok:3120000, istri:312000, anak:156000, beras:289680,
    cacat:0, irja:0, pph:93600, potLain:78000, bulat:20 },
  { nopens:"1997110357", nama:"HADI SUSANTO", jenis:"11", nik:"3185****0255", mak:"51311",
    bank:"POS Yogyakarta", cab:"1401", norek:"AAG****1704", pokok:2108600, istri:210860, anak:0, beras:289680,
    cacat:904150, irja:0, pph:63258, potLain:52715, bulat:25 },
  { nopens:"1984110044", nama:"RASYID HALIM", jenis:"11", nik:"3186****0260", mak:"51311",
    bank:"BSI KC Medan", cab:"2200", norek:"0002****4929", pokok:3120800, istri:312080, anak:0, beras:289680,
    cacat:0, irja:1280000, pph:93624, potLain:78020, bulat:60 },
  { nopens:"1991140523", nama:"TUTI HERAWATI", jenis:"11", nik:"3187****0265", mak:"51311",
    bank:"Mantap KC Tasikmalaya", cab:"1300", norek:"2006****8890", pokok:1736490, istri:0, anak:0, beras:144840,
    cacat:0, irja:0, pph:52094, potLain:43412, bulat:82 },
  { nopens:"1996140026", nama:"SUPARMAN", jenis:"11", nik:"3188****0270", mak:"51311",
    bank:"SMBC KCP Wonosari", cab:"1401", norek:"0187****1704", pokok:2480700, istri:248070, anak:0, beras:289680,
    cacat:0, irja:0, pph:74421, potLain:62017, bulat:67 },
  { nopens:"1997120884", nama:"SUMIYATI", jenis:"12", nik:"3189****0275", mak:"51411",
    bank:"BRI KC Trenggalek", cab:"1502", norek:"0177****9021", pokok:27911000, istri:0, anak:0, beras:0,
    cacat:0, irja:0, pph:1469000, potLain:0, bulat:0 },
  { nopens:"2001120147", nama:"HERLINA WATI", jenis:"12", nik:"3190****0280", mak:"51411",
    bank:"KPRK Ujungberung", cab:"1300", norek:"0000****6756", pokok:22914000, istri:0, anak:0, beras:0,
    cacat:0, irja:0, pph:1206000, potLain:0, bulat:0 },
  { nopens:"1994110552", nama:"MARYAM SOLEHA", jenis:"12", nik:"3191****0285", mak:"51411",
    bank:"BRI KC Banjar", cab:"1300", norek:"0162****9503", pokok:19240000, istri:0, anak:0, beras:0,
    cacat:0, irja:0, pph:0, potLain:0, bulat:0 },
  { nopens:"1990120012", nama:"SRI WAHYUNI", jenis:"12", nik:"3192****0290", mak:"51411",
    bank:"Mantap KCP Jakarta ASABRI", cab:"2000", norek:"2003****4135", pokok:24680000, istri:0, anak:0, beras:0,
    cacat:0, irja:0, pph:0, potLain:0, bulat:0 },
  { nopens:"2003120884", nama:"DEWI ANGGRAINI", jenis:"12", nik:"3193****0295", mak:"51411",
    bank:"BRI KK ASABRI Jakarta", cab:"2000", norek:"1448****0502", pokok:21450000, istri:0, anak:0, beras:0,
    cacat:0, irja:0, pph:0, potLain:0, bulat:0 }
];

/* ---------------------------------------------------------------------------
   20. PENGELOLAAN ALIH STATUS PESERTA — Data Alih Status per Pengajuan
   Data dikelompokkan per PENGAJUAN supaya sesuai kenyataannya: mekanisme
   Perorangan selalu berisi tepat satu peserta, mekanisme Kolektif berisi
   sebanyak baris yang diunggah lewat template Excel. Tabel di layar menampilkan
   satu baris per PESERTA — app.js meratakan kelompok ini saat halaman dimuat,
   dan tiap baris ikut membawa tanggal pengajuan & tipe pengajuannya.

   Struktur satu pengajuan:
     { tglPengajuan, mekanisme, tipe, peserta:[ …data peserta… ] }
     mekanisme : "Perorangan" | "Kolektif"
     tipe      : "Batal" | "Kembali"

   Data peserta memakai 19 kolom yang sama dengan Template Alih Status
   Kolektif, ditambah:
     kta        — nomor Kartu Tanda Anggota, dipakai pencarian filter "Peserta"
     tglDps     — tanggal DPS; terbit otomatis saat data pertama kali disimpan
     buktiBayar — nama berkas, hanya terisi lewat form Perorangan
   `nrpLama` / `kta` boleh null — di tabel nilainya ditampilkan sebagai "—".
   Semua tanggal disimpan format ISO (yyyy-mm-dd) dan diformat ke dd-mm-yyyy
   oleh asFmtTgl() di app.js.

   Tiga pengajuan pertama (lima peserta, No DPS 000133–000129) adalah contoh
   nyata dari FSD; sisanya dibuat massal lewat buatPengajuanAlihStatus()
   dengan No DPS berlanjut turun sampai 000001 — ubah angka jumlah pesertanya
   kalau mau daftar lebih pendek.
   --------------------------------------------------------------------------- */
const ALIH_STATUS_GOL = [
  "GOL.I/A","GOL.I/B","GOL.I/C","GOL.I/D",
  "GOL.II/A","GOL.II/B","GOL.II/C","GOL.II/D",
  "GOL.III/A","GOL.III/B","GOL.III/C","GOL.III/D",
  "GOL.IV/A","GOL.IV/B","GOL.IV/C","GOL.IV/D","GOL.IV/E"
];

/* Pilihan-pilihan dropdown pada Form Alih Status Peserta. Daftar yang sama
   dipakai generator di bawah supaya data contoh selalu cocok dengan opsinya. */
const ALIH_STATUS_MEKANISME    = ["Perorangan", "Kolektif"];
const ALIH_STATUS_TIPE         = ["Batal", "Kembali"];
const ALIH_STATUS_ANGKATAN     = ["TNI AD", "TNI AL", "TNI AU", "Polri", "PNS Kemhan"];
const ALIH_STATUS_UNOR         = ["Mabes TNI", "Mabes TNI AD", "Mabes TNI AL", "Mabes TNI AU",
                                  "Mabes Polri", "Kementerian Pertahanan"];
const ALIH_STATUS_PERSONIL     = ["Prajurit", "PNS", "Purnawirawan", "Pensiunan"];
const ALIH_STATUS_MENIKAH      = ["Belum Menikah", "Menikah", "Duda", "Janda"];
const ALIH_STATUS_SATKER       = ["KOREM 084/BJ", "KODIM 0827", "KODIM 0830", "LANTAMAL V",
                                  "LANUD ISWAHJUDI", "POLDA JATIM", "SETJEN KEMHAN", "RSPAD GATOT SOEBROTO"];

/* Lookup KPA → data kepesertaan untuk autofill Form Alih Status Peserta
   mekanisme Perorangan (pola yang sama dengan BUM_KPA_LOOKUP). Pesertanya
   diambil dari data induk DATA_PESERTA_KELOLA (KPA = `ktpa`, NRP/NIP, nama,
   tanggal lahir, TMT, pangkat akhir) supaya konsisten dengan layar Data
   Peserta; nilainya sudah diselaraskan dengan pilihan dropdown di form, dan
   UNOR / Status Personil / Status Menikah dilengkapi karena tidak ada di data
   induk. Semua tanggal format ISO (yyyy-mm-dd). */
const ALIH_STATUS_KPA_LOOKUP = {
  "BZ111369": { nrpBaru:"196105061981011001", nama:"SURIPTO",         tglLahir:"1961-05-06", angkatan:"TNI AD",     unor:"Mabes TNI AD",          statusPersonil:"PNS",          gol:"GOL.II/D",  tmtPangkat:"1981-01-01", statusMenikah:"Duda" },
  "AY105460": { nrpBaru:"196807191990031001", nama:"JUWANDI",         tglLahir:"1968-07-19", angkatan:"PNS Kemhan", unor:"Kementerian Pertahanan", statusPersonil:"PNS",          gol:"GOL.III/B", tmtPangkat:"1990-03-01", statusMenikah:"Menikah" },
  "EY101086": { nrpBaru:"196807291992031002", nama:"WARDI",           tglLahir:"1968-07-29", angkatan:"Polri",      unor:"Mabes Polri",           statusPersonil:"PNS",          gol:"GOL.III/A", tmtPangkat:"1992-03-01", statusMenikah:"Menikah" },
  "CB163890": { nrpBaru:"163890",             nama:"MARIA CHRISTINA", tglLahir:"1963-12-05", angkatan:"TNI AL",     unor:"Mabes TNI AL",          statusPersonil:"Purnawirawan", gol:"GOL.III/A", tmtPangkat:"1988-02-01", statusMenikah:"Janda" },
  "AD500667": { nrpBaru:"199003152015031002", nama:"JOKO WIDIYANTO",  tglLahir:"1990-03-15", angkatan:"TNI AD",     unor:"Mabes TNI AD",          statusPersonil:"PNS",          gol:"GOL.III/B", tmtPangkat:"2015-03-01", statusMenikah:"Belum Menikah" },
  "AL600334": { nrpBaru:"198502102010121004", nama:"DEWI ANGGRAINI",  tglLahir:"1985-02-10", angkatan:"TNI AL",     unor:"Mabes TNI AL",          statusPersonil:"PNS",          gol:"GOL.III/A", tmtPangkat:"2010-12-01", statusMenikah:"Menikah" }
};

const ALIH_STATUS_NAMA_DEPAN = [
  "SUPRIYADI","ENDANG","HARTONO","SRI WAHYUNI","AGUS SALIM","NURHAYATI","JOKO SUSILO",
  "RETNO PALUPI","DIDIK PURNOMO","LILIS SURYANI","BAMBANG IRAWAN","TITIK HANDAYANI",
  "SUGENG RIYADI","MARYATI","HERI SETIAWAN","DWI ASTUTI","SLAMET RIYANTO","SITI AMINAH",
  "PURWANTO","YULI KRISTANTI","IMAM SYAFI'I","ERNAWATI","MUJIONO","RATNA JUWITA",
  "DARMAWAN","SUPARMI","WAHYU HIDAYAT","INDRAWATI","SUTRISNO","KARTINI"
];

const asPutar = (arr, n) => arr[n % arr.length];
const asTgl   = (thn, m, d) => `${thn}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/* `n` sekaligus jadi No DPS peserta, jadi harus unik — itu yang menjamin
   NRP, KTA, dan nomor-nomor lain hasil generator juga tidak pernah kembar. */
function buatPesertaAlihStatus(n) {
  const thnLahir  = 1962 + (n % 22);
  const thnCpns   = thnLahir + 22 + (n % 5);
  const thnPindah = 1999 + (n % 22);
  return {
    nrpBaru:  `${thnLahir}${String((n % 12) + 1).padStart(2, "0")}${String((n % 28) + 1).padStart(2, "0")}${thnCpns}${String((n % 12) + 1).padStart(2, "0")}${n % 2 === 0 ? "1" : "2"}${String((n % 900) + 1).padStart(3, "0")}`,
    nrpLama:  n % 3 === 0 ? `${8600000 + n * 7}` : null,
    kta:      `${asPutar(["CD","CE","CC","CY"], n)}${String(300000 + n * 37).padStart(6, "0")}`,
    nama:     asPutar(ALIH_STATUS_NAMA_DEPAN, n),
    tglLahir: asTgl(thnLahir, (n % 12) + 1, (n % 28) + 1),
    angkatan: asPutar(ALIH_STATUS_ANGKATAN, n),
    unor:     asPutar(ALIH_STATUS_UNOR, n),
    statusPersonil: asPutar(ALIH_STATUS_PERSONIL, n),
    gol:      asPutar(ALIH_STATUS_GOL, n),
    tmtPangkat: asTgl(thnCpns + (n % 12), (n % 12) + 1, 1),
    gajiPokok:  3200000 + (n % 40) * 125000,
    statusMenikah: asPutar(ALIH_STATUS_MENIKAH, n),
    satkerLama: asPutar(ALIH_STATUS_SATKER, n),
    satkerBaru: asPutar(ALIH_STATUS_SATKER, n + 3),
    tglPindah:  asTgl(thnPindah, (n % 11) + 1, (n % 26) + 2),
    noSkep:     `SKEP/${1200 + n}/${asPutar(["III","VI","IX","XII"], n)}/${thnPindah}`,
    tglSkep:    asTgl(thnPindah, (n % 11) + 1, (n % 25) + 1),
    jumlahDiizinkan: 1 + (n % 4),
    tglBayar:   asTgl(Math.min(thnPindah + 1 + (n % 6), 2025), (n % 12) + 1, (n % 26) + 2),
    noDps:      String(n).padStart(6, "0"),
    tglDps:     asTgl(Math.min(thnPindah + 1 + (n % 6), 2025), (n % 12) + 1, (n % 27) + 1),
    buktiBayar: null
  };
}

/* Membuat pengajuan sampai jatah `jumlahPeserta` habis. No DPS diambil dari
   jatah yang tersisa sehingga turun berurutan (…, 000002, 000001), dan tanggal
   pengajuan mundur dua hari per pengajuan dari tanggal terbaru. */
function buatPengajuanAlihStatus(jumlahPeserta) {
  const terbaru = new Date(2026, 7, 24);   /* 24 Agustus 2026 */
  const baris = [];
  let sisa = jumlahPeserta;
  for (let i = 0; sisa > 0; i++) {
    const n = i + 1;
    const kolektif = n % 3 === 0;
    const banyak = Math.min(sisa, kolektif ? 3 + (n % 9) : 1);
    const tgl = new Date(terbaru);
    tgl.setDate(terbaru.getDate() - i * 2);
    baris.push({
      tglPengajuan: asTgl(tgl.getFullYear(), tgl.getMonth() + 1, tgl.getDate()),
      mekanisme:    kolektif ? "Kolektif" : "Perorangan",
      tipe:         asPutar(ALIH_STATUS_TIPE, n),
      peserta:      Array.from({ length: banyak }, () => buatPesertaAlihStatus(sisa--))
    });
  }
  return baris;
}

const DATA_ALIH_STATUS_PENGAJUAN = [
  { tglPengajuan:"2026-08-27", mekanisme:"Perorangan", tipe:"Kembali",
    peserta:[
      { nrpBaru:"196805091987031001", nrpLama:null, kta:"CD317133", nama:"MULYONO", tglLahir:"1968-05-09",
        angkatan:"PNS Kemhan", unor:"Kementerian Pertahanan", statusPersonil:"PNS", gol:"GOL.III/C",
        tmtPangkat:"2011-04-01", gajiPokok:4350000, statusMenikah:"Menikah",
        satkerLama:"KODIM 0827", satkerBaru:"KOREM 084/BJ", tglPindah:"2000-05-31",
        noSkep:"SKEP/1187/V/2000", tglSkep:"2000-05-02", jumlahDiizinkan:1,
        tglBayar:"2013-02-11", noDps:"000133", tglDps:"2013-01-08", buktiBayar:"bukti-bayar-000133.pdf" }
    ] },

  { tglPengajuan:"2026-08-26", mekanisme:"Kolektif", tipe:"Kembali",
    peserta:[
      { nrpBaru:"196804081991032001", nrpLama:null, kta:"CE360132", nama:"ASIH SURANI", tglLahir:"1968-04-08",
        angkatan:"PNS Kemhan", unor:"Kementerian Pertahanan", statusPersonil:"PNS", gol:"GOL.IV/A",
        tmtPangkat:"2002-04-01", gajiPokok:4875000, statusMenikah:"Menikah",
        satkerLama:"LANTAMAL V", satkerBaru:"KOREM 084/BJ", tglPindah:"2000-05-31",
        noSkep:"SKEP/1188/V/2000", tglSkep:"2000-05-02", jumlahDiizinkan:2,
        tglBayar:"2002-10-14", noDps:"000132", tglDps:"2002-09-26", buktiBayar:null },
      { nrpBaru:"196804181994031004", nrpLama:null, kta:"CC306131", nama:"SAMIN", tglLahir:"1968-04-18",
        angkatan:"TNI AD", unor:"Mabes TNI AD", statusPersonil:"Prajurit", gol:"GOL.III/C",
        tmtPangkat:"2018-10-01", gajiPokok:4120000, statusMenikah:"Menikah",
        satkerLama:"KODIM 0830", satkerBaru:"KOREM 084/BJ", tglPindah:"2000-05-31",
        noSkep:"SKEP/1189/V/2000", tglSkep:"2000-05-02", jumlahDiizinkan:1,
        tglBayar:"2022-10-05", noDps:"000131", tglDps:"2022-09-13", buktiBayar:null },
      { nrpBaru:"196630519920132003", nrpLama:null, kta:"CY104130", nama:"DRG. RIA BRILLIANTARI", tglLahir:"1966-03-05",
        angkatan:"PNS Kemhan", unor:"Kementerian Pertahanan", statusPersonil:"PNS", gol:"GOL.IV/D",
        tmtPangkat:"2007-04-01", gajiPokok:5460000, statusMenikah:"Menikah",
        satkerLama:"RSPAD GATOT SOEBROTO", satkerBaru:"KOREM 084/BJ", tglPindah:"2006-06-30",
        noSkep:"SKEP/1190/VI/2006", tglSkep:"2006-06-05", jumlahDiizinkan:3,
        tglBayar:"2007-12-03", noDps:"000130", tglDps:"2007-11-08", buktiBayar:null }
    ] },

  { tglPengajuan:"2026-08-25", mekanisme:"Perorangan", tipe:"Kembali",
    peserta:[
      { nrpBaru:"197001121990031002", nrpLama:"8801120", kta:"CD319129", nama:"BAMBANG SUTRISNO", tglLahir:"1970-01-12",
        angkatan:"Polri", unor:"Mabes Polri", statusPersonil:"Prajurit", gol:"GOL.III/B",
        tmtPangkat:"2016-10-01", gajiPokok:3980000, statusMenikah:"Duda",
        satkerLama:"POLDA JATIM", satkerBaru:"KOREM 084/BJ", tglPindah:"2005-04-01",
        noSkep:"SKEP/1191/III/2005", tglSkep:"2005-03-14", jumlahDiizinkan:2,
        tglBayar:"2018-04-02", noDps:"000129", tglDps:"2018-03-15", buktiBayar:"bukti-bayar-000129.pdf" }
    ] },

  ...buatPengajuanAlihStatus(128)
];

/* ---------------------------------------------------------------------------
   21. ALIH STATUS PESERTA — UNGGAH BERKAS KOLEKTIF
   Isi berkas contoh yang "terbaca" ketika mekanisme Kolektif dipilih, dipakai
   untuk mensimulasikan langkah Validasi dan Submit. Bentuknya sengaja sama
   dengan DATA_PEREMAJAAN supaya tabel hasil validasi bisa memakai pola render
   yang sama.
   status: "valid" | "tanpa-perubahan" | "ditolak" (yang ditolak wajib `alasan`)
   --------------------------------------------------------------------------- */
const DATA_ALIH_STATUS_KOLEKTIF = {
  templateNama: "Template Alih Status Kolektif",
  templateFile: "Template Alih Status Kolektif.xlsx",
  namaBerkas:   "alih_status_kolektif_koreem084.xlsx",
  kolomError:   ["NRP/NIP Baru", "Nama Peserta", "Satker Baru", "Tanggal Pindah"],
  rows: [
    { nilai:["196805091987031001", "MULYONO",              "KOREM 084/BJ", "2000-05-31"], status:"valid" },
    { nilai:["196804081991032001", "ASIH SURANI",          "KOREM 084/BJ", "2000-05-31"], status:"valid" },
    { nilai:["197001121990031002", "BAMBANG SUTRISNO",     "KOREM 084/BJ", "2005-04-01"], status:"valid" },
    { nilai:["196804181994031004", "SAMIN",                "KODIM 0827",   "2000-05-31"], status:"valid" },
    { nilai:["196630519920132003", "DRG. RIA BRILLIANTARI","KOREM 084/BJ", "2006-06-30"], status:"tanpa-perubahan" },
    { nilai:["198711052010121004", "HERI SETIAWAN",        "LANUD ISWAHJUDI", "2026-13-02"],
      status:"ditolak", alasan:["Tanggal Pindah bukan tanggal yang sah"] },
    { nilai:["XD222424",           "NAMA TIDAK DIKENAL",   "-",            "2024-02-01"],
      status:"ditolak", alasan:["NRP/NIP Baru tidak ditemukan di data peserta", "Satker Baru wajib diisi"] }
  ]
};

/* ---------------------------------------------------------------------------
   22. PENGELOLAAN DATA PESERTA — daftar induk peserta untuk pencarian
   Dipakai layar "Data Peserta". Semua kolom yang bisa dipilih di
   dropdown "Tipe Pencarian" tersimpan di setiap baris, walau tidak semuanya
   ditampilkan di tabel hasil (sebagian hanya muncul di modal Detail).
   Tanggal disimpan sebagai teks "dd-mm-yyyy" supaya bisa langsung ditampilkan;
   pembanding bertipe TANGGAL di app.js yang mengubahnya jadi urutan sortir.
   Kolom kosong ditulis "-" supaya tabel tidak pernah menampilkan sel hampa.
   --------------------------------------------------------------------------- */
const DATA_PESERTA_KELOLA = [
  { migrasiId:"MG-0000114069", nrp:"196105061981011001", nopens:"BZ131770111046", ktpa:"BZ111369", nama:"SURIPTO",
    tempatLahir:"MAGELANG", tglLahir:"06-05-1961", tmt:"01-01-1981",
    noSkep:"SKEP/613/II/V/1981", tglSkep:"01-01-1981", noSkepPensiun:"KEP/331/V/2019", tglSkepPensiun:"01-06-2019",
    pangkatAwal:"GOL.I/B", pangkatAkhir:"GOL.II/D", kesatuan:"ZIDAM IV/DIP", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000027118", nrp:"271807", nopens:"-", ktpa:"BC147967", nama:"SOETARTO",
    tempatLahir:"SEMARANG", tglLahir:"16-10-1927", tmt:"01-01-1969",
    noSkep:"-", tglSkep:"01-01-1969", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"LETDA", pangkatAkhir:"KAPTEN", kesatuan:"KOREM 074/WT", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"-", statusValid:"Tidak Valid" },
  { migrasiId:"MG-0000105460", nrp:"196807191990031001", nopens:"AY105460111121", ktpa:"AY105460", nama:"JUWANDI",
    tempatLahir:"KEBUMEN", tglLahir:"19-07-1968", tmt:"01-03-1990",
    noSkep:"-", tglSkep:"01-03-1990", noSkepPensiun:"KEP/1180/VII/2026", tglSkepPensiun:"01-08-2026",
    pangkatAwal:"GOL.II/A", pangkatAkhir:"GOL.III/B", kesatuan:"DITJEN STRAHAN KEMHAN", angkatan:"KEMHAN",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"Asabri - Taspen (Keluar)", statusValid:"Valid" },
  { migrasiId:"MG-0000101086", nrp:"196807291992031002", nopens:"EY101086111002", ktpa:"EY101086", nama:"WARDI",
    tempatLahir:"PURWOKERTO", tglLahir:"29-07-1968", tmt:"01-03-1992",
    noSkep:"-", tglSkep:"01-03-1992", noSkepPensiun:"KEP/0904/VI/2026", tglSkepPensiun:"01-08-2026",
    pangkatAwal:"GOL.II/A", pangkatAkhir:"GOL.III/A", kesatuan:"RUMKIT BHAYANGKARA PUSAT PUSDOKKES POLRI", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000010741", nrp:"10741", nopens:"-", ktpa:"BB146468", nama:"SOERJO SOELARTO",
    tempatLahir:"SURAKARTA", tglLahir:"16-01-1924", tmt:"01-01-1967",
    noSkep:"-", tglSkep:"01-01-1967", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"LETDA", pangkatAkhir:"MAYOR", kesatuan:"SKODAM VII/DIP", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"MENINGGAL AKTIF", alihStatus:"-", statusValid:"Tidak Valid" },
  { migrasiId:"MG-0000001073", nrp:"198411012025212012", nopens:"-", ktpa:"EP001073", nama:"ASTUTI",
    tempatLahir:"PALANGKARAYA", tglLahir:"01-11-1984", tmt:"01-10-2025",
    noSkep:"KEP/1453/IX/2025", tglSkep:"25-09-2025", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"GOL.V", pangkatAkhir:"GOL.V", kesatuan:"POLRES PALANGKARAYA", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"Taspen - Asabri (Masuk)", statusValid:"Valid" },
  { migrasiId:"MG-0000000737", nrp:"197801042025211005", nopens:"-", ktpa:"EP000737", nama:"HERMAN",
    tempatLahir:"KUALA KAPUAS", tglLahir:"04-01-1978", tmt:"01-10-2025",
    noSkep:"KEP/1453/IX/2025", tglSkep:"25-09-2025", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"GOL.V", pangkatAkhir:"GOL.V", kesatuan:"POLRES KAPUAS", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"Taspen - Asabri (Masuk)", statusValid:"Valid" },
  { migrasiId:"MG-0000000614", nrp:"198510052025212013", nopens:"-", ktpa:"EP000614", nama:"HIPDAWATI",
    tempatLahir:"KUALA KAPUAS", tglLahir:"05-10-1985", tmt:"01-10-2025",
    noSkep:"KEP/1453/IX/2025", tglSkep:"25-09-2025", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"GOL.V", pangkatAkhir:"GOL.V", kesatuan:"POLRES KAPUAS", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"Taspen - Asabri (Masuk)", statusValid:"Valid" },
  { migrasiId:"MG-0000001300", nrp:"198409302025211006", nopens:"-", ktpa:"EP001300", nama:"SUJARTO",
    tempatLahir:"BANJARMASIN", tglLahir:"30-09-1984", tmt:"01-10-2025",
    noSkep:"KEP/1453/IX/2025", tglSkep:"25-09-2025", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"GOL.V", pangkatAkhir:"GOL.V", kesatuan:"POLRES KAPUAS", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"Taspen - Asabri (Masuk)", statusValid:"Valid" },
  { migrasiId:"MG-0000001247", nrp:"198010252025211003", nopens:"-", ktpa:"EP001247", nama:"YONO",
    tempatLahir:"KUALA KAPUAS", tglLahir:"25-10-1980", tmt:"01-10-2025",
    noSkep:"KEP/1453/IX/2025", tglSkep:"25-09-2025", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"GOL.V", pangkatAkhir:"GOL.V", kesatuan:"POLRES KAPUAS", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"Taspen - Asabri (Masuk)", statusValid:"Valid" },

  { migrasiId:"MG-0000131772", nrp:"196805091987031001", nopens:"BZ131772111048", ktpa:"BZ111371", nama:"MULYONO",
    tempatLahir:"MADIUN", tglLahir:"09-05-1968", tmt:"01-03-1987",
    noSkep:"SKEP/1191/III/2005", tglSkep:"14-03-2005", noSkepPensiun:"KEP/0771/IV/2026", tglSkepPensiun:"01-06-2026",
    pangkatAwal:"PRADA", pangkatAkhir:"SERKA", kesatuan:"KOREM 084/BJ", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000131804", nrp:"196804081991032001", nopens:"BZ131804111070", ktpa:"BZ111403", nama:"ASIH SURANI",
    tempatLahir:"SURABAYA", tglLahir:"08-04-1968", tmt:"01-03-1991",
    noSkep:"SKEP/0844/II/2004", tglSkep:"11-02-2004", noSkepPensiun:"KEP/0712/IV/2026", tglSkepPensiun:"01-05-2026",
    pangkatAwal:"GOL.II/A", pangkatAkhir:"GOL.III/C", kesatuan:"KOREM 084/BJ", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"Asabri - Taspen (Keluar)", statusValid:"Valid" },
  { migrasiId:"MG-0000142983", nrp:"197001121990031002", nopens:"CY142983111206", ktpa:"CY142983", nama:"BAMBANG SUTRISNO",
    tempatLahir:"MALANG", tglLahir:"12-01-1970", tmt:"01-03-1990",
    noSkep:"SKEP/0918/III/2006", tglSkep:"22-03-2006", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"PRADA", pangkatAkhir:"PELTU", kesatuan:"KODIM 0827 SUMENEP", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000156234", nrp:"156234", nopens:"-", ktpa:"AU700445", nama:"RUDI HARTONO",
    tempatLahir:"JAKARTA", tglLahir:"17-08-1987", tmt:"01-04-2009",
    noSkep:"KEP/0442/III/2009", tglSkep:"18-03-2009", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"PRADA", pangkatAkhir:"SERMA", kesatuan:"LANUD HALIM PERDANAKUSUMA", angkatan:"TNI-AU",
    vip:"YA", statusPeserta:"AKTIF", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000163890", nrp:"163890", nopens:"CB163890111318", ktpa:"CB163890", nama:"MARIA CHRISTINA",
    tempatLahir:"BANYUWANGI", tglLahir:"05-12-1963", tmt:"01-02-1988",
    noSkep:"SKEP/0233/I/2001", tglSkep:"29-01-2001", noSkepPensiun:"KEP/0155/I/2019", tglSkepPensiun:"01-03-2019",
    pangkatAwal:"GOL.II/A", pangkatAkhir:"GOL.III/A", kesatuan:"LANAL BANYUWANGI", angkatan:"TNI-AL",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000178432", nrp:"178432", nopens:"-", ktpa:"TA910123", nama:"SLAMET RIYADI",
    tempatLahir:"CIMAHI", tglLahir:"10-11-1986", tmt:"01-05-2014",
    noSkep:"KEP/0781/IV/2014", tglSkep:"20-04-2014", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"PRADA", pangkatAkhir:"SERTU", kesatuan:"KODIM 0609 CIMAHI", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"DESERSI", alihStatus:"-", statusValid:"Tidak Valid" },
  { migrasiId:"MG-0000185673", nrp:"185673", nopens:"-", ktpa:"LA930345", nama:"HENDRA GUNAWAN",
    tempatLahir:"BATAM", tglLahir:"02-07-1988", tmt:"01-06-2017",
    noSkep:"KEP/1102/V/2017", tglSkep:"26-05-2017", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"PRADA", pangkatAkhir:"KOPKA", kesatuan:"LANAL BATAM", angkatan:"TNI-AL",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000192784", nrp:"192784", nopens:"-", ktpa:"UA950567", nama:"YAYAN KUSUMA",
    tempatLahir:"MADIUN", tglLahir:"28-03-1989", tmt:"01-07-2019",
    noSkep:"KEP/1533/VI/2019", tglSkep:"14-06-2019", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"PRADA", pangkatAkhir:"SERDA", kesatuan:"LANUD ISWAHJUDI", angkatan:"TNI-AU",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000114621", nrp:"14621/P", nopens:"AC114621110982", ktpa:"CC306323", nama:"HERIYANTO, S.KM",
    tempatLahir:"BOGOR", tglLahir:"25-05-1958", tmt:"01-01-1979",
    noSkep:"SKEP/0107/I/1998", tglSkep:"08-01-1998", noSkepPensiun:"KEP/0421/II/2014", tglSkepPensiun:"01-06-2014",
    pangkatAwal:"BRIPDA", pangkatAkhir:"AIPTU", kesatuan:"POLRES BOGOR", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000088056", nrp:"88056789", nopens:"CP088056111442", ktpa:"PA970789", nama:"FAJAR NUGROHO",
    tempatLahir:"MALANG", tglLahir:"01-09-1966", tmt:"01-04-1996",
    noSkep:"SKEP/0655/III/2003", tglSkep:"17-03-2003", noSkepPensiun:"KEP/0980/V/2022", tglSkepPensiun:"01-10-2022",
    pangkatAwal:"BRIPDA", pangkatAkhir:"BRIPKA", kesatuan:"POLDA JAWA TIMUR", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"PENSIUN", alihStatus:"Asabri - Taspen (Keluar)", statusValid:"Valid" },
  { migrasiId:"MG-0000092078", nrp:"92078901", nopens:"-", ktpa:"PC990901", nama:"WAHYU SAPUTRO",
    tempatLahir:"YOGYAKARTA", tglLahir:"12-03-1992", tmt:"01-08-2022",
    noSkep:"KEP/1877/VII/2022", tglSkep:"21-07-2022", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"BRIPDA", pangkatAkhir:"BRIPTU", kesatuan:"POLDA DI YOGYAKARTA", angkatan:"POLRI",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000165789", nrp:"165789", nopens:"-", ktpa:"TC911012", nama:"INDRA PERMANA",
    tempatLahir:"SURAKARTA", tglLahir:"24-07-1994", tmt:"01-09-2023",
    noSkep:"KEP/2041/VIII/2023", tglSkep:"30-08-2023", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"PRADA", pangkatAkhir:"PRATU", kesatuan:"KODIM 0735 SURAKARTA", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000199003", nrp:"199003152015031002", nopens:"-", ktpa:"AD500667", nama:"JOKO WIDIYANTO",
    tempatLahir:"SUMEDANG", tglLahir:"15-03-1990", tmt:"01-03-2015",
    noSkep:"KEP/0512/II/2015", tglSkep:"27-02-2015", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"GOL.III/A", pangkatAkhir:"GOL.III/B", kesatuan:"KODIM 0610 SUMEDANG", angkatan:"TNI-AD",
    vip:"TIDAK", statusPeserta:"AKTIF", alihStatus:"-", statusValid:"Valid" },
  { migrasiId:"MG-0000198502", nrp:"198502102010121004", nopens:"-", ktpa:"AL600334", nama:"DEWI ANGGRAINI",
    tempatLahir:"SURABAYA", tglLahir:"10-02-1985", tmt:"01-12-2010",
    noSkep:"KEP/2233/XI/2010", tglSkep:"19-11-2010", noSkepPensiun:"-", tglSkepPensiun:"-",
    pangkatAwal:"GOL.II/C", pangkatAkhir:"GOL.III/A", kesatuan:"LANAL SURABAYA", angkatan:"TNI-AL",
    vip:"YA", statusPeserta:"AKTIF", alihStatus:"-", statusValid:"Valid" }
];

/* Isi dropdown "Tipe Pencarian". `key` = nama field di DATA_PESERTA_KELOLA. */
const PESERTA_KELOLA_TIPE_CARI = [
  { key:"nama",           label:"NAMA" },
  { key:"migrasiId",      label:"MIGRASI ID" },
  { key:"nrp",            label:"NRP" },
  { key:"nopens",         label:"NOPENS" },
  { key:"ktpa",           label:"KTPA" },
  { key:"angkatan",       label:"ANGKATAN" },
  { key:"tglSkep",        label:"TANGGAL SKEP PENGANGKATAN" },
  { key:"noSkep",         label:"NOMOR SKEP PENGANGKATAN" },
  { key:"tglSkepPensiun", label:"TANGGAL SKEP PENSIUN" },
  { key:"noSkepPensiun",  label:"NOMOR SKEP PENSIUN" },
  { key:"tempatLahir",    label:"TEMPAT LAHIR" },
  { key:"tglLahir",       label:"TANGGAL LAHIR" },
  { key:"pangkatAwal",    label:"PANGKAT AWAL" },
  { key:"pangkatAkhir",   label:"PANGKAT AKHIR" },
  { key:"kesatuan",       label:"KESATUAN" },
  { key:"tmt",            label:"TMT PENGANGKATAN" },
  { key:"vip",            label:"VIP" }
];

/* Isi dropdown "Tipe" — operator pembanding tiap baris kriteria.
   `op` menentukan cara membandingkan, `tanggal:true` berarti kedua sisi
   dibaca sebagai tanggal "dd-mm-yyyy" lebih dulu, bukan sebagai teks. */
const PESERTA_KELOLA_OPERATOR = [
  { op:"serupa", label:"SERUPA" },
  { op:"eq",     label:"SAMA DENGAN" },
  { op:"eq",     label:"SAMA DENGAN TANGGAL",             tanggal:true },
  { op:"gt",     label:"LEBIH BESAR DARI" },
  { op:"lt",     label:"LEBIH KECIL DARI" },
  { op:"gte",    label:"LEBIH BESAR SAMA DENGAN" },
  { op:"lte",    label:"LEBIH KECIL SAMA DENGAN" },
  { op:"gt",     label:"LEBIH BESAR DARI TANGGAL",        tanggal:true },
  { op:"lt",     label:"LEBIH KECIL DARI TANGGAL",        tanggal:true },
  { op:"gte",    label:"LEBIH BESAR SAMA DENGAN TANGGAL", tanggal:true },
  { op:"lte",    label:"LEBIH KECIL SAMA DENGAN TANGGAL", tanggal:true }
];

const PESERTA_KELOLA_ALIH_STATUS = ["Semua", "Asabri - Taspen (Keluar)", "Taspen - Asabri (Masuk)"];
const PESERTA_KELOLA_STATUS      = ["SEMUA DATA", "AKTIF", "PENSIUN", "DESERSI", "MENINGGAL AKTIF"];
const PESERTA_KELOLA_VALID       = ["semua", "Valid", "Tidak Valid"];

/* ---------------------------------------------------------------------------
   22b. PENGELOLAAN DATA PESERTA — rincian tab "Profil" di layar Detail Peserta
   Enam section di tab Profil butuh ~40 kolom tambahan per peserta. Daripada
   menuliskannya satu per satu di 24 baris DATA_PESERTA_KELOLA, rinciannya
   dibangkitkan berurutan dari indeks baris — pola yang sama dengan
   buatAlihStatus() di blok 20. Tidak memakai Math.random supaya isinya persis
   sama setiap prototipe dibuka, dan tetap konsisten dengan kolom yang sudah
   ada di baris induknya (tanggal lahir, TMT, skep, status peserta).
   Hasilnya menempel sebagai `p.profil` supaya kolom tabel hasil pencarian
   tidak tercampur dengan kolom yang hanya dipakai di layar detail.
   --------------------------------------------------------------------------- */

/* Dipakai hanya untuk menentukan Jenis Kelamin — didaftar eksplisit karena
   menebaknya dari nama tidak pernah bisa diandalkan. */
const PROFIL_PEREMPUAN = ["ASTUTI", "HIPDAWATI", "ASIH SURANI", "MARIA CHRISTINA", "DEWI ANGGRAINI"];

/* kode = 6 digit awal NIK (kode provinsi/kota/kecamatan). */
const PROFIL_WILAYAH = [
  { kode:"330871", desa:"POTRORONO",   kecamatan:"BANYUURIP",   kota:"MAGELANG",     provinsi:"JAWA TENGAH",     pos:"56115", telp:"0293" },
  { kode:"337411", desa:"SAMBIROTO",   kecamatan:"TEMBALANG",   kota:"SEMARANG",     provinsi:"JAWA TENGAH",     pos:"50276", telp:"024"  },
  { kode:"327312", desa:"CIPADUNG",    kecamatan:"CIBIRU",      kota:"BANDUNG",      provinsi:"JAWA BARAT",      pos:"40614", telp:"022"  },
  { kode:"357814", desa:"KETINTANG",   kecamatan:"GAYUNGAN",    kota:"SURABAYA",     provinsi:"JAWA TIMUR",      pos:"60231", telp:"031"  },
  { kode:"317109", desa:"CIPINANG",    kecamatan:"PULOGADUNG",  kota:"JAKARTA TIMUR",provinsi:"DKI JAKARTA",     pos:"13240", telp:"021"  },
  { kode:"620711", desa:"PANARUNG",    kecamatan:"PAHANDUT",    kota:"PALANGKARAYA", provinsi:"KALIMANTAN TENGAH", pos:"73111", telp:"0536" },
  { kode:"337201", desa:"JEBRES",      kecamatan:"JEBRES",      kota:"SURAKARTA",    provinsi:"JAWA TENGAH",     pos:"57126", telp:"0271" },
  { kode:"347101", desa:"CATURTUNGGAL",kecamatan:"DEPOK",       kota:"YOGYAKARTA",   provinsi:"DI YOGYAKARTA",   pos:"55281", telp:"0274" }
];

const PROFIL_JALAN = [
  "JL. DIPONEGORO", "JL. AHMAD YANI", "JL. GAJAH MADA", "JL. SUDIRMAN",
  "JL. VETERAN", "JL. KARTINI", "JL. MERDEKA", "JL. HASANUDDIN"
];

const PROFIL_IBU = [
  "SUKARTI", "MARIYEM", "SITI ROHMAH", "NGATINEM", "SUMIYATI", "ROHANI",
  "SUPARTI", "TUMINAH", "KHOIRIYAH", "SUYATMI", "PAINEM", "LASMINI"
];

const PROFIL_BINTANG_JASA = [
  "-", "Satyalancana Kesetiaan VIII Tahun", "Satyalancana Kesetiaan XVI Tahun",
  "Satyalancana Dharma Nusa", "Satyalancana Kesetiaan XXIV Tahun"
];

/* PDW = pendidikan dasar/umum terakhir yang tercatat di data dinas. */
const PROFIL_PDW = ["SMA/SEDERAJAT", "D-III", "S-1", "SMP/SEDERAJAT", "SMA/SEDERAJAT", "S-2"];

const PROFIL_UNOR = {
  "TNI-AD": "MABES TNI AD",
  "TNI-AL": "MABES TNI AL",
  "TNI-AU": "MABES TNI AU",
  "POLRI":  "MABES POLRI",
  "KEMHAN": "KEMENTERIAN PERTAHANAN"
};

const PROFIL_KANCAB = [
  "KANCAB MAGELANG", "KANCAB SEMARANG", "KANCAB BANDUNG", "KANCAB SURABAYA",
  "KANCAB JAKARTA TIMUR", "KANCAB PALANGKARAYA", "KANCAB SURAKARTA", "KANCAB YOGYAKARTA"
];

function lengkapiProfilPeserta(p, n) {
  const putar = (arr, i) => arr[i % arr.length];
  const pad   = (v, l) => String(v).padStart(l, "0");
  const tgl   = (d, m, y) => `${pad(d, 2)}-${pad(m, 2)}-${y}`;
  /* Ambil bagian tanggal "dd-mm-yyyy"; kolom kosong ("-") jadi null. */
  const bagian = t => /^(\d{2})-(\d{2})-(\d{4})$/.exec(t || "");

  const wil       = putar(PROFIL_WILAYAH, n);
  const perempuan = PROFIL_PEREMPUAN.includes(p.nama);
  const pensiun   = p.statusPeserta === "PENSIUN";
  const meninggal = p.statusPeserta === "MENINGGAL AKTIF";
  const desersi   = p.statusPeserta === "DESERSI";

  const lahir     = bagian(p.tglLahir);
  const thnMasuk  = +(bagian(p.tmt) || [])[3] || 1990;
  const skepPens  = bagian(p.tglSkepPensiun);
  const thnAkhir  = skepPens ? +skepPens[3] : 2026;
  const mkd       = Math.max(1, thnAkhir - thnMasuk);
  const gapok     = 2400000 + (n % 18) * 185000;

  /* NIK: kode wilayah (6) + tanggal lahir ddmmyy (6, tanggal +40 untuk
     perempuan sesuai kaidah NIK) + nomor urut (4). */
  const nik = lahir
    ? `${wil.kode}${pad(+lahir[1] + (perempuan ? 40 : 0), 2)}${lahir[2]}${lahir[3].slice(2)}${pad(1001 + n, 4)}`
    : "-";

  return {
    /* 1. Data Administrasi Pengajuan */
    nomorBatch:  `BTH/${thnAkhir}/${pad(1140 + n * 3, 6)}`,
    nomorAgenda: `AGD/${thnAkhir}/${pad(4512 + n * 7, 6)}`,
    unor:        PROFIL_UNOR[p.angkatan] || "MABES TNI",
    kancab:      putar(PROFIL_KANCAB, n),

    /* 2. Data Kepangkatan / Riwayat Dinas */
    bintangJasa:   putar(PROFIL_BINTANG_JASA, n),
    kesatuanAwal:  putar(PROFIL_KANCAB, n + 2).replace("KANCAB", "DODIKLAT"),
    kesatuanAkhir: p.kesatuan,
    unorAkhir:     PROFIL_UNOR[p.angkatan] || "MABES TNI",
    pdw:           putar(PROFIL_PDW, n),
    perkiraanMkd:  `${mkd} Tahun ${(n % 12)} Bulan`,
    masaKerjaGaji: `${Math.max(1, mkd - 2)} Tahun ${(n % 11)} Bulan`,

    /* 3. Data Identitas Peserta */
    jenisKelamin:   perempuan ? "PEREMPUAN" : "LAKI-LAKI",
    statusKawin:    putar(["KAWIN", "KAWIN", "BELUM KAWIN", perempuan ? "JANDA" : "DUDA"], n),
    nomorIdentitas: nik,
    npwp:           `${pad(20 + n, 2)}.${pad((123 + n * 7) % 1000, 3)}.${pad((456 + n * 11) % 1000, 3)}.${n % 10}-${pad(100 + n, 3)}.000`,
    namaIbu:        putar(PROFIL_IBU, n),
    alamat:         `${putar(PROFIL_JALAN, n)} NO. ${12 + (n % 88)}`,
    rt:             pad((n % 20) + 1, 3),
    rw:             pad((n % 9) + 1, 3),
    kodePos:        wil.pos,
    desa:           wil.desa,
    kecamatan:      wil.kecamatan,
    kota:           wil.kota,
    provinsi:       wil.provinsi,
    telepon:        `(${wil.telp}) ${pad(320471 + n * 13, 6)}`,
    handphone:      `08${pad(12 + (n % 8), 2)}${pad(3204710 + n * 137, 8)}`.slice(0, 13),

    /* 4. Data Status & Monitoring Kepesertaan */
    tglSptbTerakhir: pensiun ? tgl((n % 27) + 1, (n % 12) + 1, 2025) : "-",
    tglHilangTmt:    desersi ? tgl((n % 26) + 2, (n % 11) + 1, 2021)  : "-",
    tglDitemukan:    "-",
    tglMeninggal:    meninggal ? tgl((n % 25) + 3, (n % 12) + 1, 2019) : "-",

    /* 5. Data Pensiun */
    gajiPokokTerakhir: gapok,
    penspok:           pensiun ? Math.round(gapok * 0.75 / 1000) * 1000 : 0,
    batasHak:          pensiun ? tgl(1, (n % 12) + 1, thnAkhir + 20) : "-",
    tunjanganCacat:    n % 11 === 0 ? 450000 : 0,
    tmtSkpp:           pensiun ? tgl(1, (n % 12) + 1, thnAkhir) : "-",

    /* 6. Data DAPEM */
    tglDapemTerakhir:     pensiun ? tgl(1, 8, 2026) : "-",
    tglAmbilUangTerakhir: pensiun ? tgl(4 + (n % 12), 8, 2026) : "-"
  };
}

DATA_PESERTA_KELOLA.forEach((p, i) => { p.profil = lengkapiProfilPeserta(p, i); });

/* ---------------------------------------------------------------------------
   22c. PENGELOLAAN DATA PESERTA — isi tab "SPTB" dan "Riwayat Perubahan Data"
   Keduanya bercerita tentang kejadian yang sama: satu SPTB yang diajukan
   peserta, lalu disetujui petugas dan mengubah satu kolom data. Karena itu
   dibangkitkan sekaligus oleh satu fungsi supaya baris di kedua tab selalu
   cocok — tanggal approval selalu sesudah tanggal SPTB, dan tipe perubahannya
   sama. Sama seperti blok 22b: berurutan dari indeks baris, tanpa Math.random.
   Baris paling atas = paling baru.
   --------------------------------------------------------------------------- */
/* Kategori Perubahan mengelompokkan perubahan jadi tiga golongan (dipakai
   badge di layar Detail Perubahan Data); Tipe Perubahan adalah kolom data
   yang benar-benar berubah, cth. "REKENING BANK" atau "NOMOR PENSIUN". */
const SPTB_KATEGORI_PERUBAHAN = ["Pangkat", "Keluarga", "Peserta"];
const SPTB_SUMBER             = ["Asabri Mobile", "Sistem YANDU via Klaim"];

/* Unit kerja petugas yang menyetujui perubahan — dipakai kolom Unit Kerja di
   tab Riwayat Perubahan Data. */
const SPTB_UNIT_KERJA = ["Divisi Kepesertaan dan Pengembangan Manfaat", "Divisi Layanan"];

/* Alamat IP dan sistem operasi perangkat yang dipakai saat perubahan direkam.
   Perubahan lewat Asabri Mobile datang dari perangkat peserta (Android/iOS),
   sisanya dari komputer petugas di jaringan kantor. */
const SPTB_IP_ACTION = ["10.7.2.17", "10.7.2.20", "10.7.2.31", "10.7.3.14"];
const SPTB_OS_KANTOR = ["Windows 11", "Windows 10"];
const SPTB_OS_MOBILE = ["Android 14", "iOS 17"];

const SPTB_NAMA_PETUGAS = [
  "SUPRAPTO", "RINI ASTUTI", "HARYONO", "DEWI LESTARI", "AGUS PRIYONO",
  "NOVITA SARI", "BAMBANG WIJAYA", "LILIS HERAWATI"
];

/* Unit yang menyetujui SPTB dari Sistem YANDU via Klaim. SPTB yang masuk
   lewat Asabri Mobile tidak memakai daftar ini — approval-nya selalu dari
   kantor cabang tempat peserta terdaftar. */
const SPTB_UNIT_PUSAT = ["DIVISI KEPESERTAAN", "DIVISI PELAYANAN"];

/* `ket` dipakai kolom Keterangan di tab SPTB, `tipe` dipakai kolom Tipe
   Perubahan di tab Riwayat Perubahan Data. Entri pangkat tanpa lama/baru
   mengambil pangkat awal & akhir peserta yang bersangkutan. */
const SPTB_UBAH_PANGKAT = [
  { ket:"Kenaikan pangkat reguler",                 tipe:"PANGKAT TERAKHIR" },
  { ket:"Penyesuaian pangkat mengikuti SKEP terbaru", tipe:"SKEP PANGKAT",
    lama:"SKEP/1123/IX/2018", baru:"SKEP/2287/IV/2021" },
  { ket:"Perbaikan pangkat yang salah rekam",       tipe:"PANGKAT TERAKHIR" }
];

const SPTB_UBAH_KELUARGA = [
  { ket:"Penambahan data anak",                tipe:"DATA ANAK",
    lama:"2 anak terdaftar",     baru:"3 anak terdaftar" },
  { ket:"Perubahan status kawin",              tipe:"STATUS KAWIN",
    lama:"BELUM KAWIN",          baru:"KAWIN" },
  { ket:"Perbaikan ejaan nama istri/suami",    tipe:"NAMA PASANGAN",
    lama:"SITI ROHMA",           baru:"SITI ROHMAH" },
  { ket:"Perubahan rekening anggota keluarga", tipe:"DATA REKENING KELUARGA",
    lama:"BNI 0155-08-771230",   baru:"BNI 0155-08-990817" }
];

const SPTB_UBAH_PESERTA = [
  { ket:"Perubahan alamat domisili",         tipe:"ALAMAT DOMISILI",
    lama:"JL. VETERAN NO. 12",   baru:"JL. MERDEKA NO. 45" },
  { ket:"Perubahan nomor handphone",         tipe:"NOMOR HANDPHONE",
    lama:"081234567890",         baru:"081298765432" },
  { ket:"Perubahan nomor rekening penerima", tipe:"REKENING BANK",
    lama:"BRI 0021-01-004512",   baru:"BRI 0021-01-118093" },
  { ket:"Perpindahan cabang Asabri pembayar", tipe:"CABANG ASABRI PENSIUN",
    lama:"KC BANDUNG",           baru:"KC JAKARTA PUSAT" },
  { ket:"Perpindahan mitra bayar",           tipe:"MITRA BAYAR",
    lama:"BRI",                  baru:"BNI" },
  { ket:"Perpindahan cabang mitra bayar",    tipe:"CABANG MITRA BAYAR",
    lama:"BRI KC BANDUNG",       baru:"BRI KC CIMAHI" },
  { ket:"Perbaikan nomor pensiun",           tipe:"NOMOR PENSIUN",
    lama:"0501234567",           baru:"0501234599" }
];

function buatRiwayatSptbPeserta(p, n) {
  const putar = (arr, i) => arr[i % arr.length];
  const pad   = (v, l) => String(v).padStart(l, "0");
  const tgl   = (d, m, y) => `${pad(d, 2)}-${pad(m, 2)}-${y}`;
  const jam   = k => `${pad(8 + (k % 9), 2)}:${pad((k * 7) % 60, 2)}:${pad((k * 13) % 60, 2)}`;

  const jumlah    = 2 + (n % 3);
  const sptb      = [];
  const perubahan = [];

  for (let i = 0; i < jumlah; i++) {
    const k        = n + i * 5;
    const kategori = putar(SPTB_KATEGORI_PERUBAHAN, k);
    const hari     = (k % 26) + 1;
    const blan     = (k % 12) + 1;
    const thn      = 2026 - i * 2;

    /* Entri pangkat tanpa lama/baru sendiri memakai pangkat peserta. */
    const ubah = kategori === "Pangkat"  ? putar(SPTB_UBAH_PANGKAT, k)
               : kategori === "Keluarga" ? putar(SPTB_UBAH_KELUARGA, k)
               :                           putar(SPTB_UBAH_PESERTA, k);
    const ket  = ubah.ket;
    const lama = ubah.lama ?? p.pangkatAwal;
    const baru = ubah.baru ?? p.pangkatAkhir;

    /* SPTB yang masuk lewat Asabri Mobile ditandai kanal aplikasinya, bukan
       nama unit; yang lewat Sistem YANDU via Klaim disetujui unit di kantor
       pusat. */
    const sumber = putar(SPTB_SUMBER, k);
    const unit   = sumber === "Asabri Mobile" ? "ASABRI MOBILE" : putar(SPTB_UNIT_PUSAT, k);

    /* Petugas yang sama menutup kedua daftar: baris SPTB dan baris perubahan
       yang dihasilkannya selalu menyebut nama petugas yang sama. */
    const namaUser     = putar(SPTB_NAMA_PETUGAS, k);
    const userApproval = `${namaUser} / ${unit}`;

    sptb.push({ tglSptb: tgl(hari, blan, thn), userApproval, tipe: kategori, keterangan: ket });
    perubahan.push({
      tglApproval: tgl(Math.min(hari + 3, 28), blan, thn),
      jam:         jam(k),
      namaUser,
      unitKerja:   putar(SPTB_UNIT_KERJA, k),
      ipAction:    putar(SPTB_IP_ACTION, k),
      os:          sumber === "Asabri Mobile" ? putar(SPTB_OS_MOBILE, k) : putar(SPTB_OS_KANTOR, k),
      userApproval,
      sumber,
      kategori,
      tipe: ubah.tipe,
      lama, baru
    });
  }
  return { sptb, perubahan };
}

DATA_PESERTA_KELOLA.forEach((p, i) => {
  const r = buatRiwayatSptbPeserta(p, i);
  p.sptb      = r.sptb;
  p.perubahan = r.perubahan;
});

/* ---------------------------------------------------------------------------
   22d. PENGELOLAAN DATA PESERTA — isi tab "Keluarga"
   Anggota keluarga dibangkitkan mengikuti data peserta induknya supaya masuk
   akal: peserta berstatus BELUM KAWIN tidak punya baris sama sekali (sekalian
   memperlihatkan keadaan "Data Keluarga Kosong"), pasangan JANDA/DUDA punya
   tanggal meninggal, dan anak yang usianya sudah lewat batas tunjangan punya
   Tgl Berhenti di Tunjang. Sama seperti blok 22b dan 22c: berurutan dari
   indeks baris, tanpa Math.random.
   --------------------------------------------------------------------------- */
const KELUARGA_NAMA_ISTRI = [
  "SRI WAHYUNI", "ENDANG SUPRIATI", "TITIK HANDAYANI", "MARYATI",
  "NUR HAYATI", "LILIS SURYANI", "RETNO PALUPI", "DWI ASTUTI"
];
const KELUARGA_NAMA_SUAMI = [
  "SUGENG RIYADI", "DIDIK PURNOMO", "HERI SETIAWAN", "PURWANTO",
  "MUJIONO", "DARMAWAN", "IMAM SYAFI'I", "WAHYU HIDAYAT"
];
const KELUARGA_NAMA_ANAK = [
  "RIZKY PRATAMA", "DIAN PERMATA SARI", "BAGUS SETIAWAN", "AYU LESTARI",
  "FAJAR RAMADHAN", "INTAN NURAINI", "DIMAS ARYA PUTRA", "SALSABILA AZZAHRA",
  "RENDI SAPUTRA", "MEGA PUSPITA"
];
const KELUARGA_PEKERJAAN_ANAK = ["PELAJAR", "MAHASISWA", "KARYAWAN SWASTA", "WIRASWASTA", "PNS"];

/* Isi dropdown "Hubungan Keluarga" di form Edit Keluarga. Ditulis persis
   seperti pilihan yang berlaku di sistem, termasuk keterangan dalam kurung. */
const KELUARGA_HUBUNGAN = [
  "ISTRI",
  "ANAK",
  "AYAH",
  "IBU",
  "AHLI WARIS -(khusus hak/manfaat)",
  "SENDIRI -(khusus hak/manfaat)",
  "WALI",
  "YANG BERSANGKUTAN",
  "KAKAK/ADIK",
  "ANAK ANGKAT",
  "ANAK TIRI"
];

/* Isi dropdown di form Profil Anggota Keluarga. */
const KELUARGA_JENIS_KELAMIN   = ["PRIA", "WANITA"];
const KELUARGA_STATUS_KAWIN    = [
  "Belum menikah", "Menikah", "Janda/Duda Cerai", "Janda/Duda Meninggal"
];
const KELUARGA_PEKERJAAN       = [
  "ASN", "Pegawai swasta", "Pegawai BUMN", "Mahasiswa", "Pelajar",
  "Ibu Rumah Tangga", "Tidak Bekerja", "Lainnya", "TNI/POLRI"
];
const KELUARGA_TIPE_DOKUMEN    = ["Dokumen Baru", "Dokumen Yang Sudah Ada"];

/* Pilihan "File Identitas" ketika Tipe Dokumen Identitas = "Dokumen Yang
   Sudah Ada" — dokumen peserta yang sudah tersimpan di E-Dosir. */
const KELUARGA_DOKUMEN_TERSEDIA = [
  "KTP",
  "Kartu Keluarga",
  "Akta Nikah",
  "Akta Kelahiran",
  "Paspor"
];

/* Jenis kelamin yang otomatis terisi mengikuti Hubungan Keluarga yang
   dipilih; hubungan yang tidak ada di sini dibiarkan kosong. */
const KELUARGA_KELAMIN_BAWAAN = {
  "ISTRI": "WANITA",
  "IBU":   "WANITA",
  "AYAH":  "PRIA"
};

/* Field opsional yang tampil per Hubungan Keluarga di form Profil Anggota
   Keluarga. Field pokok (Nama, Tempat Lahir, Tanggal Lahir, Jenis Kelamin,
   Status Perkawinan, NIK, Pekerjaan, Tanggal Meninggal, Tanggal Berhenti Di
   Tunjang, Tanggal Di Tunjang Kembali) selalu tampil dan tidak didaftar di
   sini. Hubungan yang belum punya entri memakai KELUARGA_FIELD_BAWAAN. */
const KELUARGA_FIELD_TAMPIL = {
  "ISTRI":       ["mulaiKerja", "berhentiKerja"],
  "IBU":         ["akta"],
  "AYAH":        ["akta"],
  "AHLI WARIS -(khusus hak/manfaat)": ["akta"],
  "SENDIRI -(khusus hak/manfaat)":    ["akta"],
  "WALI":              ["akta"],
  "YANG BERSANGKUTAN": ["akta"],
  "KAKAK/ADIK":        ["akta"],
  /* Hanya ANAK yang punya field Orang Tua; anak angkat dan anak tiri tidak. */
  "ANAK":        ["orangTua", "akta", "mulaiKerja", "mulaiKuliah", "selesaiKuliah"],
  "ANAK ANGKAT": ["akta", "mulaiKerja", "mulaiKuliah", "selesaiKuliah"],
  "ANAK TIRI":   ["akta", "mulaiKerja", "mulaiKuliah", "selesaiKuliah"]
};
const KELUARGA_FIELD_BAWAAN = ["mulaiKerja", "berhentiKerja"];
const KELUARGA_CABANG_MITRA = [
  "KCP SURABAYA DARMO", "KCP BANDUNG ASIA AFRIKA", "KCP SEMARANG PANDANARAN",
  "KCP JAKARTA CIPINANG", "KCP PALANGKARAYA AHMAD YANI", "KCP SURAKARTA SLAMET RIYADI",
  "KCP YOGYAKARTA MALIOBORO", "KCP MAGELANG PEMUDA"
];

function buatKeluargaPeserta(p, n) {
  const putar = (arr, i) => arr[i % arr.length];
  const pad   = (v, l) => String(v).padStart(l, "0");
  const tgl   = (d, m, y) => `${pad(d, 2)}-${pad(m, 2)}-${y}`;
  const kosong = {
    nopens:"-", tempatLahir:"-", tglLahir:"-", tglMenikah:"-", tglMeninggal:"-",
    tglMulaiKuliah:"-", tglSelesaiKuliah:"-", tglMulaiKerja:"-", tglSelesaiKerja:"-",
    pekerjaan:"-", tglBerhentiTunjang:"-", tglTunjangKembali:"-",
    namaRekening:"-", nomorRekening:"-", mitraBayar:"-", cabangMitraBayar:"-"
  };

  const pr = p.profil;
  if (pr.statusKawin === "BELUM KAWIN") return [];

  const perempuan  = pr.jenisKelamin === "PEREMPUAN";
  const wafat      = pr.statusKawin === "JANDA" || pr.statusKawin === "DUDA";
  const thnPeserta = +String(p.tglLahir).slice(-4);
  const thnNikah   = thnPeserta + 25 + (n % 4);
  const thnEntry   = Math.min(2026, thnNikah + 1);
  const nikPrefix  = String(pr.nomorIdentitas).slice(0, 6);
  const nik = (hari, blan, thn, urut, wanita) =>
    `${nikPrefix}${pad(hari + (wanita ? 40 : 0), 2)}${pad(blan, 2)}${String(thn).slice(2)}${pad(urut, 4)}`;

  const rows = [];

  /* ---- Pasangan ---- */
  const thnPasangan = thnPeserta + (perempuan ? -2 : 3);
  rows.push({
    ...kosong,
    tglEntry:     tgl((n % 26) + 1, (n % 12) + 1, thnEntry),
    nopens:       p.statusPeserta === "PENSIUN" && p.nopens !== "-" ? `${p.nopens}W` : "-",
    nama:         perempuan ? putar(KELUARGA_NAMA_SUAMI, n) : putar(KELUARGA_NAMA_ISTRI, n),
    hubungan:     perempuan ? "SUAMI" : "ISTRI",
    tempatLahir:  pr.kota,
    tglLahir:     tgl((n % 27) + 1, (n % 12) + 1, thnPasangan),
    tglMenikah:   tgl((n % 25) + 2, (n % 11) + 1, thnNikah),
    tglMeninggal: wafat ? tgl((n % 24) + 3, (n % 10) + 1, 2021 + (n % 4)) : "-",
    pekerjaan:    perempuan ? "KARYAWAN SWASTA" : "IBU RUMAH TANGGA",
    namaRekening: perempuan ? putar(KELUARGA_NAMA_SUAMI, n) : putar(KELUARGA_NAMA_ISTRI, n),
    nomorRekening: `${pad(21 + (n % 60), 4)}-01-${pad(100000 + n * 137, 6)}`,
    mitraBayar:      putar(DATA_MITRA_BAYAR, n),
    cabangMitraBayar: putar(KELUARGA_CABANG_MITRA, n),
    nomorIdentitas:  nik((n % 27) + 1, (n % 12) + 1, thnPasangan, 2001 + n, !perempuan),
    /* Riwayat rekening: rekening lama (kalau pernah ganti mitra) diikuti
       rekening yang berlaku sekarang. Kolom namaRekening/nomorRekening/…
       di atas selalu memuat entri terakhir dari daftar ini. */
    rekening: (n % 3 === 0 ? [{
      nama:   perempuan ? putar(KELUARGA_NAMA_SUAMI, n) : putar(KELUARGA_NAMA_ISTRI, n),
      nomor:  `${pad(51 + (n % 40), 4)}-01-${pad(700000 + n * 91, 6)}`,
      mitra:  putar(DATA_MITRA_BAYAR, n + 4),
      cabang: putar(KELUARGA_CABANG_MITRA, n + 3)
    }] : []).concat([{
      nama:   perempuan ? putar(KELUARGA_NAMA_SUAMI, n) : putar(KELUARGA_NAMA_ISTRI, n),
      nomor:  `${pad(21 + (n % 60), 4)}-01-${pad(100000 + n * 137, 6)}`,
      mitra:  putar(DATA_MITRA_BAYAR, n),
      cabang: putar(KELUARGA_CABANG_MITRA, n)
    }])
  });

  /* ---- Anak ---- */
  const jumlahAnak = (n % 4);
  for (let i = 0; i < jumlahAnak; i++) {
    const k        = n + i * 3;
    const thnAnak  = thnNikah + 2 + i * 3;
    const usia     = 2026 - thnAnak;
    const kuliah   = usia >= 18 && usia <= 25;
    const bekerja  = usia > 23;
    const lewatHak = usia > 25;                 /* batas usia anak ditunjang */
    const anakWanita = i % 2 === 1;
    rows.push({
      ...kosong,
      tglEntry:    tgl((k % 26) + 1, (k % 12) + 1, Math.min(2026, thnAnak + 1)),
      nama:        putar(KELUARGA_NAMA_ANAK, k),
      hubungan:    `ANAK KE-${i + 1}`,
      tempatLahir: pr.kota,
      tglLahir:    tgl((k % 27) + 1, (k % 12) + 1, thnAnak),
      tglMulaiKuliah:   kuliah || lewatHak ? tgl(1, 9, thnAnak + 18) : "-",
      tglSelesaiKuliah: lewatHak           ? tgl(30, 8, thnAnak + 22) : "-",
      tglMulaiKerja:    bekerja            ? tgl(1, 3, thnAnak + 23)  : "-",
      tglSelesaiKerja:  "-",
      pekerjaan:   usia < 18 ? "PELAJAR" : (kuliah ? "MAHASISWA" : putar(KELUARGA_PEKERJAAN_ANAK, k)),
      tglBerhentiTunjang: lewatHak ? tgl(1, (k % 12) + 1, thnAnak + 25) : "-",
      /* Sebagian anak yang tunjangannya sempat berhenti ditunjang kembali
         setelah bukti lanjut kuliah diterima — supaya kolomnya ada isinya. */
      tglTunjangKembali:  lewatHak && k % 3 === 0 ? tgl(1, (k % 10) + 2, thnAnak + 26) : "-",
      nomorIdentitas: nik((k % 27) + 1, (k % 12) + 1, thnAnak, 3001 + k, anakWanita),
      rekening: []   /* rekening penerima manfaat baru dibuka saat hak beralih */
    });
  }
  return rows;
}

DATA_PESERTA_KELOLA.forEach((p, i) => { p.keluarga = buatKeluargaPeserta(p, i); });

/* ---------------------------------------------------------------------------
   22e. PENGELOLAAN DATA PESERTA — isi tab "Hutang"
   Dua daftar terpisah: hutang peserta kepada ASABRI (`p.hutang`) dan hutang
   pada bank/mitra penyalur (`p.hutangMitra`). Sebagian peserta sengaja
   dibiarkan tanpa baris supaya keadaan kosong ikut terlihat saat didemokan.
   Sama seperti blok 22b–22d: berurutan dari indeks baris, tanpa Math.random.
   --------------------------------------------------------------------------- */
const HUTANG_JENIS = [
  "PUM KPR", "BUM KPR", "Piutang Premi", "Kelebihan Bayar Pensiun", "Piutang Santunan"
];
/* Nilai yang mungkin muncul di kolom Status hutang mitra. Isinya tidak
   diundi — ditentukan dari Akhir Kredit di baris yang sama, lihat
   buatHutangPeserta() di bawah. */
const HUTANG_MITRA_STATUS = ["Aktif", "Lunas", "Take Over"];

function buatHutangPeserta(p, n) {
  const putar = (arr, i) => arr[i % arr.length];
  const pad   = (v, l) => String(v).padStart(l, "0");
  const tgl   = (d, m, y) => `${pad(d, 2)}-${pad(m, 2)}-${y}`;

  /* ---- Hutang kepada ASABRI ---- */
  const hutang = [];
  const jmlHutang = n % 4 === 0 ? 0 : 1 + (n % 2);
  for (let i = 0; i < jmlHutang; i++) {
    const k       = n + i * 4;
    const thn     = 2014 + (k % 11);
    const jumlah  = 25000000 + (k % 20) * 7500000;
    /* Makin lama TMT-nya, makin besar porsi yang sudah dibayar. */
    const porsi   = Math.min(0.95, 0.15 + (2026 - thn) * 0.07);
    const dibayar = Math.round(jumlah * porsi / 100000) * 100000;
    hutang.push({
      tmt:        tgl(1, (k % 12) + 1, thn),
      noPiutang:  `PTG/${thn}/${pad(1180 + k * 7, 6)}`,
      jenis:      putar(HUTANG_JENIS, k),
      jumlah,
      sudahBayar: dibayar,
      sisa:       jumlah - dibayar
    });
  }

  /* ---- Hutang pada mitra bayar ---- */
  const hutangMitra = [];
  const jmlMitra = n % 3 === 0 ? 0 : 1 + (n % 2);
  for (let i = 0; i < jmlMitra; i++) {
    const k     = n + i * 6;
    const thn   = 2016 + (k % 9);
    const tenor = 5 + (k % 11);
    /* Status mengikuti Akhir Kredit di baris yang sama: kredit yang masa
       angsurannya sudah lewat berstatus Lunas, sisanya Aktif — kecuali
       sebagian kecil yang diambil alih mitra lain (Take Over). */
    const status = thn + tenor <= 2026 ? "Lunas"
                 : (n + i) % 7 === 0   ? "Take Over"
                 : "Aktif";
    hutangMitra.push({
      mitraBayar:    putar(DATA_MITRA_BAYAR, k),
      tglPengajuan:  tgl((k % 26) + 1, (k % 12) + 1, thn),
      awalKredit:    tgl(1, (k % 12) + 1, thn),
      akhirKredit:   tgl(1, (k % 12) + 1, thn + tenor),
      plafon:        50000000 + (k % 24) * 12500000,
      noRekTab:      `${pad(21 + (k % 60), 4)}-01-${pad(200000 + k * 173, 6)}`,
      noRekKredit:   `${pad(31 + (k % 60), 4)}-02-${pad(300000 + k * 211, 6)}`,
      noPinjaman:    `PK-${thn}-${pad(4400 + k * 13, 6)}`,
      status,
      tarif:         `${9 + (k % 6)},${k % 10}%`
    });
  }

  return { hutang, hutangMitra };
}

DATA_PESERTA_KELOLA.forEach((p, i) => {
  const h = buatHutangPeserta(p, i);
  p.hutang      = h.hutang;
  p.hutangMitra = h.hutangMitra;
});

/* ---------------------------------------------------------------------------
   22f. PENGELOLAAN DATA PESERTA — isi tab "Hak/Produk"
   Transaksi pembayaran hak/produk peserta beserta jejak pembukuannya di
   Axapta. Penerimanya menyesuaikan produk: manfaat yang dibayarkan semasa
   hidup jatuh ke peserta sendiri, santunan kematian ke pasangannya. Sama
   seperti blok 22b–22e: berurutan dari indeks baris, tanpa Math.random.
   --------------------------------------------------------------------------- */
const HAK_PRODUK = [
  { nama:"THT — Tabungan Hari Tua",        waris:false },
  { nama:"Nilai Tunai Tabungan Asuransi",  waris:false },
  { nama:"JKK — Jaminan Kecelakaan Kerja", waris:false },
  { nama:"JKm — Jaminan Kematian",         waris:true  },
  { nama:"Santunan Risiko Kematian Khusus",waris:true  },
  { nama:"Biaya Pemakaman",                waris:true  }
];
const HAK_STATUS_AXAPTA = ["Posted", "Journalized", "Draft"];
const HAK_USER_AXAPTA   = [
  "yandu.batch", "sri.mulyani", "bagus.pratama", "endah.wulandari", "yandu.sync"
];

function buatHakProdukPeserta(p, n) {
  const putar = (arr, i) => arr[i % arr.length];
  const pad   = (v, l) => String(v).padStart(l, "0");
  const tgl   = (d, m, y) => `${pad(d, 2)}-${pad(m, 2)}-${y}`;

  /* Penerima santunan kematian = pasangan yang terdaftar di tabel Keluarga. */
  const pasangan = (p.keluarga || []).find(k => k.hubungan === "ISTRI" || k.hubungan === "SUAMI");
  const rekening = pasangan && pasangan.rekening && pasangan.rekening.length
    ? pasangan.rekening[pasangan.rekening.length - 1]
    : null;

  const rows = [];
  const jumlah = n % 5 === 0 ? 0 : 1 + (n % 3);
  for (let i = 0; i < jumlah; i++) {
    const k       = n + i * 7;
    const produk  = putar(HAK_PRODUK, k);
    const thn     = 2019 + (k % 8);
    const hari    = (k % 26) + 1;
    const blan    = (k % 12) + 1;
    const bruto   = 18000000 + (k % 26) * 3500000;
    const potong  = k % 3 === 0 ? Math.round(bruto * 0.12 / 100000) * 100000 : 0;
    const pajak   = Math.round((bruto - potong) * 0.05 / 1000) * 1000;
    const keWaris = produk.waris && pasangan;

    rows.push({
      namaPenerima: keWaris ? pasangan.nama : p.nama,
      hubungan:     keWaris ? pasangan.hubungan : "SENDIRI",
      produk:       produk.nama,
      tglKejadian:  tgl(hari, blan, thn),
      bruto,
      potongan:     potong,
      potonganPajak: pajak,
      netto:        bruto - potong - pajak,
      cabangMitra:  keWaris && rekening ? rekening.cabang : putar(KELUARGA_CABANG_MITRA, k),
      mitraBayar:   keWaris && rekening ? rekening.mitra  : putar(DATA_MITRA_BAYAR, k),
      nomorSP:      `SP/${thn}/${pad(1200 + k * 9, 6)}`,
      kodeBayar:    `KB-${pad(45 + (k % 50), 2)}-${pad(700 + k * 3, 4)}`,
      nomorDPS:     `DPS/${thn}/${pad(3300 + k * 11, 6)}`,
      tglDPS:       tgl(Math.min(hari + 5, 28), blan, thn),
      statusAxapta: putar(HAK_STATUS_AXAPTA, k),
      tglAxapta:    tgl(Math.min(hari + 8, 28), blan, thn),
      idAxapta:     `AX-${thn}-${pad(88000 + k * 137, 6)}`,
      userAxapta:   putar(HAK_USER_AXAPTA, k)
    });
  }
  return rows;
}

DATA_PESERTA_KELOLA.forEach((p, i) => { p.hakProduk = buatHakProdukPeserta(p, i); });

/* Sub-tab di layar Detail Peserta. Baru "Profil" yang sudah berisi data;
   tab lain menampilkan keadaan kosong sampai rincian FSD-nya tersedia.
   `sub` dipakai sebagai kalimat penjelas di keadaan kosong tersebut. */
const PESERTA_KELOLA_TAB = [
  { key:"profil",     label:"Profil",                 sub:"Data pokok, kedinasan, dan status kepesertaan." },
  { key:"keluarga",   label:"Keluarga",               sub:"Daftar istri/suami dan anak yang terdaftar sebagai ahli waris." },
  { key:"hutang",     label:"Hutang",                 sub:"Hutang peserta kepada ASABRI dan pada bank/mitra penyalur." },
  { key:"hak",        label:"Hak/Produk",             sub:"Hak manfaat dan produk yang melekat pada peserta." },
  { key:"dapem",      label:"Dapem",                  sub:"Riwayat daftar pembayaran pensiun peserta." },
  { key:"pangkat",    label:"Pangkat",                sub:"Riwayat kepangkatan dari pangkat awal sampai pangkat akhir." },
  { key:"cacat",      label:"Peserta Cacat",          sub:"Penetapan tingkat cacat dan manfaat yang menyertainya." },
  { key:"premi",      label:"Premi",                  sub:"Rekapitulasi iuran premi THT, JKK, dan JKm." },
  { key:"polis",      label:"Polis",                  sub:"Data polis dan nomor pertanggungan peserta." },
  { key:"dokumen",    label:"Riwayat Dokumen",        sub:"Dokumen yang pernah diunggah atau diterbitkan." },
  { key:"kunjungan",  label:"Riwayat Kunjungan",      sub:"Catatan kunjungan peserta ke kantor cabang." },
  { key:"edosir",     label:"E-DOSIR",                sub:"Berkas peserta yang sudah didigitalisasi di E-Dosir." },
  { key:"sptb",       label:"SPTB",                   sub:"Surat Pernyataan Tanda Bukti Diri yang pernah diajukan." },
  { key:"pajak",      label:"Pajak",                  sub:"Potongan dan bukti potong pajak atas manfaat peserta." },
  { key:"alihstatus", label:"Riwayat Alih Status",    sub:"Perpindahan peserta antara ASABRI dan TASPEN." },
  { key:"rekening",   label:"Daftar Rekening",        sub:"Rekening bank untuk penyaluran manfaat." },
  { key:"callcenter", label:"Call Center",            sub:"Riwayat interaksi peserta dengan call center." },
  { key:"perubahan",  label:"Riwayat Perubahan Data", sub:"Jejak pemutakhiran data peserta beserta pengusulnya." },
  { key:"sp3r",       label:"SP3R",                   sub:"Surat Perintah Pembayaran Pengembalian Refund." },
  { key:"log",        label:"Log",                    sub:"Log akses dan aktivitas sistem atas data peserta." }
];

/* ---------------------------------------------------------------------------
   23. KODE ACUAN REFERENSI KEPESERTAAN
   Kode acuan yang dipakai untuk pengisian, validasi, dan penyajian data
   kepesertaan (satker, UNOR, pangkat, KPPN, batas usia pensiun, gaji, wilayah,
   kode personil). `induk` = kode/nama tingkat di atasnya. Kombinasi jenis +
   kode harus unik.
   Layar "Daftar Kode Referensi" sudah tidak ada; daftar ini masih dibaca layar
   lain (mis. SPP Data Peserta) untuk mengisi pilihan Pangkat dan Kesatuan.
   `DATA_REFERENSI_USULAN` dan `DATA_REFERENSI_BULK` disimpan sebagai bahan bila
   layar pemeliharaannya dihidupkan kembali.
   status: "Aktif" | "Nonaktif"
   --------------------------------------------------------------------------- */
const REFERENSI_JENIS = [
  "Satker/Kesatuan", "UNOR", "Pangkat", "KPPN",
  "Batas Usia Pensiun", "Gaji Pokok", "Wilayah/Alamat", "Kode Personil"
];

const DATA_REFERENSI = [
  { jenis:"Satker/Kesatuan", kode:"0401", uraian:"KOREM 084/BHASKARA JAYA", induk:"KODAM V/BRAWIJAYA",
    berlaku:"01/01/2020", status:"Aktif",    diperbarui:"12/06/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Satker/Kesatuan", kode:"0412", uraian:"KODIM 0827/SUMENEP", induk:"KOREM 084/BHASKARA JAYA",
    berlaku:"01/01/2020", status:"Aktif",    diperbarui:"12/06/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Satker/Kesatuan", kode:"0733", uraian:"KODIM 0733/SURAKARTA", induk:"KOREM 074/WARASTRATAMA",
    berlaku:"01/01/2020", status:"Aktif",    diperbarui:"04/03/2026", oleh:"Lojita — S. Wijayanti" },
  { jenis:"Satker/Kesatuan", kode:"0918", uraian:"LANUD ISWAHJUDI", induk:"KOOPSUD II",
    berlaku:"01/07/2022", status:"Aktif",    diperbarui:"18/05/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Satker/Kesatuan", kode:"0655", uraian:"POLRES SIDOARJO", induk:"POLDA JAWA TIMUR",
    berlaku:"01/01/2020", status:"Aktif",    diperbarui:"22/04/2026", oleh:"Lojita — S. Wijayanti" },
  { jenis:"Satker/Kesatuan", kode:"0409", uraian:"KODIM 0810/NGANJUK (LAMA)", induk:"KOREM 081/DHIROTSAHA JAYA",
    berlaku:"01/01/2015", status:"Nonaktif", diperbarui:"09/02/2026", oleh:"Lojita — R. Prasetyo" },

  { jenis:"UNOR", kode:"AD",  uraian:"TNI ANGKATAN DARAT",         induk:"TNI",    berlaku:"01/01/2015", status:"Aktif", diperbarui:"15/01/2026", oleh:"Lojita — S. Wijayanti" },
  { jenis:"UNOR", kode:"AL",  uraian:"TNI ANGKATAN LAUT",          induk:"TNI",    berlaku:"01/01/2015", status:"Aktif", diperbarui:"15/01/2026", oleh:"Lojita — S. Wijayanti" },
  { jenis:"UNOR", kode:"AU",  uraian:"TNI ANGKATAN UDARA",         induk:"TNI",    berlaku:"01/01/2015", status:"Aktif", diperbarui:"15/01/2026", oleh:"Lojita — S. Wijayanti" },
  { jenis:"UNOR", kode:"POL", uraian:"KEPOLISIAN NEGARA RI",       induk:"POLRI",  berlaku:"01/01/2015", status:"Aktif", diperbarui:"15/01/2026", oleh:"Lojita — S. Wijayanti" },
  { jenis:"UNOR", kode:"KMH", uraian:"ASN KEMENTERIAN PERTAHANAN", induk:"KEMHAN", berlaku:"01/01/2015", status:"Aktif", diperbarui:"15/01/2026", oleh:"Lojita — S. Wijayanti" },

  { jenis:"Pangkat", kode:"21",    uraian:"SERSAN MAYOR",           induk:"Bintara — TNI AD", berlaku:"01/01/2019", status:"Aktif", diperbarui:"11/03/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Pangkat", kode:"22",    uraian:"SERSAN KEPALA",          induk:"Bintara — TNI AD", berlaku:"01/01/2019", status:"Aktif", diperbarui:"11/03/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Pangkat", kode:"31",    uraian:"LETNAN DUA",             induk:"Perwira — TNI AD", berlaku:"01/01/2019", status:"Aktif", diperbarui:"11/03/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Pangkat", kode:"41",    uraian:"AJUN KOMISARIS POLISI",  induk:"Perwira — POLRI",  berlaku:"01/01/2019", status:"Aktif", diperbarui:"11/03/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Pangkat", kode:"III/A", uraian:"PENATA MUDA",            induk:"Golongan — ASN",   berlaku:"01/01/2019", status:"Aktif", diperbarui:"11/03/2026", oleh:"Lojita — R. Prasetyo" },

  { jenis:"KPPN", kode:"084", uraian:"KPPN SURABAYA II", induk:"Kanwil DJPb Jawa Timur",  berlaku:"01/01/2021", status:"Aktif", diperbarui:"07/05/2026", oleh:"Lojita — A. Nurcahyo" },
  { jenis:"KPPN", kode:"019", uraian:"KPPN JAKARTA I",   induk:"Kanwil DJPb DKI Jakarta", berlaku:"01/01/2021", status:"Aktif", diperbarui:"07/05/2026", oleh:"Lojita — A. Nurcahyo" },
  { jenis:"KPPN", kode:"137", uraian:"KPPN BANDUNG I",   induk:"Kanwil DJPb Jawa Barat",  berlaku:"01/01/2021", status:"Aktif", diperbarui:"07/05/2026", oleh:"Lojita — A. Nurcahyo" },

  { jenis:"Batas Usia Pensiun", kode:"BUP-TAM-AD", uraian:"BUP Tamtama & Bintara TNI — 53 tahun",  induk:"UU No. 34/2004", berlaku:"01/01/2024", status:"Aktif", diperbarui:"02/06/2026", oleh:"Lojita — A. Nurcahyo" },
  { jenis:"Batas Usia Pensiun", kode:"BUP-PA-AD",  uraian:"BUP Perwira TNI — 58 tahun",            induk:"UU No. 34/2004", berlaku:"01/01/2024", status:"Aktif", diperbarui:"02/06/2026", oleh:"Lojita — A. Nurcahyo" },
  { jenis:"Batas Usia Pensiun", kode:"BUP-POLRI",  uraian:"BUP Anggota POLRI — 58 tahun",          induk:"UU No. 2/2002",  berlaku:"01/01/2024", status:"Aktif", diperbarui:"02/06/2026", oleh:"Lojita — A. Nurcahyo" },
  { jenis:"Batas Usia Pensiun", kode:"BUP-ASN-JF", uraian:"BUP ASN Jabatan Fungsional — 60 tahun", induk:"UU No. 20/2023", berlaku:"01/01/2026", status:"Aktif", diperbarui:"14/06/2026", oleh:"Lojita — A. Nurcahyo" },

  { jenis:"Gaji Pokok", kode:"GP-2026-BA21", uraian:"Gaji Pokok Sersan Mayor MKG 12 — Rp 3.847.500", induk:"PP No. 5/2026",  berlaku:"01/01/2026", status:"Aktif",    diperbarui:"20/01/2026", oleh:"Lojita — S. Wijayanti" },
  { jenis:"Gaji Pokok", kode:"GP-2026-PA31", uraian:"Gaji Pokok Letnan Dua MKG 0 — Rp 3.311.000",    induk:"PP No. 5/2026",  berlaku:"01/01/2026", status:"Aktif",    diperbarui:"20/01/2026", oleh:"Lojita — S. Wijayanti" },
  { jenis:"Gaji Pokok", kode:"GP-2025-BA21", uraian:"Gaji Pokok Sersan Mayor MKG 12 — Rp 3.665.200", induk:"PP No. 15/2024", berlaku:"01/01/2025", status:"Nonaktif", diperbarui:"20/01/2026", oleh:"Lojita — S. Wijayanti" },

  { jenis:"Wilayah/Alamat", kode:"35.78",    uraian:"KOTA SURABAYA",      induk:"PROVINSI JAWA TIMUR", berlaku:"01/01/2020", status:"Aktif", diperbarui:"28/05/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Wilayah/Alamat", kode:"35.78.09", uraian:"KEC. SUKOMANUNGGAL", induk:"KOTA SURABAYA",       berlaku:"01/01/2020", status:"Aktif", diperbarui:"28/05/2026", oleh:"Lojita — R. Prasetyo" },
  { jenis:"Wilayah/Alamat", kode:"32.73.27", uraian:"KEC. GEDEBAGE",      induk:"KOTA BANDUNG",        berlaku:"01/04/2026", status:"Aktif", diperbarui:"03/06/2026", oleh:"Lojita — R. Prasetyo" },

  { jenis:"Kode Personil", kode:"01", uraian:"MILITER SUKARELA",      induk:"Status Personel", berlaku:"01/01/2018", status:"Aktif", diperbarui:"16/02/2026", oleh:"Lojita — A. Nurcahyo" },
  { jenis:"Kode Personil", kode:"02", uraian:"PNS KEMHAN/TNI/POLRI",  induk:"Status Personel", berlaku:"01/01/2018", status:"Aktif", diperbarui:"16/02/2026", oleh:"Lojita — A. Nurcahyo" },
  { jenis:"Kode Personil", kode:"03", uraian:"PPPK KEMHAN/TNI/POLRI", induk:"Status Personel", berlaku:"01/01/2024", status:"Aktif", diperbarui:"16/02/2026", oleh:"Lojita — A. Nurcahyo" }
];

/* Usulan perubahan/penambahan kode referensi dari Kesatuan atau Kantor Cabang;
   officer Bidang Lojita memverifikasi lalu menyetujui (kode masuk ke
   DATA_REFERENSI) atau menolak dengan alasan.
   status: "Menunggu Verifikasi" | "Disetujui" | "Ditolak" */
const DATA_REFERENSI_USULAN = [
  { tgl:"18/06/2026", pengusul:"KOREM 084/BHASKARA JAYA", jenis:"Satker/Kesatuan", kode:"0415",
    uraian:"KODIM 0829/BANGKALAN", induk:"KOREM 084/BHASKARA JAYA",
    keterangan:"Pemekaran Kodim sesuai Perkasad Nomor 12/IV/2026.", status:"Menunggu Verifikasi" },
  { tgl:"17/06/2026", pengusul:"KANCAB BANDUNG", jenis:"Wilayah/Alamat", kode:"32.73.31",
    uraian:"KEC. CIBIRU HILIR", induk:"KOTA BANDUNG",
    keterangan:"Pemekaran kecamatan baru, dibutuhkan untuk alamat domisili peserta.", status:"Menunggu Verifikasi" },
  { tgl:"15/06/2026", pengusul:"POLDA JAWA TIMUR", jenis:"Pangkat", kode:"42",
    uraian:"KOMISARIS POLISI", induk:"Perwira — POLRI",
    keterangan:"Penyesuaian kode pangkat pada nominatif kenaikan pangkat periode Juni.", status:"Menunggu Verifikasi" },
  { tgl:"11/06/2026", pengusul:"LANUD ISWAHJUDI", jenis:"Kode Personil", kode:"04",
    uraian:"MILITER WAJIB (KOMPONEN CADANGAN)", induk:"Status Personel",
    keterangan:"Kebutuhan pencatatan personel komponen cadangan.", status:"Disetujui" },
  { tgl:"09/06/2026", pengusul:"KANCAB SEMARANG", jenis:"KPPN", kode:"084",
    uraian:"KPPN SURABAYA II", induk:"Kanwil DJPb Jawa Timur",
    keterangan:"Usulan penambahan kode KPPN untuk penyaluran pensiun.",
    status:"Ditolak", alasan:"Kode 084 sudah terdaftar pada referensi KPPN." },
  { tgl:"05/06/2026", pengusul:"KODAM IV/DIPONEGORO", jenis:"Satker/Kesatuan", kode:"0740",
    uraian:"KODIM 0740/SALATIGA", induk:"KOREM 073/MAKUTARAMA",
    keterangan:"Perubahan nama satker sesuai validasi Spersad.", status:"Disetujui" }
];

/* Berkas contoh yang "terbaca" saat penambahan referensi secara bulk (import
   Excel), dipakai untuk mensimulasikan validasi kode duplikat.
   status: "valid" | "duplikat" | "ditolak" */
const DATA_REFERENSI_BULK = {
  templateNama: "Template Referensi Data Kepesertaan",
  templateFile: "Template Referensi Data Kepesertaan.xlsx",
  namaBerkas:   "referensi_satker_pemekaran_2026.xlsx",
  kolom:        ["Jenis Referensi", "Kode", "Uraian", "Induk / Keterangan", "Berlaku Sejak"],
  rows: [
    { nilai:["Satker/Kesatuan", "0416", "KODIM 0830/SAMPANG",   "KOREM 084/BHASKARA JAYA", "01/07/2026"], status:"valid" },
    { nilai:["Satker/Kesatuan", "0417", "KODIM 0831/PAMEKASAN", "KOREM 084/BHASKARA JAYA", "01/07/2026"], status:"valid" },
    { nilai:["Wilayah/Alamat",  "35.78.11", "KEC. TANDES",      "KOTA SURABAYA",           "01/07/2026"], status:"valid" },
    { nilai:["Satker/Kesatuan", "0412", "KODIM 0827/SUMENEP",   "KOREM 084/BHASKARA JAYA", "01/07/2026"],
      status:"duplikat", alasan:["Kode 0412 sudah terdaftar pada jenis Satker/Kesatuan"] },
    { nilai:["Pangkat", "", "PEMBINA UTAMA MUDA", "Golongan — ASN", "01/07/2026"],
      status:"ditolak", alasan:["Kode wajib diisi"] },
    { nilai:["Satker Baru", "0418", "KODIM 0832/SUMENEP KOTA", "KOREM 084/BHASKARA JAYA", "31/06/2026"],
      status:"ditolak", alasan:["Jenis Referensi tidak dikenal", "Berlaku Sejak bukan tanggal yang sah"] }
  ]
};

/* ---------------------------------------------------------------------------
   23A. SUB MODUL UNOR — PEMELIHARAAN UNIT ORGANISASI
   Daftar Unit Organisasi (UNOR) sebagai acuan penempatan peserta. Satu baris =
   satu unit organisasi; `kode` unik dan memakai pola UNOR-<matra>-<urut>.
   `tgl` disimpan dd/mm/yyyy lalu ditampilkan panjang ("Sabtu, 4 Juli 2026").
   --------------------------------------------------------------------------- */
const UNOR_JENIS_CARI = [
  { key:"kode",      label:"Kode Unit Organisasi" },
  { key:"nama",      label:"Nama Unit Organisasi" },
  { key:"deskripsi", label:"Deskripsi Unit Organisasi" }
];

const DATA_UNOR = [
  { tgl:"04/07/2026", kode:"UNOR-AD-001", nama:"Markas Besar TNI Angkatan Darat (MABESAD)",                          deskripsi:"Markas Komando Utama pembinaan kekuatan dan kemampuan TNI Angkatan Darat." },
  { tgl:"04/07/2026", kode:"UNOR-KH-002", nama:"Biro Kepegawaian Sekretariat Jenderal Kemhan (ROPEG SETJEN KEMHAN)", deskripsi:"Biro pembinaan administrasi kepegawaian ASN di lingkungan Kementerian Pertahanan." },
  { tgl:"04/07/2026", kode:"UNOR-AD-003", nama:"Direktorat Ajudan Jenderal Angkatan Darat (DITAJENAD)",              deskripsi:"Pembina administrasi personel dan pengurusan hak-hak prajurit TNI Angkatan Darat." },
  { tgl:"04/07/2026", kode:"UNOR-AD-004", nama:"Staf Personel Angkatan Darat (SPERSAD)",                             deskripsi:"Staf pembina fungsi personel TNI AD termasuk data kepesertaan ASABRI." },
  { tgl:"06/07/2026", kode:"UNOR-AD-005", nama:"Komando Daerah Militer Jayakarta (KODAM JAYA)",                      deskripsi:"Komando kewilayahan TNI AD untuk wilayah DKI Jakarta dan sekitarnya." },
  { tgl:"06/07/2026", kode:"UNOR-AD-006", nama:"Komando Daerah Militer I/Bukit Barisan (KODAM I/BB)",                deskripsi:"Komando kewilayahan TNI AD wilayah Sumatera bagian utara." },
  { tgl:"06/07/2026", kode:"UNOR-AD-007", nama:"Komando Daerah Militer II/Sriwijaya (KODAM II/SWJ)",                 deskripsi:"Komando kewilayahan TNI AD wilayah Sumatera bagian selatan." },
  { tgl:"06/07/2026", kode:"UNOR-AD-008", nama:"Komando Daerah Militer III/Siliwangi (KODAM III/SLW)",               deskripsi:"Komando kewilayahan TNI AD wilayah Jawa Barat dan Banten." },
  { tgl:"10/07/2026", kode:"UNOR-AD-009", nama:"Komando Daerah Militer IV/Diponegoro (KODAM IV/DIP)",                deskripsi:"Komando kewilayahan TNI AD wilayah Jawa Tengah dan DI Yogyakarta." },
  { tgl:"10/07/2026", kode:"UNOR-AD-010", nama:"Komando Daerah Militer V/Brawijaya (KODAM V/BRW)",                   deskripsi:"Komando kewilayahan TNI AD wilayah Jawa Timur." },
  { tgl:"10/07/2026", kode:"UNOR-AD-011", nama:"Komando Cadangan Strategis Angkatan Darat (KOSTRAD)",                deskripsi:"Komando utama pembinaan dan operasional cadangan strategis TNI Angkatan Darat." },
  { tgl:"10/07/2026", kode:"UNOR-AD-012", nama:"Komando Pasukan Khusus (KOPASSUS)",                                  deskripsi:"Komando utama pembinaan satuan pasukan khusus TNI Angkatan Darat." },
  { tgl:"10/07/2026", kode:"UNOR-AD-013", nama:"Akademi Militer (AKMIL)",                                            deskripsi:"Lembaga pendidikan pembentukan perwira TNI Angkatan Darat di Magelang." },

  { tgl:"15/07/2026", kode:"UNOR-AL-014", nama:"Markas Besar TNI Angkatan Laut (MABESAL)",                           deskripsi:"Markas Komando Utama pembinaan kekuatan dan kemampuan TNI Angkatan Laut." },
  { tgl:"15/07/2026", kode:"UNOR-AL-015", nama:"Dinas Administrasi Personel Angkatan Laut (DISMINPERSAL)",           deskripsi:"Pembina administrasi personel dan hak kesejahteraan prajurit TNI Angkatan Laut." },
  { tgl:"15/07/2026", kode:"UNOR-AL-016", nama:"Komando Armada I (KOARMADA I)",                                      deskripsi:"Komando operasional TNI AL wilayah barat berkedudukan di Jakarta." },
  { tgl:"15/07/2026", kode:"UNOR-AL-017", nama:"Komando Armada II (KOARMADA II)",                                    deskripsi:"Komando operasional TNI AL wilayah tengah berkedudukan di Surabaya." },
  { tgl:"15/07/2026", kode:"UNOR-AL-018", nama:"Komando Armada III (KOARMADA III)",                                  deskripsi:"Komando operasional TNI AL wilayah timur berkedudukan di Sorong." },
  { tgl:"21/07/2026", kode:"UNOR-AL-019", nama:"Korps Marinir (KORMAR)",                                             deskripsi:"Komando utama pembinaan satuan pendarat amfibi TNI Angkatan Laut." },
  { tgl:"21/07/2026", kode:"UNOR-AL-020", nama:"Komando Pendidikan dan Latihan Angkatan Laut (KODIKLATAL)",          deskripsi:"Penyelenggara pendidikan dan latihan personel TNI Angkatan Laut." },
  { tgl:"21/07/2026", kode:"UNOR-AL-021", nama:"Akademi Angkatan Laut (AAL)",                                        deskripsi:"Lembaga pendidikan pembentukan perwira TNI Angkatan Laut di Surabaya." },

  { tgl:"21/07/2026", kode:"UNOR-AU-022", nama:"Markas Besar TNI Angkatan Udara (MABESAU)",                          deskripsi:"Markas Komando Utama pembinaan kekuatan dan kemampuan TNI Angkatan Udara." },
  { tgl:"21/07/2026", kode:"UNOR-AU-023", nama:"Dinas Administrasi Personel Angkatan Udara (DISMINPERSAU)",          deskripsi:"Pembina administrasi personel dan hak kesejahteraan prajurit TNI Angkatan Udara." },
  { tgl:"28/07/2026", kode:"UNOR-AU-024", nama:"Komando Operasi Udara I (KOOPSUD I)",                                deskripsi:"Komando operasional TNI AU wilayah barat berkedudukan di Jakarta." },
  { tgl:"28/07/2026", kode:"UNOR-AU-025", nama:"Komando Operasi Udara II (KOOPSUD II)",                              deskripsi:"Komando operasional TNI AU wilayah tengah berkedudukan di Makassar." },
  { tgl:"28/07/2026", kode:"UNOR-AU-026", nama:"Komando Operasi Udara III (KOOPSUD III)",                            deskripsi:"Komando operasional TNI AU wilayah timur berkedudukan di Biak." },
  { tgl:"28/07/2026", kode:"UNOR-AU-027", nama:"Pangkalan TNI AU Halim Perdanakusuma (LANUD HLP)",                   deskripsi:"Pangkalan udara tipe A pendukung operasi penerbangan TNI Angkatan Udara." },
  { tgl:"28/07/2026", kode:"UNOR-AU-028", nama:"Pangkalan TNI AU Iswahjudi (LANUD IWJ)",                             deskripsi:"Pangkalan udara tipe A home base skadron tempur TNI Angkatan Udara." },
  { tgl:"03/08/2026", kode:"UNOR-AU-029", nama:"Akademi Angkatan Udara (AAU)",                                       deskripsi:"Lembaga pendidikan pembentukan perwira TNI Angkatan Udara di Yogyakarta." },

  { tgl:"03/08/2026", kode:"UNOR-PL-030", nama:"Markas Besar Kepolisian Negara RI (MABES POLRI)",                    deskripsi:"Markas pembinaan dan pengendalian organisasi Kepolisian Negara Republik Indonesia." },
  { tgl:"03/08/2026", kode:"UNOR-PL-031", nama:"Staf Sumber Daya Manusia Polri (SSDM POLRI)",                        deskripsi:"Pembina fungsi sumber daya manusia dan administrasi personel Polri." },
  { tgl:"03/08/2026", kode:"UNOR-PL-032", nama:"Kepolisian Daerah Metro Jaya (POLDA METRO JAYA)",                    deskripsi:"Satuan kewilayahan Polri untuk wilayah DKI Jakarta dan sekitarnya." },
  { tgl:"07/08/2026", kode:"UNOR-PL-033", nama:"Kepolisian Daerah Jawa Barat (POLDA JABAR)",                         deskripsi:"Satuan kewilayahan Polri untuk wilayah Provinsi Jawa Barat." },
  { tgl:"07/08/2026", kode:"UNOR-PL-034", nama:"Kepolisian Daerah Jawa Timur (POLDA JATIM)",                         deskripsi:"Satuan kewilayahan Polri untuk wilayah Provinsi Jawa Timur." },
  { tgl:"07/08/2026", kode:"UNOR-PL-035", nama:"Kepolisian Daerah Sumatera Utara (POLDA SUMUT)",                     deskripsi:"Satuan kewilayahan Polri untuk wilayah Provinsi Sumatera Utara." },
  { tgl:"07/08/2026", kode:"UNOR-PL-036", nama:"Korps Brigade Mobil Polri (KORBRIMOB POLRI)",                        deskripsi:"Satuan pelaksana utama Polri untuk penanganan gangguan keamanan berkadar tinggi." },
  { tgl:"12/08/2026", kode:"UNOR-PL-037", nama:"Akademi Kepolisian (AKPOL)",                                         deskripsi:"Lembaga pendidikan pembentukan perwira Kepolisian Negara Republik Indonesia." },
  { tgl:"12/08/2026", kode:"UNOR-PL-038", nama:"Lembaga Pendidikan dan Pelatihan Polri (LEMDIKLAT POLRI)",           deskripsi:"Penyelenggara pendidikan dan pelatihan personel Kepolisian Negara Republik Indonesia." },

  { tgl:"12/08/2026", kode:"UNOR-KH-039", nama:"Sekretariat Jenderal Kementerian Pertahanan (SETJEN KEMHAN)",        deskripsi:"Unsur pembantu pimpinan pengoordinasi pelaksanaan tugas Kementerian Pertahanan." },
  { tgl:"12/08/2026", kode:"UNOR-KH-040", nama:"Inspektorat Jenderal Kementerian Pertahanan (ITJEN KEMHAN)",         deskripsi:"Unsur pengawasan internal atas pelaksanaan tugas Kementerian Pertahanan." },
  { tgl:"12/08/2026", kode:"UNOR-KH-041", nama:"Direktorat Jenderal Kekuatan Pertahanan (DITJEN KUATHAN)",           deskripsi:"Perumus kebijakan pembinaan kekuatan pertahanan negara." },
  { tgl:"18/08/2026", kode:"UNOR-KH-042", nama:"Direktorat Jenderal Potensi Pertahanan (DITJEN POTHAN)",             deskripsi:"Perumus kebijakan pembinaan potensi dan sumber daya pertahanan negara." },
  { tgl:"18/08/2026", kode:"UNOR-KH-043", nama:"Badan Pendidikan dan Pelatihan Kemhan (BADIKLAT KEMHAN)",            deskripsi:"Penyelenggara pendidikan dan pelatihan pegawai Kementerian Pertahanan." },

  { tgl:"18/08/2026", kode:"UNOR-TN-044", nama:"Markas Besar Tentara Nasional Indonesia (MABES TNI)",                deskripsi:"Markas Komando pembinaan dan penggunaan kekuatan TNI tiga matra." },
  { tgl:"18/08/2026", kode:"UNOR-TN-045", nama:"Pusat Polisi Militer TNI (PUSPOM TNI)",                              deskripsi:"Badan pelaksana pusat fungsi kepolisian militer di lingkungan TNI." }
];

/* ---------------------------------------------------------------------------
   23B. SUB MODUL REFERENSI KOLEKTIF — UNGGAH REFERENSI LEWAT BERKAS EXCEL
   Penambahan data referensi secara kolektif: satu berkas Excel berisi banyak
   baris referensi untuk satu Jenis Referensi. `REF_KOLEKTIF_JENIS` memegang
   template + isi berkas contoh yang "terbaca" saat berkas diunggah, dipakai
   untuk mensimulasikan langkah Validasi dan Submit (bentuknya sengaja sama
   dengan DATA_ALIH_STATUS_KOLEKTIF supaya pola rendernya bisa diikuti).
   Satuan Kerja sengaja dibuat lolos semua, Daerah menyisakan baris bermasalah,
   supaya tombol Simpan bisa didemokan dalam dua keadaan.
   status: "valid" | "ditolak" (yang ditolak wajib `alasan`)
   --------------------------------------------------------------------------- */
const REF_KOLEKTIF_JENIS = [
  {
    key:"satuan-kerja", label:"Satuan Kerja",
    templateNama:"Template Referensi Satuan Kerja",
    namaBerkas:  "referensi_satuan_kerja_pemekaran_2026.xlsx",
    kolom:       ["Kode Satuan Kerja", "Nama Satuan Kerja", "Unit Organisasi", "Kode KPPN", "Berlaku Sejak"],
    rows: [
      { nilai:["0416", "KODIM 0830/SAMPANG",        "KOREM 084/BHASKARA JAYA", "084", "01/07/2026"], status:"valid" },
      { nilai:["0417", "KODIM 0831/PAMEKASAN",      "KOREM 084/BHASKARA JAYA", "084", "01/07/2026"], status:"valid" },
      { nilai:["0418", "KODIM 0832/SUMENEP KOTA",   "KOREM 084/BHASKARA JAYA", "084", "01/07/2026"], status:"valid" },
      { nilai:["0921", "LANUD SULTAN HASANUDDIN",   "KOOPSUD II",              "019", "01/07/2026"], status:"valid" },
      { nilai:["0656", "POLRES SIDOARJO KOTA",      "POLDA JAWA TIMUR",        "084", "01/07/2026"], status:"valid" },
      { nilai:["0745", "KODIM 0745/SALATIGA KOTA",  "KOREM 073/MAKUTARAMA",    "137", "01/08/2026"], status:"valid" }
    ]
  },
  {
    key:"daerah", label:"Daerah",
    templateNama:"Template Referensi Daerah",
    namaBerkas:  "referensi_daerah_pemekaran_2026.xlsx",
    kolom:       ["Kode Daerah", "Nama Daerah", "Tingkat", "Induk Daerah", "Berlaku Sejak"],
    rows: [
      { nilai:["35.78.11", "KEC. TANDES",       "Kecamatan", "KOTA SURABAYA", "01/07/2026"], status:"valid" },
      { nilai:["35.78.12", "KEC. ASEMROWO",     "Kecamatan", "KOTA SURABAYA", "01/07/2026"], status:"valid" },
      { nilai:["32.73.31", "KEC. CIBIRU HILIR", "Kecamatan", "KOTA BANDUNG",  "01/07/2026"], status:"valid" },
      { nilai:["33.74.09", "KEC. GAYAMSARI",    "Kecamatan", "KOTA SEMARANG", "01/07/2026"], status:"valid" },
      { nilai:["35.78.09", "KEC. SUKOMANUNGGAL", "Kecamatan", "KOTA SURABAYA", "01/07/2026"],
        status:"ditolak", alasan:["Kode 35.78.09 sudah terdaftar pada referensi Daerah"] },
      { nilai:["", "KEC. GEDEBAGE BARU", "Kelurahan", "KOTA BANDUNG", "31/06/2026"],
        status:"ditolak", alasan:["Kode Daerah wajib diisi", "Berlaku Sejak bukan tanggal yang sah"] }
    ]
  }
];

/* Riwayat berkas referensi kolektif yang sudah pernah disubmit, dikelompokkan
   per Jenis Referensi. Jumlah Berkas di tabel daftar = panjang `berkas`. */
const DATA_REF_KOLEKTIF = [
  { jenis:"Satuan Kerja", berkas:[
    { nama:"referensi_satuan_kerja_kodam_v_2026.xlsx", tgl:"12/08/2026", baris:24, oleh:"Lojita — R. Prasetyo",  status:"Selesai" },
    { nama:"referensi_satuan_kerja_polda_jatim.xlsx",  tgl:"28/07/2026", baris:11, oleh:"Lojita — S. Wijayanti", status:"Selesai" },
    { nama:"referensi_satuan_kerja_lanud_2026.xlsx",   tgl:"03/07/2026", baris:8,  oleh:"Lojita — A. Nurcahyo",  status:"Selesai" }
  ] },
  { jenis:"Daerah", berkas:[
    { nama:"referensi_daerah_jatim_pemekaran.xlsx", tgl:"18/08/2026", baris:37, oleh:"Lojita — R. Prasetyo",  status:"Selesai" },
    { nama:"referensi_daerah_jabar_2026.xlsx",      tgl:"05/08/2026", baris:19, oleh:"Lojita — S. Wijayanti", status:"Selesai" }
  ] }
];

/* ---------------------------------------------------------------------------
   23C. SUB MODUL STATUS PESERTA & BATAS USIA PENSIUN
   Dua daftar referensi sederhana di bawah Pengelolaan Referensi Data
   Kepesertaan. Bentuk keduanya sama: satu baris = satu nilai referensi, dengan
   `tgl` (dd/mm/yyyy, ditampilkan panjang seperti layar UNOR), `oleh` sebagai
   jejak pembuatnya, dan `keterangan` yang hanya muncul di modal Detail.
   --------------------------------------------------------------------------- */
const DATA_STATUS_PESERTA = [
  { tgl:"04/07/2026", status:"Aktif",                                    oleh:"Lojita — R. Prasetyo",
    keterangan:"Peserta masih berdinas aktif dan iuran preminya dipotong dari gaji setiap bulan." },
  { tgl:"04/07/2026", status:"Pensiun",                                  oleh:"Lojita — R. Prasetyo",
    keterangan:"Peserta sudah menerima Skep pensiun dan masuk pembayaran dapem." },
  { tgl:"04/07/2026", status:"Meninggal Aktif",                          oleh:"Lojita — R. Prasetyo",
    keterangan:"Peserta meninggal dunia saat masih berdinas aktif; hak ahli waris diproses lewat klaim." },
  { tgl:"12/07/2026", status:"Meninggal Pensiun",                        oleh:"Lojita — S. Wijayanti",
    keterangan:"Peserta meninggal dunia setelah berstatus pensiun; pembayaran dapem dihentikan." },
  { tgl:"12/07/2026", status:"Desersi",                                  oleh:"Lojita — S. Wijayanti",
    keterangan:"Peserta dinyatakan desersi berdasarkan keputusan satuan; kepesertaan ditangguhkan." },
  { tgl:"25/07/2026", status:"Pemberhentian Tidak Dengan Hormat (PTDH)", oleh:"Lojita — A. Nurcahyo",
    keterangan:"Peserta diberhentikan tidak dengan hormat; hak manfaat mengikuti ketentuan yang berlaku." },
  { tgl:"08/08/2026", status:"Alih Status",                              oleh:"Lojita — A. Nurcahyo",
    keterangan:"Peserta pindah kepesertaan dari atau ke penyelenggara jaminan sosial lain." },
  { tgl:"08/08/2026", status:"Cuti di Luar Tanggungan Negara",           oleh:"Lojita — A. Nurcahyo",
    keterangan:"Peserta cuti di luar tanggungan negara; iuran premi dihentikan sementara." }
];

/* Pilihan Angkatan & Golongan pada form Tambah Batas Usia Pensiun. Golongan
   mengikuti Angkatan yang dipilih; Angkatan "ASN" tidak memakai Golongan. */
const BUP_ANGKATAN = ["TNI-AD", "TNI-AL", "TNI-AU", "POLRI", "ASN"];
const BUP_GOLONGAN = {
  "TNI-AD": ["TAMTAMA", "BINTARA", "PAMA", "PAMEN", "PATI"],
  "TNI-AL": ["TAMTAMA", "BINTARA", "PAMA", "PAMEN", "PATI"],
  "TNI-AU": ["TAMTAMA", "BINTARA", "PAMA", "PAMEN", "PATI"],
  "POLRI":  ["TAMTAMA", "BINTARA", "PAMA", "PAMEN", "PATI"]
};

const DATA_BUP = [
  { tgl:"04/07/2026", bup:"BUP Tamtama & Bintara TNI — 53 Tahun",                 oleh:"Lojita — A. Nurcahyo",
    keterangan:"Dasar: UU No. 34 Tahun 2004 tentang Tentara Nasional Indonesia." },
  { tgl:"04/07/2026", bup:"BUP Perwira TNI — 58 Tahun",                           oleh:"Lojita — A. Nurcahyo",
    keterangan:"Dasar: UU No. 34 Tahun 2004 tentang Tentara Nasional Indonesia." },
  { tgl:"04/07/2026", bup:"BUP Anggota POLRI — 58 Tahun",                         oleh:"Lojita — A. Nurcahyo",
    keterangan:"Dasar: UU No. 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia." },
  { tgl:"18/07/2026", bup:"BUP Perwira POLRI Berkeahlian Khusus — 60 Tahun",      oleh:"Lojita — R. Prasetyo",
    keterangan:"Dasar: UU No. 2 Tahun 2002; berlaku untuk fungsi teknis tertentu atas persetujuan Kapolri." },
  { tgl:"18/07/2026", bup:"BUP ASN Jabatan Administrasi — 58 Tahun",              oleh:"Lojita — R. Prasetyo",
    keterangan:"Dasar: UU No. 20 Tahun 2023 tentang Aparatur Sipil Negara." },
  { tgl:"03/08/2026", bup:"BUP ASN Jabatan Fungsional Madya — 60 Tahun",          oleh:"Lojita — S. Wijayanti",
    keterangan:"Dasar: UU No. 20 Tahun 2023 tentang Aparatur Sipil Negara." },
  { tgl:"03/08/2026", bup:"BUP ASN Jabatan Pimpinan Tinggi — 60 Tahun",           oleh:"Lojita — S. Wijayanti",
    keterangan:"Dasar: UU No. 20 Tahun 2023 tentang Aparatur Sipil Negara." }
];

/* ---------------------------------------------------------------------------
   24. SPP DATA PESERTA
   Permohonan penambahan data peserta yang Nomor Kartu Peserta ASABRI (KPA)-nya
   sudah terbit namun data kepesertaannya belum tersedia di YANDU — sisa migrasi
   dari aplikasi Yandu lama. `rekomendasi` adalah data peserta mirip yang
   ditawarkan sistem sebagai bahan verifikasi sebelum data ditambahkan.
   sumber rekomendasi: "Belum Termigrasi" | "Data Terhapus" | "Arsip Yandu Lama"
   status:   "Tertunda" | "Disetujui" | "Ditolak" — pengajuan masuk sebagai
   "Tertunda" lalu diputuskan di layar Approval SPP Data Peserta.
   tindakan: "" | "Restore Data" | "Input Data Baru" (peninggalan data contoh)
   tmt / noSkep / tglSkep / pangkatAwal : data pengangkatan yang tampil di
   kolom tabel daftar permohonan; `pangkat` sendiri berisi pangkat terakhir.
   --------------------------------------------------------------------------- */
const DATA_SPP = [
  { no:"SPP-2026-00117", tgl:"19/06/2026", kpa:"ASB-1993-006845", nama:"Sunarto Wibowo", nrp:"196705121988031003",
    nik:"3578141205670004", tglLahir:"12/05/1967", pangkat:"SERSAN MAYOR", kesatuan:"KODIM 0827/SUMENEP",
    tmt:"01/03/1988", noSkep:"KEP/1204/III/1988", tglSkep:"12/02/1988", pangkatAwal:"PRAJURIT DUA",
    cabang:"KC Surabaya", pengaju:"Officer KC — D. Ramadhan", noRequest:"REQ-2026-00891",
    dokumen:["Surat Permohonan KC Surabaya.pdf", "Fotokopi KPA.pdf", "SKEP Pensiun.pdf", "KTP & KK.pdf"],
    status:"Tertunda", tindakan:"", catatan:"",
    rekomendasi:[
      { nama:"SUNARTO WIBOWO", nrp:"196705121988031003", kpa:"ASB-1993-006845", tglLahir:"12/05/1967",
        satker:"KODIM 0827/SUMENEP",        sumber:"Belum Termigrasi",  skor:96 },
      { nama:"SUNARTO WIBOWO", nrp:"196705121988031030", kpa:"ASB-1993-006901", tglLahir:"12/05/1967",
        satker:"KOREM 084/BHASKARA JAYA",   sumber:"Arsip Yandu Lama",  skor:78 },
      { nama:"SUNARTA WIBAWA", nrp:"196706121988031007", kpa:"ASB-1993-007122", tglLahir:"12/06/1967",
        satker:"KODIM 0812/LAMONGAN",       sumber:"Arsip Yandu Lama",  skor:61 }
    ] },

  { no:"SPP-2026-00116", tgl:"18/06/2026", kpa:"ASB-1989-005219", nama:"Marsudi Hartanto", nrp:"146732",
    nik:"3374110809630002", tglLahir:"08/09/1963", pangkat:"AJUN KOMISARIS POLISI", kesatuan:"POLRES SIDOARJO",
    tmt:"01/04/1985", noSkep:"KEP/882/IV/1985",   tglSkep:"18/03/1985", pangkatAwal:"BHARADA",
    cabang:"KC Malang", pengaju:"Officer KC — L. Anggraeni", noRequest:"REQ-2026-00877",
    dokumen:["Surat Permohonan KC Malang.pdf", "Fotokopi KPA.pdf", "SKEP Pensiun.pdf"],
    status:"Tertunda", tindakan:"", catatan:"",
    rekomendasi:[
      { nama:"MARSUDI HARTANTO", nrp:"146732", kpa:"ASB-1989-005219", tglLahir:"08/09/1963",
        satker:"POLRES SIDOARJO",  sumber:"Data Terhapus",    skor:93 },
      { nama:"MARSUDI HARTONO",  nrp:"146723", kpa:"ASB-1989-005281", tglLahir:"08/09/1963",
        satker:"POLRESTA MALANG",  sumber:"Arsip Yandu Lama", skor:64 }
    ] },

  { no:"SPP-2026-00115", tgl:"17/06/2026", kpa:"ASB-2004-031180", nama:"Yuliana Kusumastuti", nrp:"197907142003122002",
    nik:"3273125407790006", tglLahir:"14/07/1979", pangkat:"PENATA MUDA", kesatuan:"ASN MABES TNI",
    tmt:"01/12/2003", noSkep:"KEP/2117/XII/2003", tglSkep:"20/11/2003", pangkatAwal:"GOL.III/A",
    cabang:"KC Bandung", pengaju:"Officer KC — F. Kurniawan", noRequest:"REQ-2026-00860",
    dokumen:["Surat Permohonan KC Bandung.pdf", "Fotokopi KPA.pdf", "SK CPNS & PNS.pdf", "KTP & KK.pdf"],
    status:"Tertunda", tindakan:"", catatan:"",
    rekomendasi:[] },

  { no:"SPP-2026-00114", tgl:"16/06/2026", kpa:"ASB-1997-013522", nama:"Teguh Priyanto", nrp:"197203201995031004",
    nik:"3372012003720003", tglLahir:"20/03/1972", pangkat:"SERSAN KEPALA", kesatuan:"KODIM 0733/SURAKARTA",
    tmt:"01/03/1995", noSkep:"KEP/1533/III/1995", tglSkep:"14/02/1995", pangkatAwal:"PRAJURIT DUA",
    cabang:"KC Solo", pengaju:"Officer KC — H. Prabowo", noRequest:"REQ-2026-00842",
    dokumen:["Surat Permohonan KC Solo.pdf", "Fotokopi KPA.pdf", "SKEP Pensiun.pdf"],
    status:"Tertunda", tindakan:"Restore Data",
    catatan:"Data ditemukan pada arsip belum termigrasi, diaktifkan kembali sesuai dokumen persyaratan.",
    rekomendasi:[
      { nama:"TEGUH PRIYANTO", nrp:"197203201995031004", kpa:"ASB-1997-013522", tglLahir:"20/03/1972",
        satker:"KODIM 0733/SURAKARTA", sumber:"Belum Termigrasi", skor:98 }
    ] },

  { no:"SPP-2026-00113", tgl:"15/06/2026", kpa:"ASB-2011-064882", nama:"Rizal Maulana", nrp:"198806112011011003",
    nik:"3175061106880004", tglLahir:"11/06/1988", pangkat:"LETNAN DUA", kesatuan:"LANUD ISWAHJUDI",
    tmt:"01/01/2011", noSkep:"KEP/318/I/2011",    tglSkep:"09/12/2010", pangkatAwal:"LETNAN DUA",
    cabang:"KC Madiun", pengaju:"Officer KC — T. Wibisono", noRequest:"REQ-2026-00830",
    dokumen:["Surat Permohonan KC Madiun.pdf", "Fotokopi KPA.pdf", "SKEP Pengangkatan.pdf"],
    status:"Tertunda", tindakan:"Input Data Baru",
    catatan:"Tidak ditemukan pada rekomendasi sistem, data diinput baru sesuai dokumen persyaratan.",
    rekomendasi:[] },

  { no:"SPP-2026-00112", tgl:"12/06/2026", kpa:"ASB-1986-004910", nama:"Sri Wahyuni", nrp:"196204251985032001",
    nik:"3374116504620009", tglLahir:"25/04/1962", pangkat:"PENATA MUDA", kesatuan:"ASN KODAM IV/DIPONEGORO",
    tmt:"01/03/1985", noSkep:"KEP/704/III/1985",  tglSkep:"21/02/1985", pangkatAwal:"GOL.II/A",
    cabang:"KC Semarang", pengaju:"Officer KC — N. Safitri", noRequest:"REQ-2026-00815",
    dokumen:["Surat Permohonan KC Semarang.pdf", "Fotokopi KPA.pdf", "SKEP Pensiun.pdf", "KTP & KK.pdf"],
    status:"Disetujui", tindakan:"Restore Data",
    catatan:"Disetujui — data peserta aktif kembali dan siap dipakai Kantor Cabang untuk proses klaim.",
    rekomendasi:[
      { nama:"SRI WAHYUNI", nrp:"196204251985032001", kpa:"ASB-1986-004910", tglLahir:"25/04/1962",
        satker:"ASN KODAM IV/DIPONEGORO", sumber:"Data Terhapus", skor:97 }
    ] },

  { no:"SPP-2026-00111", tgl:"10/06/2026", kpa:"ASB-2013-077304", nama:"Andi Firmansyah", nrp:"199001152013021005",
    nik:"3273121501900002", tglLahir:"15/01/1990", pangkat:"SERSAN MAYOR", kesatuan:"KODIM 0610/SUMEDANG",
    tmt:"01/02/2013", noSkep:"KEP/995/II/2013",   tglSkep:"15/01/2013", pangkatAwal:"PRAJURIT DUA",
    cabang:"KC Bandung", pengaju:"Officer KC — F. Kurniawan", noRequest:"REQ-2026-00802",
    dokumen:["Surat Permohonan KC Bandung.pdf", "Fotokopi KPA.pdf"],
    status:"Ditolak", tindakan:"",
    catatan:"Dokumen SKEP tidak dilampirkan dan Nomor KPA tidak sesuai data Spersad — dikembalikan ke Kantor Cabang.",
    rekomendasi:[] }
];

/* ---------------------------------------------------------------------------
   24b. REFERENSI FORM TAMBAH SPP DATA PESERTA
   Pilihan dropdown pada form "+ Tambah SPP Data Peserta". Nilainya contoh yang
   mengikuti format referensi ASABRI — Pangkat memakai format "KODE - PANGKAT"
   supaya satu nama pangkat yang dipakai beberapa angkatan tetap bisa dibedakan
   lewat kodenya (mis. BRIGJEN pada TNI AD, AL, AU, dan Marinir).
   --------------------------------------------------------------------------- */
const SPP_ANGKATAN        = ["Semua", "TNI-AD", "TNI-AL", "TNI-AU", "POLRI", "KEMHAN"];
const SPP_STATUS_PERSONIL = ["Prajurit", "PNS", "PPPK"];
const SPP_UNOR            = ["TNI AD", "TNI AL", "TNI AU", "POLRI", "MABES TNI", "KEMHAN"];

const SPP_PANGKAT = [
  "4556 - ABRIP", "4554 - ABRIPDA", "4555 - ABRIPTU", "4665 - AIPDA", "4666 - AIPTU",
  "4882 - AKBP", "4773 - AKP", "4553 - BARAKA", "4551 - BHARADA", "4552 - BHARATU",
  "4663 - BRIGADIR", "2991 - BRIGJEN", "1991 - BRIGJEN", "5991 - BRIGJEN", "6991 - BRIGJEN",
  "2991 - BRIGJEN (MAR)", "4991 - BRIGJEN POL", "4661 - BRIPDA", "4664 - BRIPKA",
  "4662 - BRIPTU", "1662 - KOPDA", "1663 - KOPKA", "1664 - KOPTU", "1771 - LETDA",
  "1772 - LETTU", "1773 - KAPTEN", "1881 - MAYOR", "1882 - LETKOL", "1883 - KOLONEL",
  "1661 - PRADA", "1665 - PRAKA", "1666 - PRATU", "1551 - SERDA", "1552 - SERTU",
  "1553 - SERKA", "1554 - SERMA", "1555 - PELDA", "1556 - PELTU",
  "7311 - GOL.II/A", "7312 - GOL.II/B", "7321 - GOL.III/A", "7322 - GOL.III/B",
  "7331 - GOL.IV/A", "7332 - GOL.IV/B"
];

const SPP_BINTANG_JASA = [
  "Bintang Gerilya", "Bintang Sakti", "Bintang Dharma", "Bintang Yudha Dharma",
  "Bintang Kartika Eka Paksi", "Bintang Jalasena", "Bintang Swa Bhuwana Paksa",
  "Bintang Bhayangkara", "Satyalancana Kesetiaan VIII Tahun",
  "Satyalancana Kesetiaan XVI Tahun", "Satyalancana Kesetiaan XXIV Tahun",
  "Satyalancana Dwidya Sistha", "Tidak Ada"
];

const SPP_JENIS_KELAMIN = ["Laki-laki", "Perempuan"];
const SPP_STATUS_KAWIN  = ["BELUM MENIKAH", "MENIKAH", "CERAI HIDUP", "CERAI MATI"];
const SPP_HUBUNGAN_KELUARGA = ["Istri", "Suami", "Anak", "Ayah", "Ibu", "Wali"];

/* Berkas yang selalu diminta pada form tambah SPP; sisanya dipilih sendiri
   oleh officer dari DATA_BERKAS_SARAN lewat tombol "+ Tambah Berkas". */
const SPP_BERKAS_TETAP = [
  { key:"ktp",          label:"KTP",                       wajib:true,  note:"scan berwarna yang terbaca jelas" },
  { key:"pengangkatan", label:"Surat Pengangkatan Pertama", wajib:true,  note:"salinan SK pengangkatan pertama" },
  { key:"pengantar",    label:"Surat Pengantar",            wajib:false, note:"diterbitkan instansi/kesatuan pengirim" }
];


/* ---------------------------------------------------------------------------
   25. PELUNASAN KPR (BUM)
   Satu baris = satu potongan pelunasan pinjaman BUM peserta.
   jenisPotongan : keterangan sumber potongan, mis. "Tabungan Asuransi".
   jenisPinjaman : "BUM KPR Program Khusus ASABRI" | "BUM KPR TWPAD"
                   | "BUM KPR Program Reguler YPPSDP"
   jumlah        : plafon pinjaman BUM yang pernah dicairkan.
   sisaHutang    : pokok pinjaman yang belum terbayar.
   bruto         : nilai bruto manfaat sebelum potongan.
   nominal       : nominal yang dipotong untuk pelunasan.
   imbalJasa     : imbal jasa yang hanya berlaku untuk jenis pinjaman Program
                   Reguler YPPSDP — tidak ada pada jenis lain.
   tglRekon      : tanggal rekonsiliasi data pelunasan dengan mitra.
   tglSp / tglDps / tglPeriode : tanggal Surat Perintah, tanggal DPS, dan
   tanggal periode pembayaran.
   notes         : catatan bebas dari petugas pengunggah, boleh kosong.
   --------------------------------------------------------------------------- */
const DATA_BUM_PELUNASAN = [
  { kpa:"TA910123", nrp:"19870512001", nama:"Intan M. Sari",    tmt:"2021-03-01", nomorPinjaman:"BUM-2021-00114", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:120000000, sisaHutang:64500000,  bruto:72400000,  nominal:68000000,  imbalJasa:2400000, cabang:"KC Jakarta Utama", tglRekon:"2026-06-25", tglSp:"2026-06-18", tglDps:"2026-06-22", tglPeriode:"2026-07-01", notes:"Pelunasan dipercepat atas permintaan peserta." },
  { kpa:"LB940456", nrp:"19880305004", nama:"Firman Dewantoro", tmt:"2019-11-05", nomorPinjaman:"BUM-2019-00042", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:80000000,  sisaHutang:9500000,   bruto:11250000,  nominal:10000000,  cabang:"KC Medan",         tglRekon:"2026-06-23", tglSp:"2026-06-15", tglDps:"2026-06-19", tglPeriode:"2026-07-01", notes:"" },
  { kpa:"PC990901", nrp:"19910304009", nama:"Ratna Dewi",       tmt:"2019-05-17", nomorPinjaman:"BUM-2019-00019", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR TWPAD",                  jumlah:70000000,  sisaHutang:6200000,   bruto:7400000,   nominal:6600000,   cabang:"KC Balikpapan",    tglRekon:"2026-06-20", tglSp:"2026-06-12", tglDps:"2026-06-16", tglPeriode:"2026-07-01", notes:"Selisih nihil setelah rekonsiliasi." },
  { kpa:"PA970789", nrp:"19930422007", nama:"Yuni Kartika",     tmt:"2020-02-28", nomorPinjaman:"BUM-2020-00033", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:90000000,  sisaHutang:14000000,  bruto:16200000,  nominal:14800000,  cabang:"KC Palembang",     tglRekon:"2026-06-18", tglSp:"2026-06-10", tglDps:"2026-06-14", tglPeriode:"2026-07-01", notes:"" },
  { kpa:"UB960678", nrp:"19870910006", nama:"Wati Handayani",   tmt:"2021-09-12", nomorPinjaman:"BUM-2021-00176", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR TWPAD",                  jumlah:110000000, sisaHutang:58000000,  bruto:64750000,  nominal:61200000,  cabang:"KC Semarang",      tglRekon:"2026-06-17", tglSp:"2026-06-08", tglDps:"2026-06-12", tglPeriode:"2026-07-01", notes:"" },
  { kpa:"TB920234", nrp:"19900820002", nama:"Made Wardani",     tmt:"2020-07-15", nomorPinjaman:"BUM-2020-00087", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:95000000,  sisaHutang:21000000,  bruto:24100000,  nominal:22500000,  cabang:"KC Denpasar",      tglRekon:"2026-06-15", tglSp:"2026-06-05", tglDps:"2026-06-09", tglPeriode:"2026-07-01", notes:"" },
  { kpa:"UA951456", nrp:"19830706014", nama:"Joko Purnomo",     tmt:"2019-08-14", nomorPinjaman:"BUM-2019-00027", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:75000000,  sisaHutang:5000000,   bruto:5900000,   nominal:5300000,   cabang:"KC Surabaya",      tglRekon:"2026-06-10", tglSp:"2026-06-02", tglDps:"2026-06-06", tglPeriode:"2026-06-01", notes:"Sisa hutang di bawah Rp 10 juta." },
  { kpa:"LA931234", nrp:"19860303012", nama:"Andi Saputra",     tmt:"2020-10-30", nomorPinjaman:"BUM-2020-00121", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR TWPAD",                  jumlah:118000000, sisaHutang:71000000,  bruto:79500000,  nominal:75000000,  cabang:"KC Jakarta Utama", tglRekon:"2026-06-05", tglSp:"2026-05-28", tglDps:"2026-06-01", tglPeriode:"2026-06-01", notes:"" },
  { kpa:"TB921123", nrp:"19940512011", nama:"Fitri Ramadhani",  tmt:"2021-06-23", nomorPinjaman:"BUM-2021-00152", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Khusus ASABRI",  jumlah:85000000,  sisaHutang:19500000,  bruto:22300000,  nominal:20700000,  cabang:"KC Padang",        tglRekon:"2026-06-03", tglSp:"2026-05-25", tglDps:"2026-05-29", tglPeriode:"2026-06-01", notes:"" },
  { kpa:"PB980890", nrp:"19850617008", nama:"Sri Wahyuni",      tmt:"2022-08-01", nomorPinjaman:"BUM-2022-00265", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:125000000, sisaHutang:98000000,  bruto:108900000, nominal:103500000, imbalJasa:2500000, cabang:"KC Denpasar",      tglRekon:"2026-05-30", tglSp:"2026-05-20", tglDps:"2026-05-24", tglPeriode:"2026-06-01", notes:"Menunggu konfirmasi berkas dari kantor cabang." },
  { kpa:"UA950567", nrp:"19921215005", nama:"Aprildo A. R.",    tmt:"2023-04-20", nomorPinjaman:"BUM-2023-00311", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:135000000, sisaHutang:121000000, bruto:132750000, nominal:128500000, imbalJasa:2700000, cabang:"KC Makassar",      tglRekon:"2026-05-28", tglSp:"2026-05-18", tglDps:"2026-05-22", tglPeriode:"2026-06-01", notes:"" },
  { kpa:"LB941345", nrp:"19920815013", nama:"Lina Marlina",     tmt:"2022-12-04", nomorPinjaman:"BUM-2022-00340", jenisPotongan:"Tabungan Asuransi", jenisPinjaman:"BUM KPR Program Reguler YPPSDP", jumlah:145000000, sisaHutang:139000000, bruto:143200000, nominal:139500000, imbalJasa:2900000, cabang:"KC Bandung",       tglRekon:"2026-05-25", tglSp:"2026-05-14", tglDps:"2026-05-18", tglPeriode:"2026-06-01", notes:"" }
];


/* ---------------------------------------------------------------------------
   26. PEMBATALAN KPR (BUM)
   Pembatalan Bantuan Uang Muka KPR yang suratnya diterbitkan YPPSDP. Cara
   prosesnya ditentukan oleh `statusPeserta` saat surat pembatalan masuk:

   "Aktif" — peserta belum mengajukan klaim THT.
     YPPSDP mengirim hardcopy surat pembatalan langsung ke ASABRI, lalu Div.
     Kepesertaan dan Pengembangan Manfaat merekam Status Keterangan
     Pembatalan, No/Tanggal surat pembatalan, dan Nominal pembatalan.
     Data yang bisa ditarik: Nama, NRP, Nomor KTPA, Nominal, No & Tgl surat.

   "Pensiun" — peserta sudah proses klaim THT / sudah pensiun.
     Peserta minta surat pembatalan ke YPPSDP, membawanya ke Kantor Cabang
     bersama Surat Permohonan, Kantor Cabang mengajukan Request Umum, lalu
     Div. Kepesertaan merekam data yang sama. Divisi Keuangan menutup alur
     dengan menerbitkan SP pembayaran pemotongan, sehingga data tarikannya
     bertambah: Nomor SP pembatalan, Tanggal DPS, dan Nomor DPS.

   jenisPinjaman: "BUM KPR Program Khusus ASABRI" | "BUM KPR TWPAD" |
                  "BUM KPR Program Reguler YPPSDP"

   status: "Tercatat"    → peserta aktif, data pembatalan siap ditarik
           "Menunggu SP" → peserta pensiun, SP pembayaran belum diterbitkan Div. Keuangan
           "Selesai"     → peserta pensiun, SP pembayaran sudah terbit
   --------------------------------------------------------------------------- */

/* Status kepesertaan per Nomor KTPA — penentu cara proses pada form
   pembatalan. "Aktif" langsung dari YPPSDP; "Pensiun" lewat Request Umum
   Kantor Cabang dan ditutup SP pembayaran Divisi Keuangan. */
const BUM_STATUS_PESERTA = {
  "TA910123":"Aktif",   "TB920234":"Pensiun", "LA930345":"Aktif",
  "LB940456":"Pensiun", "UA950567":"Aktif",   "UB960678":"Aktif",
  "PA970789":"Pensiun", "PB980890":"Aktif",   "PC990901":"Pensiun",
  "TA911012":"Aktif",   "TB921123":"Pensiun", "LA931234":"Aktif",
  "LB941345":"Aktif",   "UA951456":"Pensiun"
};

/* Dokumen kelengkapan yang dibawa peserta ke Kantor Cabang (khusus jalur B) */
const BUM_PEMBATALAN_DOKUMEN = [
  "Surat Permohonan Pembatalan BUM KPR",
  "Surat Pembatalan BUM KPR dari YPPSDP"
];

const DATA_BUM_PEMBATALAN = [
  { kpa:"TA910123", nrp:"19870512001", nama:"Intan M. Sari",     cabang:"KC Jakarta Utama", nomorPinjaman:"BUM-2021-00114", jenisPinjaman:"BUM KPR Program Reguler YPPSDP",
    statusPeserta:"Aktif",     keterangan:"Batal Akad Kredit",        noSurat:"B/412/YPPSDP/VI/2026", tglSurat:"2026-06-04", nominal:38000000,  status:"Tercatat" },
  { kpa:"LA930345", nrp:"19951130003", nama:"Kenedi",            cabang:"KC Surabaya",      nomorPinjaman:"BUM-2022-00203", jenisPinjaman:"BUM KPR TWPAD",
    statusPeserta:"Aktif",     keterangan:"Pembatalan Sebagian",      noSurat:"B/418/YPPSDP/VI/2026", tglSurat:"2026-06-09", nominal:22500000,  status:"Tercatat" },
  { kpa:"UB960678", nrp:"19870910006", nama:"Wati Handayani",    cabang:"KC Semarang",      nomorPinjaman:"BUM-2021-00176", jenisPinjaman:"BUM KPR TWPAD",
    statusPeserta:"Aktif",     keterangan:"Rumah Batal Serah Terima", noSurat:"B/423/YPPSDP/VI/2026", tglSurat:"2026-06-15", nominal:41000000,  status:"Tercatat" },
  { kpa:"PB980890", nrp:"19850617008", nama:"Sri Wahyuni",       cabang:"KC Denpasar",      nomorPinjaman:"BUM-2022-00265", jenisPinjaman:"BUM KPR Program Reguler YPPSDP",
    statusPeserta:"Aktif",     keterangan:"Pembatalan Seluruhnya",    noSurat:"B/431/YPPSDP/VII/2026", tglSurat:"2026-07-02", nominal:55000000, status:"Tercatat" },
  { kpa:"LB941345", nrp:"19920815013", nama:"Lina Marlina",      cabang:"KC Bandung",       nomorPinjaman:"BUM-2022-00340", jenisPinjaman:"BUM KPR Program Reguler YPPSDP",
    statusPeserta:"Aktif",     keterangan:"Pengunduran Diri Peserta", noSurat:"B/436/YPPSDP/VII/2026", tglSurat:"2026-07-10", nominal:30000000, status:"Tercatat" },

  { kpa:"TB920234", nrp:"19900820002", nama:"Made Wardani",      cabang:"KC Denpasar",      nomorPinjaman:"BUM-2020-00087", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    statusPeserta:"Pensiun",   keterangan:"Pembatalan Seluruhnya",    noSurat:"B/405/YPPSDP/V/2026",  tglSurat:"2026-05-21", nominal:19500000,  status:"Selesai",
    noRequest:"RU-2026-00218", noSp:"SP/1180/KEU/VI/2026", tglDps:"2026-06-11", noDps:"DPS-2026-06-0042", dokumen:["Surat Permohonan Pembatalan BUM KPR","Surat Pembatalan BUM KPR dari YPPSDP"] },
  { kpa:"LB940456", nrp:"19880305004", nama:"Firman Dewantoro",  cabang:"KC Medan",         nomorPinjaman:"BUM-2019-00042", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    statusPeserta:"Pensiun",   keterangan:"Pembatalan Sebagian",      noSurat:"B/409/YPPSDP/V/2026",  tglSurat:"2026-05-28", nominal:8750000,   status:"Selesai",
    noRequest:"RU-2026-00224", noSp:"SP/1194/KEU/VI/2026", tglDps:"2026-06-18", noDps:"DPS-2026-06-0057", dokumen:["Surat Permohonan Pembatalan BUM KPR","Surat Pembatalan BUM KPR dari YPPSDP"] },
  { kpa:"PA970789", nrp:"19930422007", nama:"Yuni Kartika",      cabang:"KC Palembang",     nomorPinjaman:"BUM-2020-00033", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    statusPeserta:"Pensiun",   keterangan:"Batal Akad Kredit",        noSurat:"B/427/YPPSDP/VI/2026", tglSurat:"2026-06-22", nominal:12400000,  status:"Menunggu SP",
    noRequest:"RU-2026-00237", noSp:"", tglDps:"", noDps:"", dokumen:["Surat Permohonan Pembatalan BUM KPR","Surat Pembatalan BUM KPR dari YPPSDP"] },
  { kpa:"PC990901", nrp:"19910304009", nama:"Ratna Dewi",        cabang:"KC Balikpapan",    nomorPinjaman:"BUM-2019-00019", jenisPinjaman:"BUM KPR TWPAD",
    statusPeserta:"Pensiun",   keterangan:"Pembatalan Seluruhnya",    noSurat:"B/433/YPPSDP/VII/2026", tglSurat:"2026-07-06", nominal:6200000,  status:"Menunggu SP",
    noRequest:"RU-2026-00245", noSp:"", tglDps:"", noDps:"", dokumen:["Surat Permohonan Pembatalan BUM KPR","Surat Pembatalan BUM KPR dari YPPSDP"] },
  { kpa:"UA951456", nrp:"19830706014", nama:"Joko Purnomo",      cabang:"KC Surabaya",      nomorPinjaman:"BUM-2019-00027", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    statusPeserta:"Pensiun",   keterangan:"Rumah Batal Serah Terima", noSurat:"B/439/YPPSDP/VII/2026", tglSurat:"2026-07-14", nominal:5000000,  status:"Menunggu SP",
    noRequest:"RU-2026-00251", noSp:"", tglDps:"", noDps:"", dokumen:["Surat Permohonan Pembatalan BUM KPR","Surat Pembatalan BUM KPR dari YPPSDP"] }
];


/* ---------------------------------------------------------------------------
   27. BUKTI ANGSURAN KPR (BUM)
   Hutang BUM yang tidak terpotong dari hak asuransi dibayar angsur oleh
   peserta. Kantor Cabang merekam setorannya di layar "Upload Bukti Angsuran",
   lalu Divisi Kepesertaan memutuskan di layar "Verifikasi Bukti Angsuran".
   Satu baris = satu setoran angsuran.
   angsuranKe   : urutan setoran peserta pada pinjaman tersebut.
   nominal      : nilai yang disetor peserta.
   sisaHutang   : pokok yang belum terbayar sebelum setoran ini diperhitungkan.
   buktiSetor   : nama berkas yang diunggah Kantor Cabang.
   status       : "Menunggu Verifikasi" | "Terverifikasi" | "Ditolak"
   catatan      : keterangan pemeriksa; wajib saat setoran ditolak.
   --------------------------------------------------------------------------- */
const BUM_ANGSURAN_STATUS = ["Menunggu Verifikasi", "Terverifikasi", "Ditolak"];

const DATA_BUM_ANGSURAN = [
  { noBukti:"ANG-2026-0001", kpa:"TB920234", nrp:"19900820002", nama:"Made Wardani",     cabang:"KC Denpasar",      nomorPinjaman:"BUM-2020-00087", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    angsuranKe:5,  tglBayar:"2026-07-05", nominal:2500000, sisaHutang:21000000,  buktiSetor:"bukti-setor-juli-2026.pdf",   tglUnggah:"2026-07-07", status:"Terverifikasi",       tglVerifikasi:"2026-07-09", catatan:"" },
  { noBukti:"ANG-2026-0002", kpa:"LB940456", nrp:"19880305004", nama:"Firman Dewantoro", cabang:"KC Medan",         nomorPinjaman:"BUM-2019-00042", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    angsuranKe:9,  tglBayar:"2026-07-08", nominal:1500000, sisaHutang:9500000,   buktiSetor:"setoran-bri-08072026.jpg",    tglUnggah:"2026-07-08", status:"Terverifikasi",       tglVerifikasi:"2026-07-10", catatan:"" },
  { noBukti:"ANG-2026-0003", kpa:"PA970789", nrp:"19930422007", nama:"Yuni Kartika",     cabang:"KC Palembang",     nomorPinjaman:"BUM-2020-00033", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    angsuranKe:7,  tglBayar:"2026-07-12", nominal:2000000, sisaHutang:14000000,  buktiSetor:"bukti-transfer-yuni.pdf",     tglUnggah:"2026-07-13", status:"Menunggu Verifikasi", tglVerifikasi:"",           catatan:"" },
  { noBukti:"ANG-2026-0004", kpa:"TB921123", nrp:"19940512011", nama:"Fitri Ramadhani",  cabang:"KC Padang",        nomorPinjaman:"BUM-2021-00152", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    angsuranKe:4,  tglBayar:"2026-07-15", nominal:1750000, sisaHutang:19500000,  buktiSetor:"angsuran-ke-4.pdf",           tglUnggah:"2026-07-16", status:"Menunggu Verifikasi", tglVerifikasi:"",           catatan:"" },
  { noBukti:"ANG-2026-0005", kpa:"UA951456", nrp:"19830706014", nama:"Joko Purnomo",     cabang:"KC Surabaya",      nomorPinjaman:"BUM-2019-00027", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    angsuranKe:12, tglBayar:"2026-07-18", nominal:1000000, sisaHutang:5000000,   buktiSetor:"wa-bukti-bayar.jpg",          tglUnggah:"2026-07-19", status:"Ditolak",             tglVerifikasi:"2026-07-21", catatan:"Nominal pada bukti setor tidak sama dengan yang diinput Kantor Cabang." },
  { noBukti:"ANG-2026-0006", kpa:"LA930345", nrp:"19951130003", nama:"Kenedi",           cabang:"KC Surabaya",      nomorPinjaman:"BUM-2022-00203", jenisPinjaman:"BUM KPR TWPAD",
    angsuranKe:3,  tglBayar:"2026-07-20", nominal:5000000, sisaHutang:112000000, buktiSetor:"setoran-twpad-kenedi.pdf",    tglUnggah:"2026-07-21", status:"Menunggu Verifikasi", tglVerifikasi:"",           catatan:"" },
  { noBukti:"ANG-2026-0007", kpa:"UB960678", nrp:"19870910006", nama:"Wati Handayani",   cabang:"KC Semarang",      nomorPinjaman:"BUM-2021-00176", jenisPinjaman:"BUM KPR TWPAD",
    angsuranKe:6,  tglBayar:"2026-07-22", nominal:3000000, sisaHutang:58000000,  buktiSetor:"bukti-setor-mandiri.pdf",     tglUnggah:"2026-07-23", status:"Terverifikasi",       tglVerifikasi:"2026-07-24", catatan:"" },
  { noBukti:"ANG-2026-0008", kpa:"PC990901", nrp:"19910304009", nama:"Ratna Dewi",       cabang:"KC Balikpapan",    nomorPinjaman:"BUM-2019-00019", jenisPinjaman:"BUM KPR TWPAD",
    angsuranKe:14, tglBayar:"2026-07-25", nominal:800000,  sisaHutang:6200000,   buktiSetor:"angsuran-ratna-juli.jpg",     tglUnggah:"2026-07-26", status:"Menunggu Verifikasi", tglVerifikasi:"",           catatan:"" },
  { noBukti:"ANG-2026-0009", kpa:"LA931234", nrp:"19860303012", nama:"Andi Saputra",     cabang:"KC Jakarta Utama", nomorPinjaman:"BUM-2020-00121", jenisPinjaman:"BUM KPR TWPAD",
    angsuranKe:8,  tglBayar:"2026-07-28", nominal:4000000, sisaHutang:71000000,  buktiSetor:"bukti-setor-andi-08.pdf",     tglUnggah:"2026-07-29", status:"Menunggu Verifikasi", tglVerifikasi:"",           catatan:"" },
  { noBukti:"ANG-2026-0010", kpa:"TB920234", nrp:"19900820002", nama:"Made Wardani",     cabang:"KC Denpasar",      nomorPinjaman:"BUM-2020-00087", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    angsuranKe:6,  tglBayar:"2026-08-05", nominal:2500000, sisaHutang:18500000,  buktiSetor:"bukti-setor-agustus-2026.pdf", tglUnggah:"2026-08-06", status:"Menunggu Verifikasi", tglVerifikasi:"",          catatan:"" },
  { noBukti:"ANG-2026-0011", kpa:"LB940456", nrp:"19880305004", nama:"Firman Dewantoro", cabang:"KC Medan",         nomorPinjaman:"BUM-2019-00042", jenisPinjaman:"BUM KPR Program Khusus ASABRI",
    angsuranKe:10, tglBayar:"2026-08-08", nominal:1500000, sisaHutang:8000000,   buktiSetor:"setoran-bri-08082026.jpg",    tglUnggah:"2026-08-09", status:"Ditolak",             tglVerifikasi:"2026-08-11", catatan:"Berkas buram dan tanggal setor tidak terbaca; mohon unggah ulang." }
];
