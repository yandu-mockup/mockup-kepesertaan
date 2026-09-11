/* ===========================================================================
   app.js — LOGIKA APLIKASI KPR (PUM)
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
const resetFields = ids => ids.forEach(id => { const el = $(`#${id}`); if (el) el.value = ""; });

/* Role aktif dipilih lewat chip di navbar. Kewenangan yang dibedakan:
   Divisi Kepesertaan → persetujuan pengajuan dan pelunasan;
   PIC UNOR/Kesatuan  → mengajukan serta merevisi pengajuan miliknya;
   Kantor Cabang      → memantau, tanpa hak persetujuan. */
const ROLE_DIVISI = "Divisi Kepesertaan dan Pengembangan Manfaat";
const ROLE_CABANG = "Kantor Cabang";
const ROLE_PIC    = "PIC UNOR/Kesatuan";
const roleSaatIni = () => $("#top-role").value;

function toast(msg, kind = "") {
  const t = document.createElement("div");
  t.className = "toast " + kind;
  t.textContent = msg;
  $("#toast").appendChild(t);
  setTimeout(() => t.remove(), 3600);
}

/* ------------------------------------------------- salinan data yang hidup
   Data asli di data.js dibiarkan utuh; aplikasi bekerja di salinan ini
   supaya refresh browser selalu mengembalikan kondisi awal.              */
let saldo   = JSON.parse(JSON.stringify(DATA_SALDO));
let pumRows = DATA_PUM.map((r, i) => ({ ...r, _id: i }));
/* Klaim KPR (BUM) hanya dibaca — dipakai untuk menolak peserta yang sudah
   punya pinjaman BUM aktif saat membuat Pengajuan KPR (PUM) baru. */
let bumRows = DATA_BUM.map(r => ({ ...r }));

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
  if (id === "pelunasan") { renderPel(); cekJatuhTempoPelunasan(); }
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-go]");
  if (b && !b.disabled) go(b.dataset.go);
});
$("#burger").onclick = () => $("#sidebar").classList.toggle("open");

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

/* Modal konfirmasi umum (mengganti window.confirm() bawaan browser supaya
   tampilannya konsisten dengan desain aplikasi). onConfirm dipanggil setelah
   modal ditutup jika pengguna menekan tombol konfirmasi. */
