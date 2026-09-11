/* ===========================================================================
   app.js — LOGIKA APLIKASI FLAGGING MITRA BAYAR
   ---------------------------------------------------------------------------
   Bagian ini mengatur perilaku (navigasi, validasi, render tabel).
   Untuk sekadar mengubah isi data, edit data.js — bukan file ini.
   =========================================================================== */
"use strict";

/* --------------------------------------------------------------- utilitas */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp  = n => "Rp " + Number(n).toLocaleString("id-ID");
const esc = s => String(s ?? "").replace(/[&<>"]/g,
  c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));

const BULAN_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli",
  "Agustus","September","Oktober","November","Desember"];

function toast(msg, kind = "") {
  const t = document.createElement("div");
  t.className = "toast " + kind;
  t.textContent = msg;
  $("#toast").appendChild(t);
  setTimeout(() => t.remove(), 3600);
}

/* ------------------------------------------------------------------ router */
function go(id) {
  $$(".screen").forEach(s => s.classList.remove("active"));
  const el = $("#s-" + id);
  if (el) el.classList.add("active");
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.go === id));
  /* Buka semua grup induk (nav-parent) di sepanjang jalur menuju item yang aktif,
     supaya item tetap terlihat di sidebar meski tersarang beberapa level. */
  let climb = $(`.nav-item[data-go="${id}"]`);
  while (climb) {
    const children = climb.closest(".nav-children");
    if (!children) break;
    const parentBtn = children.previousElementSibling;
    if (parentBtn && parentBtn.classList.contains("nav-parent")) {
      parentBtn.setAttribute("aria-expanded", "true");
      children.hidden = false;
    }
    climb = parentBtn;
  }
  $("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "instant" });
  /* Layar unggah selalu dimulai dari keadaan kosong. */
  if (id === "flagging-cb-check")          fcbkResetCheck();
  if (id === "flagging-pengajuan-unggah")  fpgResetUnggah();
  if (id === "flagging-takeover-tambah")   fttReset();
  if (id === "flagging-topup-tambah")      ftutReset();
  if (id === "flagging-penagihan-tambah")  fptReset();
  if (id === "flagging-tarif-tambah")      ftt2Reset();
  if (id === "flagging-cb-individu-cari") { $("#fcbi-kpa").value = ""; fcbiSembunyikanHasil(); }
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-go]");
  if (b && !b.disabled) go(b.dataset.go);
});
$("#burger").onclick = () => $("#sidebar").classList.toggle("open");

/* Sidebar: buka/tutup grup nav-parent — generik untuk semua sub modul. */
$$(".nav-parent").forEach(btn => {
  btn.onclick = () => {
    const open     = btn.getAttribute("aria-expanded") === "true";
    const children = btn.nextElementSibling;
    btn.setAttribute("aria-expanded", open ? "false" : "true");
    if (children && children.classList.contains("nav-children")) children.hidden = open;
  };
});

/* ------------------------------------------------------------------- modal */
function openModal()  { $("#modal-bg").classList.add("open");    document.body.style.overflow = "hidden"; }
function closeModal() {
  $("#modal-bg").classList.remove("open"); document.body.style.overflow = "";
  /* Ikon judul bersifat opsional — selalu dikosongkan supaya modal berikutnya
     tidak ikut kebagian ikon milik modal sebelumnya. */
  $("#modal-ico").style.display = "none";
  $("#modal-ico").textContent   = "";
  $("#modal-ico").className     = "modal-ico";   /* buang nada warn/bad */
}
$("#modal-x").onclick = closeModal;
$("#modal-bg").onclick = e => { if (e.target.id === "modal-bg") closeModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* --------------------------------------------------------------- paginasi */
function pagerPotong(rows, st) {
  const maxHal = Math.max(1, Math.ceil(rows.length / st.per));
  if (st.hal > maxHal) st.hal = maxHal;      /* filter menyusut → jangan nyangkut */
  if (st.hal < 1) st.hal = 1;
  const mulai = (st.hal - 1) * st.per;
  return { total: rows.length, maxHal, mulai, hal: rows.slice(mulai, mulai + st.per) };
}

/* halaman dipangkas dengan elipsis supaya tidak melebar saat datanya banyak */
function pagerHtml(st, p, attr) {
  const tbl = (isi, aktif, hal, mati) =>
    `<button class="btn ${aktif ? "btn-primary" : "btn-ghost"} btn-sm" style="min-width:30px;padding:0"` +
    `${mati ? " disabled" : ` ${attr}="${hal}"`}>${isi}</button>`;
  const nomor = [];
  for (let i = 1; i <= p.maxHal; i++) {
    if (i === 1 || i === p.maxHal || Math.abs(i - st.hal) <= 1) nomor.push(i);
    else if (nomor[nomor.length - 1] !== "…") nomor.push("…");
  }
  return tbl("‹", false, st.hal - 1, st.hal <= 1)
       + nomor.map(i => i === "…"
           ? `<span style="padding:0 3px;color:var(--faint);font-size:11px;align-self:center">…</span>`
           : tbl(i, i === st.hal, i, false)).join("")
       + tbl("›", false, st.hal + 1, st.hal >= p.maxHal);
}

function pagerNote(p, satuan, ekor) {
  const dari = p.total ? p.mulai + 1 : 0;
  return `Menampilkan <b>${dari}–${Math.min(p.mulai + p.hal.length, p.total)}</b> dari ${p.total.toLocaleString("id-ID")} ${satuan}. ${ekor}`;
}

/* Pembulatan batas sumbu grafik ke angka "bulat" terdekat (1/2/2,5/5/10). */
function niceMax(v) {
  if (v <= 0) return 10;
  const mag  = Math.pow(10, Math.floor(Math.log10(v)));
  const norm = v / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * mag;
}


/* =============================== DASHBOARD FLAGGING PINJAMAN MITRA
   Lima grafik garis dengan gaya yang sama: gridline resesif, penanda titik
   bulat, sumbu Y ber-nice-max, dan tooltip native lewat <title>. Sengaja
   digambar manual sebagai SVG supaya tetap tanpa library/CDN. */

/* Angka sumbu Y disingkat "k" begitu melewati seribu, mengikuti kebiasaan
   grafik di kartu dashboard lain. */
function fdashFmtNilai(v) {
  if (Math.abs(v) < 1000) return String(+v.toFixed(1)).replace(".", ",");
  return String(+(v / 1000).toFixed(1)).replace(".", ",") + "k";
}

/* Sumbu Y grafik garis tidak selalu mulai dari nol: kalau seluruh nilai jauh di
   atas nol, dasar sumbu ikut dinaikkan supaya bentuk garisnya tetap terbaca. */
function fdashSkalaY(values) {
  const lo = Math.min(...values), hi = Math.max(...values);
  const step  = niceMax((hi - lo) / 3 || 1);
  const min   = lo - (hi - lo) * .25 <= 0 ? 0 : Math.floor(lo / step) * step;
  const max   = Math.ceil(hi / step) * step;
  return { min, max: max === min ? min + step : max, step };
}

function renderLineChart(containerId, data, opts = {}) {
  const el = $(`#${containerId}`);
  if (!el) return;
  const { labels, values } = data;
  const color = opts.color || "var(--navy)";
  const w = 520, h = 300, padL = 62, padR = 22, padT = 16, padB = 54;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const { min, max, step } = fdashSkalaY(values);
  const x = i => labels.length === 1 ? padL + plotW / 2 : padL + i * (plotW / (labels.length - 1));
  const y = v => padT + plotH - (v - min) / (max - min) * plotH;

  let svg = "";
  /* Gridline horizontal + label sumbu Y */
  for (let v = min; v <= max + 1e-9; v += step) {
    svg += `<line x1="${padL}" y1="${y(v)}" x2="${w - padR}" y2="${y(v)}" stroke="var(--line-soft)" stroke-width="1"/>`;
    svg += `<text x="${padL - 10}" y="${y(v) + 3.5}" text-anchor="end" font-size="10" fill="var(--muted)">${fdashFmtNilai(v)}</text>`;
  }
  /* Gridline vertikal + label sumbu X */
  labels.forEach((lbl, i) => {
    svg += `<line x1="${x(i)}" y1="${padT}" x2="${x(i)}" y2="${padT + plotH}" stroke="var(--line-soft)" stroke-width="1"/>`;
    svg += `<text x="${x(i)}" y="${padT + plotH + 20}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${esc(lbl)}</text>`;
  });
  /* Bingkai plot: hanya garis dasar, seperti pada grafik acuan */
  svg += `<line x1="${padL}" y1="${padT + plotH}" x2="${w - padR}" y2="${padT + plotH}" stroke="var(--line)" stroke-width="1.5"/>`;

  /* Judul sumbu */
  svg += `<text x="${padL + plotW / 2}" y="${h - 18}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${esc(opts.xLabel || "Bulan")}</text>`;
  svg += `<text x="16" y="${padT + plotH / 2}" text-anchor="middle" font-size="9.5" letter-spacing=".05em" fill="var(--muted)" transform="rotate(-90 16 ${padT + plotH / 2})">${esc(data.satuan || "")}</text>`;

  /* Garis + titik data */
  svg += `<polyline points="${values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  values.forEach((v, i) => {
    svg += `<circle cx="${x(i)}" cy="${y(v)}" r="4.6" fill="${color}" stroke="var(--surface)" stroke-width="1.5">` +
           `<title>${esc(labels[i])} — ${esc(data.seri)}: ${v.toLocaleString("id-ID")}</title></circle>`;
  });

  el.innerHTML =
    `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block" role="img" aria-label="${esc(opts.aria || data.seri)}">${svg}</svg>` +
    `<div class="chart-legend"><span class="chart-legend-mark" style="background:${color}"></span>${esc(data.seri)}</div>`;
}

function renderFlaggingDashboard() {
  $("#fdash-mitra").textContent = DASHBOARD_FLAGGING_MITRA;
  $$(".fdash-tahun").forEach(e => e.textContent = DASHBOARD_FLAGGING_TAHUN);

  const d = DASHBOARD_FLAGGING;
  renderLineChart("fdash-site-visits", d.siteVisits,  { color: "var(--navy)",       aria: "Grafik jumlah akses mitra per bulan" });
  renderLineChart("fdash-booking",     d.booking,     { color: "var(--navy)",       aria: "Grafik jumlah nasabah booking per bulan" });
  renderLineChart("fdash-pengajuan",   d.pengajuan,   { color: "var(--chart-gold)", aria: "Grafik jumlah nasabah pengajuan per bulan" });
  renderLineChart("fdash-persetujuan", d.persetujuan, { color: "var(--chart-gold)", aria: "Grafik jumlah nasabah persetujuan per bulan" });
  renderLineChart("fdash-pelunasan",   d.pelunasan,   { color: "var(--chart-gold)", aria: "Grafik jumlah nasabah pelunasan per bulan" });
}

renderFlaggingDashboard();


/* ================= FLAGGING PINJAMAN MITRA » PENSIUNAN
   Rekap mitra bayar per periode. Filter dijalankan saat tombol "Cari" ditekan
   (bukan saat mengetik) supaya perilakunya sama dengan layar SPTB. */
let fpPager  = { hal: 1, per: 5 };
let fpFilter = { bulan: "Januari", tahun: "2025", mitra: "" };

function isiPilihanFp() {
  $("#fp-f-bulan").innerHTML = BULAN_ID.map(b => `<option>${esc(b)}</option>`).join("");
  $("#fp-f-bulan").value = fpFilter.bulan;
}

function fpBacaFilter() {
  fpFilter = {
    bulan: $("#fp-f-bulan").value,
    tahun: $("#fp-f-tahun").value.trim(),
    mitra: $("#fp-f-mitra").value.trim().toLowerCase()
  };
}

function fpRows() {
  const f = fpFilter;
  return DATA_FLAGGING_PENSIUNAN.filter(r =>
    r.bulan === f.bulan &&
    (!f.tahun || String(r.tahun) === f.tahun) &&
    (!f.mitra || r.mitra.toLowerCase().includes(f.mitra))
  );
}

function renderFlaggingPensiunan() {
  const rows = fpRows();
  const pg   = pagerPotong(rows, fpPager);

  $("#fp-body").innerHTML = pg.hal.length
    ? pg.hal.map((r, i) => `
      <tr>
        <td>${pg.mulai + i + 1}</td>
        <td class="t-strong">${esc(r.mitra)}</td>
        <td class="num">${r.pesertaAktif.toLocaleString("id-ID")}</td>
        <td class="num">${rp(r.imbalAktif)}</td>
        <td class="num">${r.pesertaPensiun.toLocaleString("id-ID")}</td>
        <td class="num">${rp(r.imbalPensiun)}</td>
        <td class="num">${r.penerima.toLocaleString("id-ID")}</td>
        <td class="num">${rp(r.netto)}</td>
      </tr>`).join("")
    : `<tr><td colspan="8"><div class="empty">Tidak ada mitra bayar yang cocok dengan filter.</div></td></tr>`;

  $("#fp-count").textContent = `Menampilkan ${rows.length.toLocaleString("id-ID")} data`;
  $("#fp-pager").innerHTML   = rows.length ? pagerHtml(fpPager, pg, "data-fp-hal") : "";
}

$("#fp-cari").onclick = () => { fpBacaFilter(); fpPager.hal = 1; renderFlaggingPensiunan(); };
document.addEventListener("click", e => {
  const b = e.target.closest("[data-fp-hal]");
  if (b) { fpPager.hal = +b.dataset.fpHal; renderFlaggingPensiunan(); }
});

isiPilihanFp();
fpBacaFilter();
renderFlaggingPensiunan();

/* ============================================ FLAGGING » PARAMETER PENETAPAN TARIF
   Tarif layanan per pasangan Jenis Tarif × Jenis Peserta. Daftarnya hanya
   menampilkan pasangan itu; nominalnya ada di halaman Detail. Baris baru
   dibuat lewat layar Penetapan Tarif. */

let ftrPager  = { hal: 1, per: 10 };
let ftrFilter = { tarif: "Semua Jenis Tarif", peserta: "Semua Jenis Peserta" };
let ftrSeq    = 0;
let ftrRows   = DATA_FLAGGING_TARIF.map(r => ({ ...r, id: "tr" + (++ftrSeq) }));

const ftrOpsi = (sel, semua, daftar) => {
  $(sel).innerHTML = [semua, ...daftar].map(s => `<option>${esc(s)}</option>`).join("");
};
ftrOpsi("#ftr-f-tarif",   "Semua Jenis Tarif",   FTR_JENIS_TARIF);
ftrOpsi("#ftr-f-peserta", "Semua Jenis Peserta", FTR_JENIS_PESERTA);
$("#ftt2-tarif").innerHTML   = FTR_JENIS_TARIF.map(s => `<option>${esc(s)}</option>`).join("");
$("#ftt2-peserta").innerHTML = FTR_JENIS_PESERTA.map(s => `<option>${esc(s)}</option>`).join("");

function ftrDaftar() {
  const f = ftrFilter;
  return ftrRows.filter(r =>
    (f.tarif   === "Semua Jenis Tarif"   || r.jenisTarif   === f.tarif) &&
    (f.peserta === "Semua Jenis Peserta" || r.jenisPeserta === f.peserta)
  );
}

function renderFtr() {
  const rows = ftrDaftar();
  const pg   = pagerPotong(rows, ftrPager);

  $("#ftr-body").innerHTML = pg.hal.length
    ? pg.hal.map((r, i) => `
      <tr>
        <td>${pg.mulai + i + 1}</td>
        <td class="t-strong">${esc(r.jenisTarif)}</td>
        <td>${esc(r.jenisPeserta)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-info btn-sm" data-ftr-detail="${esc(r.id)}">Detail</button>
        </td>
      </tr>`).join("")
    : `<tr><td colspan="4"><div class="empty">Tidak ada tarif yang cocok dengan filter.</div></td></tr>`;

  $("#ftr-count").innerHTML = pagerNote(pg, "tarif", "");
  $("#ftr-pager").innerHTML = rows.length ? pagerHtml(ftrPager, pg, "data-ftr-hal") : "";
}

$("#ftr-cari").onclick = () => {
  ftrFilter.tarif   = $("#ftr-f-tarif").value;
  ftrFilter.peserta = $("#ftr-f-peserta").value;
  ftrPager.hal = 1;
  renderFtr();
};

const ftrCari = id => ftrRows.find(r => r.id === id);

/* ---- Detail Tarif: baca-saja, tempat nominalnya ditampilkan. */
function ftrdIsi(r) {
  $("#ftrd-sub").textContent     = `${r.jenisTarif} · ${r.jenisPeserta}`;
  $("#ftrd-tarif").value         = r.jenisTarif;
  $("#ftrd-peserta").value       = r.jenisPeserta;
  $("#ftrd-nominal").value       = r.nominal.toLocaleString("id-ID");
}

/* ---- Penetapan Tarif */
function ftt2Reset() {
  $("#ftt2-tarif").value   = FTR_JENIS_TARIF[0];
  $("#ftt2-peserta").value = FTR_JENIS_PESERTA[0];
  $("#ftt2-nominal").value = "";
  $("#ftt2-periode").value = "";
}

$("#ftt2-simpan").onclick = () => {
  const jenisTarif   = $("#ftt2-tarif").value;
  const jenisPeserta = $("#ftt2-peserta").value;
  const nominal      = fpdAngka($("#ftt2-nominal").value);
  const periode      = $("#ftt2-periode").value;

  if (!$("#ftt2-nominal").value.trim()) { toast("Nominal wajib diisi.", "bad"); return; }
  if (nominal <= 0)                     { toast("Nominal harus lebih besar dari nol.", "bad"); return; }
  if (!periode)                         { toast("Periode wajib diisi.", "bad"); return; }

  /* Satu pasangan jenis tarif × jenis peserta hanya boleh punya satu nominal. */
  if (ftrRows.some(r => r.jenisTarif === jenisTarif && r.jenisPeserta === jenisPeserta)) {
    toast(`Tarif ${jenisTarif} untuk peserta ${jenisPeserta} sudah ditetapkan.`, "bad");
    return;
  }

  ftrRows.unshift({ id: "tr" + (++ftrSeq), jenisTarif, jenisPeserta, nominal, periode });
  ftrPager.hal = 1;
  renderFtr();
  go("flagging-parameter-tarif");
  toast(`Tarif ${jenisTarif} (${jenisPeserta}) ditetapkan ${rp(nominal)}.`, "ok");
};

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-ftr-detail]");
  if (bDetail) { ftrdIsi(ftrCari(bDetail.dataset.ftrDetail)); go("flagging-tarif-detail"); return; }

  const bHal = e.target.closest("[data-ftr-hal]");
  if (bHal) { ftrPager.hal = +bHal.dataset.ftrHal; renderFtr(); }
});

renderFtr();

/* ================================================ FLAGGING » CHECK DAN BOOKING » INDIVIDU */

/* Autocomplete Mitra (bank/POS) — dipakai layar Kolektif; di layar Individu
   Mitra sudah terisi otomatis dari data peserta sehingga tidak perlu dicari.
   Semua handler menempel di elemennya sendiri (bukan document) supaya aman
   dipasang ulang setiap kali isi modal dibangun ulang. */
function bindMitraAutocomplete(inputId, listId) {
  const input = $(`#${inputId}`);
  const list  = $(`#${listId}`);
  input.oninput = () => {
    const q = input.value.trim().toLowerCase();
    const hits = q ? DATA_MITRA_BAYAR.filter(b => b.toLowerCase().includes(q)) : [];
    if (!hits.length) { list.classList.remove("open"); list.innerHTML = ""; return; }
    list.innerHTML = hits.map(b => `<div class="autocomplete-item" data-mitra="${esc(b)}">${esc(b)}</div>`).join("");
    list.classList.add("open");
  };
  /* mousedown mendahului blur, jadi pilihannya sempat terbaca sebelum menutup */
  list.onmousedown = e => {
    const item = e.target.closest(".autocomplete-item");
    if (!item) return;
    e.preventDefault();
    input.value = item.dataset.mitra;
    list.classList.remove("open");
  };
  input.onblur = () => list.classList.remove("open");
}
/* Search field Nomor Pensiun Peminjam — daftarnya ikut peserta waris yang
   sedang tampil, jadi diisi ulang setiap kali pencarian KPA berhasil. */
let fcbiWarisPeminjam = [];
(() => {
  const input = $("#fcbi-w-nopensiun-peminjam");
  const list  = $("#fcbi-w-peminjam-list");
  const tutup = () => { list.classList.remove("open"); list.innerHTML = ""; };
  const buka = () => {
    const q = input.value.trim().toLowerCase();
    const hits = fcbiWarisPeminjam.filter(p =>
      p.nomorPensiun.toLowerCase().includes(q) || p.nama.toLowerCase().includes(q));
    if (!hits.length) { tutup(); return; }
    list.innerHTML = hits.map(p =>
      `<div class="autocomplete-item" data-nopens="${esc(p.nomorPensiun)}">${esc(p.nomorPensiun)}<small>${esc(p.nama)}</small></div>`).join("");
    list.classList.add("open");
  };
  /* Mengetik ulang membatalkan pilihan sebelumnya; fokus saja tidak. */
  input.oninput = () => { $("#fcbi-w-nama-peminjam").value = ""; buka(); };
  input.onfocus = buka;
  document.addEventListener("click", e => {
    const item = e.target.closest("#fcbi-w-peminjam-list .autocomplete-item");
    if (item) {
      const p = fcbiWarisPeminjam.find(x => x.nomorPensiun === item.dataset.nopens);
      input.value = p.nomorPensiun;
      $("#fcbi-w-nama-peminjam").value = p.nama;
      tutup();
      return;
    }
    if (!e.target.closest("#fcbi-w-nopensiun-peminjam")) tutup();
  });
})();

function fcbiSembunyikanHasil() {
  $("#fcbi-hasil-aktif").style.display   = "none";
  $("#fcbi-hasil-sendiri").style.display = "none";
  $("#fcbi-hasil-waris").style.display   = "none";
}
$("#fcbi-kpa").oninput = fcbiSembunyikanHasil;

/* Pop-up validasi nomor KPA: kalimatnya selalu berbentuk
   "Nomor KPA <chip> " + pesan, jadi nomornya menonjol seperti di rancangan. */
