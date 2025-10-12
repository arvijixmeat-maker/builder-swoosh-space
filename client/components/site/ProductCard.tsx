import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCart, setCart } from "@/data/store";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export interface Product {
  id: string;
  name: string;
  price: number; // current sale price
  image: string;
  images?: string[];
  category?: string;
  badge?: string;
  colors?: string[]; // color names or hex
  sizes?: string[]; // size labels like XS,S,M,L,XL
  compareAtPrice?: number; // original price to show strike-through and discount
  couponPrice?: number; // optional extra coupon price line
}

export default function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { toast } = useToast();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favorites_ids");
      const ids: string[] = raw ? JSON.parse(raw) : [];
      setFav(ids.includes(product.id));
    } catch {}
  }, [product.id]);

  const toggleFav = () => {
    try {
      const raw = localStorage.getItem("favorites_ids");
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const next = fav
        ? ids.filter((id) => id !== product.id)
        : [product.id, ...ids];
      localStorage.setItem("favorites_ids", JSON.stringify(next));
      setFav(!fav);
    } catch {}
  };

  const addToCart = () => {
    const cart = getCart();
    const existing = cart.find((i) => i.id === product.id);
    let next;
    if (existing) {
      next = cart.map((i) =>
        i.id === product.id ? { ...i, qty: Math.min(99, i.qty + 1) } : i,
      );
    } else {
      next = [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        },
        ...cart,
      ];
    }
    setCart(next);
    toast({ title: "Сагсанд нэмэгдлээ", description: product.name });
  };

  const renderPrice = () => {
    const fmt = (n: number) =>
      new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(n);
    const hasCompare =
      typeof product.compareAtPrice === "number" &&
      product.compareAtPrice! > product.price;
    const percent = hasCompare
      ? Math.max(
          0,
          Math.round(
            (1 - product.price / (product.compareAtPrice as number)) * 100,
          ),
        )
      : null;
    return (
      <div className={`${compact ? "mt-1 space-y-0.5 text-left" : "mt-1"}`}>
        {hasCompare ? (
          <div className="flex items-baseline gap-1">
            {percent !== null && (
              <span className="text-[11px] font-bold text-red-500">
                {percent}%
              </span>
            )}
            <span
              className={`${compact ? "text-[12px] font-bold" : "text-sm md:text-base font-semibold"}`}
            >
              {fmt(product.price)}
            </span>
            <span className="text-[11px] text-muted-foreground line-through ml-1">
              {fmt(product.compareAtPrice as number)}
            </span>
          </div>
        ) : (
          <p
            className={`${compact ? "text-[12px] font-bold" : "text-sm md:text-base font-semibold"}`}
          >
            {fmt(product.price)}
          </p>
        )}
        {typeof product.couponPrice === "number" &&
          product.couponPrice! < product.price && (
            <div className="text-[11px] text-red-500">
              쿠폰할인가 {fmt(product.couponPrice as number)}
            </div>
          )}
      </div>
    );
  };

  return (
    <Card
      className={`overflow-hidden group h-full flex flex-col ${compact ? "rounded-xl" : ""}`}
    >
      <div className="relative">
        <Link
          to={`/product/${product.id}`}
          className={`block overflow-hidden bg-muted ${compact ? "aspect-square" : "aspect-[4/5] md:aspect-square"}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            {(product.colors || []).slice(0, 5).map((c, idx) => (
              <span
                key={idx}
                className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                style={{ background: c }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="ml-1 text-[10px] text-white/90 bg-black/40 rounded px-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}
        <button
          type="button"
          aria-label="Таалагдсан"
          onClick={toggleFav}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur ring-1 ring-white/30"
        >
          <Heart
            className={`h-4 w-4 ${fav ? "fill-current text-primary" : ""}`}
          />
        </button>
      </div>
      <CardContent
        className={`${compact ? "p-2" : "p-3 md:p-4"} flex flex-col gap-2 ${compact ? "text-left" : "text-center"} flex-1`}
      >
        <Link to={`/product/${product.id}`} className="min-w-0">
          {product.badge && !compact && (
            <span className="inline-block mb-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <h3
            className={`${compact ? "text-[12px] min-h-[2.2rem]" : "text-xs md:text-sm min-h-[2.5rem]"} font-medium leading-snug line-clamp-2`}
          >
            {product.name}
          </h3>
          {renderPrice()}
        </Link>
        {!compact && (
          <Button
            size="sm"
            className={`mt-auto ${compact ? "h-8 text-[11px]" : "h-9"} w-full md:w-auto mx-auto`}
            onClick={addToCart}
          >
            Нэмэх
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
