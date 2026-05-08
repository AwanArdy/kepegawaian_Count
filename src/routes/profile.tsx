import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { updateUserPassword } from "@/lib/simpeg-data";
import { toast } from "sonner";
import { Key, User as UserIcon, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

  if (!user) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      toast.error("Konfirmasi password baru tidak cocok");
      return;
    }
    
    // In a real app we'd verify 'old' password on server
    const success = updateUserPassword(user.id, passData.new);
    if (success) {
      toast.success("Password berhasil diperbarui");
      setPassData({ old: "", new: "", confirm: "" });
    } else {
      toast.error("Gagal memperbarui password");
    }
  };
  return (
    <AppShell title="Profile">
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="shadow-card lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="size-24 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <h2 className="mt-4 font-bold text-lg">{user.name}</h2>
            <Badge className="mt-2 bg-primary/10 text-primary border-0 capitalize">
              {user.role}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">{user.jabatan}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Input defaultValue={user.name} />
            </div>
            <div>
              <Label>NIP</Label>
              <Input defaultValue={user.nip} readOnly />
            </div>
            <div className="sm:col-span-2">
              <Label>Email</Label>
              <Input defaultValue={user.email} type="email" />
            </div>
            <div className="sm:col-span-2">
              <Label>Jabatan</Label>
              <Input defaultValue={user.jabatan} />
            </div>
            <div className="sm:col-span-2">
              <Button>Simpan Perubahan</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-start-2 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <CardTitle className="text-base">Keamanan & Password</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>Password Saat Ini</Label>
                  <div className="relative">
                    <Input
                      type={showPass.old ? "text" : "password"}
                      placeholder="••••••••"
                      value={passData.old}
                      onChange={(e) => setPassData({ ...passData, old: e.target.value })}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass({ ...showPass, old: !showPass.old })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPass.old ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Password Baru</Label>
                  <div className="relative">
                    <Input
                      type={showPass.new ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={passData.new}
                      onChange={(e) => setPassData({ ...passData, new: e.target.value })}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPass.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Konfirmasi Password Baru</Label>
                  <div className="relative">
                    <Input
                      type={showPass.confirm ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      value={passData.confirm}
                      onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPass.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <Button type="submit" className="shadow-glow">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
