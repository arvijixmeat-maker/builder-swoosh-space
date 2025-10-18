import { useEffect, useMemo, useState } from "react";
import ProductCard, { type Product } from "@/components/site/ProductCard";
import { products as seed } from "@/data/products";
import { getCategories, getProductsLS, PRODUCTS_KEY } from "@/data/store";
import { useLocation } from "react-router-dom";

export default function Catalog() {
  const [cats, setCats] = useState<string[]>(getCategories());
  const [prods, setProds] = useState<Product[]>(
    getProductsLS<Product>(PRODUCTS_KEY),
  );
  const location = useLocation();
  const [selected, setSelected] = useState<string | null>(null);

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

  useEffect(() => {
    const h = location.hash || "";
    if (h.startsWith("#cat-")) {
      try {
        setSelected(decodeURIComponent(h.slice(5)) || null);
      } catch {
        setSelected(h.slice(5));
      }
    } else {
      setSelected(null);
    }
  }, [location.hash]);

  const allProducts = prods.length ? prods : seed;

  const categories = useMemo(() => {
    const explicit = cats.filter(Boolean);
    const fromProducts = Array.from(
      new Set(allProducts.map((p) => p.category).filter(Boolean)),
    ) as string[];
    const merged = Array.from(
      new Set([...(explicit as string[]), ...fromProducts]),
    );
    return merged;
  }, [cats, allProducts]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">А</h1>
        <p className="text-muted-foreground mt-1">
          Ангиллаар шүүлт хийж барааг үзнэ үү.
        </p>
        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c}
                href={`#cat-${encodeURIComponent(c)}`}
                className="rounded-full border bg-card px-3 py-1 text-xs hover:bg-accent"
              >
                {c}
              </a>
            ))}
          </div>
        )}
      </div>

      {selected ? (
        (() => {
          const list = allProducts.filter((p) => p.category === selected);
          return (
            <section id={`cat-${encodeURIComponent(selected)}`} className="mb-10 md:mb-14">
              <div className="mb-4 md:mb-6 flex items-end justify-between">
                <h2 className="text-xl md:text-2xl font-bold">{selected}</h2>
                <a href="#top" className="text-sm text-primary underline underline-offset-4">Дээш очих</a>
              </div>
              {list.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} compact={true} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">Энэ ангилалд бараа алга.</div>
              )}
            </section>
          );
        })()
      ) : (
        <>
          {categories.map((c) => {
            const list = allProducts.filter((p) => p.category === c);
            if (list.length === 0) return null;
            return (
              <section key={c} id={`cat-${encodeURIComponent(c)}`} className="mb-10 md:mb-14">
                <div className="mb-4 md:mb-6 flex items-end justify-between">
                  <h2 className="text-xl md:text-2xl font-bold">{c}</h2>
                  <a href="#top" className="text-sm text-primary underline underline-offset-4">Дээш очих</a>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} compact={true} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}

      {categories.length === 0 && (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Одоогоор ангилал алга. Админаас шинээр үүсгээд дахин оролдоно уу.
        </div>
      )}
    </div>
  );
}
