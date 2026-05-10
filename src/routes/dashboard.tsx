import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import {
  getStoredPegawai,
  getStoredDocs,
  setStoredDocs,
  type ImportantDoc,
  daysUntil,
  nextPangkat,
  nextKgb,
  mockApprovals,
  mockRiwayat,
} from "@/lib/simpeg-data";
import {
  Users,
  TrendingUp,
  Wallet,
  Clock,
  ArrowUpRight,
  FileCheck,
  Bell,
  User as UserIcon,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  ExternalLink,
  Download,
  Plus,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const trendData = [
  { bulan: "Jan", pangkat: 4, kgb: 12 },
  { bulan: "Feb", pangkat: 6, kgb: 9 },
  { bulan: "Mar", pangkat: 3, kgb: 14 },
  { bulan: "Apr", pangkat: 8, kgb: 11 },
  { bulan: "Mei", pangkat: 5, kgb: 17 },
  { bulan: "Jun", pangkat: 7, kgb: 13 },
  { bulan: "Jul", pangkat: 9, kgb: 16 },
];

const golData = [
  { name: "II", value: 145, color: "oklch(0.65 0.14 200)" },
  { name: "III", value: 480, color: "oklch(0.55 0.16 260)" },
  { name: "IV", value: 215, color: "oklch(0.7 0.15 155)" },
  { name: "I", value: 38, color: "oklch(0.78 0.16 75)" },
];

function Dashboard() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<ImportantDoc[]>([]);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: "", type: "PDF", size: "" });

  useEffect(() => {
    setDocs(getStoredDocs());
  }, []);

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.size) {
      toast.error("Mohon isi semua field dan pilih file");
      return;
    }

    const updatedDocs = [
      ...docs,
      { ...newDoc, id: Date.now() }
    ];
    setDocs(updatedDocs);
    setStoredDocs(updatedDocs);
    setIsAddDocOpen(false);
    setNewDoc({ name: "", type: "PDF", size: "" });
    toast.success("Dokumen berhasil ditambahkan");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 2MB in bytes
    const maxSize = 2 * 1024 * 1024;
    
    if (file.size > maxSize) {
      toast.error("File terlalu besar! Maksimal ukuran file adalah 2MB");
      e.target.value = ""; // Clear input
      setNewDoc(prev => ({ ...prev, size: "" }));
      return;
    }

    // Format size string
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeInMB} MB`;
    
    // Auto-detect type from extension
    const extension = file.name.split('.').pop()?.toUpperCase() || "PDF";
    
    setNewDoc(prev => ({ 
      ...prev, 
      size: sizeStr,
      type: extension,
      name: prev.name || file.name.split('.')[0]
    }));
  };

  const handleDeleteDoc = (id: number) => {
    const updatedDocs = docs.filter(d => d.id !== id);
    setDocs(updatedDocs);
    setStoredDocs(updatedDocs);
    toast.success("Dokumen berhasil dihapus");
  };

  const currentData = useMemo(() => getStoredPegawai(), []);

  // Logic for Admin/Pimpinan
  const upcomingPangkat = currentData
    .map((p) => ({ p, days: daysUntil(nextPangkat(p)) }))
    .filter((x) => x.days <= 60 && x.days > 0)
    .sort((a, b) => a.days - b.days);
  const upcomingKgb = currentData
    .map((p) => ({ p, days: daysUntil(nextKgb(p)) }))
    .filter((x) => x.days <= 60 && x.days > 0)
    .sort((a, b) => a.days - b.days);
  const pending = mockApprovals.filter((a) => a.status === "pending");

  // Logic for Pegawai (Personal)
  const myData = currentData.find((p) => p.nip === user?.nip);
  const myApprovals = mockApprovals.filter((a) => a.pegawaiId === myData?.id);
  const myHistory = mockRiwayat.filter((r) => r.pegawaiId === myData?.id);
  const daysToPangkat = myData ? daysUntil(nextPangkat(myData)) : 0;
  const daysToKgb = myData ? daysUntil(nextKgb(myData)) : 0;

  const isPegawai = user?.role === "pegawai";

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="rounded-2xl bg-gradient-hero p-6 lg:p-8 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <Badge className="bg-white/15 text-white border-0 mb-3 capitalize">
                {user?.role}
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold">
                Halo, {user?.name.split(",")[0]} 👋
              </h2>
              <p className="mt-2 text-white/80 max-w-xl">
                {!isPegawai &&
                  user?.role === "admin" &&
                  "Anda memiliki beberapa tugas verifikasi dokumen yang menunggu hari ini."}
                {!isPegawai &&
                  user?.role === "pimpinan" &&
                  `${pending.length} pengajuan menunggu persetujuan Anda.`}
                {isPegawai &&
                  `Selamat datang di portal mandiri. Anda berada di Golongan ${myData?.golongan} sebagai ${myData?.jabatan}.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild className="bg-white text-primary hover:bg-white/90 shadow-glow">
                <Link to={isPegawai ? "/kenaikan-pangkat" : "/reminder"}>
                  {isPegawai ? "Ajukan Dokumen" : "Lihat Reminder"}
                </Link>
              </Button>

              {isPegawai ? (
                <>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                  >
                    Download SK
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        className="bg-info/20 border-info/30 text-white hover:bg-info/30 backdrop-blur-sm"
                      >
                        <FileText className="size-4 mr-2" /> Dokumen Penting
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card">
                      <DialogHeader>
                        <DialogTitle>Dokumen & Panduan Penting</DialogTitle>
                        <DialogDescription>
                          Akses cepat ke berkas panduan kenaikan pangkat dan aturan kepegawaian.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-3 mt-4">
                        {docs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <FileText className="size-5" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold">{doc.name}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                  {doc.type} • {doc.size}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-2 hover:bg-primary/10 hover:text-primary"
                                  >
                                    <Eye className="size-4 mr-1" /> Baca
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
                                  <div className="flex-1 bg-muted/20 flex items-center justify-center relative">
                                    <div className="absolute inset-0 p-8 overflow-y-auto bg-slate-100 flex flex-col items-center">
                                      <div className="w-full max-w-[600px] aspect-[1/1.4] bg-white shadow-lg p-12 border flex flex-col items-center text-center">
                                        <FileText className="size-20 text-slate-200 mb-6" />
                                        <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                                        <p className="text-slate-500 mt-4 text-sm leading-relaxed">Pratinjau Dokumen.</p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" variant="ghost" className="h-8 px-2">
                                <Download className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <div className="flex gap-2">
                  {user?.role === "admin" && (
                    <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                        >
                          <Plus className="size-4 mr-2" /> Kelola Format Surat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-card">
                        <DialogHeader>
                          <DialogTitle>Manajemen Format Surat</DialogTitle>
                          <DialogDescription>Tambahkan atau hapus format surat.</DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleAddDoc} className="space-y-4 mt-4 p-4 border rounded-xl bg-muted/20">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Nama Dokumen</Label>
                                <Input 
                                  placeholder="Contoh: Template SKP..."
                                  value={newDoc.name}
                                  onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Pilih File (Max 2MB)</Label>
                                <Input 
                                  type="file"
                                  className="cursor-pointer"
                                  onChange={handleFileChange}
                                  accept=".pdf,.docx,.doc,.xlsx,.xls"
                                />
                                {newDoc.size && (
                                  <p className="text-[10px] text-primary font-medium">Ukuran: {newDoc.size}</p>
                                )}
                              </div>
                           </div>
                           <Button type="submit" className="w-full">Tambahkan Dokumen</Button>
                        </form>

                        <div className="mt-6 space-y-3">
                          {docs.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm font-medium">{doc.name} ({doc.size})</span>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteDoc(doc.id)}>
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button asChild variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                    <Link to="/laporan">Generate Laporan</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(isPegawai
            ? [
                { label: "Golongan Saat Ini", value: myData?.golongan || "-", icon: UserIcon, accent: "bg-primary/10 text-primary" },
                { label: "Hari Menuju Pangkat", value: Math.max(0, daysToPangkat).toString(), icon: TrendingUp, accent: "bg-info/10 text-info" },
                { label: "Hari Menuju KGB", value: Math.max(0, daysToKgb).toString(), icon: Wallet, accent: "bg-success/10 text-success" },
                { label: "Status Pengajuan", value: myApprovals.length.toString(), icon: FileCheck, accent: "bg-warning/10 text-warning" },
              ]
            : [
                { label: "Total Pegawai", value: "1.240", icon: Users, accent: "bg-info/10 text-info" },
                { label: "Akan Naik Pangkat", value: upcomingPangkat.length.toString(), icon: TrendingUp, accent: "bg-primary/10 text-primary" },
                { label: "Akan KGB", value: upcomingKgb.length.toString(), icon: Wallet, accent: "bg-success/10 text-success" },
                { label: "Pending Approval", value: pending.length.toString(), icon: FileCheck, accent: "bg-warning/10 text-warning" },
              ]
          ).map((s) => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="p-5">
                <div className={`size-10 rounded-xl flex items-center justify-center ${s.accent}`}>
                  <s.icon className="size-5" />
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & Table */}
        {!isPegawai && (
           <div className="grid lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 shadow-card">
                <CardHeader><CardTitle className="text-base">Trend Kenaikan Pangkat & KGB</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bulan" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Area type="monotone" dataKey="pangkat" stroke="oklch(0.55 0.16 260)" fill="oklch(0.55 0.16 260)" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader><CardTitle className="text-base">Distribusi Golongan</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={golData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>
                        {golData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
           </div>
        )}
      </div>
    </AppShell>
  );
}