function fcbiPopupValidasi(kpa, v) {
  $("#modal-title").textContent = v.judul;
  $("#modal-sub").textContent   = "";
  $("#modal-ico").style.display = "";
  $("#modal-ico").className     = "modal-ico " + v.tone;
  $("#modal-ico").textContent   = v.tone === "warn" ? "⚠" : "⊗";
  $("#modal-body").innerHTML = `
    <div style="font-size:13px;color:var(--body);line-height:1.7;margin-bottom:20px">
      Nomor KPA <span class="kpa-chip">${esc(kpa)}</span> ${esc(v.pesan)}
    </div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn btn-ghost" id="fcbi-val-close">⊗ Tutup</button>
    </div>`;
  openModal();
  $("#fcbi-val-close").onclick = closeModal;
}

/* Mengembalikan aturan validasi yang kena, atau null kalau peserta lolos.
   Flagging mitra diperiksa lebih dulu karena paling menentukan. */
function fcbiCekValidasi(p) {
  if (p.flaggingMitra) return {
    tone:"bad", judul:"Validasi tidak lolos",
    pesan:`terdaftar sudah termasuk dalam flagging Mitra ${p.flaggingMitra} — tidak bisa melanjutkan ke Pengajuan Cek Kredit Pinjaman Mitra.`
  };
  return p.validasi ? FCBI_VALIDASI[p.validasi] : null;
}

/* Gaji hanya bisa ditampilkan kalau parameter tarif peserta sudah ditentukan;
   kalau belum, field-nya tetap ada tapi dibiarkan kosong. */
function fcbiIsiGaji(prefix, p) {
  $(`#fcbi-${prefix}-gaji`).value = p.tarifDitentukan ? rp(p.gaji) : "";
  $(`#fcbi-${prefix}-gaji-hint`).style.display = p.tarifDitentukan ? "none" : "";
}

/* Peserta yang sedang tampil di kartu Informasi Peserta. */
let fcbiPeserta = null;

$("#fcbi-search").onclick = () => {
  const kpa = $("#fcbi-kpa").value.trim();
  fcbiSembunyikanHasil();
  if (!kpa) { toast("Nomor KPA belum diisi.", "bad"); return; }
  const cocok = p => p.kpa.toLowerCase() === kpa.toLowerCase();

  const p = DATA_FLAGGING_AKTIF.find(cocok)
         || DATA_FLAGGING_PENSIUN_SENDIRI.find(cocok)
         || DATA_FLAGGING_PENSIUN_WARIS.find(cocok);
  if (!p) { toast(`Nomor KPA "${kpa}" tidak ditemukan pada sistem ASABRI.`, "bad"); return; }

  const v = fcbiCekValidasi(p);
  /* Peringatan yang boleh dilanjutkan tidak menghentikan alur — pop-upnya
     ditampilkan setelah kartu Informasi Peserta selesai diisi di bawah. */
  if (v && !v.lanjut) { fcbiPopupValidasi(p.kpa, v); return; }

  fcbiPeserta = p;               /* dipakai tombol Booking di bawah */
  if (DATA_FLAGGING_AKTIF.includes(p)) {
    $("#fcbi-a-kpa").value   = p.kpa;
    $("#fcbi-a-nama").value  = p.nama;
    $("#fcbi-a-mitra").value = p.mitra;
    fcbiIsiGaji("a", p);
    $("#fcbi-hasil-aktif").style.display = "";
  } else if (DATA_FLAGGING_PENSIUN_SENDIRI.includes(p)) {
    $("#fcbi-s-kpa").value       = p.kpa;
    $("#fcbi-s-nopensiun").value = p.nomorPensiun;
    $("#fcbi-s-nama").value      = p.nama;
    $("#fcbi-s-mitra").value     = p.mitra;
    fcbiIsiGaji("s", p);
    $("#fcbi-hasil-sendiri").style.display = "";
  } else {
    fcbiWarisPeminjam = p.peminjam;
    $("#fcbi-w-kpa").value                = p.kpa;
    $("#fcbi-w-nopens").value             = p.nopens;
    $("#fcbi-w-nopensiun-peminjam").value = "";
    $("#fcbi-w-nama-peminjam").value      = "";
    $("#fcbi-w-nama").value               = p.nama;
    $("#fcbi-w-mitra").value              = p.mitra;
    fcbiIsiGaji("w", p);
    $("#fcbi-hasil-waris").style.display = "";
  }

  if (v) fcbiPopupValidasi(p.kpa, v);   /* peringatan, kartunya sudah tampil */
};

/* Booking individu mendaftarkan pesertanya ke daftar Check dan Booking »
   Individu dengan status "Booked". Pengajuan pinjamannya baru dibuat nanti
   lewat tombol Ubah di daftar itu, bukan di sini. */
function fcbiBooking(namaPenerima, nopensPenerima) {
  const p = fcbiPeserta;
  if (!fciTambah(p, namaPenerima, nopensPenerima)) {
    toast(`${p.nama} sudah ada di daftar Check dan Booking Individu.`, "bad");
    return;
  }
  go(fcbAsal.layar);
  toast(`Booking ${namaPenerima} tersimpan — lengkapi data pinjamannya lewat tombol Ubah.`, "ok");
}

$("#fcbi-a-booking").onclick = () => fcbiBooking($("#fcbi-a-nama").value, "");

$("#fcbi-s-booking").onclick = () =>
  fcbiBooking($("#fcbi-s-nama").value, $("#fcbi-s-nopensiun").value);

$("#fcbi-w-booking").onclick = () => {
  if (!$("#fcbi-w-nama-peminjam").value.trim()) { toast("Nomor Pensiun Peminjam belum dipilih.", "bad"); return; }
  fcbiBooking($("#fcbi-w-nama-peminjam").value, $("#fcbi-w-nopensiun-peminjam").value);
};


/* ======================================== FLAGGING » CHECK DAN BOOKING » INDIVIDU
   Daftar peserta yang sudah dibooking satu per satu. Barisnya lahir dari layar
   Pencarian Peserta (tombol Booking) dengan status "Booked", lalu berubah jadi
   "Pengajuan" begitu Data Pinjaman-nya disubmit lewat layar Ubah.

   Status menentukan aksi mana yang hidup — lihat fciAksi(). */

let fciPager  = { hal: 1, per: 10 };
let fciFilter = { cari: "", status: "Semua Status" };
let fciSeq    = 0;
let fciRows   = DATA_FLAGGING_INDIVIDU.map(r => ({ ...r, id: "ci" + (++fciSeq) }));

$("#fci-f-status").innerHTML =
  ["Semua Status", ...FCBI_STATUS].map(s => `<option>${esc(s)}</option>`).join("");

const fciKosong = v => v ? esc(v) : `<span style="color:var(--faint)">–</span>`;
const fciKode   = v => `<span class="pill ${v === "Y" ? "pill-ok" : "pill-info"}">${esc(v)}</span>`;
const fciPill   = s => `<span class="pill ${
  s === "Booked" ? "pill-ok" : s === "Dibatalkan" ? "pill-bad" : "pill-warn"}">${esc(s)}</span>`;

function fciDaftar() {
  const f = fciFilter;
  return fciRows.filter(r =>
    (f.status === "Semua Status" || r.status === f.status) &&
    (!f.cari || [r.ktpa, r.nrp, r.nama].some(v => String(v).toLowerCase().includes(f.cari)))
  );
}

/* Ubah dan Pembatalan hanya untuk booking yang belum diajukan. Begitu statusnya
   "Pengajuan", pinjamannya sudah ada di Pinjaman » Pengajuan dan keputusannya
   ada di Persetujuan — bukan lagi di layar ini. */
function fciAksi(r) {
  const bisa  = r.status === "Booked";
  const alasan = bisa ? "" : "Hanya untuk booking berstatus Booked";
  return `
    <button class="btn btn-info btn-sm" data-fci-detail="${esc(r.id)}">Detail</button>
    <button class="btn btn-ghost btn-sm" data-fci-ubah="${esc(r.id)}" ${bisa ? "" : "disabled"}
      title="${esc(bisa ? "Lengkapi data pinjaman" : alasan)}">Ubah</button>
    <button class="btn btn-danger btn-sm" data-fci-batal="${esc(r.id)}" ${bisa ? "" : "disabled"}
      title="${esc(bisa ? "Batalkan booking" : alasan)}">Pembatalan</button>`;
}

function renderFci() {
  const rows = fciDaftar();
  const pg   = pagerPotong(rows, fciPager);

  $("#fci-body").innerHTML = pg.hal.length
    ? pg.hal.map((r, i) => `
      <tr>
        <td>${pg.mulai + i + 1}</td>
        <td class="t-strong">${esc(r.ktpa)}</td>
        <td>${esc(r.nrp)}</td>
        <td>${fciKosong(r.nomorPensiun)}</td>
        <td class="t-strong">${esc(r.nama)}</td>
        <td>${esc(r.tglLahir)}</td>
        <td>${fciKode(r.pensiun)}</td>
        <td>${fciKode(r.hidup)}</td>
        <td>${fciKosong(r.nopensPenerima)}</td>
        <td class="t-strong">${esc(r.namaPenerima)}</td>
        <td><input type="checkbox" checked disabled aria-label="Sudah dibooking"></td>
        <td>${fciPill(r.status)}</td>
        <td class="stick-r" style="white-space:nowrap">${fciAksi(r)}</td>
      </tr>`).join("")
    : `<tr><td colspan="13"><div class="empty">Belum ada peserta yang dibooking lewat Check dan Booking Individu.</div></td></tr>`;

  $("#fci-count").innerHTML = pagerNote(pg, "peserta", "");
  $("#fci-pager").innerHTML = rows.length ? pagerHtml(fciPager, pg, "data-fci-hal") : "";
}

$("#fci-cari").onclick = () => {
  fciFilter.cari   = $("#fci-f-cari").value.trim().toLowerCase();
  fciFilter.status = $("#fci-f-status").value;
  fciPager.hal = 1;
  renderFci();
};

const fciCari = id => fciRows.find(r => r.id === id);

/* ---- Detail dan Ubah Booking dipakai bersama oleh daftar Individu dan tabel
   Peserta di layar Kolektif — formnya identik, hanya asal barisnya berbeda.
   `fcbAsal` menyimpan dari mana baris itu dibuka supaya tombol Kembali,
   remah roti, dan render setelah submit menunjuk ke daftar yang benar. */
const FCB_ASAL = {
  individu: { layar:"flagging-cb-individu", label:"Individu",
              render: () => renderFci(),          sumber:"Check dan Booking Individu" },
  kolektif: { layar:"flagging-cb-kolektif", label:"Kolektif",
              render: () => renderFcbkPeserta(),  sumber:"Check dan Booking Kolektif" }
};
let fcbAsal = FCB_ASAL.individu;

function fcbSetAsal(kunci, prefix) {
  fcbAsal = FCB_ASAL[kunci] || FCB_ASAL.individu;
  $(`#${prefix}-crumb-asal`).textContent = fcbAsal.label;
  $(`#${prefix}-kembali`).dataset.go     = fcbAsal.layar;
}

function fcidField(label, nilai) {
  return `<div class="field">
    <label class="fl">${esc(label)}</label>
    <input class="inp" value="${esc(nilai || "–")}" disabled>
  </div>`;
}

function fcidIsi(r, asal) {
  fcbSetAsal(asal, "fcid");
  $("#fcid-sub").textContent = `${r.ktpa} — ${r.nama} · ${r.status}`;
  $("#fcid-peserta").innerHTML = [
    fcidField("KPA",           r.ktpa),
    fcidField("NRP/NIP",       r.nrp),
    fcidField("Nama",          r.nama),
    fcidField("NOPENS",        r.nomorPensiun),
    fcidField("Tanggal Lahir", r.tglLahir),
    fcidField("Gaji Peserta",  rp(r.gaji)),
    fcidField("NIK",           r.nik),
    fcidField("Mitra Bayar",   r.mitra),
    fcidField("Cabang Mitra Bayar", r.cabangMitra)
  ].join("");

  /* Data Pinjaman baru terisi setelah Submit di layar Ubah; selama masih
     "Booked" bagian ini digantikan banner keterangan. */
  const j = r.pinjaman;
  $("#fcid-pinjaman").innerHTML = j ? [
    fcidField("Tgl Pelunasan",            j.tglPelunasan),
    fcidField("Tgl Lahir",                r.tglLahir),
    fcidField("NOPENS",                   r.nomorPensiun),
    fcidField("Tanggal Akhir Kredit",     j.akhirKredit),
    fcidField("Nama",                     r.nama),
    fcidField("Nomor Rekening Tabungan",  j.norekTab),
    fcidField("Awal Kredit",              j.awalKredit),
    fcidField("Nomor Perjanjian Kredit",  j.noPk),
    fcidField("Plafon",                   rp(j.plafon)),
    fcidField("Cabang Mitra Bayar",       j.cabangMitra),
    fcidField("Nomor Rekening Kredit",    j.norekKredit),
    fcidField("Besaran Angsuran",         rp(j.angsuran)),
    fcidField("Mitra Bayar",              r.mitra),
    fcidField("Sub Kredit",               j.subKredit),
    fcidField("Jenis Tabungan",           j.jnsTab),
    fcidField("Lampiran SP3R",            j.lampiranSp3r),
    fcidField("NIK",                      j.nik || r.nik),
    fcidField("Lampiran Surat Pernyataan Kredit Mitra Bayar", j.lampiranPernyataan)
  ].join("") : "";
  $("#fcid-pinjaman-kosong").style.display = j ? "none" : "";
}

/* ---- Ubah Booking: melengkapi Data Pinjaman lalu mengajukannya. */
let fciuRow = null;

/* Mitra Bayar mengikuti role yang sedang login kalau role itu memang mitra
   bayar; kalau bukan, dipakai mitra bawaan pesertanya. */
const fciuMitra = r =>
  DATA_MITRA_BAYAR.includes($("#top-role").value) ? $("#top-role").value : r.mitra;

function fciuIsi(r, asal) {
  fcbSetAsal(asal, "fciu");
  $("#fciu-batal").dataset.go = fcbAsal.layar;
  fciuRow = r;
  $("#fciu-sub").textContent = `${r.ktpa} — ${r.nama}`;

  $("#fciu-kpa").value       = r.ktpa;
  $("#fciu-nrp").value       = r.nrp;
  $("#fciu-nama").value      = r.nama;
  $("#fciu-nopens").value    = r.nomorPensiun;
  $("#fciu-tgl-lahir").value = r.tglLahir;
  $("#fciu-gaji").value      = r.gaji.toLocaleString("id-ID");

  /* Tiga field ini cerminan Data Peserta di atas — dikunci supaya tidak bisa
     berbeda dari sumbernya. */
  $("#fciu-p-tgl-lahir").value = r.tglLahir;
  $("#fciu-p-nopens").value    = r.nomorPensiun;
  $("#fciu-p-nama").value      = r.nama;

  const mitra = fciuMitra(r);
  $("#fciu-mitra").value       = mitra;
  $("#fciu-mitra-hint").textContent = DATA_MITRA_BAYAR.includes($("#top-role").value)
    ? "Mengikuti mitra bayar yang sedang login."
    : `Role aktif bukan mitra bayar — dipakai mitra bawaan peserta (${r.mitra}).`;
  $("#fciu-cabang").value      = r.cabangMitra;
  $("#fciu-nik").value         = r.nik;

  ["tgl-pelunasan", "akhir-kredit", "awal-kredit", "norek-tab", "no-pk", "plafon",
   "norek-kredit", "angsuran", "sub-kredit", "jns-tab", "sp3r", "pernyataan"]
    .forEach(id => { $(`#fciu-${id}`).value = ""; });
}

$("#fciu-submit").onclick = () => {
  const r = fciuRow;
  if (!r) { toast("Baris booking tidak ditemukan.", "bad"); return; }

  const sp3r  = $("#fciu-sp3r").files && $("#fciu-sp3r").files[0];
  const nyata = $("#fciu-pernyataan").files && $("#fciu-pernyataan").files[0];

  if (!$("#fciu-nik").value.trim())        { toast("NIK peserta belum tersedia di data kepesertaan.", "bad"); return; }
  if (!$("#fciu-angsuran").value.trim())   { toast("Besaran Angsuran wajib diisi.", "bad"); return; }
  if (!$("#fciu-sub-kredit").value.trim()) { toast("Sub Kredit wajib diisi.", "bad"); return; }
  if (!sp3r)                               { toast("Lampiran SP3R wajib diunggah.", "bad"); return; }
  if (!nyata)                              { toast("Lampiran Surat Pernyataan Kredit Mitra Bayar wajib diunggah.", "bad"); return; }

  const mitra = $("#fciu-mitra").value.trim();
  const hari  = fpsHariIni();
  /* Satu objek pinjaman dipakai dua kali: disimpan di baris Individu supaya
     bisa ditampilkan lagi di Detail Booking, dan dibawa ke Pinjaman » Pengajuan. */
  const pinjaman = {
    tglPermohonan: hari,
    tglPelunasan:  $("#fciu-tgl-pelunasan").value,
    awalKredit:    $("#fciu-awal-kredit").value,
    akhirKredit:   $("#fciu-akhir-kredit").value,
    plafon:        fpdAngka($("#fciu-plafon").value),
    gajiPeserta:   r.gaji,
    angsuran:      fpdAngka($("#fciu-angsuran").value),
    norekTab:      $("#fciu-norek-tab").value.trim(),
    norekKredit:   $("#fciu-norek-kredit").value.trim(),
    noPk:          $("#fciu-no-pk").value.trim(),
    nik:           $("#fciu-nik").value.trim(),
    jnsTab:        $("#fciu-jns-tab").value.trim(),
    cabangMitra:   $("#fciu-cabang").value.trim(),
    subKredit:     $("#fciu-sub-kredit").value.trim(),
    lampiranSp3r:  sp3r.name, lampiranPernyataan: nyata.name
  };

  /* Barisnya masuk Pinjaman » Pengajuan berstatus "Pengajuan"; keputusannya
     diambil di Persetujuan, yang lalu mengubahnya jadi Booked/Dibatalkan. */
  fpgRowsAll.unshift({
    ktpa: r.ktpa, nrp: r.nrp, mitra, nomorPensiun: r.nomorPensiun,
    nama: r.nama, tglLahir: r.tglLahir,
    statusPinjaman: "Pengajuan", statusPensiun: r.pensiun === "Y" ? "Pensiun" : "Aktif",
    bookingTgl: "", bookingUser: "",
    pengajuanTgl: hari, pengajuanUser: "operator.mitra",
    catatan: `Diajukan dari ${fcbAsal.sumber}.`,
    pinjaman: { ...pinjaman },
    riwayat: [{ tgl: hari, user: "operator.mitra", aksi: "Diajukan",
                ket: `Data pinjaman dilengkapi dari ${fcbAsal.sumber}` }]
  });

  fpsTambah({
    ktpa: r.ktpa, nrp: r.nrp, mitra, nopens: r.nomorPensiun,
    nama: r.nama, tglLahir: r.tglLahir, aktivitas: "Pengajuan Pinjaman"
  }, fcbAsal.sumber);

  r.status   = "Pengajuan";
  r.pinjaman = pinjaman;   /* dipakai Detail Booking */
  fcbAsal.render();
  renderFpg();
  renderFps();
  go(fcbAsal.layar);
  toast(`Pengajuan pinjaman ${r.nama} disubmit — masuk Pinjaman » Pengajuan.`, "ok");
};

/* ---- Pembatalan booking: barisnya memang lahir dari booking, jadi dibatalkan
   berarti dikeluarkan dari daftar. */
function fciBatal(r) {
  $("#modal-title").textContent = "Pembatalan Booking";
  $("#modal-sub").textContent   = `${r.ktpa} — ${r.nama}`;
  $("#modal-ico").style.display = "";
  $("#modal-ico").className     = "modal-ico bad";
  $("#modal-ico").textContent   = "⊗";
  $("#modal-body").innerHTML = `
    <div style="font-size:13px;color:var(--body);line-height:1.7;margin-bottom:18px">
      Booking <b>${esc(r.nama)}</b> akan dibatalkan dan dikeluarkan dari daftar.
    </div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn btn-ghost" id="fci-batal-tidak">Batal</button>
      <button class="btn btn-danger-solid" id="fci-batal-ok">Batalkan Booking</button>
    </div>`;
  openModal();
  $("#fci-batal-tidak").onclick = closeModal;
  $("#fci-batal-ok").onclick = () => {
    fciRows = fciRows.filter(x => x !== r);
    renderFci();
    closeModal();
    toast(`Booking ${r.nama} dibatalkan.`);
  };
}

/* Dipanggil tombol Booking di layar Pencarian Peserta. */
function fciTambah(p, namaPenerima, nopensPenerima) {
  if (fciRows.some(r => r.ktpa === p.kpa)) return false;
  fciRows.unshift({
    id: "ci" + (++fciSeq),
    ktpa: p.kpa, nrp: p.nrp || "", nomorPensiun: p.nomorPensiun || p.nopens || "",
    nama: p.nama, tglLahir: p.tglLahir || "",
    pensiun: (p.nomorPensiun || p.nopens) ? "Y" : "T",
    hidup: DATA_FLAGGING_PENSIUN_WARIS.includes(p) ? "T" : "Y",
    nopensPenerima: nopensPenerima || "", namaPenerima: namaPenerima || p.nama,
    status: "Booked",
    gaji: p.gaji || 0, nik: fciNik(p.nama), mitra: p.mitra, cabangMitra: ""
  });
  fciPager.hal = 1;
  renderFci();
  return true;
}

/* NIK dicocokkan lewat registri nama; peserta yang belum terdaftar di sana
   dibiarkan kosong dan baru bisa disubmit setelah NIK-nya tersedia. */
function fciNik(nama) {
  const kunci = Object.keys(DATA_NIK).find(k =>
    DATA_NIK[k].nama.toUpperCase().startsWith(String(nama).toUpperCase()));
  return kunci || "";
}

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-fci-detail]");
  if (bDetail) { fcidIsi(fciCari(bDetail.dataset.fciDetail), "individu"); go("flagging-cb-booking-detail"); return; }

  const bUbah = e.target.closest("[data-fci-ubah]");
  if (bUbah && !bUbah.disabled) { fciuIsi(fciCari(bUbah.dataset.fciUbah), "individu"); go("flagging-cb-booking-ubah"); return; }

  const bBatal = e.target.closest("[data-fci-batal]");
  if (bBatal && !bBatal.disabled) { fciBatal(fciCari(bBatal.dataset.fciBatal)); return; }

  const bHal = e.target.closest("[data-fci-hal]");
  if (bHal) { fciPager.hal = +bHal.dataset.fciHal; renderFci(); }
});

