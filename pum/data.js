/* ===========================================================================
   data.js — SEMUA DATA CONTOH PROTOTIPE KPR (PUM)
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
   1. SALDO ALOKASI DANA KPR (PUM) per kesatuan
   Kunci (mis. "mabes-tni") harus cocok dengan nilai <option> di index.html.
   --------------------------------------------------------------------------- */
const DATA_SALDO = {
  "mabes-tni":   { label:"Mabes TNI",              saldo:1250000000 },
  "mabes-polri": { label:"Mabes Polri",            saldo:940000000  },
  "kemhan":      { label:"Kementerian Pertahanan", saldo:2100000000 }
};

/* Pilihan tahun pada field Periode */
const DATA_TAHUN = ["2026", "2027", "2028"];


/* ---------------------------------------------------------------------------
   2. MASTER DATA PESERTA (dipakai oleh pencarian "Nomor KPA" saat membuat
      Pengajuan Baru PUM KPR — mensimulasikan data yang ditarik dari ASABRI)
   --------------------------------------------------------------------------- */
const DATA_MASTER_PESERTA = [
  { kpa:"CD317049", nrp:"119596",             npwp:"73.104.502.7-009.000", nik:"3171015001850101", nama:"Intan M. Sari",
    angkatan:"TNI-AL", uker:"Polres Jakarta Barat",  plafonPum:350000000 },
  { kpa:"CY104869", nrp:"197804081998032003", npwp:"89.231.218.2-603.000", nik:"3174014208780102", nama:"Made Wardani",
    angkatan:"TNI-AL", uker:"Polres Jakarta Selatan", plafonPum:300000000 },
  { kpa:"CE360625", nrp:"132170",             npwp:"85.465.740.0-514.000", nik:"3173012701820103", nama:"Kenedi",
    angkatan:"TNI-AL", uker:"Kodim 0501 Jakarta Pusat", plafonPum:325000000 },
  { kpa:"CE358403", nrp:"127485",             npwp:"95.023.091.2-643.000", nik:"3216011505790104", nama:"Firman Dewantoro",
    angkatan:"TNI-AL", uker:"Polres Bekasi",         plafonPum:300000000 },
  { kpa:"CD319552", nrp:"126284",             npwp:"92.704.589.8-126.000", nik:"3671012403810105", nama:"Aprildo Anang Riyadi",
    angkatan:"TNI-AL", uker:"Polres Tangerang",      plafonPum:350000000 },
  { kpa:"CC306323", nrp:"14621/P",            npwp:"08.544.963.5-603.000", nik:"3271010208750106", nama:"Heriyanto, S.KM",
    angkatan:"TNI-AL", uker:"Polres Bogor",          plafonPum:400000000 },
  { kpa:"CD400871", nrp:"148820",             npwp:"77.310.229.4-882.000", nik:"3374011712880107", nama:"Yusuf Pratama",
    angkatan:"TNI-AD", uker:"Kodim 0733 Semarang",   plafonPum:300000000 },
  { kpa:"BP000111", nrp:"84071073",           npwp:"12.345.678.9-001.000", nik:"3273012909830108", nama:"Andi Saputra",
    angkatan:"Polri",  uker:"Polres Bandung",         plafonPum:320000000 },
  { kpa:"EP000112", nrp:"199801152020121003", npwp:"23.456.789.0-002.000", nik:"3404010604860109", nama:"Eko Prasetyo",
    angkatan:"TNI-AU", uker:"Lanud Adisutjipto",      plafonPum:310000000 },

  /* Ditambahkan supaya tersedia 10 Nomor KPA "bersih" (belum pernah dipakai
     bikin pengajuan) untuk simulasi Pengajuan KPR (PUM) baru — lihat catatan
     di BACA-DULU.md / balasan chat untuk daftar lengkapnya. */
  { kpa:"AD500221", nrp:"142376",             npwp:"14.257.836.9-114.000", nik:"3305011106790110", nama:"Bambang Setiawan",
    angkatan:"TNI-AD", uker:"Kodim 0709 Kebumen",       plafonPum:340000000 },
  { kpa:"AL600334", nrp:"198502102010121004", npwp:"25.368.947.0-225.000", nik:"3578012407880211", nama:"Dewi Anggraini",
    angkatan:"TNI-AL", uker:"Lanal Surabaya",           plafonPum:315000000 },
  { kpa:"AU700445", nrp:"156234",             npwp:"36.479.058.1-336.000", nik:"3172011302810112", nama:"Rudi Hartono",
    angkatan:"TNI-AU", uker:"Lanud Halim Perdanakusuma",plafonPum:360000000 },
  { kpa:"PL800556", nrp:"87023456",           npwp:"47.580.169.2-447.000", nik:"3578012009840113", nama:"Siti Nurhaliza",
    angkatan:"Polri",  uker:"Polres Surabaya",          plafonPum:330000000 },
  { kpa:"AD500667", nrp:"199003152015031002", npwp:"58.691.270.3-558.000", nik:"3211012803900114", nama:"Joko Widiyanto",
    angkatan:"TNI-AD", uker:"Kodim 0610 Sumedang",      plafonPum:305000000 },
  { kpa:"AL600778", nrp:"163890",             npwp:"69.702.381.4-669.000", nik:"3510011411870115", nama:"Maria Christina",
    angkatan:"TNI-AL", uker:"Lanal Banyuwangi",         plafonPum:295000000 },
  { kpa:"PL800889", nrp:"91045678",           npwp:"70.813.492.5-770.000", nik:"3276012706930116", nama:"Agus Salim",
    angkatan:"Polri",  uker:"Polres Depok",             plafonPum:375000000 },

  /* Batch ke-2: 10 Nomor KPA "bersih" lagi (berbeda dari batch pertama di atas),
     juga belum pernah dipakai bikin pengajuan. NIK 5 baris pertama sengaja
     disamakan dengan DATA_BUM (Nomor KPA yang sama) supaya validasi Klaim
     KPR (BUM) di pum-baru-cari bisa didemokan lewat KPA maupun NIK. */
  { kpa:"TA910123", nrp:"178432",             npwp:"81.924.605.6-881.000", nik:"3271051205870001", nama:"Slamet Riyadi",
    angkatan:"TNI-AD", uker:"Kodim 0610 Cimahi",         plafonPum:320000000 },
  { kpa:"TB920234", nrp:"199105202018081005", npwp:"92.035.716.7-992.000", nik:"5171200812900002", nama:"Nur Aisyah",
    angkatan:"TNI-AD", uker:"Kodim 0714 Salatiga",       plafonPum:290000000 },
  { kpa:"LA930345", nrp:"185673",             npwp:"03.146.827.8-103.000", nik:"3578301103950003", nama:"Hendra Gunawan",
    angkatan:"TNI-AL", uker:"Lanal Batam",               plafonPum:355000000 },
  { kpa:"LB940456", nrp:"199206182019022003", npwp:"14.257.938.9-214.000", nik:"1271030508880004", nama:"Putri Ramadhani",
    angkatan:"TNI-AL", uker:"Lanal Ambon",               plafonPum:300000000 },
  { kpa:"UA950567", nrp:"192784",             npwp:"25.368.049.0-325.000", nik:"7371151212920005", nama:"Yayan Kusuma",
    angkatan:"TNI-AU", uker:"Lanud Iswahjudi",           plafonPum:365000000 },
  { kpa:"UB960678", nrp:"199308142020051004", npwp:"36.479.150.1-436.000", nik:"3573011007960122", nama:"Lestari Handayani",
    angkatan:"TNI-AU", uker:"Lanud Sulaiman",            plafonPum:285000000 },
  { kpa:"PA970789", nrp:"88056789",           npwp:"47.580.261.2-547.000", nik:"3573012112890123", nama:"Fajar Nugroho",
    angkatan:"Polri",  uker:"Polres Malang",             plafonPum:340000000 },
  { kpa:"PB980890", nrp:"90067890",           npwp:"58.691.372.3-658.000", nik:"3374011809910124", nama:"Ratna Sari",
    angkatan:"Polri",  uker:"Polres Semarang",           plafonPum:310000000 },
  { kpa:"PC990901", nrp:"92078901",           npwp:"69.702.483.4-769.000", nik:"3404012504930125", nama:"Wahyu Saputro",
    angkatan:"Polri",  uker:"Polres Yogyakarta",         plafonPum:325000000 },
  { kpa:"TC911012", nrp:"165789",             npwp:"70.813.594.5-770.000", nik:"3372010306820126", nama:"Indra Permana",
    angkatan:"TNI-AD", uker:"Kodim 0733 Solo",           plafonPum:350000000 },

  /* Prajurit dengan Masa Kerja Dinas < 2 Tahun (TMT baru, lihat
     DATA_RIWAYAT_KEPANGKATAN di bawah) — dipakai untuk simulasi jalur
     dokumen "Surat Pernyataan Kesanggupan" bagi peserta Polri baru, dan
     kasus umum peserta TNI dengan masa kerja dinas masih pendek. */
  { kpa:"AD500992", nrp:"175002",             npwp:"31.560.772.4-992.000", nik:"3372011203010127", nama:"Dimas Aditya",
    angkatan:"TNI-AD", uker:"Kodim 0735 Surakarta",      plafonPum:300000000 },
  { kpa:"AL600992", nrp:"175003",             npwp:"42.671.883.5-992.000", nik:"8103011805020128", nama:"Reza Firmansyah",
    angkatan:"TNI-AL", uker:"Lanal Tual",                plafonPum:300000000 },
  { kpa:"AU700992", nrp:"175004",             npwp:"53.782.994.6-992.000", nik:"1471010207030129", nama:"Bagas Wicaksono",
    angkatan:"TNI-AU", uker:"Lanud Roesmin Nurjadin",    plafonPum:300000000 },

  /* Sudah memiliki Pinjaman KPR (BUM) aktif (lihat DATA_BUM) — dipakai untuk
     simulasi validasi "sudah memiliki Pinjaman KPR (BUM)" di pencarian
     Pengajuan Baru KPR (PUM). */
  { kpa:"AD900123", nrp:"199105102016121003",  npwp:"64.183.275.9-123.000", nik:"3374012004890130", nama:"Yusuf Maulana",
    angkatan:"TNI-AD", uker:"Kodim 0731 Kudus",          plafonPum:310000000 }
];

/* Data dummy peserta untuk testing modul Pengelolaan KPR (PUM) - diimpor apa
   adanya dari berkas Data_Dummy_Peserta_TNI_POLRI_ASN_PPPK.xlsx (80 baris,
   mencakup 4 kategori: TNI, POLRI, ASN Kemenhan, PPPK). Digabungkan ke
   DATA_MASTER_PESERTA di bawah supaya langsung bisa dicari lewat "Nomor KPA"
   di layar Pengajuan KPR (PUM) baru, tanpa perlu ubah app.js. File sumber
   tidak punya kolom KPA - kode "DD000001".."DD000080" dibuat berurutan sesuai
   kolom "No" di file tersebut. Field di luar {kpa,nrp,npwp,nama,angkatan,
   uker,plafonPum} (nik, kategori, statusPersonil, unor, tglLahir, tmt,
   nomorSkep, tglSkep, alamat, telp, email, kancab) ikut disimpan supaya
   datanya lengkap untuk pemakaian di masa depan, walau belum semua dibaca
   oleh wizard Pengajuan KPR (PUM) saat ini.
   Kategori "ASN Kemenhan" pakai angkatan:"KEMHAN" - otomatis lolos jalur
   saldo Alokasi Dana & Parameter Plafon yang sudah ada (angkatan "KEMHAN"
   sudah dikenali). Kategori "PPPK" pakai angkatan:"PPPK" - sengaja TIDAK
   cocok dengan TNI-AD/AL/AU/POLRI/KEMHAN, supaya jalur fallback ikut teruji:
   tanpa saldo Alokasi Dana, dan Plafon memakai plafonPum bawaan peserta. */
