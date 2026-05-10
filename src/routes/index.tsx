import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Wallet,
  Bell,
  FileCheck,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  UserCircle,
  Clock,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { 
  getStoredPegawai, 
  nextPangkat, 
  daysUntil 
} from "@/lib/simpeg-data";
import { useMemo } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  
  const allPegawai = useMemo(() => getStoredPegawai(), []);
  
  // Ambil data pangkat terdekat untuk tampilan transparan jika login
  const upcomingPangkat = useMemo(() => {
    if (!user) return [];
    
    return allPegawai
      .map(p => ({
        ...p,
        tglNext: nextPangkat(p),
        sisaHari: daysUntil(nextPangkat(p))
      }))
      .filter(p => p.sisaHari > 0)
      .sort((a, b) => a.sisaHari - b.sisaHari)
      .slice(0, 5);
  }, [allPegawai, user]);

  const features = [
    {
      icon: TrendingUp,
      title: "Kenaikan Pangkat Otomatis",
      desc: "Sistem menghitung jadwal naik pangkat setiap 4 tahun secara otomatis.",
    },
    {
      icon: Wallet,
      title: "KGB Otomatis",
      desc: "Kenaikan Gaji Berkala dijadwalkan otomatis tiap 2 tahun, lengkap dengan pengingat.",
    },
    {
      icon: Bell,
      title: "Reminder H-30/14/7",
      desc: "Notifikasi dashboard, email, dan WhatsApp sebelum deadline administrasi.",
    },
    {
      icon: FileCheck,
      title: "Approval Workflow",
      desc: "Alur approval dokumen yang transparan dari pegawai → admin → pimpinan.",
    },
    {
      icon: Calendar,
      title: "Kalender Monitoring",
      desc: "Visualisasi jadwal pangkat, KGB, dan deadline dokumen dalam satu kalender.",
    },
    {
      icon: ShieldCheck,
      title: "Riwayat & Audit",
      desc: "Tracking lengkap riwayat pangkat, KGB, dan dokumen tiap pegawai.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="size-10 shrink-0">
              <img 
                src="/kementrian_imigrasi_sikapas.png" 
                alt="SIKAPAS Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold leading-tight">SIKAPAS</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Sistem Kepegawaian
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <a href="#fitur" className="hover:text-foreground">
              Fitur
            </a>
            <a href="#workflow" className="hover:text-foreground">
              Workflow
            </a>
            <a href="#role" className="hover:text-foreground">
              Role
            </a>
          </nav>
          {user ? (
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button>
                Masuk Sistem
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 lg:pt-24 pb-20 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.98]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-24 size-96 rounded-full bg-primary-glow/10 blur-3xl animate-pulse delay-700" />

        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-10">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="size-3.5 text-yellow-400" /> Modern HRIS untuk Instansi Pemerintah
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Otomatisasi Kepegawaian
                <br />
                <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                  tanpa terlewat sehari pun.
                </span>
              </h1>
              <p className="mt-8 text-xl text-white/80 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                SIKAPAS memantau jadwal kenaikan pangkat tiap 4 tahun, KGB tiap 2 tahun, dan
                mengingatkan pegawai serta admin sebelum deadline — lengkap dengan workflow approval &
                riwayat audit.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-base shadow-elevated">
                      Masuk ke Dashboard
                      <ArrowRight className="size-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-base shadow-elevated">
                      Mulai Demo Sekarang
                      <ArrowRight className="size-5" />
                    </Button>
                  </Link>
                )}
                <a href="#fitur">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/5 text-white border-white/30 hover:bg-white/10 hover:text-white h-14 px-8 text-base"
                  >
                    Pelajari Fitur
                  </Button>
                </a>
              </div>
            </div>

            {/* Mockup Dashboard */}
            <div className="relative w-full lg:w-1/2 group animate-in fade-in slide-in-from-right-10 duration-1000 delay-500">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-glow/50 to-transparent blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-2xl p-2 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="rounded-xl overflow-hidden border border-white/10 bg-background/95">
                  <div className="h-8 border-b border-border bg-muted/50 flex items-center gap-1.5 px-4">
                    <div className="size-2.5 rounded-full bg-destructive/40" />
                    <div className="size-2.5 rounded-full bg-warning/40" />
                    <div className="size-2.5 rounded-full bg-success/40" />
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-1/3 h-24 rounded-lg bg-primary/5 border border-primary/10 p-3">
                        <div className="size-6 rounded-md bg-primary/20 mb-2" />
                        <div className="h-3 w-12 bg-primary/20 rounded mb-1" />
                        <div className="h-5 w-8 bg-primary/40 rounded" />
                      </div>
                      <div className="w-1/3 h-24 rounded-lg bg-info/5 border border-info/10 p-3">
                        <div className="size-6 rounded-md bg-info/20 mb-2" />
                        <div className="h-3 w-16 bg-info/20 rounded mb-1" />
                        <div className="h-5 w-10 bg-info/40 rounded" />
                      </div>
                      <div className="w-1/3 h-24 rounded-lg bg-success/5 border border-success/10 p-3">
                        <div className="size-6 rounded-md bg-success/20 mb-2" />
                        <div className="h-3 w-14 bg-success/20 rounded mb-1" />
                        <div className="h-5 w-12 bg-success/40 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-32 w-full rounded-lg bg-muted/30 border border-border flex items-center justify-center">
                         <div className="flex flex-col items-center gap-2">
                            <TrendingUp className="size-8 text-primary/30" />
                            <div className="h-2 w-24 bg-primary/10 rounded" />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Schedule Section */}
      {user && (
        <section id="jadwal" className="py-16 border-b border-border bg-muted/20 relative overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl font-bold">Monitoring Kenaikan Pangkat Transparan</h2>
                <p className="text-sm text-muted-foreground mt-1">Daftar estimasi kenaikan pangkat pegawai terdekat berdasarkan data sistem.</p>
              </div>
              <Link to="/kenaikan-pangkat">
                <Button variant="link" className="text-primary font-semibold">
                  Lihat Semua Jadwal <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {upcomingPangkat.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {p.nama.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">{p.nama.split(',')[0]}</div>
                      <div className="text-[10px] text-muted-foreground">{p.nip}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Sisa Waktu</div>
                      <div className={`text-sm font-bold ${p.sisaHari <= 30 ? 'text-destructive' : 'text-primary'}`}>
                        {p.sisaHari} Hari
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${p.sisaHari <= 30 ? 'bg-destructive' : 'bg-primary'}`} 
                        style={{ width: `${Math.max(10, 100 - (p.sisaHari / 1460 * 100))}%` }} 
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Clock className="size-3" />
                      Estimasi: {p.tglNext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section id="fitur" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 size-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                Fitur Utama
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Semua yang Anda butuhkan untuk <br className="hidden lg:block" />
                <span className="text-primary">administrasi kepegawaian.</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
              Dirancang khusus untuk mempermudah tugas rutin pengelola kepegawaian dengan otomatisasi cerdas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-8 rounded-3xl bg-card border border-border shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <f.icon className="size-24" />
                </div>
                <div className="size-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform duration-500">
                  <f.icon className="size-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="mt-6 pt-6 border-t border-border/50 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Pelajari selengkapnya <ArrowRight className="size-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 bg-muted/30 border-y border-border relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Bagaimana SIKAPAS Bekerja?</h2>
            <p className="text-lg text-muted-foreground">
              Alur kerja yang terintegrasi untuk memastikan setiap administrasi kepegawaian berjalan tepat waktu dan sesuai aturan.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Input Data", desc: "Data pegawai dimasukkan sekali ke dalam sistem pusat." },
              { step: "02", title: "Monitoring", desc: "Sistem memantau jadwal Pangkat & KGB secara real-time." },
              { step: "03", title: "Notifikasi", desc: "Reminder otomatis dikirim H-30 sebelum deadline." },
              { step: "04", title: "Digital Approval", desc: "Proses verifikasi & tanda tangan dilakukan secara digital." },
            ].map((item, i) => (
              <div key={item.step} className="relative group">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 border-t-2 border-dashed border-border -translate-x-8 z-0" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="size-16 rounded-full bg-white border-4 border-primary/10 flex items-center justify-center text-2xl font-black text-primary mb-6 shadow-card group-hover:scale-110 group-hover:border-primary transition-all duration-300">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="role" className="py-24 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              Akses Berbasis Peran
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Akses sesuai peran <br className="hidden lg:block" /> masing-masing.
            </h2>
            <p className="text-muted-foreground text-lg">
              Sistem menyediakan antarmuka yang dioptimalkan untuk setiap jenis pengguna.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Admin Kepegawaian",
                icon: Users,
                color: "from-primary to-primary-glow",
                desc: "Pengelola pusat data dan monitor seluruh progres administrasi.",
                items: ["Kelola data pegawai", "Verifikasi dokumen", "Monitoring sistem"],
              },
              {
                title: "Pegawai",
                icon: UserCircle,
                color: "from-info to-primary",
                desc: "Akses mandiri untuk memantau karir dan mengunggah berkas.",
                items: ["Upload dokumen", "Cek status pengajuan", "Download surat"],
              },
              {
                title: "Pimpinan",
                icon: FileCheck,
                color: "from-primary-glow to-info",
                desc: "Otoritas tertinggi untuk persetujuan dan pemantauan laporan.",
                items: ["Approve / reject", "Monitoring laporan", "Tanda tangan digital"],
              },
            ].map((r) => (
              <div
                key={r.title}
                className="group p-8 rounded-3xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div
                  className={`inline-flex size-14 rounded-2xl bg-gradient-to-br ${r.color} items-center justify-center mb-6 shadow-glow group-hover:rotate-6 transition-transform`}
                >
                  <r.icon className="size-7 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{r.desc}</p>
                <ul className="space-y-4">
                  {r.items.map((i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <FileCheck className="size-3 text-primary" />
                      </div>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SIKAPAS. Sistem Informasi Kepegawaian.
      </footer>
    </div>
  );
}
