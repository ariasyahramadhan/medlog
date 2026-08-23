/**
 * useCetakSoftSkill.js
 * ─────────────────────────────────────────────────────────────────
 * Generator PDF Logbook Soft Skill Residen — Format Resmi Hitam-Putih
 * Portrait A4, IDENTIK dengan useCetakKasus.js (versi terbaru)
 *
 * Dependensi:
 *   npm install jspdf jspdf-autotable qrcode
 *
 * Cara pakai:
 *   import { cetakSoftSkillPDF } from './useCetakSoftSkill';
 *   cetakSoftSkillPDF({ softSkills, resident, konsulen, tanggalDari, tanggalSampai });
 *
 * Catatan:
 *   - `konsulen` diambil dari prop yang dikirim modal (ambil dari dpjp_name kasus
 *     atau dari relasi mentorship, sama persis dengan logbook kasus)
 * ─────────────────────────────────────────────────────────────────
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

// ─── Konstanta Halaman ───────────────────────────────────────────

const PW   = 210;           // A4 Portrait width  mm
const PH   = 297;           // A4 Portrait height mm
const ML   = 20;            // margin left
const MR   = 20;            // margin right
const MT   = 15;            // margin top
const CW   = PW - ML - MR; // content width = 170mm

// ─── Warna (hitam-putih formal) ──────────────────────────────────

const BLACK  = [0,   0,   0  ];
const WHITE  = [255, 255, 255];
const GRAY10 = [230, 230, 230];
const GRAY20 = [200, 200, 200];
const GRAY50 = [120, 120, 120];
const GRAY90 = [245, 245, 245];

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

// ─── Helper: Garis Horisontal ────────────────────────────────────

const hline = (doc, y, x1 = ML, x2 = PW - MR, w = 0.3) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(w);
    doc.line(x1, y, x2, y);
};

// ─────────────────────────────────────────────────────────────────
//  FUNGSI UTAMA
// ─────────────────────────────────────────────────────────────────

/**
 * @param {Object} opts
 * @param {Array}  opts.softSkills     — data soft skill dalam rentang tanggal
 * @param {Object} opts.resident       — { name, identifier, department, batch? }
 * @param {Object} opts.konsulen       — { name, identifier }
 *                                       Gunakan dpjp_name dari data kasus jika tidak ada
 *                                       relasi mentorship langsung
 * @param {string} opts.tanggalDari    — 'YYYY-MM-DD'
 * @param {string} opts.tanggalSampai  — 'YYYY-MM-DD'
 */
export const cetakSoftSkillPDF = async ({
    softSkills    = [],
    resident      = {},
    konsulen      = {},
    tanggalDari   = '',
    tanggalSampai = '',
}) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Halaman 1 — Cover + Ringkasan Identitas
    await drawCoverPage(doc, { softSkills, resident, konsulen, tanggalDari, tanggalSampai });

    // Halaman 2+ — Tabel Detail Soft Skill
    doc.addPage();
    await drawTablePages(doc, { softSkills, resident, konsulen, tanggalDari, tanggalSampai });

    const safeName = (resident.identifier || 'residen').replace(/[\s/\\]/g, '_');
    doc.save(`Logbook_SoftSkill_${safeName}_${tanggalDari}_sd_${tanggalSampai}.pdf`);
};

// ─────────────────────────────────────────────────────────────────
//  HALAMAN 1 — COVER IDENTITAS
// ─────────────────────────────────────────────────────────────────