renderFci();

/* =============================================== FLAGGING » CHECK DAN BOOKING » KOLEKTIF */

let fcbkPager  = { hal: 1, per: 6 };
let fcbkFilter = { ktpa: "", nrp: "", nik: "", nama: "" };
/* Salinan yang bisa berubah — data asli di data.js dibiarkan utuh supaya
   refresh browser selalu mengembalikan kondisi awal. Baris batch bertambah
   tiap kali booking disimpan; status booking peserta ikut diperbarui. */
let fcbkBatchRows   = [...DATA_FLAGGING_KOLEKTIF_BATCH];
let fcbkPesertaRows = DATA_FLAGGING_KOLEKTIF_PESERTA.map(r => ({ ...r }));

/* ---- tab Mitra: daftar peserta */
/* Tab Peserta hanya memuat peserta yang sudah dibooking — barisnya bertambah
   begitu tombol Booking di layar Check & Booking ditekan. */
function fcbkRows() {
  const f = fcbkFilter;
  return fcbkPesertaRows.filter(r => r.booking &&
    (!f.ktpa || r.ktpa.toLowerCase().includes(f.ktpa)) &&
    (!f.nrp  || r.nrp.includes(f.nrp)) &&
    /* Berkas mitra belum membawa kolom NIK, jadi filternya dicocokkan ke NRP
       yang pada peserta ASN memang berupa NIP 18 digit. */
    (!f.nik  || r.nrp.includes(f.nik)) &&
    (!f.nama || r.nama.toLowerCase().includes(f.nama) || r.namaPenerima.toLowerCase().includes(f.nama))
  );
}

/* Kode Y/T ditampilkan sebagai badge kecil supaya sekilas terbaca, sama
   seperti kolom status di tabel lain. */
const fcbkKode = v => `<span class="pill ${v === "Y" ? "pill-ok" : "pill-info"}">${esc(v)}</span>`;
const fcbkKosong = v => v ? esc(v) : `<span style="color:var(--faint)">–</span>`;
/* Aksi per baris memakai aturan yang sama dengan daftar Individu: Ubah dan
   Pembatalan hanya hidup selama booking-nya belum diajukan. */
function fcbkAksi(r) {
  const bisa   = r.status === "Booked";
  const alasan = bisa ? "" : "Hanya untuk booking berstatus Booked";
  return `
    <button class="btn btn-info btn-sm" data-fcbk-detail="${esc(r.ktpa)}">Detail</button>
    <button class="btn btn-ghost btn-sm" data-fcbk-ubah="${esc(r.ktpa)}" ${bisa ? "" : "disabled"}
      title="${esc(bisa ? "Lengkapi data pinjaman" : alasan)}">Ubah</button>
    <button class="btn btn-danger btn-sm" data-fcbk-batal="${esc(r.ktpa)}" ${bisa ? "" : "disabled"}
      title="${esc(bisa ? "Batalkan booking" : alasan)}">Pembatalan</button>`;
}


function renderFcbkPeserta() {
  const rows = fcbkRows();
  const pg   = pagerPotong(rows, fcbkPager);

  $("#fcbk-peserta-body").innerHTML = pg.hal.length
    ? pg.hal.map((r, i) => `
      <tr>
        <td>${pg.mulai + i + 1}</td>
        <td class="t-strong">${esc(r.ktpa)}</td>
        <td>${esc(r.nrp)}</td>
        <td>${fcbkKosong(r.nomorPensiun)}</td>
        <td class="t-strong">${esc(r.nama)}</td>
        <td>${esc(r.tglLahir)}</td>
        <td>${fcbkKode(r.pensiun)}</td>
        <td>${fcbkKode(r.hidup)}</td>
        <td>${fcbkKosong(r.nopensPenerima)}</td>
        <td class="t-strong">${esc(r.namaPenerima)}</td>
        <td><input type="checkbox" ${r.booking ? "checked" : ""} disabled
             aria-label="${r.booking ? "Sudah dibooking" : "Belum dibooking"}"></td>
        <td>${fciPill(r.status)}</td>
        <td class="stick-r" style="white-space:nowrap">${fcbkAksi(r)}</td>
      </tr>`).join("")
    : `<tr><td colspan="13"><div class="empty">${
        fcbkPesertaRows.some(r => r.booking)
          ? "Tidak ada peserta yang cocok dengan filter."
          : "Belum ada peserta yang dibooking. Jalankan Check &amp; Booking Flagging Kolektif terlebih dahulu."
      }</div></td></tr>`;

  $("#fcbk-peserta-count").innerHTML  = pagerNote(pg, "peserta", "");
  $("#fcbk-peserta-pager").innerHTML  = rows.length ? pagerHtml(fcbkPager, pg, "data-fcbk-hal") : "";
  renderTopNotif();
}

$("#fcbk-cari").onclick = () => {
  fcbkFilter = {
    ktpa:   $("#fcbk-f-ktpa").value.trim().toLowerCase(),
    nrp:    $("#fcbk-f-nrp").value.trim(),
    nik:    $("#fcbk-f-nik").value.trim(),
    nama:   $("#fcbk-f-nama").value.trim().toLowerCase()
  };
  fcbkPager.hal = 1;
  renderFcbkPeserta();
};

/* Baris tabel Peserta memakai layar Detail/Ubah bersama; KPA jadi kuncinya
   karena satu peserta hanya muncul sekali di daftar kolektif. */
function fcbkCariPeserta(ktpa, aksi) {
  const r = fcbkPesertaRows.find(x => x.ktpa === ktpa);
  if (!r) return;
  if (aksi === "ubah") { fciuIsi(r, "kolektif"); go("flagging-cb-booking-ubah"); }
  else                 { fcidIsi(r, "kolektif"); go("flagging-cb-booking-detail"); }
}

/* Pembatalan tidak mengeluarkan barisnya — statusnya berubah jadi "Dibatalkan"
   supaya jejak booking yang pernah ada tetap terlihat di tabel Peserta. */
function fcbkBatalBooking(ktpa) {
  const r = fcbkPesertaRows.find(x => x.ktpa === ktpa);
  if (!r) return;
  $("#modal-title").textContent = "Pembatalan Booking";
  $("#modal-sub").textContent   = `${r.ktpa} — ${r.nama}`;
  $("#modal-ico").style.display = "";
  $("#modal-ico").className     = "modal-ico bad";
  $("#modal-ico").textContent   = "⊗";
  $("#modal-body").innerHTML = `
    <div style="font-size:13px;color:var(--body);line-height:1.7;margin-bottom:18px">
      Booking <b>${esc(r.nama)}</b> akan dibatalkan — statusnya berubah menjadi Dibatalkan.
    </div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn btn-ghost" id="fcbk-batal-tidak">Batal</button>
      <button class="btn btn-danger-solid" id="fcbk-batal-ok">Batalkan Booking</button>
    </div>`;
  openModal();
  $("#fcbk-batal-tidak").onclick = closeModal;
  $("#fcbk-batal-ok").onclick = () => {
    r.status = "Dibatalkan";
    renderFcbkPeserta();
    closeModal();
    toast(`Booking ${r.nama} dibatalkan.`);
  };
}

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-fcbk-detail]");
  if (bDetail) { fcbkCariPeserta(bDetail.dataset.fcbkDetail, "detail"); return; }

  const bUbah = e.target.closest("[data-fcbk-ubah]");
  if (bUbah && !bUbah.disabled) { fcbkCariPeserta(bUbah.dataset.fcbkUbah, "ubah"); return; }

  const bBatal = e.target.closest("[data-fcbk-batal]");
  if (bBatal && !bBatal.disabled) { fcbkBatalBooking(bBatal.dataset.fcbkBatal); return; }

  const b = e.target.closest("[data-fcbk-hal]");
  if (b) { fcbkPager.hal = +b.dataset.fcbkHal; renderFcbkPeserta(); }
});

/* ---- Mitra: riwayat batch yang diunggah */
let fcbkBatchFilter = { mitra: "", tanggal: "" };

function fcbkBatchDaftar() {
  const f = fcbkBatchFilter;
  return fcbkBatchRows.filter(r =>
    (!f.mitra   || r.mitra.toLowerCase().includes(f.mitra)) &&
    (!f.tanggal || r.tanggal === f.tanggal)
  );
}

function renderFcbkBatch() {
  const rows = fcbkBatchDaftar();
  /* Empty state membedakan "belum pernah unggah" dari "filternya tidak kena",
     supaya operator tahu apakah datanya memang belum ada. */
  $("#fcbk-batch-body").innerHTML = rows.length
    ? rows.map(r => `
      <tr>
        <td class="t-strong">${esc(r.mitra)}</td>
        <td><span class="pill ${r.status === "Selesai" ? "pill-ok" : "pill-warn"}">${esc(r.status)}</span></td>
        <td>${esc(r.pengguna)}</td>
        <td>${esc(r.tanggal)}</td>
      </tr>`).join("")
    : `<tr><td colspan="4"><div class="empty">${
        fcbkBatchRows.length
          ? "Tidak ada batch yang cocok dengan filter."
          : "Belum ada batch kolektif yang diunggah."
      }</div></td></tr>`;
  $("#fcbk-batch-count").textContent = `Menampilkan ${rows.length} data`;
}

$("#fcbk-batch-cari").onclick = () => {
  fcbkBatchFilter = {
    mitra:   $("#fcbk-bf-mitra").value.trim().toLowerCase(),
    tanggal: $("#fcbk-bf-tanggal").value
  };
  renderFcbkBatch();
};
/* ---- layar Check & Booking Flagging Kolektif (Mitra + unggah berkas)
   Berkas yang diunggah ditampilkan apa adanya di tabel di bawah form; kolom
   Booking berupa kotak centang, dan peserta yang sudah pernah dibooking
   dikunci supaya tidak terpilih dua kali. */
let fcbkFilePilih = "";
let fcbkHasilTampil = false;
let fcbkHasilPager  = { hal: 1, per: 10 };
const fcbkPilih = new Set();          /* index baris yang dicentang */

bindMitraAutocomplete("fcbk-mitra", "fcbk-mitra-list");

function fcbkResetCheck() {
  fcbkFilePilih       = "";
  fcbkHasilTampil     = false;
  fcbkHasilPager.hal  = 1;
  fcbkPilih.clear();
  $("#fcbk-mitra").value             = "";
  $("#fcbk-file-nama").style.display = "none";
  $("#fcbk-hasil").style.display     = "none";
}

$("#fcbk-pilih-file").onclick = () => {
  fcbkFilePilih = "batch-flagging-kolektif.xlsx";
  $("#fcbk-file-nama").textContent   = `✓ ${fcbkFilePilih} siap diproses`;
  $("#fcbk-file-nama").style.display = "";
};

/* Hasil pengecekan per baris — baris tanpa kolom `validasi` berarti lolos. */
const fcbkValidasi = r => r.validasi
  ? `<span class="pill pill-bad">${esc(r.validasi)}</span>`
  : `<span class="pill pill-ok">Lolos</span>`;

function renderFcbkHasil() {
  const pg = pagerPotong(fcbkPesertaRows, fcbkHasilPager);
  /* Nomor urut dan kunci centang memakai index absolut, bukan index halaman,
     supaya pilihan tetap utuh saat pindah halaman. */
  $("#fcbk-hasil-body").innerHTML = pg.hal.map((r, n) => { const i = pg.mulai + n; return `
    <tr>
      <td>${i + 1}</td>
      <td class="t-strong">${esc(r.ktpa)}</td>
      <td>${esc(r.nrp)}</td>
      <td>${fcbkKosong(r.nomorPensiun)}</td>
      <td class="t-strong">${esc(r.nama)}</td>
      <td>${esc(r.tglLahir)}</td>
      <td>${fcbkKode(r.pensiun)}</td>
      <td>${fcbkKode(r.hidup)}</td>
      <td>${fcbkKosong(r.nopensPenerima)}</td>
      <td class="t-strong">${esc(r.namaPenerima)}</td>
      <td>${fcbkValidasi(r)}</td>
      <td><input type="checkbox" data-fcbk-row="${i}" ${fcbkPilih.has(i) ? "checked" : ""}></td>
    </tr>`; }).join("");

  const total = fcbkPesertaRows.length;
  $("#fcbk-hasil-count").textContent = `${fcbkPilih.size} dari ${total} peserta dipilih`;
  $("#fcbk-hasil-note").innerHTML    = pagerNote(pg, "peserta", "");
  $("#fcbk-hasil-pager").innerHTML   = pagerHtml(fcbkHasilPager, pg, "data-fcbkh-hal");

  /* Centang-semua ikut keadaan baris: penuh, sebagian, atau kosong. */
  const all = $("#fcbk-chk-all");
  all.checked       = total > 0 && fcbkPilih.size === total;
  all.indeterminate = fcbkPilih.size > 0 && fcbkPilih.size < total;
}

$("#fcbk-chk-all").onchange = e => {
  fcbkPilih.clear();
  if (e.target.checked) fcbkPesertaRows.forEach((_, i) => fcbkPilih.add(i));
  renderFcbkHasil();
};
$("#fcbk-hasil-body").onchange = e => {
  const c = e.target.closest("[data-fcbk-row]");
  if (!c) return;
  const i = +c.dataset.fcbkRow;
  if (c.checked) fcbkPilih.add(i); else fcbkPilih.delete(i);
  renderFcbkHasil();
};
document.addEventListener("click", e => {
  const b = e.target.closest("[data-fcbkh-hal]");
  if (b) { fcbkHasilPager.hal = +b.dataset.fcbkhHal; renderFcbkHasil(); }
});

$("#fcbk-proses").onclick = () => {
  if (!$("#fcbk-mitra").value.trim()) { toast("Mitra belum dipilih.", "bad"); return; }
  if (!fcbkFilePilih)                 { toast("File batch belum diunggah.", "bad"); return; }

  /* Peserta yang sudah dibooking ikut tercentang sejak awal, tapi tetap bisa
     dilepas centangnya kalau operator ingin membatalkan bookingnya. */
  fcbkPilih.clear();
  fcbkPesertaRows.forEach((r, i) => { if (r.booking) fcbkPilih.add(i); });
  fcbkHasilTampil    = true;
  fcbkHasilPager.hal = 1;
  renderFcbkHasil();
  $("#fcbk-hasil").style.display = "";
  const gagal = fcbkPesertaRows.filter(r => r.validasi).length;
  toast(`Berkas diproses — ${fcbkPesertaRows.length} peserta ditemukan` +
        (gagal ? `, ${gagal} tidak lolos validasi.` : "."), "ok");
};

$("#fcbk-simpan-booking").onclick = () => {
  const mitra = $("#fcbk-mitra").value.trim();
  if (!fcbkHasilTampil) { toast("Proses berkas terlebih dahulu.", "bad"); return; }
  if (!fcbkPilih.size)  { toast("Pilih minimal satu peserta untuk dibooking.", "bad"); return; }

  /* Yang tidak lolos validasi tidak boleh ikut dibooking. */
  const ditolak = [...fcbkPilih].filter(i => fcbkPesertaRows[i].validasi).length;
  if (ditolak) {
    toast(`${ditolak} peserta yang dipilih tidak lolos validasi — lepas centangnya terlebih dahulu.`, "bad");
    return;
  }

  const jumlah = fcbkPilih.size;
  /* Booking kolektif hanya menandai pesertanya "Booked" dan menstempel mitra
     batch-nya. Pengajuan pinjamannya dibuat belakangan lewat tombol Ubah di
     tabel Peserta — sama seperti alur Individu. */
  fcbkPesertaRows.forEach((r, i) => {
    r.booking = fcbkPilih.has(i);
    if (r.booking) { r.status = r.status || "Booked"; r.mitra = mitra; }
  });
  fcbkBatchRows.unshift({
    mitra, status:"Selesai", pengguna:"Operator Kepesertaan",
    tanggal: new Date().toISOString().slice(0, 10)
  });
  renderFcbkBatch();
  renderFcbkPeserta();
  renderFps();
  go("flagging-cb-kolektif");
  toast(`Booking flagging kolektif ${mitra} berhasil untuk ${jumlah} peserta — lengkapi data pinjamannya lewat tombol Ubah.`, "ok");
};

renderFcbkPeserta();
renderFcbkBatch();

/* ===================================================== FLAGGING » PINJAMAN » PENGAJUAN */

let fpgPager  = { hal: 1, per: 10 };
let fpgFilter = { cari: "", status: "Semua Status" };
/* Salinan hidup — status pinjaman berubah saat booking dibatalkan. */
let fpgRowsAll = DATA_FLAGGING_PENGAJUAN.map(r => ({ ...r, riwayat: r.riwayat.map(h => ({ ...h })) }));

$("#fpg-f-status").innerHTML =
  ["Semua Status", ...FPG_STATUS_PINJAMAN].map(s => `<option>${esc(s)}</option>`).join("");

const fpgPillStatus = s => `<span class="pill ${
  s === "Booked" ? "pill-ok" : s === "Dibatalkan" ? "pill-bad" : "pill-warn"}">${esc(s)}</span>`;
const fpgKosong = v => v ? esc(v) : `<span style="color:var(--faint)">–</span>`;

/* Semua status tampil di sini, termasuk yang masih "Pengajuan" dan sedang
   menunggu keputusan di Persetujuan. */
function fpgRows() {
  const f = fpgFilter;
  return fpgRowsAll.filter(r =>
    FPG_STATUS_PINJAMAN.includes(r.statusPinjaman) &&
    (f.status === "Semua Status" || r.statusPinjaman === f.status) &&
    (!f.cari || [r.ktpa, r.nrp, r.nama].some(v => v.toLowerCase().includes(f.cari)))
  );
}

function renderFpg() {
  const rows = fpgRows();
  const pg   = pagerPotong(rows, fpgPager);

  $("#fpg-body").innerHTML = pg.hal.length
    ? pg.hal.map(r => `
      <tr>
        <td class="t-strong">${esc(r.ktpa)}</td>
        <td>${esc(r.nrp)}</td>
        <td>${esc(r.mitra)}</td>
        <td>${fpgKosong(r.nomorPensiun)}</td>
        <td class="t-strong">${esc(r.nama)}</td>
        <td>${esc(r.tglLahir)}</td>
        <td>${fpgPillStatus(r.statusPinjaman)}</td>
        <td>${esc(r.statusPensiun)}</td>
        <td>${fpgKosong(r.bookingTgl)}</td>
        <td>${fpgKosong(r.bookingUser)}</td>
        <td>${esc(r.pengajuanTgl)}</td>
        <td>${esc(r.pengajuanUser)}</td>
        <td class="truncate-cell" title="${esc(r.catatan)}">${fpgKosong(r.catatan)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-info btn-sm" data-fpg-detail="${esc(r.ktpa)}">Detail</button>
          <button class="btn btn-ghost btn-sm" data-fpg-riwayat="${esc(r.ktpa)}">Riwayat</button>
        </td>
      </tr>`).join("")
    : `<tr><td colspan="14"><div class="empty">Tidak ada pengajuan yang cocok dengan filter.</div></td></tr>`;

  $("#fpg-count").innerHTML = pagerNote(pg, "pengajuan", "");
  $("#fpg-pager").innerHTML = rows.length ? pagerHtml(fpgPager, pg, "data-fpg-hal") : "";
}

$("#fpg-cari").onclick = () => {
  fpgFilter = {
    cari:   $("#fpg-f-cari").value.trim().toLowerCase(),
    status: $("#fpg-f-status").value
  };
  fpgPager.hal = 1;
  renderFpg();
};

/* ---- layar Unggah Pengajuan Flagging */
let fpgFilePilih = "";

bindMitraAutocomplete("fpg-mitra", "fpg-mitra-list");

function fpgResetUnggah() {
  fpgFilePilih = "";
  $("#fpg-mitra").value             = "";
  $("#fpg-file-nama").style.display = "none";
}

$("#fpg-pilih-file").onclick = () => {
  fpgFilePilih = "pengajuan-flagging.xlsx";
  $("#fpg-file-nama").textContent   = `✓ ${fpgFilePilih} siap diunggah`;
  $("#fpg-file-nama").style.display = "";
};

$("#fpg-kirim").onclick = () => {
  const mitra = $("#fpg-mitra").value.trim();
  if (!mitra)        { toast("Mitra belum dipilih.", "bad"); return; }
  if (!fpgFilePilih) { toast("Berkas pengajuan belum diunggah.", "bad"); return; }

  /* Submit mengirim pengajuan milik mitra tersebut yang masih berstatus
     "Pengajuan" ke antrean Persetujuan. */
  let masuk = 0;
  fpgRowsAll.filter(r => r.mitra === mitra && r.statusPinjaman === "Pengajuan").forEach(r => {
    if (fpsTambah({
      ktpa: r.ktpa, nrp: r.nrp, mitra: r.mitra, nopens: r.nomorPensiun,
      nama: r.nama, tglLahir: r.tglLahir
    }, "Pengajuan")) masuk++;
  });
  renderFps();
  go("flagging-pinjaman-pengajuan");
  toast(masuk
    ? `Berkas pengajuan flagging ${mitra} disubmit — ${masuk} peserta masuk antrean Persetujuan.`
    : `Berkas pengajuan flagging ${mitra} disubmit. Tidak ada pengajuan baru untuk mitra ini.`, "ok");
};

/* ---- aksi per baris */
const fpgCari = ktpa => fpgRowsAll.find(r => r.ktpa === ktpa);

function fpgBaris(label, nilai) {
  return `<div style="display:flex;gap:12px;padding:7px 0;border-bottom:1px solid var(--line-soft)">
    <div class="fl caps" style="width:170px;flex-shrink:0;margin:0">${esc(label)}</div>
    <div style="flex:1;font-size:12.5px;color:var(--ink);font-weight:600">${nilai || `<span style="color:var(--faint)">–</span>`}</div>
  </div>`;
}
/* ---- layar Detail Pengajuan (Data Pinjaman)
   Baca-saja seluruhnya. Barisnya sampai ke sini hanya kalau statusnya masih
   "Pengajuan", artinya sudah dikirim ke Persetujuan dan sedang menunggu
   keputusan — jadi tidak ada lagi yang boleh disunting dari layar ini. */
