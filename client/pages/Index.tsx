import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import ProductCard, { type Product } from "@/components/site/ProductCard";
import { products as seedProducts } from "@/data/products";
import {
  getCategories,
  getProducts,
  getBanners,
  type Banner,
} from "@/data/supabase-store";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Index() {
  const [cats, setCats] = useState<string[]>([]);
  const [prods, setProds] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [categories, products, bannerList] = await Promise.all([
      getCategories(),
      getProducts(),
      getBanners(),
    ]);
    setCats(categories);
    setProds(products);
    setBanners(bannerList);
  };

  useEffect(() => {
    window.addEventListener("banners-updated", loadData as EventListener);
    window.addEventListener("products-updated", loadData as EventListener);
    return () => {
      window.removeEventListener("banners-updated", loadData as EventListener);
      window.removeEventListener("products-updated", loadData as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    setSelectedIndex(emblaApi.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      try {
        emblaApi.off("select", onSelect);
      } catch {}
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !isPlaying) return;
    const id = setInterval(() => {
      try {
        if (emblaApi.canScrollNext()) emblaApi.scrollNext();
        else emblaApi.scrollTo(0);
      } catch {}
    }, 5000);
    return () => clearInterval(id);
  }, [emblaApi, isPlaying]);

  const allProducts = prods.length ? prods : seedProducts;

  const fallback = [
    "Электроник",
    "Гэр а��уй",
    "Гоо с��йхан",
    "Спорт",
    "Хувцас",
    "Хүүхдийн",
  ];
  const categories = cats.length
    ? Array.from(
        new Set([
          ...cats,
          ...(allProducts.map((p) => p.category).filter(Boolean) as string[]),
        ]),
      )
    : Array.from(
        new Set([
          ...fallback,
          ...(allProducts.map((p) => p.category).filter(Boolean) as string[]),
        ]),
      );

  return (
    <div>
      {/* Hero / Banner Slider */}
      {banners.length > 0 ? (
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

          <div
            className="group/embla relative"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex px-2">
                {banners.map((b) => (
                  <div key={b.id} className="min-w-0 flex-[0_0_100%] px-2">
                    <div className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 aspect-[4/3] md:aspect-[16/6] bg-white">
                      <img
                        src={b.image}
                        alt={b.title || "banner"}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <Button
                          size="sm"
                          className="rounded-full bg-black text-white hover:bg-black/90"
                        >
                          Дэлгэрэнгүй
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="pointer-events-none absolute bottom-4 right-4 hidden md:flex items-center gap-2">
              <button
                type="button"
                aria-label="Өмнөх"
                onClick={() => emblaApi?.scrollPrev()}
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow ring-1 ring-black/10 hover:bg-white/90"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Дараах"
                onClick={() => emblaApi?.scrollNext()}
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow ring-1 ring-black/10 hover:bg-white/90"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Dots */}
            {scrollSnaps.length > 1 && (
              <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2">
                {scrollSnaps.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      selectedIndex === i
                        ? "bg-primary"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Монгол хэл
                дээрх онлайн дэлгүүр
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabолд leading-tight tracking-tight">
                Талын Маркет — Монгол хэрэглэгчдэд зориулсан бүх төрлийн
                худалдаа
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
                Албан ёсны брэндүүд, ба��алгаат бараа, хурдан хүргэлт. Та
                хэрэгтэй бүхнээ нэг газраас.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  Одоохон дэлгүүр хэсэх
                </Link>
                <a
                  href="#featured"
                  className="inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium"
                >
                  Онцлох бүтээгдэхүүн
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      <section
        id="featured"
        className="container mx-auto px-4 mt-6 md:mt-10 pb-10 md:pb-14"
      >
        <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              Онцлох бүтээгдэхүүн
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/catalog" className="text-sm text-primary underline underline-offset-4">
              Бүгдийг харах
            </Link>
          </div>
        </div>
        {/* Mobile: 3 columns, 2 rows (show 6), vertical scroll; compact cards */}
        <div className="md:hidden grid grid-cols-3 gap-3">
          {allProducts.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>

        {/* Desktop+ grid */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-6">
          {allProducts.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Categories sections */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-10">
          {categories.map((c) => {
            const list = allProducts.filter((p) => p.category === c);
            if (list.length === 0) return null;
            return (
              <div key={c} className="mb-10 md:mb-14">
                <div className="mb-4 md:mb-6 flex items-end justify-between">
                  <h2 className="text-xl md:text-2xl font-bold">{c}</h2>
                  <Link
                    to="/catalog"
                    className="text-sm text-primary underline underline-offset-4"
                  >
                    Бүгдийг харах
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 md:hidden">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} compact />
                  ))}
                </div>
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* USP */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Хурдан хүргэлт</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Улаанбаатар хотод 24-48 цагийн дотор
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Баталгаат бараа</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Албан ёсны дистрибьютерүүдээс шууд
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Аюулгүй төлбөр</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Олон төрлийн төлбөрийн арга ашиглана
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
