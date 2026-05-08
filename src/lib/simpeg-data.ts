export type Role = "admin" | "pegawai" | "pimpinan";

export interface User {
  id: string;
  name: string;
  nip: string;
  role: Role;
  email: string;
  avatar?: string;
  jabatan: string;
}

export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  golongan: string;
  unitKerja: string;
  email: string;
  phone: string;
  tmtPangkat: string; // ISO date
  tmtKgb: string;
  status: "aktif" | "cuti" | "pensiun";
  avatar?: string;
}

export interface RiwayatItem {
  id: string;
  pegawaiId: string;
  type: "pangkat" | "kgb" | "dokumen" | "approval";
  title: string;
  description: string;
  date: string;
  status?: "approved" | "pending" | "rejected";
}

export interface Approval {
  id: string;
  pegawaiId: string;
  pegawaiNama: string;
  type: "Kenaikan Pangkat" | "KGB" | "Cuti" | "Mutasi";
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  dokumen: string;
  catatan?: string;
}

const today = new Date();
const addYears = (date: Date, y: number) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + y);
  return d.toISOString();
};
const addDays = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const mockPegawai: Pegawai[] = [
  {
    id: "p1",
    nip: "198503152010011001",
    nama: "Dr. Ahmad Hidayat, M.Si",
    jabatan: "Kepala Bagian Umum",
    golongan: "IV/a",
    unitKerja: "Sekretariat",
    email: "ahmad.h@instansi.go.id",
    phone: "08123456789",
    tmtPangkat: addYears(new Date(today.getFullYear() - 4, 0, 15), 0),
    tmtKgb: addYears(new Date(today.getFullYear() - 1, 5, 1), 0),
    status: "aktif",
  },
  {
    id: "p2",
    nip: "198806202012032002",
    nama: "Siti Nurhaliza, S.E.",
    jabatan: "Analis Keuangan",
    golongan: "III/c",
    unitKerja: "Keuangan",
    email: "siti.n@instansi.go.id",
    phone: "08234567890",
    tmtPangkat: new Date(today.getFullYear() - 3, today.getMonth() + 1, 10).toISOString(),
    tmtKgb: new Date(today.getFullYear() - 2, today.getMonth() - 1, 5).toISOString(),
    status: "aktif",
  },
  {
    id: "p3",
    nip: "199001102015041003",
    nama: "Budi Santoso, S.Kom",
    jabatan: "Pranata Komputer",
    golongan: "III/b",
    unitKerja: "IT",
    email: "budi.s@instansi.go.id",
    phone: "08345678901",
    tmtPangkat: new Date(today.getFullYear() - 4, today.getMonth(), 20).toISOString(),
    tmtKgb: new Date(today.getFullYear() - 2, today.getMonth(), 12).toISOString(),
    status: "aktif",
  },
  {
    id: "p4",
    nip: "198712052011012004",
    nama: "Rina Kartika, M.M.",
    jabatan: "Kepala Sub Bagian",
    golongan: "III/d",
    unitKerja: "Kepegawaian",
    email: "rina.k@instansi.go.id",
    phone: "08456789012",
    tmtPangkat: new Date(today.getFullYear() - 2, 3, 1).toISOString(),
    tmtKgb: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString(),
    status: "aktif",
  },
  {
    id: "p5",
    nip: "199203182018021005",
    nama: "Andi Pratama, S.H.",
    jabatan: "Analis Hukum",
    golongan: "III/a",
    unitKerja: "Hukum",
    email: "andi.p@instansi.go.id",
    phone: "08567890123",
    tmtPangkat: new Date(today.getFullYear() - 4, today.getMonth() + 1, 15).toISOString(),
    tmtKgb: new Date(today.getFullYear() - 1, 8, 1).toISOString(),
    status: "aktif",
  },
  {
    id: "p6",
    nip: "198509252009122006",
    nama: "Maya Sari, M.Pd",
    jabatan: "Widyaiswara",
    golongan: "IV/b",
    unitKerja: "Diklat",
    email: "maya.s@instansi.go.id",
    phone: "08678901234",
    tmtPangkat: new Date(today.getFullYear() - 3, 6, 1).toISOString(),
    tmtKgb: new Date(today.getFullYear() - 2, 2, 10).toISOString(),
    status: "aktif",
  },
  {
    id: "p7",
    nip: "199506112019031007",
    nama: "Fajar Nugroho, S.T.",
    jabatan: "Analis Sistem",
    golongan: "III/b",
    unitKerja: "IT",
    email: "fajar.n@instansi.go.id",
    phone: "08789012345",
    tmtPangkat: new Date(
      today.getFullYear() - 4,
      today.getMonth(),
      today.getDate() + 14,
    ).toISOString(),
    tmtKgb: new Date(today.getFullYear() - 1, 11, 5).toISOString(),
    status: "aktif",
  },
  {
    id: "p8",
    nip: "198410042008012008",
    nama: "Diana Putri, S.Sos",
    jabatan: "Humas",
    golongan: "III/c",
    unitKerja: "Humas",
    email: "diana.p@instansi.go.id",
    phone: "08890123456",
    tmtPangkat: new Date(today.getFullYear() - 1, 4, 20).toISOString(),
    tmtKgb: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate() + 30).toISOString(),
    status: "aktif",
  },
];