const DATA_DUMMY_PESERTA_TNI_POLRI_ASN_PPPK = [
  { kpa:"DD000001", nrp:"23756669", nik:"3157980305809675", npwp:"64.132.130.2-323.000", nama:"Agus Yulianto",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM III/SILIWANGI", uker:"KODIM 0602/SERANG",
    tglLahir:"1980-05-03", tmt:"2004-04-05", nomorSkep:"KEP/1616/XI/2004", tglSkep:"2004-03-16",
    alamat:"Jl. Ahmad Yani No. 130, RT 20/RW 01, Kel. Klojen, Kec. Medan Baru, Manado, Kalimantan Timur", telp:"0874698379", email:"agus.yulianto76@yahoo.com", kancab:"KANCAB MANADO", plafonPum:300000000 },
  { kpa:"DD000002", nrp:"47295260", nik:"3167992802751520", npwp:"58.199.467.6-718.000", nama:"Budi Zulkarnain",
    angkatan:"TNI-AU", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOOPSUD II", uker:"LANUD ISWAHJUDI",
    tglLahir:"1975-02-28", tmt:"2008-04-06", nomorSkep:"KEP/540/III/2008", tglSkep:"2008-03-24",
    alamat:"Jl. Diponegoro No. 12, RT 15/RW 09, Kel. Cikutra, Kec. Ilir Barat, Bandung, Kalimantan Timur", telp:"0857067228", email:"budi.zulkarnain25@outlook.com", kancab:"KANCAB BANJARMASIN", plafonPum:300000000 },
  { kpa:"DD000003", nrp:"61019678", nik:"3340102412802665", npwp:"57.463.314.5-818.000", nama:"Nur Zulkarnain",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM III/SILIWANGI", uker:"KODIM 0602/SERANG",
    tglLahir:"1980-12-24", tmt:"2002-07-13", nomorSkep:"KEP/1028/V/2002", tglSkep:"2002-06-20",
    alamat:"Jl. Sudirman No. 156, RT 06/RW 09, Kel. Sario, Kec. Medan Baru, Surabaya, Daerah Istimewa Yogyakarta", telp:"0875528972", email:"nur.zulkarnain89@outlook.com", kancab:"KANCAB MADIUN", plafonPum:300000000 },
  { kpa:"DD000004", nrp:"18883684", nik:"3571500906695156", npwp:"37.771.611.7-758.000", nama:"Bambang Hidayat",
    angkatan:"TNI-AL", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODIKLATAL", uker:"PUSDIKLAT SURABAYA",
    tglLahir:"1969-06-09", tmt:"2002-01-04", nomorSkep:"KEP/1970/IV/2002", tglSkep:"2001-12-14",
    alamat:"Jl. Anggrek No. 37, RT 09/RW 03, Kel. Medan Baru, Kec. Sario, Malang, Kalimantan Timur", telp:"0858187926", email:"bambang.hidayat52@outlook.com", kancab:"KANCAB PALU", plafonPum:300000000 },
  { kpa:"DD000005", nrp:"30514014", nik:"3377671902909772", npwp:"18.494.490.8-641.000", nama:"Hendra Maulana",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM JAYA", uker:"KODIM 0501/JAKARTA PUSAT",
    tglLahir:"1990-02-19", tmt:"2010-06-17", nomorSkep:"KEP/427/XI/2010", tglSkep:"2010-05-24",
    alamat:"Jl. Diponegoro No. 142, RT 01/RW 11, Kel. Sario, Kec. Cikutra, Balikpapan, Kalimantan Timur", telp:"0856707197", email:"hendra.maulana38@gmail.com", kancab:"KANCAB SERANG", plafonPum:300000000 },
  { kpa:"DD000006", nrp:"24282218", nik:"3433711304009978", npwp:"35.256.482.3-652.000", nama:"Budi Yulianto",
    angkatan:"TNI-AL", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOARMADA II", uker:"LANTAMAL V SURABAYA",
    tglLahir:"2000-04-13", tmt:"2023-09-11", nomorSkep:"KEP/711/XI/2023", tglSkep:"2023-08-19",
    alamat:"Jl. Kenanga No. 1, RT 20/RW 06, Kel. Gondokusuman, Kec. Menteng, Bandung, Sulawesi Selatan", telp:"0855017343", email:"budi.yulianto31@gmail.com", kancab:"KANCAB BATAM", plafonPum:300000000 },
  { kpa:"DD000007", nrp:"98550256", nik:"3274710702718646", npwp:"87.533.316.9-873.000", nama:"Gilang Permadi",
    angkatan:"TNI-AU", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOOPSUD I", uker:"LANUD HALIM PERDANAKUSUMA",
    tglLahir:"1971-02-07", tmt:"1995-10-05", nomorSkep:"KEP/1225/VIII/1995", tglSkep:"1995-09-27",
    alamat:"Jl. Ahmad Yani No. 183, RT 10/RW 07, Kel. Balikpapan Selatan, Kec. Balikpapan Selatan, Makassar, Daerah Istimewa Yogyakarta", telp:"0898574680", email:"gilang.permadi32@gmail.com", kancab:"KANCAB MADIUN", plafonPum:300000000 },
  { kpa:"DD000008", nrp:"10965138", nik:"3139590511923751", npwp:"18.132.980.6-172.000", nama:"Agus Purnomo",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM II/SRIWIJAYA", uker:"KODIM 0418/PALEMBANG",
    tglLahir:"1992-11-05", tmt:"2014-12-10", nomorSkep:"KEP/1549/II/2014", tglSkep:"2014-11-17",
    alamat:"Jl. Kenanga No. 61, RT 09/RW 11, Kel. Gondokusuman, Kec. Medan Baru, Malang, Jawa Timur", telp:"0885076817", email:"agus.purnomo53@yahoo.com", kancab:"KANCAB LAMPUNG", plafonPum:300000000 },
  { kpa:"DD000009", nrp:"17270733", nik:"3165503112860994", npwp:"61.845.447.2-354.000", nama:"Cahyo Hartono",
    angkatan:"TNI-AL", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODIKLATAL", uker:"PUSDIKLAT SURABAYA",
    tglLahir:"1986-12-31", tmt:"2023-05-17", nomorSkep:"KEP/1438/XI/2023", tglSkep:"2023-04-24",
    alamat:"Jl. Ahmad Yani No. 49, RT 18/RW 08, Kel. Rungkut, Kec. Ilir Barat, Surabaya, Jawa Tengah", telp:"0885191056", email:"cahyo.hartono57@gmail.com", kancab:"KANCAB BENGKULU", plafonPum:300000000 },
  { kpa:"DD000010", nrp:"64547971", nik:"3363832908680961", npwp:"31.488.102.7-371.000", nama:"Jaya Permadi",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM III/SILIWANGI", uker:"KODIM 0602/SERANG",
    tglLahir:"1968-08-29", tmt:"1997-06-17", nomorSkep:"KEP/1085/VIII/1997", tglSkep:"1997-06-08",
    alamat:"Jl. Anggrek No. 74, RT 14/RW 12, Kel. Sario, Kec. Padang Timur, Malang, Daerah Istimewa Yogyakarta", telp:"0834185957", email:"jaya.permadi28@yahoo.com", kancab:"KANCAB BANDUNG", plafonPum:300000000 },
  { kpa:"DD000011", nrp:"88406989", nik:"3204182007010932", npwp:"75.182.971.3-170.000", nama:"Jaya Wijaya",
    angkatan:"TNI-AL", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOARMADA I", uker:"LANTAMAL III JAKARTA",
    tglLahir:"2001-07-20", tmt:"2019-07-25", nomorSkep:"KEP/1129/VIII/2019", tglSkep:"2019-07-06",
    alamat:"Jl. Cendrawasih No. 18, RT 08/RW 07, Kel. Cikutra, Kec. Denpasar Timur, Medan, Bali", telp:"0812375453", email:"jaya.wijaya85@yahoo.com", kancab:"KANCAB PADANG", plafonPum:300000000 },
  { kpa:"DD000012", nrp:"63121477", nik:"3297615602007492", npwp:"50.869.174.1-569.000", nama:"Indah Utomo",
    angkatan:"TNI-AL", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOARMADA II", uker:"LANTAMAL V SURABAYA",
    tglLahir:"2000-02-16", tmt:"2020-12-23", nomorSkep:"KEP/1475/III/2020", tglSkep:"2020-11-30",
    alamat:"Jl. Cendrawasih No. 145, RT 04/RW 02, Kel. Klojen, Kec. Medan Baru, Malang, Jawa Tengah", telp:"0836855396", email:"indah.utomo32@gmail.com", kancab:"KANCAB PALU", plafonPum:300000000 },
  { kpa:"DD000013", nrp:"97775215", nik:"3464471405924906", npwp:"94.206.999.3-370.000", nama:"Dwi Permadi",
    angkatan:"TNI-AU", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOOPSUD II", uker:"LANUD ISWAHJUDI",
    tglLahir:"1992-05-14", tmt:"2023-09-20", nomorSkep:"KEP/116/IX/2023", tglSkep:"2023-08-27",
    alamat:"Jl. Sudirman No. 28, RT 18/RW 03, Kel. Tembalang, Kec. Tembalang, Denpasar, Sumatera Utara", telp:"0864415796", email:"dwi.permadi82@outlook.com", kancab:"KANCAB MALANG", plafonPum:300000000 },
  { kpa:"DD000014", nrp:"15917225", nik:"3518541204704292", npwp:"30.859.552.9-822.000", nama:"Prasetyo Siregar",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM IV/DIPONEGORO", uker:"KODIM 0733/SEMARANG",
    tglLahir:"1970-04-12", tmt:"2002-05-31", nomorSkep:"KEP/783/I/2002", tglSkep:"2002-05-24",
    alamat:"Jl. Melati No. 144, RT 01/RW 02, Kel. Cikutra, Kec. Sario, Banjarmasin, Jawa Timur", telp:"0891604451", email:"prasetyo.siregar75@yahoo.com", kancab:"KANCAB JAYAPURA", plafonPum:300000000 },
  { kpa:"DD000015", nrp:"43491314", nik:"3467931005846659", npwp:"89.867.258.4-985.000", nama:"Ahmad Firmansyah",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM V/BRAWIJAYA", uker:"KODIM 0833/MALANG",
    tglLahir:"1984-05-10", tmt:"2011-06-04", nomorSkep:"KEP/310/XI/2011", tglSkep:"2011-05-21",
    alamat:"Jl. Gatot Subroto No. 46, RT 14/RW 01, Kel. Rungkut, Kec. Sario, Banjarmasin, Sulawesi Selatan", telp:"0875163555", email:"ahmad.firmansyah21@yahoo.com", kancab:"KANCAB BENGKULU", plafonPum:300000000 },
  { kpa:"DD000016", nrp:"56930359", nik:"3247101002890388", npwp:"94.297.508.6-385.000", nama:"Ahmad Rizaldi",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM III/SILIWANGI", uker:"KODIM 0602/SERANG",
    tglLahir:"1989-02-10", tmt:"2017-04-28", nomorSkep:"KEP/1780/V/2017", tglSkep:"2017-04-18",
    alamat:"Jl. Sudirman No. 198, RT 09/RW 06, Kel. Balikpapan Selatan, Kec. Klojen, Palembang, Kalimantan Timur", telp:"0861463060", email:"ahmad.rizaldi34@gmail.com", kancab:"KANCAB KUPANG", plafonPum:300000000 },
  { kpa:"DD000017", nrp:"52101056", nik:"3176791111726312", npwp:"83.294.360.1-825.000", nama:"Prasetyo Wijaya",
    angkatan:"TNI-AU", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOOPSUD II", uker:"LANUD ISWAHJUDI",
    tglLahir:"1972-11-11", tmt:"2005-07-04", nomorSkep:"KEP/1341/VII/2005", tglSkep:"2005-06-15",
    alamat:"Jl. Melati No. 1, RT 17/RW 15, Kel. Padang Timur, Kec. Klojen, Balikpapan, Sumatera Utara", telp:"0868235969", email:"prasetyo.wijaya86@gmail.com", kancab:"KANCAB PALANGKARAYA", plafonPum:300000000 },
  { kpa:"DD000018", nrp:"53779528", nik:"3464342106812086", npwp:"34.530.780.7-793.000", nama:"Gunawan Yulianto",
    angkatan:"TNI-AU", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOOPSUD II", uker:"LANUD ISWAHJUDI",
    tglLahir:"1981-06-21", tmt:"2017-04-27", nomorSkep:"KEP/1527/VII/2017", tglSkep:"2017-04-15",
    alamat:"Jl. Gatot Subroto No. 158, RT 19/RW 05, Kel. Ilir Barat, Kec. Klojen, Pontianak, DKI Jakarta", telp:"0855813613", email:"gunawan.yulianto56@gmail.com", kancab:"KANCAB PADANG", plafonPum:300000000 },
  { kpa:"DD000019", nrp:"98429450", nik:"3536070208775492", npwp:"21.938.869.4-788.000", nama:"Dwi Utomo",
    angkatan:"TNI-AU", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KOOPSUD II", uker:"LANUD ISWAHJUDI",
    tglLahir:"1977-08-02", tmt:"2002-08-12", nomorSkep:"KEP/681/II/2002", tglSkep:"2002-07-24",
    alamat:"Jl. Diponegoro No. 58, RT 07/RW 03, Kel. Menteng, Kec. Menteng, Medan, Daerah Istimewa Yogyakarta", telp:"0828640615", email:"dwi.utomo81@yahoo.com", kancab:"KANCAB LAMPUNG", plafonPum:300000000 },
  { kpa:"DD000020", nrp:"10744212", nik:"3244420412852882", npwp:"99.630.575.1-670.000", nama:"Zainal Lesmana",
    angkatan:"TNI-AD", kategori:"TNI", statusPersonil:"Prajurit TNI Aktif", unor:"KODAM III/SILIWANGI", uker:"KODIM 0602/SERANG",
    tglLahir:"1985-12-04", tmt:"2017-09-18", nomorSkep:"KEP/1694/II/2017", tglSkep:"2017-09-02",
    alamat:"Jl. Ahmad Yani No. 32, RT 15/RW 03, Kel. Padang Timur, Kec. Gondokusuman, Balikpapan, Kalimantan Timur", telp:"0896323376", email:"zainal.lesmana79@yahoo.com", kancab:"KANCAB YOGYAKARTA", plafonPum:300000000 },
  { kpa:"DD000021", nrp:"44788100", nik:"3282742002758541", npwp:"72.741.344.5-550.000", nama:"Kevin Kusuma",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SUMATERA UTARA", uker:"POLRESTABES MEDAN",
    tglLahir:"1975-02-20", tmt:"2013-03-10", nomorSkep:"KEP/1820/IV/2013", tglSkep:"2013-02-15",
    alamat:"Jl. Sudirman No. 183, RT 10/RW 04, Kel. Tembalang, Kec. Panakkukang, Makassar, Kalimantan Timur", telp:"0823321531", email:"kevin.kusuma30@gmail.com", kancab:"KANCAB PEKANBARU", plafonPum:300000000 },
  { kpa:"DD000022", nrp:"82828034", nik:"3236561108866884", npwp:"59.888.698.1-977.000", nama:"Muhammad Kurniawan",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SUMATERA UTARA", uker:"POLRESTABES MEDAN",
    tglLahir:"1986-08-11", tmt:"2011-06-03", nomorSkep:"KEP/951/VIII/2011", tglSkep:"2011-05-30",
    alamat:"Jl. Cendrawasih No. 98, RT 16/RW 01, Kel. Panakkukang, Kec. Tembalang, Padang, Sumatera Selatan", telp:"0874700025", email:"muhammad.kurniawan29@yahoo.com", kancab:"KANCAB MANADO", plafonPum:300000000 },
  { kpa:"DD000023", nrp:"72732043", nik:"3118682901836456", npwp:"85.677.778.1-185.000", nama:"Agus Iskandar",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SUMATERA UTARA", uker:"POLRESTABES MEDAN",
    tglLahir:"1983-01-29", tmt:"2008-05-28", nomorSkep:"KEP/1374/III/2008", tglSkep:"2008-05-08",
    alamat:"Jl. Melati No. 35, RT 15/RW 03, Kel. Menteng, Kec. Tembalang, Palembang, Sulawesi Selatan", telp:"0848628588", email:"agus.iskandar44@yahoo.com", kancab:"KANCAB PEKANBARU", plafonPum:300000000 },
  { kpa:"DD000024", nrp:"82399599", nik:"3527080309711125", npwp:"93.141.872.1-353.000", nama:"Bayu Susanto",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SUMATERA UTARA", uker:"POLRESTABES MEDAN",
    tglLahir:"1971-09-03", tmt:"1990-11-14", nomorSkep:"KEP/816/I/1990", tglSkep:"1990-11-04",
    alamat:"Jl. Ahmad Yani No. 6, RT 20/RW 03, Kel. Medan Baru, Kec. Rungkut, Yogyakarta, Jawa Barat", telp:"0848801975", email:"bayu.susanto33@outlook.com", kancab:"KANCAB PALU", plafonPum:300000000 },
  { kpa:"DD000025", nrp:"51746937", nik:"3305452203009434", npwp:"96.484.506.4-177.000", nama:"Nanda Yulianto",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA METRO JAYA", uker:"POLRES JAKARTA SELATAN",
    tglLahir:"2000-03-22", tmt:"2019-11-02", nomorSkep:"KEP/1285/II/2019", tglSkep:"2019-10-30",
    alamat:"Jl. Cendrawasih No. 177, RT 08/RW 02, Kel. Sario, Kec. Padang Timur, Semarang, Bali", telp:"0821689025", email:"nanda.yulianto69@yahoo.com", kancab:"KANCAB SERANG", plafonPum:300000000 },
  { kpa:"DD000026", nrp:"66379329", nik:"3338371701977533", npwp:"29.545.280.9-766.000", nama:"Dedi Maulana",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA JAWA TIMUR", uker:"POLRESTABES SURABAYA",
    tglLahir:"1997-01-17", tmt:"2015-02-21", nomorSkep:"KEP/316/VIII/2015", tglSkep:"2015-02-05",
    alamat:"Jl. Diponegoro No. 158, RT 18/RW 13, Kel. Gondokusuman, Kec. Gondokusuman, Palembang, Bali", telp:"0856407373", email:"dedi.maulana12@gmail.com", kancab:"KANCAB MANADO", plafonPum:300000000 },
  { kpa:"DD000027", nrp:"99682738", nik:"3424954411885326", npwp:"33.599.317.6-916.000", nama:"Lestari Zulkarnain",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SULAWESI SELATAN", uker:"POLRESTABES MAKASSAR",
    tglLahir:"1988-11-04", tmt:"2019-09-09", nomorSkep:"KEP/788/VII/2019", tglSkep:"2019-09-06",
    alamat:"Jl. Diponegoro No. 88, RT 09/RW 15, Kel. Denpasar Timur, Kec. Sario, Banjarmasin, Jawa Tengah", telp:"0891170307", email:"lestari.zulkarnain25@outlook.com", kancab:"KANCAB BATAM", plafonPum:300000000 },
  { kpa:"DD000028", nrp:"96691619", nik:"3112312611921525", npwp:"47.326.514.4-413.000", nama:"Bayu Lesmana",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA JAWA BARAT", uker:"POLRESTA BANDUNG",
    tglLahir:"1992-11-26", tmt:"2020-09-05", nomorSkep:"KEP/1105/XII/2020", tglSkep:"2020-08-19",
    alamat:"Jl. Cendrawasih No. 95, RT 16/RW 09, Kel. Klojen, Kec. Panakkukang, Palembang, Kalimantan Timur", telp:"0866902401", email:"bayu.lesmana59@outlook.com", kancab:"KANCAB MANADO", plafonPum:300000000 },
  { kpa:"DD000029", nrp:"26046365", nik:"3222340905003139", npwp:"37.856.595.5-841.000", nama:"Nur Saputra",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA JAWA BARAT", uker:"POLRESTA BANDUNG",
    tglLahir:"2000-05-09", tmt:"2021-07-16", nomorSkep:"KEP/1197/XII/2021", tglSkep:"2021-06-21",
    alamat:"Jl. Cendrawasih No. 195, RT 17/RW 10, Kel. Tembalang, Kec. Cikutra, Pontianak, Sumatera Utara", telp:"0854816534", email:"nur.saputra23@yahoo.com", kancab:"KANCAB MEDAN", plafonPum:300000000 },
  { kpa:"DD000030", nrp:"84270583", nik:"3519042104808043", npwp:"23.993.112.5-580.000", nama:"Jaya Nugroho",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA METRO JAYA", uker:"POLRES JAKARTA SELATAN",
    tglLahir:"1980-04-21", tmt:"2000-06-12", nomorSkep:"KEP/1528/V/2000", tglSkep:"2000-06-05",
    alamat:"Jl. Anggrek No. 113, RT 11/RW 03, Kel. Menteng, Kec. Tembalang, Pontianak, Daerah Istimewa Yogyakarta", telp:"0822096280", email:"jaya.nugroho63@yahoo.com", kancab:"KANCAB BANJARMASIN", plafonPum:300000000 },
  { kpa:"DD000031", nrp:"21432787", nik:"3373751009749934", npwp:"86.909.733.4-894.000", nama:"Bambang Nugroho",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SULAWESI SELATAN", uker:"POLRESTABES MAKASSAR",
    tglLahir:"1974-09-10", tmt:"2005-08-18", nomorSkep:"KEP/342/IV/2005", tglSkep:"2005-07-29",
    alamat:"Jl. Kenanga No. 98, RT 15/RW 15, Kel. Gondokusuman, Kec. Tembalang, Pontianak, Bali", telp:"0876123430", email:"bambang.nugroho80@outlook.com", kancab:"KANCAB BANDUNG", plafonPum:300000000 },
  { kpa:"DD000032", nrp:"98641164", nik:"3214922704779044", npwp:"19.260.102.7-561.000", nama:"Fajar Zulkarnain",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA JAWA BARAT", uker:"POLRESTA BANDUNG",
    tglLahir:"1977-04-27", tmt:"2006-11-14", nomorSkep:"KEP/421/II/2006", tglSkep:"2006-11-04",
    alamat:"Jl. Cendrawasih No. 121, RT 10/RW 01, Kel. Medan Baru, Kec. Tembalang, Manado, Jawa Tengah", telp:"0882194198", email:"fajar.zulkarnain30@outlook.com", kancab:"KANCAB MALANG", plafonPum:300000000 },
  { kpa:"DD000033", nrp:"83089925", nik:"3275091511762331", npwp:"19.161.269.5-709.000", nama:"Marwan Utomo",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SUMATERA UTARA", uker:"POLRESTABES MEDAN",
    tglLahir:"1976-11-15", tmt:"1999-02-24", nomorSkep:"KEP/1426/IV/1999", tglSkep:"1999-02-17",
    alamat:"Jl. Cendrawasih No. 74, RT 15/RW 02, Kel. Gondokusuman, Kec. Sario, Semarang, Sumatera Selatan", telp:"0859396529", email:"marwan.utomo64@outlook.com", kancab:"KANCAB SORONG", plafonPum:300000000 },
  { kpa:"DD000034", nrp:"43603811", nik:"3542911905879425", npwp:"85.121.883.5-690.000", nama:"Ahmad Siregar",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA JAWA TIMUR", uker:"POLRESTABES SURABAYA",
    tglLahir:"1987-05-19", tmt:"2018-07-17", nomorSkep:"KEP/287/I/2018", tglSkep:"2018-07-07",
    alamat:"Jl. Merdeka No. 196, RT 06/RW 08, Kel. Klojen, Kec. Balikpapan Selatan, Yogyakarta, Jawa Tengah", telp:"0838312936", email:"ahmad.siregar63@outlook.com", kancab:"KANCAB BATAM", plafonPum:300000000 },
  { kpa:"DD000035", nrp:"54265498", nik:"3289892705826562", npwp:"80.137.565.2-422.000", nama:"Bayu Gunawan",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA METRO JAYA", uker:"POLRES JAKARTA SELATAN",
    tglLahir:"1982-05-27", tmt:"2007-03-19", nomorSkep:"KEP/1520/VII/2007", tglSkep:"2007-03-01",
    alamat:"Jl. Diponegoro No. 83, RT 04/RW 13, Kel. Ilir Barat, Kec. Klojen, Pontianak, DKI Jakarta", telp:"0898750676", email:"bayu.gunawan7@yahoo.com", kancab:"KANCAB LAMPUNG", plafonPum:300000000 },
  { kpa:"DD000036", nrp:"37321124", nik:"3289771205907179", npwp:"99.596.224.1-745.000", nama:"Oscar Zulkarnain",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SUMATERA UTARA", uker:"POLRESTABES MEDAN",
    tglLahir:"1990-05-12", tmt:"2009-02-26", nomorSkep:"KEP/1224/V/2009", tglSkep:"2009-02-19",
    alamat:"Jl. Cendrawasih No. 62, RT 06/RW 05, Kel. Klojen, Kec. Menteng, Malang, Sumatera Selatan", telp:"0824769851", email:"oscar.zulkarnain60@gmail.com", kancab:"KANCAB CIREBON", plafonPum:300000000 },
  { kpa:"DD000037", nrp:"46698468", nik:"3410482202003994", npwp:"68.664.248.7-295.000", nama:"Indra Lesmana",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA JAWA TIMUR", uker:"POLRESTABES SURABAYA",
    tglLahir:"2000-02-22", tmt:"2023-09-16", nomorSkep:"KEP/1809/VII/2023", tglSkep:"2023-08-29",
    alamat:"Jl. Cendrawasih No. 131, RT 05/RW 14, Kel. Cikutra, Kec. Tembalang, Padang, Sumatera Selatan", telp:"0869518424", email:"indra.lesmana1@yahoo.com", kancab:"KANCAB MATARAM", plafonPum:300000000 },
  { kpa:"DD000038", nrp:"29944139", nik:"3327190808975447", npwp:"80.881.656.7-566.000", nama:"Marwan Purnomo",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA SUMATERA UTARA", uker:"POLRESTABES MEDAN",
    tglLahir:"1997-08-08", tmt:"2024-09-14", nomorSkep:"KEP/1203/VIII/2024", tglSkep:"2024-08-27",
    alamat:"Jl. Veteran No. 49, RT 08/RW 10, Kel. Ilir Barat, Kec. Medan Baru, Pontianak, Sumatera Selatan", telp:"0816338112", email:"marwan.purnomo61@outlook.com", kancab:"KANCAB PEKANBARU", plafonPum:300000000 },
  { kpa:"DD000039", nrp:"89212676", nik:"3389562908691634", npwp:"77.567.115.3-519.000", nama:"Indra Lesmana",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA JAWA BARAT", uker:"POLRESTA BANDUNG",
    tglLahir:"1969-08-29", tmt:"2012-07-13", nomorSkep:"KEP/1881/VI/2012", tglSkep:"2012-07-07",
    alamat:"Jl. Gatot Subroto No. 20, RT 16/RW 13, Kel. Tembalang, Kec. Panakkukang, Denpasar, Sumatera Selatan", telp:"0826512415", email:"indra.lesmana69@outlook.com", kancab:"KANCAB PEKANBARU", plafonPum:300000000 },
  { kpa:"DD000040", nrp:"19183277", nik:"3289344804923728", npwp:"21.544.200.2-554.000", nama:"Yuni Rizaldi",
    angkatan:"POLRI", kategori:"POLRI", statusPersonil:"Anggota POLRI Aktif", unor:"POLDA METRO JAYA", uker:"POLRES JAKARTA SELATAN",
    tglLahir:"1992-04-08", tmt:"2023-11-07", nomorSkep:"KEP/1392/IV/2023", tglSkep:"2023-10-14",
    alamat:"Jl. Gatot Subroto No. 178, RT 10/RW 15, Kel. Menteng, Kec. Menteng, Makassar, DKI Jakarta", telp:"0857014016", email:"yuni.rizaldi56@yahoo.com", kancab:"KANCAB JAYAPURA", plafonPum:300000000 },
  { kpa:"DD000041", nrp:"199808012019121003", nik:"3507140108983946", npwp:"73.697.246.4-572.000", nama:"Bayu Purnomo",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"DITJEN POTHAN KEMHAN", uker:"DIREKTORAT BINA POTENSI WILAYAH PERTAHANAN",
    tglLahir:"1998-08-01", tmt:"2019-12-15", nomorSkep:"KEP/1348/II/2019", tglSkep:"2019-11-30",
    alamat:"Jl. Diponegoro No. 118, RT 09/RW 11, Kel. Menteng, Kec. Padang Timur, Yogyakarta, Jawa Tengah", telp:"0893650391", email:"bayu.purnomo57@gmail.com", kancab:"KANCAB PALEMBANG", plafonPum:300000000 },
  { kpa:"DD000042", nrp:"198701122018032005", nik:"3170905201873887", npwp:"58.685.467.5-816.000", nama:"Nita Suryadi",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"BADAN SARANA PERTAHANAN", uker:"PUSAT PENGELOLAAN ASET PERTAHANAN",
    tglLahir:"1987-01-12", tmt:"2018-03-31", nomorSkep:"KEP/887/IV/2018", tglSkep:"2018-03-13",
    alamat:"Jl. Diponegoro No. 6, RT 13/RW 05, Kel. Menteng, Kec. Denpasar Timur, Pontianak, DKI Jakarta", telp:"0885801541", email:"nita.suryadi78@gmail.com", kancab:"KANCAB PALEMBANG", plafonPum:300000000 },
  { kpa:"DD000043", nrp:"197903302004051001", nik:"3122873003799496", npwp:"56.849.234.2-402.000", nama:"Lukman Ramadhan",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"DITJEN POTHAN KEMHAN", uker:"DIREKTORAT BINA POTENSI WILAYAH PERTAHANAN",
    tglLahir:"1979-03-30", tmt:"2004-05-10", nomorSkep:"KEP/1715/V/2004", tglSkep:"2004-04-23",
    alamat:"Jl. Veteran No. 192, RT 14/RW 03, Kel. Medan Baru, Kec. Rungkut, Padang, Kalimantan Timur", telp:"0869906224", email:"lukman.ramadhan35@outlook.com", kancab:"KANCAB KENDARI", plafonPum:300000000 },
  { kpa:"DD000044", nrp:"198103282020011002", nik:"3595252803813697", npwp:"96.841.790.7-966.000", nama:"Firman Handoko",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"BADAN SARANA PERTAHANAN", uker:"PUSAT PENGELOLAAN ASET PERTAHANAN",
    tglLahir:"1981-03-28", tmt:"2020-01-15", nomorSkep:"KEP/254/VIII/2020", tglSkep:"2020-01-08",
    alamat:"Jl. Kenanga No. 94, RT 03/RW 13, Kel. Ilir Barat, Kec. Menteng, Semarang, Kalimantan Timur", telp:"0828630043", email:"firman.handoko87@yahoo.com", kancab:"KANCAB MALANG", plafonPum:300000000 },
  { kpa:"DD000045", nrp:"199804092021081001", nik:"3315970904989996", npwp:"38.763.164.8-817.000", nama:"Yusuf Saputra",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"DITJEN POTHAN KEMHAN", uker:"DIREKTORAT BINA POTENSI WILAYAH PERTAHANAN",
    tglLahir:"1998-04-09", tmt:"2021-08-23", nomorSkep:"KEP/1910/X/2021", tglSkep:"2021-08-03",
    alamat:"Jl. Diponegoro No. 167, RT 14/RW 02, Kel. Rungkut, Kec. Menteng, Jakarta, Jawa Tengah", telp:"0882948178", email:"yusuf.saputra31@gmail.com", kancab:"KANCAB DENPASAR", plafonPum:300000000 },
  { kpa:"DD000046", nrp:"200105022023081003", nik:"3421700205016687", npwp:"45.133.806.6-322.000", nama:"Yusuf Utomo",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"ITJEN KEMHAN", uker:"INSPEKTORAT JENDERAL KEMHAN",
    tglLahir:"2001-05-02", tmt:"2023-08-25", nomorSkep:"KEP/1441/VII/2023", tglSkep:"2023-08-19",
    alamat:"Jl. Anggrek No. 114, RT 08/RW 14, Kel. Panakkukang, Kec. Cikutra, Balikpapan, Sulawesi Selatan", telp:"0897017548", email:"yusuf.utomo51@gmail.com", kancab:"KANCAB MANADO", plafonPum:300000000 },
  { kpa:"DD000047", nrp:"198805252023111004", nik:"3115002505880829", npwp:"52.349.228.4-170.000", nama:"Gunawan Rizaldi",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"BIRO KEPEGAWAIAN KEMHAN",
    tglLahir:"1988-05-25", tmt:"2023-11-13", nomorSkep:"KEP/1409/XI/2023", tglSkep:"2023-10-22",
    alamat:"Jl. Kenanga No. 54, RT 19/RW 04, Kel. Medan Baru, Kec. Panakkukang, Padang, Jawa Timur", telp:"0815651899", email:"gunawan.rizaldi17@gmail.com", kancab:"KANCAB MALANG", plafonPum:300000000 },
  { kpa:"DD000048", nrp:"196902261995091006", nik:"3111352602692855", npwp:"43.153.229.7-638.000", nama:"Gunawan Utomo",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"DITJEN POTHAN KEMHAN", uker:"DIREKTORAT BINA POTENSI WILAYAH PERTAHANAN",
    tglLahir:"1969-02-26", tmt:"1995-09-01", nomorSkep:"KEP/1305/IV/1995", tglSkep:"1995-08-19",
    alamat:"Jl. Sudirman No. 191, RT 03/RW 08, Kel. Gondokusuman, Kec. Padang Timur, Makassar, Kalimantan Timur", telp:"0828583392", email:"gunawan.utomo29@outlook.com", kancab:"KANCAB BANDA ACEH", plafonPum:300000000 },
  { kpa:"DD000049", nrp:"198807182010051008", nik:"3171761807888033", npwp:"66.175.182.6-722.000", nama:"Iwan Firmansyah",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"BIRO KEPEGAWAIAN KEMHAN",
    tglLahir:"1988-07-18", tmt:"2010-05-14", nomorSkep:"KEP/973/VII/2010", tglSkep:"2010-04-20",
    alamat:"Jl. Gatot Subroto No. 17, RT 05/RW 05, Kel. Denpasar Timur, Kec. Balikpapan Selatan, Denpasar, Kalimantan Timur", telp:"0867390515", email:"iwan.firmansyah68@outlook.com", kancab:"KANCAB MATARAM", plafonPum:300000000 },
  { kpa:"DD000050", nrp:"197206122019091004", nik:"3372201206725554", npwp:"68.508.525.2-420.000", nama:"Nanda Junaedi",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"BIRO KEPEGAWAIAN KEMHAN",
    tglLahir:"1972-06-12", tmt:"2019-09-25", nomorSkep:"KEP/1024/VII/2019", tglSkep:"2019-09-15",
    alamat:"Jl. Melati No. 81, RT 09/RW 06, Kel. Rungkut, Kec. Balikpapan Selatan, Banjarmasin, Daerah Istimewa Yogyakarta", telp:"0822530497", email:"nanda.junaedi12@gmail.com", kancab:"KANCAB SERANG", plafonPum:300000000 },
  { kpa:"DD000051", nrp:"197311012021041009", nik:"3181110111736731", npwp:"55.994.781.7-988.000", nama:"Yusuf Handoko",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"BIRO KEPEGAWAIAN KEMHAN",
    tglLahir:"1973-11-01", tmt:"2021-04-22", nomorSkep:"KEP/775/IX/2021", tglSkep:"2021-03-29",
    alamat:"Jl. Merdeka No. 74, RT 20/RW 05, Kel. Panakkukang, Kec. Cikutra, Denpasar, Kalimantan Timur", telp:"0843595941", email:"yusuf.handoko62@outlook.com", kancab:"KANCAB MADIUN", plafonPum:300000000 },
  { kpa:"DD000052", nrp:"199212132014041005", nik:"3468641312929122", npwp:"13.723.773.5-129.000", nama:"Wahyu Rizaldi",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"BADAN SARANA PERTAHANAN", uker:"PUSAT PENGELOLAAN ASET PERTAHANAN",
    tglLahir:"1992-12-13", tmt:"2014-04-16", nomorSkep:"KEP/563/X/2014", tglSkep:"2014-03-31",
    alamat:"Jl. Gatot Subroto No. 70, RT 10/RW 15, Kel. Panakkukang, Kec. Panakkukang, Jakarta, Jawa Timur", telp:"0837724045", email:"wahyu.rizaldi19@gmail.com", kancab:"KANCAB BALIKPAPAN", plafonPum:300000000 },
  { kpa:"DD000053", nrp:"198411152015031006", nik:"3573911511845315", npwp:"82.710.186.1-259.000", nama:"Iwan Setiawan",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"ITJEN KEMHAN", uker:"INSPEKTORAT JENDERAL KEMHAN",
    tglLahir:"1984-11-15", tmt:"2015-03-06", nomorSkep:"KEP/857/III/2015", tglSkep:"2015-02-22",
    alamat:"Jl. Gatot Subroto No. 194, RT 20/RW 01, Kel. Balikpapan Selatan, Kec. Cikutra, Semarang, Daerah Istimewa Yogyakarta", telp:"0879148051", email:"iwan.setiawan57@outlook.com", kancab:"KANCAB SEMARANG", plafonPum:300000000 },
  { kpa:"DD000054", nrp:"198306262006061005", nik:"3419922606838634", npwp:"95.415.146.4-504.000", nama:"Hadi Saputra",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"ITJEN KEMHAN", uker:"INSPEKTORAT JENDERAL KEMHAN",
    tglLahir:"1983-06-26", tmt:"2006-06-27", nomorSkep:"KEP/1489/XI/2006", tglSkep:"2006-06-06",
    alamat:"Jl. Cendrawasih No. 15, RT 01/RW 04, Kel. Tembalang, Kec. Medan Baru, Padang, Jawa Timur", telp:"0855856117", email:"hadi.saputra16@yahoo.com", kancab:"KANCAB AMBON", plafonPum:300000000 },
  { kpa:"DD000055", nrp:"197310172018111004", nik:"3333111710731181", npwp:"60.982.859.1-546.000", nama:"Cahyo Pratama",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"ITJEN KEMHAN", uker:"INSPEKTORAT JENDERAL KEMHAN",
    tglLahir:"1973-10-17", tmt:"2018-11-21", nomorSkep:"KEP/1244/IX/2018", tglSkep:"2018-10-28",
    alamat:"Jl. Merdeka No. 118, RT 03/RW 14, Kel. Panakkukang, Kec. Denpasar Timur, Palembang, Bali", telp:"0878007741", email:"cahyo.pratama15@yahoo.com", kancab:"KANCAB PONTIANAK", plafonPum:300000000 },
  { kpa:"DD000056", nrp:"199509232023091006", nik:"3260462309957139", npwp:"85.510.636.2-505.000", nama:"Umar Pratama",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"ITJEN KEMHAN", uker:"INSPEKTORAT JENDERAL KEMHAN",
    tglLahir:"1995-09-23", tmt:"2023-09-25", nomorSkep:"KEP/994/II/2023", tglSkep:"2023-09-19",
    alamat:"Jl. Diponegoro No. 191, RT 11/RW 04, Kel. Panakkukang, Kec. Padang Timur, Surabaya, Jawa Barat", telp:"0892913049", email:"umar.pratama66@outlook.com", kancab:"KANCAB LAMPUNG", plafonPum:300000000 },
  { kpa:"DD000057", nrp:"200008172022042002", nik:"3214715708009870", npwp:"29.878.877.2-281.000", nama:"Ratna Hartono",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"DITJEN POTHAN KEMHAN", uker:"DIREKTORAT BINA POTENSI WILAYAH PERTAHANAN",
    tglLahir:"2000-08-17", tmt:"2022-04-29", nomorSkep:"KEP/624/III/2022", tglSkep:"2022-04-20",
    alamat:"Jl. Anggrek No. 119, RT 19/RW 13, Kel. Denpasar Timur, Kec. Gondokusuman, Balikpapan, Bali", telp:"0866303930", email:"ratna.hartono57@gmail.com", kancab:"KANCAB BANJARMASIN", plafonPum:300000000 },
  { kpa:"DD000058", nrp:"198004272016101009", nik:"3397172704800617", npwp:"17.477.951.5-178.000", nama:"Teguh Handoko",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"BIRO KEPEGAWAIAN KEMHAN",
    tglLahir:"1980-04-27", tmt:"2016-10-15", nomorSkep:"KEP/735/II/2016", tglSkep:"2016-09-28",
    alamat:"Jl. Sudirman No. 158, RT 20/RW 09, Kel. Ilir Barat, Kec. Gondokusuman, Denpasar, Kalimantan Timur", telp:"0818545279", email:"teguh.handoko84@outlook.com", kancab:"KANCAB LAMPUNG", plafonPum:300000000 },
  { kpa:"DD000059", nrp:"197410072015031002", nik:"3431670710742828", npwp:"15.353.824.8-549.000", nama:"Firman Maulana",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"BIRO KEPEGAWAIAN KEMHAN",
    tglLahir:"1974-10-07", tmt:"2015-03-18", nomorSkep:"KEP/1562/VI/2015", tglSkep:"2015-03-13",
    alamat:"Jl. Kenanga No. 134, RT 20/RW 03, Kel. Panakkukang, Kec. Panakkukang, Banjarmasin, Jawa Tengah", telp:"0877858012", email:"firman.maulana87@yahoo.com", kancab:"KANCAB BANDUNG", plafonPum:300000000 },
  { kpa:"DD000060", nrp:"198210152015071007", nik:"3495991510822464", npwp:"52.183.696.3-458.000", nama:"Vino Kurniawan",
    angkatan:"KEMHAN", kategori:"ASN Kemenhan", statusPersonil:"PNS/ASN Kementerian Pertahanan", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"BIRO KEPEGAWAIAN KEMHAN",
    tglLahir:"1982-10-15", tmt:"2015-07-07", nomorSkep:"KEP/616/V/2015", tglSkep:"2015-06-13",
    alamat:"Jl. Diponegoro No. 168, RT 13/RW 03, Kel. Denpasar Timur, Kec. Sario, Bandung, Jawa Tengah", telp:"0897319630", email:"vino.kurniawan43@outlook.com", kancab:"KANCAB DENPASAR", plafonPum:300000000 },
  { kpa:"DD000061", nrp:"199612232025101009", nik:"3303422312962954", npwp:"37.449.884.8-296.000", nama:"Iwan Kurniawan",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1996-12-23", tmt:"2025-10-01", nomorSkep:"KEP/137/VI/2025", tglSkep:"2025-09-17",
    alamat:"Jl. Ahmad Yani No. 36, RT 05/RW 02, Kel. Tembalang, Kec. Padang Timur, Bandung, Kalimantan Timur", telp:"0899833734", email:"iwan.kurniawan85@gmail.com", kancab:"KANCAB PALANGKARAYA", plafonPum:260000000 },
  { kpa:"DD000062", nrp:"199410162022092003", nik:"3510435610942713", npwp:"66.144.520.6-792.000", nama:"Hesti Nugroho",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"MABES POLRI", uker:"BIRO SDM POLRI",
    tglLahir:"1994-10-16", tmt:"2022-09-24", nomorSkep:"KEP/1802/III/2022", tglSkep:"2022-08-30",
    alamat:"Jl. Ahmad Yani No. 114, RT 20/RW 05, Kel. Padang Timur, Kec. Sario, Padang, Daerah Istimewa Yogyakarta", telp:"0849959220", email:"hesti.nugroho40@gmail.com", kancab:"KANCAB TERNATE", plafonPum:268000000 },
  { kpa:"DD000063", nrp:"199806052025122008", nik:"3430594506988642", npwp:"63.265.936.4-920.000", nama:"Indah Hartono",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1998-06-05", tmt:"2025-12-10", nomorSkep:"KEP/1693/V/2025", tglSkep:"2025-11-25",
    alamat:"Jl. Cendrawasih No. 36, RT 09/RW 01, Kel. Balikpapan Selatan, Kec. Gondokusuman, Pontianak, Sulawesi Selatan", telp:"0892721170", email:"indah.hartono67@outlook.com", kancab:"KANCAB CIREBON", plafonPum:276000000 },
  { kpa:"DD000064", nrp:"198802262022081007", nik:"3396662602885728", npwp:"13.524.154.7-614.000", nama:"Joko Susanto",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1988-02-26", tmt:"2022-08-27", nomorSkep:"KEP/1964/II/2022", tglSkep:"2022-08-17",
    alamat:"Jl. Veteran No. 61, RT 13/RW 02, Kel. Panakkukang, Kec. Medan Baru, Jakarta, Sulawesi Selatan", telp:"0826625238", email:"joko.susanto18@gmail.com", kancab:"KANCAB BANDA ACEH", plafonPum:220000000 },
  { kpa:"DD000065", nrp:"197403232026041008", nik:"3113462303744194", npwp:"37.955.253.9-844.000", nama:"Firman Wibowo",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1974-03-23", tmt:"2026-04-06", nomorSkep:"KEP/110/X/2026", tglSkep:"2026-04-01",
    alamat:"Jl. Cendrawasih No. 136, RT 14/RW 02, Kel. Padang Timur, Kec. Tembalang, Medan, Jawa Tengah", telp:"0821801102", email:"firman.wibowo54@gmail.com", kancab:"KANCAB SURABAYA", plafonPum:228000000 },
  { kpa:"DD000066", nrp:"199201172026101004", nik:"3382311701920026", npwp:"88.461.346.7-291.000", nama:"Gilang Ramadhan",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"KEMENTERIAN PERTAHANAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN",
    tglLahir:"1992-01-17", tmt:"2026-10-12", nomorSkep:"KEP/394/XII/2026", tglSkep:"2026-09-30",
    alamat:"Jl. Sudirman No. 135, RT 12/RW 02, Kel. Klojen, Kec. Klojen, Malang, Kalimantan Timur", telp:"0891341153", email:"gilang.ramadhan61@yahoo.com", kancab:"KANCAB BANDA ACEH", plafonPum:236000000 },
  { kpa:"DD000067", nrp:"200107102025011002", nik:"3512741007011699", npwp:"84.852.874.6-236.000", nama:"Yusuf Susanto",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"KEMENTERIAN PERTAHANAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN",
    tglLahir:"2001-07-10", tmt:"2025-01-02", nomorSkep:"KEP/593/VI/2025", tglSkep:"2024-12-09",
    alamat:"Jl. Merdeka No. 91, RT 18/RW 06, Kel. Balikpapan Selatan, Kec. Rungkut, Pontianak, Daerah Istimewa Yogyakarta", telp:"0884058117", email:"yusuf.susanto9@gmail.com", kancab:"KANCAB SURABAYA", plafonPum:244000000 },
  { kpa:"DD000068", nrp:"197612122024071005", nik:"3411251212764151", npwp:"14.871.762.4-392.000", nama:"Lukman Wijaya",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"KEMENTERIAN PERTAHANAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN",
    tglLahir:"1976-12-12", tmt:"2024-07-16", nomorSkep:"KEP/915/IX/2024", tglSkep:"2024-06-26",
    alamat:"Jl. Veteran No. 200, RT 02/RW 14, Kel. Balikpapan Selatan, Kec. Panakkukang, Semarang, Jawa Barat", telp:"0868330827", email:"lukman.wijaya96@yahoo.com", kancab:"KANCAB SORONG", plafonPum:252000000 },
  { kpa:"DD000069", nrp:"197605182026072006", nik:"3577515805766956", npwp:"20.540.716.3-658.000", nama:"Sari Gunawan",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"MABES POLRI", uker:"BIRO SDM POLRI",
    tglLahir:"1976-05-18", tmt:"2026-07-31", nomorSkep:"KEP/646/IX/2026", tglSkep:"2026-07-26",
    alamat:"Jl. Diponegoro No. 83, RT 04/RW 02, Kel. Panakkukang, Kec. Balikpapan Selatan, Semarang, Jawa Tengah", telp:"0888149041", email:"sari.gunawan89@gmail.com", kancab:"KANCAB SORONG", plafonPum:260000000 },
  { kpa:"DD000070", nrp:"198310252025111005", nik:"3150182510836656", npwp:"56.625.920.3-131.000", nama:"Ahmad Yulianto",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1983-10-25", tmt:"2025-11-17", nomorSkep:"KEP/1720/XI/2025", tglSkep:"2025-11-13",
    alamat:"Jl. Gatot Subroto No. 156, RT 15/RW 01, Kel. Rungkut, Kec. Cikutra, Medan, Sulawesi Selatan", telp:"0867423230", email:"ahmad.yulianto5@outlook.com", kancab:"KANCAB JAYAPURA", plafonPum:268000000 },
  { kpa:"DD000071", nrp:"198711302022071009", nik:"3526703011874567", npwp:"41.216.126.3-611.000", nama:"Yusuf Hartono",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"KEMENTERIAN PERTAHANAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN",
    tglLahir:"1987-11-30", tmt:"2022-07-18", nomorSkep:"KEP/915/VI/2022", tglSkep:"2022-07-05",
    alamat:"Jl. Kenanga No. 100, RT 18/RW 02, Kel. Tembalang, Kec. Padang Timur, Semarang, Daerah Istimewa Yogyakarta", telp:"0845791184", email:"yusuf.hartono63@outlook.com", kancab:"KANCAB LAMPUNG", plafonPum:276000000 },
  { kpa:"DD000072", nrp:"197509292025121002", nik:"3538682909755693", npwp:"18.663.655.5-407.000", nama:"Dedi Kusuma",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1975-09-29", tmt:"2025-12-29", nomorSkep:"KEP/1831/XI/2025", tglSkep:"2025-12-16",
    alamat:"Jl. Gatot Subroto No. 183, RT 06/RW 13, Kel. Panakkukang, Kec. Klojen, Medan, Jawa Barat", telp:"0843329967", email:"dedi.kusuma64@gmail.com", kancab:"KANCAB BALIKPAPAN", plafonPum:220000000 },
  { kpa:"DD000073", nrp:"198812182022061002", nik:"3570851812887843", npwp:"77.520.887.7-943.000", nama:"Lutfi Hartono",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1988-12-18", tmt:"2022-06-16", nomorSkep:"KEP/733/II/2022", tglSkep:"2022-06-01",
    alamat:"Jl. Cendrawasih No. 19, RT 05/RW 06, Kel. Balikpapan Selatan, Kec. Cikutra, Yogyakarta, Daerah Istimewa Yogyakarta", telp:"0896779998", email:"lutfi.hartono71@gmail.com", kancab:"KANCAB KUPANG", plafonPum:228000000 },
  { kpa:"DD000074", nrp:"199007222022051009", nik:"3207152207905287", npwp:"38.454.631.5-966.000", nama:"Hendra Junaedi",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"KEMENTERIAN PERTAHANAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN",
    tglLahir:"1990-07-22", tmt:"2022-05-24", nomorSkep:"KEP/722/III/2022", tglSkep:"2022-05-16",
    alamat:"Jl. Sudirman No. 65, RT 07/RW 11, Kel. Klojen, Kec. Tembalang, Surabaya, Jawa Tengah", telp:"0892567468", email:"hendra.junaedi83@outlook.com", kancab:"KANCAB KENDARI", plafonPum:236000000 },
  { kpa:"DD000075", nrp:"197509052024101001", nik:"3521390509759450", npwp:"43.766.315.7-732.000", nama:"Marwan Nugroho",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1975-09-05", tmt:"2024-10-14", nomorSkep:"KEP/266/I/2024", tglSkep:"2024-10-10",
    alamat:"Jl. Merdeka No. 128, RT 18/RW 05, Kel. Balikpapan Selatan, Kec. Tembalang, Yogyakarta, Sumatera Utara", telp:"0875990112", email:"marwan.nugroho10@yahoo.com", kancab:"KANCAB BANDUNG", plafonPum:244000000 },
  { kpa:"DD000076", nrp:"198810312024101003", nik:"3310273110885659", npwp:"61.233.878.6-627.000", nama:"Bayu Lesmana",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"KEMENTERIAN PERTAHANAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN",
    tglLahir:"1988-10-31", tmt:"2024-10-25", nomorSkep:"KEP/1864/VI/2024", tglSkep:"2024-09-30",
    alamat:"Jl. Kenanga No. 28, RT 11/RW 04, Kel. Gondokusuman, Kec. Cikutra, Semarang, Daerah Istimewa Yogyakarta", telp:"0843363534", email:"bayu.lesmana7@gmail.com", kancab:"KANCAB MATARAM", plafonPum:252000000 },
  { kpa:"DD000077", nrp:"197902192024092006", nik:"3427555902798434", npwp:"69.610.415.8-123.000", nama:"Hesti Junaedi",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"KEMENTERIAN PERTAHANAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN",
    tglLahir:"1979-02-19", tmt:"2024-09-03", nomorSkep:"KEP/1662/IV/2024", tglSkep:"2024-08-26",
    alamat:"Jl. Sudirman No. 101, RT 17/RW 08, Kel. Medan Baru, Kec. Medan Baru, Denpasar, Sulawesi Selatan", telp:"0811847927", email:"hesti.junaedi64@yahoo.com", kancab:"KANCAB TERNATE", plafonPum:260000000 },
  { kpa:"DD000078", nrp:"197210272022071005", nik:"3340832710720742", npwp:"61.152.683.9-299.000", nama:"Budi Rizaldi",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"MABES POLRI", uker:"BIRO SDM POLRI",
    tglLahir:"1972-10-27", tmt:"2022-07-03", nomorSkep:"KEP/849/XII/2022", tglSkep:"2022-06-18",
    alamat:"Jl. Veteran No. 142, RT 10/RW 02, Kel. Ilir Barat, Kec. Klojen, Yogyakarta, Kalimantan Timur", telp:"0852993318", email:"budi.rizaldi13@gmail.com", kancab:"KANCAB PONTIANAK", plafonPum:268000000 },
  { kpa:"DD000079", nrp:"198405262023031009", nik:"3130702605840638", npwp:"27.830.441.8-631.000", nama:"Vino Nasution",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"KEMENTERIAN PERTAHANAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN",
    tglLahir:"1984-05-26", tmt:"2023-03-27", nomorSkep:"KEP/1124/VII/2023", tglSkep:"2023-03-23",
    alamat:"Jl. Anggrek No. 39, RT 20/RW 15, Kel. Klojen, Kec. Rungkut, Makassar, Bali", telp:"0863726331", email:"vino.nasution79@yahoo.com", kancab:"KANCAB MEDAN", plafonPum:276000000 },
  { kpa:"DD000080", nrp:"199011122026061005", nik:"3342411211905428", npwp:"96.212.526.5-915.000", nama:"Hadi Permadi",
    angkatan:"PPPK", kategori:"PPPK", statusPersonil:"PPPK Kementerian Pertahanan/POLRI", unor:"SEKRETARIAT JENDERAL KEMHAN", uker:"PUSAT DATA DAN INFORMASI KEMHAN",
    tglLahir:"1990-11-12", tmt:"2026-06-30", nomorSkep:"KEP/1770/VIII/2026", tglSkep:"2026-06-27",
    alamat:"Jl. Merdeka No. 153, RT 16/RW 05, Kel. Balikpapan Selatan, Kec. Padang Timur, Padang, Bali", telp:"0841861596", email:"hadi.permadi62@outlook.com", kancab:"KANCAB KENDARI", plafonPum:220000000 }
];
DATA_MASTER_PESERTA.push(...DATA_DUMMY_PESERTA_TNI_POLRI_ASN_PPPK);

