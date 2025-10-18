import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBanners, setBanners, type Banner } from "@/data/supabase-store";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { uploadMultipleImages } from "@/lib/storage";

export default function AdminBanners() {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [items, setItems] = useState<Banner[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const banners = await getBanners();
    setItems(banners);
  };

  const add = async () => {
    try {
      if (!imageFile) {
        toast({
          title: "Зураг сонгоно уу",
          description: "Файл сонгоно уу",
        });
        return;
      }
      toast({ title: "Зураг байршуулж байна..." });
      const urls = await uploadMultipleImages([imageFile], "banners");
      if (urls.length === 0) {
        toast({ title: "Алдаа", description: "Зураг байршуулахад алдаа гарлаа", variant: "destructive" });
        return;
      }
      const next: Banner = {
        id: crypto.randomUUID(),
        image: urls[0],
      };
      const all = [next, ...items];
      await setBanners(all);
      await loadData();
      setImageFile(null);
      toast({ title: "Баннер нэмэгдлээ" });
    } catch (e) {
      toast({ title: "Алдаа", description: "Зураг нэмэхэд алдаа гарлаа", variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    const all = items.filter((b) => b.id !== id);
    await setBanners(all);
    await loadData();
  };
  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const to = Math.max(0, Math.min(items.length - 1, idx + dir));
    if (to === idx) return;
    const draft = items.slice();
    const [it] = draft.splice(idx, 1);
    draft.splice(to, 0, it);
    await setBanners(draft);
    await loadData();
  };

  return (
    <Card id="banners" className="mb-6">
      <CardHeader>
        <CardTitle>Нүүр хуудасны баннер</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-5 gap-3 items-end">
          <div className="grid gap-2">
            <Label htmlFor="bimg">Зураг (файл)</Label>
            <Input
              id="bimg"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <div className="mt-3">
          <Button type="button" onClick={add}>
            <Plus className="h-4 w-4 mr-2" />
            Нэмэх
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((b) => (
            <div key={b.id} className="rounded-md border overflow-hidden">
              <div className="aspect-[16/7] bg-muted overflow-hidden">
                <img
                  src={b.image}
                  alt={b.title || "banner"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => move(b.id, -1)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => move(b.id, 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(b.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Устгах
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Одоогоор баннер байхгүй. Дээрх хэлбэрээр нэмнэ үү.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
