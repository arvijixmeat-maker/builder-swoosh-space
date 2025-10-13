import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getOrders,
  getCart,
} from "@/data/store";
import { useToast } from "@/hooks/use-toast";

export default function MyPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  const [ordersCount, setOrdersCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">(
    (user?.gender as any) || "",
  );
  const [birthYear, setBirthYear] = useState<string>(
    user?.birthYear ? String(user.birthYear) : "",
  );
  const [birthMonth, setBirthMonth] = useState<string>(
    user?.birthMonth ? String(user.birthMonth) : "",
  );
  const [birthDay, setBirthDay] = useState<string>(
    user?.birthDay ? String(user.birthDay) : "",
  );
  const [editing, setEditing] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/mypage")}`);
      return;
    }
    setOrdersCount(
      getOrders().filter((o) => !o.userId || o.userId === user.id).length,
    );
    setCartCount(getCart().reduce((s, i) => s + i.qty, 0));
  }, [navigate, user]);

  if (!user) return null;

  const save = () => {
    const patch = {
      name: name.trim(),
      lastName: lastName.trim() || undefined,
      gender: (gender || undefined) as any,
      birthYear: birthYear ? Number(birthYear) : undefined,
      birthMonth: birthMonth ? Number(birthMonth) : undefined,
      birthDay: birthDay ? Number(birthDay) : undefined,
    };
    updateCurrentUser(patch);
    toast({ title: "Хадгалагдлаа" });
  };

  const logout = () => {
    deleteCurrentUser();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">{user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="grid gap-2 text-sm">
              <span className="font-medium text-muted-foreground">Профайл</span>
              <Link to="/orders" className="hover:underline">
                Миний захиалга ({ordersCount})
              </Link>
              <button
                onClick={logout}
                className="text-destructive text-left hover:underline"
              >
                Системээс гарах
              </button>
            </nav>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Хувийн мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">И-мэйл</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Утас</Label>
                <Input id="phone" value={user.phone} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">Нэр</Label>
                <Input
                  id="firstName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Овог</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Хүйс</Label>
                <Select
                  value={gender}
                  onValueChange={(v) => setGender(v as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Эр</SelectItem>
                    <SelectItem value="female">Эм</SelectItem>
                    <SelectItem value="other">Бусад</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Төрсөн огноо</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Жил"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    inputMode="numeric"
                  />
                  <Input
                    placeholder="Сар"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    inputMode="numeric"
                  />
                  <Input
                    placeholder="Өдөр"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={logout}
                className="text-sm text-destructive hover:underline"
              >
                Бүртгэл устгах
              </button>
              <Button onClick={save}>Хадгалах</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
