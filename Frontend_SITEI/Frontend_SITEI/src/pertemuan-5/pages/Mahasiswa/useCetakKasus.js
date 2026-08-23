import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

// ─── Konstanta Halaman ───────────────────────────────────────────

const PW     = 210;   // A4 Portrait width  mm
const PH     = 297;   // A4 Portrait height mm
const ML     = 20;    // margin left
const MR     = 20;    // margin right
const MT     = 15;    // margin top
const CW     = PW - ML - MR; // content width = 170mm

// ─── Warna (hitam-putih formal) ──────────────────────────────────

const BLACK  = [0,   0,   0  ];
const WHITE  = [255, 255, 255];
const GRAY10 = [230, 230, 230]; // garis tabel
const GRAY20 = [200, 200, 200]; // border box
const GRAY50 = [120, 120, 120]; // teks sekunder
const GRAY90 = [245, 245, 245]; // background header tabel

// ─── Helper: Format Tanggal ──────────────────────────────────────

const fmtLong = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

const fmtShort = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

// ─── Helper: QR Code DataURL ─────────────────────────────────────

const makeQR = async (text) => {
    try {
        return await QRCode.toDataURL(text, {
            width: 100, margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
        });
    } catch { return null; }
};

// ─── Helper: Garis horisontal ────────────────────────────────────

const hline = (doc, y, x1 = ML, x2 = PW - MR, w = 0.3) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(w);
    doc.line(x1, y, x2, y);
};

// ─── Helper: Garis tebal (double rule) ──────────────────────────

const hlineThick = (doc, y) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.8);
    doc.line(ML, y, PW - MR, y);
};

// ── NEW ── Definisi kelompok kompetensi kurikulum
// (disalin dari RiwayatKasus.jsx agar file ini tetap mandiri
//  dan tidak perlu mengubah RiwayatKasus.jsx)

const subTindakanAnestesiUtama = [
    "Anestesi Bedah Elektif", "Anestesi Bedah Darurat", "Anestesi Umum", "Anestesi / Analgesia Regional",
    "Teknik Anestesi / Analgesia Subarakhnoid", "Teknik Anestesi / Analgesia Epidural",
    "Teknik Anestesi / Analgesia Blok Saraf Tepi Basic", "Teknik Anestesi / Analgesia Kaudal"
];
const subAnestesiBedahUmum = [
    "Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate", "Anestesi Bedah Umum Digestif",
    "Anestesi Bedah Umum THT dan Bedah Mulut", "Anestesi Bedah Umum Mata", "Anestesi Bedah Umum Urologi",
    "Anestesi Bedah Umum Ortopedi", "Anestesi Bedah Umum Plastik", "Anestesi Bedah Umum Onkologi",
    "Anestesi Bedah Umum Minimal Invasif", "Anestesi / Analgesia Rawat Jalan",
    "Anestesi / Analgesia diluar kamar operasi", "Lain-lain (dapat berupa kompetensi diatas)"
];
const groupKompetensiDasarUtama = [...subTindakanAnestesiUtama, ...subAnestesiBedahUmum];
const subManajemenNyeri = ["Manajemen Nyeri akut", "Manajemen Nyeri kronik", "Manajemen Nyeri paliatif", "Interventional Pain Management"];
const subObstetriGinekologi = ["Anestesi dan analgesia Obstetri dan Ginekologi Pre-eklamsi dan eklamsi", "Lain-lain (operasi selain eklamsi dan pre-eklamsi)"];
const subBedahSaraf = ["Anestesi Bedah Saraf Trauma kepala", "Perdarahan intracranial non-trauma", "Tumor intrakranial", "Ventricular drainage (VP shunt, EVD)", "Medula spinalis"];
const subKondisiKhususLanjut = [
    "Anestesi Bedah Thoraks Non Jantung dan Jantung Terbuka", "Anestesi pada Kondisi khusus Kelainan jantung pada operasi non jantung",
    "Anestesi pada Kondisi khusus COPD / asma", "Anestesi pada Kondisi khusus DM", "Anestesi pada Kondisi khusus Tiroid",
    "Anestesi pada Kondisi khusus Geriatri", "Anestesi pada Kondisi khusus Obesitas", "Mengelola pasien ICU (10 variasi kasus)",
    "Melakukan resusitasi di luar kamar bedah dan ICU", "Memasang kateter intra-arterial dan pungsi intra-arterial",
    "Memasang kateter vena central", "Melakukan intubasi sulit", "Anestesi Bedah Pediatri Neonatus", "Anestesi Bedah Pediatri Bayi", "Anestesi Bedah Pediatri Anak-anak"
];

