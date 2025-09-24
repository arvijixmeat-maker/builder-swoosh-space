import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCart, setCart, type CartItem, addOrder, getCurrentUser, getCurrentUserId } from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Checkout() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(getCart());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart-updated", update as EventListener);
    };
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const format = (n: number) => new Intl.NumberFormat("mn-MN", { style: "currency", currency: "MNT", maximumFractionDigits: 0 }).format(n);

  const placeOrder = () => {
    if (!getCurrentUser()) {
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast({ title: "Мэдээлэл дутуу", description: "Нэр, утас, хаяг бөглөнө үү" });
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
      total: subtotal,
      customer: { name: name.trim(), phone: phone.trim(), address: address.trim() },
      status: "new" as const,
      userId: getCurrentUserId() || undefined,
    };
    addOrder(order);
    setCart([]);
    toast({ title: "Захиалга амжилттай", description: "Захиалга тань бүртгэгдлээ" });
    navigate("/orders");
  };

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Төлбөр</h1>
            <p className="text-muted-foreground mt-1">Захиалгын мэдээллээ баталгаажуулна уу</p>
          </div>
          <Link to="/cart" className="text-sm text-primary underline underline-offset-4">Сагс руу буцах</Link>
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
                  <img src={i.image} alt={i.name} className="h-10 w-10 rounded object-cover" />
                </TableCell>
                <TableCell className="font-medium">{i.name}</TableCell>
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
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Утас</Label>
          <Input id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Хаяг</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">Нийт</div>
          <div className="text-xl font-bold">{format(subtotal)}</div>
        </div>
        <Button className="w-full" disabled={items.length === 0} onClick={placeOrder}>Захиалга баталгаажуулах</Button>
      </div>
    </div>
  );
}
