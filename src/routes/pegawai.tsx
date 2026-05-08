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
  mockPegawai,
  type Pegawai,
  getStoredPegawai,
  setStoredPegawai,
  nextPangkat,
  nextKgb,
} from "@/lib/simpeg-data";
import { useAuth } from "@/lib/auth-context";
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
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export const Route = createFileRoute("/pegawai")({ component: PegawaiPage });

const MASTER_GOLONGAN = [
  "IV/e",
  "IV/d",
  "IV/c",
  "IV/b",
  "IV/a",
  "III/d",
  "III/c",
  "III/b",
  "III/a",
];
const MASTER_JABATAN = [
  "Kepala Bagian Umum",
  "Analis Kepegawaian Ahli Muda",
  "Pranata Komputer Ahli Pertama",
  "Bendahara Pengeluaran",
  "Sekretaris Dinas",
];
const MASTER_UNIT = [
  "Sekretariat Utama",
  "Biro Keuangan",
  "Biro Kepegawaian",
  "Pusat Data dan Informasi",
  "Inspektorat",
];

function PegawaiPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Pegawai[]>(getStoredPegawai());
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null);
  const [viewingPegawai, setViewingPegawai] = useState<Pegawai | null>(null);

  const [filters, setFilters] = useState({
    golongan: "all",
    unit: "all",
    status: "all",
  });

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setStoredPegawai(data);
  }, [data]);

  const filtered = data.filter((p) => {
    const matchSearch = [p.nama, p.nip, p.jabatan, p.unitKerja].some((s) =>
      s.toLowerCase().includes(q.toLowerCase()),
    );
    const matchGolongan = filters.golongan === "all" || p.golongan === filters.golongan;
    const matchUnit = filters.unit === "all" || p.unitKerja === filters.unit;
    const matchStatus = filters.status === "all" || p.status === filters.status;
    return matchSearch && matchGolongan && matchUnit && matchStatus;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const today = new Date().toISOString();
    const newPegawai: Pegawai = {
      id: `p${Date.now()}`,
      nip: f.get("nip") as string,
      nama: f.get("nama") as string,
      jabatan: f.get("jabatan") as string,
      golongan: f.get("golongan") as string,
      unitKerja: f.get("unit") as string,
      email: f.get("email") as string,
      phone: f.get("phone") as string,
      tmtPangkat: today,
      tmtKgb: today,
      status: "aktif",
    };
    setData((d) => [newPegawai, ...d]);
    setAddOpen(false);
    toast.success("Pegawai berhasil ditambahkan");
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPegawai) return;
    const f = new FormData(e.currentTarget);
    const updated: Pegawai = {
      ...editingPegawai,
      nip: f.get("nip") as string,
      nama: f.get("nama") as string,
      jabatan: f.get("jabatan") as string,
      golongan: f.get("golongan") as string,
      unitKerja: f.get("unit") as string,
      email: f.get("email") as string,
      phone: f.get("phone") as string,
    };
    setData((d) => d.map((p) => (p.id === updated.id ? updated : p)));
    setEditOpen(false);
    setEditingPegawai(null);
    toast.success("Data pegawai berhasil diperbarui");
  };

  const openEditModal = (p: Pegawai) => {
    setEditingPegawai(p);
    setEditOpen(true);
  };

  const openViewModal = (p: Pegawai) => {
    setViewingPegawai(p);
    setViewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pegawai ini?")) {
      setData((d) => d.filter((x) => x.id !== id));
      toast.success("Pegawai dihapus dari sistem");
    }
  };

  const exportData = () => {
    const headers = ["NIP", "Nama", "Jabatan", "Golongan", "Unit Kerja", "Email", "Status"];
    const csvRows = filtered.map((p) =>
      [p.nip, p.nama, p.jabatan, p.golongan, p.unitKerja, p.email, p.status].join(","),
    );
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `data_pegawai_${new Date().toISOString().split("T")[0]}.csv`);
    link.click();
    toast.info(`Berhasil mengekspor ${filtered.length} data pegawai`);
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

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
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Golongan
                      </Label>
                      <Select
                        value={filters.golongan}
                        onValueChange={(v) => setFilters({ ...filters, golongan: v })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Golongan</SelectItem>
                          {MASTER_GOLONGAN.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Unit Kerja
                      </Label>
                      <Select
                        value={filters.unit}
                        onValueChange={(v) => setFilters({ ...filters, unit: v })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Unit</SelectItem>
                          {MASTER_UNIT.map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline" onClick={exportData}>
                <Download className="size-4" /> Export
              </Button>
              {isAdmin && (
                <Button className="shadow-glow" onClick={() => setAddOpen(true)}>
                  <Plus className="size-4" />
                  Tambah Pegawai
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
                  <th className="text-left px-5 py-3 font-semibold">Jabatan</th>
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
                          <div className="font-medium">{p.nama}</div>
                          <div className="text-[10px] text-muted-foreground">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs">{p.nip}</td>
                    <td className="px-5 py-3.5 text-xs">{p.jabatan}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline">{p.golongan}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openViewModal(p)}>
                          <Eye className="size-4" />
                        </Button>
                        {isAdmin && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => openEditModal(p)}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
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
            <DialogHeader>
              <DialogTitle>Profil Pegawai</DialogTitle>
            </DialogHeader>
            {viewingPegawai && (
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
                    <div className="size-16 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                      {viewingPegawai.nama.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-base">{viewingPegawai.nama}</div>
                      <div className="text-xs text-muted-foreground">{viewingPegawai.nip}</div>
                      <Badge className="mt-1 bg-success/10 text-success border-0">
                        {viewingPegawai.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="size-4" />
                      {viewingPegawai.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-4" />
                      {viewingPegawai.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4" />
                      {viewingPegawai.unitKerja}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="size-4" />
                      Golongan {viewingPegawai.golongan}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                      Estimasi Kenaikan Pangkat
                    </div>
                    <div className="text-sm font-bold flex items-center gap-2">
                      <Calendar className="size-4" /> {fmt(nextPangkat(viewingPegawai))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-success/20 bg-success/5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-success mb-1">
                      Estimasi KGB
                    </div>
                    <div className="text-sm font-bold flex items-center gap-2">
                      <Wallet className="size-4" /> {fmt(nextKgb(viewingPegawai))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      TMT Terakhir
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-[11px]">
                        Pangkat:{" "}
                        <span className="font-semibold">{fmt(viewingPegawai.tmtPangkat)}</span>
                      </div>
                      <div className="text-[11px]">
                        KGB: <span className="font-semibold">{fmt(viewingPegawai.tmtKgb)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Modal */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Tambah Pegawai Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Nama Lengkap</Label>
                <Input name="nama" required />
              </div>
              <div>
                <Label>NIP</Label>
                <Input name="nip" required />
              </div>
              <div>
                <Label>Golongan</Label>
                <Select name="golongan" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {MASTER_GOLONGAN.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Jabatan</Label>
                <Select name="jabatan" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {MASTER_JABATAN.map((j) => (
                      <SelectItem key={j} value={j}>
                        {j}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Unit Kerja</Label>
                <Select name="unit" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {MASTER_UNIT.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Telepon</Label>
                <Input name="phone" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" required />
              </div>
              <DialogFooter className="col-span-2 mt-4">
                <Button type="submit" className="w-full shadow-glow">
                  Simpan Data
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Data Pegawai</DialogTitle>
            </DialogHeader>
            {editingPegawai && (
              <form onSubmit={handleEdit} className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Nama Lengkap</Label>
                  <Input name="nama" defaultValue={editingPegawai.nama} required />
                </div>
                <div>
                  <Label>NIP</Label>
                  <Input name="nip" defaultValue={editingPegawai.nip} required />
                </div>
                <div>
                  <Label>Golongan</Label>
                  <Select name="golongan" defaultValue={editingPegawai.golongan} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_GOLONGAN.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Jabatan</Label>
                  <Select name="jabatan" defaultValue={editingPegawai.jabatan} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_JABATAN.map((j) => (
                        <SelectItem key={j} value={j}>
                          {j}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Unit Kerja</Label>
                  <Select name="unit" defaultValue={editingPegawai.unitKerja} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_UNIT.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Telepon</Label>
                  <Input name="phone" defaultValue={editingPegawai.phone} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" defaultValue={editingPegawai.email} required />
                </div>
                <DialogFooter className="col-span-2 mt-4">
                  <Button type="submit" className="w-full shadow-glow">
                    Simpan Perubahan
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