let fpdRow = null;

function fpdIsi(r) {
  fpdRow = r;
  const p = r.pinjaman;
  $("#fpd-sub").textContent = `${r.ktpa} — ${r.nama}`;

  /* Info Peserta */
  $("#fpd-kpa").value       = r.ktpa;
  $("#fpd-nrp").value       = r.nrp;
  $("#fpd-nama").value      = r.nama;
  $("#fpd-nopens").value    = r.nomorPensiun;
  $("#fpd-tgl-lahir").value = r.tglLahir;
  $("#fpd-gaji").value      = p.gajiPeserta.toLocaleString("id-ID");

  /* Info Pinjaman */
  $("#fpd-tgl-permohonan").value = p.tglPermohonan;
  $("#fpd-p-tgl-lahir").value    = r.tglLahir;
  $("#fpd-p-nopens").value       = r.nomorPensiun;
  $("#fpd-akhir-kredit").value   = p.akhirKredit;
  $("#fpd-p-nama").value         = r.nama;
  $("#fpd-norek-tab").value      = p.norekTab;
  $("#fpd-awal-kredit").value    = p.awalKredit;
  $("#fpd-no-pk").value          = p.noPk;
  $("#fpd-plafon").value         = p.plafon.toLocaleString("id-ID");
  $("#fpd-cabang").value         = p.cabangMitra;
  $("#fpd-norek-kredit").value   = p.norekKredit;
  $("#fpd-angsuran").value       = p.angsuran.toLocaleString("id-ID");
  $("#fpd-mitra").value          = r.mitra;
  $("#fpd-sub-kredit").value     = p.subKredit;
  $("#fpd-jns-tab").value        = p.jnsTab;
  $("#fpd-nik").value            = p.nik;
  $("#fpd-sp3r").value           = "";
  $("#fpd-pernyataan").value     = "";
  $("#fpd-sp3r-nama").textContent       = `Berkas saat ini: ${p.lampiranSp3r}`;
  $("#fpd-pernyataan-nama").textContent = `Berkas saat ini: ${p.lampiranPernyataan}`;

  /* Hasil Cek NIK milik baris sebelumnya tidak boleh ikut terbawa. */
  fpdNikRujukan = null;
  fpdCekKecocokanNik();
  $("#fpd-terkunci-teks").textContent =
    "Pengajuan ini sudah masuk antrean Persetujuan dengan aktivitas " +
    "\"Pengajuan Pinjaman\" berstatus Pending — datanya tidak dapat diubah lagi.";
}


/* ---- Cek NIK
   Nama dan Tgl Lahir pada Info Pinjaman dibandingkan dengan registri NIK.
   Yang tidak cocok ditandai merah dan menahan Submit sampai diperbaiki;
   tandanya hilang sendiri begitu isinya sudah sama dengan data NIK. */
let fpdNikRujukan = null;      /* hasil Cek NIK terakhir, null = belum dicek */

function fpdTandaiField(fieldId, errId, salah, pesan) {
  $(`#${fieldId}`).classList.toggle("err", salah);
  $(`#${errId}`).textContent   = salah ? pesan : "";
  $(`#${errId}`).style.display = salah ? "" : "none";
}

/* Perbandingan nama longgar terhadap spasi & besar-kecil huruf. */
const fpdSamaNama = (a, b) =>
  a.trim().replace(/\s+/g, " ").toUpperCase() === b.trim().replace(/\s+/g, " ").toUpperCase();

function fpdCekKecocokanNik() {
  if (!fpdNikRujukan) return { nama: false, tgl: false };
  const nama = !fpdSamaNama($("#fpd-p-nama").value, fpdNikRujukan.nama);
  const tgl  = $("#fpd-p-tgl-lahir").value !== fpdNikRujukan.tglLahir;
  fpdTandaiField("fpd-f-nama", "fpd-err-nama", nama,
    "Nama Tidak Sesuai NIK, harap ubah nama sesuai NIK");
  fpdTandaiField("fpd-f-tgl-lahir", "fpd-err-tgl-lahir", tgl,
    "Tanggal Lahir Tidak Sesuai NIK, harap ubah nama sesuai NIK");
  return { nama, tgl };
}
/* Begitu operator memperbaiki isiannya, tanda merahnya ikut dievaluasi ulang. */
$("#fpd-p-nama").oninput       = fpdCekKecocokanNik;
$("#fpd-p-tgl-lahir").onchange = fpdCekKecocokanNik;

$("#fpd-cek-nik").onclick = () => {
  const nik = $("#fpd-nik").value.trim();
  if (!/^\d{16}$/.test(nik)) {
    showAlertPopupFpd("Validasi NIK", "NIK tidak valid — harus 16 digit angka.", "bad");
    return;
  }
  const rujukan = DATA_NIK[nik];
  if (!rujukan) {
    fpdNikRujukan = null;
    fpdCekKecocokanNik();
    showAlertPopupFpd("Validasi NIK", `NIK ${nik} tidak ditemukan pada data Dukcapil.`, "bad");
    return;
  }
  fpdNikRujukan = rujukan;
  const salah = fpdCekKecocokanNik();
  if (salah.nama || salah.tgl) {
    showAlertPopupFpd("Validasi NIK",
      `NIK ${nik} terdaftar atas nama ${rujukan.nama} (${rujukan.tglLahir}). ` +
      `Perbaiki data yang ditandai merah sebelum mengirim pengajuan.`, "bad");
    return;
  }
  showAlertPopupFpd("Validasi NIK", `NIK ${nik} valid dan cocok dengan Nama serta Tanggal Lahir.`, "ok");
};

function showAlertPopupFpd(judul, pesan, tone) {
  $("#modal-title").textContent = judul;
  $("#modal-sub").textContent   = "";
  $("#modal-body").innerHTML = `
    <div class="alert alert-${tone === "ok" ? "ok" : "bad"}"><span>${tone === "ok" ? "✓" : "⚠"}</span><span>${esc(pesan)}</span></div>
    <div class="form-actions" style="justify-content:flex-end"><button class="btn btn-ghost" id="fpd-alert-tutup">Tutup</button></div>`;
  openModal();
  $("#fpd-alert-tutup").onclick = closeModal;
}

const fpdAngka = v => Number(String(v).replace(/[^\d]/g, "")) || 0;

/* ---- layar Riwayat Pengajuan
   Satu baris = satu update. Kolom identitas (Mitra, Nama, No KTPA, dst) diambil
   dari baris pengajuannya, sedangkan grup "Update" berisi jejak per kejadian.
   Keterangan tiap update dipasang sebagai tooltip pada kolom Status karena
   susunan kolomnya tidak menyediakan tempat khusus. */
function fprIsi(r) {
  const p = r.pinjaman;
  $("#fpr-sub").textContent = `${r.ktpa} — ${r.nama}`;
  $("#fpr-body").innerHTML = r.riwayat.map(h => `
    <tr>
      <td>${esc(p.tglPermohonan)}</td>
      <td>${esc(r.mitra)}</td>
      <td>${esc(p.cabangMitra)}</td>
      <td class="t-strong">${esc(r.nama)}</td>
      <td class="t-strong">${esc(r.ktpa)}</td>
      <td>${fpgKosong(r.nomorPensiun)}</td>
      <td>${esc(p.nik)}</td>
      <td>${esc(p.noPk)}</td>
      <td>${esc(h.tgl)}</td>
      <td>${esc(h.user)}</td>
      <td class="t-strong" title="${esc(h.ket)}">${esc(h.aksi)}</td>
    </tr>`).join("");
  $("#fpr-count").textContent = `${r.riwayat.length} update tercatat.`;
}

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-fpg-detail]");
  if (bDetail) { fpdIsi(fpgCari(bDetail.dataset.fpgDetail)); go("flagging-pengajuan-detail"); return; }

  const bRiwayat = e.target.closest("[data-fpg-riwayat]");
  if (bRiwayat) { fprIsi(fpgCari(bRiwayat.dataset.fpgRiwayat)); go("flagging-pengajuan-riwayat"); return; }

  const bHal = e.target.closest("[data-fpg-hal]");
  if (bHal) { fpgPager.hal = +bHal.dataset.fpgHal; renderFpg(); }
});

renderFpg();

/* ==================================================== FLAGGING » PINJAMAN » PERSETUJUAN
   Antrean bersama. Tiga layar memasukkan barisnya lewat fpsTambah():
   Check dan Booking Individu, Check dan Booking Kolektif, dan Pengajuan. */

let fpsPager  = { hal: 1, per: 10 };
let fpsFilter = { cari: "", status: "Semua Status" };
let fpsRows   = DATA_FLAGGING_PERSETUJUAN.map(r => ({ ...r, riwayat: r.riwayat.map(h => ({ ...h })) }));

$("#fps-f-status").innerHTML =
  ["Semua Status", ...FPS_STATUS].map(s => `<option>${esc(s)}</option>`).join("");

const fpsHariIni = () => new Date().toISOString().slice(0, 10);
const fpsPill = s => `<span class="pill ${
  s === "Disetujui" ? "pill-ok" : s === "Ditolak" ? "pill-bad" : "pill-warn"}">${esc(s)}</span>`;
const fpsKosong = v => v ? esc(v) : `<span style="color:var(--faint)">–</span>`;
/* Pelunasan diberi nada hijau supaya beda dari permintaan yang menambah beban. */
const fpsAktivitasPill = a =>
  `<span class="pill ${a === "Pelunasan Flagging" ? "pill-ok" : "pill-info"}">${esc(a || "–")}</span>`;

/* Satu peserta hanya boleh punya satu baris yang masih berstatus "Pengajuan",
   supaya antreannya tidak menumpuk saat layar sumber ditekan berulang kali. */
function fpsTambah(entry, sumber) {
  const adaAntre = fpsRows.some(r => r.ktpa === entry.ktpa && r.status === "Pending");
  if (adaAntre) return false;
  fpsRows.unshift({
    ktpa: entry.ktpa, nrp: entry.nrp || "", mitra: entry.mitra || "",
    nopens: entry.nopens || "", nama: entry.nama, tglLahir: entry.tglLahir || "",
    /* Semua pintu masuk saat ini berupa permohonan pinjaman baru; pemanggil
       boleh menimpanya lewat entry.aktivitas kalau nanti ada jenis lain. */
    aktivitas: entry.aktivitas || "Pengajuan Pinjaman",
    /* Muatan opsional dari layar Flagging: rincian "dari → ke" untuk
       ditampilkan, dan nilai yang diterapkan begitu permintaannya disetujui. */
    perubahan: entry.perubahan, nilaiBaru: entry.nilaiBaru, pelunasan: entry.pelunasan,
    takeoverBaru: entry.takeoverBaru,
    topupBaru: entry.topupBaru,
    /* Khusus take over: `mitra` adalah pengaju, `mitraAwal` pemberi kredit
       lama. Keduanya dipakai untuk menyalakan notifikasi antar mitra. */
    mitraAwal: entry.mitraAwal || "",
    status: "Pending", tglProses: "", sumber,
    riwayat: [{ tgl: fpsHariIni(), user: "operator.mitra", aksi: "Diajukan", ket: `Masuk dari ${sumber}` }]
  });
  return true;
}

function fpsDaftar() {
  const f = fpsFilter;
  return fpsRows.filter(r =>
    /* Top up punya halaman persetujuannya sendiri. */
    r.aktivitas !== FPS_AKTIVITAS_TOPUP &&
    (f.status === "Semua Status" || r.status === f.status) &&
    (!f.cari || [r.ktpa, r.nrp, r.nama].some(v => String(v).toLowerCase().includes(f.cari)))
  );
}

function renderFps() {
  const rows = fpsDaftar();
  const pg   = pagerPotong(rows, fpsPager);

  $("#fps-body").innerHTML = pg.hal.length
    ? pg.hal.map(r => `
      <tr>
        <td class="t-strong">${esc(r.ktpa)}</td>
        <td>${esc(r.nrp)}</td>
        <td>${esc(r.mitra)}</td>
        <td>${fpsKosong(r.nopens)}</td>
        <td class="t-strong">${esc(r.nama)}</td>
        <td>${esc(r.tglLahir)}</td>
        <td>${fpsAktivitasPill(r.aktivitas)}</td>
        <td>${fpsPill(r.status)}</td>
        <td>${fpsKosong(r.tglProses)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-info btn-sm" data-fps-detail="${esc(r.ktpa)}">Detail</button>
          <button class="btn btn-ghost btn-sm" data-fps-riwayat="${esc(r.ktpa)}">Riwayat</button>
        </td>
      </tr>`).join("")
    : `<tr><td colspan="10"><div class="empty">Tidak ada data persetujuan yang cocok dengan filter.</div></td></tr>`;

  $("#fps-count").innerHTML = pagerNote(pg, "data", "");
  $("#fps-pager").innerHTML = rows.length ? pagerHtml(fpsPager, pg, "data-fps-hal") : "";
  renderTopNotif();   /* lonceng navbar ikut menyesuaikan */
}

$("#fps-cari").onclick = () => {
  fpsFilter = {
    cari:   $("#fps-f-cari").value.trim().toLowerCase(),
    status: $("#fps-f-status").value
  };
  fpsPager.hal = 1;
  renderFps();
};

const fpsCari = ktpa => fpsRows.find(r => r.ktpa === ktpa);

/* Muatan permintaan diterapkan ke data pinjaman setelah disetujui. */
function fpsTerapkan(r) {
  /* Pembatalan booking sasarannya baris di Pinjaman » Pengajuan, bukan baris
     flagging — jadi ditangani lebih dulu sebelum pencarian ke fflRows. */
  if (r.aktivitas === "Pengajuan Pembatalan Booking") {
    const asal = fpgRowsAll.find(x => x.ktpa === r.ktpa && x.statusPinjaman === "Booked");
    if (!asal) return;
    asal.statusPinjaman = "Dibatalkan";
    asal.catatan        = r.perubahan.map(p => p.ke).join("; ");
    asal.riwayat.push({
      tgl: fpsHariIni(), user:"verifikator.kep",
      aksi:"Booking dibatalkan", ket: asal.catatan
    });
    renderFpg();
    return;
  }

  /* Take over sasarannya baris di Pinjaman » Take Over, bukan baris flagging.
     "Pengajuan Take Over" datang dari layar Tambahkan dan membuat baris baru;
     "Perubahan Take Over" datang dari layar Detail dan memperbarui yang ada. */
  if (r.aktivitas === "Pengajuan Take Over" && r.takeoverBaru) {
    if (!ftoRows.some(x => x.ktpa === r.ktpa)) {
      ftoRows.unshift({ ...r.takeoverBaru, status: "Diterima",
        asTgl: fpsHariIni(), asUser: "verifikator.kep",
        catatan: "Take over disetujui." });
      renderFto();
    }
    return;
  }

  /* Top up sasarannya baris di Pinjaman » Top Up. Satu peserta boleh punya
     beberapa top up, jadi barisnya selalu ditambahkan, tidak diperbarui. */
  if (r.aktivitas === "Pengajuan Top Up" && r.topupBaru) {
    ftuRows.unshift({ ...r.topupBaru, id: "tu" + (++ftuSeq), status: "Diterima",
      tglSetuju: fpsHariIni(), pengguna: "verifikator.kep" });
    renderFtu();
    return;
  }
  if (r.aktivitas === "Perubahan Take Over") {
    const to = ftoRows.find(x => x.ktpa === r.ktpa);
    if (!to) return;
    Object.assign(to.pinjaman, r.nilaiBaru);
    to.tglPelunasan = to.pinjaman.tglPelunasan;   /* kolom daftar ikut menyesuaikan */
    to.asTgl        = fpsHariIni();
    to.asUser       = "verifikator.kep";
    to.catatan      = r.perubahan.map(p => `${p.label}: ${p.dari} → ${p.ke}`).join("; ");
    renderFto();
    if (ftdRow === to) ftdIsi(to);
    return;
  }

  const pinjaman = fflRows.find(x => x.ktpa === r.ktpa);
  if (!pinjaman) return;
  if (r.aktivitas === "Pelunasan Flagging" && r.pelunasan) {
    pinjaman.statusPinjaman = "Lunas";
    pinjaman.kategori       = r.pelunasan.kategori;
    pinjaman.riwayat.push({
      tgl: r.pelunasan.tgl, user:"verifikator.kep", aksi:"Pelunasan",
      ket: r.pelunasan.ket + (r.pelunasan.berkas ? ` (berkas: ${r.pelunasan.berkas})` : "")
    });
  } else if (r.aktivitas === "Pengajuan Pembatalan Flagging") {
    pinjaman.statusPinjaman = "Dibatalkan";
    pinjaman.riwayat.push({
      tgl: fpsHariIni(), user:"verifikator.kep",
      aksi:"Pembatalan flagging disetujui",
      ket: r.perubahan.map(p => `${p.label}: ${p.ke}`).join("; ")
    });
  } else if (r.aktivitas === "Pelepasan Flagging") {
    /* Pinjamannya sudah lunas — statusnya tetap, yang dilepas hanya penanda
       flagging di mitra bayar, jadi cukup dicatat di riwayat. */
    pinjaman.statusTagih = "N";
    pinjaman.riwayat.push({
      tgl: fpsHariIni(), user:"verifikator.kep",
      aksi:"Pelepasan flagging disetujui",
      ket: r.perubahan.map(p => `${p.label}: ${p.ke}`).join("; ")
    });
  } else if (r.nilaiBaru) {
    Object.assign(pinjaman.pinjaman, r.nilaiBaru);
    if (r.nilaiBaru.nik !== undefined) pinjaman.nik = r.nilaiBaru.nik;
    pinjaman.riwayat.push({
      tgl: fpsHariIni(), user:"verifikator.kep",
      aksi:"Perubahan data disetujui",
      ket: r.perubahan.map(p => `${p.label}: ${p.dari} → ${p.ke}`).join("; ")
    });
  }
  renderFfl();
  if (ffdRow === pinjaman) ffdIsi(pinjaman);
}

/* ---- layar Detail Persetujuan
   Tombol Setujui/Tolak hanya aktif selama barisnya masih berstatus "Pengajuan";
   yang sudah diputuskan menampilkan banner keterangan sebagai gantinya. */
let fsdRow = null;

/* Satu field mati untuk tampilan baca-saja — dipakai kartu Info Pinjaman. */
function fsdField(label, nilai) {
  return `<div class="field">
    <label class="fl">${esc(label)}</label>
    <input class="inp" value="${esc(nilai || "–")}" disabled>
  </div>`;
}

/* Info Pinjaman diambil dari baris Pengajuan dengan KPA yang sama. Baris yang
   masuk lewat Check dan Booking belum punya berkas pinjaman, jadi kartunya
   tetap tampil tapi berisi keterangan kosong. */
function fsdIsiPinjaman(r) {
  const asal = fpgRowsAll.find(x => x.ktpa === r.ktpa);
  const ada  = !!(asal && asal.pinjaman);
  $("#fsd-pinjaman").style.display        = ada ? "" : "none";
  $("#fsd-pinjaman-kosong").style.display = ada ? "none" : "";
  if (!ada) { $("#fsd-pinjaman").innerHTML = ""; return; }

  const p = asal.pinjaman;
  $("#fsd-pinjaman").innerHTML = [
    fsdField("Tgl Permohonan",            p.tglPermohonan),
    fsdField("Awal Kredit",               p.awalKredit),
    fsdField("Tanggal Akhir Kredit",      p.akhirKredit),
    fsdField("Plafon",                    rp(p.plafon)),
    fsdField("Besaran Angsuran",          rp(p.angsuran)),
    fsdField("Gaji Peserta",              rp(p.gajiPeserta)),
    fsdField("Sub Kredit",                p.subKredit),
    fsdField("Jenis Tabungan",            p.jnsTab),
    fsdField("Cabang Mitra Bayar",        p.cabangMitra),
    fsdField("Nomor Rekening Tabungan",   p.norekTab),
    fsdField("Nomor Rekening Kredit",     p.norekKredit),
    fsdField("Nomor Perjanjian Kredit",   p.noPk),
    fsdField("NIK",                       p.nik),
    fsdField("Lampiran SP3R",             p.lampiranSp3r),
    fsdField("Lampiran Surat Pernyataan", p.lampiranPernyataan)
  ].join("");
}

function fsdIsi(r) {
  fsdRow = r;
  $("#fsd-sub").textContent        = `${r.ktpa} — ${r.nama}`;
  $("#fsd-kpa").value              = r.ktpa;
  $("#fsd-nrp").value              = r.nrp;
  $("#fsd-mitra").value            = r.mitra;
  $("#fsd-nopens").value           = r.nopens;
  $("#fsd-nama").value             = r.nama;
  $("#fsd-tgl-lahir").value        = r.tglLahir;
  $("#fsd-aktivitas").innerHTML    = fpsAktivitasPill(r.aktivitas);
  /* Kartu rincian hanya untuk permintaan yang membawa daftar "dari → ke". */
  $("#fsd-kartu-perubahan").style.display = r.perubahan ? "" : "none";
  if (r.perubahan) $("#fsd-perubahan").innerHTML = r.perubahan.map(p => `
    <tr>
      <td class="t-strong">${esc(p.label)}</td>
      <td>${esc(p.dari)}</td>
      <td class="t-strong">${esc(p.ke)}</td>
    </tr>`).join("");
  $("#fsd-status").innerHTML       = fpsPill(r.status);
  $("#fsd-tgl-proses").value       = r.tglProses || "—";
  $("#fsd-sumber").value           = r.sumber;

  fsdIsiPinjaman(r);

  const menunggu = r.status === "Pending";
  $("#fsd-actions").style.display = menunggu ? "" : "none";
  $("#fsd-selesai").style.display = menunggu ? "none" : "";
  if (!menunggu) {
    const akhir = r.riwayat[r.riwayat.length - 1];
    $("#fsd-selesai-teks").textContent =
      `Pengajuan sudah ${r.status.toLowerCase()} pada ${r.tglProses} oleh ${akhir.user}. ${akhir.ket}`;
  }
}