/* NRP/NIP dummy yang sengaja dibuat gampang diingat untuk menguji validasi
   "NRP/NIP sudah terdaftar" di form Pendaftaran Peserta Baru — ketik salah
   satu nomor di bawah pada field NRP/NIP, pesan error langsung muncul.
   Formatnya mewakili tiap pola nomor yang dipakai di prototipe: NRP prajurit
   6 digit, NRP Polri 8 digit, dan NIP PNS/PPPK 18 digit. Ikut didorong ke
   DATA_MASTER_PESERTA supaya sumber validasinya sama dengan peserta lain.
   Daftar nomornya juga ditampilkan sebagai catatan di bawah field NRP/NIP. */
const DATA_NRP_TERDAFTAR_DEMO = [
  { kpa:"DM000001", nrp:"111111",             npwp:"11.111.111.1-111.000", nama:"Dedi Kurniawan",
    angkatan:"TNI-AD", uker:"KODIM 0602/SERANG",             plafonPum:300000000 },
  { kpa:"DM000002", nrp:"222222",             npwp:"22.222.222.2-222.000", nama:"Sri Wahyuni",
    angkatan:"TNI-AL", uker:"LANTAMAL III JAKARTA",          plafonPum:310000000 },
  { kpa:"DM000003", nrp:"333333",             npwp:"33.333.333.3-333.000", nama:"Bayu Anggara",
    angkatan:"TNI-AU", uker:"LANUD HALIM PERDANAKUSUMA",     plafonPum:320000000 },
  { kpa:"DM000004", nrp:"88001122",           npwp:"44.444.444.4-444.000", nama:"Rina Puspita",
    angkatan:"Polri",  uker:"POLRES JAKARTA SELATAN",        plafonPum:330000000 },
  { kpa:"DM000005", nrp:"199001012015011001", npwp:"55.555.555.5-555.000", nama:"Hendra Saputra",
    angkatan:"KEMHAN", uker:"BIRO SUMBER DAYA MANUSIA KEMHAN", plafonPum:340000000 }
];
DATA_MASTER_PESERTA.push(...DATA_NRP_TERDAFTAR_DEMO);

