import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser, getOrders, getCart, type Order } from "@/data/store";

export default function MyPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const cart = getCart();

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/mypage")}`);
      return;
    }
    const reload = () => setOrders(getOrders());
    window.addEventListener("orders-updated", reload as EventListener);
    return () => window.removeEventListener("orders-updated", reload as EventListener);
  }, [navigate, user]);

  if (!user) return null;

  const myOrders = orders.filter((o) => !o.userId || o.userId === user.id);
  const recent = myOrders.slice(0, 3);
  const itemsCount = (o: Order) => o.items.reduce((s, i) => s + i.qty, 0);
  const format = (n: number) => new Intl.NumberFormat("mn-MN", { style: "currency", currency: "MNT", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Миний хуудас</h1>
        <p className="text-muted-foreground mt-1">Хувийн мэдээлэл, захиалга, сагс</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Профайл</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><span className="text-muted-foreground">Нэр:</span> {user.name}</div>
            <div><span className="text-muted-foreground">И-мэйл:</span> {user.email}</div>
            <div><span className="text-muted-foreground">Утас:</span> {user.phone}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Захиалгууд</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-bold">{myOrders.length}</div>
            <Link to="/orders"><Button size="sm">Дэлгэрэнгүй</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Сагс</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-bold">{cart.reduce((s, i) => s + i.qty, 0)}</div>
            <Link to="/cart"><Button size="sm">Сагс руу</Button></Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between md:flex-row md:items-center">
          <CardTitle>Сүүлийн захиалгууд</CardTitle>
          <Link to="/orders" className="text-sm text-primary underline underline-offset-4">Бүгдийг харах</Link>
        </CardHeader>
        <CardContent>
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
              {recent.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>{itemsCount(o)}</TableCell>
                  <TableCell>{format(o.total)}</TableCell>
                  <TableCell className="capitalize">{o.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            {recent.length === 0 && (
              <TableCaption>Одоогоор захиалга алга.</TableCaption>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