/* Modal konfirmasi bersama untuk Setujui (catatan opsional) dan
   Tolak (alasan wajib diisi). */
function fsdKonfirmasi(mode) {
  const setuju = mode === "setuju";
  const r = fsdRow;
  $("#modal-title").textContent = setuju ? "Konfirmasi Persetujuan" : "Konfirmasi Penolakan";
  $("#modal-sub").textContent   = `${r.ktpa} — ${r.nama}`;
  $("#modal-ico").style.display = "";
  $("#modal-ico").className     = "modal-ico " + (setuju ? "warn" : "bad");
  $("#modal-ico").textContent   = setuju ? "✓" : "⊗";
  $("#modal-body").innerHTML = `
    <div style="font-size:13px;color:var(--body);line-height:1.7;margin-bottom:16px">
      Pengajuan flagging untuk <b>${esc(r.nama)}</b> pada mitra <b>${esc(r.mitra)}</b>
      akan ${setuju ? "<b>disetujui</b>" : "<b>ditolak</b>"}.
    </div>
    <div class="field">
      <label class="fl" for="fsd-alasan">${setuju
        ? "Catatan Persetujuan"
        : `Alasan Penolakan <span class="req">*</span>`}</label>
      <textarea class="inp" id="fsd-alasan" style="height:74px;padding:9px 10px;resize:vertical"
        placeholder="${setuju ? "Opsional — boleh dikosongkan." : "Wajib diisi."}"></textarea>
      ${setuju ? `<div class="hint">Boleh dikosongkan.</div>` : ""}
    </div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn btn-ghost" id="fsd-konfirm-batal">Batal</button>
      <button class="btn ${setuju ? "btn-success" : "btn-danger-solid"}" id="fsd-konfirm-ok">
        ${setuju ? "✓ Setujui" : "✕ Tolak"}</button>
    </div>`;
  openModal();
  $("#fsd-konfirm-batal").onclick = closeModal;
  $("#fsd-konfirm-ok").onclick = () => {
    const alasan = $("#fsd-alasan").value.trim();
    if (!setuju && !alasan) { toast("Alasan penolakan wajib diisi.", "bad"); return; }

    r.status    = setuju ? "Disetujui" : "Ditolak";
    r.tglProses = fpsHariIni();
    r.riwayat.push({
      tgl: r.tglProses,
      user: "verifikator.kep",
      aksi: setuju ? "Disetujui" : "Ditolak",
      ket: alasan || "Tanpa catatan tambahan"
    });

    /* Permintaan dari layar Flagging (Perubahan Data / Pelunasan /
       Pembatalan Flagging) langsung diterapkan begitu disetujui. */
    if (setuju && r.perubahan) fpsTerapkan(r);

    /* Keputusan di sini menutup pengajuannya: Disetujui → Booked,
       Ditolak → Dibatalkan. Barisnya lalu muncul di Pinjaman » Pengajuan. */
    const asal = fpgRowsAll.find(x => x.ktpa === r.ktpa && x.statusPinjaman === "Pengajuan");
    if (asal) {
      asal.statusPinjaman = setuju ? "Booked" : "Dibatalkan";
      asal.catatan        = alasan || asal.catatan;
      if (setuju) { asal.bookingTgl = r.tglProses; asal.bookingUser = "verifikator.kep"; }
      asal.riwayat.push({
        tgl: r.tglProses,
        user: "verifikator.kep",
        aksi: setuju ? "Booking disetujui" : "Pengajuan ditolak",
        ket: alasan || "Tanpa catatan tambahan"
      });
      renderFpg();
    }

    renderFps();
    fsdIsi(r);
    closeModal();
    toast(`Pengajuan ${r.nama} berhasil ${setuju ? "disetujui" : "ditolak"}.`, setuju ? "ok" : "");
  };
}

$("#fsd-setujui").onclick = () => fsdKonfirmasi("setuju");
$("#fsd-tolak").onclick   = () => fsdKonfirmasi("tolak");

/* ---- layar Riwayat Persetujuan
   Satu baris = satu update. Baris antrean hanya menyimpan identitas peserta,
   jadi kolom kredit (Tanggal Permohonan, Cabang, NIK, Nomor Pinjaman Kredit)
   dicari ke sumber pinjamannya: muatan permintaan itu sendiri kalau ada, lalu
   daftar Pengajuan, Flagging, dan Top Up. */
function fpsSumberPinjaman(r) {
  const muatan = (r.takeoverBaru && r.takeoverBaru.pinjaman)
              || (r.topupBaru    && r.topupBaru.pinjaman);
  if (muatan) return muatan;
  const dari = fpgRowsAll.find(x => x.ktpa === r.ktpa)
            || fflRows.find(x => x.ktpa === r.ktpa)
            || ftuRows.find(x => x.ktpa === r.ktpa);
  return (dari && dari.pinjaman) || {};
}

function fpsrIsi(r, asal) {
  const p = fpsSumberPinjaman(r);
  $("#fpsr-kembali").dataset.go = asal || "flagging-persetujuan";
  $("#fpsr-sub").textContent = `${r.ktpa} — ${r.nama} · ${r.aktivitas}`;
  $("#fpsr-body").innerHTML = r.riwayat.map(h => `
    <tr>
      <td>${fpgKosong(p.tglPermohonan)}</td>
      <td>${esc(r.mitra)}</td>
      <td>${fpgKosong(p.cabangMitra)}</td>
      <td class="t-strong">${esc(r.nama)}</td>
      <td class="t-strong">${esc(r.ktpa)}</td>
      <td>${fpgKosong(r.nopens)}</td>
      <td>${fpgKosong(p.nik)}</td>
      <td>${fpgKosong(p.noPk)}</td>
      <td>${esc(h.tgl)}</td>
      <td>${esc(h.user)}</td>
      <td class="t-strong" title="${esc(h.ket)}">${esc(h.aksi)}</td>
    </tr>`).join("");
  $("#fpsr-count").textContent = `${r.riwayat.length} update tercatat.`;
}

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-fps-detail]");
  if (bDetail) { fsdIsi(fpsCari(bDetail.dataset.fpsDetail)); go("flagging-persetujuan-detail"); return; }

  const bRiwayat = e.target.closest("[data-fps-riwayat]");
  if (bRiwayat) { fpsrIsi(fpsCari(bRiwayat.dataset.fpsRiwayat), "flagging-persetujuan"); go("flagging-persetujuan-riwayat"); return; }

  const bHal = e.target.closest("[data-fps-hal]");
  if (bHal) { fpsPager.hal = +bHal.dataset.fpsHal; renderFps(); }
});

renderFps();

/* ======================================================= FLAGGING » PINJAMAN » FLAGGING
   Daftar pinjaman yang flagging-nya sudah aktif. Empat aksi per baris:
   Detail (halaman, bisa disunting), Pelunasan, Pembatalan, dan Riwayat. */

let fflPager  = { hal: 1, per: 10 };
let fflFilter = { cari: "", status: "Semua Status" };
let fflRows   = DATA_FLAGGING_PINJAMAN.map(r => ({
  ...r, pinjaman: { ...r.pinjaman }, riwayat: r.riwayat.map(h => ({ ...h }))
}));

$("#ffl-f-status").innerHTML =
  ["Semua Status", ...FFL_STATUS_PINJAMAN].map(s => `<option>${esc(s)}</option>`).join("");

const fflPill = s => `<span class="pill ${
  s === "Lunas" ? "pill-ok" : s === "Dibatalkan" ? "pill-bad" : "pill-info"}">${esc(s)}</span>`;
const fflKosong = v => v ? esc(v) : `<span style="color:var(--faint)">–</span>`;

function fflDaftar() {
  const f = fflFilter;
  return fflRows.filter(r =>
    (f.status === "Semua Status" || r.statusPinjaman === f.status) &&
    (!f.cari || [r.ktpa, r.nrp, r.nik, r.nama].some(v => String(v).toLowerCase().includes(f.cari)))
  );
}

function renderFfl() {
  const rows = fflDaftar();
  const pg   = pagerPotong(rows, fflPager);
  const aktif = r => r.statusPinjaman === "Disetujui";

  $("#ffl-body").innerHTML = pg.hal.length
    ? pg.hal.map(r => {
      const p = r.pinjaman;
      return `
      <tr>
        <td>${esc(r.mitra)}</td>
        <td class="t-strong">${esc(r.ktpa)}</td>
        <td>${esc(r.nrp)}</td>
        <td>${fflKosong(r.nik)}</td>
        <td>${fflKosong(r.nomorPensiun)}</td>
        <td class="t-strong">${esc(r.nama)}</td>
        <td>${fflKosong(r.tglLahir)}</td>
        <td>${esc(p.tglPermohonan)}</td>
        <td>${esc(p.awalKredit)}</td>
        <td>${esc(p.akhirKredit)}</td>
        <td class="num">${p.plafon.toLocaleString("id-ID")}</td>
        <td>${esc(p.norekTab)}</td>
        <td>${esc(p.norekKredit)}</td>
        <td>${esc(p.noPk)}</td>
        <td>${fflPill(r.statusPinjaman)}</td>
        <td>${esc(r.statusTagih)}</td>
        <td>${fflKosong(r.tglSetuju)}</td>
        <td>${fflKosong(r.pengguna)}</td>
        <td class="stick-r" style="white-space:nowrap">
          <button class="btn btn-info btn-sm" data-ffl-detail="${esc(r.ktpa)}">Detail</button>
          <button class="btn btn-success btn-sm" data-ffl-lunas="${esc(r.ktpa)}" ${aktif(r) ? "" : "disabled"}
            title="${aktif(r) ? "Catat pelunasan" : "Hanya untuk pinjaman berstatus Disetujui"}">Pelunasan</button>
          <button class="btn btn-gold btn-sm" data-ffl-topup="${esc(r.ktpa)}" ${aktif(r) ? "" : "disabled"}
            title="${aktif(r) ? "Ajukan top up" : "Hanya untuk pinjaman berstatus Disetujui"}">Top Up</button>
          <button class="btn btn-ghost btn-sm" data-ffl-riwayat="${esc(r.ktpa)}">Riwayat</button>
        </td>
      </tr>`; }).join("")
    : `<tr><td colspan="19"><div class="empty">Tidak ada pinjaman yang cocok dengan filter.</div></td></tr>`;

  $("#ffl-count").innerHTML = pagerNote(pg, "pinjaman", "");
  $("#ffl-pager").innerHTML = rows.length ? pagerHtml(fflPager, pg, "data-ffl-hal") : "";
}

$("#ffl-cari").onclick = () => {
  fflFilter = {
    cari:   $("#ffl-f-cari").value.trim().toLowerCase(),
    status: $("#ffl-f-status").value
  };
  fflPager.hal = 1;
  renderFfl();
};

const fflCari = ktpa => fflRows.find(r => r.ktpa === ktpa);

/* ---- Detail Flagging: Info Peserta + Info Pinjaman, bisa disunting seperti
   layar Detail Pengajuan. Hanya pinjaman berstatus Disetujui yang boleh diubah. */
let ffdRow = null;

const FFD_EDITABLE = ["ffd-tgl-permohonan", "ffd-no-pk", "ffd-awal-kredit", "ffd-norek-tab",
  "ffd-akhir-kredit", "ffd-norek-kredit", "ffd-plafon", "ffd-angsuran",
  "ffd-sub-kredit", "ffd-jns-tab", "ffd-nik"];

/* Pinjaman yang sudah Disetujui atau Lunas tidak boleh disunting — begitu pula
   yang Dibatalkan. Karena ketiganya adalah seluruh status yang mungkin di layar
   ini, praktisnya Detail Flagging bersifat baca-saja; daftar dibuat eksplisit
   supaya mudah dilonggarkan lagi kalau nanti ada status baru. */
const FFD_TERKUNCI = ["Disetujui", "Lunas", "Dibatalkan"];
const ffdBisaUbah = () => ffdRow && !FFD_TERKUNCI.includes(ffdRow.statusPinjaman);

function ffdSetUbah(aktif) {
  const boleh = ffdBisaUbah() && aktif;
  FFD_EDITABLE.forEach(id => { const el = $(`#${id}`); if (el) el.disabled = !boleh; });
  $("#ffd-actions").style.display  = boleh ? "" : "none";
  $("#ffd-ubah").style.display     = ffdBisaUbah() && !aktif ? "" : "none";
  $("#ffd-terkunci").style.display = ffdBisaUbah() ? "none" : "";
  if (!ffdBisaUbah() && ffdRow) {
    $("#ffd-terkunci-teks").textContent =
      `Pinjaman berstatus ${ffdRow.statusPinjaman} tidak dapat diubah. ` +
      `Data pinjaman yang flagging-nya sudah aktif hanya bisa dilihat.`;
  }
}

function ffdIsi(r) {
  ffdRow = r;
  const p = r.pinjaman;
  $("#ffd-sub").textContent = `${r.ktpa} — ${r.nama}`;

  $("#ffd-ktpa").value      = r.ktpa;
  $("#ffd-nrp").value       = r.nrp;
  $("#ffd-nama").value      = r.nama;
  $("#ffd-nopens").value    = r.nomorPensiun;
  $("#ffd-tgl-lahir").value = r.tglLahir;
  $("#ffd-gaji").value      = p.gajiPeserta.toLocaleString("id-ID");

  $("#ffd-tgl-permohonan").value = p.tglPermohonan;
  $("#ffd-no-pk").value          = p.noPk;
  $("#ffd-awal-kredit").value    = p.awalKredit;
  $("#ffd-norek-tab").value      = p.norekTab;
  $("#ffd-akhir-kredit").value   = p.akhirKredit;
  $("#ffd-norek-kredit").value   = p.norekKredit;
  $("#ffd-plafon").value         = p.plafon.toLocaleString("id-ID");
  $("#ffd-mitra").value          = r.mitra;
  $("#ffd-angsuran").value       = p.angsuran.toLocaleString("id-ID");
  $("#ffd-cabang").value         = p.cabangMitra;
  $("#ffd-sub-kredit").value     = p.subKredit;
  $("#ffd-jns-tab").value        = p.jnsTab;
  $("#ffd-nik").value            = p.nik;
  $("#ffd-status").innerHTML     = fflPill(r.statusPinjaman);

  ffdSetUbah(false);
}

$("#ffd-ubah").onclick  = () => ffdSetUbah(true);
$("#ffd-batal").onclick = () => ffdIsi(ffdRow);

/* Perubahan tidak langsung berlaku — dikirim sebagai permintaan persetujuan
   dengan aktivitas "Perubahan Data" ke Persetujuan. Hanya field
   yang benar-benar berubah yang ikut diajukan. */
$("#ffd-simpan").onclick = () => {
  if (!$("#ffd-angsuran").value.trim())   { toast("Besaran Angsuran wajib diisi.", "bad"); return; }
  if (!$("#ffd-sub-kredit").value.trim()) { toast("Sub Kredit wajib diisi.", "bad"); return; }

  const p = ffdRow.pinjaman;
  const isian = [
    { key:"tglPermohonan", label:"Tgl Pengajuan",             nilai: $("#ffd-tgl-permohonan").value },
    { key:"noPk",          label:"Nomor Perjanjian Kredit",   nilai: $("#ffd-no-pk").value.trim() },
    { key:"awalKredit",    label:"Awal Kredit",               nilai: $("#ffd-awal-kredit").value },
    { key:"norekTab",      label:"Nomor Rekening Tabungan",   nilai: $("#ffd-norek-tab").value.trim() },
    { key:"akhirKredit",   label:"Akhir Kredit",              nilai: $("#ffd-akhir-kredit").value },
    { key:"norekKredit",   label:"Nomor Rekening Kredit",     nilai: $("#ffd-norek-kredit").value.trim() },
    { key:"plafon",        label:"Plafon",                    nilai: fpdAngka($("#ffd-plafon").value),   uang:true },
    { key:"angsuran",      label:"Besaran Angsuran",          nilai: fpdAngka($("#ffd-angsuran").value), uang:true },
    { key:"subKredit",     label:"Sub Kredit",                nilai: $("#ffd-sub-kredit").value.trim() },
    { key:"jnsTab",        label:"Jenis Tabungan",            nilai: $("#ffd-jns-tab").value.trim() },
    { key:"nik",           label:"NIK",                       nilai: $("#ffd-nik").value.trim() }
  ];

  const berubah = isian.filter(f => String(f.nilai) !== String(p[f.key]));
  if (!berubah.length) { toast("Tidak ada perubahan untuk diajukan.", "bad"); return; }

  const tampil = f => f.uang ? rp(f.nilai) : (f.nilai || "–");
  const asal   = f => f.uang ? rp(p[f.key]) : (p[f.key] || "–");
  const masuk = fpsTambah({
    ktpa: ffdRow.ktpa, nrp: ffdRow.nrp, mitra: ffdRow.mitra, nopens: ffdRow.nomorPensiun,
    nama: ffdRow.nama, tglLahir: ffdRow.tglLahir, aktivitas: "Perubahan Data",
    perubahan: berubah.map(f => ({ label: f.label, dari: asal(f), ke: tampil(f) })),
    nilaiBaru: Object.fromEntries(berubah.map(f => [f.key, f.nilai]))
  }, "Detail Flagging");
  if (!masuk) {
    toast(`${ffdRow.nama} sudah punya permintaan yang menunggu persetujuan.`, "bad");
    return;
  }

  ffdRow.riwayat.push({
    tgl: fpsHariIni(), user: "operator.mitra",
    aksi: "Perubahan data diajukan",
    ket: `${berubah.length} field menunggu persetujuan`
  });
  renderFps();
  ffdIsi(ffdRow);          /* kembalikan tampilan ke nilai lama yang masih berlaku */
  toast(`Perubahan data ${ffdRow.nama} diajukan — menunggu Persetujuan.`, "ok");
};

/* ---- layar Pelunasan
   Info Peserta & Info Pinjaman ditampilkan baca-saja (memakai fsdField), lalu
   bagian Pelunasan yang harus diisi. Tgl Pelunasan diisi awal dari Tanggal
   Akhir Kredit; kedua field wajib diisi sebelum bisa disimpan. */
let fplRow = null;

function fplIsi(r) {
  fplRow = r;
  const p = r.pinjaman;
  $("#fpl-sub").textContent = `${r.ktpa} — ${r.nama}`;

  $("#fpl-peserta").innerHTML = [
    fsdField("No. KTPA",      r.ktpa),
    fsdField("NRP/NIP",       r.nrp),
    fsdField("Nama",          r.nama),
    fsdField("Nomor Pensiun", r.nomorPensiun),
    fsdField("Tanggal Lahir", r.tglLahir),
    fsdField("Gaji Peserta",  rp(p.gajiPeserta))
  ].join("");

  $("#fpl-pinjaman").innerHTML = [
    fsdField("Tgl Pengajuan",             p.tglPermohonan),
    fsdField("Awal Kredit",               p.awalKredit),
    fsdField("Akhir Kredit",              p.akhirKredit),
    fsdField("Plafon",                    rp(p.plafon)),
    fsdField("Besaran Angsuran",          rp(p.angsuran)),
    fsdField("Sub Kredit",                p.subKredit),
    fsdField("Mitra Bayar",               r.mitra),
    fsdField("Cabang Mitra Bayar",        p.cabangMitra),
    fsdField("Jenis Tabungan",            p.jnsTab),
    fsdField("Nomor Rekening Tabungan",   p.norekTab),
    fsdField("Nomor Rekening Kredit",     p.norekKredit),
    fsdField("Nomor Perjanjian Kredit",   p.noPk)
  ].join("");

  $("#fpl-tgl").value    = p.akhirKredit;   /* mengikuti Tanggal Akhir Kredit */
  $("#fpl-ket").value    = "";
  $("#fpl-berkas").value = "";
  fplTinjauKategori();
}

/* Kategori pelunasan sepenuhnya ditetapkan sistem dari tanggalnya: sudah
   mencapai Tanggal Akhir Kredit berarti jatuh tempo, sebelum itu berarti
   dilunasi dari angsuran. Operator tidak memilihnya. */
function fplKategori() {
  const tgl   = $("#fpl-tgl").value;
  const akhir = fplRow ? fplRow.pinjaman.akhirKredit : "";
  return (tgl && akhir && tgl >= akhir)
    ? FFL_KATEGORI_JATUH_TEMPO
    : FFL_KATEGORI_PILIHAN[0];
}

/* Kategorinya tidak lagi punya field sendiri, jadi hasilnya diberitahukan di
   bawah Tgl Pelunasan supaya operator tahu apa yang akan tercatat. */
function fplTinjauKategori() {
  if (!fplRow) return;
  const akhir = fplRow.pinjaman.akhirKredit;
  $("#fpl-tgl-hint").textContent =
    `Terisi mengikuti Tanggal Akhir Kredit (${akhir}), masih bisa diubah. ` +
    `Dengan tanggal ini kategorinya tercatat sebagai ${fplKategori()}.`;
}
$("#fpl-tgl").onchange = fplTinjauKategori;

$("#fpl-simpan").onclick = () => {
  const tgl      = $("#fpl-tgl").value;
  const kategori = fplKategori();
  const ket      = $("#fpl-ket").value.trim();
  const f        = $("#fpl-berkas").files && $("#fpl-berkas").files[0];
  const berkas   = f ? f.name : "";
  if (!tgl)      { toast("Tgl Pelunasan wajib diisi.", "bad"); return; }
  if (!berkas)   { toast("Berkas bukti pelunasan wajib diunggah.", "bad"); return; }
  if (!ket)      { toast("Keterangan pelunasan wajib diisi.", "bad"); return; }

  /* Pelunasan juga lewat persetujuan — status baru berubah setelah disetujui. */
  const masuk = fpsTambah({
    ktpa: fplRow.ktpa, nrp: fplRow.nrp, mitra: fplRow.mitra, nopens: fplRow.nomorPensiun,
    nama: fplRow.nama, tglLahir: fplRow.tglLahir, aktivitas: "Pelunasan Flagging",
    perubahan: [
      { label:"Tgl Pelunasan",      dari:"–", ke: tgl },
      { label:"Kategori Pelunasan", dari:"–", ke: kategori },
      { label:"Berkas",             dari:"–", ke: berkas },
      { label:"Keterangan",         dari:"–", ke: ket }
    ],
    pelunasan: { tgl, kategori, ket, berkas }
  }, "Pelunasan");
  if (!masuk) {
    toast(`${fplRow.nama} sudah punya permintaan yang menunggu persetujuan.`, "bad");
    return;
  }

  fplRow.riwayat.push({
    tgl, user: "operator.mitra", aksi: "Pelunasan diajukan", ket
  });
  renderFps();
  go("flagging-pinjaman-flagging");
  toast(`Pelunasan ${fplRow.nama} diajukan — menunggu Persetujuan.`, "ok");
};

