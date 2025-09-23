import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import ProductCard, { type Product } from "@/components/site/ProductCard";

export default function Index() {
  const featured: Product[] = [
    {
      id: "1",
      name: "Ухаалаг утас Galaxy A55 5G 128GB",
      price: 1299000,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
      badge: "шинэ",
    },
    {
      id: "2",
      name: "Bluetooth чихэвч Noise Cancelling",
      price: 399000,
      image:
        "https://images.unsplash.com/photo-1518443819140-44d49d1f3b77?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Кофе будагч автомат машин",
      price: 899000,
      image:
        "https://images.unsplash.com/photo-1485808191679-5f86510681a3?q=80&w=1200&auto=format&fit=crop",
      badge: "хямдрал",
    },
    {
      id: "4",
      name: "Спорт гутал өдөр тутмын өмсгөл",
      price: 259000,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "5",
      name: "Хоолны процессор 800W",
      price: 329000,
      image:
        "https://images.unsplash.com/photo-1586201375754-1421e0aa2fda?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "6",
      name: "Арьс арчилгааны иж бүрдэл",
      price: 189000,
      image:
        "https://images.unsplash.com/photo-1512203492609-8f6f2a1e0b1c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "7",
      name: "Хүүхдийн барилгын тоглоом 500 ширхэг",
      price: 149000,
      image:
        "https://images.unsplash.com/photo-1591025207163-8b0b9cdbd47f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "8",
      name: "Ноолууран цамц эрэгтэй",
      price: 219000,
      image:
        "https://images.unsplash.com/photo-1610030469983-a9c5f8f0f84d?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const categories = [
    "Электроник",
    "Гэр ахуй",
    "Гоо сайхан",
    "Спорт",
    "Хувцас",
    "Хүүхдийн",
  ];

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