/* Riwayat kepangkatan peserta dari sistem kepesertaan (dipakai di Kepangkatan
   pengajuan KPR (PUM) — ditampilkan otomatis saat KTPA cocok, hanya sebagian
   Nomor KPA di DATA_MASTER_PESERTA yang punya riwayat untuk simulasi). */
const DATA_RIWAYAT_KEPANGKATAN = {
  CD317049: [
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/041/III/2008", tmt:"2008-03-01", tglSkep:"2008-02-20" },
    { pangkat:"Kopral Satu",   nomorSkep:"KEP/118/IV/2013",  tmt:"2013-04-01", tglSkep:"2013-03-18" },
    { pangkat:"Kopral Kepala", nomorSkep:"KEP/206/V/2019",   tmt:"2019-05-01", tglSkep:"2019-04-22" }
  ],
  CY104869: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/018/II/1998", tmt:"1998-03-01", tglSkep:"1998-02-16" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/095/II/2003", tmt:"2003-03-01", tglSkep:"2003-02-14" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/172/II/2009", tmt:"2009-03-01", tglSkep:"2009-02-12" }
  ],
  CE360625: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/026/IV/2000", tmt:"2000-05-01", tglSkep:"2000-04-18" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/101/IV/2005", tmt:"2005-05-01", tglSkep:"2005-04-16" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/178/IV/2011", tmt:"2011-05-01", tglSkep:"2011-04-14" }
  ],
  CE358403: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/031/V/1999", tmt:"1999-06-01", tglSkep:"1999-05-20" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/108/V/2004", tmt:"2004-06-01", tglSkep:"2004-05-18" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/185/V/2010", tmt:"2010-06-01", tglSkep:"2010-05-16" }
  ],
  CD319552: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/037/VI/2001", tmt:"2001-07-01", tglSkep:"2001-06-19" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/114/VI/2006", tmt:"2006-07-01", tglSkep:"2006-06-17" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/191/VI/2012", tmt:"2012-07-01", tglSkep:"2012-06-15" }
  ],
  CC306323: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/042/VII/1997", tmt:"1997-08-01", tglSkep:"1997-07-21" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/119/VII/2002", tmt:"2002-08-01", tglSkep:"2002-07-19" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/196/VII/2008", tmt:"2008-08-01", tglSkep:"2008-07-17" }
  ],
  CD400871: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/048/VIII/2003", tmt:"2003-09-01", tglSkep:"2003-08-22" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/125/VIII/2008", tmt:"2008-09-01", tglSkep:"2008-08-20" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/202/VIII/2014", tmt:"2014-09-01", tglSkep:"2014-08-18" }
  ],
  EP000112: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/053/IX/2005", tmt:"2005-10-01", tglSkep:"2005-09-23" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/130/IX/2010", tmt:"2010-10-01", tglSkep:"2010-09-21" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/207/IX/2016", tmt:"2016-10-01", tglSkep:"2016-09-19" }
  ],
  AD500221: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/012/I/1999",   tmt:"1999-04-01", tglSkep:"1999-03-15" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/089/VI/2004",  tmt:"2004-06-01", tglSkep:"2004-05-19" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/157/II/2011",  tmt:"2011-02-01", tglSkep:"2011-01-20" }
  ],
  AL600334: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/059/I/2002", tmt:"2002-02-01", tglSkep:"2002-01-24" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/136/I/2007", tmt:"2007-02-01", tglSkep:"2007-01-22" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/213/I/2013", tmt:"2013-02-01", tglSkep:"2013-01-20" }
  ],
  AU700445: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/064/X/1996", tmt:"1996-11-01", tglSkep:"1996-10-25" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/141/X/2001", tmt:"2001-11-01", tglSkep:"2001-10-23" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/218/X/2007", tmt:"2007-11-01", tglSkep:"2007-10-21" }
  ],
  PL800556: [
    { pangkat:"Bhayangkara Dua",   nomorSkep:"KEP/027/VII/2009", tmt:"2009-07-01", tglSkep:"2009-06-22" },
    { pangkat:"Bhayangkara Satu",  nomorSkep:"KEP/095/VIII/2014", tmt:"2014-08-01", tglSkep:"2014-07-25" },
    { pangkat:"Brigadir Polisi Dua", nomorSkep:"KEP/183/IX/2020", tmt:"2020-09-01", tglSkep:"2020-08-24" }
  ],
  AD500667: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/069/III/2004", tmt:"2004-04-01", tglSkep:"2004-03-26" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/146/III/2009", tmt:"2009-04-01", tglSkep:"2009-03-24" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/223/III/2015", tmt:"2015-04-01", tglSkep:"2015-03-22" }
  ],
  AL600778: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/074/XI/2000", tmt:"2000-12-01", tglSkep:"2000-11-27" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/151/XI/2005", tmt:"2005-12-01", tglSkep:"2005-11-25" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/228/XI/2011", tmt:"2011-12-01", tglSkep:"2011-11-23" }
  ],
  PL800889: [
    { pangkat:"Bhayangkara Dua",     nomorSkep:"KEP/079/XII/2002", tmt:"2003-01-01", tglSkep:"2002-12-24" },
    { pangkat:"Bhayangkara Satu",    nomorSkep:"KEP/156/XII/2007", tmt:"2008-01-01", tglSkep:"2007-12-22" },
    { pangkat:"Brigadir Polisi Dua", nomorSkep:"KEP/233/XII/2013", tmt:"2014-01-01", tglSkep:"2013-12-20" }
  ],
  TA910123: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/084/I/1999", tmt:"1999-02-01", tglSkep:"1999-01-25" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/161/I/2004", tmt:"2004-02-01", tglSkep:"2004-01-23" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/238/I/2010", tmt:"2010-02-01", tglSkep:"2010-01-21" }
  ],
  TB920234: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/089/II/2006", tmt:"2006-03-01", tglSkep:"2006-02-21" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/166/II/2011", tmt:"2011-03-01", tglSkep:"2011-02-19" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/243/II/2017", tmt:"2017-03-01", tglSkep:"2017-02-17" }
  ],
  LA930345: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/094/III/2001", tmt:"2001-04-01", tglSkep:"2001-03-24" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/171/III/2006", tmt:"2006-04-01", tglSkep:"2006-03-22" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/248/III/2012", tmt:"2012-04-01", tglSkep:"2012-03-20" }
  ],
  LB940456: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/099/IV/2010", tmt:"2010-05-01", tglSkep:"2010-04-23" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/176/IV/2015", tmt:"2015-05-01", tglSkep:"2015-04-21" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/253/IV/2021", tmt:"2021-05-01", tglSkep:"2021-04-19" }
  ],
  UA950567: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/104/V/1998", tmt:"1998-06-01", tglSkep:"1998-05-22" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/181/V/2003", tmt:"2003-06-01", tglSkep:"2003-05-20" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/258/V/2009", tmt:"2009-06-01", tglSkep:"2009-05-18" }
  ],
  UB960678: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/109/VI/2007", tmt:"2007-07-01", tglSkep:"2007-06-23" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/186/VI/2012", tmt:"2012-07-01", tglSkep:"2012-06-21" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/263/VI/2018", tmt:"2018-07-01", tglSkep:"2018-06-19" }
  ],
  PA970789: [
    { pangkat:"Bhayangkara Dua",     nomorSkep:"KEP/114/VII/2005", tmt:"2005-08-01", tglSkep:"2005-07-24" },
    { pangkat:"Bhayangkara Satu",    nomorSkep:"KEP/191/VII/2010", tmt:"2010-08-01", tglSkep:"2010-07-22" },
    { pangkat:"Brigadir Polisi Dua", nomorSkep:"KEP/268/VII/2016", tmt:"2016-08-01", tglSkep:"2016-07-20" }
  ],
  PB980890: [
    { pangkat:"Bhayangkara Dua",     nomorSkep:"KEP/119/VIII/2004", tmt:"2004-09-01", tglSkep:"2004-08-24" },
    { pangkat:"Bhayangkara Satu",    nomorSkep:"KEP/196/VIII/2009", tmt:"2009-09-01", tglSkep:"2009-08-22" },
    { pangkat:"Brigadir Polisi Dua", nomorSkep:"KEP/273/VIII/2015", tmt:"2015-09-01", tglSkep:"2015-08-20" }
  ],
  PC990901: [
    { pangkat:"Bhayangkara Dua",     nomorSkep:"KEP/124/IX/2002", tmt:"2002-10-01", tglSkep:"2002-09-23" },
    { pangkat:"Bhayangkara Satu",    nomorSkep:"KEP/201/IX/2007", tmt:"2007-10-01", tglSkep:"2007-09-21" },
    { pangkat:"Brigadir Polisi Dua", nomorSkep:"KEP/278/IX/2013", tmt:"2013-10-01", tglSkep:"2013-09-19" }
  ],
  TC911012: [
    { pangkat:"Prajurit Dua",  nomorSkep:"KEP/129/XII/1999", tmt:"2000-01-01", tglSkep:"1999-12-24" },
    { pangkat:"Prajurit Satu", nomorSkep:"KEP/206/XII/2004", tmt:"2005-01-01", tglSkep:"2004-12-22" },
    { pangkat:"Kopral Dua",    nomorSkep:"KEP/283/XII/2010", tmt:"2011-01-01", tglSkep:"2010-12-20" }
  ],
  BP000111: [
    { pangkat:"Brigadir Polisi Dua",  nomorSkep:"KEP/033/V/2007",  tmt:"2007-05-01", tglSkep:"2007-04-18" },
    { pangkat:"Brigadir Polisi Satu", nomorSkep:"KEP/104/VI/2012", tmt:"2012-06-01", tglSkep:"2012-05-21" },
    { pangkat:"Brigadir Polisi Kepala", nomorSkep:"KEP/199/X/2018", tmt:"2018-10-01", tglSkep:"2018-09-14" }
  ],

  /* Masa Kerja Dinas dihitung otomatis dari TMT tertua di sini (lihat
     pfEarliestTmt() di app.js) — TMT baru supaya ketiganya < 2 Tahun per
     hari ini (24 Agustus 2026). */
  AD500992: [
    { pangkat:"Prajurit Dua", nomorSkep:"KEP/012/VIII/2025", tmt:"2025-09-01", tglSkep:"2025-08-19" }
  ],
  AL600992: [
    { pangkat:"Prajurit Dua", nomorSkep:"KEP/018/XII/2024", tmt:"2025-01-01", tglSkep:"2024-12-18" }
  ],
  AU700992: [
    { pangkat:"Prajurit Dua", nomorSkep:"KEP/024/IX/2024", tmt:"2024-10-01", tglSkep:"2024-09-19" }
  ]
};