/* ---- layar Riwayat Flagging
   Satu baris = satu update. Kolom identitas diambil dari baris pinjamannya,
   grup "Update" berisi jejak per kejadian. Keterangan tiap update dipasang
   sebagai tooltip pada kolom Status karena susunan kolomnya tidak menyediakan
   tempat khusus — sama seperti Riwayat Pengajuan. */
function ffrIsi(r) {
  const p = r.pinjaman;
  $("#ffr-sub").textContent = `${r.ktpa} — ${r.nama}`;
  $("#ffr-body").innerHTML = r.riwayat.map(h => `
    <tr>
      <td>${esc(p.tglPermohonan)}</td>
      <td>${esc(r.mitra)}</td>
      <td>${esc(p.cabangMitra)}</td>
      <td class="t-strong">${esc(r.nama)}</td>
      <td class="t-strong">${esc(r.ktpa)}</td>
      <td>${fflKosong(r.nomorPensiun)}</td>
      <td>${fflKosong(r.nik)}</td>
      <td>${esc(p.noPk)}</td>
      <td>${esc(h.tgl)}</td>
      <td>${esc(h.user)}</td>
      <td class="t-strong" title="${esc(h.ket)}">${esc(h.aksi)}</td>
    </tr>`).join("");
  $("#ffr-count").textContent = `${r.riwayat.length} update tercatat.`;
}

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-ffl-detail]");
  if (bDetail) { ffdIsi(fflCari(bDetail.dataset.fflDetail)); go("flagging-flagging-detail"); return; }

  const bLunas = e.target.closest("[data-ffl-lunas]");
  if (bLunas && !bLunas.disabled) { fplIsi(fflCari(bLunas.dataset.fflLunas)); go("flagging-pelunasan"); return; }

  const bTopUp = e.target.closest("[data-ffl-topup]");
  if (bTopUp && !bTopUp.disabled) { ftutBuka(bTopUp.dataset.fflTopup); return; }

  const bRiwayat = e.target.closest("[data-ffl-riwayat]");
  if (bRiwayat) { ffrIsi(fflCari(bRiwayat.dataset.fflRiwayat)); go("flagging-flagging-riwayat"); return; }

  const bHal = e.target.closest("[data-ffl-hal]");
  if (bHal) { fflPager.hal = +bHal.dataset.fflHal; renderFfl(); }
});

renderFfl();
/* ======================================================= FLAGGING » PINJAMAN » TAKE OVER
   Daftar pengalihan pinjaman antar mitra. Dua aksi per baris: Detail (halaman,
   bisa disunting) dan Hapus. Baris baru ditambahkan lewat layar Tambahkan
   Take Over yang mencari pesertanya dulu berdasarkan KPA. */

let ftoPager  = { hal: 1, per: 10 };
let ftoFilter = { cari: "", status: "Semua Status" };
let ftoRows   = DATA_FLAGGING_TAKEOVER.map(r => ({ ...r, pinjaman: { ...r.pinjaman } }));

const ftoKosong = v => v ? esc(v) : `<span style="color:var(--faint)">–</span>`;

$("#fto-f-status").innerHTML =
  ["Semua Status", ...FTO_STATUS].map(s => `<option>${esc(s)}</option>`).join("");

const ftoPill = s => `<span class="pill ${
  s === "Diterima" ? "pill-ok" : s === "Ditolak" ? "pill-bad" : "pill-warn"}">${esc(s)}</span>`;

function ftoDaftar() {
  const f = ftoFilter;
  return ftoRows.filter(r =>
    (f.status === "Semua Status" || r.status === f.status) &&
    (!f.cari || [r.ktpa, r.nrp, r.nama].some(v => String(v).toLowerCase().includes(f.cari)))
  );
}

function renderFto() {
  const rows = ftoDaftar();
  const pg   = pagerPotong(rows, ftoPager);

  $("#fto-body").innerHTML = pg.hal.length
    ? pg.hal.map(r => `
      <tr>
        <td class="t-strong">${esc(r.ktpa)}</td>
        <td>${esc(r.nrp)}</td>
        <td>${esc(r.mitraAwal)}</td>
        <td class="t-strong">${esc(r.mitraPengajuan)}</td>
        <td>${ftoKosong(r.nomorPensiun)}</td>
        <td class="t-strong">${esc(r.nama)}</td>
        <td>${esc(r.tglLahir)}</td>
        <td>${esc(r.statusPensiun)}</td>
        <td>${ftoKosong(r.tglPelunasan)}</td>
        <td>${ftoKosong(r.toTgl)}</td>
        <td>${ftoKosong(r.toUser)}</td>
        <td>${ftoKosong(r.mtTgl)}</td>
        <td>${ftoKosong(r.mtUser)}</td>
        <td>${ftoKosong(r.asTgl)}</td>
        <td>${ftoKosong(r.asUser)}</td>
        <td>${ftoPill(r.status)}</td>
        <td class="truncate-cell" title="${esc(r.catatan)}">${ftoKosong(r.catatan)}</td>
        <td class="stick-r" style="white-space:nowrap">
          <button class="btn btn-info btn-sm" data-fto-detail="${esc(r.ktpa)}">Detail</button>
          <button class="btn btn-danger btn-sm" data-fto-hapus="${esc(r.ktpa)}">Hapus</button>
        </td>
      </tr>`).join("")
    : `<tr><td colspan="18"><div class="empty">Tidak ada take over yang cocok dengan filter.</div></td></tr>`;

  $("#fto-count").innerHTML = pagerNote(pg, "take over", "");
  $("#fto-pager").innerHTML = rows.length ? pagerHtml(ftoPager, pg, "data-fto-hal") : "";
}

$("#fto-cari").onclick = () => {
  ftoFilter.cari = $("#fto-f-cari").value.trim().toLowerCase();
  ftoFilter.status = $("#fto-f-status").value;
  ftoPager.hal = 1;
  renderFto();
};

const ftoCari = ktpa => ftoRows.find(r => r.ktpa === ktpa);

/* ---- Detail Take Over
   Dibuka dalam keadaan terkunci; tombol Ubah membuka field yang boleh disunting
   lalu perubahannya disubmit sebagai permintaan ke Persetujuan. NOPENS, Nama,
   Tgl Lahir, Mitra Bayar, Cabang, dan NIK tetap terkunci karena ikut data induk. */
let ftdRow = null;

const FTD_EDITABLE = ["ftd-tgl-pelunasan", "ftd-akhir-kredit", "ftd-awal-kredit",
  "ftd-norek-tab", "ftd-norek-kredit", "ftd-no-pk", "ftd-plafon", "ftd-angsuran",
  "ftd-sub-kredit", "ftd-jns-tab", "ftd-sp3r", "ftd-pernyataan"];

function ftdSetUbah(aktif) {
  FTD_EDITABLE.forEach(id => { const el = $(`#${id}`); if (el) el.disabled = !aktif; });
  $("#ftd-actions-lihat").style.display = aktif ? "none" : "";
  $("#ftd-actions-ubah").style.display  = aktif ? "" : "none";
}

function ftdIsi(r) {
  ftdRow = r;
  const p = r.pinjaman;
  $("#ftd-sub").textContent = `${r.ktpa} — ${r.nama}`;

  $("#ftd-kpa").value       = r.ktpa;
  $("#ftd-nrp").value       = r.nrp;
  $("#ftd-nama").value      = r.nama;
  $("#ftd-nopens").value    = r.nomorPensiun;
  $("#ftd-tgl-lahir").value = r.tglLahir;
  $("#ftd-gaji").value      = p.gajiPeserta.toLocaleString("id-ID");

  $("#ftd-tgl-pelunasan").value = p.tglPelunasan;
  $("#ftd-p-tgl-lahir").value   = r.tglLahir;
  $("#ftd-p-nopens").value      = r.nomorPensiun;
  $("#ftd-akhir-kredit").value  = p.akhirKredit;
  $("#ftd-p-nama").value        = r.nama;
  $("#ftd-norek-tab").value     = p.norekTab;
  $("#ftd-awal-kredit").value   = p.awalKredit;
  $("#ftd-no-pk").value         = p.noPk;
  $("#ftd-plafon").value        = p.plafon.toLocaleString("id-ID");
  $("#ftd-cabang").value        = p.cabangMitra;
  $("#ftd-norek-kredit").value  = p.norekKredit;
  $("#ftd-angsuran").value      = p.angsuran.toLocaleString("id-ID");
  $("#ftd-mitra").value         = r.mitraPengajuan;
  $("#ftd-sub-kredit").value    = p.subKredit;
  $("#ftd-jns-tab").value       = p.jnsTab;
  $("#ftd-nik").value           = p.nik;
  $("#ftd-sp3r").value          = "";
  $("#ftd-pernyataan").value    = "";
  $("#ftd-sp3r-nama").textContent       = `Berkas saat ini: ${p.lampiranSp3r}`;
  $("#ftd-pernyataan-nama").textContent = `Berkas saat ini: ${p.lampiranPernyataan}`;

  ftdSetUbah(false);
}

$("#ftd-ubah").onclick  = () => ftdSetUbah(true);
$("#ftd-batal").onclick = () => ftdIsi(ftdRow);   /* buang perubahan yang belum disubmit */

$("#ftd-simpan").onclick = () => {
  if (!$("#ftd-angsuran").value.trim())   { toast("Besaran Angsuran wajib diisi.", "bad"); return; }
  if (!$("#ftd-sub-kredit").value.trim()) { toast("Sub Kredit wajib diisi.", "bad"); return; }

  const p = ftdRow.pinjaman;
  const berkas = id => ($(`#${id}`).files && $(`#${id}`).files[0]);
  const isian = [
    { key:"tglPelunasan", label:"Tgl Pelunasan",             nilai: $("#ftd-tgl-pelunasan").value },
    { key:"awalKredit",   label:"Awal Kredit",               nilai: $("#ftd-awal-kredit").value },
    { key:"akhirKredit",  label:"Tanggal Akhir Kredit",      nilai: $("#ftd-akhir-kredit").value },
    { key:"plafon",       label:"Plafon",                    nilai: fpdAngka($("#ftd-plafon").value), uang:true },
    { key:"angsuran",     label:"Besaran Angsuran",          nilai: fpdAngka($("#ftd-angsuran").value), uang:true },
    { key:"norekTab",     label:"Nomor Rekening Tabungan",   nilai: $("#ftd-norek-tab").value.trim() },
    { key:"norekKredit",  label:"Nomor Rekening Kredit",     nilai: $("#ftd-norek-kredit").value.trim() },
    { key:"noPk",         label:"Nomor Perjanjian Kredit",   nilai: $("#ftd-no-pk").value.trim() },
    { key:"subKredit",    label:"Sub Kredit",                nilai: $("#ftd-sub-kredit").value.trim() },
    { key:"jnsTab",       label:"Jenis Tabungan",            nilai: $("#ftd-jns-tab").value.trim() }
  ];
  if (berkas("ftd-sp3r"))
    isian.push({ key:"lampiranSp3r", label:"Lampiran SP3R", nilai: berkas("ftd-sp3r").name });
  if (berkas("ftd-pernyataan"))
    isian.push({ key:"lampiranPernyataan", label:"Lampiran Surat Pernyataan", nilai: berkas("ftd-pernyataan").name });

  const berubah = isian.filter(f => String(f.nilai) !== String(p[f.key]));
  if (!berubah.length) { toast("Tidak ada perubahan untuk diajukan.", "bad"); return; }

  const tampil = f => f.uang ? rp(f.nilai) : (f.nilai || "–");
  const asal   = f => f.uang ? rp(p[f.key]) : (p[f.key] || "–");
  const masuk = fpsTambah({
    ktpa: ftdRow.ktpa, nrp: ftdRow.nrp, mitra: ftdRow.mitraPengajuan || ftdRow.mitraAwal,
    nopens: ftdRow.nomorPensiun, nama: ftdRow.nama, tglLahir: ftdRow.tglLahir,
    aktivitas: "Perubahan Take Over",
    perubahan: berubah.map(f => ({ label: f.label, dari: asal(f), ke: tampil(f) })),
    nilaiBaru: Object.fromEntries(berubah.map(f => [f.key, f.nilai]))
  }, "Detail Take Over");
  if (!masuk) {
    toast(`${ftdRow.nama} sudah punya permintaan yang menunggu persetujuan.`, "bad");
    return;
  }

  ftdIsi(ftdRow);          /* kembalikan tampilan ke nilai lama yang masih berlaku */
  go("flagging-pinjaman-takeover");
  toast(`Perubahan take over ${ftdRow.nama} disimpan — menunggu Persetujuan.`, "ok");
};

/* ---- Hapus baris take over */
function ftoHapus(r) {
  $("#modal-title").textContent = "Hapus Take Over";
  $("#modal-sub").textContent   = `${r.ktpa} — ${r.nama}`;
  $("#modal-ico").style.display = "";
  $("#modal-ico").className     = "modal-ico bad";
  $("#modal-ico").textContent   = "⊗";
  $("#modal-body").innerHTML = `
    <div style="font-size:13px;color:var(--body);line-height:1.7;margin-bottom:18px">
      Data take over <b>${esc(r.nama)}</b> akan dihapus dari daftar.
    </div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn btn-ghost" id="fto-hapus-batal">Batal</button>
      <button class="btn btn-danger-solid" id="fto-hapus-ok">Hapus</button>
    </div>`;
  openModal();
  $("#fto-hapus-batal").onclick = closeModal;
  $("#fto-hapus-ok").onclick = () => {
    ftoRows = ftoRows.filter(x => x !== r);
    renderFto();
    closeModal();
    toast(`Take over ${r.nama} dihapus.`);
  };
}

/* ---- Tambahkan Take Over: cari peserta lalu simpan sebagai baris baru. */
let fttPeserta = null;

function fttReset() {
  fttPeserta = null;
  $("#ftt-kpa").value = "";
  $("#ftt-hasil").style.display = "none";
}

$("#ftt-search").onclick = () => {
  const kpa = $("#ftt-kpa").value.trim();
  $("#ftt-hasil").style.display = "none";
  if (!kpa) { toast("Nomor KPA belum diisi.", "bad"); return; }

  /* Peserta dicari di daftar pinjaman yang flagging-nya sudah aktif — hanya
     pinjaman berjalan yang masuk akal untuk dialihkan ke mitra lain. */
  const p = fflRows.find(x => x.ktpa.toLowerCase() === kpa.toLowerCase());
  if (!p) { toast(`Nomor KPA "${kpa}" tidak ditemukan pada daftar flagging.`, "bad"); return; }
  /* Hanya pinjaman yang masih berjalan yang masuk akal dialihkan; yang sudah
     Lunas atau Dibatalkan tidak punya sisa kewajiban untuk di-take over. */
  if (p.statusPinjaman !== "Disetujui") {
    toast(`Pinjaman ${p.nama} berstatus ${p.statusPinjaman} — tidak bisa di-take over.`, "bad");
    return;
  }
  if (ftoRows.some(x => x.ktpa === p.ktpa)) {
    toast(`${p.nama} sudah ada di daftar take over.`, "bad");
    return;
  }

  fttPeserta = p;
  fttIsiForm(p);
  $("#ftt-hasil").style.display = "";
};

/* Mitra pengaju take over diambil dari role yang sedang aktif kalau role itu
   memang salah satu mitra bayar; kalau tidak, dikosongkan supaya tidak
   tertukar dengan mitra lama peserta. */
const fttMitraPengaju = () =>
  DATA_MITRA_BAYAR.includes($("#top-role").value) ? $("#top-role").value : "";

function fttIsiForm(p) {
  const j = p.pinjaman;

  $("#ftt-kpa-r").value     = p.ktpa;
  $("#ftt-nrp").value       = p.nrp;
  $("#ftt-nama").value      = p.nama;
  $("#ftt-nopens").value    = p.nomorPensiun;
  $("#ftt-tgl-lahir").value = p.tglLahir;
  $("#ftt-gaji").value      = j.gajiPeserta.toLocaleString("id-ID");

  $("#ftt-tgl-pelunasan").value = "";
  $("#ftt-p-tgl-lahir").value   = p.tglLahir;
  $("#ftt-p-nopens").value      = p.nomorPensiun;
  $("#ftt-akhir-kredit").value  = j.akhirKredit;
  $("#ftt-p-nama").value        = p.nama;
  $("#ftt-norek-tab").value     = j.norekTab;
  $("#ftt-awal-kredit").value   = j.awalKredit;
  $("#ftt-no-pk").value         = j.noPk;
  $("#ftt-plafon").value        = j.plafon.toLocaleString("id-ID");
  $("#ftt-cabang").value        = j.cabangMitra;
  $("#ftt-norek-kredit").value  = j.norekKredit;
  $("#ftt-angsuran").value      = j.angsuran.toLocaleString("id-ID");
  $("#ftt-sub-kredit").value    = j.subKredit;
  $("#ftt-jns-tab").value       = j.jnsTab;
  $("#ftt-nik").value           = j.nik;
  $("#ftt-sp3r").value          = "";
  $("#ftt-pernyataan").value    = "";

  const mitra = fttMitraPengaju();
  $("#ftt-mitra").value = mitra;
  $("#ftt-mitra-hint").textContent = mitra
    ? "Mitra pengaju take over, mengikuti role aktif."
    : `Pilih role mitra bayar di navbar untuk menetapkan mitra pengaju. Mitra lama: ${p.mitra}.`;
}

/* Take over baru tidak langsung masuk daftar — diajukan dulu ke Persetujuan.
   Barisnya baru dibuat oleh fpsTerapkan() setelah permintaannya disetujui. */
$("#ftt-simpan").onclick = () => {
  if (!fttPeserta) { toast("Cari pesertanya terlebih dahulu.", "bad"); return; }
  const p = fttPeserta;
  const mitra  = $("#ftt-mitra").value.trim();
  const sp3r   = $("#ftt-sp3r").files && $("#ftt-sp3r").files[0];
  const nyata  = $("#ftt-pernyataan").files && $("#ftt-pernyataan").files[0];

  if (!mitra)                             { toast("Mitra pengaju belum ditetapkan — pilih role mitra bayar di navbar.", "bad"); return; }
  if (!$("#ftt-angsuran").value.trim())   { toast("Besaran Angsuran wajib diisi.", "bad"); return; }
  if (!$("#ftt-sub-kredit").value.trim()) { toast("Sub Kredit wajib diisi.", "bad"); return; }
  if (!sp3r)                              { toast("Lampiran SP3R wajib diunggah.", "bad"); return; }
  if (!nyata)                             { toast("Lampiran Surat Pernyataan Kredit Mitra Bayar wajib diunggah.", "bad"); return; }

  const baru = {
    ktpa: p.ktpa, nrp: p.nrp, mitraAwal: p.mitra, mitraPengajuan: mitra,
    nomorPensiun: p.nomorPensiun, nama: p.nama, tglLahir: p.tglLahir,
    statusPensiun: p.nomorPensiun ? "Y" : "T",
    tglPelunasan: $("#ftt-tgl-pelunasan").value,
    toTgl: fpsHariIni(), toUser: "operator.mitra",
    status: "Tertunda", mtTgl: "", mtUser: "", asTgl: "", asUser: "", catatan: "",
    pinjaman: {
      ...p.pinjaman,
      tglPelunasan: $("#ftt-tgl-pelunasan").value,
      awalKredit:   $("#ftt-awal-kredit").value,
      akhirKredit:  $("#ftt-akhir-kredit").value,
      plafon:       fpdAngka($("#ftt-plafon").value),
      angsuran:     fpdAngka($("#ftt-angsuran").value),
      norekTab:     $("#ftt-norek-tab").value.trim(),
      norekKredit:  $("#ftt-norek-kredit").value.trim(),
      noPk:         $("#ftt-no-pk").value.trim(),
      subKredit:    $("#ftt-sub-kredit").value.trim(),
      jnsTab:       $("#ftt-jns-tab").value.trim(),
      lampiranSp3r: sp3r.name, lampiranPernyataan: nyata.name
    }
  };

  const masuk = fpsTambah({
    ktpa: p.ktpa, nrp: p.nrp, mitra, nopens: p.nomorPensiun,
    nama: p.nama, tglLahir: p.tglLahir, aktivitas: "Pengajuan Take Over",
    mitraAwal: p.mitra,
    perubahan: [
      { label:"Mitra Awal",        dari:"–", ke: p.mitra },
      { label:"Mitra Take Over",   dari:"–", ke: mitra },
      { label:"Plafon",            dari:"–", ke: rp(baru.pinjaman.plafon) },
      { label:"Besaran Angsuran",  dari:"–", ke: rp(baru.pinjaman.angsuran) },
      { label:"Lampiran SP3R",     dari:"–", ke: sp3r.name },
      { label:"Lampiran Pernyataan", dari:"–", ke: nyata.name }
    ],
    takeoverBaru: baru
  }, "Tambahkan Take Over");
  if (!masuk) {
    toast(`${p.nama} sudah punya permintaan yang menunggu persetujuan.`, "bad");
    return;
  }

  go("flagging-pinjaman-takeover");
  toast(`Pengajuan take over ${p.nama} disubmit — menunggu Persetujuan.`, "ok");
};

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-fto-detail]");
  if (bDetail) { ftdIsi(ftoCari(bDetail.dataset.ftoDetail)); go("flagging-takeover-detail"); return; }

  const bHapus = e.target.closest("[data-fto-hapus]");
  if (bHapus) { ftoHapus(ftoCari(bHapus.dataset.ftoHapus)); return; }

  const bHal = e.target.closest("[data-fto-hal]");
  if (bHal) { ftoPager.hal = +bHal.dataset.ftoHal; renderFto(); }
});

renderFto();

