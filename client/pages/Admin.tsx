import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/components/site/ProductCard";
import { Plus, Pencil, Trash2, Download } from "lucide-react";

const STORAGE_KEY = "admin_products";

export default function Admin() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>({ id: "", name: "", price: 0, image: "", badge: "" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch {
        setProducts([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const stats = useMemo(() => ({
    totalProducts: products.length,
    categories: new Set(products.map((p) => p.badge || ""))?.size || 0,
    lowPrice: products.filter((p) => p.price < 200000).length,
    highPrice: products.filter((p) => p.price >= 200000).length,
  }), [products]);

  const resetForm = () => setForm({ id: "", name: "", price: 0, image: "", badge: "" });

  const startCreate = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setOpen(true);
  };

  const submit = () => {
    if (!form.name || !form.image || !form.price) {
      toast({ title: "Талбар дутуу", description: "Нэр, зураг, үнэ шаардлагатай" });
      return;
    }
    if (editing) {
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...form, id: editing.id } : p)));
      toast({ title: "Засвар хадгалагдлаа" });
    } else {
      const id = crypto.randomUUID();
      setProducts((prev) => [{ ...form, id }, ...prev]);
      toast({ title: "Шинэ бүтээгдэхүүн нэмлээ" });
    }
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const remove = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Устгагдлаа" });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Админ хяналтын самбар</h1>
        <p className="text-muted-foreground mt-1">Бүтээгдэхүүн, захиалга, ангиллыг удирдах</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Нийт бүтээгдэхүүн</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.totalProducts}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Ангиллын тоо</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.categories}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Хямд (<200k)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.lowPrice}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Өндөр (≥200k)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.highPrice}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Бүтээгдэхүүн удирдах</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportJson}>
              <Download className="h-4 w-4 mr-2" /> Экспорт JSON
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />Нэмэх</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Нэр</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Үнэ (MNT)</Label>
                    <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Зургийн URL</Label>
                    <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="badge">Тэмдэглэгээ (сонголттой)</Label>
                    <Input id="badge" value={form.badge || ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
                  </div>
                  {form.image ? (
                    <img src={form.image} alt="preview" className="mt-2 h-32 w-full object-cover rounded-md border" />
                  ) : null}
                </div>
                <DialogFooter>
                  <Button onClick={submit}>{editing ? "Хадгалах" : "Нэмэх"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">Зураг</TableHead>
                <TableHead>Нэр</TableHead>
                <TableHead>Үнэ</TableHead>
                <TableHead>Тэмдэглэгээ</TableHead>
                <TableHead className="w-[120px] text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{new Intl.NumberFormat("mn-MN", { style: "currency", currency: "MNT", maximumFractionDigits: 0 }).format(p.price)}</TableCell>
                  <TableCell>{p.badge}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="secondary" size="sm" onClick={() => startEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => remove(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {products.length === 0 && (
              <TableCaption>Одоогоор бүртгэлгүй байна. "Нэмэх" дарж эхлүүлнэ үү.</TableCaption>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}