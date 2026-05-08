import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockApprovals, type Approval } from "@/lib/simpeg-data";
import { useAuth } from "@/lib/auth-context";
import { FileText, Check, X, Upload, Eye, Download, ExternalLink, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/approval")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [list, setList] = useState<Approval[]>(mockApprovals);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const filtered = list.filter((a) => a.status === tab);
  const isPimpinan = user?.role === "pimpinan";
  const isPegawai = user?.role === "pegawai";

  const update = (id: string, status: "approved" | "rejected") => {
    setList((l) => l.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(status === "approved" ? "Disetujui" : "Ditolak");
    if (selectedApproval?.id === id) {
      setSelectedApproval(null);
    }
  };

  const handleDownload = () => {
    if (!selectedApproval) return;
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Menyiapkan unduhan: ${selectedApproval.dokumen}...`,
      success: `Dokumen ${selectedApproval.dokumen} berhasil diunduh.`,
      error: "Gagal mengunduh dokumen.",
    });
  };

  const toggleFullscreen = () => {
    if (!previewRef.current) return;

    if (!document.fullscreenElement) {
      previewRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          toast.error(`Gagal: ${err.message}`);
        });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  return (
    <AppShell title="Approval Dokumen">
      <div className="space-y-5">
        {isPegawai && (
          <Card className="shadow-card border-dashed border-2">
            <CardContent className="p-8 text-center">
              <div className="size-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Upload className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold">Upload Dokumen Pengajuan</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop SK, berkas pendukung, atau dokumen KGB
              </p>
              <Button className="mt-4">Pilih File</Button>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          {(["pending", "approved", "rejected"] as const).map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              onClick={() => setTab(t)}
              className="capitalize"
            >
              {t} ({list.filter((a) => a.status === t).length})
            </Button>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Daftar Pengajuan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">Tidak ada data.</p>
            )}
            {filtered.map((a) => (
              <div key={a.id} className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{a.pegawaiNama}</span>
                      <Badge variant="outline">{a.type}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      📄 {a.dokumen} • Diajukan{" "}
                      {new Date(a.submittedAt).toLocaleDateString("id-ID")}
                    </div>
                    {a.catatan && (
                      <div className="text-xs text-destructive mt-1.5">Catatan: {a.catatan}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedApproval(a)}>
                      <Eye className="size-4" />
                      Preview
                    </Button>
                    {isPimpinan && a.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() => update(a.id, "approved")}
                        >
                          <Check className="size-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => update(a.id, "rejected")}
                        >
                          <X className="size-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={!!selectedApproval}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApproval(null);
            if (document.fullscreenElement) document.exitFullscreen();
          }
        }}
      >
        <DialogContent
          className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden"
          onFullScreenChange={handleFullscreenChange}
        >
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle>{selectedApproval?.type}</DialogTitle>
                <DialogDescription>
                  {selectedApproval?.pegawaiNama} • {selectedApproval?.dokumen}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="size-4 mr-2" /> Download
                </Button>
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  {isFullscreen ? (
                    <Minimize2 className="size-4 mr-2" />
                  ) : (
                    <ExternalLink className="size-4 mr-2" />
                  )}
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div
            ref={previewRef}
            className="flex-1 bg-muted/50 p-8 flex items-center justify-center overflow-auto scrollbar-hide"
          >
            {/* Mock Document Preview */}
            <Card
              className={`w-full max-w-2xl shadow-lg bg-white p-12 border-none ${isFullscreen ? "min-h-[1000px] my-8" : "min-h-[800px]"}`}
            >
              <div className="flex justify-between items-start mb-12">
                <div className="w-20 h-20 bg-muted rounded-full animate-pulse" />
                <div className="text-right space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse ml-auto" />
                  <div className="h-4 w-48 bg-muted rounded animate-pulse ml-auto" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="h-8 w-3/4 bg-muted rounded animate-pulse mx-auto mb-12" />

                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <div
                      key={i}
                      className={`h-4 bg-muted rounded animate-pulse ${i % 3 === 0 ? "w-full" : i % 2 === 0 ? "w-5/6" : "w-4/5"}`}
                    />
                  ))}
                </div>

                <div className="h-4 w-1/2 bg-muted rounded animate-pulse mt-12" />

                <div className="pt-20 flex justify-end">
                  <div className="text-center space-y-4">
                    <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-16 w-32 bg-muted/30 rounded mx-auto" />
                    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <DialogFooter className="p-4 border-t bg-background">
            <div className="flex justify-end gap-3 w-full">
              <Button variant="outline" onClick={() => setSelectedApproval(null)}>
                Tutup
              </Button>
              {isPimpinan && selectedApproval?.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => update(selectedApproval!.id, "rejected")}
                  >
                    <X className="size-4 mr-2" /> Tolak
                  </Button>
                  <Button
                    className="bg-success hover:bg-success/90 text-success-foreground"
                    onClick={() => update(selectedApproval!.id, "approved")}
                  >
                    <Check className="size-4 mr-2" /> Setujui Dokumen
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
