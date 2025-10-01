import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCart,
  setCart,
  type CartItem,
  addOrder,
  getCurrentUser,
  getCurrentUserId,
  getSettings,
} from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

export default function Checkout() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(getCart());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shippingFee, setShippingFee] = useState<number>(getSettings().shippingFee);
  const [accounts, setAccounts] = useState(getSettings().bankAccounts);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    setName(user.name);
    setPhone(user.phone);
  }, [navigate]);

  useEffect(() => {
    const update = () => setItems(getCart());
    window.addEventListener("storage", update);
    window.addEventListener("cart-updated", update as EventListener);
    const updateSettings = () => {
      const s = getSettings();
      setShippingFee(s.shippingFee);
      setAccounts(s.bankAccounts);
    };
    window.addEventListener("settings-updated", updateSettings as EventListener);
    updateSettings();
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart-updated", update as EventListener);
      window.removeEventListener("settings-updated", updateSettings as EventListener);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );
  const shipping = useMemo(() => (items.length > 0 ? Math.max(0, shippingFee) : 0), [items, shippingFee]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);
  const format = (n: number) =>
    new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(n);

  const placeOrder = () => {
    if (!getCurrentUser()) {
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast({
        title: "Мэдээлэл дутуу",
        description: "Нэр, утас, хаяг б��глөнө үү",
      });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Сагс хоосон" });
      navigate("/");
      return;
    }
    const order = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      items,
      total: total,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },
      status: "unpaid" as const,
      userId: getCurrentUserId() || undefined,
    };
    addOrder(order);
    setCart([]);
    toast({
      title: "Захиалга амжилттай",
      description: "Захиалга тан�� бүртгэгдлээ",
    });
    navigate("/orders");
  };

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Төлбөр</h1>
            <p className="text-muted-foreground mt-1">
              Захиалгын мэдээллээ баталгаажуулна уу
            </p>
          </div>
          <Link
            to="/cart"
            className="text-sm text-primary underline underline-offset-4"
          >
            Сагс руу буцах
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[64px]">Зураг</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>Тоо</TableHead>
              <TableHead>Дүн</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <img
                    src={i.image}
                    alt={i.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>{i.name}</div>
                  {(i.color || i.size) && (
                    <div className="text-xs text-muted-foreground">
                      {i.color ? `Өнгө: ${i.color}` : ""}
                      {i.color && i.size ? ", " : ""}
                      {i.size ? `Хэмжээ: ${i.size}` : ""}
                    </div>
                  )}
                </TableCell>
                <TableCell>{i.qty}</TableCell>
                <TableCell>{format(i.price * i.qty)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {items.length === 0 && (
            <TableCaption>Сагс хоосон байна.</TableCaption>
          )}
        </Table>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Хүлээн авагчийн нэр</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Утас</Label>
          <Input
            id="phone"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Хаяг</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Үндсэн үнэ
            <br />
          </div>
          <div className="text-xl font-bold">{format(subtotal)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Хүргэлт</div>
          <div className="text-base font-medium">{format(shipping)}</div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="text-sm">Нийт</div>
          <div className="text-2xl font-extrabold">{format(total)}</div>
        </div>

        {accounts.length > 0 && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
            <div className="font-medium mb-2">Бан��ны мэдээлэл</div>
            <ul className="space-y-2">
              {accounts.map((a, idx) => (
                <li key={idx} className="flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 p-2">
                  <div className="min-w-0">
                    <div className="text-muted-foreground">
                      {a.bankName} / {a.holder}
                    </div>
                    {a.note ? (
                      <div className="text-xs text-muted-foreground mt-0.5">{a.note}</div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono whitespace-nowrap">{a.accountNumber}</span>
                    <button
                      type="button"
                      aria-label="계좌번호 복사"
                      className="inline-flex h-7 items-center gap-1 rounded border border-red-300 bg-white px-2 text-xs text-red-700 hover:bg-red-100"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(a.accountNumber);
                          toast({ title: "Хууллаа", description: "Дансны дугаар хууллаа" });
                        } catch {}
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" /> Хуулах
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          className="w-full mt-4"
          disabled={items.length === 0}
          onClick={placeOrder}
        >
          Захиалга баталгаажуулах
        </Button>
      </div>
    </div>
  );
}
