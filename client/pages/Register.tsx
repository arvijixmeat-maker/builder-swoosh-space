import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addUser, getCurrentUser } from "@/data/store";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const redirect = params.get("redirect") || "/";

  useEffect(() => {
    if (getCurrentUser()) navigate(redirect);
  }, [navigate, redirect]);

  const submit = () => {
    try {
      const u = addUser({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      toast({ title: "Бүртгэл амжилттай" });
      navigate(redirect);
    } catch (e: any) {
      if (e?.message === "EMAIL_TAKEN") toast({ title: "И-мэйл бүртгэлтэй байна" });
      else toast({ title: "Алдаа", description: "Дахин оролдож үзнэ үү" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Бүртгүүлэх</h1>
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="name">Нэр</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">И-мэйл</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Утас</Label>
          <Input id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Нууц үг</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button onClick={submit}>Бүртгүүлэх</Button>
        <div className="text-sm text-muted-foreground">
          Аль хэдийн бүртгэлтэй юу? <Link className="text-primary underline" to={`/login?redirect=${encodeURIComponent(redirect)}`}>Нэвтрэх</Link>
        </div>
      </div>
    </div>
  );
}
