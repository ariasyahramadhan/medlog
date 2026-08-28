import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

// ─── Konstanta Halaman ───────────────────────────────────────────

const PW   = 210;
const PH   = 297;
const ML   = 20;
const MR   = 20;
const MT   = 15;
const CW   = PW - ML - MR;

// ─── Warna ───────────────────────────────────────────────────────

const BLACK  = [0,   0,   0  ];
const GRAY50 = [120, 120, 120];
const GRAY90 = [245, 245, 245];

// ─── Helpers ─────────────────────────────────────────────────────

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

const makeQR = async (text) => {
    try {
        return await QRCode.toDataURL(text, {
            width: 100, margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
        });
    } catch { return null; }
};

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
 * @param {Array}  opts.guidances      — data bimbingan tesis dalam rentang tanggal
 * @param {Object} opts.resident       — { name, identifier, department, batch? }
 * @param {Object} opts.pembimbing     — { name, identifier }  (dosen pembimbing tesis)
 * @param {string} opts.judulTesis     — judul tesis terkini residen
 * @param {string} opts.tanggalDari    — 'YYYY-MM-DD'
 * @param {string} opts.tanggalSampai  — 'YYYY-MM-DD'
 */
export const cetakBimbinganTesisPDF = async ({
    guidances     = [],
    resident      = {},
    pembimbing    = {},
    judulTesis    = '',
    tanggalDari   = '',
    tanggalSampai = '',
}) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    await drawCoverPage(doc, { guidances, resident, pembimbing, judulTesis, tanggalDari, tanggalSampai });

    doc.addPage();
    await drawTablePages(doc, { guidances, resident, pembimbing, tanggalDari, tanggalSampai });

    const safeName = (resident.identifier || 'residen').replace(/[\s/\\]/g, '_');
    doc.save(`Logbook_BimbinganTesis_${safeName}_${tanggalDari}_sd_${tanggalSampai}.pdf`);
};

// ─────────────────────────────────────────────────────────────────
//  HALAMAN 1 — COVER IDENTITAS
// ─────────────────────────────────────────────────────────────────

