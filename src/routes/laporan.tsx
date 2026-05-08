import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart, FileText, FileSpreadsheet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getStoredPegawai, mockApprovals } from "@/lib/simpeg-data";
import { generateMonthlyPDF, exportToExcel, generateYearlyAnalysisPDF } from "@/lib/report-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/laporan")({ component: Page });

const data = [
  { unit: "Sekretariat", pangkat: 8, kgb: 14 },
  { unit: "Keuangan", pangkat: 5, kgb: 11 },
  { unit: "IT", pangkat: 6, kgb: 9 },
  { unit: "Hukum", pangkat: 3, kgb: 7 },
  { unit: "Diklat", pangkat: 4, kgb: 8 },
  { unit: "Humas", pangkat: 2, kgb: 5 },
];

function Page() {
  const handleGeneratePDF = () => {
    try {
      const pegawai = getStoredPegawai();
      generateMonthlyPDF(pegawai);
      toast.success("Laporan PDF berhasil diunduh");
    } catch (error) {
      toast.error("Gagal membuat laporan PDF");
    }
  };

  const handleExportExcel = () => {
    try {
      const pegawai = getStoredPegawai();
      exportToExcel(pegawai);
      toast.success("Data Excel berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengekspor data Excel");
    }
  };

  const handleYearlyAnalysis = () => {
    try {
      generateYearlyAnalysisPDF(mockApprovals);
      toast.success("Analisis tahunan berhasil diunduh");
    } catch (error) {
      toast.error("Gagal membuat analisis tahunan");
    }
  };

  const reportCards = [
    {
      i: FileText,
      l: "Laporan PDF Bulanan",
      d: "Ringkasan kenaikan pangkat & KGB",
      action: handleGeneratePDF,
    },
    {
      i: FileSpreadsheet,
      l: "Export Excel",
      d: "Detail per pegawai & unit kerja",
      action: handleExportExcel,
    },
    {
      i: FileBarChart,
      l: "Analisis Tahunan",
      d: "Trend pengajuan & approval",
      action: handleYearlyAnalysis,
    },
  ];

  return (
    <AppShell title="Laporan">
      <div className="space-y-5">
        <div className="grid md:grid-cols-3 gap-4">
          {reportCards.map((c, i) => (
            <Card
              key={i}
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              onClick={c.action}
            >
              <CardContent className="p-5">
                <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <c.i className="size-5" />
                </div>
                <div className="mt-3 font-semibold">{c.l}</div>
                <div className="text-xs text-muted-foreground">{c.d}</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    c.action();
                  }}
                >
                  <Download className="size-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Distribusi per Unit Kerja</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.92 0.01 245)"
                  vertical={false}
                />
                <XAxis
                  dataKey="unit"
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
                <Bar dataKey="pangkat" fill="oklch(0.55 0.16 260)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="kgb" fill="oklch(0.7 0.15 155)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
