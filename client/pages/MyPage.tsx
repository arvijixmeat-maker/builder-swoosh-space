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
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
        {/* Sidebar */}
        <Card className="h-fit">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={avatar} alt={name || user.name} />
                <AvatarFallback>
                  {(name || user.name || "?").slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{name || user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>
            <nav className="mt-5 grid gap-2 text-sm">
              <Link to="/orders" className="hover:underline">
                Захиалгууд ({ordersCount})
              </Link>
              <Link to="/cart" className="hover:underline">
                Сагс ({cartCount})
              </Link>
              <button
                onClick={logout}
                className="text-left text-destructive hover:underline"
              >
                Гарах
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Тохиргоо</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="email">И-мэйл</Label>
                  <Input id="email" value={user.email} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Утасны дугаар</Label>
                  <Input id="phone" value={user.phone} disabled />
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
                <div className="grid gap-2">
                  <Label>Зураг</Label>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={avatar} alt={name || user.name} />
                      <AvatarFallback>
                        {(name || user.name || "?").slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onPickFile}
                    >
                      Зураг оруулах
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={onSaveProfile}>Хадгалах</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <button
              onClick={logout}
              className="text-sm text-destructive hover:underline"
            >
              Бүртгэл устгах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
