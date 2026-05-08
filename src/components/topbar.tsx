import { Bell, Search, Sun, Moon, X, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useMemo, useEffect, useRef } from "react";
import { 
  getStoredPegawai, 
  nextPangkat, 
  nextKgb, 
  daysUntil, 
  mockApprovals 
} from "@/lib/simpeg-data";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  title?: string;
}

export function Topbar({ title }: Props) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  // Search State
  const [q, setQ] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const allPegawai = useMemo(() => getStoredPegawai(), []);
  const searchResults = useMemo(() => {
    if (!q.trim()) return [];
    return allPegawai.filter(p => 
      p.nama.toLowerCase().includes(q.toLowerCase()) || 
      p.nip.includes(q)
    ).slice(0, 5);
  }, [q, allPegawai]);

  // Notifications Logic
  const notifications = useMemo(() => {
    const list = [];
    const isPegawai = user?.role === "pegawai";
    
    // 1. Approvals (for Admin/Pimpinan only)
    if (!isPegawai) {
      const pending = mockApprovals.filter(a => a.status === "pending");
      if (pending.length > 0) {
        list.push({
          id: "notif-app",
          title: `${pending.length} dokumen menunggu approval`,
          type: "primary",
          label: "Baru",
          time: "Sekarang",
          link: "/approval"
        });
      }
    }

    // 2. Upcoming events (Filtered by Role)
    const targets = isPegawai 
      ? allPegawai.filter(p => p.nip === user?.nip)
      : allPegawai;

    targets.forEach(p => {
      const dPangkat = daysUntil(nextPangkat(p));
      const dKgb = daysUntil(nextKgb(p));

      if (dPangkat <= 30 && dPangkat > 0) {
        list.push({
          id: `p-${p.id}`,
          title: isPegawai 
            ? `Waktunya kenaikan pangkat Anda (H-${dPangkat})`
            : `Kenaikan pangkat ${p.nama.split(',')[0]} (H-${dPangkat})`,
          type: dPangkat <= 7 ? "destructive" : "info",
          label: `H-${dPangkat}`,
          time: "Hari ini",
          link: isPegawai ? "/kenaikan-pangkat" : `/pegawai/${p.id}`
        });
      }
      if (dKgb <= 30 && dKgb > 0) {
        list.push({
          id: `k-${p.id}`,
          title: isPegawai
            ? `Waktunya KGB Anda (H-${dKgb})`
            : `KGB ${p.nama.split(',')[0]} (H-${dKgb})`,
          type: dKgb <= 7 ? "destructive" : "warning",
          label: `H-${dKgb}`,
          time: "Hari ini",
          link: isPegawai ? "/kgb" : `/pegawai/${p.id}`
        });
      }
    });

    return list.slice(0, 8);
  }, [allPegawai, user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    navigate({ to: "/pegawai/$id", params: { id } });
    setQ("");
    setShowResults(false);
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30">
      <SidebarTrigger className="-ml-1" />
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-foreground">{title || "Dashboard"}</h1>
        <p className="text-xs text-muted-foreground">
          Selamat datang kembali, {user?.name.split(",")[0]}
        </p>
      </div>
      <div className="flex-1" />
      
      {/* Search Section - Hidden for Pegawai */}
      {user?.role !== "pegawai" && (
        <div className="hidden md:flex relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Cari pegawai, NIP..." 
            className="pl-9 w-72 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:bg-card transition-all" 
          />
          {q && (
            <button 
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}

          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 border-b border-border bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Hasil Pencarian
              </div>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                  >
                    <div className="size-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {p.nama.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.nama}</div>
                      <div className="text-[10px] text-muted-foreground">{p.nip} • {p.jabatan}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
      >
        {theme === "light" ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>

      {/* Notifications Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative p-2 rounded-lg hover:bg-muted">
            <Bell className="size-5 text-muted-foreground" />
            {notifications.length > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 size-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-2 border-card">
                {notifications.length}
              </Badge>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifikasi
            <Badge variant="outline" className="font-normal text-[10px]">{notifications.length} Total</Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Tidak ada notifikasi baru
              </div>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem 
                  key={n.id} 
                  asChild
                  className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                >
                  <Link to={n.link} className="w-full">
                    <div className="flex items-center gap-2 w-full">
                      <Badge className={
                        n.type === "destructive" ? "bg-destructive text-destructive-foreground" :
                        n.type === "warning" ? "bg-warning text-warning-foreground" :
                        n.type === "info" ? "bg-info text-info-foreground" :
                        "bg-primary text-primary-foreground"
                      }>
                        {n.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">{n.time}</span>
                    </div>
                    <span className="text-sm font-medium line-clamp-2 mt-1">{n.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center text-xs text-primary font-medium py-2">
                <Link to="/reminder">Lihat Semua Reminder</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted transition-colors">
            <div className="size-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold leading-tight">
                {user?.name.split(" ").slice(0, 2).join(" ")}
              </div>
              <div className="text-[10px] text-muted-foreground capitalize">{user?.role}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center w-full">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profil Saya</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
