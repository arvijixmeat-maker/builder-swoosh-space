import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBanners, setBanners, type Banner } from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";

export default function AdminBanners() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [items, setItems] = useState<Banner[]>(getBanners());

  useEffect(() => {
    const reload = () => setItems(getBanners());
    window.addEventListener("banners-updated", reload as EventListener);
    return () => window.removeEventListener("banners-updated", reload as EventListener);
  }, []);

  const toDataURL = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });

  const add = async () => {
    if (!imageFile) {
      toast({ title: "Зураг сонгоно уу" });
      return;
    }
    const image = await toDataURL(imageFile);
    const next: Banner = {
      id: crypto.randomUUID(),
      image,
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      link: link.trim() || undefined,
    };
    const all = [next, ...items];
    setBanners(all);
    setItems(all);
    setTitle("");
    setSubtitle("");
    setLink("");
    setImageFile(null);
    toast({ title: "Баннер нэмэгдлээ" });
  };

  const remove = (id: string) => {
    const all = items.filter((b) => b.id !== id);
    setBanners(all);
    setItems(all);
  };
  const move = (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const to = Math.max(0, Math.min(items.length - 1, idx + dir));
    if (to === idx) return;
    const draft = items.slice();
    const [it] = draft.splice(idx, 1);
    draft.splice(to, 0, it);
    setBanners(draft);
    setItems(draft);
  };

  const update = (id: string, patch: Partial<Banner>) => {
    const next = items.map((b) => (b.id === id ? { ...b, ...patch } : b));
    setBanners(next);
    setItems(next);
  };

  return (
    <Card id="banners" className="mb-6">
      <CardHeader>
        <CardTitle>Нүүр хуудасны баннер</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <div className="grid gap-2">
            <Label htmlFor="bimg">Зураг</Label>
            <Input id="bimg" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="btitle">Гарчиг</Label>
            <Input id="btitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ж: Шинэ коллекц" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bsub">Дэд гарчиг</Label>
            <Input id="bsub" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="ж: 20% хямдрал" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blink">Холбоос (сонголттой)</Label>
            <Input id="blink" value={link} onChange={(e) => setLink(e.target.value)} placeholder="ж: /catalog" />
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={add}><Plus className="h-4 w-4 mr-2" />Нэмэх</Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((b) => (
            <div key={b.id} className="rounded-md border overflow-hidden">
              <div className="aspect-[16/7] bg-muted overflow-hidden">
                <img src={b.image} alt={b.title || "banner"} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 grid gap-2 text-sm">
                <div className="grid gap-1">
                  <Label>Гарчиг</Label>
                  <Input value={b.title || ""} onChange={(e) => update(b.id, { title: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label>Дэд гарчиг</Label>
                  <Input value={b.subtitle || ""} onChange={(e) => update(b.id, { subtitle: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label>Холбоос</Label>
                  <Input value={b.link || ""} onChange={(e) => update(b.id, { link: e.target.value })} />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => move(b.id, -1)}><ArrowUp className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => move(b.id, 1)}><ArrowDown className="h-4 w-4" /></Button>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => remove(b.id)}><Trash2 className="h-4 w-4 mr-1" />Устгах</Button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">Одоогоор баннер байхгүй. Дээрх хэлбэрээр нэмнэ үү.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
