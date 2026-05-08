import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPegawai, nextPangkat, daysUntil } from "@/lib/simpeg-data";
import { TrendingUp, Calendar, User as UserIcon, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/kenaikan-pangkat")({ component: Page });

function Page() {
  const { user } = useAuth();
  const isPegawai = user?.role === "pegawai";

  // Filter list based on role
  const rawList = isPegawai ? mockPegawai.filter((p) => p.nip === user?.nip) : mockPegawai;

  const list = rawList
    .map((p) => ({
      p,
      next: nextPangkat(p),
      days: daysUntil(nextPangkat(p)),
    }))
    .sort((a, b) => a.days - b.days);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <AppShell title={isPegawai ? "Jadwal Pangkat Saya" : "Monitoring Kenaikan Pangkat"}>
      <div className="space-y-5">
        {!isPegawai && (
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                label: "H-7 (Urgent)",
                val: list.filter((x) => x.days <= 7 && x.days > 0).length,
                color: "bg-destructive/10 text-destructive",
              },
              {
                label: "H-30",
                val: list.filter((x) => x.days <= 30 && x.days > 7).length,
                color: "bg-warning/10 text-warning",
              },
              {
                label: "Total Akan Naik (90 hari)",
                val: list.filter((x) => x.days <= 90 && x.days > 0).length,
                color: "bg-primary/10 text-primary",
              },
            ].map((s) => (
              <Card key={s.label} className="shadow-card">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`size-12 rounded-xl flex items-center justify-center ${s.color}`}>
                    <TrendingUp className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{s.val}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              {isPegawai
                ? "Estimasi Kenaikan Pangkat Berikutnya"
                : "Jadwal Monitoring (Otomatis +4 Tahun)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {list.length > 0 ? (
                list.map(({ p, next, days }) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 p-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="size-11 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow">
                      <UserIcon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{p.nama}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.jabatan} • Gol {p.golongan}
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-medium text-foreground flex items-center justify-end gap-1.5">
                        <Calendar className="size-3.5" /> {fmt(next)}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        TMT Pangkat Selanjutnya
                      </div>
                    </div>
                    <div className="min-w-[80px] text-right">
                      <Badge
                        className={
                          days <= 7
                            ? "bg-destructive text-destructive-foreground"
                            : days <= 30
                              ? "bg-warning text-warning-foreground"
                              : days <= 90
                                ? "bg-info text-info-foreground"
                                : "bg-muted text-foreground"
                        }
                      >
                        {days > 0 ? `H-${days}` : `Lewat ${Math.abs(days)} hari`}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-muted-foreground">
                  <TrendingUp className="size-12 mx-auto opacity-20 mb-3" />
                  <p>Data tidak ditemukan.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {isPegawai && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm text-muted-foreground flex gap-3">
            <TrendingUp className="size-5 text-primary shrink-0" />
            <p>
              <strong>Catatan:</strong> Jadwal di atas adalah estimasi sistem berdasarkan TMT
              Pangkat terakhir Anda (+4 tahun). Pastikan Anda sudah mengunggah dokumen pendukung di
              menu <strong>Layanan Mandiri</strong> 6 bulan sebelum tanggal tersebut.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
