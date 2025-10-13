import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import ProductCard, { type Product } from "@/components/site/ProductCard";
import { products as seedProducts } from "@/data/products";
import {
  getCategories,
  getProductsLS,
  PRODUCTS_KEY,
  getBanners,
  type Banner,
} from "@/data/store";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Index() {
  const [cats, setCats] = useState<string[]>(getCategories());
  const [prods, setProds] = useState<Product[]>(
    getProductsLS<Product>(PRODUCTS_KEY),
  );
  const [banners, setBanners] = useState<Banner[]>(getBanners());
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const updateCats = () => setCats(getCategories());
    window.addEventListener("storage", updateCats);
    window.addEventListener("categories-updated", updateCats as EventListener);
    return () => {
      window.removeEventListener("storage", updateCats);
      window.removeEventListener(
        "categories-updated",
        updateCats as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    const updateProds = () => setProds(getProductsLS<Product>(PRODUCTS_KEY));
    window.addEventListener("storage", updateProds);
    window.addEventListener("products-updated", updateProds as EventListener);
    const updateBanners = () => setBanners(getBanners());
    window.addEventListener("banners-updated", updateBanners as EventListener);
    return () => {
      window.removeEventListener("storage", updateProds);
      window.removeEventListener(
        "products-updated",
        updateProds as EventListener,
      );
      window.removeEventListener(
        "banners-updated",
        updateBanners as EventListener,
      );
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
    "Гэр ахуй",
    "Гоо сайхан",
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
              <div className="flex">
                {banners.map((b) => (
                  <div key={b.id} className="min-w-0 flex-[0_0_100%] relative">
                    <div className="relative mx-4 my-4 overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
                      <div className="relative aspect-[16/6] sm:aspect-[16/6] md:aspect-[16/5] bg-muted">
                        <img
                          src={b.image}
                          alt={b.title || "banner"}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] group-hover/embla:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/0" />
                        {(b.title || b.subtitle || b.link) && (
                          <div className="absolute inset-0 flex items-center">
                            <div className="container mx-auto px-6">
                              <div className="max-w-xl md:max-w-2xl text-white">
                                {b.title && (
                                  <h2 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
                                    {b.title}
                                  </h2>
                                )}
                                {b.subtitle && (
                                  <p className="mt-3 md:mt-4 text-sm md:text-lg text-white/85">
                                    {b.subtitle}
                                  </p>
                                )}
                                {b.link && (
                                  <div className="mt-6">
                                    <Button
                                      asChild
                                      size="lg"
                                      className="shadow"
                                    >
                                      <Link to={b.link}>Дэлгэрэнгүй харах</Link>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
              <button
                type="button"
                aria-label="Өмнөх"
                onClick={() => emblaApi?.scrollPrev()}
                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Дараах"
                onClick={() => emblaApi?.scrollNext()}
                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
              >
                <ChevronRight className="h-5 w-5" />
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
                Албан ёсны брэндүүд, баталгаат бараа, хурдан хүргэлт. Та
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
      <section id="featured" className="container mx-auto px-4 pb-10 md:pb-14">
        <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              Онцлох бүтээгдэхүүн
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Хамгийн их борлуулттай бүтээгдэхүүн
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/catalog"
              className="hidden"
            >
              Дэлгэрэнгүй харах
            </Link>
            <Link
              to="/catalog"
              className="hidden md:inline text-sm text-primary underline underline-offset-4"
            >
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
        <div className="md:hidden mt-4 flex justify-center">
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm"
          >
            Дэлгэрэнгүй харах
          </Link>
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
