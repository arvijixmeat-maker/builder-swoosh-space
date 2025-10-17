import { useEffect, useMemo, useRef, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getOrders,
  getCart,
  type User,
} from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";

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
  const [avatar, setAvatar] = useState<string | undefined>(
    (user as User | null | undefined)?.avatar,
  );

  // Password change
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const rules = useMemo(
    () => ({
      len: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      num: /\d/.test(pwd),
      match: pwd.length > 0 && pwd === pwd2,
    }),
    [pwd, pwd2],
  );

  const fileRef = useRef<HTMLInputElement | null>(null);

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

  const onSaveProfile = () => {
    const patch = {
      name: name.trim(),
      lastName: lastName.trim() || undefined,
      gender: (gender || undefined) as any,
      birthYear: birthYear ? Number(birthYear) : undefined,
      birthMonth: birthMonth ? Number(birthMonth) : undefined,
      birthDay: birthDay ? Number(birthDay) : undefined,
      avatar,
    } as Partial<User>;
    updateCurrentUser(patch);
    toast({ title: "Хадгалагдлаа" });
  };

  const onChangePassword = () => {
    if (
      !rules.len ||
      !rules.upper ||
      !rules.lower ||
      !rules.num ||
      !rules.match
    ) {
      toast({
        title: "Нууц үг шаардлагыг хангаагүй байна",
        description: "8-аас дээш, том/жижиг үсэг болон тоо орсон байх",
      });
      return;
    }
    updateCurrentUser({ password: pwd });
    setPwd("");
    setPwd2("");
    toast({ title: "Нууц үг шинэчлэгдлээ" });
  };

  const logout = () => {
    deleteCurrentUser();
    navigate("/");
  };

  const onPickFile = () => fileRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      setAvatar(url);
      updateCurrentUser({ avatar: url } as any);
      toast({ title: "Зураг шинэчлэгдлээ" });
    };
    reader.readAsDataURL(file);
  };

  const PasswordRule = ({ ok, label }: { ok: boolean; label: string }) => (
    <div
      className={`flex items-center gap-2 text-sm ${ok ? "text-green-600" : "text-red-600"}`}
    >
      {ok ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
        {/* Sidebar */}
        <Card className="h-fit shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4 border-4 border-background shadow-md">
                <AvatarImage src={avatar} alt={name || user.name} />
                <AvatarFallback className="text-2xl font-semibold">
                  {(name || user.name || "?").slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-lg">{name || user.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </div>
              </div>
            </div>
            <nav className="mt-6 grid gap-1">
              <Link
                to="/orders"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium">Захиалгууд</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {ordersCount}
                </span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium">Сагс</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left"
              >
                <span className="text-sm font-medium">Гарах</span>
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl">Тохиргоо</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">Нэр</Label>
                  <Input
                    id="firstName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Овог</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">И-мэйл</Label>
                  <Input id="email" value={user.email} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Утасны дугаар</Label>
                  <Input id="phone" value={user.phone} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Хүйс</Label>
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Төрсөн огноо</Label>
                  <div className="grid grid-cols-3 gap-3">
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
              <div className="mt-8 flex justify-end">
                <Button onClick={onSaveProfile} size="lg" className="px-8">Хадгалах</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Бүртгэл устгах</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Бүртгэлээ устгавал таны бүх мэдээлэл устах болно
                  </p>
                </div>
                <Button
                  onClick={logout}
                  variant="destructive"
                  size="sm"
                >
                  Устгах
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
