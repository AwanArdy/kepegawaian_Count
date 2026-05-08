import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  mockPegawai,
  mockRiwayat,
  nextPangkat,
  nextKgb,
  getStoredPegawai,
} from "@/lib/simpeg-data";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Award, Wallet } from "lucide-react";

export const Route = createFileRoute("/pegawai/$id")({ component: DetailPegawai });

function DetailPegawai() {
  const { id } = useParams({ from: "/pegawai/$id" });
  const p = getStoredPegawai().find((x) => x.id === id);
  if (!p)
    return (
      <AppShell title="Tidak ditemukan">
        <p>Pegawai tidak ditemukan.</p>
      </AppShell>
    );
  const riwayat = mockRiwayat.filter((r) => r.pegawaiId === id);
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <AppShell title="Detail Pegawai">
      <Link
        to="/pegawai"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </Link>
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="shadow-card lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="size-24 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-elevated">
              {p.nama.charAt(0)}
            </div>
            <h2 className="mt-4 font-bold text-lg">{p.nama}</h2>
            <p className="text-sm text-muted-foreground">{p.jabatan}</p>
            <Badge className="mt-2 bg-success/10 text-success border-0 capitalize">
              {p.status}
            </Badge>
            <div className="mt-6 space-y-3 text-left text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="size-4" />
                {p.email}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="size-4" />
                {p.phone}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-4" />
                {p.unitKerja}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Award className="size-4" />
                Golongan {p.golongan}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-3 text-left">
              <div className="text-xs text-muted-foreground">NIP</div>
              <div className="text-xs font-mono">{p.nip}</div>
              <div className="text-xs text-muted-foreground">TMT Pangkat</div>
              <div className="text-xs">{fmt(p.tmtPangkat)}</div>
              <div className="text-xs text-muted-foreground">TMT KGB</div>
              <div className="text-xs">{fmt(p.tmtKgb)}</div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="shadow-card bg-gradient-primary text-white">
              <CardContent className="p-5">
                <Award className="size-6 opacity-80" />
                <div className="mt-3 text-xs opacity-80">Naik Pangkat Berikutnya</div>
                <div className="mt-1 text-xl font-bold">{fmt(nextPangkat(p))}</div>
                <div className="text-xs opacity-70 mt-1">+ 4 tahun dari TMT</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-5">
                <Wallet className="size-6 text-success" />
                <div className="mt-3 text-xs text-muted-foreground">KGB Berikutnya</div>
                <div className="mt-1 text-xl font-bold">{fmt(nextKgb(p))}</div>
                <div className="text-xs text-muted-foreground mt-1">+ 2 tahun dari TMT</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Riwayat & Dokumen</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline">
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="pangkat">Pangkat</TabsTrigger>
                  <TabsTrigger value="kgb">KGB</TabsTrigger>
                  <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline" className="mt-4">
                  <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                    {riwayat.length === 0 && (
                      <p className="text-sm text-muted-foreground">Belum ada riwayat.</p>
                    )}
                    {riwayat.map((r) => (
                      <div key={r.id} className="relative">
                        <div className="absolute -left-6 top-1 size-4 rounded-full bg-card border-2 border-primary" />
                        <div className="text-xs text-muted-foreground">{fmt(r.date)}</div>
                        <div className="font-medium text-sm">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{r.description}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="pangkat" className="mt-4 text-sm text-muted-foreground">
                  Riwayat kenaikan pangkat akan tampil di sini.
                </TabsContent>
                <TabsContent value="kgb" className="mt-4 text-sm text-muted-foreground">
                  Riwayat KGB akan tampil di sini.
                </TabsContent>
                <TabsContent value="dokumen" className="mt-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "SK Pangkat Terakhir.pdf",
                      "SK KGB 2024.pdf",
                      "Ijazah Terakhir.pdf",
                      "Sertifikat Diklat.pdf",
                    ].map((d) => (
                      <div
                        key={d}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                      >
                        <div className="size-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                          <FileText className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{d}</div>
                          <div className="text-xs text-muted-foreground">PDF • 2.4 MB</div>
                        </div>
                        <Button size="sm" variant="ghost">
                          Lihat
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
