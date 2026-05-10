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
    const updatedDocs = [...docs, { ...newDoc, id: Date.now() }];
    setDocs(updatedDocs);
    setStoredDocs(updatedDocs);
    setIsAddDocOpen(false);
    setNewDoc({ name: "", type: "PDF", size: "" });
    toast.success("Dokumen berhasil ditambahkan");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File terlalu besar! Maksimal 2MB");
      e.target.value = "";
      setNewDoc(prev => ({ ...prev, size: "" }));
      return;
    }
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const extension = file.name.split('.').pop()?.toUpperCase() || "PDF";
    setNewDoc(prev => ({ ...prev, size: sizeStr, type: extension, name: prev.name || file.name.split('.')[0] }));
  };

  const handleDeleteDoc = (id: number) => {
    const updatedDocs = docs.filter(d => d.id !== id);
    setDocs(updatedDocs);
    setStoredDocs(updatedDocs);
    toast.success("Dokumen dihapus");
  };

  const currentData = useMemo(() => getStoredPegawai(), []);
  const upcomingPangkat = currentData.map((p) => ({ p, days: daysUntil(nextPangkat(p)) })).filter((x) => x.days <= 60 && x.days > 0).sort((a, b) => a.days - b.days);
  const upcomingKgb = currentData.map((p) => ({ p, days: daysUntil(nextKgb(p)) })).filter((x) => x.days <= 60 && x.days > 0).sort((a, b) => a.days - b.days);
  const pending = mockApprovals.filter((a) => a.status === "pending");

  const myData = currentData.find((p) => p.nip === user?.nip);
  const myApprovals = mockApprovals.filter((a) => a.pegawaiId === myData?.id);
  const myHistory = mockRiwayat.filter((r) => r.pegawaiId === myData?.id);
  const daysToPangkat = myData ? daysUntil(nextPangkat(myData)) : 0;
  const daysToKgb = myData ? daysUntil(nextKgb(myData)) : 0;

  const isPegawai = user?.role === "pegawai";
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6 pb-10">
        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-hero p-5 md:p-8 lg:p-10 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 md:space-y-4">
              <Badge className="bg-white/15 text-white border-0 py-1 px-3 capitalize text-xs md:text-sm">
                {user?.role}
              </Badge>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                Halo, {user?.name.split(",")[0]} 👋
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-xl leading-relaxed">
                {!isPegawai && user?.role === "admin" && "Kelola data kepegawaian dan verifikasi dokumen dengan efisien dalam satu dashboard."}
                {!isPegawai && user?.role === "pimpinan" && `${pending.length} pengajuan dokumen sedang menunggu persetujuan Anda.`}
                {isPegawai && `Selamat datang. Anda saat ini berada di Golongan ${myData?.golongan} sebagai ${myData?.jabatan}.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-white text-primary hover:bg-white/90 shadow-glow rounded-xl h-11 px-6 font-bold">
                <Link to={isPegawai ? "/kenaikan-pangkat" : "/reminder"}>
                  {isPegawai ? "Ajukan Berkas" : "Lihat Notifikasi"}
                </Link>
              </Button>

              {isPegawai ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md rounded-xl h-11 px-5">
                      <FileText className="size-4 mr-2" /> Dokumen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl w-[95vw] md:w-full rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Dokumen Penting</DialogTitle>
                      <DialogDescription>Akses cepat ke berkas panduan dan aturan.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                      {docs.map((doc) => (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-muted/30 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <FileText className="size-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold truncate">{doc.name}</div>
                              <div className="text-[10px] text-muted-foreground uppercase">{doc.type} • {doc.size}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-none">Baca</Button>
                            <Button size="sm" className="flex-1 sm:flex-none"><Download className="size-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                user?.role === "admin" && (
                  <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md rounded-xl h-11 px-5">
                        <Plus className="size-4 mr-2" /> Kelola Surat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl w-[95vw] md:w-full rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Format Surat</DialogTitle>
                        <DialogDescription>Manajemen file template sistem.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddDoc} className="space-y-4 mt-2 p-4 border rounded-xl bg-muted/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Nama Dokumen</Label>
                            <Input placeholder="Nama..." value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} className="h-9" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Pilih File</Label>
                            <Input type="file" onChange={handleFileChange} className="h-9 text-xs" />
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-9">Simpan Dokumen</Button>
                      </form>
                      <div className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto">
                        {docs.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm font-medium truncate pr-4">{doc.name} ({doc.size})</span>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDoc(doc.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="size-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive Column Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {(isPegawai
            ? [
                { label: "Golongan", value: myData?.golongan || "-", icon: UserIcon, color: "primary" },
                { label: "Menuju Pangkat", value: `${Math.max(0, daysToPangkat)} Hari`, icon: TrendingUp, color: "info" },
                { label: "Menuju KGB", value: `${Math.max(0, daysToKgb)} Hari`, icon: Wallet, color: "success" },
                { label: "Pengajuan", value: myApprovals.length, icon: FileCheck, color: "warning" },
              ]
            : [
                { label: "Total Pegawai", value: "1.240", icon: Users, color: "info" },
                { label: "Naik Pangkat", value: upcomingPangkat.length, icon: TrendingUp, color: "primary" },
                { label: "Akan KGB", value: upcomingKgb.length, icon: Wallet, color: "success" },
                { label: "Pending", value: pending.length, icon: FileCheck, color: "warning" },
              ]
          ).map((s) => (
            <Card key={s.label} className="border-none shadow-card hover:shadow-elevated transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`size-12 rounded-2xl flex items-center justify-center bg-${s.color}/10 text-${s.color} group-hover:scale-110 transition-transform duration-300`}>
                    <s.icon className="size-6" />
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest text-${s.color}`}>Live</div>
                </div>
                <div className="text-2xl md:text-3xl font-black tracking-tight">{s.value}</div>
                <div className="text-sm text-muted-foreground font-medium mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & Main Content - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-card rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <CardTitle className="text-base md:text-lg">Analisis Real-time</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Monitoring pergerakan data</p>
              </div>
              <Badge variant="secondary" className="rounded-lg">Statistik</Badge>
            </CardHeader>
            <CardContent className="pt-6 px-2 md:px-6">
              <div className="h-[280px] md:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.32 0.09 255)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="oklch(0.32 0.09 255)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.01 245)" />
                    <XAxis dataKey="bulan" axisLine={false} tickLine={false} fontSize={12} tick={{fill: 'oklch(0.5 0.03 250)'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: 'oklch(0.5 0.03 250)'}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="pangkat" stroke="oklch(0.32 0.09 255)" strokeWidth={3} fillOpacity={1} fill="url(#colorP)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-card rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-base md:text-lg">Sebaran Pegawai</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full pt-4">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={golData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85} paddingAngle={5}>
                      {golData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-2xl w-full">
                <div className="text-xs text-muted-foreground text-center">Data diperbarui otomatis setiap terjadi perubahan status pegawai.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