// Compute next dates
export function nextPangkat(p: Pegawai) {
  return addYears(new Date(p.tmtPangkat), 4);
}
export function nextKgb(p: Pegawai) {
  return addYears(new Date(p.tmtKgb), 2);
}
export function daysUntil(iso: string) {
  const d = new Date(iso).getTime() - Date.now();
  return Math.ceil(d / (1000 * 60 * 60 * 24));
}

export const mockApprovals: Approval[] = [
  {
    id: "a1",
    pegawaiId: "p4",
    pegawaiNama: "Rina Kartika, M.M.",
    type: "KGB",
    submittedAt: addDays(-2),
    status: "pending",
    dokumen: "SK-KGB-Rina.pdf",
  },
  {
    id: "a2",
    pegawaiId: "p7",
    pegawaiNama: "Fajar Nugroho, S.T.",
    type: "Kenaikan Pangkat",
    submittedAt: addDays(-5),
    status: "pending",
    dokumen: "Berkas-Pangkat-Fajar.pdf",
  },
  {
    id: "a3",
    pegawaiId: "p2",
    pegawaiNama: "Siti Nurhaliza, S.E.",
    type: "Kenaikan Pangkat",
    submittedAt: addDays(-10),
    status: "approved",
    dokumen: "SK-Siti.pdf",
  },
  {
    id: "a4",
    pegawaiId: "p8",
    pegawaiNama: "Diana Putri, S.Sos",
    type: "KGB",
    submittedAt: addDays(-1),
    status: "pending",
    dokumen: "KGB-Diana.pdf",
  },
  {
    id: "a5",
    pegawaiId: "p3",
    pegawaiNama: "Budi Santoso, S.Kom",
    type: "Mutasi",
    submittedAt: addDays(-15),
    status: "rejected",
    dokumen: "Mutasi-Budi.pdf",
    catatan: "Berkas tidak lengkap",
  },
];

export const mockRiwayat: RiwayatItem[] = [
  {
    id: "r1",
    pegawaiId: "p1",
    type: "pangkat",
    title: "Naik Pangkat ke IV/a",
    description: "Pembina dari Penata Tk.I",
    date: addDays(-1200),
  },
  {
    id: "r2",
    pegawaiId: "p1",
    type: "kgb",
    title: "KGB Periode 2023",
    description: "Kenaikan gaji berkala",
    date: addDays(-365),
  },
  {
    id: "r3",
    pegawaiId: "p1",
    type: "dokumen",
    title: "Upload SK Jabatan",
    description: "Dokumen SK terbaru",
    date: addDays(-30),
    status: "approved",
  },
  {
    id: "r4",
    pegawaiId: "p1",
    type: "approval",
    title: "Approval Tunjangan",
    description: "Disetujui pimpinan",
    date: addDays(-7),
    status: "approved",
  },
];

export const demoUsers: Record<string, User> = {
  admin: {
    id: "u1",
    name: "Andi Wijaya",
    nip: "198001012005011001",
    role: "admin",
    email: "admin@simpeg.go.id",
    jabatan: "Admin Kepegawaian",
  },
  pegawai: {
    id: "u2",
    name: "Siti Nurhaliza",
    nip: "198806202012032002",
    role: "pegawai",
    email: "siti@simpeg.go.id",
    jabatan: "Analis Keuangan",
  },
  pimpinan: {
    id: "u3",
    name: "Dr. Bambang Sutrisno",
    nip: "197503151998031001",
    role: "pimpinan",
    email: "pimpinan@simpeg.go.id",
    jabatan: "Sekretaris Daerah",
  },
};

// LocalStorage Helpers
const STORAGE_KEY = "simpeg_pegawai_data";

export function getStoredPegawai(): Pegawai[] {
  if (typeof window === "undefined") return mockPegawai;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPegawai));
    return mockPegawai;
  }
  return JSON.parse(stored);
}

export function setStoredPegawai(data: Pegawai[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