/* ---------------------------------------------------------------------------
   3. PARAMETER PLAFON KPR (PUM)
   --------------------------------------------------------------------------- */
/* Parameter Plafon PUM KPR — Status Personil → Angkatan → Golongan → Pangkat,
   dari yang paling luas ke paling spesifik; tiap kombinasi punya Nominal
   Plafon sendiri. Dipakai di form "Input Plafon" (dropdown berjenjang, lihat
   plafonPangkatOptions() di app.js) dan tabel Parameter Plafon. */
const PLAFON_STATUS_PERSONIL = ["Prajurit", "ASN"];
const PLAFON_ANGKATAN = ["TNI-AD", "TNI-AU", "TNI-AL", "POLRI", "ASN"];
const PLAFON_KESATUAN = ["Mabes TNI", "Mabes POLRI", "Kementrian Pertahanan"];
const PLAFON_GOLONGAN = ["TAMTAMA", "BINTARA", "PAMA", "PAMEN", "PATI", "GOL. I", "GOL. II", "GOL. III", "GOL. IV"];

/* Pilihan Pangkat mengikuti kombinasi Status Personil|Angkatan|Golongan. */
const PLAFON_PANGKAT = {
  "Prajurit|TNI-AD|TAMTAMA": ["KOPTU", "KOPDA", "PRAKA", "PRATU", "PRADA", "KOPKA"],
  "Prajurit|TNI-AD|BINTARA": ["SERMA", "SERTU", "PELTU", "PELDA", "SERKA", "SERDA"],
  "Prajurit|TNI-AD|PAMA":    ["LETDA", "KAPTEN", "LETTU"],
  "Prajurit|TNI-AD|PAMEN":   ["LETKOL", "MAYOR", "KOLONEL"],
  "Prajurit|TNI-AD|PATI":    ["BRIGJEN TNI", "MAYJEN TNI", "JENDERAL TNI", "LETJEN TNI"],

  "Prajurit|TNI-AU|TAMTAMA": ["PRAKA", "KOPKA", "PRADA", "KOPTU", "KOPDA", "PRATU"],
  "Prajurit|TNI-AU|BINTARA": ["PELDA", "SERDA", "SERKA", "SERMA", "PELTU", "SERTU"],
  "Prajurit|TNI-AU|PAMA":    ["KAPTEN", "LETTU", "LETDA"],
  "Prajurit|TNI-AU|PAMEN":   ["MAYOR", "LETKOL", "KOLONEL"],
  "Prajurit|TNI-AU|PATI":    ["MARSDYA TNI", "MARSDA TNI", "MARSEKAL TNI", "MARSMA TNI"],

  "Prajurit|TNI-AL|TAMTAMA": ["KOPTU", "KOPDA", "KELASI KEPALA", "KELASI I", "KOPKA", "KELASI II"],
  "Prajurit|TNI-AL|BINTARA": ["SERMA", "SERKA", "SERDA", "SERTU", "PELDA", "PELTU"],
  "Prajurit|TNI-AL|PAMA":    ["LETTU", "KAPTEN", "LETDA"],
  "Prajurit|TNI-AL|PAMEN":   ["LETKOL", "MAYOR", "KOLONEL"],
  "Prajurit|TNI-AL|PATI":    ["LAKSMA TNI", "LAKSDYA TNI", "LAKSDA TNI", "LAKSAMANA TNI"],

  "Prajurit|POLRI|TAMTAMA":  ["BHARATU", "ABRIP", "BHARAKA", "ABRIPDA", "ABRIPTU", "BHARADA"],
  "Prajurit|POLRI|BINTARA":  ["AIPTU", "AIPDA", "BRIPKA", "BRIPTU", "BRIPDA", "BRIGADIR"],
  "Prajurit|POLRI|PAMA":     ["AKP", "IPDA", "IPTU"],
  "Prajurit|POLRI|PAMEN":    ["AKBP", "KOMBES POL", "KOMPOL"],
  "Prajurit|POLRI|PATI":     ["KOMJEN POL", "IRJEN POL", "BRIGJEN POL", "JENDERAL POL"],

  "ASN|ASN|GOL. I":   ["GOL.I/A", "GOL.I/B", "GOL.I/C", "GOL.I/D"],
  "ASN|ASN|GOL. II":  ["GOL.II/A", "GOL.II/B", "GOL.II/C", "GOL.II/D"],
  "ASN|ASN|GOL. III": ["GOL.III/A", "GOL.III/B", "GOL.III/C", "GOL.III/D"],
  "ASN|ASN|GOL. IV":  ["GOL.IV/A", "GOL.IV/B", "GOL.IV/C", "GOL.IV/D", "GOL.IV/E"]
};

