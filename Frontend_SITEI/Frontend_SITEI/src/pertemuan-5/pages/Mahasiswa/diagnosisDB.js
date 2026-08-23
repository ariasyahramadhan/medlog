/**
 * ============================================================
 *  DIAG_DB — Database Diagnosis Lengkap
 *  Sumber: Standar Kompetensi Dokter Indonesia (SKDI),
 *          Konsil Kedokteran Indonesia
 *  Digunakan oleh: InputKasus.jsx (auto-complete diagnosis)
 *
 *  CARA PAKAI:
 *  Ganti konstanta DIAG_DB di InputKasus.jsx dengan:
 *    import { DIAG_DB } from './diagnosisDB';
 *  atau salin isi array ini langsung ke file utama.
 * ============================================================
 */

export const DIAG_DB = [

    // ═══════════════════════════════════════════════════════════
    // 1. SISTEM SARAF
    // ═══════════════════════════════════════════════════════════

    // Genetik & Kongenital
    { label: "Spina Bifida", cat: "Sistem Saraf" },
    { label: "Fenilketonuria", cat: "Sistem Saraf" },

    // Gangguan Neurologik Paediatrik
    { label: "Duchenne Muscular Dystrophy", cat: "Sistem Saraf" },
    { label: "Kejang Demam", cat: "Sistem Saraf" },

    // Infeksi SSP
    { label: "Infeksi Sitomegalovirus", cat: "Sistem Saraf" },
    { label: "Meningitis", cat: "Sistem Saraf" },
    { label: "Ensefalitis", cat: "Sistem Saraf" },
    { label: "Malaria Serebral", cat: "Sistem Saraf" },
    { label: "Tetanus", cat: "Sistem Saraf" },
    { label: "Tetanus Neonatorum", cat: "Sistem Saraf" },
    { label: "Toksoplasmosis Serebral", cat: "Sistem Saraf" },
    { label: "Abses Otak", cat: "Sistem Saraf" },
    { label: "HIV AIDS Tanpa Komplikasi", cat: "Sistem Saraf" },
    { label: "AIDS dengan Komplikasi", cat: "Sistem Saraf" },
    { label: "Hidrosefalus", cat: "Sistem Saraf" },
    { label: "Poliomielitis", cat: "Sistem Saraf" },
    { label: "Rabies", cat: "Sistem Saraf" },
    { label: "Spondilitis TB", cat: "Sistem Saraf" },

    // Tumor SSP
    { label: "Tumor Primer SSP", cat: "Sistem Saraf" },
    { label: "Tumor Sekunder SSP", cat: "Sistem Saraf" },

    // Penurunan Kesadaran
    { label: "Ensefalopati", cat: "Sistem Saraf" },
    { label: "Koma", cat: "Sistem Saraf" },
    { label: "Mati Batang Otak", cat: "Sistem Saraf" },

    // Nyeri Kepala
    { label: "Tension Headache", cat: "Sistem Saraf" },
    { label: "Migren", cat: "Sistem Saraf" },
    { label: "Arteritis Kranial", cat: "Sistem Saraf" },
    { label: "Neuralgia Trigeminal", cat: "Sistem Saraf" },
    { label: "Cluster Headache", cat: "Sistem Saraf" },

    // Penyakit Neurovaskular
    { label: "TIA (Transient Ischemic Attack)", cat: "Sistem Saraf" },
    { label: "Infark Serebral", cat: "Sistem Saraf" },
    { label: "Hematom Intraserebral", cat: "Sistem Saraf" },
    { label: "Perdarahan Subarakhnoid", cat: "Sistem Saraf" },
    { label: "Ensefalopati Hipertensi", cat: "Sistem Saraf" },

    // Lesi Kranial & Batang Otak
    { label: "Bell's Palsy", cat: "Sistem Saraf" },
    { label: "Lesi Batang Otak", cat: "Sistem Saraf" },

    // Gangguan Sistem Vaskular Saraf
    { label: "Meniere's Disease", cat: "Sistem Saraf" },
    { label: "Vertigo (BPPV)", cat: "Sistem Saraf" },
    { label: "Cerebral Palsy", cat: "Sistem Saraf" },

    // Defisit Memori
    { label: "Demensia", cat: "Sistem Saraf" },
    { label: "Penyakit Alzheimer", cat: "Sistem Saraf" },

    // Gangguan Pergerakan
    { label: "Parkinson", cat: "Sistem Saraf" },
    { label: "Gangguan Pergerakan Lainnya", cat: "Sistem Saraf" },

    // Epilepsi & Kejang
    { label: "Kejang", cat: "Sistem Saraf" },
    { label: "Epilepsi", cat: "Sistem Saraf" },
    { label: "Status Epileptikus", cat: "Sistem Saraf" },

    // Penyakit Demielinisasi
    { label: "Sklerosis Multipel", cat: "Sistem Saraf" },

    // Tulang Belakang & Sumsum
    { label: "Amyotrophic Lateral Sclerosis (ALS)", cat: "Sistem Saraf" },
    { label: "Complete Spinal Transaction", cat: "Sistem Saraf" },
    { label: "Sindrom Kauda Equina", cat: "Sistem Saraf" },
    { label: "Neurogenic Bladder", cat: "Sistem Saraf" },
    { label: "Siringomielia", cat: "Sistem Saraf" },
    { label: "Mielopati", cat: "Sistem Saraf" },
    { label: "Dorsal Root Syndrome", cat: "Sistem Saraf" },
    { label: "Acute Medulla Compression", cat: "Sistem Saraf" },
    { label: "Radicular Syndrome", cat: "Sistem Saraf" },
    { label: "Hernia Nucleus Pulposus (HNP)", cat: "Sistem Saraf" },

    // Trauma Saraf
    { label: "Hematom Epidural", cat: "Bedah Saraf" },
    { label: "Hematom Subdural", cat: "Bedah Saraf" },
    { label: "Trauma Medula Spinalis", cat: "Bedah Saraf" },

    // Nyeri Neuropatik
    { label: "Referred Pain", cat: "Sistem Saraf" },
    { label: "Nyeri Neuropatik", cat: "Sistem Saraf" },

    // Penyakit Neuromuskular & Neuropati
    { label: "Sindrom Horner", cat: "Sistem Saraf" },
    { label: "Carpal Tunnel Syndrome", cat: "Sistem Saraf" },
    { label: "Tarsal Tunnel Syndrome", cat: "Sistem Saraf" },
    { label: "Neuropati", cat: "Sistem Saraf" },
    { label: "Peroneal Palsy", cat: "Sistem Saraf" },
    { label: "Guillain Barre Syndrome", cat: "Sistem Saraf" },
    { label: "Miastenia Gravis", cat: "Sistem Saraf" },
    { label: "Polimiositis", cat: "Sistem Saraf" },
    { label: "Neurofibromatosis (Von Recklinghausen Disease)", cat: "Sistem Saraf" },

    // Gangguan Neurobehaviour
    { label: "Amnesia Pascatrauma", cat: "Sistem Saraf" },
    { label: "Afasia", cat: "Sistem Saraf" },
    { label: "Mild Cognitive Impairment (MCI)", cat: "Sistem Saraf" },

    // Bedah Saraf (Tambahan dari DIAG_DB Lama)
    { label: "Cedera Kepala Berat (CKB)", cat: "Bedah Saraf" },
    { label: "Cedera Kepala Sedang (CKS)", cat: "Bedah Saraf" },
    { label: "Epidural Hematoma (EDH)", cat: "Bedah Saraf" },
    { label: "Subdural Hematoma (SDH)", cat: "Bedah Saraf" },
    { label: "Subarachnoid Hemorrhage (SAH)", cat: "Bedah Saraf" },
    { label: "Stroke Iskemik", cat: "Bedah Saraf" },
    { label: "Stroke Hemoragik", cat: "Bedah Saraf" },
    { label: "Tumor Otak", cat: "Bedah Saraf" },
    { label: "Hydrocephalus", cat: "Bedah Saraf" },
    { label: "HNP Servikal", cat: "Bedah Saraf" },
    { label: "Spinal Stenosis", cat: "Bedah Saraf" },

    // ═══════════════════════════════════════════════════════════
    // 2. PSIKIATRI
    // ═══════════════════════════════════════════════════════════

    // Gangguan Mental Organik
    { label: "Delirium Non-Zat Psikoaktif", cat: "Psikiatri" },

    // Penggunaan Zat Psikoaktif
    { label: "Intoksikasi Akut Zat Psikoaktif", cat: "Psikiatri" },
    { label: "Adiksi / Ketergantungan Narkoba", cat: "Psikiatri" },
    { label: "Delirium akibat Zat Psikoaktif / Alkohol", cat: "Psikiatri" },

    // Psikosis
    { label: "Skizofrenia", cat: "Psikiatri" },
    { label: "Gangguan Waham", cat: "Psikiatri" },
    { label: "Gangguan Psikotik", cat: "Psikiatri" },
    { label: "Gangguan Skizoafektif", cat: "Psikiatri" },
    { label: "Gangguan Bipolar Episode Manik", cat: "Psikiatri" },
    { label: "Gangguan Bipolar Episode Depresif", cat: "Psikiatri" },
    { label: "Gangguan Siklotimia", cat: "Psikiatri" },
    { label: "Depresi Endogen", cat: "Psikiatri" },
    { label: "Gangguan Distimia", cat: "Psikiatri" },
    { label: "Gangguan Depresif Tidak Terklasifikasikan", cat: "Psikiatri" },
    { label: "Baby Blues / Post-partum Depression", cat: "Psikiatri" },

    // Gangguan Cemas Fobia
    { label: "Agorafobia dengan/tanpa Panik", cat: "Psikiatri" },
    { label: "Fobia Sosial", cat: "Psikiatri" },
    { label: "Fobia Spesifik", cat: "Psikiatri" },

    // Gangguan Cemas Lainnya
    { label: "Gangguan Panik", cat: "Psikiatri" },
    { label: "Gangguan Cemas Menyeluruh", cat: "Psikiatri" },
    { label: "Gangguan Campuran Cemas Depresi", cat: "Psikiatri" },
    { label: "Gangguan Obsesif-Kompulsif", cat: "Psikiatri" },
    { label: "Reaksi Terhadap Stres Berat / Gangguan Penyesuaian", cat: "Psikiatri" },
    { label: "Post Traumatic Stress Disorder (PTSD)", cat: "Psikiatri" },
    { label: "Gangguan Disosiasi (Konversi)", cat: "Psikiatri" },
    { label: "Gangguan Somatoform", cat: "Psikiatri" },
    { label: "Trikotilomania", cat: "Psikiatri" },

    // Gangguan Kepribadian & Perilaku
    { label: "Gangguan Kepribadian", cat: "Psikiatri" },
    { label: "Gangguan Identitas Gender", cat: "Psikiatri" },
    { label: "Gangguan Preferensi Seksual", cat: "Psikiatri" },

    // Gangguan Emosional Anak & Remaja
    { label: "Gangguan Perkembangan Pervasif", cat: "Psikiatri" },
    { label: "Retardasi Mental", cat: "Psikiatri" },
    { label: "ADHD (Gangguan Pemusatan Perhatian & Hiperaktif)", cat: "Psikiatri" },
    { label: "Autisme", cat: "Psikiatri" },
    { label: "Gangguan Tingkah Laku (Conduct Disorder)", cat: "Psikiatri" },

    // Gangguan Makan
    { label: "Anoreksia Nervosa", cat: "Psikiatri" },
    { label: "Bulimia", cat: "Psikiatri" },
    { label: "Pica", cat: "Psikiatri" },

    // Tics
    { label: "Gilles de la Tourette Syndrome", cat: "Psikiatri" },
    { label: "Chronic Motor or Vocal Tics Disorder", cat: "Psikiatri" },
    { label: "Transient Tics Disorder", cat: "Psikiatri" },

    // Gangguan Ekskresi
    { label: "Functional Encopresis", cat: "Psikiatri" },
    { label: "Functional Enuresis", cat: "Psikiatri" },

    // Gangguan Bicara
    { label: "Uncoordinated Speech", cat: "Psikiatri" },

    // Disfungsi Seksual
    { label: "Parafilia", cat: "Psikiatri" },
    { label: "Gangguan Keinginan & Gairah Seksual", cat: "Psikiatri" },
    { label: "Gangguan Orgasmus / Ejakulasi Dini", cat: "Psikiatri" },
    { label: "Sexual Pain Disorder (Vaginismus, Dispareunia)", cat: "Psikiatri" },

    // Gangguan Tidur
    { label: "Insomnia", cat: "Psikiatri" },
    { label: "Hipersomnia", cat: "Psikiatri" },
    { label: "Sleep-Wake Cycle Disturbance", cat: "Psikiatri" },
    { label: "Nightmare", cat: "Psikiatri" },
    { label: "Sleep Walking", cat: "Psikiatri" },

    // ═══════════════════════════════════════════════════════════
    // 3. SISTEM INDRA — MATA
    // ═══════════════════════════════════════════════════════════

    // Konjunktiva
    { label: "Benda Asing di Konjungtiva", cat: "Mata" },
    { label: "Konjungtivitis", cat: "Mata" },
    { label: "Pterigium", cat: "Mata" },
    { label: "Perdarahan Subkonjungtiva", cat: "Mata" },
    { label: "Mata Kering", cat: "Mata" },

    // Kelopak Mata
    { label: "Blefaritis", cat: "Mata" },
    { label: "Hordeolum", cat: "Mata" },
    { label: "Chalazion", cat: "Mata" },
    { label: "Laserasi Kelopak Mata", cat: "Mata" },
    { label: "Entropion", cat: "Mata" },
    { label: "Trikiasis", cat: "Mata" },
    { label: "Lagoftalmus", cat: "Mata" },
    { label: "Epikantus", cat: "Mata" },
    { label: "Ptosis", cat: "Mata" },
    { label: "Retraksi Kelopak Mata", cat: "Mata" },
    { label: "Xanthelasma", cat: "Mata" },

    // Aparatus Lakrimalis
    { label: "Dakrioadenitis", cat: "Mata" },
    { label: "Dakriosistitis", cat: "Mata" },
    { label: "Dakriostenosis", cat: "Mata" },
    { label: "Laserasi Duktus Lakrimal", cat: "Mata" },

    // Sklera
    { label: "Skleritis", cat: "Mata" },
    { label: "Episkleritis", cat: "Mata" },

    // Kornea
    { label: "Erosi Kornea", cat: "Mata" },
    { label: "Benda Asing di Kornea", cat: "Mata" },
    { label: "Luka Bakar Kornea", cat: "Mata" },
    { label: "Keratitis", cat: "Mata" },
    { label: "Kerato-Konjungtivitis Sicca", cat: "Mata" },
    { label: "Edema Kornea", cat: "Mata" },
    { label: "Keratokonus", cat: "Mata" },
    { label: "Xerophtalmia", cat: "Mata" },

    // Bola Mata
    { label: "Endoftalmitis", cat: "Mata" },
    { label: "Mikroftalmos", cat: "Mata" },

    // Anterior Chamber
    { label: "Hifema", cat: "Mata" },
    { label: "Hipopion", cat: "Mata" },

    // Iris & Badan Silier
    { label: "Iridosisklitis / Iritis", cat: "Mata" },
    { label: "Tumor Iris", cat: "Mata" },

    // Lensa
    { label: "Katarak Senilis", cat: "Mata" },
    { label: "Afakia Kongenital", cat: "Mata" },
    { label: "Dislokasi Lensa", cat: "Mata" },

    // Akomodasi & Refraksi
    { label: "Hipermetropia Ringan", cat: "Mata" },
    { label: "Miopia Ringan", cat: "Mata" },
    { label: "Astigmatism Ringan", cat: "Mata" },
    { label: "Presbiopia", cat: "Mata" },
    { label: "Anisometropia pada Dewasa", cat: "Mata" },
    { label: "Anisometropia pada Anak", cat: "Mata" },
    { label: "Ambliopia", cat: "Mata" },
    { label: "Diplopia Binokuler", cat: "Mata" },
    { label: "Buta Senja", cat: "Mata" },
    { label: "Skotoma", cat: "Mata" },
    { label: "Hemianopia Bitemporal & Homonymous", cat: "Mata" },
    { label: "Gangguan Lapang Pandang", cat: "Mata" },

    // Retina
    { label: "Ablasio Retina", cat: "Mata" },
    { label: "Perdarahan Retina / Oklusi Pembuluh Darah Retina", cat: "Mata" },
    { label: "Degenerasi Makula karena Usia", cat: "Mata" },
    { label: "Retinopati Diabetik", cat: "Mata" },
    { label: "Retinopati Hipertensi", cat: "Mata" },
    { label: "Retinopati Prematur", cat: "Mata" },
    { label: "Korioretinitis", cat: "Mata" },

    // Diskus Optik
    { label: "Optic Disc Cupping", cat: "Mata" },
    { label: "Edema Papil", cat: "Mata" },
    { label: "Atrofi Optik", cat: "Mata" },
    { label: "Neuropati Optik", cat: "Mata" },
    { label: "Neuritis Optik", cat: "Mata" },

    // Glaukoma
    { label: "Glaukoma Akut", cat: "Mata" },
    { label: "Glaukoma Lainnya", cat: "Mata" },
    { label: "Strabismus", cat: "Mata" },
    { label: "Retinal Detachment", cat: "Mata" },

    // ═══════════════════════════════════════════════════════════
    // 3. SISTEM INDRA — TELINGA
    // ═══════════════════════════════════════════════════════════

    { label: "Tuli Kongenital / Perseptif / Konduktif", cat: "THT" },
    { label: "Inflamasi pada Aurikular", cat: "THT" },
    { label: "Herpes Zoster pada Telinga", cat: "THT" },
    { label: "Fistula Pre-Aurikular", cat: "THT" },
    { label: "Labirintitis", cat: "THT" },
    { label: "Otitis Eksterna", cat: "THT" },
    { label: "Otitis Media Akut", cat: "THT" },
    { label: "Otitis Media Serosa", cat: "THT" },
    { label: "Otitis Media Kronik (OMSK)", cat: "THT" },
    { label: "Mastoiditis", cat: "THT" },
    { label: "Miringitis Bullosa", cat: "THT" },
    { label: "Benda Asing Telinga", cat: "THT" },
    { label: "Perforasi Membran Timpani", cat: "THT" },
    { label: "Otosklerosis", cat: "THT" },
    { label: "Timpanosklerosis", cat: "THT" },
    { label: "Kolesteatoma", cat: "THT" },
    { label: "Presbiakusis", cat: "THT" },
    { label: "Serumen Prop", cat: "THT" },
    { label: "Mabuk Perjalanan", cat: "THT" },
    { label: "Trauma Akustik Akut", cat: "THT" },
    { label: "Trauma Aurikular", cat: "THT" },

    // Hidung & Sinus
    { label: "Deviasi Septum Hidung", cat: "THT" },
    { label: "Furunkel pada Hidung", cat: "THT" },
    { label: "Rhinitis Akut", cat: "THT" },
    { label: "Rhinitis Vasomotor", cat: "THT" },
    { label: "Rhinitis Alergika", cat: "THT" },
    { label: "Rhinitis Kronik", cat: "THT" },
    { label: "Rhinitis Medikamentosa", cat: "THT" },
    { label: "Sinusitis", cat: "THT" },
    { label: "Sinusitis Frontal Akut", cat: "THT" },
    { label: "Sinusitis Maksilaris Akut", cat: "THT" },
    { label: "Sinusitis Kronik", cat: "THT" },
    { label: "Benda Asing Hidung", cat: "THT" },
    { label: "Epistaksis", cat: "THT" },
    { label: "Etmoiditis Akut", cat: "THT" },
    { label: "Polip Nasi", cat: "THT" },
    { label: "Epistaksis Masif", cat: "THT" },

    // Kepala & Leher
    { label: "Fistula dan Kista Brankial Lateral & Medial", cat: "THT" },
    { label: "Higroma Kistik", cat: "THT" },
    { label: "Tortikolis", cat: "THT" },
    { label: "Abses Bezold", cat: "THT" },

    // Laring & Faring
    { label: "Faringitis", cat: "THT" },
    { label: "Tonsilitis", cat: "THT" },
    { label: "Tonsilitis Kronis Hipertrofi", cat: "THT" },
    { label: "Laringitis", cat: "THT" },
    { label: "Hipertrofi Adenoid", cat: "THT" },
    { label: "Adenoid Hipertrofi", cat: "THT" },
    { label: "Abses Peritonsilar", cat: "THT" },
    { label: "Pseudo-Croup / Acute Epiglotitis", cat: "THT" },
    { label: "Difteria (THT)", cat: "THT" },
    { label: "Karsinoma Laring", cat: "THT" },
    { label: "Tumor Laring", cat: "THT" },
    { label: "Karsinoma Nasofaring", cat: "THT" },

    // Trakea
    { label: "Trakeitis", cat: "THT" },
    { label: "Aspirasi", cat: "THT" },
    { label: "Benda Asing Jalan Napas", cat: "THT" },

    // ═══════════════════════════════════════════════════════════
    // 4. SISTEM RESPIRASI
    // ═══════════════════════════════════════════════════════════

    { label: "Influenza", cat: "Paru & Toraks" },
    { label: "Pertusis", cat: "Paru & Toraks" },
    { label: "Acute Respiratory Distress Syndrome (ARDS)", cat: "Paru & Toraks" },
    { label: "SARS", cat: "Paru & Toraks" },
    { label: "Flu Burung", cat: "Paru & Toraks" },
    { label: "Asma Bronkial", cat: "Paru & Toraks" },
    { label: "Status Asmatikus (Asma Akut Berat)", cat: "Paru & Toraks" },
    { label: "Asma Berat (Status Asmatikus)", cat: "Paru & Toraks" },
    { label: "Bronkitis Akut", cat: "Paru & Toraks" },
    { label: "Bronkiolitis Akut", cat: "Paru & Toraks" },
    { label: "Bronkiektasis", cat: "Paru & Toraks" },
    { label: "Displasia Bronkopulmonar", cat: "Paru & Toraks" },
    { label: "Karsinoma Paru", cat: "Paru & Toraks" },
    { label: "Tumor Paru", cat: "Paru & Toraks" },
    { label: "Pneumonia / Bronkopneumonia", cat: "Paru & Toraks" },
    { label: "Pneumonia Berat", cat: "Paru & Toraks" },
    { label: "Pneumonia Aspirasi", cat: "Paru & Toraks" },
    { label: "Tuberkulosis Paru Tanpa Komplikasi", cat: "Paru & Toraks" },
    { label: "Tuberkulosis Paru", cat: "Paru & Toraks" },
    { label: "Tuberkulosis dengan HIV", cat: "Paru & Toraks" },
    { label: "MDR TB (Multi Drug Resistance TB)", cat: "Paru & Toraks" },
    { label: "Pneumotoraks Ventil", cat: "Paru & Toraks" },
    { label: "Pneumotoraks", cat: "Paru & Toraks" },
    { label: "Efusi Pleura", cat: "Paru & Toraks" },
    { label: "Efusi Pleura Masif", cat: "Paru & Toraks" },
    { label: "Emfisema Paru", cat: "Paru & Toraks" },
    { label: "Atelektasis", cat: "Paru & Toraks" },
    { label: "PPOK Eksaserbasi Akut", cat: "Paru & Toraks" },
    { label: "Edema Paru", cat: "Paru & Toraks" },
    { label: "Infark Paru", cat: "Paru & Toraks" },
    { label: "Abses Paru", cat: "Paru & Toraks" },
    { label: "Emboli Paru", cat: "Paru & Toraks" },
    { label: "Kistik Fibrosis", cat: "Paru & Toraks" },
    { label: "Hemotoraks", cat: "Paru & Toraks" },
    { label: "Empiema Toraks", cat: "Paru & Toraks" },
    { label: "Tumor Mediastinum", cat: "Paru & Toraks" },
    { label: "Pnemokoniasis", cat: "Paru & Toraks" },
    { label: "Penyakit Paru Intersisial", cat: "Paru & Toraks" },
    { label: "Obstructive Sleep Apnea (OSA)", cat: "Paru & Toraks" },

    // ═══════════════════════════════════════════════════════════
    // 5. SISTEM KARDIOVASKULAR
    // ═══════════════════════════════════════════════════════════

    // Jantung
    { label: "Kelainan Jantung Kongenital (VSD/ASD/PDA/TOF)", cat: "Kardiovaskular" },
    { label: "Penyakit Jantung Bawaan (ASD/VSD/PDA)", cat: "Kardiovaskular" },
    { label: "Endokarditis", cat: "Kardiovaskular" },
    { label: "Miokarditis", cat: "Kardiovaskular" },
    { label: "Perikarditis", cat: "Kardiovaskular" },
    { label: "Syok Septik", cat: "Kardiovaskular" },
    { label: "Syok Hipovolemik", cat: "Kardiovaskular" },
    { label: "Syok Kardiogenik", cat: "Kardiovaskular" },
    { label: "Syok Neurogenik", cat: "Kardiovaskular" },
    { label: "Syok Anafilaktik", cat: "Kardiovaskular" },
    { label: "Angina Pektoris", cat: "Kardiovaskular" },
    { label: "Infark Miokard Akut (IMA)", cat: "Kardiovaskular" },
    { label: "Penyakit Jantung Koroner (PJK)", cat: "Kardiovaskular" },
    { label: "Gagal Jantung Akut", cat: "Kardiovaskular" },
    { label: "Gagal Jantung Kongestif (GJK)", cat: "Kardiovaskular" },
    { label: "Gagal Jantung Kronik", cat: "Kardiovaskular" },
    { label: "Cardiorespiratory Arrest", cat: "Kardiovaskular" },
    { label: "Kelainan Katup Jantung (Stenosis / Regurgitasi)", cat: "Kardiovaskular" },
    { label: "Stenosis Mitral", cat: "Kardiovaskular" },
    { label: "Regurgitasi Mitral", cat: "Kardiovaskular" },
    { label: "Stenosis Aorta", cat: "Kardiovaskular" },
    { label: "Takikardi Supraventrikular", cat: "Kardiovaskular" },
    { label: "Takikardi Ventrikular", cat: "Kardiovaskular" },
    { label: "Atrial Fibrilasi", cat: "Kardiovaskular" },
    { label: "Fibrilasi Ventrikular", cat: "Kardiovaskular" },
    { label: "Atrial Flutter", cat: "Kardiovaskular" },
    { label: "Ekstrasistol Supraventrikular / Ventrikular", cat: "Kardiovaskular" },
    { label: "Bundle Branch Block", cat: "Kardiovaskular" },
    { label: "Aritmia Lainnya", cat: "Kardiovaskular" },
    { label: "Kardiomiopati", cat: "Kardiovaskular" },
    { label: "Kor Pulmonale Akut", cat: "Kardiovaskular" },
    { label: "Kor Pulmonale Kronik", cat: "Kardiovaskular" },
    { label: "Tamponade Jantung", cat: "Kardiovaskular" },

    // Aorta & Arteri
    { label: "Hipertensi Esensial", cat: "Kardiovaskular" },
    { label: "Hipertensi", cat: "Kardiovaskular" },
    { label: "Hipertensi Sekunder", cat: "Kardiovaskular" },
    { label: "Hipertensi Pulmoner", cat: "Kardiovaskular" },
    { label: "Penyakit Raynaud", cat: "Kardiovaskular" },
    { label: "Trombosis Arteri", cat: "Kardiovaskular" },
    { label: "Koarktasio Aorta", cat: "Kardiovaskular" },
    { label: "Penyakit Buerger (Thromboangiitis Obliterans)", cat: "Kardiovaskular" },
    { label: "Emboli Arteri", cat: "Kardiovaskular" },
    { label: "Aterosklerosis", cat: "Kardiovaskular" },
    { label: "Subclavian Steal Syndrome", cat: "Kardiovaskular" },
    { label: "Aneurisma Aorta", cat: "Kardiovaskular" },
    { label: "Aneurisma Aorta Abdominalis", cat: "Kardiovaskular" },
    { label: "Aneurisma Diseksi", cat: "Kardiovaskular" },
    { label: "Klaudikasio", cat: "Kardiovaskular" },
    { label: "Penyakit Jantung Reumatik", cat: "Kardiovaskular" },

    // Vena & Limfe
    { label: "Tromboflebitis", cat: "Kardiovaskular" },
    { label: "Limfangitis", cat: "Kardiovaskular" },
    { label: "Varises (Primer / Sekunder)", cat: "Kardiovaskular" },
    { label: "Obstructed Venous Return", cat: "Kardiovaskular" },
    { label: "Trombosis Vena Dalam (DVT)", cat: "Kardiovaskular" },
    { label: "Emboli Vena", cat: "Kardiovaskular" },
    { label: "Limfedema (Primer / Sekunder)", cat: "Kardiovaskular" },
    { label: "Insufisiensi Vena Kronik", cat: "Kardiovaskular" },

    // ═══════════════════════════════════════════════════════════
    // 6. SISTEM GASTROINTESTINAL, HEPATOBILIER, & PANKREAS
    // ═══════════════════════════════════════════════════════════

    // Mulut
    { label: "Sumbing pada Bibir dan Palatum", cat: "Bedah Umum" },
    { label: "Kandidiasis Mulut", cat: "Penyakit Dalam" },
    { label: "Ulkus Mulut (Aptosa / Herpes)", cat: "Penyakit Dalam" },
    { label: "Glositis", cat: "Penyakit Dalam" },
    { label: "Leukoplakia", cat: "Penyakit Dalam" },
    { label: "Angina Ludwig", cat: "Penyakit Dalam" },
    { label: "Parotitis", cat: "Penyakit Dalam" },
    { label: "Karies Gigi", cat: "Penyakit Dalam" },

    // Esofagus
    { label: "Atresia Esofagus", cat: "Bedah Anak" },
    { label: "Akalasia", cat: "Bedah Umum" },
    { label: "Esofagitis Refluks", cat: "Penyakit Dalam" },
    { label: "Lesi Korosif pada Esofagus", cat: "Bedah Umum" },
    { label: "Varises Esofagus", cat: "Penyakit Dalam" },
    { label: "Ruptur Esofagus", cat: "Bedah Umum" },

    // Dinding, Rongga Abdomen & Hernia
    { label: "Hernia Inguinalis", cat: "Bedah Umum" },
    { label: "Hernia Inguinalis Inkarserata", cat: "Bedah Umum" },
    { label: "Hernia Inguinalis Strangulata", cat: "Bedah Umum" },
    { label: "Hernia Femoralis", cat: "Bedah Umum" },
    { label: "Hernia Umbilikalis", cat: "Bedah Umum" },
    { label: "Hernia Diafragmatika", cat: "Bedah Umum" },
    { label: "Peritonitis Generalisata", cat: "Bedah Umum" },
    { label: "Perforasi Usus", cat: "Bedah Umum" },
    { label: "Perforasi Gaster", cat: "Bedah Umum" },
    { label: "Malrotasi Traktus Gastrointestinal", cat: "Bedah Anak" },
    { label: "Infeksi pada Umbilikus", cat: "Penyakit Dalam" },

    // Lambung, Duodenum, Jejunum, Ileum
    { label: "Gastritis", cat: "Penyakit Dalam" },
    { label: "Gastroenteritis", cat: "Penyakit Dalam" },
    { label: "Refluks Gastroesofagus", cat: "Penyakit Dalam" },
    { label: "Ulkus Gaster / Duodenum", cat: "Penyakit Dalam" },
    { label: "Stenosis Pilorik", cat: "Bedah Anak" },
    { label: "Atresia Intestinal", cat: "Bedah Anak" },
    { label: "Divertikulum Meckel", cat: "Bedah Umum" },
    { label: "Apendisitis Akut", cat: "Bedah Umum" },
    { label: "Apendisitis Perforasi", cat: "Bedah Umum" },
    { label: "Abses Apendiks", cat: "Bedah Umum" },
    { label: "Demam Tifoid", cat: "Penyakit Dalam" },
    { label: "Perdarahan Gastrointestinal", cat: "Penyakit Dalam" },
    { label: "Ileus Obstruktif", cat: "Bedah Umum" },
    { label: "Ileus Paralitik", cat: "Bedah Umum" },
    { label: "Malabsorbsi", cat: "Penyakit Dalam" },
    { label: "Intoleransi Makanan", cat: "Penyakit Dalam" },
    { label: "Alergi Makanan", cat: "Penyakit Dalam" },
    { label: "Keracunan Makanan", cat: "Penyakit Dalam" },
    { label: "Botulisme", cat: "Penyakit Dalam" },

    // Infestasi Cacing
    { label: "Penyakit Cacing Tambang", cat: "Penyakit Dalam" },
    { label: "Strongiloidiasis", cat: "Penyakit Dalam" },
    { label: "Askariasis", cat: "Penyakit Dalam" },
    { label: "Skistosomiasis", cat: "Penyakit Dalam" },
    { label: "Taeniasis", cat: "Penyakit Dalam" },

    // Hepar
    { label: "Hepatitis A", cat: "Penyakit Dalam" },
    { label: "Hepatitis B", cat: "Penyakit Dalam" },
    { label: "Hepatitis C", cat: "Penyakit Dalam" },
    { label: "Abses Hepar Amoeba", cat: "Penyakit Dalam" },
    { label: "Perlemakan Hepar", cat: "Penyakit Dalam" },
    { label: "Sirosis Hepatis", cat: "Penyakit Dalam" },
    { label: "Gagal Hepar", cat: "Penyakit Dalam" },
    { label: "Neoplasma Hepar", cat: "Penyakit Dalam" },
    { label: "Ruptur Hepar", cat: "Bedah Umum" },

    // Kandung Empedu & Pankreas
    { label: "Kolesistitis Akut", cat: "Bedah Umum" },
    { label: "Kolelitiasis", cat: "Bedah Umum" },
    { label: "Kolangitis Akut", cat: "Bedah Umum" },
    { label: "Kole(doko)litiasis", cat: "Bedah Umum" },
    { label: "Empiema dan Hidrops Kandung Empedu", cat: "Bedah Umum" },
    { label: "Atresia Biliaris", cat: "Bedah Anak" },
    { label: "Pankreatitis Akut", cat: "Bedah Umum" },
    { label: "Pankreatitis", cat: "Bedah Umum" },
    { label: "Karsinoma Pankreas", cat: "Bedah Umum" },

    // Kolon
    { label: "Divertikulosis / Divertikulitis", cat: "Bedah Umum" },
    { label: "Kolitis", cat: "Penyakit Dalam" },
    { label: "Disentri Basiler / Disentri Amuba", cat: "Penyakit Dalam" },
    { label: "Penyakit Crohn", cat: "Penyakit Dalam" },
    { label: "Kolitis Ulseratif", cat: "Penyakit Dalam" },
    { label: "Irritable Bowel Syndrome (IBS)", cat: "Penyakit Dalam" },
    { label: "Polip / Adenoma Kolon", cat: "Bedah Umum" },
    { label: "Karsinoma Kolon", cat: "Bedah Umum" },
    { label: "Tumor Kolon", cat: "Bedah Umum" },
    { label: "Karsinoma Rektum", cat: "Bedah Umum" },
    { label: "Penyakit Hirschsprung", cat: "Bedah Anak" },
    { label: "Hirschsprung Disease", cat: "Bedah Anak" },
    { label: "Intususepsi / Invaginasi", cat: "Bedah Anak" },
    { label: "Volvulus Sigmoid", cat: "Bedah Umum" },

    // Rektum & Anus
    { label: "Atresia Anus", cat: "Bedah Anak" },
    { label: "Proktitis", cat: "Penyakit Dalam" },
    { label: "Abses Perianal", cat: "Bedah Umum" },
    { label: "Hemoroid Grade 1-2", cat: "Bedah Umum" },
    { label: "Hemoroid Interna/Eksterna Grade III-IV", cat: "Bedah Umum" },
    { label: "Fistula Ani", cat: "Bedah Umum" },
    { label: "Fisura Anus", cat: "Bedah Umum" },
    { label: "Prolaps Rektum / Anus", cat: "Bedah Umum" },

    // Neoplasma GI
    { label: "Limfoma", cat: "Penyakit Dalam" },
    { label: "Gastrointestinal Stromal Tumor (GIST)", cat: "Bedah Umum" },

    // ═══════════════════════════════════════════════════════════
    // 7. SISTEM GINJAL & SALURAN KEMIH
    // ═══════════════════════════════════════════════════════════

    { label: "Infeksi Saluran Kemih", cat: "Urologi" },
    { label: "Glomerulonefritis Akut", cat: "Nefrologi" },
    { label: "Glomerulonefritis Kronik", cat: "Nefrologi" },
    { label: "Gonore", cat: "Penyakit Dalam" },
    { label: "Karsinoma Sel Renal", cat: "Urologi" },
    { label: "Karsinoma Renal", cat: "Urologi" },
    { label: "Tumor Wilms", cat: "Urologi" },
    { label: "Gagal Ginjal Akut (AKI)", cat: "Nefrologi" },
    { label: "Penyakit Ginjal Kronik (CKD) Stage V", cat: "Nefrologi" },
    { label: "Sindrom Nefrotik", cat: "Nefrologi" },
    { label: "Kolik Renal", cat: "Urologi" },
    { label: "Batu Ginjal (Nefrolitiasis)", cat: "Urologi" },
    { label: "Batu Ureter (Ureterolitiasis)", cat: "Urologi" },
    { label: "Batu Vesika Urinaria", cat: "Urologi" },
    { label: "Batu Saluran Kemih Tanpa Kolik", cat: "Urologi" },
    { label: "Ginjal Polikistik Simtomatik", cat: "Nefrologi" },
    { label: "Pielonefritis Tanpa Komplikasi", cat: "Nefrologi" },
    { label: "Nekrosis Tubular Akut", cat: "Nefrologi" },
    { label: "Hidronefrosis", cat: "Urologi" },
    { label: "Retensi Urin Akut", cat: "Urologi" },

    // Alat Kelamin Pria
    { label: "Hipospadia", cat: "Urologi" },
    { label: "Epispadia", cat: "Urologi" },
    { label: "Cryptorchidismus", cat: "Bedah Anak" },
    { label: "Varikokel", cat: "Urologi" },
    { label: "Hidrokel", cat: "Urologi" },
    { label: "Fimosis", cat: "Urologi" },
    { label: "Parafimosis", cat: "Urologi" },
    { label: "Spermatokel", cat: "Urologi" },
    { label: "Epididimitis", cat: "Urologi" },
    { label: "Prostatitis", cat: "Urologi" },
    { label: "Torsio Testis", cat: "Urologi" },
    { label: "Ruptur Uretra", cat: "Urologi" },
    { label: "Ruptur Kandung Kencing", cat: "Urologi" },
    { label: "Ruptur Ginjal", cat: "Urologi" },
    { label: "Karsinoma Uroterial", cat: "Urologi" },
    { label: "Karsinoma Vesika Urinaria", cat: "Urologi" },
    { label: "Karsinoma Prostat", cat: "Urologi" },
    { label: "Benign Prostatic Hyperplasia (BPH)", cat: "Urologi" },
    { label: "Striktur Uretra", cat: "Urologi" },
    { label: "Priapismus", cat: "Urologi" },
    { label: "Chancroid", cat: "Urologi" },

    // ═══════════════════════════════════════════════════════════
    // 8. SISTEM REPRODUKSI
    // ═══════════════════════════════════════════════════════════

    // Infeksi Ginekologi
    { label: "Sifilis", cat: "Ginekologi" },
    { label: "Sindrom Duh Genital (Gonore / Nongonore)", cat: "Ginekologi" },
    { label: "Infeksi Herpes Tipe 2", cat: "Ginekologi" },
    { label: "Infeksi Saluran Kemih Bagian Bawah", cat: "Ginekologi" },
    { label: "Vulvitis", cat: "Ginekologi" },
    { label: "Kondiloma Akuminatum", cat: "Ginekologi" },
    { label: "Vaginitis", cat: "Ginekologi" },
    { label: "Vaginosis Bakterialis", cat: "Ginekologi" },
    { label: "Servisitis", cat: "Ginekologi" },
    { label: "Salpingitis", cat: "Ginekologi" },
    { label: "Abses Tubo-Ovarium", cat: "Ginekologi" },
    { label: "Penyakit Radang Panggul", cat: "Ginekologi" },

    // Kehamilan
    { label: "Kehamilan Normal", cat: "Obstetri" },
    { label: "Infeksi Intra-Uterin / Korioamnionitis", cat: "Obstetri" },
    { label: "Infeksi pada Kehamilan (TORCH, Hepatitis B, Malaria)", cat: "Obstetri" },
    { label: "Aborsi Mengancam", cat: "Abortus" },
    { label: "Aborsi Spontan Inkomplit", cat: "Abortus" },
    { label: "Abortus Inkomplit", cat: "Abortus" },
    { label: "Aborsi Spontan Komplit", cat: "Abortus" },
    { label: "Hiperemesis Gravidarum", cat: "Obstetri" },
    { label: "Mola Hidatidosa", cat: "Obstetri" },
    { label: "Hipertensi pada Kehamilan", cat: "Obstetri" },
    { label: "Preeklamsia Berat", cat: "Obstetri" },
    { label: "Preeklampsia", cat: "Obstetri" },
    { label: "Eklamsia", cat: "Obstetri" },
    { label: "Diabetes Gestasional", cat: "Obstetri" },
    { label: "Insufisiensi Plasenta", cat: "Obstetri" },
    { label: "Plasenta Previa Totalis", cat: "Obstetri" },
    { label: "Solusio Plasenta", cat: "Obstetri" },
    { label: "Abrupsio Plasenta", cat: "Obstetri" },
    { label: "Inkompeten Serviks", cat: "Obstetri" },
    { label: "Polihidramnion", cat: "Obstetri" },
    { label: "Kelainan Letak Janin", cat: "Obstetri" },
    { label: "Kehamilan Ganda", cat: "Obstetri" },
    { label: "Janin Tumbuh Lambat", cat: "Obstetri" },
    { label: "Diproporsi Kepala Panggul", cat: "Obstetri" },
    { label: "Anemia Defisiensi Besi pada Kehamilan", cat: "Obstetri" },

    // Persalinan & Nifas
    { label: "Intra-Uterine Fetal Death (IUFD)", cat: "Obstetri" },
    { label: "Persalinan Preterm", cat: "Obstetri" },
    { label: "Partus Prematurus Imminens", cat: "Obstetri" },
    { label: "Ruptur Uteri", cat: "Obstetri" },
    { label: "Ketuban Pecah Dini (KPD)", cat: "Obstetri" },
    { label: "Distosia", cat: "Obstetri" },
    { label: "Distosia Bahu", cat: "Obstetri" },
    { label: "Malpresentasi", cat: "Obstetri" },
    { label: "Presentasi Bokong", cat: "Obstetri" },
    { label: "Partus Lama", cat: "Obstetri" },
    { label: "Prolaps Tali Pusat", cat: "Obstetri" },
    { label: "Hipoksia Janin / Gawat Janin (Fetal Distress)", cat: "Obstetri" },
    { label: "Ruptur Serviks", cat: "Obstetri" },
    { label: "Ruptur Perineum Tingkat 1-2", cat: "Obstetri" },
    { label: "Ruptur Perineum Tingkat 3-4", cat: "Obstetri" },
    { label: "Retensio Plasenta", cat: "Obstetri" },
    { label: "Inversio Uteri", cat: "Obstetri" },
    { label: "Perdarahan Postpartum (PPP)", cat: "Obstetri" },
    { label: "Endometritis", cat: "Obstetri" },
    { label: "Subinvolusio Uteri", cat: "Obstetri" },
    { label: "Bekas Sectio Caesarea (BSC)", cat: "Obstetri" },

    // Kelainan Organ Genital
    { label: "Kista dan Abses Kelenjar Bartolini", cat: "Ginekologi" },
    { label: "Corpus Alienum Vaginae", cat: "Ginekologi" },
    { label: "Kista Gartner", cat: "Ginekologi" },
    { label: "Fistula Vesiko-Vaginal", cat: "Ginekologi" },
    { label: "Kista Nabotian", cat: "Ginekologi" },
    { label: "Polip Serviks", cat: "Ginekologi" },
    { label: "Prolaps Uterus / Sistokel / Rektokel", cat: "Ginekologi" },
    { label: "Endometriosis", cat: "Ginekologi" },
    { label: "Mioma Uteri", cat: "Ginekologi" },
    { label: "Kehamilan Ektopik Terganggu (KET)", cat: "Ginekologi" },

    // Tumor & Keganasan Genital
    { label: "Karsinoma Serviks", cat: "Ginekologi" },
    { label: "Karsinoma Endometrium", cat: "Ginekologi" },
    { label: "Karsinoma Ovarium", cat: "Ginekologi" },
    { label: "Teratoma Ovarium (Kista Dermoid)", cat: "Ginekologi" },
    { label: "Kista Dermoid", cat: "Bedah Umum" },
    { label: "Kista Ovarium", cat: "Ginekologi" },
    { label: "Kista Ovarium Torsi", cat: "Ginekologi" },
    { label: "Torsi dan Ruptur Kista Ovarium", cat: "Ginekologi" },
    { label: "Infertilitas (Evaluasi Laparoskopi)", cat: "Ginekologi" },

    // Payudara
    { label: "Abses Mammae", cat: "Bedah Mammae" },
    { label: "Mastitis", cat: "Bedah Mammae" },
    { label: "Fibrokista Payudara", cat: "Bedah Mammae" },
    { label: "Tumor Payudara Jinak (FAM)", cat: "Bedah Mammae" },
    { label: "Fibroadenoma Mammae (FAM)", cat: "Bedah Mammae" },
    { label: "Karsinoma Mammae", cat: "Bedah Mammae" },
    { label: "Karsinoma Payudara", cat: "Bedah Mammae" },
    { label: "Ginekomastia", cat: "Bedah Mammae" },

    // Masalah Reproduksi Pria
    { label: "Infertilitas Pria", cat: "Urologi" },
    { label: "Gangguan Ereksi", cat: "Urologi" },
    { label: "Gangguan Ejakulasi", cat: "Urologi" },

    // ═══════════════════════════════════════════════════════════
    // 9. SISTEM ENDOKRIN, METABOLIK & NUTRISI
    // ═══════════════════════════════════════════════════════════

    { label: "Diabetes Mellitus Tipe 1", cat: "Endokrin" },
    { label: "Diabetes Mellitus Tipe 2", cat: "Endokrin" },
    { label: "Diabetes Mellitus Tipe Lain", cat: "Endokrin" },
    { label: "Ketoasidosis Diabetik (KAD)", cat: "Endokrin" },
    { label: "Ketoasidosis Diabetikum Nonketotik", cat: "Endokrin" },
    { label: "Hiperglikemia Hiperosmolar Non-Ketotik (HHNK)", cat: "Endokrin" },
    { label: "Hiperglikemi Hiperosmolar", cat: "Endokrin" },
    { label: "Hipoglikemia Ringan", cat: "Endokrin" },
    { label: "Hipoglikemia Berat", cat: "Endokrin" },
    { label: "Diabetes Insipidus", cat: "Endokrin" },
    { label: "Akromegali / Gigantisme", cat: "Endokrin" },
    { label: "Defisiensi Hormon Pertumbuhan", cat: "Endokrin" },
    { label: "Hiperparatiroidisme", cat: "Endokrin" },
    { label: "Hipoparatiroid", cat: "Endokrin" },
    { label: "Hipertiroidisme", cat: "Endokrin" },
    { label: "Tirotoksikosis", cat: "Endokrin" },
    { label: "Hipotiroidisme", cat: "Endokrin" },
    { label: "Goiter", cat: "Endokrin" },
    { label: "Tiroiditis", cat: "Endokrin" },
    { label: "Struma Nodosa Non-Toksik", cat: "Bedah Umum" },
    { label: "Struma Toksik (Grave's Disease)", cat: "Bedah Umum" },
    { label: "Cushing's Disease", cat: "Endokrin" },
    { label: "Sindrom Cushing", cat: "Endokrin" },
    { label: "Krisis Adrenal", cat: "Endokrin" },
    { label: "Addison's Disease", cat: "Endokrin" },
    { label: "Feokromositoma", cat: "Endokrin" },
    { label: "Adenoma Tiroid", cat: "Endokrin" },
    { label: "Karsinoma Tiroid", cat: "Endokrin" },
    { label: "Obesitas Morbid", cat: "Endokrin" },
    { label: "Obesitas", cat: "Endokrin" },
    { label: "Sindrom Metabolik", cat: "Endokrin" },
    { label: "Malnutrisi Energi-Protein", cat: "Penyakit Dalam" },
    { label: "Defisiensi Vitamin", cat: "Penyakit Dalam" },
    { label: "Defisiensi Mineral", cat: "Penyakit Dalam" },
    { label: "Dislipidemia", cat: "Penyakit Dalam" },
    { label: "Hiperurisemia", cat: "Penyakit Dalam" },

    // ═══════════════════════════════════════════════════════════
    // 10. SISTEM HEMATOLOGI & IMUNOLOGI
    // ═══════════════════════════════════════════════════════════

    { label: "Anemia Aplastik", cat: "Penyakit Dalam" },
    { label: "Anemia Defisiensi Besi", cat: "Penyakit Dalam" },
    { label: "Anemia Hemolitik", cat: "Penyakit Dalam" },
    { label: "Anemia Makrositik", cat: "Penyakit Dalam" },
    { label: "Anemia Megaloblastik", cat: "Penyakit Dalam" },
    { label: "Anemia Berat", cat: "Penyakit Dalam" },
    { label: "Hemoglobinopati", cat: "Penyakit Dalam" },
    { label: "Polisitemia", cat: "Penyakit Dalam" },
    { label: "Gangguan Pembekuan Darah (Trombositopenia / Hemofilia)", cat: "Penyakit Dalam" },
    { label: "DIC (Disseminated Intravascular Coagulation)", cat: "Penyakit Dalam" },
    { label: "Agranulositosis", cat: "Penyakit Dalam" },
    { label: "Inkompatibilitas Golongan Darah", cat: "Penyakit Dalam" },
    { label: "Timoma", cat: "Penyakit Dalam" },
    { label: "Limfoma Non-Hodgkin's / Hodgkin's", cat: "Penyakit Dalam" },
    { label: "Leukemia Akut / Kronik", cat: "Penyakit Dalam" },
    { label: "Mieloma Multipel", cat: "Penyakit Dalam" },
    { label: "Limfadenopati", cat: "Penyakit Dalam" },
    { label: "Limfadenitis", cat: "Penyakit Dalam" },

    // Infeksi Hematologi
    { label: "Bakteremia", cat: "Penyakit Dalam" },
    { label: "Demam Dengue / DHF", cat: "Penyakit Dalam" },
    { label: "Dengue Shock Syndrome", cat: "Penyakit Dalam" },
    { label: "Malaria", cat: "Penyakit Dalam" },
    { label: "Leptospirosis Tanpa Komplikasi", cat: "Penyakit Dalam" },
    { label: "Sepsis / Syok Septik", cat: "Penyakit Dalam" },

    // Penyakit Autoimun
    { label: "Lupus Eritematosus Sistemik (LES/SLE)", cat: "Penyakit Dalam" },
    { label: "Poliarteritis Nodosa", cat: "Penyakit Dalam" },
    { label: "Polimialgia Reumatik", cat: "Penyakit Dalam" },
    { label: "Reaksi Anafilaktik", cat: "Penyakit Dalam" },
    { label: "Demam Reumatik", cat: "Penyakit Dalam" },
    { label: "Artritis Reumatoid", cat: "Penyakit Dalam" },
    { label: "Juvenile Chronic Arthritis", cat: "Penyakit Dalam" },
    { label: "Henoch-Schönlein Purpura", cat: "Penyakit Dalam" },
    { label: "Eritema Multiformis", cat: "Penyakit Dalam" },
    { label: "Imunodefisiensi", cat: "Penyakit Dalam" },

    // ═══════════════════════════════════════════════════════════
    // 11. SISTEM MUSKULOSKELETAL
    // ═══════════════════════════════════════════════════════════

    // Tulang & Sendi
    { label: "Artritis / Osteoartritis", cat: "Orthopedi" },
    { label: "Osteoartritis Genu", cat: "Orthopedi" },
    { label: "Fraktur Terbuka / Tertutup", cat: "Orthopedi" },
    { label: "Fraktur Femur", cat: "Orthopedi" },
    { label: "Fraktur Collum Femur", cat: "Orthopedi" },
    { label: "Fraktur Tibia Fibula", cat: "Orthopedi" },
    { label: "Fraktur Radius Ulna", cat: "Orthopedi" },
    { label: "Fraktur Humerus", cat: "Orthopedi" },
    { label: "Fraktur Klavikula", cat: "Orthopedi" },
    { label: "Fraktur Vertebra", cat: "Orthopedi" },
    { label: "Fraktur Pelvis", cat: "Orthopedi" },
    { label: "Fraktur Patologis", cat: "Orthopedi" },
    { label: "Fraktur dan Dislokasi Tulang Belakang", cat: "Orthopedi" },
    { label: "Dislokasi Sendi Bahu", cat: "Orthopedi" },
    { label: "Dislokasi Sendi Panggul", cat: "Orthopedi" },
    { label: "Dislokasi pada Sendi Ekstremitas", cat: "Orthopedi" },
    { label: "Osteoporosis", cat: "Orthopedi" },
    { label: "Tenosinovitis Supuratif", cat: "Orthopedi" },
    { label: "Tumor Tulang Primer / Sekunder", cat: "Orthopedi" },
    { label: "Kista Ganglion", cat: "Orthopedi" },
    { label: "Trauma Sendi", cat: "Orthopedi" },
    { label: "Kelainan Bentuk Tulang Belakang (Skoliosis, Kifosis, Lordosis)", cat: "Orthopedi" },
    { label: "Spondilitis / Spondilodisitis", cat: "Orthopedi" },
    { label: "Spondilitis TB", cat: "Orthopedi" },
    { label: "Displasia Panggul", cat: "Orthopedi" },
    { label: "Ruptur Tendon Achilles", cat: "Orthopedi" },
    { label: "Lesi Meniskus Medial dan Lateral", cat: "Orthopedi" },
    { label: "Malformasi Kongenital (Genovarum, Genovalgum, Club Foot)", cat: "Orthopedi" },
    { label: "Low Back Pain (HNP)", cat: "Orthopedi" },
    { label: "Osteomielitis", cat: "Orthopedi" },

    // Otot & Jaringan Lunak
    { label: "Ulkus pada Tungkai", cat: "Orthopedi" },
    { label: "Lipoma", cat: "Bedah Umum" },
    { label: "Soft Tissue Tumor", cat: "Bedah Umum" },
    { label: "Luka Bakar Derajat II-III", cat: "Bedah Umum" },
    { label: "Trauma Tumpul Abdomen", cat: "Bedah Umum" },
    { label: "Ruptur Lien", cat: "Bedah Umum" },

    // ═══════════════════════════════════════════════════════════
    // 12. SISTEM INTEGUMEN (KULIT)
    // ═══════════════════════════════════════════════════════════

    // Infeksi Virus Kulit
    { label: "Veruka Vulgaris", cat: "Kulit & Kelamin" },
    { label: "Moluskum Kontagiosum", cat: "Kulit & Kelamin" },
    { label: "Herpes Zoster Tanpa Komplikasi", cat: "Kulit & Kelamin" },
    { label: "Morbili Tanpa Komplikasi", cat: "Kulit & Kelamin" },
    { label: "Varisela Tanpa Komplikasi", cat: "Kulit & Kelamin" },
    { label: "Herpes Simpleks Tanpa Komplikasi", cat: "Kulit & Kelamin" },

    // Infeksi Bakteri Kulit
    { label: "Impetigo", cat: "Kulit & Kelamin" },
    { label: "Impetigo Ulseratif (Ektima)", cat: "Kulit & Kelamin" },
    { label: "Folikulitis Superfisialis", cat: "Kulit & Kelamin" },
    { label: "Furunkel / Karbunkel", cat: "Kulit & Kelamin" },
    { label: "Eritrasma", cat: "Kulit & Kelamin" },
    { label: "Erisipelas", cat: "Kulit & Kelamin" },
    { label: "Skrofuloderma", cat: "Kulit & Kelamin" },
    { label: "Lepra", cat: "Kulit & Kelamin" },
    { label: "Reaksi Lepra", cat: "Kulit & Kelamin" },
    { label: "Sifilis Stadium 1 dan 2", cat: "Kulit & Kelamin" },

    // Infeksi Jamur Kulit
    { label: "Tinea Kapitis", cat: "Kulit & Kelamin" },
    { label: "Tinea Korporis", cat: "Kulit & Kelamin" },
    { label: "Tinea Kruris", cat: "Kulit & Kelamin" },
    { label: "Tinea Pedis", cat: "Kulit & Kelamin" },
    { label: "Tinea Unguium", cat: "Kulit & Kelamin" },
    { label: "Pitiriasis Versikolor", cat: "Kulit & Kelamin" },
    { label: "Kandidosis Mukokutan Ringan", cat: "Kulit & Kelamin" },

    // Gigitan Serangga & Parasit
    { label: "Cutaneus Larva Migran", cat: "Kulit & Kelamin" },
    { label: "Filariasis", cat: "Kulit & Kelamin" },
    { label: "Pedikulosis Kapitis", cat: "Kulit & Kelamin" },
    { label: "Skabies", cat: "Kulit & Kelamin" },
    { label: "Reaksi Gigitan Serangga", cat: "Kulit & Kelamin" },

    // Dermatitis Eksim
    { label: "Dermatitis Kontak Iritan", cat: "Kulit & Kelamin" },
    { label: "Dermatitis Kontak Alergika", cat: "Kulit & Kelamin" },
    { label: "Dermatitis Atopik", cat: "Kulit & Kelamin" },
    { label: "Dermatitis Numularis", cat: "Kulit & Kelamin" },
    { label: "Liken Simpleks Kronik / Neurodermatitis", cat: "Kulit & Kelamin" },

    // Lesi Eritro-Squamosa
    { label: "Psoriasis Vulgaris", cat: "Kulit & Kelamin" },
    { label: "Dermatitis Seboroik", cat: "Kulit & Kelamin" },
    { label: "Pitiriasis Rosea", cat: "Kulit & Kelamin" },

    // Kelainan Kelenjar Sebasea & Ekrin
    { label: "Akne Vulgaris Ringan", cat: "Kulit & Kelamin" },
    { label: "Akne Vulgaris Sedang-Berat", cat: "Kulit & Kelamin" },
    { label: "Hidradenitis Supuratif", cat: "Kulit & Kelamin" },
    { label: "Miliaria", cat: "Kulit & Kelamin" },

    // Penyakit Vesikobulosa
    { label: "Toxic Epidermal Necrolysis (TEN)", cat: "Kulit & Kelamin" },
    { label: "Sindrom Stevens-Johnson", cat: "Kulit & Kelamin" },

    // Penyakit Kulit Alergi
    { label: "Urtikaria Akut", cat: "Kulit & Kelamin" },
    { label: "Urtikaria Kronis", cat: "Kulit & Kelamin" },
    { label: "Angioedema", cat: "Kulit & Kelamin" },

    // Kelainan Pigmentasi
    { label: "Vitiligo", cat: "Kulit & Kelamin" },
    { label: "Melasma", cat: "Kulit & Kelamin" },
    { label: "Hiperpigmentasi Pascainflamasi", cat: "Kulit & Kelamin" },

    // Neoplasma Kulit
    { label: "Kista Epitel", cat: "Kulit & Kelamin" },
    { label: "Squamous Cell Carcinoma (Karsinoma Sel Skuamosa)", cat: "Kulit & Kelamin" },
    { label: "Basal Cell Carcinoma (Karsinoma Sel Basal)", cat: "Kulit & Kelamin" },
    { label: "Hemangioma", cat: "Kulit & Kelamin" },

    // Trauma Kulit
    { label: "Vulnus Laseratum / Punctum", cat: "Bedah Umum" },
    { label: "Vulnus Perforatum / Penetratum", cat: "Bedah Umum" },

    // ═══════════════════════════════════════════════════════════
    // 13. ILMU KEDOKTERAN FORENSIK & MEDIKOLEGAL
    // ═══════════════════════════════════════════════════════════

    { label: "Kekerasan Tumpul", cat: "Forensik" },
    { label: "Kekerasan Tajam", cat: "Forensik" },
    { label: "Trauma Kimia", cat: "Forensik" },
    { label: "Luka Tembak", cat: "Forensik" },
    { label: "Asfiksia", cat: "Forensik" },
    { label: "Tenggelam", cat: "Forensik" },
    { label: "Kematian Mendadak", cat: "Forensik" },
    { label: "Toksikologi Forensik", cat: "Forensik" },

    // ═══════════════════════════════════════════════════════════
    // BEDAH ANAK (Tambahan dari DIAG_DB Lama)
    // ═══════════════════════════════════════════════════════════

    { label: "Malrotasi Usus", cat: "Bedah Anak" },
    { label: "Labioschisis / Palatoschisis", cat: "Bedah Anak" },

];