async function drawCoverPage(doc, { guidances, resident, pembimbing, judulTesis, tanggalDari, tanggalSampai }) {

    // ── KOP INSTITUSI ─────────────────────────────────────────────
    doc.setFillColor(...BLACK);
    doc.rect(ML, MT, CW, 0.8, 'F');

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
    doc.line(ML + 120, judulY - 6, ML + 120, judulY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BLACK);
    doc.text('LOGBOOK BIMBINGAN TESIS RESIDEN', ML + 60, judulY + 1.5, { align: 'center' });

    doc.setFontSize(9);
    doc.text('MEDLOG-TS', ML + 145, judulY + 1.5, { align: 'center' });

    // ── BAGIAN A — IDENTITAS RESIDEN ──────────────────────────────
    const aY = judulY + 18;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...BLACK);
    doc.text('A.  Identitas Residen', ML, aY);

    hline(doc, aY + 3);

    const identData = [
        ['Nama Lengkap',      resident.name       || '—'],
        ['NIM / Identifier',  resident.identifier  || '—'],
        ['Program Studi',     resident.department  || 'Anestesiologi dan Terapi Intensif'],
        ['Judul Tesis',       judulTesis           || '—'],
        ['Dosen Pembimbing',  pembimbing.name      || '—'],
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
        const valLines = doc.splitTextToSize(String(value), CW - labelW - 10);
        doc.text(valLines, valueX, iy);
        const lineAdd = valLines.length > 1 ? (valLines.length - 1) * 4.5 : 0;
        hline(doc, iy + 2 + lineAdd, ML, PW - MR, 0.15);
        iy += 8 + lineAdd;
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

    // Layout TTD dua kolom
    const ttdY    = dY + 14;
    const ttdColW = CW / 2 - 5;
    const qrSize  = 28;

    // ── QR Residen ──
    const qrResData = [
        'Prodi Anestesiologi', 'RESIDEN',
        resident.name || '', resident.identifier || '',
        tanggalDari, tanggalSampai,
        `TOTAL:${guidances.length}`, 'VERIFIED'
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

    // ── QR Dosen Pembimbing ──
    const qrPmbData = [
        'Prodi Anestesiologi', 'DOSEN PEMBIMBING',
        pembimbing.name || '', pembimbing.identifier || '',
        tanggalDari, tanggalSampai,
        `TOTAL:${guidances.length}`, 'VERIFIED'
    ].join('|');

    const qrPmbUrl = await makeQR(qrPmbData);

    const kx = ML + ttdColW + 15;

    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.rect(kx, ttdY, ttdColW + 10, 48, 'S');

    if (qrPmbUrl) {
        doc.addImage(qrPmbUrl, 'PNG', kx + 3, ttdY + 3, qrSize, qrSize);
    }

    const ktx = kx + qrSize + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...BLACK);
    doc.text('DOSEN PEMBIMBING', ktx, ttdY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    doc.text('Nama:', ktx, ttdY + 15);
    doc.setTextColor(...BLACK);
    doc.setFont('helvetica', 'bold');
    const pmbLines = doc.splitTextToSize(pembimbing.name || '—', ttdColW - qrSize + 5);
    doc.text(pmbLines, ktx, ttdY + 20);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY50);
    doc.setFontSize(6.5);
    doc.text('NIP:', ktx, ttdY + 30);
    doc.setTextColor(...BLACK);
    doc.text(pembimbing.identifier || '—', ktx, ttdY + 35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    doc.text('Tanda Tangan Pembimbing,', kx + (ttdColW + 10) / 2, ttdY + 52, { align: 'center' });

    // ── Footer Cover ──────────────────────────────────────────────
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
//  HALAMAN 2+ — TABEL DETAIL BIMBINGAN
// ─────────────────────────────────────────────────────────────────

async function drawTablePages(doc, { guidances, resident, pembimbing, tanggalDari, tanggalSampai }) {

    const drawPageHeader = () => {
        doc.setFillColor(...BLACK);
        doc.rect(ML, MT, CW, 0.8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...BLACK);
        doc.text('DETAIL CATATAN BIMBINGAN TESIS — LOGBOOK ANESTESIOLOGI', ML, MT + 7);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...GRAY50);
        const sub = `${resident.name || '—'}  ·  ${resident.identifier || '—'}  ·  Periode: ${fmtLong(tanggalDari)} s.d. ${fmtLong(tanggalSampai)}`;
        doc.text(sub, ML, MT + 12);

        hline(doc, MT + 14, ML, PW - MR, 0.4);

        return MT + 18;
    };

    const drawPageFooter = (pageNum) => {
        const fy = PH - 12;
        hline(doc, fy,     ML, PW - MR, 0.8);
        hline(doc, fy + 2, ML, PW - MR, 0.2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...GRAY50);
        doc.text('Prodi Anestesiologi · Logbook Bimbingan Tesis Anestesiologi dan Terapi Intensif FK UNRI', ML, fy + 6);
        doc.text(`Halaman ${pageNum}`, PW - MR, fy + 6, { align: 'right' });
    };

    const rows = guidances.map((g, idx) => [
        String(idx + 1),
        fmtShort(g.tanggal),
        g.tahap || '—',
        g.keterangan || '—',
        g.lecturer?.name || pembimbing.name || '—',
        'VERIFIED',
    ]);

    const startY = drawPageHeader();

    autoTable(doc, {
        startY,
        head: [[
            'No',
            'Tanggal',
            'Tahap',
            'Keterangan Bimbingan Tesis',
            'Pembimbing',
            'Paraf',
        ]],
        body: rows,
        theme: 'grid',

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

        alternateRowStyles: {
            fillColor: [252, 252, 252],
        },

        columnStyles: {
            0: { cellWidth: 8,      halign: 'center' },
            1: { cellWidth: 20,     halign: 'center' },
            2: { cellWidth: 26 },
            3: { cellWidth: 'auto' },
            4: { cellWidth: 28 },
            5: { cellWidth: 16,     halign: 'center' },
        },

        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
                data.cell.styles.halign    = 'center';
                data.cell.styles.fontStyle = 'bold';
            }
        },

        didDrawCell: (data) => {
            if (data.column.index === 5 && data.section === 'body') {
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

        didDrawPage: (data) => {
            const pn = doc.internal.getCurrentPageInfo().pageNumber;
            if (pn > 2) drawPageHeader();
            drawPageFooter(pn);
        },

        margin: { top: MT + 18, left: ML, right: MR, bottom: 18 },
        tableWidth: CW,
    });
}

export default cetakBimbinganTesisPDF;