/* ========================================================== FLAGGING » PINJAMAN » TOP UP
   Daftar penambahan plafon pada pinjaman yang flagging-nya masih berjalan.
   Dua aksi per baris: Detail (halaman baca-saja) dan Hapus. Baris baru
   ditambahkan lewat layar Tambahkan Top Up yang mencari pesertanya dulu
   berdasarkan KPA, lalu diajukan ke Persetujuan seperti take over. */

let ftuPager  = { hal: 1, per: 10 };
let ftuFilter = { cari: "", status: "Semua Status" };
let ftuSeq    = 0;
let ftuRows   = DATA_FLAGGING_TOPUP.map(r => ({ ...r, id: "tu" + (++ftuSeq), pinjaman: { ...r.pinjaman } }));

const ftuKosong = v => (v || v === 0) ? esc(String(v)) : `<span style="color:var(--faint)">–</span>`;
const ftuPill   = s => `<span class="pill ${
  s === "Diterima" ? "pill-ok" : s === "Ditolak" ? "pill-bad" : "pill-warn"}">${esc(s)}</span>`;

$("#ftu-f-status").innerHTML =
  ["Semua Status", ...FTU_STATUS].map(s => `<option>${esc(s)}</option>`).join("");

/* Top up bisa berulang untuk peserta yang sama, jadi urutannya dihitung dari
   jumlah top up yang sudah tercatat pada KPA tersebut. */
const ftuBerikutnya = ktpa => ftuRows.filter(r => r.ktpa === ktpa).length + 1;

function ftuDaftar() {
  const f = ftuFilter;
  return ftuRows.filter(r =>
    (f.status === "Semua Status" || r.status === f.status) &&
    (!f.cari || [r.ktpa, r.nrp, r.nik, r.nama].some(v => String(v).toLowerCase().includes(f.cari)))
  );
}

function renderFtu() {
  const rows = ftuDaftar();
  const pg   = pagerPotong(rows, ftuPager);

  $("#ftu-body").innerHTML = pg.hal.length
    ? pg.hal.map(r => {
      const p = r.pinjaman;
      return `
      <tr>
        <td class="t-strong">${ftuKosong(r.ind)}</td>
        <td>${esc(r.mitra)}</td>
        <td class="t-strong">${esc(r.ktpa)}</td>
        <td>${esc(r.nrp)}</td>
        <td>${ftuKosong(r.nik)}</td>
        <td>${ftuKosong(r.nomorPensiun)}</td>
        <td class="t-strong">${esc(r.nama)}</td>
        <td>${ftuKosong(r.tglLahir)}</td>
        <td class="num">${ftuKosong(r.topUpKe)}</td>
        <td>${esc(p.tglPermohonan)}</td>
        <td>${esc(p.awalKredit)}</td>
        <td>${esc(p.akhirKredit)}</td>
        <td class="num">${p.plafon.toLocaleString("id-ID")}</td>
        <td>${esc(p.norekTab)}</td>
        <td>${esc(p.norekKredit)}</td>
        <td>${esc(p.noPk)}</td>
        <td>${ftuPill(r.status)}</td>
        <td>${ftuKosong(r.kategori)}</td>
        <td>${ftuKosong(r.tglSetuju)}</td>
        <td>${ftuKosong(r.pengguna)}</td>
        <td class="stick-r" style="white-space:nowrap">
          <button class="btn btn-info btn-sm" data-ftu-detail="${esc(r.id)}">Detail</button>
          <button class="btn btn-danger btn-sm" data-ftu-hapus="${esc(r.id)}">Hapus</button>
        </td>
      </tr>`; }).join("")
    : `<tr><td colspan="21"><div class="empty">Tidak ada top up yang cocok dengan filter.</div></td></tr>`;

  $("#ftu-count").innerHTML = pagerNote(pg, "top up", "");
  $("#ftu-pager").innerHTML = rows.length ? pagerHtml(ftuPager, pg, "data-ftu-hal") : "";
}

$("#ftu-cari").onclick = () => {
  ftuFilter.cari = $("#ftu-f-cari").value.trim().toLowerCase();
  ftuFilter.status = $("#ftu-f-status").value;
  ftuPager.hal = 1;
  renderFtu();
};

/* Satu peserta boleh punya lebih dari satu baris top up, jadi barisnya
   dialamatkan lewat id internal, bukan KPA. */
const ftuCari = id => ftuRows.find(r => r.id === id);

/* ---- Detail Top Up: halaman baca-saja, susunannya mengikuti layar Tambahkan. */
function ftudField(label, nilai) {
  return `<div class="field">
    <label class="fl">${esc(label)}</label>
    <input class="inp" value="${esc(nilai || nilai === 0 ? String(nilai) : "–")}" disabled>
  </div>`;
}

function ftudIsi(r) {
  const p = r.pinjaman;
  $("#ftud-sub").textContent = `${r.ktpa} — ${r.nama} · Top up ke-${r.topUpKe}`;

  $("#ftud-peserta").innerHTML = [
    ftudField("KPA",           r.ktpa),
    ftudField("NRP/NIP",       r.nrp),
    ftudField("Nama",          r.nama),
    ftudField("NOPENS",        r.nomorPensiun),
    ftudField("Tanggal Lahir", r.tglLahir),
    ftudField("Gaji Peserta",  rp(p.gajiPeserta))
  ].join("");

  $("#ftud-topup").innerHTML = [
    ftudField("Tgl Permohonan",          p.tglPermohonan),
    ftudField("NOPENS",                  r.nomorPensiun),
    ftudField("Nama",                    r.nama),
    ftudField("Awal Kredit",             p.awalKredit),
    ftudField("Plafon",                  rp(p.plafon)),
    ftudField("Nomor Rekening Kredit",   p.norekKredit),
    ftudField("Mitra Bayar",             r.mitra),
    ftudField("Jenis Tabungan",          p.jnsTab),
    ftudField("NIK",                     p.nik || r.nik),
    ftudField("Tgl Lahir",               r.tglLahir),
    ftudField("Tanggal Akhir Kredit",    p.akhirKredit),
    ftudField("Nomor Rekening Tabungan", p.norekTab),
    ftudField("Nomor Perjanjian Kredit", p.noPk),
    ftudField("Cabang Mitra Bayar",      p.cabangMitra),
    ftudField("Top Up Ke",               r.topUpKe),
    ftudField("Besaran Angsuran",        rp(p.angsuran)),
    ftudField("Sub Kredit",              p.subKredit),
    ftudField("Lampiran SP3R",           p.lampiranSp3r),
    ftudField("Lampiran Surat Pernyataan Kredit Mitra Bayar", p.lampiranPernyataan)
  ].join("");
}

function ftuHapus(r) {
  $("#modal-title").textContent = "Hapus Top Up";
  $("#modal-sub").textContent   = `${r.ktpa} — ${r.nama}`;
  $("#modal-ico").style.display = "";
  $("#modal-ico").className     = "modal-ico bad";
  $("#modal-ico").textContent   = "⊗";
  $("#modal-body").innerHTML = `
    <div style="font-size:13px;color:var(--body);line-height:1.7;margin-bottom:18px">
      Top up ke-${esc(String(r.topUpKe))} milik <b>${esc(r.nama)}</b> akan dihapus dari daftar.
    </div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn btn-ghost" id="ftu-hapus-batal">Batal</button>
      <button class="btn btn-danger-solid" id="ftu-hapus-ok">Hapus</button>
    </div>`;
  openModal();
  $("#ftu-hapus-batal").onclick = closeModal;
  $("#ftu-hapus-ok").onclick = () => {
    ftuRows = ftuRows.filter(x => x !== r);
    renderFtu();
    closeModal();
    toast(`Top up ${r.nama} dihapus.`);
  };
}

/* ---- Tambahkan Top Up: cari peserta lalu ajukan sebagai permintaan baru. */
let ftutPeserta = null;

/* Form Data Top Up hanya boleh tampil sebagai hasil pencarian. Begitu KPA-nya
   diubah, hasilnya tidak lagi mewakili apa yang tertulis di field — jadi
   disembunyikan sampai Search ditekan lagi. Isinya ikut dikosongkan supaya
   nilai peserta sebelumnya tidak sempat terlihat saat form muncul kembali. */
function ftutSembunyikanHasil() {
  ftutPeserta = null;
  $("#ftut-hasil").style.display = "none";
  $$("#ftut-hasil input").forEach(el => { el.value = ""; });
}
$("#ftut-kpa").oninput = ftutSembunyikanHasil;

function ftutReset() {
  $("#ftut-kpa").value = "";
  ftutSembunyikanHasil();
}

/* Dipanggil tombol Top Up di tabel Flagging: buka layarnya, isikan KPA-nya,
   lalu jalankan pencarian supaya formnya langsung terbuka. `go()` mereset
   layar lebih dulu, jadi pengisian harus terjadi sesudahnya. */
function ftutBuka(ktpa) {
  go("flagging-topup-tambah");
  $("#ftut-kpa").value = ktpa;
  $("#ftut-search").click();
}

$("#ftut-search").onclick = () => {
  const kpa = $("#ftut-kpa").value.trim();
  ftutSembunyikanHasil();
  if (!kpa) { toast("Nomor KPA belum diisi.", "bad"); return; }

  /* Top up hanya masuk akal untuk pinjaman yang flagging-nya masih berjalan —
     yang sudah Lunas atau Dibatalkan tidak punya plafon untuk ditambah. */
  const p = fflRows.find(x => x.ktpa.toLowerCase() === kpa.toLowerCase());
  if (!p) { toast(`Nomor KPA "${kpa}" tidak ditemukan pada daftar flagging.`, "bad"); return; }
  if (p.statusPinjaman !== "Disetujui") {
    toast(`Pinjaman ${p.nama} berstatus ${p.statusPinjaman} — tidak bisa di-top up.`, "bad");
    return;
  }

  ftutPeserta = p;
  ftutIsiForm(p);
  $("#ftut-hasil").style.display = "";
};

function ftutIsiForm(p) {
  const j  = p.pinjaman;
  const ke = ftuBerikutnya(p.ktpa);

  $("#ftut-kpa-r").value     = p.ktpa;
  $("#ftut-nrp").value       = p.nrp;
  $("#ftut-nama").value      = p.nama;
  $("#ftut-nopens").value    = p.nomorPensiun;
  $("#ftut-tgl-lahir").value = p.tglLahir;
  $("#ftut-gaji").value      = j.gajiPeserta.toLocaleString("id-ID");

  $("#ftut-tgl-permohonan").value = "";
  $("#ftut-p-nopens").value       = p.nomorPensiun;
  $("#ftut-p-nama").value         = p.nama;
  $("#ftut-awal-kredit").value    = j.awalKredit;
  $("#ftut-plafon").value         = j.plafon.toLocaleString("id-ID");
  $("#ftut-norek-kredit").value   = j.norekKredit;
  $("#ftut-mitra").value          = p.mitra;
  $("#ftut-jns-tab").value        = j.jnsTab;
  $("#ftut-nik").value            = j.nik || p.nik;
  $("#ftut-p-tgl-lahir").value    = p.tglLahir;
  $("#ftut-akhir-kredit").value   = j.akhirKredit;
  $("#ftut-norek-tab").value      = j.norekTab;
  $("#ftut-no-pk").value          = j.noPk;
  $("#ftut-cabang").value         = j.cabangMitra;
  $("#ftut-topup-ke").value       = ke;
  $("#ftut-angsuran").value       = j.angsuran.toLocaleString("id-ID");
  $("#ftut-sub-kredit").value     = j.subKredit;
  $("#ftut-sp3r").value           = "";
  $("#ftut-pernyataan").value     = "";

  $("#ftut-topup-ke-hint").textContent = ke > 1
    ? `Peserta sudah punya ${ke - 1} top up sebelumnya.`
    : "Top up pertama untuk peserta ini.";
}

/* Top up baru tidak langsung masuk daftar — diajukan dulu ke Persetujuan.
   Barisnya baru dibuat oleh fpsTerapkan() setelah permintaannya disetujui. */
$("#ftut-simpan").onclick = () => {
  if (!ftutPeserta) { toast("Cari pesertanya terlebih dahulu.", "bad"); return; }
  const p     = ftutPeserta;
  const sp3r  = $("#ftut-sp3r").files && $("#ftut-sp3r").files[0];
  const nyata = $("#ftut-pernyataan").files && $("#ftut-pernyataan").files[0];

  if (!$("#ftut-nik").value.trim())        { toast("NIK wajib diisi.", "bad"); return; }
  if (!$("#ftut-angsuran").value.trim())   { toast("Besaran Angsuran wajib diisi.", "bad"); return; }
  if (!$("#ftut-sub-kredit").value.trim()) { toast("Sub Kredit wajib diisi.", "bad"); return; }
  if (!sp3r)                               { toast("Lampiran SP3R wajib diunggah.", "bad"); return; }
  if (!nyata)                              { toast("Lampiran Surat Pernyataan Kredit Mitra Bayar wajib diunggah.", "bad"); return; }

  const nik    = $("#ftut-nik").value.trim();
  const plafon = fpdAngka($("#ftut-plafon").value);
  const noPk   = $("#ftut-no-pk").value.trim();

  const baru = {
    ind: p.ind, mitra: p.mitra, ktpa: p.ktpa, nrp: p.nrp, nik,
    nomorPensiun: p.nomorPensiun, nama: $("#ftut-p-nama").value.trim() || p.nama,
    tglLahir: $("#ftut-p-tgl-lahir").value, topUpKe: ftuBerikutnya(p.ktpa),
    statusPinjaman: "Disetujui", statusTagih: "N", kategori: "", status: "Tertunda",
    tglSetuju: "", pengguna: "",
    pinjaman: {
      ...p.pinjaman, nik,
      tglPermohonan: $("#ftut-tgl-permohonan").value,
      awalKredit:    $("#ftut-awal-kredit").value,
      akhirKredit:   $("#ftut-akhir-kredit").value,
      plafon,
      angsuran:      fpdAngka($("#ftut-angsuran").value),
      norekTab:      $("#ftut-norek-tab").value.trim(),
      norekKredit:   $("#ftut-norek-kredit").value.trim(),
      noPk,
      subKredit:     $("#ftut-sub-kredit").value.trim(),
      jnsTab:        $("#ftut-jns-tab").value.trim(),
      lampiranSp3r:  sp3r.name, lampiranPernyataan: nyata.name
    }
  };

  const masuk = fpsTambah({
    ktpa: p.ktpa, nrp: p.nrp, mitra: p.mitra, nopens: p.nomorPensiun,
    nama: p.nama, tglLahir: p.tglLahir, aktivitas: "Pengajuan Top Up",
    perubahan: [
      { label:"Top Up Ke",          dari:"–", ke: String(baru.topUpKe) },
      { label:"Plafon",             dari: rp(p.pinjaman.plafon), ke: rp(plafon) },
      { label:"Besaran Angsuran",   dari: rp(p.pinjaman.angsuran), ke: rp(baru.pinjaman.angsuran) },
      { label:"Tanggal Akhir Kredit", dari: p.pinjaman.akhirKredit, ke: baru.pinjaman.akhirKredit },
      { label:"Lampiran SP3R",      dari:"–", ke: sp3r.name },
      { label:"Lampiran Pernyataan", dari:"–", ke: nyata.name }
    ],
    topupBaru: baru
  }, "Tambahkan Top Up");
  if (!masuk) {
    toast(`${p.nama} sudah punya permintaan yang menunggu persetujuan.`, "bad");
    return;
  }

  renderFpt2();   /* antrean Persetujuan » Top Up ikut menyesuaikan */
  go("flagging-pinjaman-flagging");
  toast(`Pengajuan top up ${p.nama} disubmit — menunggu Persetujuan.`, "ok");
};

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-ftu-detail]");
  if (bDetail) { ftudIsi(ftuCari(bDetail.dataset.ftuDetail)); go("flagging-topup-detail"); return; }

  const bHapus = e.target.closest("[data-ftu-hapus]");
  if (bHapus) { ftuHapus(ftuCari(bHapus.dataset.ftuHapus)); return; }

  const bHal = e.target.closest("[data-ftu-hal]");
  if (bHal) { ftuPager.hal = +bHal.dataset.ftuHal; renderFtu(); }
});

renderFtu();

/* ======================================================= FLAGGING » PINJAMAN » PENAGIHAN
   Dua tab dari satu sumber data yang sama: tab Mitra menampilkan batch
   penagihan per mitra bayar, tab Peserta meratakan seluruh `peserta` dari
   semua batch menjadi satu daftar. Batch baru dibuat lewat layar Tambah
   Penagihan Pinjaman — tombol Cari Data mengumpulkan peserta yang cocok
   dengan kriterianya lebih dulu, baru disimpan. */

let fpnPager  = { hal: 1, per: 10 };
let fpnFilter = { mitra: "", status: "Semua Status" };
let fpnSeq    = 0;
let fpnRows   = DATA_FLAGGING_PENAGIHAN.map(r => ({
  ...r, id: "pn" + (++fpnSeq), peserta: r.peserta.map(p => ({ ...p }))
}));

const fpnKosong = v => v ? esc(v) : `<span style="color:var(--faint)">–</span>`;

["#fpn-f-status", "#fpp-f-status"].forEach(sel => {
  $(sel).innerHTML = ["Semua Status", ...FPN_STATUS_PESERTA]
    .map(s => `<option>${esc(s)}</option>`).join("");
});
$("#fpt-status").innerHTML = FPN_STATUS_PESERTA.map(s => `<option>${esc(s)}</option>`).join("");

/* ---- Mitra: batch penagihan per mitra bayar */
function fpnDaftar() {
  const f = fpnFilter;
  return fpnRows.filter(r =>
    (f.status === "Semua Status" || r.statusPeserta === f.status) &&
    (!f.mitra || r.mitra.toLowerCase().includes(f.mitra))
  );
}

function renderFpn() {
  const rows = fpnDaftar();
  const pg   = pagerPotong(rows, fpnPager);

  $("#fpn-body").innerHTML = pg.hal.length
    ? pg.hal.map(r => `
      <tr>
        <td class="t-strong">${esc(r.mitra)}</td>
        <td>${esc(r.statusPeserta)}</td>
        <td>${esc(r.tglTagihan)}</td>
        <td>${esc(r.tglAwal)}</td>
        <td>${esc(r.tglAkhir)}</td>
        <td class="truncate-cell" title="${esc(r.catatan)}">${fpnKosong(r.catatan)}</td>
        <td>${esc(r.user)}</td>
        <td>${esc(r.tglBuat)}</td>
        <td class="stick-r" style="white-space:nowrap">
          <button class="btn btn-info btn-sm" data-fpn-detail="${esc(r.id)}">Detail</button>
        </td>
      </tr>`).join("")
    : `<tr><td colspan="9"><div class="empty">Tidak ada penagihan yang cocok dengan filter.</div></td></tr>`;

  $("#fpn-count").innerHTML = pagerNote(pg, "penagihan", "");
  $("#fpn-pager").innerHTML = rows.length ? pagerHtml(fpnPager, pg, "data-fpn-hal") : "";
}

$("#fpn-cari").onclick = () => {
  fpnFilter.mitra  = $("#fpn-f-mitra").value.trim().toLowerCase();
  fpnFilter.status = $("#fpn-f-status").value;
  fpnPager.hal = 1;
  renderFpn();
};

const fpnCari = id => fpnRows.find(r => r.id === id);

/* ---- Peserta: seluruh peserta dari semua batch, dengan asal mitra dan
   tanggal tagihannya ikut dibawa supaya barisnya berdiri sendiri. */
let fppPager  = { hal: 1, per: 10 };
let fppFilter = { cari: "", status: "Semua Status" };

const fppPill = s => `<span class="pill ${
  s === "Terbayar" ? "pill-ok" : s === "Gagal" ? "pill-bad" : "pill-warn"}">${esc(s)}</span>`;

function fppDaftar() {
  const f = fppFilter;
  const semua = [];
  fpnRows.forEach(b => b.peserta.forEach(p =>
    semua.push({ ...p, mitra: b.mitra, tglTagihan: b.tglTagihan })));
  return semua.filter(p =>
    (f.status === "Semua Status" || p.statusPeserta === f.status) &&
    (!f.cari || [p.ktpa, p.nrp, p.nama].some(v => String(v).toLowerCase().includes(f.cari)))
  );
}

function renderFpp() {
  const rows = fppDaftar();
  const pg   = pagerPotong(rows, fppPager);

  $("#fpp-body").innerHTML = pg.hal.length
    ? pg.hal.map(p => `
      <tr>
        <td class="t-strong">${esc(p.ktpa)}</td>
        <td>${esc(p.nrp)}</td>
        <td>${fpnKosong(p.nomorPensiun)}</td>
        <td class="t-strong">${esc(p.nama)}</td>
        <td>${fpnKosong(p.tglLahir)}</td>
        <td>${p.statusPeserta === "Pensiun" ? "Y" : "T"}</td>
        <td>${esc(p.awalKredit)}</td>
        <td>${esc(p.akhirKredit)}</td>
        <td class="num">${p.plafon.toLocaleString("id-ID")}</td>
        <td>${fppPill(p.statusTagih)}</td>
        <td>${esc(p.statusUser)}</td>
        <td>${esc(p.statusTgl)}</td>
      </tr>`).join("")
    : `<tr><td colspan="12"><div class="empty">Tidak ada peserta yang cocok dengan filter.</div></td></tr>`;

  $("#fpp-count").innerHTML = pagerNote(pg, "peserta", "");
  $("#fpp-pager").innerHTML = rows.length ? pagerHtml(fppPager, pg, "data-fpp-hal") : "";
}

$("#fpp-cari").onclick = () => {
  fppFilter.cari   = $("#fpp-f-cari").value.trim().toLowerCase();
  fppFilter.status = $("#fpp-f-status").value;
  fppPager.hal = 1;
  renderFpp();
};

/* ---- Detail Penagihan: halaman baca-saja berisi kriteria batch dan
   daftar peserta yang ikut tertagih di dalamnya. */
function fpd2Field(label, nilai) {
  return `<div class="field">
    <label class="fl">${esc(label)}</label>
    <input class="inp" value="${esc(nilai || "–")}" disabled>
  </div>`;
}

/* Susunannya sama untuk hasil Cari Data dan Detail Penagihan: Info Peserta,
   Info Peminjam, penanda pensiun, lalu Info Kredit. */
