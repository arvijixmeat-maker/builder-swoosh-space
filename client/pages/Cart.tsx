import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  getCurrentUser,
  getSettings,
} from "@/data/store";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(getCart());
  const [shippingFee, setShippingFee] = useState<number>(
    getSettings().shippingFee,
  );

  useEffect(() => {
    const update = () => {
      const next = getCart();
      setItems((prev) => {
        try {
          if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
        } catch {
          // fallthrough
        }
        return next;
      });
    };
    window.addEventListener("storage", update);
    window.addEventListener("cart-updated", update as EventListener);
    const updateSettings = () => setShippingFee(getSettings().shippingFee);
    window.addEventListener(
      "settings-updated",
      updateSettings as EventListener,
    );
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart-updated", update as EventListener);
      window.removeEventListener(
        "settings-updated",
        updateSettings as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    try {
      const current = getCart();
      if (JSON.stringify(current) === JSON.stringify(items)) return;
    } catch {
      // ignore
    }
    setCart(items);
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );
  const shipping = useMemo(
    () => (items.length > 0 ? Math.max(0, shippingFee) : 0),
    [items, shippingFee],
  );
  const grand = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const inc = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.min(99, i.qty + 1) } : i,
      ),
    );
  const dec = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i,
      ),
    );
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const format = (n: number) =>
    new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Сагс</h1>
          <div className="text-muted-foreground mt-1 hidden md:block">
            <h1>Таны сонгосон бар��анууд</h1>
            <h5></h5>
            <h3></h3>
          </div>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={clear}>
            Сагс хоослох
          </Button>
        )}
      </div>

      {/* Mobile list */}
      <div className="md:hidden grid gap-3">
        {items.map((i) => (
          <div key={i.id} className="rounded-md border bg-card p-3 flex gap-3">
            <img
              src={i.image}
              alt={i.name}
              className="h-16 w-16 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium line-clamp-2">{i.name}</div>
                  {(i.color || i.size) && (
                    <div className="text-xs text-muted-foreground">
                      {i.color ? `Өнгө: ${i.color}` : ""}
                      {i.color && i.size ? ", " : ""}
                      {i.size ? `Хэмжээ: ${i.size}` : ""}
                    </div>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(i.id)}
                >
                  Устгах
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="inline-flex items-center rounded-md border bg-background">
                  <button
                    aria-label="Хасах"
                    className="px-3 py-2"
                    onClick={() => dec(i.id)}
                  >
                    −
                  </button>
                  <span className="min-w-10 text-center">{i.qty}</span>
                  <button
                    aria-label="Нэмэх"
                    className="px-3 py-2"
                    onClick={() => inc(i.id)}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    {format(i.price)} × {i.qty}
                  </div>
                  <div className="font-semibold">{format(i.price * i.qty)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Сагс хоосон байна.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[64px]">Зураг</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>Үнэ</TableHead>
              <TableHead>Тоо</TableHead>
              <TableHead className="text-right">Үйлдэл</TableHead>
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
                <TableCell>{format(i.price)}</TableCell>
                <TableCell>
                  <div className="inline-flex items-center rounded-md border bg-card">
                    <button
                      aria-label="Хасах"
                      className="px-3 py-2"
                      onClick={() => dec(i.id)}
                    >
                      −
                    </button>
                    <span className="min-w-10 text-center">{i.qty}</span>
                    <button
                      aria-label="Нэмэх"
                      className="px-3 py-2"
                      onClick={() => inc(i.id)}
                    >
                      +
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(i.id)}
                  >
                    Устгах
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {items.length === 0 && (
            <TableCaption>Сагс хоосон байна.</TableCaption>
          )}
        </Table>
      </div>

      <div className="mt-6 space-y-1">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Үндсэн үнэ</div>
          <div className="text-xl font-bold">{format(subtotal)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Хүргэлт</div>
          <div className="text-base font-medium">{format(shipping)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">Нийт</div>
          <div className="text-2xl font-extrabold">{format(grand)}</div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          className="w-full md:w-auto"
          disabled={items.length === 0}
          onClick={() => {
            const user = getCurrentUser();
            if (!user) {
              toast({
                title: "Нэвтрэх шаардлагатай",
                description: "Захиалга хийхийн тулд нэвтэрнэ үү",
              });
              navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
              return;
            }
            navigate("/checkout");
          }}
        >
          Төлбөр төлөх
        </Button>
      </div>
    </div>
  );
}