async function drawCoverPage(doc, { softSkills, resident, konsulen, tanggalDari, tanggalSampai }) {

    // ── KOP INSTITUSI ─────────────────────────────────────────────
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

    // Garis tebal bawah kop (double rule)
    doc.setTextColor(...BLACK);
    doc.setFillColor(...BLACK);
    doc.rect(ML, kopY + 21, CW, 0.8, 'F');
    doc.setLineWidth(0.2);
    doc.line(ML, kopY + 23, PW - MR, kopY + 23);

    // ── JUDUL DOKUMEN ─────────────────────────────────────────────
    const judulY = kopY + 32;

    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.rect(ML, judulY - 6, CW, 12, 'S');

    // Divider vertikal sebelum kode form
    doc.line(ML + 120, judulY - 6, ML + 120, judulY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BLACK);
    doc.text('LOGBOOK PENILAIAN SOFT SKILL RESIDEN', ML + 60, judulY + 1.5, { align: 'center' });

    doc.setFontSize(9);
    doc.text('MEDLOG-SS', ML + 145, judulY + 1.5, { align: 'center' });

    // ── BAGIAN A — IDENTITAS RESIDEN ──────────────────────────────
    const aY = judulY + 18;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...BLACK);
    doc.text('A.  Identitas Residen', ML, aY);

    hline(doc, aY + 3);

    const identData = [
        ['Nama Lengkap',     resident.name       || '—'],
        ['NIM / Identifier', resident.identifier  || '—'],
        ['Program Studi',    resident.department  || 'Anestesiologi dan Terapi Intensif'],
        ['Konsulen / DPJP',  konsulen.name        || '—'],
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
        doc.text(String(value), valueX, iy);
        hline(doc, iy + 2, ML, PW - MR, 0.15);
        iy += 8;
    });

    // ── BAGIAN B — PERIODE ────────────────────────────────────────
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

    // ── BAGIAN C — TANDA TANGAN DIGITAL ──────────────────────────
    const dY = bY + 32;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...BLACK);
    doc.text('C.  Tanda Tangan Digital', ML, dY);

    hline(doc, dY + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY50);
    doc.text(
        'Dokumen ini ditandatangani secara digital. Scan QR Code di bawah untuk verifikasi keaslian.',
        ML + 4, dY + 9
    );

    // Layout TTD — dua kolom: kiri residen, kanan konsulen
    const ttdY    = dY + 14;
    const ttdColW = CW / 2 - 5;
    const qrSize  = 28;

    // ── QR Residen ──
    const qrResData = [
        'Prodi Anestesiologi', 'RESIDEN',
        resident.name || '', resident.identifier || '',
        tanggalDari, tanggalSampai,
        `TOTAL:${softSkills.length}`, 'VERIFIED'
    ].join('|');

    const qrResUrl = await makeQR(qrResData);

    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.rect(ML, ttdY, ttdColW + 10, 48, 'S');

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
    const resLines = doc.splitTextToSize(resident.name || '—', ttdColW - qrSize + 5);
    doc.text(resLines, rtx, ttdY + 20);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY50);
    doc.setFontSize(6.5);
    doc.text('NIM:', rtx, ttdY + 30);
    doc.setTextColor(...BLACK);
    doc.text(resident.identifier || '—', rtx, ttdY + 35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    doc.text('Tanda Tangan Residen,', ML + (ttdColW + 10) / 2, ttdY + 52, { align: 'center' });

    // ── QR Konsulen ──
    const qrKonData = [
        'Prodi Anestesiologi', 'KONSULEN',
        konsulen.name || '', konsulen.identifier || '',
        tanggalDari, tanggalSampai,
        `TOTAL:${softSkills.length}`, 'VERIFIED'
    ].join('|');

    const qrKonUrl = await makeQR(qrKonData);

    const kx = ML + ttdColW + 15;

    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.rect(kx, ttdY, ttdColW + 10, 48, 'S');

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
    doc.text('NIP:', ktx, ttdY + 30);
    doc.setTextColor(...BLACK);
    doc.text(konsulen.identifier || '—', ktx, ttdY + 35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    doc.text('Tanda Tangan Konsulen,', kx + (ttdColW + 10) / 2, ttdY + 52, { align: 'center' });

    // ── Garis bawah & footer cover ────────────────────────────────
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
//  HALAMAN 2+ — TABEL DETAIL SOFT SKILL
// ─────────────────────────────────────────────────────────────────

async function drawTablePages(doc, { softSkills, resident, konsulen, tanggalDari, tanggalSampai }) {

    // ── Header tiap halaman ───────────────────────────────────────
    const drawPageHeader = (pageNum) => {
        doc.setFillColor(...BLACK);
        doc.rect(ML, MT, CW, 0.8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...BLACK);
        doc.text('DETAIL CATATAN SOFT SKILL — LOGBOOK ANESTESIOLOGI', ML, MT + 7);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...GRAY50);
        const periodeStr = `${resident.name || '—'}  ·  ${resident.identifier || '—'}  ·  Periode: ${fmtLong(tanggalDari)} s.d. ${fmtLong(tanggalSampai)}`;
        doc.text(periodeStr, ML, MT + 12);

        hline(doc, MT + 14, ML, PW - MR, 0.4);

        return MT + 18;
    };

    // ── Footer tiap halaman ───────────────────────────────────────
    const drawPageFooter = (pageNum) => {
        const fy = PH - 12;
        hline(doc, fy,     ML, PW - MR, 0.8);
        hline(doc, fy + 2, ML, PW - MR, 0.2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...GRAY50);
        doc.text('Prodi Anestesiologi · Logbook Soft Skill Anestesiologi dan Terapi Intensif FK UNRI', ML, fy + 6);
        doc.text(`Halaman ${pageNum}`, PW - MR, fy + 6, { align: 'right' });
    };

    // ── Bangun baris tabel ────────────────────────────────────────
    const rows = softSkills.map((s, idx) => [
        String(idx + 1),
        fmtShort(s.tanggal),
        s.keterangan || '—',
        // Kolom DPJP/Konsulen: ambil dari field konsulen_name di data,
        // fallback ke konsulen yang dikirim dari prop (sama dengan dpjp di logbook kasus)
        s.konsulen_name || konsulen.name || '—',
        'VERIFIED',
    ]);

    const startY = drawPageHeader(2);

    autoTable(doc, {
        startY,
        head: [[
            'No',
            'Tanggal',
            'Uraian Catatan Evaluasi Perilaku Profesional',
            'Konsulen / DPJP',
            'Status',
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
            fillColor:   GRAY90,
            textColor:   BLACK,
            fontStyle:   'bold',
            fontSize:    7,
            lineColor:   BLACK,
            lineWidth:   0.3,
            halign:      'center',
            cellPadding: { top: 3, right: 2.5, bottom: 3, left: 2.5 },
        },

        // ── Baris genap sedikit lebih terang ─────────────────────
        alternateRowStyles: {
            fillColor: [252, 252, 252],
        },

        // ── Lebar kolom ──────────────────────────────────────────
        columnStyles: {
            0: { cellWidth: 8,    halign: 'center' },
            1: { cellWidth: 22,   halign: 'center' },
            2: { cellWidth: 'auto' },              // uraian catatan — lebar sisa
            3: { cellWidth: 32 },                  // konsulen / dpjp
            4: { cellWidth: 18,   halign: 'center' },
        },

        // ── Nomor baris bold & center ─────────────────────────────
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
                data.cell.styles.halign    = 'center';
                data.cell.styles.fontStyle = 'bold';
            }
        },

        // ── Badge VERIFIED di kolom status ────────────────────────
        didDrawCell: (data) => {
            if (data.column.index === 4 && data.section === 'body') {
                const { x, y, width, height } = data.cell;
                const bw = 14, bh = 6;
                const bx = x + (width  - bw) / 2;
                const by = y + (height - bh) / 2;

                doc.setFillColor(...GRAY90);
                doc.rect(bx, by, bw, bh, 'F');
                doc.setDrawColor(...BLACK);
                doc.setLineWidth(0.25);
                doc.rect(bx, by, bw, bh, 'S');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5.5);
                doc.setTextColor(...BLACK);
                doc.text('VERIFIED', bx + bw / 2, by + bh / 2 + 1, { align: 'center' });
            }
        },

        // ── Header & footer per halaman ───────────────────────────
        didDrawPage: (data) => {
            const pn = doc.internal.getCurrentPageInfo().pageNumber;
            if (pn > 2) {
                drawPageHeader(pn);
            }
            drawPageFooter(pn);
        },

        margin: { top: MT + 18, left: ML, right: MR, bottom: 18 },
        tableWidth: CW,
    });
}

export default cetakSoftSkillPDF;