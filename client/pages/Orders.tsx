import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  getOrders,
  setOrders,
  type Order,
  getCurrentUserId,
} from "@/data/store";
import { Link, useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setLocal] = useState<Order[]>(getOrders());

  useEffect(() => {
    const uid = getCurrentUserId();
    if (!uid) {
      navigate(`/login?redirect=${encodeURIComponent("/orders")}`);
      return;
    }
    const update = () => setLocal(getOrders());
    window.addEventListener("storage", update);
    window.addEventListener("orders-updated", update as EventListener);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("orders-updated", update as EventListener);
    };
  }, [navigate]);

  const formatDate = (ts: number) => new Date(ts).toLocaleString();
  const format = (n: number) =>
    new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(n);
  const itemsCount = (o: Order) => o.items.reduce((s, i) => s + i.qty, 0);
  const statusLabel: Record<Order["status"], string> = {
    unpaid: "Төлбөр төлөгдөөгүй",
    paid: "Төлбөр төлөгдсөн",
    shipping: "Хүргэлт хийгдэж байна",
    delivered: "Хүргэгдсэн",
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Захиалгын түүх</h1>
          <p className="text-muted-foreground mt-1">
            Таны хийсэн бүх захиалгууд
          </p>
        </div>
        <Link to="/">
          <Button variant="outline">Нүүр рүү</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Огноо</TableHead>
            <TableHead>Захиалга ���</TableHead>
            <TableHead>Тоо</TableHead>
            <TableHead>Нийт</TableHead>
            <TableHead>Төлөв</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders
            .filter((o) => !o.userId || o.userId === getCurrentUserId())
            .map((o) => (
              <TableRow key={o.id}>
                <TableCell>{formatDate(o.createdAt)}</TableCell>
                <TableCell className="font-mono text-xs">{o.id}</TableCell>
                <TableCell>{itemsCount(o)}</TableCell>
                <TableCell>{format(o.total)}</TableCell>
                <TableCell className="capitalize">{o.status}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        {orders.filter((o) => !o.userId || o.userId === getCurrentUserId())
          .length === 0 && (
          <TableCaption>
            Одоогоор захиалга алга. Дэлгүүрээс бараа сонгон захиалаарай.
          </TableCaption>
        )}
      </Table>

      {orders.filter((o) => !o.userId || o.userId === getCurrentUserId())
        .length > 0 && (
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Захиалгын дэлгэ��энгүй:</p>
          <ul className="mt-2 space-y-2">
            {orders
              .filter((o) => !o.userId || o.userId === getCurrentUserId())
              .map((o) => (
                <li key={o.id} className="rounded-md border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">№ {o.id}</div>
                    <div>{formatDate(o.createdAt)}</div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Хүлээн авагч
                      </div>
                      <div>
                        {o.customer.name} · {o.customer.phone}
                      </div>
                      <div className="text-xs text-muted-foreground">Хаяг</div>
                      <div>{o.customer.address}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Бараанууд
                      </div>
                      <div className="mt-1 grid grid-cols-3 gap-2">
                        {o.items.map((i) => (
                          <div
                            key={i.id}
                            className="rounded border bg-background p-2"
                          >
                            <img
                              src={i.image}
                              alt={i.name}
                              className="h-14 w-full object-cover rounded"
                            />
                            <div className="mt-1 truncate text-xs">
                              {i.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ×{i.qty}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
