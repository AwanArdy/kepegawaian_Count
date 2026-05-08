import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockPegawai, nextPangkat, nextKgb } from "@/lib/simpeg-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/kalender")({ component: Page });

function Page() {
  const [cursor, setCursor] = useState(new Date());
  const events = [
    ...mockPegawai.map((p) => ({
      date: new Date(nextPangkat(p)),
      title: `Pangkat ${p.nama.split(",")[0]}`,
      color: "bg-primary text-primary-foreground",
    })),
    ...mockPegawai.map((p) => ({
      date: new Date(nextKgb(p)),
      title: `KGB ${p.nama.split(",")[0]}`,
      color: "bg-success text-success-foreground",
    })),
  ];

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const days = last.getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));

  const monthName = cursor.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <AppShell title="Kalender">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg capitalize">{monthName}</CardTitle>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCursor(new Date())}>
              Hari ini
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-muted-foreground mb-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div key={d} className="text-center py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c, i) => {
              const today = c && c.toDateString() === new Date().toDateString();
              const dayEvents = c
                ? events.filter((e) => e.date.toDateString() === c.toDateString())
                : [];
              return (
                <div
                  key={i}
                  className={`min-h-[90px] rounded-lg border p-1.5 ${c ? "bg-card" : "bg-muted/30"} ${today ? "border-primary border-2" : "border-border"}`}
                >
                  {c && (
                    <>
                      <div className={`text-xs font-semibold ${today ? "text-primary" : ""}`}>
                        {c.getDate()}
                      </div>
                      <div className="space-y-0.5 mt-1">
                        {dayEvents.slice(0, 2).map((e, j) => (
                          <div
                            key={j}
                            className={`text-[10px] px-1.5 py-0.5 rounded truncate ${e.color}`}
                          >
                            {e.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-muted-foreground">
                            +{dayEvents.length - 2} lagi
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Badge className="bg-primary text-primary-foreground">●</Badge>Kenaikan Pangkat
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-success text-success-foreground">●</Badge>KGB
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
