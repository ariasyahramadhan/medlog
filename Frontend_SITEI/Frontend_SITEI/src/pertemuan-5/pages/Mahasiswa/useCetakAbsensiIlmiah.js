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

export const cetakAbsensiIlmiahPDF = async ({ activity = {}, resident = {} }) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Kop Surat Resmi PPDS Anestesiologi UNRI[cite: 8]
    doc.setFillColor(...BLACK);
    doc.rect(ML, MT, CW, 0.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI', PW / 2, MT + 8, { align: 'center' });
    doc.setFontSize(12);
    doc.text('UNIVERSITAS RIAU — FAKULTAS KEDOKTERAN', PW / 2, MT + 14, { align: 'center' });
    doc.setFontSize(10);
    doc.text('PROGRAM PENDIDIKAN DOKTER SPESIALIS ANESTESIOLOGI DAN TERAPI INTENSIF', PW / 2, MT + 20, { align: 'center' });
    doc.rect(ML, MT + 25, CW, 0.8, 'F');

    // Judul Form[cite: 8]
    const judulY = MT + 36;
    doc.setFontSize(10);
    doc.rect(ML, judulY - 5, CW, 10, 'S');
    doc.text('DAFTAR HADIR KEGIATAN ILMIAH', ML + 5, judulY + 1.5);
    doc.text('FORM MEDLOG-ABS-ILMIAH', ML + 120, judulY + 1.5);

    // Metadata Acara Sumbu Y Aliran Dinamis[cite: 8]
    let infoY = judulY + 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    
    doc.text(`Nama Presentator : ${String(resident.name || '—').toUpperCase()} (NIM: ${resident.identifier || '—'})`, ML, infoY);
    
    infoY += 5;
    doc.text(`Hari / Tanggal   : ${fmtLong(activity.tanggal)}`, ML, infoY);
    
    infoY += 5;
    doc.text(`Kegiatan Ilmiah  : ${String(activity.kegiatan_ilmiah || '—').toUpperCase()}`, ML, infoY);
    
    infoY += 5;
    const judulResmi = String(activity.score?.judul_resmi || activity.kegiatan_ilmiah || '—').toUpperCase();
    const splitJudul = doc.splitTextToSize(`Judul Makalah    : ${judulResmi}`, CW);
    doc.text(splitJudul, ML, infoY);
    
    infoY += (splitJudul.length * 4.5); 
    
    // REVISI TOTAL: Mengambil murni data objek Konsulen Terkait dari database
    const namaKonsulenTerkait = activity.lecturer?.name || activity.penanggung_jawab || '—';
    doc.text(`Pembimbing       : ${String(namaKonsulenTerkait).toUpperCase()}`, ML, infoY);

    // Mapping Baris Tabel Absensi[cite: 8]
    const listHadir = Array.isArray(activity.attendances) ? activity.attendances : [];
    const tableRows = listHadir.map((att, idx) => [
        String(idx + 1),
        String(att.nama_peserta || '—').toUpperCase(),
        '', 
        att.keterangan || 'Hadir'
    ]);

    autoTable(doc, {
        startY: infoY + 7,
        head: [['No', 'Nama Peserta Dokter Residen', 'Tanda Tangan', 'Keterangan']],
        body: tableRows.length ? tableRows : [['—', 'Belum ada rekan sejawat residen yang mengisi daftar hadir', '—', '—']],
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 8, textColor: BLACK, lineColor: BLACK, lineWidth: 0.2, cellPadding: 2.5, valign: 'middle' },
        headStyles: { fillColor: GRAY90, textColor: BLACK, fontStyle: 'bold', halign: 'center' },
        columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 2: { cellWidth: 35 }, 3: { cellWidth: 30, halign: 'center' } },
        margin: { left: ML, right: MR }
    });

    let currentY = doc.lastAutoTable.finalY + 12;
    if (currentY > PH - 45) { doc.addPage(); currentY = MT + 10; }

    const qrData = ['UNRI_ABSENSI_ILMIAH', activity.tanggal, resident.identifier, `TOTAL:${listHadir.length}`].join('|');
    const qrUrl = await makeQR(qrData);
    if (qrUrl) doc.addImage(qrUrl, 'PNG', ML, currentY, 22, 22);

    doc.setFont('helvetica', 'normal');
    doc.text('Mengetahui,', ML + 125, currentY + 2);
    doc.text('Konsulen Pembimbing / PJ Kegiatan', ML + 115, currentY + 6);
    doc.setFont('helvetica', 'bold');
    
    // REVISI TOTAL: Pengesahan bawah menggunakan Konsulen Terkait murni[cite: 8]
    doc.text(String(namaKonsulenTerkait).toUpperCase(), ML + 115, currentY + 22);
    hline(doc, currentY + 23, ML + 115, PW - MR, 0.2);

    const footerY = PH - 14;
    hline(doc, footerY, ML, PW - MR, 0.4);
    doc.setFontSize(6.5);
    doc.setTextColor(...GRAY50);
    doc.text(`Sistem Penomoran Digital MedLog AI FK UNRI  ·  Lembar Daftar Hadir Acara Ilmiah Resmi Residen`, ML, footerY + 5);

    doc.save(`Lembar_Absensi_Ilmiah_${resident.identifier || 'residen'}.pdf`);
};