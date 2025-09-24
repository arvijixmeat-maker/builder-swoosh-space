import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import ProductCard, { type Product } from "@/components/site/ProductCard";
import { products as seedProducts } from "@/data/products";
import { getCategories, getProductsLS, PRODUCTS_KEY } from "@/data/store";

export default function Index() {
  const [cats, setCats] = useState<string[]>(getCategories());
  const [prods, setProds] = useState<Product[]>(
    getProductsLS<Product>(PRODUCTS_KEY),
  );

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
    return () => {
      window.removeEventListener("storage", updateProds);
      window.removeEventListener(
        "products-updated",
        updateProds as EventListener,
      );
    };
  }, []);

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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> Монгол хэл
              дээрх онлайн дэлгүүр
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabолд leading-tight tracking-tight">
              Талын Маркет — Монгол хэрэглэгчдэд зориулсан бүх төрлийн худалдаа
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
              Албан ёсны брэндүүд, баталгаат бараа, хурдан хүргэлт. Та хэрэгтэй
              бүхнээ нэг газраас.
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
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section id="featured" className="container mx-auto px-4 pb-10 md:pb-14">
        <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              Онцлох бүтээгдэхүүн
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Шинээр нэмэгдсэн ба хамгийн их зарагддаг бараанууд
            </p>
          </div>
          <Link
            to="/catalog"
            className="text-sm text-primary underline underline-offset-4"
          >
            Бүгдийг харах
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {allProducts.map((p) => (
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
