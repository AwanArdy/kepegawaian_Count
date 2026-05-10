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
  mockPegawai,
  mockApprovals,
  nextPangkat,
  nextKgb,
  daysUntil,
  mockRiwayat,
  getStoredPegawai,
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
import { useState, useMemo } from "react";

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

const importantDocs = [
  { id: 1, name: "Panduan Kenaikan Pangkat 2026", type: "PDF", size: "1.2 MB" },
  { id: 2, name: "Peraturan KGB Terbaru (Pertek No. 12)", type: "PDF", size: "850 KB" },
  { id: 3, name: "Manual Penggunaan Dashboard SIKAPAS", type: "PDF", size: "2.4 MB" },
  { id: 4, name: "Template SKP Tahunan", type: "DOCX", size: "45 KB" },
];

function Dashboard() {
  const { user } = useAuth();
  const [selectedDoc, setSelectedDoc] = useState<(typeof importantDocs)[0] | null>(null);

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

                  {/* Important Docs Feature */}
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
                        {importantDocs.map((doc) => (
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
                                  <DialogHeader className="p-4 border-b">
                                    <DialogTitle className="flex items-center justify-between pr-8">
                                      <span>Pratinjau: {doc.name}</span>
                                      <Badge variant="outline" className="text-[10px]">
                                        {doc.type}
                                      </Badge>
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="flex-1 bg-muted/20 flex items-center justify-center relative">
                                    {/* Mock PDF Viewer UI */}
                                    <div className="absolute inset-0 p-8 overflow-y-auto bg-slate-100 flex flex-col items-center">
                                      <div className="w-full max-w-[600px] aspect-[1/1.4] bg-white shadow-lg p-12 border flex flex-col items-center text-center">
                                        <FileText className="size-20 text-slate-200 mb-6" />
                                        <h3 className="text-xl font-bold text-slate-800">
                                          {doc.name}
                                        </h3>
                                        <p className="text-slate-500 mt-4 text-sm leading-relaxed">
                                          Ini adalah tampilan pratinjau dokumen PDF. Dalam sistem
                                          nyata, file PDF akan dirender di sini menggunakan library
                                          seperti react-pdf-viewer atau via iframe.
                                        </p>
                                        <div className="mt-12 w-full h-px bg-slate-100" />
                                        <div className="mt-8 space-y-4 w-full">
                                          {[1, 2, 3, 4].map((i) => (
                                            <div
                                              key={i}
                                              className="h-4 bg-slate-50 rounded-full w-full animate-pulse"
                                              style={{ animationDelay: `${i * 100}ms` }}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-card border-t flex justify-end gap-3">
                                    <Button variant="outline" size="sm">
                                      <ExternalLink className="size-4 mr-2" /> Buka di Tab Baru
                                    </Button>
                                    <Button size="sm">
                                      <Download className="size-4 mr-2" /> Download Sekarang
                                    </Button>
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
                <Button
                  asChild
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link to="/laporan">Generate Laporan</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(isPegawai
            ? [
                {
                  label: "Golongan Saat Ini",
                  value: myData?.golongan || "-",
                  change: "Pangkat Terakhir",
                  icon: UserIcon,
                  accent: "bg-primary/10 text-primary",
                },
                {
                  label: "Hari Menuju Pangkat",
                  value: Math.max(0, daysToPangkat).toString(),
                  change: "Estimasi 4 Tahunan",
                  icon: TrendingUp,
                  accent: "bg-info/10 text-info",
                },
                {
                  label: "Hari Menuju KGB",
                  value: Math.max(0, daysToKgb).toString(),
                  change: "Estimasi 2 Tahunan",
                  icon: Wallet,
                  accent: "bg-success/10 text-success",
                },
                {
                  label: "Status Pengajuan",
                  value: myApprovals.length.toString(),
                  change: "Dokumen Aktif",
                  icon: FileCheck,
                  accent: "bg-warning/10 text-warning",
                },
              ]
            : [
                {
                  label: "Total Pegawai",
                  value: "1.240",
                  change: "+24",
                  icon: Users,
                  accent: "bg-info/10 text-info",
                },
                {
                  label: "Akan Naik Pangkat",
                  value: upcomingPangkat.length.toString(),
                  change: "60 hari",
                  icon: TrendingUp,
                  accent: "bg-primary/10 text-primary",
                },
                {
                  label: "Akan KGB",
                  value: upcomingKgb.length.toString(),
                  change: "60 hari",
                  icon: Wallet,
                  accent: "bg-success/10 text-success",
                },
                {
                  label: "Pending Approval",
                  value: pending.length.toString(),
                  change: "Perlu tindakan",
                  icon: FileCheck,
                  accent: "bg-warning/10 text-warning",
                },
              ]
          ).map((s) => (
            <Card key={s.label} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center ${s.accent}`}
                  >
                    <s.icon className="size-5" />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <div className="text-2xl lg:text-3xl font-bold tracking-tight">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  <div className="text-[11px] text-primary font-medium mt-2">{s.change}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isPegawai ? (
          /* PEGAWAI VIEW */
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Status Pengajuan & Dokumen</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lacak progres administrasi Anda
                    </p>
                  </div>
                  <Badge variant="outline">Aktif</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {myApprovals.length > 0 ? (
                  myApprovals.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/20"
                    >
                      <div
                        className={`size-10 rounded-full flex items-center justify-center ${
                          app.status === "approved"
                            ? "bg-success/10 text-success"
                            : app.status === "pending"
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {app.status === "approved" ? (
                          <CheckCircle2 className="size-5" />
                        ) : app.status === "pending" ? (
                          <Clock className="size-5" />
                        ) : (
                          <AlertCircle className="size-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{app.type}</div>
                        <div className="text-xs text-muted-foreground">
                          Diajukan pada {new Date(app.submittedAt).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      <Badge
                        className={
                          app.status === "approved"
                            ? "bg-success text-success-foreground"
                            : app.status === "pending"
                              ? "bg-warning text-warning-foreground"
                              : "bg-destructive text-destructive-foreground"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileCheck className="size-12 mx-auto opacity-20 mb-3" />
                    <p className="text-sm">Belum ada pengajuan aktif.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Riwayat Terakhir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-0.5 before:bg-border">
                  {myHistory.slice(0, 4).map((h) => (
                    <div key={h.id} className="relative flex gap-4 pl-8">
                      <div className="absolute left-0 mt-1.5 size-[22px] rounded-full border-4 border-background bg-primary" />
                      <div>
                        <div className="text-sm font-semibold">{h.title}</div>
                        <p className="text-xs text-muted-foreground mt-0.5">{h.description}</p>
                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="size-3" />{" "}
                          {new Date(h.date).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ADMIN/PIMPINAN VIEW */
          <>
            {/* Same charts as before */}
            <div className="grid lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Trend Kenaikan Pangkat & KGB</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">7 bulan terakhir</p>
                  </div>
                  <Badge variant="outline">2026</Badge>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.55 0.16 260)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="oklch(0.55 0.16 260)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.7 0.15 155)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="oklch(0.7 0.15 155)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.92 0.01 245)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="bulan"
                        stroke="oklch(0.5 0.03 250)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="oklch(0.5 0.03 250)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid oklch(0.92 0.01 245)",
                          fontSize: 12,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="pangkat"
                        stroke="oklch(0.55 0.16 260)"
                        strokeWidth={2.5}
                        fill="url(#g1)"
                      />
                      <Area
                        type="monotone"
                        dataKey="kgb"
                        stroke="oklch(0.7 0.15 155)"
                        strokeWidth={2.5}
                        fill="url(#g2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Distribusi Golongan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={golData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {golData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            {/* ... Rest of admin view ... */}
          </>
        )}
      </div>
    </AppShell>
  );
}
