import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

// ─── Konstanta Layout Halaman ────────────────────────────────────
const PW     = 210;   // A4 Width mm
const PH     = 297;   // A4 Height mm
const ML     = 20;    // Margin Left
const MR     = 20;    // Margin Right
const MT     = 15;    // Margin Top
const CW     = PW - ML - MR; // Content Width = 170mm

const BLACK  = [0,   0,   0  ];
const GRAY50 = [120, 120, 120]; 
const GRAY90 = [245, 245, 245]; 

const fmtLong = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

const makeQR = async (text) => {
    try {
        if (!text) return null;
        return await QRCode.toDataURL(text, {
            width: 100, margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
        });
    } catch (err) { 
        return null; 
    }
};

/**
 * MATRIKS DATA TILIK FORM BERDASARKAN JENIS DOPS KURIKULUM
 */
const dapatkanProsedurTilik = (jenisDops) => {
    const jd = String(jenisDops).toUpperCase();

    // 1. FORMAT: ANESTESI UMUM (4 Aman, STATICS, & Ekstubasi)
    if (jd.includes('UMUM')) {
        return {
            tipe: 'UMUM',
            headers: [['NO', 'KEGIATAN / EVALUASI PARAMETER', 'SKOR 0', 'SKOR 1', 'SKOR 2', 'SKOR 3', 'NILAI']],
            widths: { 0: 8, 1: 110, 2: 11, 3: 11, 4: 11, 5: 11, 6: 8 },
            rows: [
                ['1', 'Peserta menjelaskan secara rinci tentang 4 aman:\nAman Obat: Obat-obat induksi dan obat resusitasi\nAman Alat: Persiapan mesin anestesi dan S T A T I C S\nAman Pasien: Menilai ASA pasien, puasa, keadaan rehidrasi, masalah jalan napas,profil lab yang bermasalah dan yang telah dikoreksi\nAman Anestesiologist: Proteksi diri Anestesiologist spt penggunaan handschoon, faceshield dlL'],
                ['2', 'Peserta menjelaskan secara rinci 3 macam obat (obat sedasi/hipnotik, Relaksasi, analgesia) yang akan diberikan beserta dosis :\nObat bersifat Sedasi/hipnotik seperti : Propofol : 2 -2,5 mg/kgbb, Midazolam : 0,1 – 0,3 mg/kgbb, Pentothal : 5 – 7 mg/kgbb, Ketamin : 1 – 2 mg/kgbb, Etomidate : 0,1 -0,2 mg/kgbb\nObat bersifat Muscle Relaksan : Atracurium : 0,5 – 0,6 mg/kgbb, Vencuronium : 0,1 – 0,15 mg/kgbb, Rocuronium : 0,6 – 0,9 mg/kgbb, Pancuronium 0,08 – 0,12 mg/kgbb\nObat bersifat Analgesia : Fentany : 1 – 3 µgr/kgbb, Morphin : 0,1 – 0,15 mg/kgbb, Petidin : 1 – 2 mg/kgbb, Oxykodon : 0,1 – 0,2 mg/kgbb'],
                ['3', 'Peserta mampu menjelaskan tentang S T A T I C S'],
                ['4', 'Peserta mampu menjelaskan kriteria ekstubasi:\nPasien sadar penuh\nReflek reflek fisiologis seperti batuk dan menelan sudah baik\nFisiologis pernapasan sudah adekuat\nTidal volume tercapai 10 – 12 ml/kgbb\nMinute volume tercapai 100 ml/kgbb']
            ],
            legends: [
                '0 : peserta tidak tahu dan tidak benar menyebutkan jawaban',
                '1 : peserta mampu menyebutkan 1,2 jawaban',
                '2 : peserta mampu menyebutkan >2 jawaban',
                '3 : peserta mampu menyampaikan seluruh jawaban dengan benar'
            ]
        };
    }

    // 2. FORMAT: ANESTESI REGIONAL (10 Langkah Tindakan Spinal)
    if (jd.includes('REGIONAL') || jd.includes('SPINAL')) {
        return {
            tipe: 'REGIONAL',
            headers: [['NO', 'KEGIATAN / PROSEDUR KLINIS', 'SKOR 0', 'SKOR 1', 'SKOR 2', 'NILAI']],
            widths: { 0: 8, 1: 114, 2: 12, 3: 12, 4: 12, 5: 12 },
            rows: [
                ['1', 'Memperkenalkan diri kepada pasien'],
                ['2', 'Informed Consent tindakan anestesi spinal'],
                ['3', 'Mempersiapkan alat untuk tindakan anestesi spinal'],
                ['4', 'Mempersiapkan alat untuk tindakan general anestesi jika tindakan spinal gagal dilakukan'],
                ['5', 'Melakukan marker tempat penusukan jarum spinal di L4-L5 atau L3-L4 dengan posisi pasien duduk'],
                ['6', 'Melakukan tindakan aseptic dan antiseptic sebelum tindakan penusukan jarum'],
                ['7', 'Melakukan penusukan jarum spinal sesuai marker, pastikan LCS keluar sebagai tanda bahwa posisi jarum berada di ruang subarachnoid'],
                ['8', 'Masukkan obat anestesi dengan posisi tangan yang baik agar jarum tetap berada di posisi dan lakukan aspirasi sebelum penyuntikan'],
                ['9', 'Setelah obat dimasukkan, Jarum Spinal ditarik, tempat penyuntikan di plester'],
                ['10', 'Pasien ditidurkan kembali']
            ],
            legends: [
                '0 : Tidak dilakukan',
                '1 : Dilakukan, tapi kurang benar',
                '2 : Dilakukan dengan benar'
            ]
        };
    }

    // 3. FALLBACK DEFAULT FORMAT: DAFTAR TILIK CVC / CATHETER
    return {
        tipe: 'CVC',
        headers: [['NO', 'PROSEDUR TINDAKAN KLINIS', 'DILAKUKAN', 'TIDAK DILAKUKAN', 'KETERANGAN']],
        widths: { 0: 8, 1: 104, 2: 18, 3: 18, 4: 22 },
        rows: [
            ['1', 'Penjelasan kepada Pasien tindakan yang akan dilakukan (jika pasien sadar)'],
            ['2', 'Pemasangan monitor tanda vital'],
            ['3', 'Persiapan alat dan posisi pasien'],
            ['4', 'Mencuci tangan dengan antiseptic'],
            ['5', 'Menggunakan gaun dan sarung tangan steril'],
            ['6', 'Melakukan a dan antisepsis lapangan prosedur'],
            ['7', 'Sekali lagi memberitahu pasien prosedur akan dimulai'],
            ['8', 'Memberikan anestetika local'],
            ['9', 'Kanulasi secara tepat lokasi, tepat cara, tepat alat'],
            ['10', 'Konfirmasi posisi kanul telah tepat'],
            ['11', 'Fiksasi kanul'],
            ['12', 'Dressing'],
            ['13', 'Trouble Shooting (Fast flush test, kinking, deairing)']
        ],
        legends: [
            'Format lembar cetak penilaian checklist evaluasi mandiri prosedur invasif.',
            'Residen dinyatakan : LAYAK / TIDAK LAYAK melakukan prosedur'
        ]
    };
};

