import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPegawai, nextKgb, nextPangkat, daysUntil, mockApprovals } from "@/lib/simpeg-data";
import { Bell, Mail, MessageCircle, AlertCircle, CheckCircle2, Clock, Info } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/reminder")({ component: Page });

function Page() {
  const { user } = useAuth();
  const isPegawai = user?.role === "pegawai";

  // Base list
  const rawReminders = [
    ...mockPegawai.map((p) => ({
      p,
      type: "Kenaikan Pangkat" as const,
      days: daysUntil(nextPangkat(p)),
      date: nextPangkat(p),
    })),
    ...mockPegawai.map((p) => ({
      p,
      type: "KGB" as const,
      days: daysUntil(nextKgb(p)),
      date: nextKgb(p),
    })),
  ];

  // Role-based filtering
  const all = isPegawai
    ? rawReminders.filter((r) => r.p.nip === user?.nip && r.days <= 180) // Pegawai see up to 6 months ahead
    : rawReminders.filter((r) => r.days <= 60 && r.days > 0); // Admin see immediate next 2 months

  const myPendingApprovals = isPegawai
    ? mockApprovals.filter(
        (a) => a.pegawaiNama.includes(user?.name.split(" ")[0]) && a.status === "pending",
      )
    : [];

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <AppShell title={isPegawai ? "Pusat Notifikasi Saya" : "Monitoring Reminder Sistem"}>
      <div className="space-y-6">
        {/* Top Stats Section */}
        <div className="grid md:grid-cols-3 gap-4">
          {isPegawai ? (
            <>
              <Card className="shadow-card border-none bg-primary/5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Bell className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{all.length}</div>
                    <div className="text-xs text-muted-foreground">Jadwal Mendatang</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card border-none bg-warning/5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{myPendingApprovals.length}</div>
                    <div className="text-xs text-muted-foreground">Menunggu Approval</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card border-none bg-success/5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Semua</div>
                    <div className="text-xs text-muted-foreground">Status Berkas</div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="shadow-card">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Bell className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{all.length}</div>
                    <div className="text-xs text-muted-foreground">Reminder Aktif</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-info/10 text-info flex items-center justify-center">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Email Terkirim Hari Ini</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs text-muted-foreground">WhatsApp Notifikasi</div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Alerts for Pegawai */}
        {isPegawai && all.some((r) => r.days <= 30) && (
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-destructive">
                Perhatian: Deadline Administrasi
              </h4>
              <p className="text-xs text-destructive/80 mt-1">
                Anda memiliki jadwal kepegawaian dalam kurang dari 30 hari. Segera pastikan semua
                dokumen Anda sudah lengkap.
              </p>
            </div>
          </div>
        )}

        {/* Main List */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg px-1">
            {isPegawai ? "Daftar Pengingat Karir" : "Log Reminder Sistem"}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {all.length > 0 ? (
              all
                .sort((a, b) => a.days - b.days)
                .map((r, i) => (
                  <Card
                    key={i}
                    className={`shadow-card group hover:shadow-elevated transition-all border-l-4 ${
                      r.days <= 7
                        ? "border-l-destructive"
                        : r.days <= 30
                          ? "border-l-warning"
                          : "border-l-info"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-muted text-[10px] font-bold tracking-wider uppercase"
                        >
                          {r.type}
                        </Badge>
                        <Badge
                          className={
                            r.days <= 7
                              ? "bg-destructive text-destructive-foreground"
                              : r.days <= 30
                                ? "bg-warning text-warning-foreground"
                                : "bg-info text-info-foreground"
                          }
                        >
                          {r.days > 0 ? `H-${r.days}` : "Hari Ini"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {!isPegawai && <div className="font-bold text-sm">{r.p.nama}</div>}
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Clock className="size-3" /> Jatuh tempo pada {fmt(r.date)}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <div className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                          <Info className="size-3" />{" "}
                          {r.days <= 30 ? "Segera tindak lanjuti" : "Sistem akan memantau"}
                        </div>
                        <button className="text-[10px] font-bold text-primary hover:underline">
                          DETAIL
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <Bell className="size-12 mx-auto opacity-10 mb-3" />
                <p className="text-sm italic">Tidak ada pengingat aktif untuk saat ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
