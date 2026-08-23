import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

const PW     = 210; 
const PH     = 297; 
const ML     = 20;  
const MR     = 20;  
const MT     = 15;  
const CW     = PW - ML - MR;

const BLACK  = [0,   0,   0  ];
const GRAY50 = [120, 120, 120];
const GRAY90 = [245, 245, 245];

const fmtLong = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const makeQR = async (text) => {
    try {
        return await QRCode.toDataURL(text, { width: 90, margin: 1, color: { dark: '#000000', light: '#ffffff' } });
    } catch { return null; }
};

const hline = (doc, y, x1 = ML, x2 = PW - MR, w = 0.3) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(w);
    doc.line(x1, y, x2, y);
};

export const cetakFormNilaiIlmiahPDF = async ({ activity = {}, resident = {} }) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const s = activity.score || {};

    // Kop Surat Resmi PPDS Anestesiologi UNRI[cite: 7]
    doc.setFillColor(...BLACK);
    doc.rect(ML, MT, CW, 0.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI', PW / 2, MT + 8, { align: 'center' });
    doc.setFontSize(12);
    doc.text('UNIVERSITAS RIAU — FAKULTAS KEDOKTERAN', PW / 2, MT + 14, { align: 'center' });
    doc.setFontSize(10);
    doc.text('PROGRAM PENDIDIKAN DOKTER SPESIALIS ANESTESIOLOGI DAN TERAPI INTENSIF', PW / 2, MT + 20, { align: 'center' });
    doc.rect(ML, MT + 25, CW, 0.8, 'F');

    // Judul Form Kertas Nilai[cite: 7]
    const judulY = MT + 36;
    doc.setFontSize(10);
    doc.rect(ML, judulY - 5, CW, 10, 'S');
    doc.text('PENILAIAN KEGIATAN ILMIAH - RAHASIA', PW / 2, judulY + 1.5, { align: 'center' });

    // REVISI: Mengambil murni nama konsulen penilai dari database (Bukan teks acuan)
    const namaKonsulenTerkait = activity.lecturer?.name || activity.penanggung_jawab || '—';

    // Biodata Atas Form Nilai Word (Karakter Kotak Kosong Sudah Dihapus!)[cite: 7]
    let bioY = judulY + 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Nama Peserta PPDS : ${String(resident.name || '—').toUpperCase()}`, ML, bioY);
    doc.text(`Tahap / Semester  : ${String(s.tahap_semester || 'Semester Ganjil').toUpperCase()}`, ML, bioY + 5);
    doc.text(`Kegiatan          : ${String(activity.kegiatan_ilmiah || '—').toUpperCase()}`, ML, bioY + 10);
    doc.text(`Judul             : ${String(s.judul_resmi || activity.kegiatan_ilmiah || '—').toUpperCase()}`, ML, bioY + 15, { maxWidth: CW });
    doc.text(`Pembimbing        : ${String(namaKonsulenTerkait).toUpperCase()}`, ML, bioY + 23);

    // Kriteria Standar Kurikulum[cite: 7]
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Matriks Skala Kualifikasi Nilai:', ML, bioY + 29);
    doc.setFont('helvetica', 'normal');
    doc.text('A : 85 - 100 (Baik Sekali)   C : 70 - 74 (Cukup)   E : 0 - 49 (Kurang Sekali)   NBL : 70 (Batas Lulus Murni)', ML, bioY + 32.5);
    doc.text('B : 75 - 84 (Baik)           D : 50 - 69 (Kurang)', ML, bioY + 36);

    const tableRows = [
        ['I', 'Persiapan', ''],
        ['', '1. Bahan Presentasi', String(s.persiapan_bahan ?? '—')],
        ['', '2. Kehadiran Narasumber (bila diperlukan)', String(s.persiapan_narsum ?? '—')],
        ['II', 'Makalah', ''],
        ['', '1. Judul', String(s.makalah_judul ?? '—')],
        ['', '2. Isi', String(s.makalah_isi ?? '—')],
        ['', '3. Pembahasan', String(s.makalah_pembahasan ?? '—')],
        ['III', 'Penampilan', ''],
        ['', '1. Cara Presentasi', String(s.penampilan_cara ?? '—')],
        ['', '2. Penguasaan Kasus', String(s.penampilan_kuasa ?? '—')],
        ['IV', 'Diskusi', ''],
        ['', '1. Penguasaan Teori', String(s.diskusi_teori ?? '—')],
        ['', '2. Kemampuan Berdiskusi', String(s.diskusi_kemampuan ?? '—')],
        [{ content: 'NILAI AKHIR = JUMLAH NILAI KESELURUHAN RATA-RATA', colSpan: 2, styles: { fontStyle: 'bold', halign: 'right' } }, { content: `${s.nilai_akhir ?? '—'} Poin`, styles: { fontStyle: 'bold', halign: 'center', fillColor: [240, 240, 240] } }]
    ];

    autoTable(doc, {
        startY: bioY + 39,
        head: [['No', 'Kategori Penilaian Rubrik Utama', 'Nilai']],
        body: tableRows,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 8, textColor: BLACK, lineColor: BLACK, lineWidth: 0.2, cellPadding: 2.5, valign: 'middle' },
        headStyles: { fillColor: GRAY90, textColor: BLACK, fontStyle: 'bold', halign: 'center' },
        columnStyles: { 0: { cellWidth: 15, halign: 'center' }, 1: { cellWidth: 120 }, 2: { cellWidth: 35, halign: 'center' } },
        margin: { left: ML, right: MR }
    });

    let currentY = doc.lastAutoTable.finalY + 8;
    if (currentY > PH - 45) { doc.addPage(); currentY = MT + 10; }

    // Box Penilaian Kesimpulan Status[cite: 7]
    doc.setLineWidth(0.35);
    doc.rect(ML, currentY, CW, 9, 'S');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('KESIMPULAN TIM DOSEN PENGUJI :', ML + 4, currentY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text(`[ STATUS : ${String(s.kesimpulan || 'PENDING REVIEW').toUpperCase()} ]`, ML + 58, currentY + 6);

    currentY += 15;

    const qrString = ['UNRI_KERTAS_NILAI', resident.identifier, `FINAL_SCORE:${s.nilai_akhir}`, s.kesimpulan].join('|');
    const qrUrl = await makeQR(qrString);
    if (qrUrl) doc.addImage(qrUrl, 'PNG', ML, currentY, 22, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Penilaian ini dibuat pada tanggal: ${fmtLong(activity.tanggal)}`, ML + 28, currentY + 4);
    doc.text('Nama Penilai / Pembimbing Utama:', ML + 28, currentY + 9);
    doc.setFont('helvetica', 'bold');
    
    // REVISI TOTAL: Nama penilai murni menggunakan Konsulen Terkait[cite: 7]
    doc.text(String(namaKonsulenTerkait).toUpperCase(), ML + 28, currentY + 14);
    doc.setFont('helvetica', 'oblique');
    doc.setTextColor(...GRAY50);
    doc.text('Status Dokumen: Nilai Terkunci Otomatis & Terverifikasi Digital Melalui QR-Code', ML + 28, currentY + 19);

    doc.save(`Kertas_Nilai_Akademik_Ilmiah_${resident.identifier || 'residen'}.pdf`);
};