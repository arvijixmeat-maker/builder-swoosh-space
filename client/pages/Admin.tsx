import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Plus, Pencil, Trash2, Download, X, Check } from "lucide-react";
import SettingsPanel from "./_AdminSettings";
import {
  CATEGORIES_KEY,
  getCategories,
  setCategories,
  getProductsLS,
  setProductsLS,
  getOrders,
  setOrders,
  type Order,
  updateOrderStatus,
  getUsers,
  type User,
  getCurrentUser,
} from "@/data/store";

const STORAGE_KEY = "admin_products";

export default function Admin() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    image: "",
    images: [],
    category: "",
    badge: "",
    colors: [],
    sizes: [],
  });
  const [newCat, setNewCat] = useState("");
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editCatValue, setEditCatValue] = useState("");
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [users, setUsersState] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) navigate(`/login?redirect=${encodeURIComponent("/admin")}`);
  }, [navigate]);

  useEffect(() => {
    setProducts(getProductsLS<Product>(STORAGE_KEY));
    setCategoriesState(getCategories());
    setOrdersState(getOrders());
    setUsersState(getUsers());

    const reloadOrders = () => setOrdersState(getOrders());
    const reloadUsers = () => setUsersState(getUsers());
    window.addEventListener("orders-updated", reloadOrders as EventListener);
    window.addEventListener("users-updated", reloadUsers as EventListener);
    return () => {
      window.removeEventListener(
        "orders-updated",
        reloadOrders as EventListener,
      );
      window.removeEventListener("users-updated", reloadUsers as EventListener);
    };
  }, []);

  useEffect(() => {
    setProductsLS(STORAGE_KEY, products);
  }, [products]);

  useEffect(() => {
    try {
      const current = getCategories();
      if (JSON.stringify(current) !== JSON.stringify(categories)) {
        setCategories(categories);
      }
    } catch {
      setCategories(categories);
    }
  }, [categories]);

  const stats = useMemo(
    () => ({
      totalProducts: products.length,
      categories: categories.length,
      lowPrice: products.filter((p) => p.price < 200000).length,
      highPrice: products.filter((p) => p.price >= 200000).length,
    }),
    [products, categories],
  );

  const resetForm = () =>
    setForm({
      id: "",
      name: "",
      price: 0,
      image: "",
      images: [],
      category: "",
      badge: "",
      colors: [],
      sizes: [],
    });

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
    const finalImage = form.image || (form.images && form.images[0]) || "";
    if (!form.name || !finalImage || !form.price) {
      toast({
        title: "Талбар дутуу",
        description: "Нэр, зураг, үнэ шаардлагатай",
      });
      return;
    }
    const payload: Product = { ...form, image: finalImage };
    if (editing) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id ? { ...payload, id: editing.id } : p,
        ),
      );
      toast({ title: "Засвар хадгалагдлаа" });
    } else {
      const id = crypto.randomUUID();
      setProducts((prev) => [{ ...payload, id }, ...prev]);
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

  const addCategory = () => {
    const name = newCat.trim();
    if (!name) {
      toast({ title: "Нэр хоосон байна" });
      return;
    }
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      toast({ title: "Давхардсан ангилал" });
      return;
    }
    const next = [name, ...categories];
    setCategoriesState(next);
    setCategories(next);
    setNewCat("");
    toast({ title: "Ангилал нэмэгдлээ" });
  };

  const removeCategory = (name: string) => {
    const next = categories.filter((c) => c !== name);
    setCategoriesState(next);
    setProducts((prev) =>
      prev.map((p) => (p.category === name ? { ...p, category: "" } : p)),
    );
    if (editingCat === name) {
      setEditingCat(null);
      setEditCatValue("");
    }
    toast({ title: "Ангилал устгагдлаа" });
  };

  const startEditCategory = (name: string) => {
    setEditingCat(name);
    setEditCatValue(name);
  };

  const saveEditCategory = () => {
    const from = editingCat;
    const to = editCatValue.trim();
    if (!from) return;
    if (!to) {
      toast({ title: "Нэр хоосон байна" });
      return;
    }
    if (to !== from && categories.includes(to)) {
      toast({ title: "Давхардсан ангилал" });
      return;
    }
    const next = categories.map((c) => (c === from ? to : c));
    setCategoriesState(next);
    setProducts((prev) =>
      prev.map((p) => (p.category === from ? { ...p, category: to } : p)),
    );
    setEditingCat(null);
    setEditCatValue("");
    toast({ title: "Ангилал шинэчлэгдлээ" });
  };

  const cancelEditCategory = () => {
    setEditingCat(null);
    setEditCatValue("");
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: "application/json",
    });
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
        <h1 className="text-2xl md:text-3xl font-bold">
          Админ хяналтын самбар
        </h1>
        <p className="text-muted-foreground mt-1">
          Бүтээгдэхүүн, захиалга, ангиллыг удирдах
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="mt-2">
        <TabsList className="w-full justify-start gap-1 flex-wrap">
          <TabsTrigger value="dashboard">Хяналт</TabsTrigger>
          <TabsTrigger value="products">Бүтээгдэхүүн</TabsTrigger>
          <TabsTrigger value="orders">Захиалгууд</TabsTrigger>
          <TabsTrigger value="users">Хэрэглэгчид</TabsTrigger>
          <TabsTrigger value="categories">Ангилал</TabsTrigger>
          <TabsTrigger value="settings">Тохиргоо</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
      <div id="stats" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Нийт бүтээгдэхүүн
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Ангиллын тоо
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.categories}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Хямд (&lt;200k)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.lowPrice}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Өндөр (≥200k)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.highPrice}
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="categories">
      <Card id="categories" className="mb-6">
        <CardHeader>
          <CardTitle>Ангилал удирдах</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 grid gap-2">
              <Label htmlFor="newCat">Шинэ ангилал</Label>
              <div className="flex gap-2">
                <Input
                  id="newCat"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                  placeholder="ж: Электроник"
                />
                <Button type="button" onClick={addCategory}>
                  Нэмэх
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs"
              >
                {editingCat === c ? (
                  <>
                    <input
                      className="h-7 rounded border bg-background px-2 text-xs"
                      value={editCatValue}
                      onChange={(e) => setEditCatValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditCategory();
                        if (e.key === "Escape") cancelEditCategory();
                      }}
                      aria-label="Ангилал нэр"
                      autoFocus
                    />
                    <button
                      aria-label="Save"
                      onClick={saveEditCategory}
                      className="opacity-80 hover:opacity-100"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label="Cancel"
                      onClick={cancelEditCategory}
                      className="opacity-60 hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <span>{c}</span>
                    <button
                      aria-label="Edit"
                      onClick={() => startEditCategory(c)}
                      className="opacity-60 hover:opacity-100"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      aria-label="Remove"
                      onClick={() => removeCategory(c)}
                      className="opacity-60 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                )}
              </span>
            ))}
            {categories.length === 0 && (
              <span className="text-sm text-muted-foreground">
                Одоогоор ангилал алга. Дээрх талбараар шинээр нэмнэ үү.
              </span>
            )}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="orders">
      <Card id="orders" className="mb-6">
        <CardHeader>
          <CardTitle>Захиалгууд</CardTitle>
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
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    {new Date(o.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>
                    {o.items.reduce((s, i) => s + i.qty, 0)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                      maximumFractionDigits: 0,
                    }).format(o.total)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={o.status}
                      onValueChange={(v) =>
                        updateOrderStatus(o.id, v as Order["status"])
                      }
                    >
                      <SelectTrigger className="h-9 w-[220px]">
                        <SelectValue placeholder="Төлөв сонгох" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="unpaid">Төлбөр төлөгдөөгүй</SelectItem>
                        <SelectItem value="paid">Төлбөр төлөгдсөн</SelectItem>
                        <SelectItem value="shipping">Хүргэлт хийгдэж байна</SelectItem>
                        <SelectItem value="delivered">Хүргэгдсэн</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {orders.length === 0 && (
              <TableCaption>Одоогоор захиалга алга.</TableCaption>
            )}
          </Table>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="users">
      <Card id="users" className="mb-6">
        <CardHeader>
          <CardTitle>Хэрэглэгчид</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Огноо</TableHead>
                <TableHead>Нэр</TableHead>
                <TableHead>И-мэйл</TableHead>
                <TableHead>Утас</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            {users.length === 0 && (
              <TableCaption>Одоогоор хэрэглэгч бүртгэлгүй.</TableCaption>
            )}
          </Table>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="products">
      <Card id="products">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Бүтээгдэхүүн удирдах</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportJson}>
              <Download className="h-4 w-4 mr-2" /> Экспорт JSON
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Нэмэх
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editing ? "Бү��ээ��дэхүүн засах" : "Шинэ бүтээгдэхүүн"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Нэр</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Үнэ (KRW)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Ангилал</Label>
                    <select
                      id="category"
                      className="h-10 rounded-md border bg-background px-3 text-sm"
                      value={form.category || ""}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      <option value="">Сонгоно уу</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Эхлээд "Ангилал" хэсгээс категори нэмнэ үү.
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Зураг (олон)</Label>
                    <Input
                      id="image"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        const toDataURL = (file: File) =>
                          new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () =>
                              resolve(String(reader.result));
                            reader.readAsDataURL(file);
                          });
                        const images = await Promise.all(files.map(toDataURL));
                        setForm({ ...form, images, image: images[0] });
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="badge">Тэмдэглэгээ (сонголттой)</Label>
                    <Input
                      id="badge"
                      value={form.badge || ""}
                      onChange={(e) =>
                        setForm({ ...form, badge: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Өнгө (сонголт)</Label>
                    <div className="grid grid-cols-8 gap-2">
                      {[
                        "#000000",
                        "#FFFFFF",
                        "#808080",
                        "#FF0000",
                        "#FFA500",
                        "#FFFF00",
                        "#008000",
                        "#00FFFF",
                        "#0000FF",
                        "#4B0082",
                        "#800080",
                        "#FFC0CB",
                        "#A0522D",
                        "#F5DEB3",
                        "#2F4F4F",
                        "#FF69B4",
                      ].map((c) => {
                        const selected = (form.colors || []).includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              const set = new Set(form.colors || []);
                              if (set.has(c)) set.delete(c);
                              else set.add(c);
                              setForm({ ...form, colors: Array.from(set) });
                            }}
                            className={`relative h-8 w-8 rounded-full border transition ${
                              selected ? "ring-2 ring-primary" : ""
                            }`}
                            style={{ background: c }}
                            aria-pressed={selected}
                            aria-label={`Color ${c}`}
                            title={c}
                          >
                            {selected && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {form.colors && form.colors.length === 0 && (
                      <span className="text-xs text-muted-foreground">Сонголтгүй бол өнгө шүүлтгүй гэж үзнэ.</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label>Хэмжээ (сонголт)</Label>
                    <div className="flex flex-wrap gap-2">
                      {["XS","S","M","L","XL","XXL","35","36","37","38","39","40","41","42","43","44"].map((s) => {
                        const selected = (form.sizes || []).includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              const set = new Set(form.sizes || []);
                              if (set.has(s)) set.delete(s);
                              else set.add(s);
                              setForm({ ...form, sizes: Array.from(set) });
                            }}
                            className={`h-8 rounded-md border bg-card px-2 text-xs transition ${
                              selected ? "ring-2 ring-primary" : ""
                            }`}
                            aria-pressed={selected}
                            aria-label={`Size ${s}`}
                            title={s}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    {form.sizes && form.sizes.length === 0 && (
                      <span className="text-xs text-muted-foreground">Сонголтгүй бол хэмжээ шүүлтгүй гэж үзнэ.</span>
                    )}
                  </div>
                  {form.images && form.images.length > 0 ? (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {form.images.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`preview-${idx}`}
                          className="h-24 w-full object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  ) : form.image ? (
                    <img
                      src={form.image}
                      alt="preview"
                      className="mt-2 h-32 w-full object-cover rounded-md border"
                    />
                  ) : null}
                </div>
                <DialogFooter>
                  <Button onClick={submit}>
                    {editing ? "Хадгалах" : "Нэмэх"}
                  </Button>
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
                <TableHead>Ангилал</TableHead>
                <TableHead>Тэмдэглэгээ</TableHead>
                <TableHead className="w-[120px] text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                      maximumFractionDigits: 0,
                    }).format(p.price)}
                  </TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.badge}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => startEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {products.length === 0 && (
              <TableCaption>
                Одоогоор бүртгэлгүй байна. "Нэмэх" дарж эхлүүлнэ үү.
              </TableCaption>
            )}
          </Table>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="settings">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