function fpnBarisPeserta(daftar) {
  return daftar.length
    ? daftar.map(p => `
      <tr>
        <td class="t-strong">${esc(p.ktpa)}</td>
        <td>${esc(p.nrp)}</td>
        <td>${fpnKosong(p.nomorPensiun)}</td>
        <td class="t-strong">${esc(p.nama)}</td>
        <td>${fpnKosong(p.tglLahir)}</td>
        <td>${fpnKosong(p.pnNopens)}</td>
        <td>${esc(p.pnNama)}</td>
        <td>${p.statusPeserta === "Pensiun" ? "Y" : "T"}</td>
        <td>${esc(p.awalKredit)}</td>
        <td>${esc(p.akhirKredit)}</td>
        <td class="num">${p.plafon.toLocaleString("id-ID")}</td>
      </tr>`).join("")
    : `<tr><td colspan="11"><div class="empty">Tidak ada peserta pada penagihan ini.</div></td></tr>`;
}

const fpnTotal = daftar => daftar.reduce((a, p) => a + p.angsuran, 0);

function fpd2Isi(r) {
  $("#fpd2-sub").textContent = `${r.mitra} · Tagihan ${r.tglTagihan}`;
  $("#fpd2-info").innerHTML = [
    fpd2Field("Mitra Bayar",     r.mitra),
    fpd2Field("Status Peserta",  r.statusPeserta),
    fpd2Field("Tanggal Tagihan", r.tglTagihan),
    fpd2Field("Tanggal Awal",    r.tglAwal),
    fpd2Field("Tanggal Akhir",   r.tglAkhir),
    fpd2Field("Dibuat Oleh",     `${r.user} · ${r.tglBuat}`),
    fpd2Field("Catatan",         r.catatan),
    fpd2Field("Keterangan",      r.keterangan)
  ].join("");
  $("#fpd2-body").innerHTML = fpnBarisPeserta(r.peserta);
  $("#fpd2-note").textContent =
    `${r.peserta.length} peserta · total angsuran ${rp(fpnTotal(r.peserta))}`;
}

/* ---- Tambah Penagihan Pinjaman */
bindMitraAutocomplete("fpt-mitra", "fpt-mitra-list");

let fptHasil = [];

function fptReset() {
  fptHasil = [];
  $("#fpt-mitra").value      = "";
  $("#fpt-status").value     = FPN_STATUS_PESERTA[0];
  $("#fpt-tgl-awal").value   = "";
  $("#fpt-tgl-akhir").value  = "";
  $("#fpt-catatan").value    = "";
  $("#fpt-keterangan").value = "";
  $("#fpt-hasil").style.display = "none";
}

/* Peserta yang ditagih diambil dari pinjaman yang flagging-nya masih berjalan
   di mitra tersebut — hanya pinjaman aktif yang punya angsuran untuk ditagih.
   Status Aktif/Pensiun dibedakan dari ada tidaknya nomor pensiun. */
$("#fpt-cari-data").onclick = () => {
  const mitra  = $("#fpt-mitra").value.trim();
  const status = $("#fpt-status").value;
  const awal   = $("#fpt-tgl-awal").value;
  const akhir  = $("#fpt-tgl-akhir").value;

  $("#fpt-hasil").style.display = "none";
  if (!mitra)          { toast("Mitra Bayar belum dipilih.", "bad"); return; }
  if (!awal || !akhir) { toast("Tanggal awal dan akhir wajib diisi.", "bad"); return; }
  if (awal > akhir)    { toast("Tanggal awal melewati tanggal akhir.", "bad"); return; }

  fptHasil = fflRows
    .filter(r => r.statusPinjaman === "Disetujui" &&
                 r.mitra.toLowerCase() === mitra.toLowerCase())
    .map(r => ({
      ktpa: r.ktpa, nrp: r.nrp, nomorPensiun: r.nomorPensiun, nama: r.nama,
      tglLahir: r.tglLahir,
      statusPeserta: r.nomorPensiun ? "Pensiun" : "Aktif",
      /* Peserta yang meminjam untuk dirinya sendiri — Info Peminjam sama
         dengan Info Peserta. Yang berbeda hanya kasus pensiun waris. */
      pnNopens: r.nomorPensiun, pnNama: r.nama,
      awalKredit: r.pinjaman.awalKredit, akhirKredit: r.pinjaman.akhirKredit,
      plafon: r.pinjaman.plafon, angsuran: r.pinjaman.angsuran
    }))
    .filter(p => p.statusPeserta === status);

  $("#fpt-hasil-body").innerHTML = fpnBarisPeserta(fptHasil);
  $("#fpt-hasil-note").textContent = fptHasil.length
    ? `${fptHasil.length} peserta ditemukan · total angsuran ${rp(fpnTotal(fptHasil))}`
    : `Tidak ada peserta ${status.toLowerCase()} dengan flagging berjalan di ${mitra}.`;
  $("#fpt-hasil").style.display = "";
};

$("#fpt-simpan").onclick = () => {
  if (!fptHasil.length) { toast("Belum ada peserta untuk ditagih.", "bad"); return; }

  fpnRows.unshift({
    id: "pn" + (++fpnSeq),
    mitra: $("#fpt-mitra").value.trim(),
    statusPeserta: $("#fpt-status").value,
    tglTagihan: fpsHariIni(),
    tglAwal: $("#fpt-tgl-awal").value,
    tglAkhir: $("#fpt-tgl-akhir").value,
    catatan: $("#fpt-catatan").value.trim(),
    keterangan: $("#fpt-keterangan").value.trim(),
    user: "operator.kep", tglBuat: `${fpsHariIni()} 00:00:00`,
    /* Batch baru berarti tagihannya baru diterbitkan — statusnya "Ditagih"
       sampai pembayarannya dikonfirmasi. */
    peserta: fptHasil.map(p => ({ ...p,
      statusTagih: "Ditagih", statusUser: "operator.kep", statusTgl: fpsHariIni() }))
  });

  const jumlah = fptHasil.length;
  const mitra  = $("#fpt-mitra").value.trim();
  fpnPager.hal = 1;
  fppPager.hal = 1;
  renderFpn();
  renderFpp();
  go("flagging-pinjaman-penagihan");
  toast(`Penagihan ${mitra} dibuat untuk ${jumlah} peserta.`, "ok");
};

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-fpn-detail]");
  if (bDetail) { fpd2Isi(fpnCari(bDetail.dataset.fpnDetail)); go("flagging-penagihan-detail"); return; }

  const bHal = e.target.closest("[data-fpn-hal]");
  if (bHal) { fpnPager.hal = +bHal.dataset.fpnHal; renderFpn(); return; }

  const bHalP = e.target.closest("[data-fpp-hal]");
  if (bHalP) { fppPager.hal = +bHalP.dataset.fppHal; renderFpp(); }
});

renderFpn();
renderFpp();

/* ================================================ FLAGGING » PERSETUJUAN » TOP UP
   Antrean khusus pengajuan top up. Sumber datanya sama dengan antrean umum
   (`fpsRows`), hanya disaring pada aktivitas "Pengajuan Top Up" — dan aktivitas
   itu sengaja dikeluarkan dari antrean umum lewat FPS_AKTIVITAS_TOPUP supaya
   satu permintaan tidak muncul di dua halaman sekaligus. */

let fpt2Pager  = { hal: 1, per: 10 };
let fpt2Filter = { cari: "", status: "Semua Status" };

$("#fpt2-f-status").innerHTML =
  ["Semua Status", ...FPS_STATUS].map(s => `<option>${esc(s)}</option>`).join("");

const fpt2Kosong = v => (v || v === 0) ? esc(String(v)) : `<span style="color:var(--faint)">–</span>`;

function fpt2Daftar() {
  const f = fpt2Filter;
  return fpsRows.filter(r =>
    r.aktivitas === FPS_AKTIVITAS_TOPUP &&
    (f.status === "Semua Status" || r.status === f.status) &&
    (!f.cari || [r.ktpa, r.nrp, r.nama].some(v => String(v).toLowerCase().includes(f.cari)))
  );
}

function renderFpt2() {
  const rows = fpt2Daftar();
  const pg   = pagerPotong(rows, fpt2Pager);

  $("#fpt2-body").innerHTML = pg.hal.length
    ? pg.hal.map(r => {
      const t = r.topupBaru;
      return `
      <tr>
        <td class="t-strong">${esc(r.ktpa)}</td>
        <td>${esc(r.nrp)}</td>
        <td>${esc(r.mitra)}</td>
        <td>${fpt2Kosong(r.nopens)}</td>
        <td class="t-strong">${esc(r.nama)}</td>
        <td>${fpsAktivitasPill(r.aktivitas)}</td>
        <td class="num">${t ? esc(String(t.topUpKe)) : `<span style="color:var(--faint)">–</span>`}</td>
        <td class="num">${t ? t.pinjaman.plafon.toLocaleString("id-ID") : `<span style="color:var(--faint)">–</span>`}</td>
        <td>${fpsPill(r.status)}</td>
        <td>${fpt2Kosong(r.tglProses)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-info btn-sm" data-fpt2-detail="${esc(r.ktpa)}">Detail</button>
        </td>
      </tr>`; }).join("")
    : `<tr><td colspan="11"><div class="empty">Tidak ada pengajuan top up yang cocok dengan filter.</div></td></tr>`;

  $("#fpt2-count").innerHTML = pagerNote(pg, "pengajuan top up", "");
  $("#fpt2-pager").innerHTML = rows.length ? pagerHtml(fpt2Pager, pg, "data-fpt2-hal") : "";
}

$("#fpt2-cari").onclick = () => {
  fpt2Filter.cari   = $("#fpt2-f-cari").value.trim().toLowerCase();
  fpt2Filter.status = $("#fpt2-f-status").value;
  fpt2Pager.hal = 1;
  renderFpt2();
};

const fpt2Cari = ktpa =>
  fpsRows.find(r => r.ktpa === ktpa && r.aktivitas === FPS_AKTIVITAS_TOPUP);

/* ---- Detail Pengajuan Top Up
   Rinciannya diambil dari muatan `topupBaru` yang dibawa layar Tambahkan Top
   Up. Setujui/Tolak hanya muncul selama statusnya masih Pending. */
let fptdRow = null;

function fptdField(label, nilai) {
  return `<div class="field">
    <label class="fl">${esc(label)}</label>
    <input class="inp" value="${esc(nilai || nilai === 0 ? String(nilai) : "–")}" disabled>
  </div>`;
}

function fptdIsi(r) {
  fptdRow = r;
  const t = r.topupBaru;
  $("#fptd-sub").textContent = `${r.ktpa} — ${r.nama} · ${r.status}`;

  $("#fptd-peserta").innerHTML = [
    fptdField("KPA",           r.ktpa),
    fptdField("NRP/NIP",       r.nrp),
    fptdField("Nama",          r.nama),
    fptdField("NOPENS",        r.nopens),
    fptdField("Tanggal Lahir", r.tglLahir),
    fptdField("Mitra Bayar",   r.mitra)
  ].join("");

  const j = t && t.pinjaman;
  $("#fptd-topup").innerHTML = j ? [
    fptdField("Tgl Permohonan",          j.tglPermohonan),
    fptdField("NOPENS",                  r.nopens),
    fptdField("Nama",                    t.nama),
    fptdField("Awal Kredit",             j.awalKredit),
    fptdField("Plafon",                  rp(j.plafon)),
    fptdField("Nomor Rekening Kredit",   j.norekKredit),
    fptdField("Mitra Bayar",             t.mitra),
    fptdField("Jenis Tabungan",          j.jnsTab),
    fptdField("NIK",                     j.nik || t.nik),
    fptdField("Tgl Lahir",               t.tglLahir),
    fptdField("Tanggal Akhir Kredit",    j.akhirKredit),
    fptdField("Nomor Rekening Tabungan", j.norekTab),
    fptdField("Nomor Perjanjian Kredit", j.noPk),
    fptdField("Cabang Mitra Bayar",      j.cabangMitra),
    fptdField("Top Up Ke",               t.topUpKe),
    fptdField("Besaran Angsuran",        rp(j.angsuran)),
    fptdField("Sub Kredit",              j.subKredit),
    fptdField("Lampiran SP3R",           j.lampiranSp3r),
    fptdField("Lampiran Surat Pernyataan Kredit Mitra Bayar", j.lampiranPernyataan)
  ].join("") : "";
  $("#fptd-tanpa-muatan").style.display = j ? "none" : "";

  const pending = r.status === "Pending";
  $("#fptd-aksi").style.display      = pending ? "" : "none";
  $("#fptd-keputusan").style.display = pending ? "none" : "";
  if (!pending) {
    const akhir = r.riwayat[r.riwayat.length - 1];
    $("#fptd-keputusan-teks").textContent =
      `Pengajuan sudah ${r.status.toLowerCase()} pada ${r.tglProses || akhir.tgl} — ${akhir.ket}.`;
  }

  $("#fptd-riwayat").innerHTML = r.riwayat.map(h => `
    <tr>
      <td>${esc(h.tgl)}</td>
      <td>${esc(h.user)}</td>
      <td class="t-strong">${esc(h.aksi)}</td>
      <td>${esc(h.ket)}</td>
    </tr>`).join("");
}

/* Pop-up alasan dipakai bersama tombol Setujui dan Tolak; untuk Tolak
   alasannya wajib karena itu yang dibaca mitra pengaju. */
function fptdKonfirmasi(mode) {
  const setuju = mode === "setuju";
  $("#modal-title").textContent = setuju ? "Setujui Pengajuan Top Up" : "Tolak Pengajuan Top Up";
  $("#modal-sub").textContent   = `${fptdRow.ktpa} — ${fptdRow.nama}`;
  $("#modal-ico").style.display = "";
  $("#modal-ico").className     = "modal-ico " + (setuju ? "" : "bad");
  $("#modal-ico").textContent   = setuju ? "✓" : "⊗";
  $("#modal-body").innerHTML = `
    <div class="field">
      <label class="fl" for="fptd-alasan">Alasan ${setuju ? "" : `<span class="req">*</span>`}</label>
      <textarea class="inp" id="fptd-alasan" style="height:74px;padding:9px 10px;resize:vertical"
        placeholder="${setuju ? "Catatan persetujuan (opsional)..." : "Tuliskan alasan penolakan..."}"></textarea>
    </div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn btn-ghost" id="fptd-alasan-batal">Batal</button>
      <button class="btn ${setuju ? "btn-success" : "btn-danger-solid"}" id="fptd-alasan-ok">
        ${setuju ? "Setujui" : "Tolak"}</button>
    </div>`;
  openModal();
  $("#fptd-alasan-batal").onclick = closeModal;
  $("#fptd-alasan-ok").onclick = () => {
    const alasan = $("#fptd-alasan").value.trim();
    if (!setuju && !alasan) { toast("Alasan penolakan wajib diisi.", "bad"); return; }

    const r = fptdRow;
    r.status    = setuju ? "Disetujui" : "Ditolak";
    r.tglProses = fpsHariIni();
    r.riwayat.push({
      tgl: r.tglProses, user: "verifikator.kep",
      aksi: setuju ? "Disetujui" : "Ditolak",
      ket: alasan || "Tanpa catatan tambahan"
    });

    /* Barisnya baru dibuat di daftar Top Up setelah disetujui. */
    if (setuju) fpsTerapkan(r);

    renderFpt2();
    renderFps();
    fptdIsi(r);
    closeModal();
    toast(`Pengajuan top up ${r.nama} berhasil ${setuju ? "disetujui" : "ditolak"}.`, setuju ? "ok" : "");
  };
}

$("#fptd-setujui").onclick = () => fptdKonfirmasi("setuju");
$("#fptd-tolak").onclick   = () => fptdKonfirmasi("tolak");

document.addEventListener("click", e => {
  const bDetail = e.target.closest("[data-fpt2-detail]");
  if (bDetail) { fptdIsi(fpt2Cari(bDetail.dataset.fpt2Detail)); go("flagging-persetujuan-topup-detail"); return; }

  const bHal = e.target.closest("[data-fpt2-hal]");
  if (bHal) { fpt2Pager.hal = +bHal.dataset.fpt2Hal; renderFpt2(); }
});

renderFpt2();

/* ============================================== NOTIFIKASI DI NAVBAR (LONCENG)
   Isinya dirakit dari antrean yang sedang berjalan, bukan daftar statis — jadi
   angkanya ikut berkurang begitu sebuah permintaan disetujui atau ditolak. */

/* Sengaja `var`: dideklarasikan di bawah tapi sudah ada (bernilai undefined)
   sejak skrip mulai jalan, sehingga render tabel yang berjalan lebih dulu saat
   memuat halaman tidak menyentuh antrean yang belum sempat dibuat. */
var topNotifSiap = false;

/* Nama mitra di data lama ditulis kapital ("BANK BRI") sedangkan pilihan role
   memakai Title Case ("Bank BRI") — dibandingkan tanpa memedulikan huruf. */
const samaMitra = (a, b) =>
  !!a && !!b && String(a).trim().toUpperCase() === String(b).trim().toUpperCase();

/* Notifikasi antar mitra pada alur take over: pengajuan memberi tahu mitra
   pemberi kredit lama, keputusannya memberi tahu mitra pengaju. */
function topNotifTakeOver(role) {
  const t = [];
  fpsRows.filter(r => r.aktivitas === "Pengajuan Take Over").forEach(r => {
    const tgl = r.tglProses || r.riwayat[0].tgl;
    if (r.status === "Pending" && samaMitra(r.mitraAwal, role)) t.push({
      judul: `Pengajuan Take Over dari ${r.mitra}`,
      meta1: `${r.ktpa} · ${r.nama}`,
      meta2: `Menunggu tanggapan Anda · ${tgl}`,
      tingkat: "KRITIS", go: "flagging-persetujuan"
    });
    if (r.status !== "Pending" && samaMitra(r.mitra, role)) t.push({
      judul: `${r.status === "Disetujui" ? "Persetujuan" : "Penolakan"} Take Over dari ${r.mitraAwal}`,
      meta1: `${r.ktpa} · ${r.nama}`,
      meta2: `Pengajuan take over Anda · ${tgl}`,
      tingkat: r.status === "Disetujui" ? "HIGH" : "KRITIS",
      go: "flagging-pinjaman-takeover"
    });
  });
  return t;
}

function topNotifTugas() {
  const role  = $("#top-role").value;
  const tugas = topNotifTakeOver(role);
  /* Antrean persetujuan adalah pekerjaan Divisi Kepesertaan, bukan mitra —
     kalau ikut ditampilkan ke mitra, pengajuan take over yang sama muncul dua
     kali di lonceng yang sama. */
  const mitra = DATA_MITRA_BAYAR.includes(role);

  /* Permohonan pinjaman baru lebih mendesak daripada permintaan susulan atas
     pinjaman yang sudah berjalan, jadi tingkatnya dibedakan. */
  if (!mitra) fpsRows.filter(r => r.status === "Pending").forEach(r => tugas.push({
    judul: `Persetujuan ${r.aktivitas}`,
    meta1: `${r.ktpa} · ${r.mitra}`,
    meta2: `Persetujuan · ${r.riwayat[0].tgl}`,
    tingkat: r.aktivitas === "Pengajuan Pinjaman" ? "KRITIS" : "HIGH",
    go: "flagging-persetujuan"
  }));

  /* Peserta yang belum dibooking masih menunggu tindakan operator mitra. */
  const belum = fcbkPesertaRows.filter(r => !r.booking).length;
  if (belum) tugas.push({
    judul: "Peserta Belum Dibooking",
    meta1: `${belum} peserta pada batch kolektif`,
    meta2: "Check dan Booking » Kolektif",
    tingkat: "HIGH",
    go: "flagging-cb-kolektif"
  });

  return tugas;
}

const topNotifPill = t => t === "KRITIS" ? "pill-bad" : "pill-warn";

function renderTopNotif() {
  if (!topNotifSiap) return;
  const tugas = topNotifTugas();
  const badge = $("#top-bell-count");
  badge.textContent = tugas.length;
  badge.hidden      = tugas.length === 0;
  $("#top-notif-count").textContent = `${tugas.length} TUGAS`;

  $("#top-notif-list").innerHTML = tugas.length
    ? tugas.map(t => `
      <button class="notif-item" data-go="${esc(t.go)}">
        <div class="notif-item-top">
          <div class="notif-item-judul">${esc(t.judul)}</div>
          <span class="pill ${topNotifPill(t.tingkat)}">${esc(t.tingkat)}</span>
        </div>
        <div class="notif-item-meta">${esc(t.meta1)}</div>
        <div class="notif-item-meta">${esc(t.meta2)}</div>
      </button>`).join("")
    : `<div class="empty" style="padding:28px 20px">Tidak ada tugas yang menunggu.</div>`;
}

function topNotifTutup() {
  $("#top-notif").hidden = true;
  $("#top-bell").setAttribute("aria-expanded", "false");
  $("#top-bell").classList.remove("open");
}

$("#top-bell").onclick = e => {
  e.stopPropagation();
  const buka = $("#top-notif").hidden;
  if (buka) renderTopNotif();
  $("#top-notif").hidden = !buka;
  $("#top-bell").setAttribute("aria-expanded", String(buka));
  $("#top-bell").classList.toggle("open", buka);
};
$("#top-notif-all").onclick = () => { topNotifTutup(); go("flagging-persetujuan"); };
/* Klik di luar popover — termasuk klik pada salah satu notifikasinya, yang
   navigasinya sudah ditangani handler [data-go] di router. */
document.addEventListener("click", e => {
  if (!e.target.closest(".notif-wrap")) topNotifTutup();
  else if (e.target.closest(".notif-item")) topNotifTutup();
});

topNotifSiap = true;
renderTopNotif();

/* ====================================================================== INIT */
/* Role mitra bayar langsung diberi tahu pengajuan flagging miliknya yang
   ditolak — daftarnya diambil dari antrean Persetujuan. */
$("#top-role").onchange = () => {
  const role = $("#top-role").value;
  toast(`Role diubah ke: ${role}.`);
  fpsRows.filter(r => r.mitra === role && r.status === "Ditolak")
         .forEach(r => toast(`Pengajuan Flagging KPA ${r.ktpa} ditolak.`, "bad"));
  /* Isi lonceng berbeda per role, jadi ikut disegarkan saat role berganti. */
  renderTopNotif();
};
go("flagging-dashboard");
