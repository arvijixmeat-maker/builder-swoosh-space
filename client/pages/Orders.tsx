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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getOrders,
  setOrders,
  type Order,
  getCurrentUserId,
  getCurrentUser,
} from "@/data/store";
import { Link, useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setLocal] = useState<Order[]>(getOrders());
  const user = getCurrentUser();
  const [filter, setFilter] = useState<"all" | "unpaid" | "processing" | "delivered">("all");

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

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
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
  const mine = useMemo(() => orders.filter((o) => !o.userId || o.userId === getCurrentUserId()), [orders]);
  const filteredMine = useMemo(() => {
    if (filter === "all") return mine;
    if (filter === "unpaid") return mine.filter((o) => o.status === "unpaid");
    if (filter === "delivered") return mine.filter((o) => o.status === "delivered");
    return mine.filter((o) => o.status === "paid" || o.status === "shipping");
  }, [mine, filter]);
  const stats = useMemo(
    () => ({
      total: mine.length,
      unpaid: mine.filter((o) => o.status === "unpaid").length,
      processing: mine.filter((o) => o.status === "paid" || o.status === "shipping").length,
      spent: mine.reduce((s, o) => s + o.total, 0),
    }),
    [mine],
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/10 via-red-400/10 to-primary/10 p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Миний хуудас</h1>
            <p className="text-muted-foreground">Захиалгын түүх ба тойм</p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border bg-white/60 backdrop-blur px-3 py-1.5">
            <span className="text-sm">{user?.name || "Хэрэглэгч"}</span>
          </div>
          <Link to="/">
            <Button variant="outline" className="shrink-0">Нүүр рүү</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card>
          <CardHeader className="p-3 md:p-4 pb-1">
            <CardTitle className="text-xs text-muted-foreground">Нийт захиалга</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0 text-2xl font-bold">{stats.total}</CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-4 pb-1">
            <CardTitle className="text-xs text-muted-foreground">Шинэ/Төлбөргүй</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0 text-2xl font-bold">{stats.unpaid}</CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-4 pb-1">
            <CardTitle className="text-xs text-muted-foreground">Боловсруулж буй</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0 text-2xl font-bold">{stats.processing}</CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-4 pb-1">
            <CardTitle className="text-xs text-muted-foreground">Нийт зарцуулсан</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0 text-2xl font-bold">{format(stats.spent)}</CardContent>
        </Card>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto">
        {[
          { key: "all", label: "Бүгд" },
          { key: "unpaid", label: "Төлбөргүй" },
          { key: "processing", label: "Боловсруулж буй" },
          { key: "delivered", label: "Хүргэгдсэн" },
        ].map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === (f.key as any) ? "default" : "outline"}
            onClick={() => setFilter(f.key as any)}
            className="rounded-full"
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Огноо</TableHead>
                <TableHead>Захиалга №</TableHead>
                <TableHead>Тоо</TableHead>
                <TableHead>Нийт</TableHead>
                <TableHead>Төлөв</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMine.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>{itemsCount(o)}</TableCell>
                  <TableCell>{format(o.total)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        o.status === "unpaid"
                          ? "destructive"
                          : o.status === "paid"
                          ? "default"
                          : o.status === "shipping"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {statusLabel[o.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {filteredMine.length === 0 && (
              <TableCaption>Тохирох захиалга олдсонгүй.</TableCaption>
            )}
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