function confirmModal(message, onConfirm, opts = {}) {
  $("#modal-title").textContent = opts.title || "Konfirmasi";
  $("#modal-sub").textContent   = "";
  $("#modal-ico").style.display = "";
  $("#modal-ico").textContent   = opts.icon || "⚠";
  $("#modal-body").innerHTML = `
    <div style="font-size:13px;color:var(--body);line-height:1.5;margin-bottom:18px">${esc(message)}</div>
    <div class="form-actions" style="justify-content:flex-end">
      <button class="btn btn-ghost" id="confirm-modal-batal">${esc(opts.batalLabel || "Batal")}</button>
      <button class="btn ${opts.okClass || "btn-danger-solid"}" id="confirm-modal-ok">${esc(opts.okLabel || "Hapus")}</button>
    </div>`;
  openModal();
  $("#confirm-modal-batal").onclick = closeModal;
  $("#confirm-modal-ok").onclick = () => { closeModal(); onConfirm(); };
}
$("#modal-x").onclick = closeModal;
$("#modal-bg").onclick = e => { if (e.target.id === "modal-bg") closeModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ===================================================== SIDEBAR: expand/collapse nav-parent
   Generik untuk semua grup sub modul bertingkat (mis. Parameter). */
$$(".nav-parent").forEach(btn => {
  btn.onclick = () => {
    const open     = btn.getAttribute("aria-expanded") === "true";
    const children = btn.nextElementSibling;
    btn.setAttribute("aria-expanded", open ? "false" : "true");
    if (children && children.classList.contains("nav-children")) children.hidden = open;
  };
});

/* ------------------------------------------------------- pagination bersama
   Dipakai daftar Parameter Plafon, Pengajuan, Approval, dan Pelunasan. */
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

/* ============================================================ ALOKASI DANA */
const angkaSaja = v => (v || "").replace(/\D/g, "");
const parseNum  = v => Number(angkaSaja(v)) || 0;

function isiPilihanKesatuan() {
  const opsi = Object.entries(saldo).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join("");
  $("#al-kesatuan").innerHTML = `<option value="">— Pilih kesatuan —</option>` + opsi;
  $("#al-tahun").innerHTML    = DATA_TAHUN.map(t => `<option>${esc(t)}</option>`).join("");
}

$("#al-kesatuan").onchange = e => {
  const k = saldo[e.target.value];
  const box = $("#al-saldo");
  if (!k) { box.style.display = "none"; return; }
  box.style.display = "flex";
  $("#al-saldo-lbl").textContent = `· Saldo alokasi dana KPR (PUM) — ${k.label}`;
  $("#al-saldo-val").textContent = rp(k.saldo);
  cekAlokasi();
};
$("#al-nominal").oninput = e => {
  const n = angkaSaja(e.target.value);
  e.target.value = n ? Number(n).toLocaleString("id-ID") : "";
  cekAlokasi();
};

function cekAlokasi() {
  const k = saldo[$("#al-kesatuan").value];
  if (!k) return;
  const n = parseNum($("#al-nominal").value);
  const box = $("#al-saldo"), hint = $("#al-hint");
  const lebih = n > k.saldo;
  box.classList.toggle("low", lebih);
  if (!n)         { hint.textContent = "Sisa saldo setelah alokasi akan terupdate otomatis."; hint.style.color = ""; }
  else if (lebih) { hint.textContent = `Nominal melebihi saldo tersedia (${rp(k.saldo)}).`;   hint.style.color = "var(--red)"; }
  else            { hint.textContent = `Sisa saldo setelah alokasi: ${rp(k.saldo - n)}`;      hint.style.color = "var(--green-ink)"; }
}

$("#al-simpan").onclick = () => {
  const k = saldo[$("#al-kesatuan").value];
  const n = parseNum($("#al-nominal").value);
  if (!k)          { toast("Pilih kesatuan terlebih dahulu.", "bad"); return; }
  if (!n)          { toast("Nominal alokasi dana belum diisi.", "bad"); return; }
  if (n > k.saldo) { toast("Nominal melebihi saldo tersedia.", "bad"); return; }
  k.saldo -= n;
  $("#al-saldo-val").textContent = rp(k.saldo);
  $("#al-nominal").value = "";
  cekAlokasi();
  toast(`Alokasi ${rp(n)} untuk ${k.label} tersimpan.`, "ok");
};
$("#al-batal").onclick = () => {
  $("#al-kesatuan").value = "";
  $("#al-nominal").value  = "";
  $("#al-saldo").style.display = "none";
  go("pum");
};

/* ========================================================= PARAMETER PLAFON */
let plafonRows = DATA_PARAMETER_PLAFON.map((r, i) => ({ ...r, _id: i }));
let plafonSeq  = plafonRows.length;
let plafonPager = { hal: 1, per: 10 };

function renderPlafon() {
  const pg = pagerPotong(plafonRows, plafonPager);
  $("#plafon-body").innerHTML = pg.hal.length ? pg.hal.map((r, i) => `
    <tr>
      <td>${pg.mulai + i + 1}</td>
      <td>${esc(r.statusPersonil)}</td>
      <td>${esc(r.angkatan)}</td>
      <td>${esc(r.kesatuan)}</td>
      <td>${esc(r.golongan)}</td>
      <td>${esc(r.pangkat)}</td>
      <td>${rp(r.nominal)}</td>
      <td>
        <button class="btn btn-ghost btn-sm" data-plafon-ubah="${r._id}">✎ Ubah</button>
        <button class="btn btn-danger-solid btn-sm" data-plafon-hapus="${r._id}">Hapus</button>
      </td>
    </tr>`).join("") : `<tr><td colspan="8"><div class="empty"><h4>Belum ada data plafon</h4><p>Klik "+ Input Plafon" untuk menambahkan.</p></div></td></tr>`;
  $("#plafon-note").innerHTML  = pagerNote(pg, "plafon", "");
  $("#plafon-pager").innerHTML = pagerHtml(plafonPager, pg, "data-plafon-hal");
}

/* Pilihan Pangkat mengikuti kombinasi Status Personil + Angkatan + Golongan
   yang sedang dipilih (lihat PLAFON_PANGKAT di data.js). */
function plafonPangkatOptions(statusPersonil, angkatan, golongan) {
  if (!statusPersonil || !angkatan || !golongan) return [];
  return PLAFON_PANGKAT[`${statusPersonil}|${angkatan}|${golongan}`] || [];
}

function plafonRenderPangkatSelect(selectedPangkat) {
  const statusPersonil = $("#plafon-status-personil").value;
  const angkatan        = $("#plafon-angkatan").value;
  const golongan         = $("#plafon-golongan").value;
  const opts = plafonPangkatOptions(statusPersonil, angkatan, golongan);
  $("#plafon-pangkat").innerHTML =
    `<option value="">${opts.length ? "Pilih pangkat" : "Lengkapi Status Personil / Angkatan / Golongan dahulu"}</option>` +
    opts.map(p => `<option ${p === selectedPangkat ? "selected" : ""}>${esc(p)}</option>`).join("");
  $("#plafon-pangkat").disabled = opts.length === 0;
}

function plafonForm(existing) {
  $("#modal-title").textContent = existing ? "Ubah Plafon" : "Input Plafon";
  $("#modal-sub").textContent   = "Parameter Plafon PUM KPR";
  $("#modal-body").innerHTML = `
    <div class="field">
      <label class="fl">Status Personil <span class="req">*</span></label>
      <select class="inp" id="plafon-status-personil">
        <option value="">Pilih status personil</option>
        ${PLAFON_STATUS_PERSONIL.map(s => `<option ${existing && existing.statusPersonil === s ? "selected" : ""}>${esc(s)}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label class="fl">Angkatan <span class="req">*</span></label>
      <select class="inp" id="plafon-angkatan">
        <option value="">Pilih angkatan</option>
        ${PLAFON_ANGKATAN.map(a => `<option ${existing && existing.angkatan === a ? "selected" : ""}>${esc(a)}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label class="fl">Kesatuan <span class="req">*</span></label>
      <select class="inp" id="plafon-kesatuan">
        <option value="">Pilih kesatuan</option>
        ${PLAFON_KESATUAN.map(k => `<option ${existing && existing.kesatuan === k ? "selected" : ""}>${esc(k)}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label class="fl">Golongan <span class="req">*</span></label>
      <select class="inp" id="plafon-golongan">
        <option value="">Pilih golongan</option>
        ${PLAFON_GOLONGAN.map(g => `<option ${existing && existing.golongan === g ? "selected" : ""}>${esc(g)}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label class="fl">Pangkat <span class="req">*</span></label>
      <select class="inp" id="plafon-pangkat"></select>
    </div>
    <div class="field">
      <label class="fl">Nominal Plafon <span class="req">*</span></label>
      <div class="money"><span>Rp</span><input class="inp" id="plafon-nominal" inputmode="numeric" placeholder="0" value="${existing ? Number(existing.nominal).toLocaleString("id-ID") : ""}"></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" id="plafon-batal">Batal</button>
      <button class="btn btn-primary" id="plafon-simpan">Simpan</button>
    </div>`;
  openModal();
  plafonRenderPangkatSelect(existing ? existing.pangkat : null);

  ["#plafon-status-personil", "#plafon-angkatan", "#plafon-golongan"].forEach(sel => {
    $(sel).onchange = () => plafonRenderPangkatSelect(null);
  });
  $("#plafon-nominal").oninput = e => {
    const n = angkaSaja(e.target.value);
    e.target.value = n ? Number(n).toLocaleString("id-ID") : "";
  };
  $("#plafon-batal").onclick = closeModal;
  $("#plafon-simpan").onclick = () => {
    const statusPersonil = $("#plafon-status-personil").value;
    const angkatan        = $("#plafon-angkatan").value;
    const kesatuan         = $("#plafon-kesatuan").value;
    const golongan         = $("#plafon-golongan").value;
    const pangkat          = $("#plafon-pangkat").value;
    const nominal          = parseNum($("#plafon-nominal").value);
    if (!statusPersonil) { toast("Status Personil belum dipilih.", "bad"); return; }
    if (!angkatan)        { toast("Angkatan belum dipilih.", "bad"); return; }
    if (!kesatuan)         { toast("Kesatuan belum dipilih.", "bad"); return; }
    if (!golongan)         { toast("Golongan belum dipilih.", "bad"); return; }
    if (!pangkat)          { toast("Pangkat belum dipilih.", "bad"); return; }
    if (!nominal)          { toast("Nominal Plafon belum diisi.", "bad"); return; }
    const dup = plafonRows.find(r =>
      r.statusPersonil === statusPersonil && r.angkatan === angkatan &&
      r.golongan === golongan && r.pangkat === pangkat &&
      (!existing || r._id !== existing._id));
    if (dup) { toast(`Plafon untuk pangkat ${pangkat} sudah ada — silakan Ubah data yang sudah ada.`, "bad"); return; }

    if (existing) {
      Object.assign(existing, { statusPersonil, angkatan, kesatuan, golongan, pangkat, nominal });
      toast(`Plafon ${pangkat} berhasil diubah.`, "ok");
    } else {
      plafonRows.push({ _id: plafonSeq++, statusPersonil, angkatan, kesatuan, golongan, pangkat, nominal });
      toast(`Plafon ${pangkat} berhasil ditambahkan.`, "ok");
    }
    closeModal();
    renderPlafon();
  };
}
$("#plafon-input").onclick = () => plafonForm(null);

document.addEventListener("click", e => {
  const bUbah = e.target.closest("[data-plafon-ubah]");
  if (bUbah) { plafonForm(plafonRows.find(r => r._id === +bUbah.dataset.plafonUbah)); return; }
  const bHapus = e.target.closest("[data-plafon-hapus]");
  if (bHapus) {
    const r = plafonRows.find(x => x._id === +bHapus.dataset.plafonHapus);
    if (!r) return;
    confirmModal(`Hapus plafon untuk angkatan ${r.angkatan}?`, () => {
      plafonRows = plafonRows.filter(x => x._id !== r._id);
      renderPlafon();
      toast(`Plafon ${r.angkatan} dihapus.`, "ok");
    }, { title: "Hapus Plafon" });
    return;
  }
  const plafonHal = e.target.closest("[data-plafon-hal]");
  if (plafonHal) { plafonPager.hal = +plafonHal.dataset.plafonHal; renderPlafon(); }
});
renderPlafon();

/* ================================== PARAMETER PERNYATAAN TANGGUNG JAWAB
   Isi poin-poin popup "Pernyataan Atas Tanggung Jawab dan Keabsahan Data
   Pengajuan KPR (PUM)" (lihat pf6BukaPernyataan()) — hanya Lihat/Ubah/Hapus,
   tanpa Tambah, karena poin pernyataan sudah lengkap dan bakunya dari sisi
   kebijakan; menghapus semua poin akan membuat popup itu kosong. */
let pernyataanRows = DATA_PERNYATAAN_TANGGUNG_JAWAB.map((r, i) => ({ ...r, _id: i }));

function renderPernyataan() {
  $("#pernyataan-body").innerHTML = pernyataanRows.length ? pernyataanRows.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td class="t-strong">${esc(r.judul)}</td>
      <td class="truncate-cell" style="max-width:420px">${esc(r.isi)}</td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm"        data-pernyataan-ubah="${r._id}">✎ Ubah</button>
        <button class="btn btn-danger-solid btn-sm" data-pernyataan-hapus="${r._id}">Hapus</button>
      </td>
    </tr>`).join("") : `<tr><td colspan="4"><div class="empty"><h4>Belum ada poin pernyataan</h4><p>Semua poin pernyataan sudah dihapus.</p></div></td></tr>`;
}

function pernyataanForm(r) {
  $("#modal-title").textContent = "Ubah Pernyataan Tanggung Jawab";
  $("#modal-sub").textContent   = "Parameter Pernyataan Tanggung Jawab";
  $("#modal-body").innerHTML = `
    <div class="field">
      <label class="fl">Judul Pernyataan <span class="req">*</span></label>
      <input class="inp" id="pernyataan-judul" value="${esc(r.judul)}">
    </div>
    <div class="field">
      <label class="fl">Isi Pernyataan <span class="req">*</span></label>
      <textarea class="inp" id="pernyataan-isi" style="height:120px;padding:9px 10px;resize:vertical">${esc(r.isi)}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" id="pernyataan-batal">Batal</button>
      <button class="btn btn-primary" id="pernyataan-simpan">Simpan</button>
    </div>`;
  openModal();
  $("#pernyataan-batal").onclick = closeModal;
  $("#pernyataan-simpan").onclick = () => {
    const judul = $("#pernyataan-judul").value.trim();
    const isi   = $("#pernyataan-isi").value.trim();
    if (!judul) { toast("Judul Pernyataan belum diisi.", "bad"); return; }
    if (!isi)   { toast("Isi Pernyataan belum diisi.", "bad"); return; }
    r.judul = judul; r.isi = isi;
    toast(`Pernyataan "${judul}" berhasil diubah.`, "ok");
    closeModal();
    renderPernyataan();
  };
}

document.addEventListener("click", e => {
  const bUbah = e.target.closest("[data-pernyataan-ubah]");
  if (bUbah) { pernyataanForm(pernyataanRows.find(r => r._id === +bUbah.dataset.pernyataanUbah)); return; }
  const bHapus = e.target.closest("[data-pernyataan-hapus]");
  if (bHapus) {
    const r = pernyataanRows.find(x => x._id === +bHapus.dataset.pernyataanHapus);
    if (!r) return;
    confirmModal(
      `Hapus poin pernyataan "${r.judul}"? Poin ini akan hilang dari popup Pernyataan Atas Tanggung Jawab saat Pengajuan KPR (PUM) disimpan.`,
      () => {
        pernyataanRows = pernyataanRows.filter(x => x._id !== r._id);
        renderPernyataan();
        toast(`Pernyataan "${r.judul}" dihapus.`, "ok");
      },
      { title: "Hapus Pernyataan" }
    );
  }
});
renderPernyataan();

/* ================================================================= PUM KPR */
const pillPum = s => s === "Disetujui" ? "pill-ok" : s === "Ditolak" || s === "Revisi" ? "pill-bad" : s === "Submitted" ? "pill-info" : "pill-warn";

/* Label tampilan status di Daftar Pengajuan KPR (PUM) — "Submitted" tampil
   sebagai "Tertunda" supaya konsisten dengan istilah yang dipahami PIC UNOR/
   Kesatuan; status internal (dipakai untuk logika & filter) tidak berubah. */
const pumStatusLabel = s => s === "Submitted" ? "Tertunda" : s;

function renderPum() {
  const fKpa  = ($("#pum-f-kpa").value  || "").toLowerCase();
  const fNpwp = ($("#pum-f-npwp").value || "").toLowerCase();
  const fNama = ($("#pum-f-nama").value || "").toLowerCase();
  const fNrp  = ($("#pum-f-nrp").value  || "").toLowerCase();
  const fSt   = $("#pum-filter").value;

  const rows = pumRows.filter(r =>
    (fSt === "all" || r.status === fSt) &&
    (!fKpa  || r.kpa.toLowerCase().includes(fKpa))   &&
    (!fNpwp || r.npwp.toLowerCase().includes(fNpwp)) &&
    (!fNama || r.nama.toLowerCase().includes(fNama)) &&
    (!fNrp  || r.nrp.toLowerCase().includes(fNrp)));

  $("#pum-body").innerHTML = rows.length ? rows.map(r => `
    <tr id="pum-row-${r._id}"${r.status === "Revisi" ? ` style="background:var(--red-soft)"` : ""}>
      <td class="t-strong">${esc(r.kpa)}</td><td>${esc(r.nrp)}</td><td>${esc(r.npwp)}</td>
      <td class="t-name">${esc(r.nama)}</td><td>${esc(r.angkatan)}</td><td>${esc(r.tglAmbil)}</td>
      <td>${esc(r.tipePum)}</td>
      <td><span class="pill ${pillPum(r.status)}">${esc(pumStatusLabel(r.status))}</span></td>
      <td>${rp(r.jumlah)}</td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-info btn-sm"          data-pum-detail="${r._id}">Detail</button>
        <button class="btn btn-primary btn-sm"       data-pum-ubah="${r._id}">Ubah</button>
        <button class="btn btn-danger-solid btn-sm"  data-pum-hapus="${r._id}">Hapus</button>
        <button class="btn btn-success btn-sm"       data-pum-submit="${r._id}">Submit</button>
      </td>
    </tr>`).join("")
  : `<tr><td colspan="10"><div class="empty"><h4>Tidak ada pengajuan</h4><p>Coba ubah filter atau kata kunci pencarian.</p></div></td></tr>`;

  $("#pum-count").textContent = `menampilkan ${rows.length} dari ${pumRows.length} pengajuan`;
}
["#pum-f-kpa", "#pum-f-npwp", "#pum-f-nama", "#pum-f-nrp"].forEach(sel => $(sel).oninput = renderPum);
$("#pum-filter").onchange = renderPum;
$("#btn-export-pum").onclick  = () => toast("Daftar pengajuan KPR (PUM) diekspor ke Excel.");

/* Dipanggil dari notifikasi "Revisi Pengajuan KPR (PUM)" — pastikan baris
   pengajuannya benar-benar tampil (reset filter yang mungkin masih
   menyembunyikannya), lalu gulir langsung ke baris itu. */
function sorotBarisPum(id) {
  if (!pumRows.some(r => r._id === id)) return;
  $("#pum-filter").value = "all";
  ["#pum-f-kpa", "#pum-f-npwp", "#pum-f-nama", "#pum-f-nrp"].forEach(sel => $(sel).value = "");
  renderPum();
  requestAnimationFrame(() => {
    const el = $(`#pum-row-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---------------------------------------------------------- pengajuan baru */
$("#btn-ajukan-pum").onclick = () => {
  $("#pum-baru-kpa").value = "";
  $("#pum-baru-hasil").style.display = "none";
  $("#pum-baru-hasil").innerHTML = "";
  go("pum-baru");
};
$("#pum-baru-kembali").onclick = () => go("pum");

function showAlertPopup(title, msg, sub = "", type = "bad") {
  $("#modal-title").textContent = title;
  $("#modal-sub").textContent = sub;
  $("#modal-body").innerHTML = `
    <div class="alert alert-${type}"><span>${type === "ok" ? "✓" : "⚠"}</span><span>${esc(msg)}</span></div>
    <div class="form-actions"><button class="btn btn-primary" id="pum-val-close">Tutup</button></div>`;
  openModal();
  $("#pum-val-close").onclick = closeModal;
}
const pumValidasiPopup = msg => showAlertPopup("Validasi Nomor KPA", msg, "Pengajuan Baru PUM KPR");

/* Cocokkan satu baris pengajuan/klaim terhadap data peserta lewat KPA, NIK,
   atau NRP — salah satu cocok sudah dianggap peserta yang sama. */
function samaDenganPeserta(r, found) {
  return (r.kpa && found.kpa && r.kpa.toLowerCase() === found.kpa.toLowerCase()) ||
         (r.nik && found.nik && r.nik === found.nik) ||
         (r.nrp && found.nrp && r.nrp === found.nrp);
}

$("#pum-baru-cari").onclick = () => {
  const kpa = $("#pum-baru-kpa").value.trim();
  if (!kpa) { toast("Nomor KPA belum diisi.", "bad"); return; }

  $("#pum-baru-hasil").style.display = "none";
  $("#pum-baru-hasil").innerHTML = "";

  const found = DATA_MASTER_PESERTA.find(x => x.kpa.toLowerCase() === kpa.toLowerCase());
  if (!found) {
    toast(`Nomor KPA "${kpa}" tidak ditemukan pada sistem ASABRI.`, "bad");
    return;
  }

  /* Peserta yang sudah memiliki Pinjaman KPR (PUM) atau KPR (BUM) — dicocokkan
     lewat KPA, NIK, atau NRP — tidak dapat melanjutkan Pengajuan KPR (PUM)
     baru. Data peserta tetap ditampilkan seperti biasa, hanya "Lanjutkan"
     yang dikunci. */
  const pumMatch = pumRows.find(r => samaDenganPeserta(r, found));
  const bumMatch = !pumMatch && bumRows.find(r => samaDenganPeserta(r, found));

  /* Anggota TNI dengan Masa Kerja Dinas < 2 Tahun juga belum memenuhi syarat. */
  const masaKerjaAwal = /^tni/i.test(found.angkatan || "") ? masaKerjaKpaAwal(found.kpa) : null;
  const masaKerjaKurang = masaKerjaAwal !== null && masaKerjaAwal < 2;

  const belumMemenuhiSyarat = !!pumMatch || !!bumMatch || masaKerjaKurang;

  $("#pum-baru-hasil").style.display = "";
  $("#pum-baru-hasil").innerHTML = `
    <div class="alert alert-ok"><span>✓</span><span>Data peserta ditemukan dan terisi otomatis dari sistem.</span></div>
    <div class="grid3" style="grid-template-columns:1fr 1fr;margin-top:16px">
      <div class="field"><label class="fl">Nama</label><div class="t-strong">${esc(found.nama)}</div></div>
      <div class="field"><label class="fl">NRP/NIP</label><div>${esc(found.nrp)}</div></div>
      <div class="field"><label class="fl">NPWP</label><div>${esc(found.npwp)}</div></div>
      <div class="field"><label class="fl">NIK</label><div>${esc(found.nik || "-")}</div></div>
      <div class="field"><label class="fl">Angkatan</label><div>${esc(found.angkatan)}</div></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" id="pum-baru-lanjut" ${belumMemenuhiSyarat ? "disabled" : ""}>Lanjutkan →</button>
    </div>`;

  if (pumMatch) {
    pumValidasiPopup(`Nomor KPA ${found.kpa} tidak dapat melanjutkan Pengajuan KPR (PUM) karena sudah memiliki Pinjaman KPR (PUM) dan tidak dapat melanjutkan pengajuan Pinjaman KPR (PUM)`);
  } else if (bumMatch) {
    pumValidasiPopup(`Nomor KPA ${found.kpa} tidak dapat melanjutkan Pengajuan KPR (PUM) karena sudah memiliki Pinjaman KPR (BUM) dan tidak dapat melanjutkan pengajuan Pinjaman KPR (PUM)`);
  } else if (masaKerjaKurang) {
    showAlertPopup("Validasi Masa Kerja Dinas", `Masa Kerja Dinas KPA ${found.kpa} kurang dari 2 Tahun.`);
  } else {
    toast(`Data peserta ${found.nama} berhasil diambil dari sistem.`, "ok");
  }

  $("#pum-baru-lanjut").onclick = () => { if (!belumMemenuhiSyarat) bukaFormPeserta(found); };
};

/* ---------------------------------------------------- wizard: langkah/step */
const PF_STEPS = ["Data Peserta", "Kepangkatan", "Tipe KPR (PUM)", "Detail Pengajuan", "Pratinjau dan Simpan"];
let pfStep = 1;

function renderWizard() {
  $("#pf-wizard").innerHTML = PF_STEPS.map((label, i) => {
    const n = i + 1;
    const cls = n < pfStep ? "done" : n === pfStep ? "active" : "";
    const num = n < pfStep ? "✓" : n;
    const line = n < PF_STEPS.length ? `<div class="wizard-line"></div>` : "";
    return `<div class="wizard-step ${cls}"><div class="wizard-num">${num}</div><div class="wizard-lbl">${esc(label)}</div></div>${line}`;
  }).join("");
}

function pfGoStep(n) {
  pfStep = n;
  renderWizard();
  $("#pf-step-1").style.display = n === 1 ? "" : "none";
  $("#pf-step-2").style.display = n === 2 ? "" : "none";
  $("#pf-step-3").style.display = n === 3 ? "" : "none";
  $("#pf-step-4").style.display = n === 4 ? "" : "none";
  $("#pf-step-6").style.display = n === 5 ? "" : "none";
  renderPfSaldo();
  if (n === 2) renderKpRiwayatDb();
  if (n === 4) { renderStep4(); renderStep5(); }
  if (n === 5) renderStep6();
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* Semua field teks/tanggal/dropdown wizard yang bisa direkam & dipulihkan
   ulang untuk mode "Ubah" — sengaja tidak termasuk 4 field "Terisi Otomatis"
   di setiap tipe (KTPA/Pangkat/UKER/Jumlah PUM) karena itu dihitung ulang
   otomatis dari pfFound + Pangkat setiap kali langkah 4 dirender. */
const PF_TEXT_FIELD_IDS = [
  "pf-ktpa", "pf-nrp", "pf-nama", "pf-tempat-lahir", "pf-tgl-lahir",
  "pf-jk", "pf-kawin", "pf-nik", "pf-hp", "pf-pangkat",
  "pf-alamat", "pf-rt", "pf-rw", "pf-kelurahan", "pf-kecamatan", "pf-kabupaten", "pf-provinsi", "pf-kodepos",
  "pf4-nama-perumahan", "pf4-nama-developer", "pf4-alamat-perumahan", "pf4-tipe-rumah",
  "pf4-blok-rumah", "pf4-kelurahan", "pf4-kecamatan", "pf4-kabupaten", "pf4-provinsi",
  "pf4-jenis-kredit", "pf4-bank-kredit", "pf4-nomor-akad", "pf4-tgl-akad",
  "pf4-nama-rekening", "pf4-nomor-rekening", "pf4-mitra-bayar", "pf4-cabang-mitra",
  "pf4pm-jenis-hak", "pf4pm-atas-nama", "pf4pm-nomor-hak", "pf4pm-tgl-hak",
  "pf4pm-nama-perumahan", "pf4pm-nama-developer", "pf4pm-alamat-perumahan", "pf4pm-tipe-rumah",
  "pf4pm-blok-rumah", "pf4pm-kelurahan", "pf4pm-kecamatan", "pf4pm-kabupaten", "pf4pm-provinsi",
  "pf4pm-nama-rekening", "pf4pm-nomor-rekening", "pf4pm-mitra-bayar", "pf4pm-cabang-mitra",
  "pf4mr-jenis-hak", "pf4mr-atas-nama", "pf4mr-nomor-hak", "pf4mr-tgl-hak",
  "pf4mr-alamat-baru", "pf4mr-rt", "pf4mr-rw", "pf4mr-kelurahan", "pf4mr-kecamatan", "pf4mr-kabupaten", "pf4mr-provinsi",
  "pf4mr-nama-rekening", "pf4mr-nomor-rekening", "pf4mr-mitra-bayar", "pf4mr-cabang-mitra"
];
const PF_FILE_FIELD_IDS = [
  "pf4-file-akad", "pf4-file-buku", "pf4pm-file-hak", "pf4pm-file-buku",
  "pf4mr-file-hak", "pf4mr-file-pbg", "pf4mr-file-buku"
];

function setFileInputEl(input, file) {
  if (!input) return;
  if (!file) { input.value = ""; return; }
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
}

/* ---------------------------------------------------- wizard: data peserta */
let pfFound       = null;
let pumEditingRow = null;   // baris yang sedang diedit lewat tombol "Ubah" (null = pengajuan baru)

/* Integrasi Parameter Plafon/Alokasi Dana — memetakan Angkatan peserta ke
   kunci kesatuan pada saldo Alokasi Dana KPR (PUM) (lihat DATA_SALDO). */
function pfKesatuanKey(angkatan) {
  if (!angkatan) return null;
  if (/^TNI/i.test(angkatan))    return "mabes-tni";
  if (/polri/i.test(angkatan))   return "mabes-polri";
  if (/kemhan/i.test(angkatan))  return "kemhan";
  return null;
}
function renderPfSaldo() {
  const key = pfFound ? pfKesatuanKey(pfFound.angkatan) : null;
  const k   = key ? saldo[key] : null;
  if (!k) { $("#pf-saldo").style.display = "none"; return; }
  $("#pf-saldo").style.display = "flex";
  $("#pf-saldo-lbl").textContent = `· Saldo Alokasi Dana KPR (PUM) — ${k.label}`;
  $("#pf-saldo-val").textContent = rp(k.saldo);
}

function bukaFormPeserta(found) {
  pumEditingRow = null;
  pfFound = found;
  $("#pf-ktpa").value        = found.kpa;
  $("#pf-nrp").value         = found.nrp;
  $("#pf-nama").value        = found.nama;
  $("#pf-tempat-lahir").value = "";
  $("#pf-tgl-lahir").value   = "";
  $("#pf-jk").value          = "";
  $("#pf-kawin").value       = "";
  $("#pf-nik").value         = "";
  $("#pf-hp").value          = "";
  $("#pf-pangkat").value     = "";
  resetFields(["pf-alamat", "pf-rt", "pf-rw", "pf-kelurahan", "pf-kecamatan", "pf-kabupaten", "pf-provinsi", "pf-kodepos"]);
  $("#pf-kodepos-saran").style.display = "none";

  riwayatItems = [];
  renderRiwayat();

  pfSelectTipe("Kredit Rumah");
  resetFields([
    "pf4-nama-perumahan", "pf4-nama-developer", "pf4-alamat-perumahan", "pf4-tipe-rumah",
    "pf4-blok-rumah", "pf4-kelurahan", "pf4-kecamatan", "pf4-kabupaten", "pf4-provinsi",
    "pf4-jenis-kredit", "pf4-bank-kredit",
    "pf4-nomor-akad", "pf4-tgl-akad", "pf4-file-akad",
    "pf4-nama-rekening", "pf4-nomor-rekening", "pf4-mitra-bayar", "pf4-cabang-mitra", "pf4-file-buku",

    "pf4pm-jenis-hak", "pf4pm-atas-nama", "pf4pm-nomor-hak", "pf4pm-tgl-hak", "pf4pm-file-hak",
    "pf4pm-nama-perumahan", "pf4pm-nama-developer", "pf4pm-alamat-perumahan", "pf4pm-tipe-rumah",
    "pf4pm-blok-rumah", "pf4pm-kelurahan", "pf4pm-kecamatan", "pf4pm-kabupaten", "pf4pm-provinsi",
    "pf4pm-nama-rekening", "pf4pm-nomor-rekening", "pf4pm-mitra-bayar", "pf4pm-cabang-mitra", "pf4pm-file-buku",

    "pf4mr-jenis-hak", "pf4mr-atas-nama", "pf4mr-nomor-hak", "pf4mr-tgl-hak",
    "pf4mr-alamat-baru", "pf4mr-rt", "pf4mr-rw", "pf4mr-kelurahan", "pf4mr-kecamatan", "pf4mr-kabupaten", "pf4mr-provinsi",
    "pf4mr-nama-rekening", "pf4mr-nomor-rekening", "pf4mr-mitra-bayar", "pf4mr-cabang-mitra", "pf4mr-file-buku"
  ]);

  pf5RenderedTipe = null;
  pf5Uploaded = {};

  pfGoStep(1);
  go("pum-form");
}

/* Buka wizard yang sama, tapi terisi ulang dengan data pengajuan yang sudah
   ada — dipakai oleh tombol "Ubah" di Daftar Pengajuan KPR (PUM). */
function extractDetailField(row, label) {
  if (!row.detail) return "";
  for (const g of row.detail.detailGroups) {
    const f = g.fields.find(x => x.label === label);
    if (f) return f.value === "-" ? "" : f.value;
  }
  return "";
}

function openEditWizard(row) {
  pumEditingRow = row;
  pfFound = {
    kpa: row.kpa, nrp: row.nrp, npwp: row.npwp, nama: row.nama, angkatan: row.angkatan,
    uker: extractDetailField(row, "UKER") || "-", plafonPum: row.jumlah
  };

  if (row.raw) {
    PF_TEXT_FIELD_IDS.forEach(id => { const el = $(`#${id}`); if (el) el.value = row.raw.fields[id] || ""; });
    PF_FILE_FIELD_IDS.forEach(id => setFileInputEl($(`#${id}`), row.raw.files[id] || null));

    riwayatItems = [];
    renderRiwayat();
    row.raw.riwayat.forEach(rw => {
      const id = ++riwayatSeq;
      riwayatItems.push(id);
      $("#riwayat-list").insertAdjacentHTML("beforeend", riwayatBlock(id, riwayatItems.length - 1));
      $("#riwayat-empty").style.display = "none";
      const block = $(`.riwayat-block[data-riwayat="${id}"]`);
      const inp   = block.querySelectorAll("input");
      inp[0].value = rw.nomorSkep; inp[1].value = rw.tmt; inp[2].value = rw.tglSkep;
      setFileInputEl(inp[3], rw.file);
      const sel = block.querySelector("select");
      if (sel) sel.value = rw.pangkat || "";
    });

    pfSelectTipe(row.raw.tipePum || row.tipePum || "Kredit Rumah");

    pf5RenderedTipe = null;
    renderStep5();
    pf5Uploaded = {};
    Object.entries(row.raw.docs || {}).forEach(([idx, file]) => {
      if (!file) return;
      pf5Uploaded[idx] = file;
      const pillEl = $(`#pf5-status-${idx}`);
      if (pillEl) { pillEl.className = "pill pill-ok"; pillEl.textContent = "Terunggah"; }
    });
    updatePf5Progress();
  } else {
    /* Pengajuan lama tanpa data lengkap — isi identitas dasar saja. */
    resetFields(PF_TEXT_FIELD_IDS);
    PF_FILE_FIELD_IDS.forEach(id => setFileInputEl($(`#${id}`), null));
    riwayatItems = [];
    renderRiwayat();
    pfSelectTipe(row.tipePum || "Kredit Rumah");
    pf5RenderedTipe = null;
    pf5Uploaded = {};
    renderStep5();
  }

  /* Jaring pengaman: identitas peserta (KTPA/NRP-NIP/Nama) tidak boleh
     kosong sepulang dari "Ubah", walau snapshot-nya tidak lengkap. */
  if (!$("#pf-ktpa").value.trim()) $("#pf-ktpa").value = row.kpa  || "";
  if (!$("#pf-nrp").value.trim())  $("#pf-nrp").value  = row.nrp  || "";
  if (!$("#pf-nama").value.trim()) $("#pf-nama").value = row.nama || "";

  pfGoStep(1);
  go("pum-form");
}

const pfExitTarget = () => pumEditingRow ? "pum" : "pum-baru";
$("#pf-kembali-atas").onclick = () => go(pfExitTarget());
$("#pf-kembali").onclick      = () => go(pfExitTarget());
$("#pf-cek-nik").onclick = () => {
  const nik = $("#pf-nik").value.trim();
  if (!/^\d{16}$/.test(nik)) {
    showAlertPopup("Validasi NIK", "NIK tidak valid, mohon input NIK yang valid.");
    return;
  }
  showAlertPopup("Validasi NIK", "NIK valid", "", "ok");
};

$("#pf-lanjut").onclick = () => {
  if (!$("#pf-ktpa").value.trim() || !$("#pf-nrp").value.trim()) {
    toast("KTPA dan NRP/NIP wajib diisi.", "bad"); return;
  }
  if (!$("#pf-nik").value.trim()) { toast("NIK wajib diisi.", "bad"); return; }
  if (!$("#pf-pangkat").value) { toast("Pangkat belum dipilih.", "bad"); return; }

  /* Peserta yang sudah memiliki Pinjaman KPR (PUM) atau KPR (BUM) — dicocokkan
     lewat KPA, NRP/NIP, atau NIK yang sedang diisi di form ini — tidak dapat
     melanjutkan. Baris yang sedang diedit sendiri (mode "Ubah") dikecualikan
     supaya tidak menabrak datanya sendiri. */
  const dataPeserta = { kpa: $("#pf-ktpa").value.trim(), nrp: $("#pf-nrp").value.trim(), nik: $("#pf-nik").value.trim() };
  const pumMatch = pumRows.find(r => r !== pumEditingRow && samaDenganPeserta(r, dataPeserta));
  const bumMatch = !pumMatch && bumRows.find(r => samaDenganPeserta(r, dataPeserta));
  if (pumMatch || bumMatch) {
    $("#pf-lanjut").disabled = true;
    pumValidasiPopup(pumMatch
      ? `Nomor KPA ${dataPeserta.kpa} tidak dapat melanjutkan Pengajuan KPR (PUM) karena sudah memiliki Pinjaman KPR (PUM) dan tidak dapat melanjutkan pengajuan Pinjaman KPR (PUM)`
      : `Nomor KPA ${dataPeserta.kpa} tidak dapat melanjutkan Pengajuan KPR (PUM) karena sudah memiliki Pinjaman KPR (BUM) dan tidak dapat melanjutkan pengajuan Pinjaman KPR (PUM)`);
    return;
  }

  pfGoStep(2);
};
/* Begitu KPA/NRP/NIK diubah lagi, buka kunci tombol Selanjutnya supaya
   validasi di atas dicek ulang saat diklik. */
["#pf-ktpa", "#pf-nrp", "#pf-nik"].forEach(sel => $(sel).addEventListener("input", () => { $("#pf-lanjut").disabled = false; }));


/* ---------------------------------------------------- wizard: kepangkatan */
let riwayatItems = [];
let riwayatSeq   = 0;

function riwayatBlock(id, idx) {
  return `
    <div class="riwayat-block" data-riwayat="${id}" style="padding:16px 0;border-top:1px solid var(--line-soft)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="t-strong riwayat-block-title" style="font-size:12px;color:var(--body)">Update Kepangkatan Peserta #${idx + 1}</div>
        <button class="link-danger" data-riwayat-hapus="${id}">✕ Hapus</button>
      </div>
      <div class="grid3" style="grid-template-columns:1fr 1fr">
        <div class="field">
          <label class="fl">Pangkat</label>
          <select class="inp">${$("#pf-pangkat").innerHTML}</select>
        </div>
        <div class="field">
          <label class="fl">Nomor SKEP Pengangkatan</label>
          <input class="inp" placeholder="Contoh: KEP/123/IV/2022">
        </div>
        <div class="field">
          <label class="fl">TMT Pengangkatan</label>
          <input class="inp" type="date">
        </div>
        <div class="field">
          <label class="fl">Tanggal SKEP Pengangkatan</label>
          <input class="inp" type="date">
        </div>
        <div class="field">
          <label class="fl">Unggah Fotocopy SKEP Pengangkatan</label>
          <label class="upload-zone" style="padding:16px">
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none">
            <div class="upload-ico" style="font-size:18px;margin-bottom:4px">⬆</div>
            <div style="font-weight:600;font-size:11.5px">Klik atau seret file ke sini</div>
            <div class="hint" style="margin-top:2px">PDF, JPG, PNG - maks.5 MB</div>
          </label>
        </div>
      </div>
    </div>`;
}

/* Bangun ulang SELURUH daftar dari nol — hanya dipakai saat kosong (render
   awal / setelah reset). Menambah & menghapus satu blok TIDAK lewat sini,
   supaya input yang sudah diisi di blok lain tidak ikut hilang. */
function renderRiwayat() {
  $("#riwayat-list").innerHTML = riwayatItems.map((id, idx) => riwayatBlock(id, idx)).join("");
  $("#riwayat-empty").style.display = riwayatItems.length ? "none" : "";
}

function riwayatRenumber() {
  $$("#riwayat-list .riwayat-block").forEach((el, idx) => {
    el.querySelector(".riwayat-block-title").textContent = `Update Kepangkatan Peserta #${idx + 1}`;
  });
}

$("#btn-tambah-riwayat").onclick = () => {
  const id = ++riwayatSeq;
  riwayatItems.push(id);
  $("#riwayat-list").insertAdjacentHTML("beforeend", riwayatBlock(id, riwayatItems.length - 1));
  $("#riwayat-empty").style.display = "none";
};

document.addEventListener("click", e => {
  const b = e.target.closest("[data-riwayat-hapus]");
  if (!b) return;
  const id = +b.dataset.riwayatHapus;
  riwayatItems = riwayatItems.filter(x => x !== id);
  b.closest(".riwayat-block").remove();
  riwayatRenumber();
  $("#riwayat-empty").style.display = riwayatItems.length ? "none" : "";
});

/* Tampilkan nama file begitu dipilih, di dalam kotak unggah manapun */
document.addEventListener("change", e => {
  if (!e.target.matches('input[type="file"]')) return;
  const zone = e.target.closest(".upload-zone");
  const file = e.target.files[0];
  if (!zone || !file) return;
  let note = zone.querySelector(".upload-filename");
  if (!note) {
    note = document.createElement("div");
    note.className = "upload-filename";
    note.style.cssText = "margin-top:8px;font-size:11px;color:var(--navy);font-weight:600";
    zone.appendChild(note);
  }
  note.textContent = "✓ " + file.name;
});

$("#pf2-kembali").onclick = () => pfGoStep(1);
$("#pf2-lanjut").onclick  = () => pfGoStep(3);

/* ---------------------------------------------------- wizard: tipe kpr (pum) */
let pfTipePum = "Kredit Rumah";

function pfSelectTipe(tipe) {
  pfTipePum = tipe;
  $$(".tipe-card").forEach(c => c.classList.toggle("selected", c.dataset.tipe === tipe));
}

document.addEventListener("click", e => {
  const c = e.target.closest(".tipe-card");
  if (!c) return;
  pfSelectTipe(c.dataset.tipe);
});

$("#pf3-kembali").onclick = () => pfGoStep(2);
$("#pf3-lanjut").onclick = () => pfGoStep(4);

/* ---------------------------------------------------- wizard: detail pengajuan */
const PF4_LABEL = {
  "Kredit Rumah":                   "Kredit Rumah",
  "Pembelian Rumah Secara Mandiri": "Pembelian Rumah Secara Mandiri",
  "Membangun Rumah":                "Membangun Rumah"
};
/* Tiap tipe punya panel + prefix id field sendiri */
const PF4_PANEL = {
  "Kredit Rumah":                   { panel: "pf4-kredit-rumah",      prefix: "pf4"   },
  "Pembelian Rumah Secara Mandiri": { panel: "pf4-pembelian-mandiri", prefix: "pf4pm" },
  "Membangun Rumah":                { panel: "pf4-membangun-rumah",   prefix: "pf4mr" }
};

/* Integrasi Parameter Plafon: Plafon di "Data Peserta (Terisi Otomatis)"
   mengikuti nominal yang sudah diatur di sub modul Parameter Plafon sesuai
   Angkatan peserta + Golongan Kepangkatan dari Pangkat yang dipilih. Kalau
   kombinasinya belum diatur di Parameter Plafon, jatuh kembali ke plafon
   bawaan peserta (pfFound.plafonPum). */
function pf4NormAngkatan(angkatan) {
  if (!angkatan) return null;
  if (/^tni-ad$/i.test(angkatan)) return "TNI-AD";
  if (/^tni-al$/i.test(angkatan)) return "TNI-AL";
  if (/^tni-au$/i.test(angkatan)) return "TNI-AU";
  if (/^polri$/i.test(angkatan)) return "POLRI";
  if (/^kemhan$/i.test(angkatan)) return "KEMHAN";
  return null;
}
function pf4PlafonNominal() {
  const golongan = PANGKAT_TO_GOLONGAN[$("#pf-pangkat").value];
  const angkatan = pf4NormAngkatan(pfFound && pfFound.angkatan);
  if (golongan && angkatan) {
    const row = plafonRows.find(r => r.angkatan === angkatan && r.golongan === golongan);
    if (row) return row.nominal;
  }
  return (pfFound && pfFound.plafonPum) || 0;
}

function renderStep4() {
  $("#pf4-title").textContent = `Detail Pengajuan - ${PF4_LABEL[pfTipePum]}`;
  $("#pf4-badge").textContent = `TIPE: ${PF4_LABEL[pfTipePum].toUpperCase()}`;

  const cfg = PF4_PANEL[pfTipePum];
  Object.values(PF4_PANEL).forEach(c => $(`#${c.panel}`).style.display = "none");
  $("#pf4-tipe-lain").style.display = cfg ? "none" : "";

  if (!cfg) {
    $("#pf4-tipe-lain-msg").textContent =
      `Form Detail Pengajuan untuk tipe "${PF4_LABEL[pfTipePum]}" menyusul.`;
    return;
  }
  $(`#${cfg.panel}`).style.display = "";
  if (!pfFound) return;

  const prefix = cfg.prefix;
  $(`#${prefix}-ktpa`).value        = pfFound.kpa;
  $(`#${prefix}-nama-peserta`).value = pfFound.nama || "-";
  $(`#${prefix}-pangkat`).value     = $("#pf-pangkat").value || "-";
  $(`#${prefix}-uker`).value        = pfFound.uker || "-";
  $(`#${prefix}-jumlah-pum`).value  = rp(pf4PlafonNominal());
  const masaKerja = hitungMasaKerjaTahun();
  $(`#${prefix}-masa-kerja`).value  = masaKerja !== null ? `${masaKerja} Tahun` : "-";

  /* Alamat Rumah Pemohon — sama persis dengan Alamat/RT/RW/Kelurahan/
     Kecamatan/Kabupaten-Kota/Provinsi/Kode Pos di langkah 1 Data Peserta. */
  $(`#${prefix}-rp-alamat`).value    = fv("pf-alamat")    || "-";
  $(`#${prefix}-rp-rt`).value        = fv("pf-rt")        || "-";
  $(`#${prefix}-rp-rw`).value        = fv("pf-rw")        || "-";
  $(`#${prefix}-rp-kelurahan`).value = fv("pf-kelurahan") || "-";
  $(`#${prefix}-rp-kecamatan`).value = fv("pf-kecamatan") || "-";
  $(`#${prefix}-rp-kabupaten`).value = fv("pf-kabupaten") || "-";
  $(`#${prefix}-rp-provinsi`).value  = fv("pf-provinsi")  || "-";
  $(`#${prefix}-rp-kodepos`).value   = fv("pf-kodepos")   || "-";
}

/* Populer pilihan Mitra Bayar (sekali saat halaman dimuat) */
function isiMitraBayar(selectId) {
  $(`#${selectId}`).innerHTML =
    `<option value="">--Pilih Bank--</option>` +
    DATA_MITRA_BAYAR.map(b => `<option>${esc(b)}</option>`).join("");
}
isiMitraBayar("pf4-mitra-bayar");
isiMitraBayar("pf4pm-mitra-bayar");
isiMitraBayar("pf4mr-mitra-bayar");

/* Autocomplete Kelurahan → otomatis isi Kecamatan/Kabupaten/Provinsi, dan Kode
   Pos bila field-nya ada. Dipakai berulang untuk tiap tipe PUM lewat prefix id
   field-nya. */
function bindKelurahanAutocomplete(prefix) {
  $(`#${prefix}-kelurahan`).oninput = () => {
    const q = $(`#${prefix}-kelurahan`).value.trim().toLowerCase();
    const list = $(`#${prefix}-kelurahan-list`);
    if (!q) { list.classList.remove("open"); list.innerHTML = ""; return; }

    const hits = DATA_WILAYAH.filter(w => w.kelurahan.toLowerCase().includes(q));
    if (!hits.length) { list.classList.remove("open"); list.innerHTML = ""; return; }

    list.innerHTML = hits.map(w => `
      <div class="autocomplete-item" data-kel="${esc(w.kelurahan)}">
        ${esc(w.kelurahan)}
        <small>${esc(w.kecamatan)}, ${esc(w.kabupaten)}, ${esc(w.provinsi)}</small>
      </div>`).join("");
    list.classList.add("open");
  };

  document.addEventListener("click", e => {
    const item = e.target.closest(`#${prefix}-kelurahan-list .autocomplete-item`);
    if (item) {
      const w = DATA_WILAYAH.find(x => x.kelurahan === item.dataset.kel);
      if (w) {
        $(`#${prefix}-kelurahan`).value  = w.kelurahan;
        $(`#${prefix}-kecamatan`).value  = w.kecamatan;
        $(`#${prefix}-kabupaten`).value  = w.kabupaten;
        $(`#${prefix}-provinsi`).value   = w.provinsi;
        /* Kode Pos ikut terisi kalau layarnya punya field itu — tetap bisa
           diubah manual, catatannya hilang begitu diketik ulang. */
        const kodeposInp  = $(`#${prefix}-kodepos`);
        const kodeposHint = $(`#${prefix}-kodepos-saran`);
        if (kodeposInp && w.kodepos) {
          kodeposInp.value = w.kodepos;
          if (kodeposHint) {
            kodeposHint.style.display = "";
            kodeposHint.textContent = "💡 Terisi otomatis dari kelurahan — bisa diubah jika perlu.";
            kodeposInp.oninput = () => { kodeposHint.style.display = "none"; };
          }
        }
      }
      $(`#${prefix}-kelurahan-list`).classList.remove("open");
      return;
    }
    if (!e.target.closest(`#${prefix}-kelurahan`)) $(`#${prefix}-kelurahan-list`).classList.remove("open");
  });
}
bindKelurahanAutocomplete("pf");
bindKelurahanAutocomplete("pf4");
bindKelurahanAutocomplete("pf4pm");
bindKelurahanAutocomplete("pf4mr");

/* Cek Rekening — validasi format sederhana, tampilkan pop up jika tidak valid */
function bindCekRekening(prefix) {
  $(`#${prefix}-cek-rekening`).onclick = () => {
    const no = $(`#${prefix}-nomor-rekening`).value.trim();
    if (!/^\d{10,16}$/.test(no)) {
      showAlertPopup("Validasi Rekening", "Nomor Rekening Tidak Valid, silahkan masukkan Nomor Rekening yang Valid.");
      return;
    }
    showAlertPopup("Validasi Rekening", "Nomor Rekening Valid", "", "ok");
  };
}
bindCekRekening("pf4");
bindCekRekening("pf4pm");
bindCekRekening("pf4mr");

/* "Kembali" di Detail Pengajuan hanya kembali ke langkah Tipe KPR (PUM) —
   bukan keluar dari wizard — supaya data yang sudah diisi tidak hilang. */
$("#pf4-kembali").onclick = () => pfGoStep(3);
/* Field wajib di langkah 4 Detail Pengajuan — berbeda per tipe KPR (PUM). */
function pf4MissingFields() {
  const fileMissing = id => !($(`#${id}`).files && $(`#${id}`).files[0]);
  const missing = [];
  if (pfTipePum === "Kredit Rumah") {
    if (fileMissing("pf4-file-akad")) missing.push("Upload Fotocopy Akad Kredit");
    if (fileMissing("pf4-file-buku")) missing.push("Upload Buku Tabungan");
  } else if (pfTipePum === "Pembelian Rumah Secara Mandiri") {
    if (!$("#pf4pm-jenis-hak").value) missing.push("Jenis Hak Kepemilikan Atas Tanah");
    if (fileMissing("pf4pm-file-hak")) missing.push("Upload Fotocopy Sertifikat/Akta Jual Beli");
    if (!$("#pf4pm-alamat-perumahan").value.trim()) missing.push("Alamat Perumahan");
    if (fileMissing("pf4pm-file-buku")) missing.push("Upload Buku Tabungan");
  } else if (pfTipePum === "Membangun Rumah") {
    if (!$("#pf4mr-jenis-hak").value) missing.push("Jenis Hak Kepemilikan Atas Tanah");
    if (fileMissing("pf4mr-file-buku")) missing.push("Upload Buku Tabungan");
  }
  return missing;
}

$("#pf4-lanjut").onclick = () => {
  const missing = pf4MissingFields();
  if (missing.length) {
    toast(`Field wajib belum diisi: ${missing.join(", ")}.`, "bad");
    return;
  }

  const docs = pf5Docs() || [];
  const totalWajib = docs.filter(d => !d.kondisional).length;
  const doneWajib  = docs.filter((d, i) => !d.kondisional && pf5Uploaded[i]).length;
  if (doneWajib < totalWajib) {
    toast(`Lengkapi ${totalWajib - doneWajib} dokumen wajib terlebih dahulu.`, "bad");
    return;
  }

  /* Anggota militer (TNI AD/AU/AL) dengan masa kerja dinas < 2 tahun tidak
     bisa melanjutkan pengajuan PUM KPR. Masa Kerja Dinas dihitung otomatis
     dari Riwayat Kepangkatan Peserta di langkah 2. */
  const isTni = pfFound && /^TNI/i.test(pfFound.angkatan || "");
  const masaKerja = hitungMasaKerjaTahun();
  if (isTni && masaKerja !== null && masaKerja < 2) {
    showAlertPopup("Validasi Masa Kerja Dinas",
      "Pengajuan KPR (PUM) tidak dapat diproses karena Peserta merupakan Anggota Militer TNI AD/TNI AU/TNI AL dengan Masa Kerja Dinas kurang dari 2 Tahun");
    return;
  }
  pfGoStep(5);
};

/* ---------------------------------------------------- wizard: unggah dokumen */
let pf5RenderedTipe = null;
let pf5Uploaded = {};

/* Surat Pernyataan Kesanggupan bersifat wajib dan hanya muncul di daftar
   dokumen untuk peserta Polri dengan Masa Kerja Dinas < 2 tahun. */
function pf5SyaratPolri() {
  const isPolri  = pfFound && /^polri$/i.test(pfFound.angkatan || "");
  const masaKerja = hitungMasaKerjaTahun();
  return isPolri && masaKerja !== null && masaKerja < 2;
}
function pf5Docs() {
  const base = DATA_DOKUMEN_PERSYARATAN[pfTipePum];
  if (!base) return null;
  return pf5SyaratPolri() ? [...base, { label:"Surat Pernyataan Kesanggupan" }] : base;
}

function renderDocRow(d, i) {
  const wajib = !d.kondisional;
  return `
    <div class="doc-row">
      <div class="doc-info">
        <span class="doc-ico">📄</span>
        <div>
          <div class="doc-label">${esc(d.label)}${wajib ? ` <span class="req">*</span>` : ` <span class="hint" style="display:inline;font-weight:400">(Opsional)</span>`}</div>
          ${d.note ? `<div class="doc-note">${esc(d.note)}</div>` : ""}
        </div>
      </div>
      <div class="doc-actions">
        <span class="pill pill-ok" id="pf5-status-${i}" style="display:none">Terunggah</span>
        <label class="btn btn-primary btn-sm">
          ⬆ Unggah
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" data-doc-idx="${i}">
        </label>
      </div>
    </div>`;
}

function renderStep5() {
  $("#pf5-list-title").textContent = `Daftar Dokumen Persyaratan - ${PF4_LABEL[pfTipePum]}`;

  /* Bangun ulang daftar hanya saat tipe berubah — supaya status unggahan
     tidak hilang kalau user cuma bolak-balik antar langkah. */
  if (pf5RenderedTipe !== pfTipePum) {
    pf5RenderedTipe = pfTipePum;
    pf5Uploaded = {};
    const docs = pf5Docs();
    $("#pf5-list").innerHTML = docs
      ? docs.map((d, i) => renderDocRow(d, i)).join("")
      : `<div class="empty"><p>Daftar dokumen untuk tipe ini menyusul.</p></div>`;
  }
  updatePf5Progress();
}

function updatePf5Progress() {
  const docs = pf5Docs();
  if (!docs) {
    $("#pf5-progress-lbl").textContent  = "";
    $("#pf5-progress-fill").style.width = "0%";
    $("#pf5-alert-kurang").style.display  = "none";
    $("#pf5-alert-lengkap").style.display = "none";
    return;
  }
  const totalWajib = docs.filter(d => !d.kondisional).length;
  const doneWajib  = docs.filter((d, i) => !d.kondisional && pf5Uploaded[i]).length;
  const totalAll   = docs.length;
  const doneAll    = docs.filter((d, i) => pf5Uploaded[i]).length;

  $("#pf5-progress-lbl").textContent  = `${doneAll}/${totalAll} diunggah`;
  $("#pf5-progress-fill").style.width = `${Math.round(doneAll / totalAll * 100)}%`;

  const kurang = totalWajib - doneWajib;
  $("#pf5-alert-kurang").style.display  = kurang > 0 ? "" : "none";
  $("#pf5-alert-lengkap").style.display = kurang > 0 ? "none" : "";
  if (kurang > 0) {
    $("#pf5-alert-kurang-msg").textContent =
      `${kurang} dokumen wajib belum diunggah. Harap lengkapi sebelum melanjutkan.`;
  }
}

document.addEventListener("change", e => {
  const inp = e.target.closest("[data-doc-idx]");
  if (!inp || !inp.files[0]) return;
  const idx = +inp.dataset.docIdx;
  pf5Uploaded[idx] = inp.files[0];
  const pillEl = $(`#pf5-status-${idx}`);
  pillEl.style.display = "";
  updatePf5Progress();
});

/* ---------------------------------------------------- wizard: review & simpan */
const BULAN_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli",
  "Agustus","September","Oktober","November","Desember"];
const HARI_ID  = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

function fmtTgl(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${+d} ${BULAN_ID[+m - 1]} ${y}`;
}
function fmtTglHariIni() {
  const d = new Date();
  return `${HARI_ID[d.getDay()]}, ${d.getDate()} ${BULAN_ID[d.getMonth()]} ${d.getFullYear()}`;
}
/* Tanggal hari ini dalam format ISO — pasangan fmtTgl() untuk baris baru */
function isoHariIni() {
  const d = new Date(), p2 = v => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}

/* ------------------------------------------------------- preview file unggahan
   File asli (bukan cuma nama-nya) disimpan di registry ini supaya tombol
   "Preview" di halaman Review & Simpan / Detail bisa membuka isinya —
   tetap berfungsi walau snapshot-nya sudah disimpan ke baris pengajuan. */
let filePreviewRegistry = {};
let filePreviewSeq = 0;
function registerFile(file) {
  if (!file) return null;
  const id = `fp${filePreviewSeq++}`;
  filePreviewRegistry[id] = file;
  return id;
}

function openFilePreview(id) {
  const file = filePreviewRegistry[id];
  if (!file) { toast("File tidak ditemukan untuk dipratinjau.", "bad"); return; }
  const url     = URL.createObjectURL(file);
  const isImage = file.type.startsWith("image/");
  const isPdf   = file.type === "application/pdf";

  $("#modal-title").textContent = "Preview Dokumen";
  $("#modal-sub").textContent   = file.name;
  $("#modal-body").innerHTML = `
    <div style="text-align:center;background:var(--field);border-radius:9px;overflow:hidden;${isImage || isPdf ? "" : "padding:36px 16px"}">
      ${isImage
        ? `<img src="${url}" alt="${esc(file.name)}" style="max-width:100%;max-height:60vh;display:block;margin:0 auto">`
        : isPdf
        ? `<iframe src="${url}" style="width:100%;height:60vh;border:0"></iframe>`
        : `<div style="color:var(--muted)"><div style="font-size:32px;margin-bottom:10px">📄</div>Preview tidak tersedia untuk tipe file ini. Gunakan tombol unduh untuk melihat isinya.</div>`}
    </div>
    <div class="form-actions">
      <a class="btn btn-ghost" href="${url}" download="${esc(file.name)}">⤓ Unduh</a>
      <button class="btn btn-primary" id="fp-close">Tutup</button>
    </div>`;
  openModal();
  $("#fp-close").onclick = closeModal;
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-preview-file]");
  if (b) openFilePreview(b.dataset.previewFile);
});

/* Preview untuk berkas yang sudah tersimpan sebagai data (bukan File live di
   browser) — cth. berkas pada baris pengajuan Approval. Cuma nama file yang
   tersimpan, jadi ditampilkan sebagai placeholder, bukan isi dokumen asli. */
function openFilePreviewByName(name) {
  $("#modal-title").textContent = "Preview Dokumen";
  $("#modal-sub").textContent   = name;
  $("#modal-body").innerHTML = `
    <div style="text-align:center;background:var(--field);border-radius:9px;padding:36px 16px">
      <div style="color:var(--muted)"><div style="font-size:32px;margin-bottom:10px">📄</div>${esc(name)}<br>Preview tidak tersedia untuk data contoh ini.</div>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" id="fp-close">Tutup</button>
    </div>`;
  openModal();
  $("#fp-close").onclick = closeModal;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-preview-name]");
  if (b) openFilePreviewByName(b.dataset.previewName);
});

function reviewField(label, value, span2 = false, previewId = null) {
  return `<div class="field ${span2 ? "span2" : ""}">
    <label class="fl">${esc(label)}</label>
    <div class="t-strong" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span>${esc(value || "-")}</span>
      ${previewId ? `<button class="btn btn-ghost btn-sm" type="button" data-preview-file="${previewId}">👁 Preview</button>` : ""}
    </div>
  </div>`;
}

const PF6_PANEL = {
  "Kredit Rumah":                   "pf6-kredit-rumah",
  "Pembelian Rumah Secara Mandiri": "pf6-pembelian-mandiri",
  "Membangun Rumah":                "pf6-membangun-rumah"
};

const fv       = id => ($(`#${id}`) ? $(`#${id}`).value : "");
const fileName = id => { const f = $(`#${id}`); return f && f.files[0] ? f.files[0].name : ""; };

/* Bangun field {label, value, previewId} dari satu input file — dipakai
   untuk semua field "Upload ..." di ringkasan Review & Simpan / Detail. */
function fileField(label, id) {
  const f    = $(`#${id}`);
  const file = f && f.files[0] ? f.files[0] : null;
  return { label, value: file ? file.name : "Belum diunggah", previewId: registerFile(file) };
}

function fieldsToHtml(fields) {
  return fields.map(f => reviewField(f.label, f.value, f.wide, f.previewId)).join("");
}

function riwayatToGroups() {
  return $$("#riwayat-list .riwayat-block").map(b => {
    const inp  = b.querySelectorAll("input");
    const file = inp[3].files[0] || null;
    return [
      { label:"Pangkat", value: b.querySelector("select").value },
      { label:"Nomor SKEP Pengangkatan", value: inp[0].value },
      { label:"TMT Pengangkatan", value: fmtTgl(inp[1].value) },
      { label:"Tanggal SKEP Pengangkatan", value: fmtTgl(inp[2].value) },
      { label:"Upload SKEP Pengangkatan", value: file ? file.name : "Belum diunggah", previewId: registerFile(file) }
    ];
  });
}

/* Riwayat Kepangkatan Peserta dari sistem kepesertaan (read-only), dicocokkan
   lewat KTPA peserta yang sedang diproses di wizard. */
function kpRiwayatDbRows() {
  return (pfFound && DATA_RIWAYAT_KEPANGKATAN[pfFound.kpa]) || [];
}

function renderKpRiwayatDb() {
  const rows = kpRiwayatDbRows();
  $("#kp-riwayat-db-body").innerHTML = rows.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(r.pangkat)}</td>
      <td>${esc(r.nomorSkep)}</td>
      <td>${esc(fmtTgl(r.tmt))}</td>
      <td>${esc(fmtTgl(r.tglSkep))}</td>
    </tr>`).join("");
  $("#kp-riwayat-db-empty").style.display = rows.length ? "none" : "";
}

/* TMT tertua di antara Riwayat Kepangkatan Peserta (DB) dan Update
   Kepangkatan Peserta yang baru diisi — dipakai untuk menghitung Masa Kerja
   Dinas secara otomatis di langkah 4. */
function pfEarliestTmt() {
  const dbTmts = kpRiwayatDbRows().map(r => r.tmt);
  const updateTmts = $$("#riwayat-list .riwayat-block").map(b => b.querySelectorAll("input")[1].value).filter(Boolean);
  const all = [...dbTmts, ...updateTmts].filter(Boolean).sort();
  return all[0] || null;
}

function tahunDariTmt(tmt) {
  if (!tmt) return null;
  const start = new Date(tmt), now = new Date();
  let tahun = now.getFullYear() - start.getFullYear();
  if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) tahun--;
  return Math.max(0, tahun);
}

function hitungMasaKerjaTahun() {
  return tahunDariTmt(pfEarliestTmt());
}

/* Masa Kerja Dinas dari Riwayat Kepangkatan Peserta (DB) langsung berdasarkan
   Nomor KPA — dipakai di langkah "Cari Data Peserta" sebelum wizard (dan
   pfFound) terbentuk. */
function masaKerjaKpaAwal(kpa) {
  const rows = DATA_RIWAYAT_KEPANGKATAN[kpa] || [];
  const tmts = rows.map(r => r.tmt).filter(Boolean).sort();
  return tahunDariTmt(tmts[0] || null);
}

/* Snapshot lengkap dari semua field wizard (langkah 1–5) untuk tipe yang
   sedang aktif — dipakai untuk merender halaman Review & Simpan, dan
   disimpan apa adanya ke baris pengajuan saat Simpan Draft supaya halaman
   Detail nanti bisa menampilkan rincian yang sama persis. */
function buildStep6Snapshot() {
  const dataPeserta = [
    { label:"KPA", value: fv("pf-ktpa") },
    { label:"NRP/NIP", value: fv("pf-nrp") },
    { label:"Nama Lengkap", value: fv("pf-nama") },
    { label:"Tempat Lahir", value: fv("pf-tempat-lahir") },
    { label:"Tanggal Lahir", value: fmtTgl(fv("pf-tgl-lahir")) },
    { label:"Jenis Kelamin", value: fv("pf-jk") },
    { label:"Status Kawin", value: fv("pf-kawin") },
    { label:"NIK", value: fv("pf-nik") },
    { label:"Nomor Handphone", value: fv("pf-hp") },
    { label:"Pangkat", value: fv("pf-pangkat") },
    { label:"Alamat", value: fv("pf-alamat") },
    { label:"RT", value: fv("pf-rt") },
    { label:"RW", value: fv("pf-rw") },
    { label:"Kelurahan", value: fv("pf-kelurahan") },
    { label:"Kecamatan", value: fv("pf-kecamatan") },
    { label:"Kabupaten/Kota", value: fv("pf-kabupaten") },
    { label:"Provinsi", value: fv("pf-provinsi") },
    { label:"Kode Pos", value: fv("pf-kodepos") }
  ];

  const riwayatDb = kpRiwayatDbRows();
  const riwayat = riwayatToGroups();

  let detailGroups = [];
  if (pfTipePum === "Kredit Rumah") {
    detailGroups = [
      { title:"Data Peserta (Terisi Otomatis)", fields:[
        { label:"KPA", value: fv("pf4-ktpa") },
        { label:"Nama Peserta", value: fv("pf4-nama-peserta") },
        { label:"Pangkat", value: fv("pf4-pangkat") },
        { label:"UKER", value: fv("pf4-uker") },
        { label:"Plafon", value: fv("pf4-jumlah-pum") },
        { label:"Masa Kerja Dinas", value: fv("pf4-masa-kerja") },
        { label:"Alamat Rumah Pemohon", value: fv("pf4-rp-alamat"), wide:true },
        { label:"RT", value: fv("pf4-rp-rt") },
        { label:"RW", value: fv("pf4-rp-rw") },
        { label:"Kelurahan", value: fv("pf4-rp-kelurahan") },
        { label:"Kecamatan", value: fv("pf4-rp-kecamatan") },
        { label:"Kabupaten/Kota", value: fv("pf4-rp-kabupaten") },
        { label:"Provinsi", value: fv("pf4-rp-provinsi") },
        { label:"Kode Pos", value: fv("pf4-rp-kodepos") }
      ]},
      { title:"Data Kredit & Properti", fields:[
        { label:"Nama Perumahan", value: fv("pf4-nama-perumahan") },
        { label:"Nama Developer", value: fv("pf4-nama-developer") },
        { label:"Alamat Perumahan", value: fv("pf4-alamat-perumahan"), wide:true },
        { label:"Tipe Rumah", value: fv("pf4-tipe-rumah") },
        { label:"Blok-Nomor Rumah", value: fv("pf4-blok-rumah") },
        { label:"Kelurahan", value: fv("pf4-kelurahan") },
        { label:"Kecamatan", value: fv("pf4-kecamatan") },
        { label:"Kabupaten/Kota", value: fv("pf4-kabupaten") },
        { label:"Provinsi", value: fv("pf4-provinsi") },
        { label:"Jenis Kredit", value: fv("pf4-jenis-kredit") },
        { label:"Bank Kredit", value: fv("pf4-bank-kredit") },
        { label:"Nomor Akad Kredit", value: fv("pf4-nomor-akad") },
        { label:"Tanggal Akad Kredit", value: fmtTgl(fv("pf4-tgl-akad")) },
        fileField("Upload Fotocopy Akad Kredit", "pf4-file-akad")
      ]},
      { title:"Data Rekening Penyaluran KPR (PUM)", fields:[
        { label:"Nama Rekening Peserta Penyaluran KPR (PUM)", value: fv("pf4-nama-rekening") },
        { label:"Nomor Rekening Tujuan", value: fv("pf4-nomor-rekening") },
        { label:"Mitra Bayar", value: fv("pf4-mitra-bayar") },
        { label:"Cabang Mitra Bayar", value: fv("pf4-cabang-mitra") },
        fileField("Upload Buku Tabungan", "pf4-file-buku")
      ]}
    ];
  } else if (pfTipePum === "Pembelian Rumah Secara Mandiri") {
    detailGroups = [
      { title:"Data Peserta (Terisi Otomatis)", fields:[
        { label:"KPA", value: fv("pf4pm-ktpa") },
        { label:"Nama Peserta", value: fv("pf4pm-nama-peserta") },
        { label:"Pangkat", value: fv("pf4pm-pangkat") },
        { label:"UKER", value: fv("pf4pm-uker") },
        { label:"Plafon", value: fv("pf4pm-jumlah-pum") },
        { label:"Masa Kerja Dinas", value: fv("pf4pm-masa-kerja") },
        { label:"Alamat Rumah Pemohon", value: fv("pf4pm-rp-alamat"), wide:true },
        { label:"RT", value: fv("pf4pm-rp-rt") },
        { label:"RW", value: fv("pf4pm-rp-rw") },
        { label:"Kelurahan", value: fv("pf4pm-rp-kelurahan") },
        { label:"Kecamatan", value: fv("pf4pm-rp-kecamatan") },
        { label:"Kabupaten/Kota", value: fv("pf4pm-rp-kabupaten") },
        { label:"Provinsi", value: fv("pf4pm-rp-provinsi") },
        { label:"Kode Pos", value: fv("pf4pm-rp-kodepos") }
      ]},
      { title:"Data Properti", fields:[
        { label:"Jenis Hak Kepemilikan Atas Tanah", value: fv("pf4pm-jenis-hak") },
        { label:"Atas Nama Peserta atau Pasangan", value: fv("pf4pm-atas-nama") },
        { label:"Nomor Sertifikat/Akta Jual Beli", value: fv("pf4pm-nomor-hak") },
        { label:"Tanggal Sertifikat/Akta Jual Beli", value: fmtTgl(fv("pf4pm-tgl-hak")) },
        fileField("Upload Fotocopy Sertifikat/Akta Jual Beli", "pf4pm-file-hak"),
        { label:"Nama Perumahan", value: fv("pf4pm-nama-perumahan") },
        { label:"Nama Developer", value: fv("pf4pm-nama-developer") },
        { label:"Alamat Perumahan", value: fv("pf4pm-alamat-perumahan"), wide:true },
        { label:"Tipe Rumah", value: fv("pf4pm-tipe-rumah") },
        { label:"Blok-Nomor Rumah", value: fv("pf4pm-blok-rumah") },
        { label:"Kelurahan", value: fv("pf4pm-kelurahan") },
        { label:"Kecamatan", value: fv("pf4pm-kecamatan") },
        { label:"Kabupaten/Kota", value: fv("pf4pm-kabupaten") },
        { label:"Provinsi", value: fv("pf4pm-provinsi") }
      ]},
      { title:"Data Rekening Penyaluran KPR (PUM)", fields:[
        { label:"Nama Rekening Peserta Penyaluran KPR (PUM)", value: fv("pf4pm-nama-rekening") },
        { label:"Nomor Rekening Tujuan", value: fv("pf4pm-nomor-rekening") },
        { label:"Mitra Bayar", value: fv("pf4pm-mitra-bayar") },
        { label:"Cabang Mitra Bayar", value: fv("pf4pm-cabang-mitra") },
        fileField("Upload Buku Tabungan", "pf4pm-file-buku")
      ]}
    ];
  } else if (pfTipePum === "Membangun Rumah") {
    detailGroups = [
      { title:"Data Peserta (Terisi Otomatis)", fields:[
        { label:"KPA", value: fv("pf4mr-ktpa") },
        { label:"Nama Peserta", value: fv("pf4mr-nama-peserta") },
        { label:"Pangkat", value: fv("pf4mr-pangkat") },
        { label:"UKER", value: fv("pf4mr-uker") },
        { label:"Plafon", value: fv("pf4mr-jumlah-pum") },
        { label:"Masa Kerja Dinas", value: fv("pf4mr-masa-kerja") },
        { label:"Alamat Rumah Pemohon", value: fv("pf4mr-rp-alamat"), wide:true },
        { label:"RT", value: fv("pf4mr-rp-rt") },
        { label:"RW", value: fv("pf4mr-rp-rw") },
        { label:"Kelurahan", value: fv("pf4mr-rp-kelurahan") },
        { label:"Kecamatan", value: fv("pf4mr-rp-kecamatan") },
        { label:"Kabupaten/Kota", value: fv("pf4mr-rp-kabupaten") },
        { label:"Provinsi", value: fv("pf4mr-rp-provinsi") },
        { label:"Kode Pos", value: fv("pf4mr-rp-kodepos") }
      ]},
      { title:"Data Lokasi Pembangunan", fields:[
        { label:"Jenis Hak Kepemilikan Atas Tanah", value: fv("pf4mr-jenis-hak") },
        { label:"Atas Nama Peserta atau Pasangan", value: fv("pf4mr-atas-nama") },
        { label:"Nomor Sertifikat/Akta Jual Beli/Girik/Akta Hibah", value: fv("pf4mr-nomor-hak") },
        { label:"Tanggal Sertifikat/Akta Jual Beli/Girik/Akta Hibah", value: fmtTgl(fv("pf4mr-tgl-hak")) },
        fileField("Upload Sertifikat/Akta Jual Beli/Girik/Akta Hibah", "pf4mr-file-hak"),
        fileField("Fotocopy PBG (Persetujuan Bangunan Gedung)", "pf4mr-file-pbg"),
        { label:"Alamat Lengkap Rumah Yang Akan Dibangun", value: fv("pf4mr-alamat-baru"), wide:true },
        { label:"RT", value: fv("pf4mr-rt") },
        { label:"RW", value: fv("pf4mr-rw") },
        { label:"Kelurahan", value: fv("pf4mr-kelurahan") },
        { label:"Kecamatan", value: fv("pf4mr-kecamatan") },
        { label:"Kota/Kabupaten", value: fv("pf4mr-kabupaten") },
        { label:"Provinsi", value: fv("pf4mr-provinsi") }
      ]},
      { title:"Data Rekening Penyaluran KPR (PUM)", fields:[
        { label:"Nama Rekening Peserta Penyaluran KPR (PUM)", value: fv("pf4mr-nama-rekening") },
        { label:"Nomor Rekening Tujuan", value: fv("pf4mr-nomor-rekening") },
        { label:"Mitra Bayar", value: fv("pf4mr-mitra-bayar") },
        { label:"Cabang Mitra Bayar", value: fv("pf4mr-cabang-mitra") },
        fileField("Upload Buku Tabungan", "pf4mr-file-buku")
      ]}
    ];
  }

  const docsDef = pf5Docs() || [];
  const dokumen = docsDef.map((d, i) => {
    const file = pf5Uploaded[i] || null;
    return {
      label: d.label, kondisional: !!d.kondisional, note: d.note,
      uploadedName: file ? file.name : null, previewId: registerFile(file)
    };
  });

  return { tipePum: pfTipePum, dataPeserta, riwayatDb, riwayat, detailGroups, dokumen };
}

/* Snapshot MENTAH (nilai input asli, bukan yang sudah diformat untuk
   ditampilkan) — dipakai untuk mengisi ulang wizard saat tombol "Ubah"
   diklik dari Daftar Pengajuan KPR (PUM). */
function buildRawSnapshot() {
  const fields = {};
  PF_TEXT_FIELD_IDS.forEach(id => { fields[id] = fv(id); });

  const files = {};
  PF_FILE_FIELD_IDS.forEach(id => { const f = $(`#${id}`); files[id] = (f && f.files[0]) || null; });

  const riwayat = $$("#riwayat-list .riwayat-block").map(b => {
    const inp = b.querySelectorAll("input");
    return {
      pangkat: b.querySelector("select").value,
      nomorSkep: inp[0].value, tmt: inp[1].value, tglSkep: inp[2].value, file: inp[3].files[0] || null
    };
  });

  return { tipePum: pfTipePum, fields, files, riwayat, docs: { ...pf5Uploaded } };
}

function dokumenToHtml(dokumen) {
  return dokumen.map(d => `
    <div class="doc-row">
      <div class="doc-info"><span class="doc-ico">📄</span><div class="doc-label">${esc(d.label)}</div></div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="pill ${d.uploadedName ? "pill-ok" : (d.kondisional ? "pill-warn" : "pill-bad")}">${d.uploadedName ? "✓ " + esc(d.uploadedName) : (d.kondisional ? (d.note ? "Kondisional" : "Opsional") : "Belum diunggah")}</span>
        ${d.previewId ? `<button class="btn btn-ghost btn-sm" type="button" data-preview-file="${d.previewId}">👁 Preview</button>` : ""}
      </div>
    </div>`).join("");
}

const PF6_GROUP_IDS = {
  "pf6-kredit-rumah":      ["#pf6-dp-peserta",   "#pf6-dp-properti",   "#pf6-dp-rekening"],
  "pf6-pembelian-mandiri": ["#pf6pm-dp-peserta", "#pf6pm-dp-properti", "#pf6pm-dp-rekening"],
  "pf6-membangun-rumah":   ["#pf6mr-dp-peserta", "#pf6mr-dp-lokasi",   "#pf6mr-dp-rekening"]
};
const PF6_DOKUMEN_ID = {
  "pf6-kredit-rumah": "#pf6-dokumen", "pf6-pembelian-mandiri": "#pf6pm-dokumen", "pf6-membangun-rumah": "#pf6mr-dokumen"
};

function renderStep6() {
  $("#pf6-badge").textContent = `TIPE: ${PF4_LABEL[pfTipePum].toUpperCase()}`;

  const panelId = PF6_PANEL[pfTipePum];
  Object.values(PF6_PANEL).forEach(id => $(`#${id}`).style.display = "none");
  $("#pf6-tipe-lain").style.display = panelId ? "none" : "";
  if (!panelId) {
    $("#pf6-tipe-lain-msg").textContent =
      `Ringkasan pengajuan untuk tipe "${PF4_LABEL[pfTipePum]}" menyusul.`;
    return;
  }
  $(`#${panelId}`).style.display = "";

  const snap = buildStep6Snapshot();

  $("#pf6-data-peserta").innerHTML = fieldsToHtml(snap.dataPeserta);
  $("#pf6-riwayat-db").innerHTML = snap.riwayatDb.length
    ? `<div class="tbl-wrap"><table><thead><tr><th>No</th><th>Pangkat</th><th>Nomor SKEP Pengangkatan</th><th>TMT Pengangkatan</th><th>Tanggal SKEP Pengangkatan</th></tr></thead><tbody>${
        snap.riwayatDb.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.pangkat)}</td><td>${esc(r.nomorSkep)}</td><td>${esc(fmtTgl(r.tmt))}</td><td>${esc(fmtTgl(r.tglSkep))}</td></tr>`).join("")
      }</tbody></table></div>`
    : `<div class="hint" style="margin:0">Tidak ada riwayat kepangkatan pada sistem kepesertaan untuk peserta ini.</div>`;
  $("#pf6-riwayat").innerHTML = snap.riwayat.length
    ? snap.riwayat.map((fields, i) => `
        <div style="${i === snap.riwayat.length - 1 ? "" : "margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--line-soft)"}">
          <div class="t-strong" style="font-size:12px;margin-bottom:8px">Update Kepangkatan Peserta #${i + 1}</div>
          <div class="grid3" style="grid-template-columns:1fr 1fr">${fieldsToHtml(fields)}</div>
        </div>`).join("")
    : `<div class="hint" style="margin:0">Belum ada update kepangkatan peserta ditambahkan.</div>`;
  $("#pf6-tipe-pill").textContent = snap.tipePum;

  snap.detailGroups.forEach((g, i) => { $(PF6_GROUP_IDS[panelId][i]).innerHTML = fieldsToHtml(g.fields); });
  $(PF6_DOKUMEN_ID[panelId]).innerHTML = dokumenToHtml(snap.dokumen);
}

/* "Kembali" hanya balik ke langkah Unggah Dokumen — data yang sudah diisi tetap ada. */
$("#pf6-kembali").onclick = () => pfGoStep(4);

/* Pernyataan Atas Tanggung Jawab dan Keabsahan Data — wajib disetujui
   (seluruh poin dicentang) sebelum Simpan Draft Pengajuan diproses. Isi
   poin-poinnya dikelola lewat Sub Modul Parameter Pernyataan Tanggung Jawab
   (lihat pernyataanRows di bawah), jadi popup ini selalu mengikuti data
   terkini — bukan daftar statis. */
function pf6BukaPernyataan() {
  $("#modal-title").textContent = "Pernyataan Atas Tanggung Jawab dan Keabsahan Data Pengajuan KPR (PUM)";
  $("#modal-sub").textContent   = "Wajib disetujui sebelum pengajuan dapat disimpan sebagai draft.";
  $("#modal-body").innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px">
      ${pernyataanRows.map((p, i) => `
        <div style="display:flex;gap:10px;align-items:flex-start">
          <input type="checkbox" id="pf6-pernyataan-${i}" class="pf6-pernyataan-chk" style="margin-top:3px;flex-shrink:0">
          <label for="pf6-pernyataan-${i}" style="font-size:12.5px;line-height:1.55;color:var(--body)">
            <span class="t-strong" style="display:block;color:var(--ink)">${i + 1}. ${esc(p.judul)}:</span>
            ${esc(p.isi)}
          </label>
        </div>`).join("")}
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" id="pf6-pernyataan-batal">Batal</button>
      <button class="btn btn-primary" id="pf6-pernyataan-setuju" disabled>✓ Setuju & Simpan</button>
    </div>`;
  openModal();
  $("#pf6-pernyataan-batal").onclick = closeModal;

  const tombolSetuju = $("#pf6-pernyataan-setuju");
  const cekSemuaDicentang = () => {
    tombolSetuju.disabled = $$(".pf6-pernyataan-chk").some(c => !c.checked);
  };
  $$(".pf6-pernyataan-chk").forEach(c => c.onchange = cekSemuaDicentang);

  tombolSetuju.onclick = () => {
    if (tombolSetuju.disabled) return;
    pf6SimpanDraft();
  };
}

function pf6SimpanDraft() {
  const kpa  = $("#pf-ktpa").value.trim() || pfFound.kpa;
  const snap = buildStep6Snapshot();
  const raw  = buildRawSnapshot();
  const tipeRumahPrefix = { "Kredit Rumah":"pf4", "Pembelian Rumah Secara Mandiri":"pf4pm" }[pfTipePum];
  const tipeRumah = (tipeRumahPrefix && $(`#${tipeRumahPrefix}-tipe-rumah`).value.trim()) || "-";

  if (pumEditingRow) {
    const r = pumEditingRow;
    const statusBerubah = r.status !== "Draft";
    Object.assign(r, {
      kpa, nrp: $("#pf-nrp").value.trim() || pfFound.nrp, npwp: pfFound.npwp,
      nama: $("#pf-nama").value.trim() || pfFound.nama, angkatan: pfFound.angkatan,
      tipePum: pfTipePum, tipeRumah, jumlah: pf4PlafonNominal() || r.jumlah,
      status: "Draft", detail: snap, raw
    });
    renderPum(); renderApproval();

    $("#modal-title").textContent = "Perubahan pengajuan tersimpan";
    $("#modal-sub").textContent   = `${r.kpa} — ${r.nama}`;
    $("#modal-body").innerHTML = `
      <div class="alert alert-ok"><span>✓</span><span>Pengajuan KPR (PUM) atas nama ${esc(r.nama)} berhasil diperbarui.${statusBerubah ? " Status dikembalikan ke Draft karena datanya berubah — submit ulang untuk diproses kembali." : ""}</span></div>
      <div class="form-actions"><button class="btn btn-primary" id="pf6-close">Lihat Daftar Pengajuan</button></div>`;
    openModal();
    $("#pf6-close").onclick = () => { closeModal(); pumEditingRow = null; go("pum"); };
    return;
  }

  const newRow = {
    _id: pumRows.length ? Math.max(...pumRows.map(r => r._id)) + 1 : 0,
    kpa, nrp: $("#pf-nrp").value.trim() || pfFound.nrp, npwp: pfFound.npwp,
    nama: $("#pf-nama").value.trim() || pfFound.nama, angkatan: pfFound.angkatan,
    tglAmbil: fmtTglHariIni(), tipePum: pfTipePum, tipeRumah,
    status: "Draft", jumlah: pf4PlafonNominal(),
    detail: snap, raw
  };
  pumRows.push(newRow);
  renderPum(); renderApproval();

  $("#modal-title").textContent = "Draft pengajuan tersimpan";
  $("#modal-sub").textContent   = `${newRow.kpa} — ${newRow.nama}`;
  $("#modal-body").innerHTML = `
    <div class="alert alert-ok"><span>✓</span><span>Pengajuan KPR (PUM) tipe ${esc(pfTipePum)} tersimpan sebagai draft di Daftar Pengajuan KPR (PUM). Gunakan tombol Submit pada daftar untuk mengirimkannya.</span></div>
    <div class="metrics m3" style="margin-bottom:4px">
      <div class="metric"><div class="metric-lbl">KPA</div><div class="metric-val" style="font-size:14px">${esc(newRow.kpa)}</div></div>
      <div class="metric"><div class="metric-lbl">Jumlah PUM</div><div class="metric-val" style="font-size:14px">${rp(newRow.jumlah)}</div></div>
      <div class="metric"><div class="metric-lbl">Status</div><div class="metric-val" style="font-size:14px">Draft</div></div>
    </div>
    <div class="form-actions"><button class="btn btn-primary" id="pf6-close">Lihat Daftar Pengajuan</button></div>`;
  openModal();
  $("#pf6-close").onclick = () => { closeModal(); go("pum"); };
}

$("#pf6-submit").onclick = pf6BukaPernyataan;

/* ================================================================= APPROVAL PUM KPR */
let apPage = 1;

function tipePumPillClass(tipe) {
  return tipe === "Kredit Rumah" ? "pill-info"
       : tipe === "Pembelian Rumah Secara Mandiri" ? "pill-ok"
       : tipe === "Membangun Rumah" ? "pill-warn" : "pill-info";
}

/* Label status untuk tabel & filter Approval KPR (PUM) — status internal
   (Submitted/Disetujui/Ditolak/Draft) ditampilkan sebagai Tertunda/Diterima/
   Ditolak/Tertunda supaya konsisten dengan istilah di halaman approval lain. */
function statusApprovalLabel(s) {
  return s === "Disetujui" ? "Diterima" : s === "Ditolak" ? "Ditolak" : "Tertunda";
}

function renderApproval() {
  const fKta  = ($("#ap-f-kta").value  || "").toLowerCase();
  const fNpwp = ($("#ap-f-npwp").value || "").toLowerCase();
  const fNama = ($("#ap-f-nama").value || "").toLowerCase();
  const fNrp  = ($("#ap-f-nrp").value  || "").toLowerCase();
  const fSt   = $("#ap-filter").value;

  const rows = pumRows.filter(r =>
    (fSt === "all" || r.status === fSt) &&
    (!fKta  || r.kpa.toLowerCase().includes(fKta))   &&
    (!fNpwp || r.npwp.toLowerCase().includes(fNpwp)) &&
    (!fNama || r.nama.toLowerCase().includes(fNama)) &&
    (!fNrp  || r.nrp.toLowerCase().includes(fNrp)));

  const pageSize   = +$("#ap-page-size").value;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  if (apPage > totalPages) apPage = totalPages;
  const start     = (apPage - 1) * pageSize;
  const pageRows  = rows.slice(start, start + pageSize);

  $("#ap-body").innerHTML = pageRows.length ? pageRows.map(r => `
    <tr>
      <td class="t-strong">${esc(r.kpa)}</td><td>${esc(r.nrp)}</td><td>${esc(r.npwp)}</td>
      <td class="t-name">${esc(r.nama)}</td><td>${esc(r.angkatan)}</td><td>${esc(r.tglAmbil)}</td>
      <td><span class="pill ${tipePumPillClass(r.tipePum)}">${esc(r.tipePum)}</span></td>
      <td>${rp(r.jumlah)}</td>
      <td><span class="pill ${pillPum(r.status)}">${esc(statusApprovalLabel(r.status))}</span></td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-info btn-sm"         data-ap-detail="${r._id}">Detail</button>
        <button class="btn btn-danger-solid btn-sm" data-ap-hapus="${r._id}">Hapus</button>
      </td>
    </tr>`).join("")
    : `<tr><td colspan="10"><div class="empty"><h4>Tidak ada pengajuan</h4><p>Coba ubah filter atau kata kunci pencarian.</p></div></td></tr>`;

  const shownFrom = rows.length ? start + 1 : 0;
  const shownTo   = Math.min(start + pageSize, rows.length);
  $("#ap-count").textContent = `Menampilkan ${shownFrom}-${shownTo} dari ${rows.length}`;

  $("#ap-pagination").innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
    <button class="btn ${p === apPage ? "btn-primary" : "btn-ghost"} btn-sm" style="min-width:30px;padding:0" data-ap-page="${p}">${p}</button>
  `).join("");
}

["#ap-f-kta", "#ap-f-npwp", "#ap-f-nama", "#ap-f-nrp"].forEach(sel => $(sel).oninput = () => { apPage = 1; renderApproval(); });
$("#ap-filter").onchange    = () => { apPage = 1; renderApproval(); };
$("#ap-page-size").onchange = () => { apPage = 1; renderApproval(); };

document.addEventListener("click", e => {
  const bPage = e.target.closest("[data-ap-page]");
  if (bPage) { apPage = +bPage.dataset.apPage; renderApproval(); return; }

  const bApDetail = e.target.closest("[data-ap-detail]");
  if (bApDetail) {
    pumDetailRow        = pumRows.find(x => x._id === +bApDetail.dataset.apDetail);
    pumDetailContext    = "approval";
    pumDetailBackTarget = "approval-pum";
    renderPumDetailPage();
    go("pum-detail");
    return;
  }

  const bApHapus = e.target.closest("[data-ap-hapus]");
  if (bApHapus) {
    const id = +bApHapus.dataset.apHapus;
    const r  = pumRows.find(x => x._id === id);
    if (!confirm(`Hapus pengajuan KPR (PUM) atas nama ${r.nama}?`)) return;
    pumRows = pumRows.filter(x => x._id !== id);
    renderApproval();
    renderPum();
    toast(`Pengajuan ${r.nama} dihapus.`, "bad");
  }
});

/* ------------------------------------------- halaman Detail Pengajuan KPR (PUM) */
let pumDetailRow        = null;
let pumDetailContext    = "view";   // "view" (dari Pengelolaan KPR (PUM)) | "approval" (dari Approval KPR (PUM))
let pumDetailBackTarget = "pum";

function renderPumDetailPage() {
  const r = pumDetailRow;
  if (!r) return;

  $("#pd-title").textContent = r.nama;
  $("#pd-sub").textContent   = `${r.kpa} · ${r.nrp}`;
  $("#pd-badge").textContent = `TIPE: ${(r.tipePum || "-").toUpperCase()}`;
  $("#pd-crumb-module").textContent = pumDetailContext === "approval" ? "Approval KPR (PUM)" : "Pengelolaan KPR (PUM)";

  /* Tombol Setujui/Tolak/Revisi hanya tampil dari halaman Approval, dan
     dibatasi per role: Divisi Kepesertaan → Tolak/Revisi/Setujui,
     PIC UNOR/Kesatuan & Kantor Cabang → hanya memantau status pengajuan. */
  if (pumDetailContext === "approval") {
    const role = roleSaatIni();
    $("#pd-actions").innerHTML =
        role === ROLE_DIVISI ? `<button class="btn btn-danger-solid" id="pd-tolak">✕ Tolak</button>
                                <button class="btn btn-gold" id="pd-revisi-divisi">↺ Revisi</button>
                                <button class="btn btn-success" id="pd-setuju">✓ Setujui</button>`
      :                        `<span class="hint" style="margin:0">Role ${esc(role)} hanya dapat memantau status pengajuan.</span>`;
  } else {
    $("#pd-actions").innerHTML = "";
  }

  const basicFields = [
    { label:"KPA", value: r.kpa }, { label:"NRP/NIP", value: r.nrp },
    { label:"NPWP", value: r.npwp }, { label:"Angkatan", value: r.angkatan },
    { label:"Tanggal Ambil PUM", value: r.tglAmbil }, { label:"Status", value: r.status },
    { label:"Tipe PUM", value: r.tipePum }, { label:"Tipe Rumah", value: r.tipeRumah },
    { label:"Jumlah Ambil PUM", value: rp(r.jumlah) }
  ];

  /* Muncul selama status masih "Revisi" (dikembalikan lewat tombol "Revisi"
     di Approval, dengan catatan penolakan tersimpan) — supaya PIC UNOR/
     Kesatuan tahu apa yang perlu diperbaiki sebelum submit ulang. Hilang lagi
     otomatis begitu statusnya berubah (diedit ulang jadi Draft, atau sudah
     disubmit ulang). */
  const detailRevisiHtml = (r.status === "Revisi" && r.catatanApproval)
    ? `<div class="subsection-title">Detail Revisi</div>
       <div class="alert alert-warn" style="margin-bottom:18px"><span>↺</span><span>${esc(r.catatanApproval)}</span></div>`
    : "";

  if (!r.detail) {
    $("#pd-body").innerHTML = `
      ${detailRevisiHtml}
      <div class="subsection-title">Data Peserta</div>
      <div class="grid3" style="grid-template-columns:1fr 1fr">${fieldsToHtml(basicFields)}</div>
      <div class="alert alert-info" style="margin-top:18px"><span>ⓘ</span><span>Rincian lengkap (Data Kepangkatan, Detail Pengajuan, Dokumen Terunggah) belum tersedia untuk pengajuan ini karena dibuat sebelum formulir pengajuan lengkap tersedia di sistem.</span></div>`;
    return;
  }

  const d = r.detail;
  $("#pd-body").innerHTML = `
    ${detailRevisiHtml}
    <div class="subsection-title">Data Peserta</div>
    <div class="grid3" style="grid-template-columns:1fr 1fr">${fieldsToHtml(d.dataPeserta)}</div>

    <div class="subsection-title">Riwayat Kepangkatan Peserta</div>
    ${(d.riwayatDb || []).length
      ? `<div class="tbl-wrap"><table><thead><tr><th>No</th><th>Pangkat</th><th>Nomor SKEP Pengangkatan</th><th>TMT Pengangkatan</th><th>Tanggal SKEP Pengangkatan</th></tr></thead><tbody>${
          d.riwayatDb.map((r2, i) => `<tr><td>${i + 1}</td><td>${esc(r2.pangkat)}</td><td>${esc(r2.nomorSkep)}</td><td>${esc(fmtTgl(r2.tmt))}</td><td>${esc(fmtTgl(r2.tglSkep))}</td></tr>`).join("")
        }</tbody></table></div>`
      : `<div class="hint" style="margin:0">Tidak ada riwayat kepangkatan pada sistem kepesertaan untuk peserta ini.</div>`}

    <div class="subsection-title">Update Kepangkatan Peserta</div>
    <div style="margin-top:14px">
      ${d.riwayat.length ? d.riwayat.map((fields, i) => `
        <div style="${i === d.riwayat.length - 1 ? "" : "margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--line-soft)"}">
          <div class="t-strong" style="font-size:12px;margin-bottom:8px">Update Kepangkatan Peserta #${i + 1}</div>
          <div class="grid3" style="grid-template-columns:1fr 1fr">${fieldsToHtml(fields)}</div>
        </div>`).join("") : `<div class="hint" style="margin:0">Belum ada update kepangkatan peserta ditambahkan.</div>`}
    </div>

    <div class="subsection-title">Tipe KPR (PUM)</div>
    <span class="pill pill-info" style="font-size:12px">${esc(d.tipePum)}</span>

    <div class="subsection-title">Detail Pengajuan - ${esc(d.tipePum)}</div>
    ${d.detailGroups.map(g => `
      <div class="hint" style="margin:14px 0 10px;font-weight:600;color:var(--body)">${esc(g.title)}</div>
      <div class="grid3" style="grid-template-columns:1fr 1fr">${fieldsToHtml(g.fields)}</div>`).join("")}

    <div class="subsection-title">Dokumen Terunggah</div>
    ${dokumenToHtml(d.dokumen)}`;
}

$("#pd-kembali-atas").onclick = () => go(pumDetailBackTarget);
$("#pd-kembali").onclick      = () => go(pumDetailBackTarget);

document.addEventListener("click", e => {
  /* ---- Detail (dari Pengelolaan KPR (PUM) — tanpa aksi approval) ---- */
  const bDetail = e.target.closest("[data-pum-detail]");
  if (bDetail) {
    pumDetailRow        = pumRows.find(x => x._id === +bDetail.dataset.pumDetail);
    pumDetailContext    = "view";
    pumDetailBackTarget = "pum";
    renderPumDetailPage();
    go("pum-detail");
    return;
  }

  /* ---- Setujui / Tolak / Revisi (dari halaman Detail, context approval) ---- */
  if (e.target.closest("#pd-setuju")) {
    $("#modal-title").textContent = "Konfirmasi Persetujuan";
    $("#modal-sub").textContent   = `${pumDetailRow.kpa} — ${pumDetailRow.nama}`;
    $("#modal-body").innerHTML = `
      <div class="field">
        <label class="fl">Alasan Menyetujui (Opsional)</label>
        <textarea class="inp" id="pd-alasan-setuju" style="height:90px;padding:9px 10px;resize:vertical" placeholder="Tuliskan catatan persetujuan (opsional)"></textarea>
      </div>
      <div class="form-actions">
        <button class="btn btn-ghost" id="pd-setuju-batal">Batal</button>
        <button class="btn btn-success" id="pd-setuju-konfirmasi">✓ Setujui</button>
      </div>`;
    openModal();
    $("#pd-setuju-batal").onclick = closeModal;
    $("#pd-setuju-konfirmasi").onclick = () => {
      pumDetailRow.status = "Disetujui";
      pumDetailRow.catatanApproval = $("#pd-alasan-setuju").value.trim();
      closeModal();
      renderApproval(); renderPum();
      toast(`Pengajuan ${pumDetailRow.nama} disetujui.`, "ok");
      go(pumDetailBackTarget);
    };
    return;
  }
  if (e.target.closest("#pd-tolak")) {
    $("#modal-title").textContent = "Konfirmasi Penolakan";
    $("#modal-sub").textContent   = `${pumDetailRow.kpa} — ${pumDetailRow.nama}`;
    $("#modal-body").innerHTML = `
      <div class="field">
        <label class="fl">Alasan Menolak <span class="req">*</span></label>
        <textarea class="inp" id="pd-alasan-tolak" style="height:90px;padding:9px 10px;resize:vertical" placeholder="Tuliskan alasan penolakan"></textarea>
      </div>
      <div class="form-actions">
        <button class="btn btn-ghost" id="pd-tolak-batal">Batal</button>
        <button class="btn btn-danger-solid" id="pd-tolak-konfirmasi">✕ Tolak</button>
      </div>`;
    openModal();
    $("#pd-tolak-batal").onclick = closeModal;
    $("#pd-tolak-konfirmasi").onclick = () => {
      const alasan = $("#pd-alasan-tolak").value.trim();
      if (!alasan) { toast("Alasan menolak wajib diisi.", "bad"); return; }
      pumDetailRow.status = "Ditolak";
      pumDetailRow.catatanApproval = alasan;
      closeModal();
      renderApproval(); renderPum();
      toast(`Pengajuan ${pumDetailRow.nama} ditolak.`, "bad");
      go(pumDetailBackTarget);
    };
    return;
  }
  if (e.target.closest("#pd-revisi-divisi")) {
    $("#modal-title").textContent = "Revisi Pengajuan KPR (PUM)";
    $("#modal-sub").textContent   = `${pumDetailRow.kpa} — ${pumDetailRow.nama}`;
    $("#modal-body").innerHTML = `
      <div class="field">
        <label class="fl">Detail Revisi <span class="req">*</span></label>
        <textarea class="inp" id="pd-detail-revisi" style="height:90px;padding:9px 10px;resize:vertical" placeholder="Jelaskan bagian yang perlu diperbaiki oleh PIC UNOR/Kesatuan"></textarea>
      </div>
      <div class="form-actions">
        <button class="btn btn-ghost" id="pd-revisi-divisi-batal">Batal</button>
        <button class="btn btn-gold" id="pd-revisi-divisi-simpan">↺ Simpan Revisi</button>
      </div>`;
    openModal();
    $("#pd-revisi-divisi-batal").onclick = closeModal;
    $("#pd-revisi-divisi-simpan").onclick = () => {
      const detailRevisi = $("#pd-detail-revisi").value.trim();
      if (!detailRevisi) { toast("Detail Revisi wajib diisi.", "bad"); return; }
      pumDetailRow.status = "Revisi";
      pumDetailRow.catatanApproval = detailRevisi;
      pumDetailRow.tglRevisi = new Date().toISOString();
      closeModal();
      renderApproval(); renderPum();
      toast(`Pengajuan ${pumDetailRow.nama} dikembalikan ke PIC UNOR/Kesatuan untuk direvisi.`, "bad");
      go(pumDetailBackTarget);
    };
    return;
  }
  /* ---- Ubah (buka ulang wizard Pengajuan KPR (PUM), terisi dengan data yang ada) ---- */
  const bUbah = e.target.closest("[data-pum-ubah]");
  if (bUbah) {
    const id = +bUbah.dataset.pumUbah;
    const r  = pumRows.find(x => x._id === id);
    openEditWizard(r);
    return;
  }

  /* ---- Hapus ---- */
  const bHapus = e.target.closest("[data-pum-hapus]");
  if (bHapus) {
    const id = +bHapus.dataset.pumHapus;
    const r  = pumRows.find(x => x._id === id);
    if (!confirm(`Hapus pengajuan KPR (PUM) atas nama ${r.nama}?`)) return;
    pumRows = pumRows.filter(x => x._id !== id);
    renderPum(); renderApproval();
    toast(`Pengajuan ${r.nama} dihapus.`, "bad");
    return;
  }

  /* ---- Submit (baris ini langsung muncul di Approval KPR (PUM) begitu statusnya Submitted) ---- */
  const bSubmit = e.target.closest("[data-pum-submit]");
  if (bSubmit) {
    const id = +bSubmit.dataset.pumSubmit;
    const r  = pumRows.find(x => x._id === id);
    if (r.status !== "Draft" && r.status !== "Revisi") { toast(`Pengajuan ${r.nama} sudah pernah disubmit.`); return; }
    r.status = "Submitted";
    renderPum(); renderApproval();
    toast(`Pengajuan ${r.nama} berhasil disubmit dan masuk ke Approval KPR (PUM).`, "ok");
  }
});

/* =============================================================== PELUNASAN */
/* Satu baris = satu peserta yang KPR (PUM)-nya jatuh tempo. Daftar & filter
   mengikuti pola halaman Approval KPR (PUM); keputusan Setujui/Tolak diambil
   per peserta di halaman Detail Pelunasan KPR (PUM). */
const pillPel = s => s === "Disetujui" ? "pill-ok" : s === "Ditolak" ? "pill-bad" : "pill-warn";
let pelRows   = DATA_PELUNASAN.map((r, i) => ({ ...r, _id: i }));
let pelNextId = pelRows.length;
let pelPage   = 1;

/* Integrasi Approval KPR (PUM) → Pelunasan KPR (PUM): pengajuan yang sudah
   Disetujui otomatis masuk begitu Tanggal Akhir Kredit-nya tercapai. */
function cekJatuhTempoPelunasan() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const jatuhTempo = pumRows.filter(r =>
    r.status === "Disetujui" && r.tglAkhirKredit && !r.masukPelunasan && r.tglAkhirKredit <= todayIso);
  if (!jatuhTempo.length) return;

  jatuhTempo.forEach(r => {
    const d = new Date(r.tglAkhirKredit);
    const tglJatuhTempo = `${HARI_ID[d.getDay()]}, ${fmtTgl(r.tglAkhirKredit)}`;
    pelRows.unshift({
      _id: pelNextId++, kpa: r.kpa, nrp: r.nrp, npwp: r.npwp, nama: r.nama,
      angkatan: r.angkatan, uker: extractDetailField(r, "UKER") || "-", cabang: r.kancab || "-",
      tglAmbil: r.tglAmbil, tipePum: r.tipePum, tipeRumah: r.tipeRumah, jumlah: r.jumlah,
      tglAkhirKredit: tglJatuhTempo, periode: `${BULAN_ID[d.getMonth()]} ${d.getFullYear()}`,
      tglPelunasan: tglJatuhTempo, sisaPiutang: r.jumlah, jumlahDilunasi: r.jumlah,
      caraPelunasan: "Otomatis — jatuh tempo", status: "Pending", catatan: ""
    });
    r.masukPelunasan = true;
  });
  pelPage = 1;
  renderPel();
  toast(`${jatuhTempo.length} pengajuan KPR (PUM) jatuh tempo — masuk ke Pelunasan KPR (PUM).`, "ok");
}

function renderPel() {
  const rows = pelRows;

  const pageSize   = +$("#pel-page-size").value;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  if (pelPage > totalPages) pelPage = totalPages;
  const start    = (pelPage - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  $("#pel-body").innerHTML = pageRows.length ? pageRows.map(r => `
    <tr>
      <td class="t-strong">${esc(r.kpa)}</td><td>${esc(r.nrp)}</td><td>${esc(r.npwp)}</td>
      <td class="t-name">${esc(r.nama)}</td><td>${esc(r.angkatan)}</td><td>${esc(r.tglAmbil)}</td>
      <td><span class="pill ${tipePumPillClass(r.tipePum)}">${esc(r.tipePum)}</span></td>
      <td>${rp(r.jumlah)}</td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-info btn-sm"         data-pel-detail="${r._id}">Detail</button>
        <button class="btn btn-danger-solid btn-sm" data-pel-hapus="${r._id}">Hapus</button>
      </td>
    </tr>`).join("")
    : `<tr><td colspan="9"><div class="empty"><h4>Tidak ada data pelunasan</h4></div></td></tr>`;

  const shownFrom = rows.length ? start + 1 : 0;
  const shownTo   = Math.min(start + pageSize, rows.length);
  $("#pel-count").textContent = `Menampilkan ${shownFrom}-${shownTo} dari ${rows.length}`;

  $("#pel-pagination").innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
    <button class="btn ${p === pelPage ? "btn-primary" : "btn-ghost"} btn-sm" style="min-width:30px;padding:0" data-pel-page="${p}">${p}</button>
  `).join("");
}

$("#pel-page-size").onchange = () => { pelPage = 1; renderPel(); };
$("#btn-export-pel").onclick = () => toast("Laporan pelunasan KPR (PUM) diekspor ke Excel.");

/* --------------------------------------- halaman Detail Pelunasan KPR (PUM) */
let pelDetailRow = null;

function renderPelDetailPage() {
  const r = pelDetailRow;
  if (!r) return;

  $("#peld-title").textContent  = r.nama;
  $("#peld-sub").textContent    = `${r.kpa} · ${r.nrp}`;

  $("#peld-body").innerHTML = `
    <div class="metrics" style="grid-template-columns:1fr">
      <div class="metric"><div class="metric-lbl">Jumlah dilunasi</div><div class="metric-val">${rp(r.jumlahDilunasi)}</div></div>
    </div>

    <div class="subsection-title">Data Peserta</div>
    <div class="grid3" style="grid-template-columns:1fr 1fr">${fieldsToHtml([
      { label: "KPA", value: r.kpa }, { label: "NRP/NIP", value: r.nrp },
      { label: "NPWP", value: r.npwp }, { label: "Nama Peserta", value: r.nama },
      { label: "Angkatan", value: r.angkatan }, { label: "UKER/Kesatuan", value: r.uker },
      { label: "Kantor Cabang", value: r.cabang }
    ])}</div>

    <div class="subsection-title">Data KPR (PUM)</div>
    <div class="grid3" style="grid-template-columns:1fr 1fr">${fieldsToHtml([
      { label: "Tipe PUM", value: r.tipePum }, { label: "Tipe Rumah", value: r.tipeRumah },
      { label: "Tanggal Ambil PUM", value: r.tglAmbil },
      { label: "Jumlah Ambil PUM", value: rp(r.jumlah) }
    ])}</div>

    <div class="subsection-title">Rincian Pelunasan</div>
    <div class="grid3" style="grid-template-columns:1fr 1fr">${fieldsToHtml([
      { label: "Tanggal Pelunasan", value: r.tglPelunasan },
      { label: "Jumlah Dilunasi", value: rp(r.jumlahDilunasi) }
    ])}</div>`;
}

document.addEventListener("click", e => {
  const bPage = e.target.closest("[data-pel-page]");
  if (bPage) { pelPage = +bPage.dataset.pelPage; renderPel(); return; }

  const bDetail = e.target.closest("[data-pel-detail]");
  if (bDetail) {
    pelDetailRow = pelRows.find(x => x._id === +bDetail.dataset.pelDetail);
    renderPelDetailPage();
    go("pelunasan-detail");
    return;
  }

  const bHapus = e.target.closest("[data-pel-hapus]");
  if (bHapus) {
    const id = +bHapus.dataset.pelHapus;
    const r  = pelRows.find(x => x._id === id);
    if (!confirm(`Hapus data pelunasan KPR (PUM) atas nama ${r.nama}?`)) return;
    pelRows = pelRows.filter(x => x._id !== id);
    renderPel();
    toast(`Data pelunasan ${r.nama} dihapus.`, "bad");
    return;
  }

});

$("#peld-kembali").onclick      = () => go("pelunasan");
$("#peld-kembali-atas").onclick = () => go("pelunasan");

/* ======================================================== JALANKAN PERTAMA
   Sisa daftar yang belum digambar dari blok masing-masing, supaya layar mana
   pun langsung berisi begitu dipilih dari sidebar.                        */
$("#top-role").onchange = () => {
  toast(`Role diubah ke: ${roleSaatIni()}.`);
  renderPum();
  renderApproval();
  renderPel();
};
$("#top-avatar").textContent = PENGATURAN.inisialUser;

isiPilihanKesatuan();
renderPum();
renderApproval();
renderWizard();
renderRiwayat();
renderPel();
go("pum");
