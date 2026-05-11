import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  type Pegawai,
  nextPangkat,
  nextKgb,
  lastPangkat,
  lastKgb,
  type User,
} from "@/lib/simpeg-data";
import { useAuth } from "@/lib/auth-context";
import api from "@/services/api";
import {
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  Wallet,
  UserPlus,
  Key,
  ShieldCheck as ShieldCheckIcon,
  Clock,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export const Route = createFileRoute("/pegawai")({ component: PegawaiPage });

function PegawaiPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Master Data States
  const [masterGolongan, setMasterGolongan] = useState<any[]>([]);
  const [masterJabatan, setMasterJabatan] = useState<any[]>([]);
  const [masterUnit, setMasterUnit] = useState<any[]>([]);

  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null);
  const [viewingPegawai, setViewingPegawai] = useState<Pegawai | null>(null);
  const [targetPegawai, setTargetPegawai] = useState<Pegawai | null>(null);

  const [filters, setFilters] = useState({
    golongan: "all",
    unit: "all",
    status: "all",
  });

  const isAdmin = user?.role === "admin";

  const fetchData = async () => {
    try {
      const [pegawaiRes, golRes, jabRes, unitRes] = await Promise.all([
        api.get("/pegawai"),
        api.get("/master/golongan"),
        api.get("/master/jabatan"),
        api.get("/master/unit-kerja")
      ]);

      if (pegawaiRes.data.success) setData(pegawaiRes.data.data);
      if (golRes.data.success) setMasterGolongan(golRes.data.data);
      if (jabRes.data.success) setMasterJabatan(golRes.data.data);
      if (unitRes.data.success) setMasterUnit(unitRes.data.data);

    } catch (error) {
      console.error("Gagal mengambil data pegawai:", error);
    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccountCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!targetPegawai) return;
    
    try {
      const response = await api.post(`/pegawai/${targetPegawai.id}/create-account`, {
        role: "pegawai",
        email: targetPegawai.email,
      });

      if (response.data.success) {
        toast.success(`Akun berhasil dibuat untuk ${targetPegawai.nama}`);
        setAccountOpen(false);
        fetchData(); // Refresh to show active status
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat akun");
    }
  };

  const openAccountModal = (p: Pegawai) => {
    setTargetPegawai(p);
    setAccountOpen(true);
  };

  const filtered = data.filter((p) => {
    const matchSearch = [p.nama, p.nip, p.jabatan, p.unitKerja].some((s) =>
      s.toLowerCase().includes(q.toLowerCase()),
    );
    const matchGolongan = filters.golongan === "all" || p.golongan === filters.golongan;
    const matchUnit = filters.unit === "all" || p.unitKerja === filters.unit;
    const matchStatus = filters.status === "all" || p.status === filters.status;
    return matchSearch && matchGolongan && matchUnit && matchStatus;
  });

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const entryDate = f.get("tanggalMasuk") as string;
    const tmtP = (f.get("tmtPangkat") as string) || lastPangkat(entryDate);
    const tmtK = (f.get("tmtKgb") as string) || lastKgb(entryDate);
    
    const newPegawai = {
      nip: f.get("nip") as string,
      nama: f.get("nama") as string,
      jabatan_id: f.get("jabatan_id") as string,
      golongan_id: f.get("golongan_id") as string,
      unit_kerja_id: f.get("unit_kerja_id") as string,
      email: f.get("email") as string,
      phone: f.get("phone") as string,
      tanggalMasuk: entryDate,
      tmtPangkat: tmtP,
      tmtKgb: tmtK,
      status: "aktif",
    };

    try {
      const response = await api.post("/pegawai", newPegawai);
      if (response.data.success) {
        setData((d) => [response.data.data, ...d]);
        setAddOpen(false);
        toast.success("Pegawai berhasil ditambahkan");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menambah pegawai");
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPegawai) return;
    const f = new FormData(e.currentTarget);
    const entryDate = f.get("tanggalMasuk") as string;
    
    const updated = {
      nip: f.get("nip") as string,
      nama: f.get("nama") as string,
      jabatan_id: f.get("jabatan_id") as string,
      golongan_id: f.get("golongan_id") as string,
      unit_kerja_id: f.get("unit_kerja_id") as string,
      email: f.get("email") as string,
      phone: f.get("phone") as string,
      tanggalMasuk: entryDate,
      tmtPangkat: f.get("tmtPangkat") as string || editingPegawai.tmtPangkat,
      tmtKgb: f.get("tmtKgb") as string || editingPegawai.tmtKgb,
    };

    try {
      const response = await api.put(`/pegawai/${editingPegawai.id}`, updated);
      if (response.data.success) {
        setData((d) => d.map((p) => (p.id === editingPegawai.id ? response.data.data : p)));
        setEditOpen(false);
        setEditingPegawai(null);
        toast.success("Data pegawai berhasil diperbarui");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui data");
    }
  };

  const openEditModal = (p: Pegawai) => {
    setEditingPegawai(p);
    setEditOpen(true);
  };

  const openViewModal = (p: Pegawai) => {
    setViewingPegawai(p);
    setViewOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pegawai ini?")) {
      try {
        const response = await api.delete(`/pegawai/${id}`);
        if (response.data.success) {
          setData((d) => d.filter((x) => x.id !== id));
          toast.success("Pegawai dihapus dari sistem");
        }
      } catch (error) {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const getTenure = (iso: string) => {
    if (!iso) return "-";
    const start = new Date(iso);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return `${y} thn ${m} bln`;
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  if (loading) return <AppShell title="Data Pegawai"><div className="p-8 text-center">Memuat data...</div></AppShell>;

  return (
    <AppShell title="Data Pegawai">
      <div className="space-y-5">
        {/* Top Actions */}
        <Card className="shadow-card">
          <CardContent className="p-4 lg:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari nama, NIP, jabatan..."
                  className="pl-9"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter className="size-4" /> Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-bold">Filter Data</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters({ golongan: "all", unit: "all", status: "all" })}
                        className="h-7 text-xs"
                      >
                        Reset
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Golongan</Label>
                      <Select value={filters.golongan} onValueChange={(v) => setFilters({ ...filters, golongan: v })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Golongan</SelectItem>
                          {masterGolongan.map((g) => (<SelectItem key={g.id} value={g.kode}>{g.kode}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline" onClick={() => {}}>
                <Download className="size-4" /> Export
              </Button>
              {isAdmin && (
                <Button className="shadow-glow" onClick={() => setAddOpen(true)}>
                  <Plus className="size-4" /> Tambah Pegawai
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List Table */}
        <Card className="shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Pegawai</th>
                  <th className="text-left px-5 py-3 font-semibold">NIP</th>
                  <th className="text-left px-5 py-3 font-semibold">Masa Kerja</th>
                  <th className="text-left px-5 py-3 font-semibold">Golongan</th>
                  <th className="text-right px-5 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-semibold">
                          {p.nama.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-xs">{p.nama}</div>
                          <div className="text-[10px] text-muted-foreground">{p.jabatan}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.nip}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">{getTenure(p.tanggalMasuk)}</span>
                        <span className="text-[9px] text-muted-foreground">Sejak {p.tanggalMasuk ? new Date(p.tanggalMasuk).getFullYear() : '-'}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-[10px]">{p.golongan}</Badge>
                        {p.hasAccount && (
                          <Badge className="bg-success/10 text-success border-0 text-[8px] h-3 w-fit">Akun Aktif</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openViewModal(p)}><Eye className="size-4" /></Button>
                        {isAdmin && (
                          <>
                            {!p.hasAccount && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-primary hover:bg-primary/10"
                                title="Buat Akun"
                                onClick={() => openAccountModal(p)}
                              >
                                <UserPlus className="size-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => openEditModal(p)}><Pencil className="size-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}><Trash2 className="size-4" /></Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* View Modal */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Profil Pegawai</DialogTitle></DialogHeader>
            {viewingPegawai && (
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
                    <div className="size-16 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">{viewingPegawai.nama.charAt(0)}</div>
                    <div>
                      <div className="font-bold text-base">{viewingPegawai.nama}</div>
                      <div className="text-xs text-muted-foreground">{viewingPegawai.nip}</div>
                      <Badge className="mt-1 bg-success/10 text-success border-0 text-[10px]">{viewingPegawai.status}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Mail className="size-4" />{viewingPegawai.email}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4" />{viewingPegawai.phone}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" />{viewingPegawai.unitKerja}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Briefcase className="size-4" />{viewingPegawai.jabatan}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" />Masa Kerja: {getTenure(viewingPegawai.tanggalMasuk)}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-border bg-muted/20">
                     <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-muted-foreground">TMT Pangkat Terakhir:</div>
                        <div className="font-mono font-bold text-primary">{viewingPegawai.tmtPangkat?.split('T')[0] || '-'}</div>
                        <div className="text-muted-foreground">TMT KGB Terakhir:</div>
                        <div className="font-mono font-bold text-success">{viewingPegawai.tmtKgb?.split('T')[0] || '-'}</div>
                     </div>
                  </div>
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-primary">Estimasi Naik Pangkat</Label>
                    <div className="text-sm font-bold flex items-center gap-2 mt-1"><Calendar className="size-4" /> {fmt(nextPangkat(viewingPegawai))}</div>
                  </div>
                  <div className="p-4 rounded-xl border border-success/20 bg-success/5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-success">Estimasi KGB</Label>
                    <div className="text-sm font-bold flex items-center gap-2 mt-1"><Wallet className="size-4" /> {fmt(nextKgb(viewingPegawai))}</div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Modal */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold tracking-tight">Tambah Pegawai Baru</DialogTitle>
              <DialogDescription className="text-xs">Lengkapi data dasar pegawai untuk didaftarkan ke sistem.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="p-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nama Lengkap</Label>
                  <Input name="nama" placeholder="Masukkan nama lengkap dengan gelar..." required className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">NIP</Label>
                  <Input name="nip" placeholder="19XXXXXXXXXXXXXXX" required className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Golongan</Label>
                  <Select name="golongan" required>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Pilih Golongan" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {MASTER_GOLONGAN.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tanggal Masuk CPNS</Label>
                  <Input name="tanggalMasuk" type="date" required className="h-10 rounded-xl" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jabatan</Label>
                  <Select name="jabatan" required>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Pilih Jabatan" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {MASTER_JABATAN.map((j) => (
                        <SelectItem key={j} value={j}>{j}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Kerja</Label>
                  <Select name="unit" required>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Pilih Unit Kerja" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {MASTER_UNIT.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Telepon</Label>
                  <Input name="phone" placeholder="08XXXXXXXXXX" required className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input name="email" type="email" placeholder="nama@sikapas.go.id" required className="h-10 rounded-xl" />
                </div>
              </div>
              <DialogFooter className="mt-8 gap-3 sm:gap-0">
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)} className="rounded-xl h-11">Batal</Button>
                <Button type="submit" className="w-full md:w-auto h-11 px-8 rounded-xl shadow-glow font-bold">Simpan Data Pegawai</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold tracking-tight">Edit Data Pegawai</DialogTitle>
              <DialogDescription className="text-xs">Perbarui informasi kepegawaian yang diperlukan.</DialogDescription>
            </DialogHeader>
            {editingPegawai && (
              <form onSubmit={handleEdit} className="p-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nama Lengkap</Label>
                    <Input name="nama" defaultValue={editingPegawai.nama} required className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">NIP</Label>
                    <Input name="nip" defaultValue={editingPegawai.nip} required className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Golongan</Label>
                    <Select name="golongan" defaultValue={editingPegawai.golongan} required>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {MASTER_GOLONGAN.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tanggal Masuk CPNS</Label>
                    <Input 
                      name="tanggalMasuk" 
                      type="date" 
                      defaultValue={editingPegawai.tanggalMasuk?.split('T')[0]} 
                      required 
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jabatan</Label>
                    <Select name="jabatan" defaultValue={editingPegawai.jabatan} required>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {MASTER_JABATAN.map((j) => (
                          <SelectItem key={j} value={j}>{j}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Kerja</Label>
                    <Select name="unit" defaultValue={editingPegawai.unitKerja} required>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {MASTER_UNIT.map((u) => (
                          <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Telepon</Label>
                    <Input name="phone" defaultValue={editingPegawai.phone} required className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                    <Input name="email" type="email" defaultValue={editingPegawai.email} required className="h-10 rounded-xl" />
                  </div>
                </div>
                <DialogFooter className="mt-8 gap-3 sm:gap-0">
                  <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} className="rounded-xl h-11">Batal</Button>
                  <Button type="submit" className="w-full md:w-auto h-11 px-8 rounded-xl shadow-glow font-bold text-white bg-primary hover:bg-primary/90 transition-all">Simpan Perubahan</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Account Modal */}
        <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheckIcon className="size-6 text-primary" />
              </div>
              <DialogTitle>Buat Akun Pegawai</DialogTitle>
              <DialogDescription>
                Buat akun akses sistem untuk <strong>{targetPegawai?.nama}</strong>. NIP akan
                digunakan sebagai username default.
              </DialogDescription>
            </DialogHeader>
            {targetPegawai && (
              <form onSubmit={handleAccountCreate} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label>NIP / Username</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input value={targetPegawai.nip} disabled className="pl-10" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Password Default</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input value="password" disabled className="pl-10" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Password default adalah "password". Pegawai dapat mengubahnya setelah login.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-info/5 border border-info/10 text-[11px] text-info-foreground leading-relaxed">
                  Dengan membuat akun ini, pegawai dapat mengakses dashboard pribadi untuk memantau
                  progres kenaikan pangkat dan KGB secara mandiri.
                </div>
                <DialogFooter className="mt-6">
                  <Button type="submit" className="w-full shadow-glow">
                    Konfirmasi Buat Akun
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
