import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import {
  Building2,
  TrendingUp,
  Wallet,
  Bell,
  FileCheck,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "SIMPEG — Sistem Informasi Kepegawaian Modern" },
      {
        name: "description",
        content:
          "Otomatisasi kenaikan pangkat 4 tahunan, KGB 2 tahunan, reminder, dan approval dokumen dalam satu dashboard enterprise.",
      },
    ],
  }),
});

function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;

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
            <div className="size-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elevated">
              <Building2 className="size-5 text-white" />
            </div>
            <div>
              <div className="font-bold leading-tight">SIMPEG</div>
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
          <Link to="/login">
            <Button>
              Masuk Sistem
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.97]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container max-w-7xl mx-auto px-4 py-20 lg:py-28 relative">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium mb-6">
              <Sparkles className="size-3.5" /> Modern HRIS untuk Instansi Pemerintah
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Otomatisasi Kepegawaian
              <br />
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                tanpa terlewat sehari pun.
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
              SIMPEG memantau jadwal kenaikan pangkat tiap 4 tahun, KGB tiap 2 tahun, dan
              mengingatkan pegawai serta admin sebelum deadline — lengkap dengan workflow approval &
              riwayat audit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Mulai Demo
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href="#fitur">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/5 text-white border-white/30 hover:bg-white/10 hover:text-white"
                >
                  Lihat Fitur
                </Button>
              </a>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
              {[
                ["1.240+", "Pegawai dipantau"],
                ["98%", "Tepat waktu"],
                ["3 Role", "Akses terpisah"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl lg:text-3xl font-bold">{n}</div>
                  <div className="text-xs text-white/60 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-20 lg:py-28">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-3">
              Fitur Utama
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Semua yang Anda butuhkan untuk administrasi kepegawaian.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all"
              >
                <div className="size-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform">
                  <f.icon className="size-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="role" className="py-20 bg-muted/30 border-y border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-3">
              Role Sistem
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Akses sesuai peran masing-masing.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "Admin Kepegawaian",
                color: "from-primary to-primary-glow",
                items: ["Kelola data pegawai", "Verifikasi dokumen", "Monitoring sistem"],
              },
              {
                title: "Pegawai",
                color: "from-info to-primary",
                items: ["Upload dokumen", "Cek status pengajuan", "Download surat"],
              },
              {
                title: "Pimpinan",
                color: "from-primary-glow to-info",
                items: ["Approve / reject", "Monitoring laporan", "Tanda tangan digital"],
              },
            ].map((r) => (
              <div
                key={r.title}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <div
                  className={`inline-flex size-10 rounded-xl bg-gradient-to-br ${r.color} items-center justify-center mb-4`}
                >
                  <ShieldCheck className="size-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{r.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {r.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="rounded-3xl bg-gradient-hero p-10 lg:p-14 text-center text-white shadow-elevated">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Siap mulai monitoring otomatis?
            </h2>
            <p className="mt-3 text-white/80">
              Login menggunakan akun demo Admin atau Pegawai untuk melihat dashboardnya.
            </p>
            <Link to="/login">
              <Button size="lg" className="mt-7 bg-white text-primary hover:bg-white/90">
                Masuk ke Sistem
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SIMPEG. Sistem Informasi Kepegawaian.
      </footer>
    </div>
  );
}
