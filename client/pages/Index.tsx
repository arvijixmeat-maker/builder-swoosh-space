import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import ProductCard, { type Product } from "@/components/site/ProductCard";
import { products as featured } from "@/data/products";
import { getCategories } from "@/data/store";

export default function Index() {
  const [cats, setCats] = useState<string[]>(getCategories());

  useEffect(() => {
    const update = () => setCats(getCategories());
    window.addEventListener("storage", update);
    window.addEventListener("categories-updated", update as EventListener);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("categories-updated", update as EventListener);
    };
  }, []);

  const fallback = ["Электроник", "Гэр ахуй", "Гоо сайхан", "Спорт", "Хувцас", "Хүүхдийн"];
  const categories = cats.length ? cats : fallback;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> Монгол хэл дээрх онлайн дэлгүүр
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Талын Маркет — Монгол хэрэглэгчдэд зориулсан бүх төрлийн худалдаа
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
              Албан ёсны брэндүүд, баталгаат бараа, хурдан хүргэлт. Та хэрэгтэй бүхнээ нэг газраас.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link to="/catalog" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Одоохон дэлгүүр хэсэх
              </Link>
              <a href="#featured" className="inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium">Онцлох бүтээгдэхүүн</a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {categories.map((c) => (
                <span key={c} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section id="featured" className="container mx-auto px-4 pb-14 md:pb-20">
        <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Онцлох бүтээгдэхүүн</h2>
            <p className="text-muted-foreground text-sm md:text-base">Шинээр нэмэгдсэн ба хамгийн их зарагддаг бараанууд</p>
          </div>
          <Link to="/catalog" className="text-sm text-primary underline underline-offset-4">Бүгдийг харах</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* USP */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Хурдан хүргэлт</h3>
            <p className="text-sm text-muted-foreground mt-1">Улаанбаатар хотод 24-48 цагийн дотор</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Баталгаат бараа</h3>
            <p className="text-sm text-muted-foreground mt-1">Албан ёсны дистрибьютерүүдээс шууд</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Аюулгүй төлбөр</h3>
            <p className="text-sm text-muted-foreground mt-1">Олон төрлийн төлбөрийн арга ашиглана</p>
          </div>
        </div>
      </section>
    </div>
  );
}
