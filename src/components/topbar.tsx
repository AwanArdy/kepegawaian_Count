import { Bell, Search, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
      <div className="hidden md:flex relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Cari pegawai, NIP..." className="pl-9 w-72 bg-muted/50 border-0" />
      </div>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
      >
        {theme === "light" ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative p-2 rounded-lg hover:bg-muted">
            <Bell className="size-5 text-muted-foreground" />
            <Badge className="absolute -top-0.5 -right-0.5 size-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-2 border-card">
              3
            </Badge>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <div className="flex items-center gap-2 w-full">
              <Badge className="bg-warning text-warning-foreground">H-7</Badge>
              <span className="text-xs text-muted-foreground ml-auto">5 menit lalu</span>
            </div>
            <span className="text-sm font-medium">KGB Diana Putri akan jatuh tempo</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <div className="flex items-center gap-2 w-full">
              <Badge className="bg-info text-info-foreground">H-14</Badge>
              <span className="text-xs text-muted-foreground ml-auto">1 jam lalu</span>
            </div>
            <span className="text-sm font-medium">Kenaikan pangkat Fajar Nugroho</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <div className="flex items-center gap-2 w-full">
              <Badge className="bg-primary text-primary-foreground">Baru</Badge>
              <span className="text-xs text-muted-foreground ml-auto">2 jam lalu</span>
            </div>
            <span className="text-sm font-medium">2 dokumen menunggu approval</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted">
            <div className="size-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
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
          <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