const KURIKULUM_GROUPS = [
    { arr: groupKompetensiDasarUtama, target: 1015, label: 'Kompetensi Dasar' },
    { arr: subAnestesiBedahUmum,       target: 620,  label: 'Anestesi Bedah Umum' },
    { arr: subManajemenNyeri,          target: 130,  label: 'Manajemen Nyeri' },
    { arr: subObstetriGinekologi,      target: 100,  label: 'Obstetri & Ginekologi' },
    { arr: subBedahSaraf,              target: 35,   label: 'Anestesi Bedah Saraf' },
    { arr: subKondisiKhususLanjut,     target: 35,   label: 'Kompetensi Lanjut' },
];

const getGroupedCasesCount = (casesArr, arrFilter) =>
    casesArr.filter(c => c.status === 'verified' && arrFilter.includes(c.tindakan)).length;

// ─────────────────────────────────────────────────────────────────
//  FUNGSI UTAMA
// ─────────────────────────────────────────────────────────────────

/**
 * @param {Object} opts
 * @param {Array}  opts.cases          — kasus verified dalam rentang tanggal
 * @param {Object} opts.resident       — { name, identifier, department, batch? }
 * @param {Object} opts.konsulen       — { name, identifier }
 * @param {string} opts.tanggalDari    — 'YYYY-MM-DD'
 * @param {string} opts.tanggalSampai  — 'YYYY-MM-DD'
 * @param {Array}  [opts.allCasesForProgress] — NEW, opsional. Jika ingin box
 *        progres kurikulum menghitung dari SELURUH kasus (kumulatif, seperti
 *        di dashboard) bukan hanya kasus yang dicetak, kirim array `cases`
 *        penuh (sebelum difilter tanggal) di parameter ini. Jika tidak
 *        dikirim, box progres akan dihitung dari `cases` (kasus yang dicetak).
 */
export const cetakKasusPDF = async ({
    cases                = [],
    resident              = {},
    konsulen              = {},
    tanggalDari            = '',
    tanggalSampai          = '',
    allCasesForProgress    = null, // NEW — opsional
}) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Halaman 1 — Cover + Ringkasan Identitas
    await drawCoverPage(doc, {
        cases, resident, konsulen, tanggalDari, tanggalSampai,
        progressCases: allCasesForProgress || cases, // NEW
    });

    // Halaman 2+ — Tabel Detail Kasus
    doc.addPage();
    await drawTablePages(doc, { cases, resident, konsulen, tanggalDari, tanggalSampai });

    const safeName = (resident.identifier || 'residen').replace(/[\s/\\]/g, '_');
    doc.save(`Logbook_${safeName}_${tanggalDari}_sd_${tanggalSampai}.pdf`);
};

// ─────────────────────────────────────────────────────────────────
//  HALAMAN 1 — COVER IDENTITAS
// ─────────────────────────────────────────────────────────────────

