import { Bell, Search, Sun, Moon, X, User as UserIcon, ArrowRight } from "lucide-react";
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
    <header className="h-16 bg-card border-b border-border flex items-center gap-2 md:gap-3 px-3 lg:px-6 sticky top-0 z-30">
      <SidebarTrigger className="-ml-1" />
      <div className="hidden sm:block min-w-0">
        <h1 className="text-sm md:text-lg font-semibold text-foreground truncate">{title || "Dashboard"}</h1>
        <p className="hidden md:block text-[10px] text-muted-foreground">
          Selamat datang kembali, {user?.name.split(",")[0]}
        </p>
      </div>
      <div className="flex-1" />
      
      {/* Search Section - Responsive Width */}
      {user?.role !== "pegawai" && (
        <div className="relative flex-1 max-w-[40px] md:max-w-72" ref={searchRef}>
          <div className="md:hidden">
            <button 
              onClick={() => setShowResults(!showResults)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Search className="size-5" />
            </button>
          </div>
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Cari..." 
              className="pl-9 w-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:bg-card transition-all" 
            />
          </div>

          {showResults && (q || (searchResults.length > 0 && !q)) && (
            <div className="absolute top-full right-0 md:left-0 w-[85vw] md:w-72 mt-2 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50">
              {/* mobile search input inside dropdown */}
              <div className="md:hidden p-2 border-b">
                 <Input 
                    autoFocus
                    value={q} 
                    onChange={e => setQ(e.target.value)} 
                    placeholder="Ketik NIP/Nama..." 
                    className="h-9"
                 />
              </div>
              {searchResults.length > 0 ? (
                <>
                  <div className="p-2 border-b border-border bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    Hasil Pencarian
                  </div>
                  <div className="max-h-60 overflow-y-auto">
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
                          <div className="text-[10px] text-muted-foreground truncate">{p.nip}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : q && (
                <div className="p-4 text-center text-xs text-muted-foreground">Tidak ditemukan</div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          {theme === "light" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>

        {/* Notifications Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="size-5 text-muted-foreground" />
              {notifications.length > 0 && (
                <Badge className="absolute top-1.5 right-1.5 size-3.5 p-0 flex items-center justify-center text-[8px] bg-destructive text-destructive-foreground border-2 border-card animate-pulse">
                  {notifications.length}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-85 mt-2 rounded-2xl shadow-elevated">
            <DropdownMenuLabel className="flex items-center justify-between p-4 pb-2">
              <span className="font-bold">Notifikasi</span>
              <Badge variant="secondary" className="text-[10px] rounded-md px-1.5 py-0">
                {notifications.length} Total
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2" />
            <div className="max-h-[70vh] overflow-y-auto px-1 py-1 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Bell className="size-8 opacity-20 mb-2" />
                  <p className="text-xs">Tidak ada notifikasi baru</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem 
                    key={n.id} 
                    asChild
                    className="flex flex-col items-start gap-1 p-3 mx-1 my-0.5 rounded-xl cursor-pointer focus:bg-muted/60"
                  >
                    <Link to={n.link} className="w-full">
                      <div className="flex items-center gap-2 w-full mb-1">
                        <span className={`inline-block size-2 rounded-full ${
                          n.type === "destructive" ? "bg-destructive" :
                          n.type === "warning" ? "bg-warning" :
                          n.type === "info" ? "bg-info" :
                          "bg-primary"
                        }`} />
                        <Badge variant="outline" className="text-[8px] h-4 py-0 leading-none font-bold uppercase tracking-tighter">
                          {n.label}
                        </Badge>
                        <span className="text-[9px] text-muted-foreground ml-auto font-medium">{n.time}</span>
                      </div>
                      <span className="text-xs font-semibold leading-relaxed line-clamp-2 text-foreground/90">{n.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator className="mx-2" />
                <DropdownMenuItem asChild className="justify-center text-xs text-primary font-bold py-3 rounded-b-2xl focus:bg-primary/5">
                  <Link to="/reminder" className="flex items-center gap-2">
                    Lihat Semua Reminder <ArrowRight className="size-3" />
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 md:pr-3 rounded-full hover:bg-muted transition-colors">
              <div className="size-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold shadow-sm shrink-0">
                {user?.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold leading-tight truncate max-w-[100px]">
                  {user?.name.split(" ")[0]}
                </div>
                <div className="text-[10px] text-muted-foreground capitalize">{user?.role}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
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
      </div>
    </header>
  );
}