const DATA_PARAMETER_PLAFON = [
  { statusPersonil:"Prajurit", angkatan:"TNI-AD", kesatuan:"Mabes TNI",   golongan:"TAMTAMA", pangkat:"PRADA",       nominal:250000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AD", kesatuan:"Mabes TNI",   golongan:"BINTARA", pangkat:"SERDA",       nominal:300000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AD", kesatuan:"Mabes TNI",   golongan:"PAMA",    pangkat:"LETDA",       nominal:350000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AD", kesatuan:"Mabes TNI",   golongan:"PAMEN",   pangkat:"MAYOR",       nominal:400000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AD", kesatuan:"Mabes TNI",   golongan:"PATI",    pangkat:"BRIGJEN TNI", nominal:450000000 },

  { statusPersonil:"Prajurit", angkatan:"TNI-AL", kesatuan:"Mabes TNI",   golongan:"TAMTAMA", pangkat:"KELASI II",   nominal:260000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AL", kesatuan:"Mabes TNI",   golongan:"BINTARA", pangkat:"SERDA",       nominal:310000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AL", kesatuan:"Mabes TNI",   golongan:"PAMA",    pangkat:"LETDA",       nominal:360000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AL", kesatuan:"Mabes TNI",   golongan:"PAMEN",   pangkat:"MAYOR",       nominal:410000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AL", kesatuan:"Mabes TNI",   golongan:"PATI",    pangkat:"LAKSMA TNI",  nominal:460000000 },

  { statusPersonil:"Prajurit", angkatan:"TNI-AU", kesatuan:"Mabes TNI",   golongan:"TAMTAMA", pangkat:"PRADA",       nominal:270000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AU", kesatuan:"Mabes TNI",   golongan:"BINTARA", pangkat:"SERDA",       nominal:320000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AU", kesatuan:"Mabes TNI",   golongan:"PAMA",    pangkat:"LETDA",       nominal:370000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AU", kesatuan:"Mabes TNI",   golongan:"PAMEN",   pangkat:"MAYOR",       nominal:420000000 },
  { statusPersonil:"Prajurit", angkatan:"TNI-AU", kesatuan:"Mabes TNI",   golongan:"PATI",    pangkat:"MARSMA TNI",  nominal:470000000 },

  { statusPersonil:"Prajurit", angkatan:"POLRI",  kesatuan:"Mabes POLRI", golongan:"TAMTAMA", pangkat:"BHARADA",     nominal:240000000 },
  { statusPersonil:"Prajurit", angkatan:"POLRI",  kesatuan:"Mabes POLRI", golongan:"BINTARA", pangkat:"BRIPDA",      nominal:290000000 },
  { statusPersonil:"Prajurit", angkatan:"POLRI",  kesatuan:"Mabes POLRI", golongan:"PAMA",    pangkat:"IPDA",        nominal:340000000 },
  { statusPersonil:"Prajurit", angkatan:"POLRI",  kesatuan:"Mabes POLRI", golongan:"PAMEN",   pangkat:"KOMPOL",      nominal:390000000 },
  { statusPersonil:"Prajurit", angkatan:"POLRI",  kesatuan:"Mabes POLRI", golongan:"PATI",    pangkat:"BRIGJEN POL", nominal:440000000 },

  { statusPersonil:"ASN", angkatan:"ASN", kesatuan:"Kementrian Pertahanan", golongan:"GOL. I",   pangkat:"GOL.I/A",   nominal:180000000 },
  { statusPersonil:"ASN", angkatan:"ASN", kesatuan:"Kementrian Pertahanan", golongan:"GOL. II",  pangkat:"GOL.II/A",  nominal:230000000 },
  { statusPersonil:"ASN", angkatan:"ASN", kesatuan:"Kementrian Pertahanan", golongan:"GOL. III", pangkat:"GOL.III/A", nominal:280000000 },
  { statusPersonil:"ASN", angkatan:"ASN", kesatuan:"Kementrian Pertahanan", golongan:"GOL. IV",  pangkat:"GOL.IV/A",  nominal:330000000 }
];

/* Pemetaan Pangkat (opsi dropdown "Pangkat" di Data Peserta PUM KPR) → nilai
   Golongan di Parameter Plafon, dipakai untuk mencocokkan Plafon di Detail
   Pengajuan dengan Parameter Plafon (per Angkatan peserta + Golongan
   pangkatnya). Nilai target di sini sengaja disamakan dengan PLAFON_GOLONGAN
   (data.js) walau katalog Pangkat di dua tempat ini tidak identik. */
const PANGKAT_TO_GOLONGAN = {
  /* PNS */
  "GOL.I/A":"GOL. I", "GOL.I/B":"GOL. I", "GOL.I/C":"GOL. I", "GOL.I/D":"GOL. I",
  "GOL.II/A":"GOL. II", "GOL.II/B":"GOL. II", "GOL.II/C":"GOL. II", "GOL.II/D":"GOL. II",
  "GOL.III/A":"GOL. III", "GOL.III/B":"GOL. III", "GOL.III/C":"GOL. III", "GOL.III/D":"GOL. III",
  "GOL.IV/A":"GOL. IV", "GOL.IV/B":"GOL. IV", "GOL.IV/C":"GOL. IV",
  "GOL.IV/D":"GOL. IV", "GOL.IV/E":"GOL. IV",

  /* TNI-AD / TNI-AU: Tamtama & Bintara */
  "PRADA":"TAMTAMA", "PRATU":"TAMTAMA", "PRAKA":"TAMTAMA", "KOPDA":"TAMTAMA", "KOPTU":"TAMTAMA", "KOPKA":"TAMTAMA",
  "SERDA":"BINTARA", "SERTU":"BINTARA", "SERKA":"BINTARA", "SERMA":"BINTARA", "PELDA":"BINTARA", "PELTU":"BINTARA",
  /* TNI-AD/AL/AU: Pama & Pamen (nama pangkat sama di ketiga Angkatan) */
  "LETDA":"PAMA", "LETTU":"PAMA", "KAPTEN":"PAMA",
  "MAYOR":"PAMEN", "LETKOL":"PAMEN", "KOLONEL":"PAMEN",
  /* TNI-AD Pati */
  "BRIGJEN TNI":"PATI", "MAYJEN TNI":"PATI", "LETJEN TNI":"PATI", "JENDERAL TNI":"PATI",
  /* TNI-AL: Tamtama & Pati */
  "KELASI DUA":"TAMTAMA", "KELASI SATU":"TAMTAMA", "KELASI KEPALA":"TAMTAMA",
  "LAKSMA TNI":"PATI", "LAKSDA TNI":"PATI", "LAKSDYA TNI":"PATI", "LAKSAMANA TNI":"PATI",
  /* TNI-AU: Pati */
  "MARSMA TNI":"PATI", "MARSDA TNI":"PATI", "MARSDYA TNI":"PATI", "MARSEKAL TNI":"PATI",

  /* POLRI */
  "BHARADA":"TAMTAMA", "BHARATU":"TAMTAMA", "BHARAKA":"TAMTAMA", "ABRIPDA":"TAMTAMA", "ABRIPTU":"TAMTAMA", "ABRIP":"TAMTAMA",
  "BRIPDA":"BINTARA", "BRIPTU":"BINTARA", "BRIPKA":"BINTARA", "BRIGADIR":"BINTARA", "AIPDA":"BINTARA", "AIPTU":"BINTARA",
  "IPDA":"PAMA", "IPTU":"PAMA", "AKP":"PAMA",
  "KOMPOL":"PAMEN", "AKBP":"PAMEN", "KOMBES POL":"PAMEN",
  "BRIGJEN POL":"PATI", "IRJEN POL":"PATI", "KOMJEN POL":"PATI", "JENDERAL POL":"PATI"

  /* PPPK (GOL.I–GOL.XVII) sengaja tidak dipetakan — sistem golongannya
     berbeda dari Golongan di Parameter Plafon, jadi Plafon untuk Pangkat
     PPPK jatuh kembali ke plafon bawaan peserta. */
};

/* ---------------------------------------------------------------------------
   4. PARAMETER PERNYATAAN TANGGUNG JAWAB
   --------------------------------------------------------------------------- */
/* Parameter Pernyataan Tanggung Jawab — isi poin-poin disclaimer "Pernyataan
   Atas Tanggung Jawab dan Keabsahan Data Pengajuan KPR (PUM)" yang wajib
   dicentang PIC UNOR/Kesatuan sebelum Simpan Draft Pengajuan (lihat
   pf6BukaPernyataan() di app.js). Dikelola lewat Sub Modul Parameter
   Pernyataan Tanggung Jawab — urutan array = urutan nomor poin di popup. */
const DATA_PERNYATAAN_TANGGUNG_JAWAB = [
  { judul:"Keabsahan Data & Dokumen",
    isi:"Seluruh data, dokumen, dan informasi prajurit/anggota/peserta yang diunggah dan diinput ke dalam sistem ini adalah benar, sah, akurat, dan sesuai dengan dokumen aslinya." },
  { judul:"Verifikasi Internal",
    isi:"Saya telah melakukan proses pemeriksaan dan verifikasi secara mandiri di tingkat UNOR/Kesatuan atas pemenuhan syarat kelayakan Pengajuan KPR (PUM) ASABRI bagi peserta yang bersangkutan." },
  { judul:"Pernyataan Tanggung Jawab & Risiko Legal",
    isi:"Apabila di kemudian hari ditemukan ketidaksesuaian, pemalsuan data/dokumen, atau timbul permasalahan hukum maupun administratif terkait pengajuan ini, maka tanggung jawab penuh (baik administratif, perdata, maupun pidana) berada pada pihak PIC UNOR/Kesatuan, serta membebaskan pihak PT ASABRI (Persero) dari segala tuntutan hukum yang timbul akibat kesalahan penginputan data tersebut." },
  { judul:"Persetujuan Ketentuan",
    isi:"Saya telah membaca, memahami, dan menyetujui seluruh syarat, ketentuan, serta prosedur pengajuan PUM KPR yang berlaku di PT ASABRI (Persero)." }
];

/* ---------------------------------------------------------------------------
   5. REFERENSI ISIAN FORM PENGAJUAN (wilayah, mitra bayar, dokumen syarat)
   --------------------------------------------------------------------------- */
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

/* Daftar dokumen persyaratan per tipe PUM KPR — dipakai di langkah "Unggah
   Dokumen". Tandai kondisional:true untuk dokumen yang tidak wajib bagi
   semua peserta (beri catatan singkat lewat "note"). */
const DATA_DOKUMEN_PERSYARATAN = {
  "Kredit Rumah": [
    { label:"Formulir Pengajuan", note:"Legalisir Kepala Satuan Kerja" },
    { label:"Surat Pernyataan Pengajuan" },
    { label:"Fotocopy KPA" },
    { label:"Fotocopy Kartu Keluarga (KK)" },
    { label:"Fotocopy KTP" },
    { label:"Fotocopy Buku Nikah", kondisional:true }
  ],

  "Pembelian Rumah Secara Mandiri": [
    { label:"Formulir Pengajuan", note:"Legalisir Kepala Satuan Kerja" },
    { label:"Surat Pernyataan Pengajuan" },
    { label:"Fotocopy KPA" },
    { label:"Fotocopy Kartu Keluarga (KK)" },
    { label:"Fotocopy KTP" },
    { label:"Fotocopy Buku Nikah", kondisional:true },
    { label:"Fotocopy Surat Kesepakatan Jual Beli" }
  ],

  "Membangun Rumah": [
    { label:"Formulir Pengajuan", note:"Legalisir Kepala Satuan Kerja" },
    { label:"Surat Pernyataan Pengajuan" },
    { label:"Fotocopy KPA" },
    { label:"Fotocopy Kartu Keluarga (KK)" },
    { label:"Fotocopy KTP" },
    { label:"Fotocopy Buku Nikah", kondisional:true },
    { label:"Fotocopy Bukti Kepemilikan Hak Atas Tanah" }
  ]
};
/* "Surat Pernyataan Kesanggupan" tidak ada di daftar statis di atas — field
   ini ditambahkan secara dinamis (lihat pf5Docs() di app.js) hanya untuk
   peserta Polri dengan Masa Kerja Dinas < 2 tahun, dan bersifat wajib. */

/* ---------------------------------------------------------------------------
   6. DAFTAR PENGAJUAN KPR (PUM)
   Satu baris = satu peserta yang mengajukan ambil PUM.
   status: "Draft" (belum dikirim, masih bisa Ubah/Hapus) | "Submitted" (tampil
   sebagai "Pending" — sudah dikirim, menunggu Approval) | "Disetujui" |
   "Ditolak" | "Revisi" (dikembalikan dari Approval lewat tombol "Revisi",
   perlu diubah & disubmit ulang oleh PIC UNOR/Kesatuan)
   --------------------------------------------------------------------------- */
const DATA_PUM = [
  { kpa:"CD317049", nrp:"119596",             npwp:"73.104.502.7-009.000", nama:"Intan M. Sari",
    angkatan:"TNI-AL", tglAmbil:"Sel, 23 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/90",
    status:"Submitted", jumlah:25000000 },
  { kpa:"CY104869", nrp:"197804081998032003", npwp:"89.231.218.2-603.000", nama:"Made Wardani",
    angkatan:"TNI-AL", tglAmbil:"Sel, 23 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"45/111",
    status:"Draft",     jumlah:30000000 },
  { kpa:"CE360625", nrp:"132170",             npwp:"85.465.740.0-514.000", nama:"Kenedi",
    angkatan:"TNI-AL", tglAmbil:"Sel, 23 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/72",
    status:"Submitted", jumlah:20000000 },
  { kpa:"CE358403", nrp:"127485",             npwp:"95.023.091.2-643.000", nama:"Firman Dewantoro",
    angkatan:"TNI-AL", tglAmbil:"Sen, 22 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/94",
    status:"Draft",     jumlah:20000000 },
  { kpa:"CD319552", nrp:"126284",             npwp:"92.704.589.8-126.000", nama:"Aprildo Anang Riyadi",
    angkatan:"TNI-AL", tglAmbil:"Sen, 22 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/96",
    status:"Submitted", jumlah:25000000 },
  { kpa:"CC306323", nrp:"14621/P",            npwp:"08.544.963.5-603.000", nama:"Heriyanto, S.KM",
    angkatan:"TNI-AL", tglAmbil:"Sen, 22 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/96",
    status:"Submitted", jumlah:35000000 },
  { kpa:"TA910123", nrp:"178432",             npwp:"81.924.605.6-881.000", nama:"Slamet Riyadi",
    angkatan:"TNI-AD", tglAmbil:"Rab, 19 Agu 2026", tipePum:"Kredit Rumah", tipeRumah:"36/90",
    status:"Revisi", jumlah:28000000, tglRevisi:"2026-08-28T00:00:00.000Z",
    catatanApproval:"Nomor Akad Kredit belum sesuai dengan dokumen Fotocopy Akad Kredit yang diunggah — mohon periksa dan unggah ulang." }
];


/* ---------------------------------------------------------------------------
   7. PELUNASAN KPR (PUM)
   Satu baris = satu peserta yang KPR (PUM)-nya sudah jatuh tempo. Kolom
   peserta mengikuti Daftar Pengajuan KPR (PUM); sisanya dipakai di halaman
   Detail Pelunasan KPR (PUM) per peserta.
   status: "Pending" | "Disetujui" | "Ditolak"
   --------------------------------------------------------------------------- */
const DATA_PELUNASAN = [
  { kpa:"CD317049", nrp:"119596",             npwp:"73.104.502.7-009.000", nama:"Intan M. Sari",
    angkatan:"TNI-AL", uker:"Lanal Surabaya",      cabang:"KC Surabaya",
    tglAmbil:"Sel, 23 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/90", jumlah:25000000,
    tglAkhirKredit:"Kam, 23 Mei 2024", periode:"Mei 2024", tglPelunasan:"Kam, 23 Mei 2024",
    sisaPiutang:25000000, jumlahDilunasi:25000000, caraPelunasan:"Otomatis — jatuh tempo",
    status:"Pending", catatan:"" },
  { kpa:"CY104869", nrp:"197804081998032003", npwp:"89.231.218.2-603.000", nama:"Made Wardani",
    angkatan:"TNI-AL", uker:"Lanal Banyuwangi",    cabang:"KC Denpasar",
    tglAmbil:"Sel, 23 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"45/111", jumlah:30000000,
    tglAkhirKredit:"Kam, 23 Mei 2024", periode:"Mei 2024", tglPelunasan:"Kam, 23 Mei 2024",
    sisaPiutang:30000000, jumlahDilunasi:30000000, caraPelunasan:"Otomatis — jatuh tempo",
    status:"Pending", catatan:"" },
  { kpa:"CE360625", nrp:"132170",             npwp:"85.465.740.0-514.000", nama:"Kenedi",
    angkatan:"TNI-AL", uker:"Lanal Batam",         cabang:"KC Batam",
    tglAmbil:"Sel, 23 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/72", jumlah:20000000,
    tglAkhirKredit:"Kam, 23 Mei 2024", periode:"Mei 2024", tglPelunasan:"Kam, 23 Mei 2024",
    sisaPiutang:20000000, jumlahDilunasi:20000000, caraPelunasan:"Otomatis — jatuh tempo",
    status:"Pending", catatan:"" },
  { kpa:"CD319552", nrp:"126284",             npwp:"92.704.589.8-126.000", nama:"Aprildo Anang Riyadi",
    angkatan:"TNI-AL", uker:"Lanal Ambon",         cabang:"KC Ambon",
    tglAmbil:"Sen, 22 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/96", jumlah:25000000,
    tglAkhirKredit:"Rab, 22 Mei 2024", periode:"Mei 2024", tglPelunasan:"Rab, 22 Mei 2024",
    sisaPiutang:25000000, jumlahDilunasi:25000000, caraPelunasan:"Otomatis — jatuh tempo",
    status:"Pending", catatan:"" },
  { kpa:"CC306323", nrp:"14621/P",            npwp:"08.544.963.5-603.000", nama:"Heriyanto, S.KM",
    angkatan:"TNI-AL", uker:"Lanal Jakarta",       cabang:"KC Jakarta Utama",
    tglAmbil:"Sen, 22 Mei 2023", tipePum:"Kredit Rumah", tipeRumah:"36/96", jumlah:35000000,
    tglAkhirKredit:"Rab, 22 Mei 2024", periode:"Mei 2024", tglPelunasan:"Rab, 22 Mei 2024",
    sisaPiutang:35000000, jumlahDilunasi:35000000, caraPelunasan:"Otomatis — jatuh tempo",
    status:"Pending", catatan:"" },

  /* Sudah diputus — dipakai untuk mencoba filter Disetujui / Ditolak */
  { kpa:"CE358403", nrp:"127485",             npwp:"95.023.091.2-643.000", nama:"Firman Dewantoro",
    angkatan:"TNI-AD", uker:"Kodim 0733 Semarang", cabang:"KC Semarang",
    tglAmbil:"Sen, 22 Mei 2023", tipePum:"Membangun Rumah", tipeRumah:"36/94", jumlah:20000000,
    tglAkhirKredit:"Sen, 22 Apr 2024", periode:"April 2024", tglPelunasan:"Sen, 22 Apr 2024",
    sisaPiutang:20000000, jumlahDilunasi:20000000, caraPelunasan:"Otomatis — jatuh tempo",
    status:"Disetujui", catatan:"Data terkirim ke Dynamics 365, Berita Acara Rekon Piutang ter-generate." },
  { kpa:"TB920234", nrp:"19900820002",        npwp:"77.310.884.1-421.000", nama:"Wati Handayani",
    angkatan:"Polri",  uker:"Polres Bekasi",       cabang:"KC Bekasi",
    tglAmbil:"Jum, 14 Apr 2023", tipePum:"Pembelian Rumah Secara Mandiri", tipeRumah:"45/120", jumlah:30000000,
    tglAkhirKredit:"Ming, 14 Apr 2024", periode:"April 2024", tglPelunasan:"Ming, 14 Apr 2024",
    sisaPiutang:30000000, jumlahDilunasi:30000000, caraPelunasan:"Otomatis — jatuh tempo",
    status:"Disetujui", catatan:"Data terkirim ke Dynamics 365, Berita Acara Rekon Piutang ter-generate." },
  { kpa:"UA950567", nrp:"19921215005",        npwp:"61.902.775.3-118.000", nama:"Yuni Kartika",
    angkatan:"TNI-AU", uker:"Lanud Iswahjudi",     cabang:"KC Madiun",
    tglAmbil:"Sel, 07 Mar 2023", tipePum:"Kredit Rumah", tipeRumah:"36/84", jumlah:22000000,
    tglAkhirKredit:"Kam, 07 Mar 2024", periode:"Maret 2024", tglPelunasan:"—",
    sisaPiutang:22000000, jumlahDilunasi:0, caraPelunasan:"Otomatis — jatuh tempo",
    status:"Ditolak", catatan:"Sisa piutang belum cocok dengan data Dynamics 365 — perlu verifikasi ulang." }
];


/* ---------------------------------------------------------------------------
   8. PENGELOLAAN KLAIM KPR (BUM)
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
    keterangan:"Peserta baru terverifikasi memiliki Pinjaman KPR (BUM) aktif — dipakai untuk simulasi validasi Pengajuan Baru KPR (PUM)." }
];


/* ---------------------------------------------------------------------------
   9. PENGATURAN UMUM
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