async function drawCoverPage(doc, { cases, resident, konsulen, tanggalDari, tanggalSampai, progressCases }) {

    // ── KOP INSTITUSI ──────────────────────────────────────────────
    // Garis tebal atas
    doc.setFillColor(...BLACK);
    doc.rect(ML, MT, CW, 0.8, 'F');

    // Nama institusi
    const kopY = MT + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI', PW / 2, kopY, { align: 'center' });

    doc.setFontSize(12);
    doc.text('UNIVERSITAS RIAU — FAKULTAS KEDOKTERAN', PW / 2, kopY + 6, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('PROGRAM STUDI ANESTESIOLOGI DAN TERAPI INTENSIF', PW / 2, kopY + 12, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY50);
    doc.text(
        'Kampus Bina Widya Km. 12,5 Simpang Baru Pekanbaru 28293  ·  Telepon (0761) 66596',
        PW / 2, kopY + 17.5, { align: 'center' }
    );

    // Garis tebal bawah kop (double rule seperti contoh)
    doc.setTextColor(...BLACK);
    doc.setFillColor(...BLACK);
    doc.rect(ML, kopY + 21, CW, 0.8, 'F');
    doc.setLineWidth(0.2);
    doc.line(ML, kopY + 23, PW - MR, kopY + 23);

    // ── JUDUL DOKUMEN ──────────────────────────────────────────────
    const judulY = kopY + 32;

    // Kotak judul + nomor form (mirip KPTI-2)
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.rect(ML, judulY - 6, CW, 12, 'S');

    // Divider vertikal sebelum kode form
    doc.line(ML + 120, judulY - 6, ML + 120, judulY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BLACK);
    doc.text('LOGBOOK KASUS KLINIS RESIDEN', ML + 60, judulY + 1.5, { align: 'center' });

    doc.setFontSize(9);
    doc.text('MEDLOG-KK', ML + 145, judulY + 1.5, { align: 'center' });

    // ── BAGIAN A — IDENTITAS RESIDEN ──────────────────────────────
    const aY = judulY + 18;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...BLACK);
    doc.text('A.  Identitas Residen', ML, aY);

    hline(doc, aY + 3);

    // Tabel identitas 2 kolom (label : value)
    const identData = [
        ['Nama Lengkap',     resident.name        || '—'],
        ['NIM / Identifier', resident.identifier   || '—'],
        ['Program Studi',    resident.department   || 'Anestesiologi dan Terapi Intensif'],
        ['Konsulen / DPJP',  konsulen.name         || '—'],
    ];

    let iy = aY + 9;
    const labelW = 50;
    const valueX = ML + labelW + 6;

    identData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...GRAY50);
        doc.text(label, ML + 4, iy);

        doc.text(':', ML + labelW, iy);

        doc.setTextColor(...BLACK);
        doc.setFont('helvetica', 'bold');
        doc.text(value, valueX, iy);

        hline(doc, iy + 2, ML, PW - MR, 0.15);
        iy += 8;
    });

    // ── BAGIAN B — PERIODE & RINGKASAN ────────────────────────────
    const bY = iy + 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...BLACK);
    doc.text('B.  Periode Laporan', ML, bY);

    hline(doc, bY + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY50);
    doc.text('Dari Tanggal', ML + 4, bY + 10);
    doc.text(':', ML + labelW, bY + 10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLACK);
    doc.text(fmtLong(tanggalDari), valueX, bY + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY50);
    doc.text('Sampai Tanggal', ML + 4, bY + 18);
    doc.text(':', ML + labelW, bY + 18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLACK);
    doc.text(fmtLong(tanggalSampai), valueX, bY + 18);

    hline(doc, bY + 22, ML, PW - MR, 0.15);

    const cY = bY + 30;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...BLACK);
    doc.text('C.  Ringkasan Jumlah Kasus & Urgensi', ML, cY);

    hline(doc, cY + 3);

    // Ambil data kalkulasi statistik kasus
    const totalKasus    = cases.length;
    const totalElektif  = cases.filter(c => c.urgensi === 'E').length;
    const totalNonElek  = cases.filter(c => c.urgensi === 'N').length;
    const totalLainnya  = totalKasus - totalElektif - totalNonElek;

    // Menghitung rasio persentase secara aman (mencegah Division by Zero jika data 0)
    const pctElektif    = totalKasus > 0 ? Math.round((totalElektif / totalKasus) * 100) : 0;
    const pctNonElek    = totalKasus > 0 ? Math.round((totalNonElek / totalKasus) * 100) : 0;

    // Mengatur lebar kotak menjadi 4 kolom yang presisi memenuhi batas margin (CW = 170mm)
    // Kolom 1: Total Kasus Utama, Kolom 2: Elektif, Kolom 3: Non-Elektif, Kolom 4: Unspecified/Lainnya
    const statBoxW = (CW / 4) - 2; // ~40.5mm per kotak
    const statBoxY = cY + 6;
    const statBoxH = 20; // Sedikit dinaikkan tingginya untuk menampung sub-teks persentase

    const statItems = [
        { label: 'TOTAL KASUS',  val: totalKasus,   sub: 'Logbook Masuk' },
        { label: 'ELEKTIF',      val: totalElektif, sub: `${pctElektif}% Dari Total` },
        { label: 'NON-ELEKTIF',  val: totalNonElek, sub: `${pctNonElek}% Dari Total` },
        { label: 'LAIN-LAIN',    val: totalLainnya, sub: 'Stase Luar / ICU' },
    ];

    statItems.forEach((s, i) => {
        // Jarak renggang antar kotak dihitung dinamis (lebar + gap)
        const bx = ML + i * (statBoxW + 2.65);
        
        // Menggambar kotak border formal (Steril dari border hitam tebal, menggunakan w = 0.35)
        doc.setDrawColor(...BLACK);
        doc.setLineWidth(0.35);
        doc.rect(bx, statBoxY, statBoxW, statBoxH, 'S');

        // Render Angka Utama (Besar & Tebal)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(...BLACK);
        doc.text(String(s.val), bx + statBoxW / 2, statBoxY + 9, { align: 'center' });

        // Render Label Kategori (Kapital & Menengah)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...BLACK);
        doc.text(s.label, bx + statBoxW / 2, statBoxY + 14, { align: 'center' });

        // Render Sub-teks Persentase Analitikal (Kecil, Miring & Abu-abu Elegan)
        doc.setFont('helvetica', 'oblique');
        doc.setFontSize(6);
        doc.setTextColor(...GRAY50);
        doc.text(s.sub, bx + statBoxW / 2, statBoxY + 17.5, { align: 'center' });
    });

    // ── NEW — BAGIAN D — PROGRES CAPAIAN KOMPETENSI KURIKULUM ───────
    // (box baru sesuai gambar "Progres Jumlah Kasus Minimal Stase Kurikulum"
    //  di halaman Riwayat Kasus)

    const progY = statBoxY + statBoxH + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...BLACK);
    doc.text('D.  Progres Capaian Kompetensi Kurikulum', ML, progY);

    hline(doc, progY + 3);

    const progGridY  = progY + 8;
    const progGapX   = 2.2;
    const progBoxW   = (CW - (KURIKULUM_GROUPS.length - 1) * progGapX) / KURIKULUM_GROUPS.length;
    const progBoxH   = 18;

    KURIKULUM_GROUPS.forEach((g, i) => {
        const count = getGroupedCasesCount(progressCases, g.arr);
        const bx    = ML + i * (progBoxW + progGapX);
        const cx    = bx + progBoxW / 2;

        doc.setDrawColor(...BLACK);
        doc.setLineWidth(0.3);
        doc.rect(bx, progGridY, progBoxW, progBoxH, 'S');

        // Angka: count / target
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(...BLACK);
        doc.text(`${count}/${g.target}`, cx, progGridY + 6.5, { align: 'center' });

        // Label kategori (wrap max 2 baris)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(4.6);
        doc.setTextColor(...GRAY50);
        const labelLines = doc.splitTextToSize(g.label.toUpperCase(), progBoxW - 2);
        doc.text(labelLines.slice(0, 2), cx, progGridY + 10.5, { align: 'center' });

        // Mini progress bar
        const barY  = progGridY + progBoxH - 3;
        const barX  = bx + 1.5;
        const barW  = progBoxW - 3;
        const ratio = g.target > 0 ? Math.min(count / g.target, 1) : 0;

        doc.setDrawColor(...GRAY20);
        doc.setFillColor(...GRAY10);
        doc.rect(barX, barY, barW, 1.2, 'F');

        if (ratio > 0) {
            doc.setFillColor(...BLACK);
            doc.rect(barX, barY, barW * ratio, 1.2, 'F');
        }
    });

    const progGridBottom = progGridY + progBoxH;

    // ── BAGIAN E — TANDA TANGAN DIGITAL ──────────────────────────
    const dY = progGridBottom + 9;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...BLACK);
    doc.text('E.  Tanda Tangan Digital', ML, dY);

    hline(doc, dY + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY50);
    doc.text(
        'Dokumen ini ditandatangani secara digital. Scan QR Code di bawah untuk verifikasi keaslian.',
        ML + 4, dY + 9
    );

    // Layout TTD — dua kolom: kiri residen, kanan konsulen
    const ttdY    = dY + 13;
    const ttdColW = CW / 2 - 5;
    const qrSize  = 26;
    const sigBoxH = 42; // sedikit dipadatkan agar muat setelah box progres baru

    // ── QR Residen ──
    const qrResData = [
        'Prodi Anestesiologi', 'RESIDEN',
        resident.name || '', resident.identifier || '',
        tanggalDari, tanggalSampai,
        `TOTAL:${cases.length}`, 'VERIFIED'
    ].join('|');

    const qrResUrl = await makeQR(qrResData);

    // Kotak TTD residen
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.rect(ML, ttdY, ttdColW + 10, sigBoxH, 'S');

    if (qrResUrl) {
        doc.addImage(qrResUrl, 'PNG', ML + 3, ttdY + 3, qrSize, qrSize);
    }

    const rtx = ML + qrSize + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...BLACK);
    doc.text('RESIDEN DOKTER', rtx, ttdY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    doc.text('Nama:', rtx, ttdY + 15);
    doc.setTextColor(...BLACK);
    doc.setFont('helvetica', 'bold');
    // Wrap nama panjang
    const resLines = doc.splitTextToSize(resident.name || '—', ttdColW - qrSize + 5);
    doc.text(resLines, rtx, ttdY + 20);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY50);
    doc.setFontSize(6.5);
    doc.text('NIM:', rtx, ttdY + 28);
    doc.setTextColor(...BLACK);
    doc.text(resident.identifier || '—', rtx, ttdY + 33);

    // Label tanda tangan di bawah kotak
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    doc.text('Tanda Tangan Residen,', ML + (ttdColW + 10) / 2, ttdY + sigBoxH + 5, { align: 'center' });

    // ── QR Konsulen ──
    const qrKonData = [
        'Prodi Anestesiologi', 'KONSULEN',
        konsulen.name || '', konsulen.identifier || '',
        tanggalDari, tanggalSampai,
        `TOTAL:${cases.length}`, 'VERIFIED'
    ].join('|');

    const qrKonUrl = await makeQR(qrKonData);

    const kx = ML + ttdColW + 15;

    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.rect(kx, ttdY, ttdColW + 10, sigBoxH, 'S');

    if (qrKonUrl) {
        doc.addImage(qrKonUrl, 'PNG', kx + 3, ttdY + 3, qrSize, qrSize);
    }

    const ktx = kx + qrSize + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...BLACK);
    doc.text('KONSULEN / PEMBIMBING', ktx, ttdY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    doc.text('Nama:', ktx, ttdY + 15);
    doc.setTextColor(...BLACK);
    doc.setFont('helvetica', 'bold');
    const konLines = doc.splitTextToSize(konsulen.name || '—', ttdColW - qrSize + 5);
    doc.text(konLines, ktx, ttdY + 20);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY50);
    doc.setFontSize(6.5);
    doc.text('NIP:', ktx, ttdY + 28);
    doc.setTextColor(...BLACK);
    doc.text(konsulen.identifier || '—', ktx, ttdY + 33);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    doc.text('Tanda Tangan Konsulen,', kx + (ttdColW + 10) / 2, ttdY + sigBoxH + 5, { align: 'center' });

    // ── Garis bawah & footer cover ─────────────────────────────────
    const footerY = PH - 14;
    hline(doc, footerY - 2, ML, PW - MR, 0.8);
    hline(doc, footerY,     ML, PW - MR, 0.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...GRAY50);
    doc.text(
        `© ${new Date().getFullYear()} Prodi Anestesiologi · Dicetak otomatis pada ${fmtLong(new Date().toISOString())}`,
        PW / 2, footerY + 5, { align: 'center' }
    );
    doc.text('Halaman 1', PW - MR, footerY + 5, { align: 'right' });
}

