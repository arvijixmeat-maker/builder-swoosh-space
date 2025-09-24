import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser, getCurrentUser } from "@/data/store";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirect = params.get("redirect") || "/";

  useEffect(() => {
    if (getCurrentUser()) navigate(redirect);
  }, [navigate, redirect]);

  const submit = () => {
    const user = loginUser(email.trim(), password);
    if (user) {
      toast({ title: "Тавтай морил" });
      navigate(redirect);
    } else {
      toast({ title: "Алдаа", description: "И-мэйл эсвэл нууц үг буруу" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Нэвтрэх</h1>
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="email">И-мэйл</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Нууц үг</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button onClick={submit}>Нэвтрэх</Button>
        <div className="text-sm text-muted-foreground">
          Бүртгэлгүй байна уу? <Link className="text-primary underline" to={`/register?redirect=${encodeURIComponent(redirect)}`}>Бүртгүүлэх</Link>
        </div>
      </div>
    </div>
  );
}
