import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/profile")({ component: Page });

function Page() {
  const { user } = useAuth();
  if (!user) return null;
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
      </div>
    </AppShell>
  );
}