// ─────────────────────────────────────────────────────────────────
//  HALAMAN 2+ — TABEL DETAIL KASUS
// ─────────────────────────────────────────────────────────────────

async function drawTablePages(doc, { cases, resident, konsulen, tanggalDari, tanggalSampai }) {

    // ── Header tiap halaman ────────────────────────────────────────
    const drawPageHeader = (pageNum) => {
        // Garis atas tebal
        doc.setFillColor(...BLACK);
        doc.rect(ML, MT, CW, 0.8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...BLACK);
        doc.text('DETAIL KASUS KLINIS — LOGBOOK ANESTESIOLOGI', ML, MT + 7);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...GRAY50);
        const periodeStr = `${resident.name || '—'}  ·  ${resident.identifier || '—'}  ·  Periode: ${fmtLong(tanggalDari)} s.d. ${fmtLong(tanggalSampai)}`;
        doc.text(periodeStr, ML, MT + 12);

        hline(doc, MT + 14, ML, PW - MR, 0.4);

        return MT + 18; // startY tabel
    };

    // ── Footer tiap halaman ───────────────────────────────────────
    const drawPageFooter = (pageNum, totalPages) => {
        const fy = PH - 12;
        hline(doc, fy,     ML, PW - MR, 0.8);
        hline(doc, fy + 2, ML, PW - MR, 0.2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...GRAY50);
        doc.text('Prodi Anestesiologi · Logbook Anestesiologi dan Terapi Intensif FK UNRI', ML, fy + 6);
        doc.text(`Halaman ${pageNum}`, PW - MR, fy + 6, { align: 'right' });
    };

    // ── Bangun baris tabel ─────────────────────────────────────────
    const rows = cases.map((c, idx) => {
        let rincian = '—';
        if (c.tindakan === 'Memasang kateter vena central' && c.lokasi_insersi) {
            rincian = `CVC:\n${c.lokasi_insersi}`;
        } else if (c.regimen_analgesia) {
            rincian = `Analgesia:\n${c.regimen_analgesia}`;
        } else if (c.teknik_intervensi) {
            rincian = `Teknik:\n${c.teknik_intervensi}`;
        } else if (
            c.jenis_anestesi &&
            !['Nyeri Analgesia','CVC Procedure','Intensive Care','Peripheral Nerve Block'].includes(c.jenis_anestesi)
        ) {
            rincian = c.jenis_anestesi;
        }

        const diagnosis = Array.isArray(c.diagnosis)
            ? c.diagnosis.join('\n')
            : (c.diagnosis || '—');

        const pasien = [
            c.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            `${c.umur} Thn`,
            c.jenis_kasus || '—',
        ].join('\n');

        return [
            String(idx + 1),
            fmtShort(c.tanggal_tindakan),
            pasien,
            diagnosis,
            c.tindakan || '—',
            rincian,
            c.dpjp_name || '—',
        ];
    });

    const startY = drawPageHeader(2);

    autoTable(doc, {
        startY,
        head: [[
            'No', 'Tanggal', 'Pasien', 'Diagnosis',
            'Tindakan / Stase', 'Rincian Klinis',
            'DPJP / Konsulen',
        ]],
        body: rows,
        theme: 'grid',

        // ── Style global ──────────────────────────────────────────
        styles: {
            font:        'helvetica',
            fontSize:    7,
            textColor:   BLACK,
            lineColor:   BLACK,
            lineWidth:   0.2,
            cellPadding: { top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 },
            valign:      'top',
            overflow:    'linebreak',
        },

        // ── Header tabel ─────────────────────────────────────────
        headStyles: {
            fillColor:  GRAY90,
            textColor:  BLACK,
            fontStyle:  'bold',
            fontSize:   7,
            lineColor:  BLACK,
            lineWidth:  0.3,
            halign:     'center',
            cellPadding: { top: 3, right: 2.5, bottom: 3, left: 2.5 },
        },

        // ── Baris genap sedikit lebih terang ─────────────────────
        alternateRowStyles: {
            fillColor: [252, 252, 252],
        },

        // ── Lebar kolom ──────────────────────────────────────────
        columnStyles: {
            0: { cellWidth: 8,  halign: 'center' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 22 },
            3: { cellWidth: 30 },
            4: { cellWidth: 38 },
            5: { cellWidth: 24 },
            6: { cellWidth: 24 },
            7: { cellWidth: 'auto' }, // sisa
        },

        // ── Nomor baris center ────────────────────────────────────
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
                data.cell.styles.halign = 'center';
                data.cell.styles.fontStyle = 'bold';
            }
        },

        // ── Header & footer per halaman ───────────────────────────
        didDrawPage: (data) => {
            const pn = doc.internal.getCurrentPageInfo().pageNumber;
            // Gambar ulang header jika bukan halaman pertama tabel
            if (pn > 2) {
                drawPageHeader(pn);
            }
            drawPageFooter(pn, '?');
        },

        margin: { top: MT + 18, left: ML, right: MR, bottom: 18 },
        tableWidth: CW,
    });
}

export default cetakKasusPDF;