/**
 * EXPORT UTAMA: CETAK FORM DOPS INDIVIDUAL DENGAN CEKLIS BERSIH TANPA KARAKTER ASING
 */
export const cetakDopsIndividualPDF = async ({ dopsItem = {}, resident = {} }) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const tilik = dapatkanProsedurTilik(dopsItem.jenis_dops);

    // ─── 1. KOP SURAT INSTITUSI KEDOKTERAN UNRI ───
    doc.setFillColor(...BLACK);
    doc.rect(ML, MT, CW, 0.8, 'F');

    const kopY = MT + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI', PW / 2, kopY, { align: 'center' });
    doc.setFontSize(12);
    doc.text('UNIVERSITAS RIAU — FAKULTAS KEDOKTERAN', PW / 2, kopY + 6, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('PROGRAM STUDI ANESTESIOLOGI DAN TERAPI INTENSIF', PW / 2, kopY + 12, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY50);
    doc.text('Kampus Bina Widya Km. 12,5 Simpang Baru Pekanbaru 28293 · Telepon (0761) 66596', PW / 2, kopY + 17.5, { align: 'center' });

    doc.setFillColor(...BLACK);
    doc.rect(ML, kopY + 21, CW, 0.8, 'F');

    // ─── 2. JUDUL FORMULIR EVALUASI ───
    const judulY = kopY + 31;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BLACK);
    
    let judulForm = 'FORM PENILAIAN UJIAN DOPS';
    if (tilik.tipe === 'UMUM') judulForm = 'FORM PENILAIAN UJIAN DOPS ANESTESI UMUM';
    if (tilik.tipe === 'REGIONAL') judulForm = 'FORM PENILAIAN UJIAN DOPS ANESTESI REGIONAL';
    if (tilik.tipe === 'CVC') judulForm = 'DAFTAR TILIK DIRECT OBSERVATIONAL PROCEDURAL SKILL';

    doc.text(judulForm, PW / 2, judulY, { align: 'center' });
    doc.setFontSize(8);
    doc.text('PPDS ANESTESIOLOGI DAN TERAPI INTENSIF', PW / 2, judulY + 4.5, { align: 'center' });

    // Baris Biodata Atas
    const bioY = judulY + 11;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`NAMA RESIDEN   : ${String(resident.name || '—').toUpperCase()}`, ML, bioY);
    doc.text(`NIM / IDENTIFIER: ${String(resident.identifier || '—')}`, ML, bioY + 4.5);
    doc.text(`TANGGAL UJIAN   : ${fmtLong(dopsItem.tanggal)}`, ML + 105, bioY);
    doc.text(`PENGUJI / OBSERVER : ${String(dopsItem.lecturer?.name || '—').toUpperCase()}`, ML + 105, bioY + 4.5);
    
    doc.setLineWidth(0.3);
    doc.line(ML, bioY + 7, PW - MR, bioY + 7);

    // ─── 3. PARSING DATA ARRAY STRUKTUR KONSULEN ───
    let arraySkorRaw = [];
    try {
        const targetField = dopsItem.scores || dopsItem.nilai;
        if (targetField) {
            arraySkorRaw = typeof targetField === 'string' ? JSON.parse(targetField) : targetField;
        }
    } catch (e) {
        console.error("Gagal mendeteksi array murni skor:", e);
    }

    const listSkor = Array.isArray(arraySkorRaw) ? arraySkorRaw : [];

    // Pemetaan baris: Hanya Ceklis ('✓') pada skor terpilih, sisanya dikosongkan total ('')
    const bodyRows = tilik.rows.map((row, index) => {
        const nilaiLangkah = listSkor[index] !== undefined && listSkor[index] !== null ? parseInt(listSkor[index]) : null;

        if (tilik.tipe === 'UMUM') {
            return [
                row[0], 
                row[1], 
                nilaiLangkah === 0 ? '✓' : '', 
                nilaiLangkah === 1 ? '✓' : '', 
                nilaiLangkah === 2 ? '✓' : '', 
                nilaiLangkah === 3 ? '✓' : '', 
                nilaiLangkah !== null ? String(nilaiLangkah) : ''
            ];
        }

        if (tilik.tipe === 'REGIONAL') {
            return [
                row[0], 
                row[1], 
                nilaiLangkah === 0 ? '✓' : '', 
                nilaiLangkah === 1 ? '✓' : '', 
                nilaiLangkah === 2 ? '✓' : '', 
                nilaiLangkah !== null ? String(nilaiLangkah) : ''
            ];
        }

        // Tipe CVC Checklist Dilakukan (1) / Tidak Dilakukan (0)
        return [
            row[0], 
            row[1], 
            nilaiLangkah === 1 ? '✓' : '', 
            nilaiLangkah === 0 ? '✓' : '', 
            ''
        ];
    });

    // Menambahkan Baris Total Skor Akhir Komparatif
    if (tilik.tipe === 'UMUM') {
        bodyRows.push([
            { content: 'TOTAL SKOR AKHIR', colSpan: 6, styles: { fontStyle: 'bold', halign: 'right' } }, 
            { content: String(dopsItem.total_skor || 0), styles: { fontStyle: 'bold', halign: 'center' } }
        ]);
    } else {
        bodyRows.push([
            { content: `TOTAL SKOR EVALUASI DOPS: ${dopsItem.total_skor || 0} POIN`, colSpan: tilik.tipe === 'REGIONAL' ? 6 : 5, styles: { fontStyle: 'bold', halign: 'left', fillColor: [250, 250, 250] } }
        ]);
    }

    autoTable(doc, {
        startY: bioY + 10,
        head: tilik.headers,
        body: bodyRows,
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontSize: 7.5,
            textColor: BLACK,
            lineColor: BLACK,
            lineWidth: 0.2,
            cellPadding: 2.5,
            valign: 'middle',
            halign: 'left'
        },
        headStyles: {
            fillColor: GRAY90,
            textColor: BLACK,
            fontStyle: 'bold',
            lineWidth: 0.3,
            halign: 'center'
        },
        // Atur agar text isi kolom skor berada di tengah-tengah kotak tabel secara presisi
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index > 1) {
                data.cell.styles.halign = 'center';
                if (data.cell.text[0] === '✓') {
                    data.cell.styles.fontStyle = 'bold';
                }
            }
            if (data.section === 'body' && data.column.index === 0) {
                data.cell.styles.halign = 'center';
            }
        },
        columnStyles: tilik.widths,
        margin: { left: ML, right: MR },
        tableWidth: CW
    });

    let currentY = doc.lastAutoTable.finalY + 6;

    // ─── 4. KETERANGAN LEGENDA RUBRIK ───
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Keterangan / Kriteria Penilaian:', ML, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY50);
    
    tilik.legends.forEach((legend, idx) => {
        doc.text(`* ${legend}`, ML + 3, currentY + 3.5 + (idx * 3.5));
    });

    currentY += 5 + (tilik.legends.length * 3.5);

    // Box Kesimpulan Kelayakan Utama (LAYAK / TIDAK LAYAK)
    let statusStr = String(dopsItem.status_kelayakkan || 'TIDAK LAYAK').toUpperCase();
    if (dopsItem.kesimpulan) statusStr = String(dopsItem.kesimpulan).toUpperCase();

    doc.setLineWidth(0.35);
    doc.setDrawColor(...BLACK);
    doc.rect(ML, currentY, CW, 10, 'S');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...BLACK);
    doc.text('STATUS KELAYAKAN RESIDEN :', ML + 4, currentY + 6.5);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`[ ${statusStr} ]`, ML + 48, currentY + 6.5);
    doc.setFont('helvetica', 'normal');
    doc.text('MELAKUKAN TINDAKAN PROSEDUR KLINIS TERSEBUT', ML + 76, currentY + 6.5);

    currentY += 15;

    // ─── 5. SIGNATURE & AUTENTIKASI QR SECURE ───
    const qrSize = 24;
    const qrString = ['UNRI_FK_ANESTESI', 'DOPS_VERIFIED', resident.name, dopsItem.jenis_dops, `SCORE:${dopsItem.total_skor}`, statusStr].join('|');
    const qrUrl = await makeQR(qrString);

    if (qrUrl) {
        doc.addImage(qrUrl, 'PNG', ML + 2, currentY, qrSize, qrSize);
    }

    const tx = ML + qrSize + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('PENYELIA / OBSERVER PENGUJI DIGITAL', tx, currentY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Nama Penguji : ${String(dopsItem.lecturer?.name || '—').toUpperCase()}`, tx, currentY + 9);
    doc.text(`NIP / NIDN    : ${dopsItem.lecturer?.identifier || '—'}`, tx, currentY + 13);
    doc.setFont('helvetica', 'oblique');
    doc.setTextColor(...GRAY50);
    doc.text('Status Dokumen: Sah & Terverifikasi Elektronik Melalui QR-Code Barcode', tx, currentY + 18);

    // Garis Penutup Akhir Halaman
    const footerY = PH - 14;
    doc.setLineWidth(0.4);
    doc.line(ML, footerY, PW - MR, footerY);
    doc.setFontSize(6.5);
    doc.text(`Dicetak otomatis via MedLog AI oleh ${resident.name || 'Residen'} pada ${new Date().toLocaleDateString('id-ID')}`, PW / 2, footerY + 5, { align: 'center' });

    const safeTitle = String(dopsItem.jenis_dops || 'DOPS').replace(/[\s/\\]/g, '_');
    doc.save(`Form_DOPS_${safeTitle}.pdf`);
};