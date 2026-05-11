import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ShieldCheck, User as UserIcon, Lock, Loader2 } from "lucide-react";
import api from "@/services/api";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        nip: formData.username,
        password: formData.password
      });

      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        login(userData, token);
        toast.success(`Selamat datang, ${userData.name}`);
        navigate({ to: "/dashboard" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login gagal. Periksa kembali NIP dan Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 lg:p-8">
      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white rounded-3xl shadow-elevated overflow-hidden border">
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-primary text-white relative">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                 <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <ShieldCheck className="size-7" />
                 </div>
                 <h1 className="text-2xl font-bold tracking-tight">SIKAPAS</h1>
              </div>
              <h2 className="text-4xl font-extrabold leading-tight mb-6">
                Sistem Informasi <br/> Kepegawaian & Pangkat
              </h2>
              <p className="text-white/80 text-lg max-w-md leading-relaxed">
                Kelola data kepegawaian, kenaikan pangkat, dan KGB secara terintegrasi, transparan, dan akuntabel.
              </p>
           </div>
           
           <div className="relative z-10 pt-12 border-t border-white/10">
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="size-8 rounded-full bg-white/20 border-2 border-primary-foreground flex items-center justify-center text-[10px] font-bold">
                         U{i}
                      </div>
                    ))}
                 </div>
                 <p className="text-xs text-white/70">Bergabunglah dengan ribuan pegawai lainnya.</p>
              </div>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 lg:hidden flex items-center gap-2">
               <ShieldCheck className="size-8 text-primary" />
               <span className="font-bold text-xl">SIKAPAS</span>
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Masuk ke Sistem</h3>
              <p className="text-slate-500 mt-2">Gunakan NIP dan password untuk mengakses dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-semibold">NIP / Username</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="username"
                    placeholder="Masukkan NIP"
                    className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" id="password-label" className="text-slate-700 font-semibold">Password</Label>
                  <Button variant="link" size="sm" className="px-0 h-auto text-primary text-xs font-semibold">Lupa Password?</Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold shadow-glow mt-2" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk Sekarang"
                )}
              </Button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-sm text-slate-500">
                Belum punya akun? <span className="text-primary font-semibold">Hubungi Admin Unit Kerja</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
