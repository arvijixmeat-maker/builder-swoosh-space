import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCart, setCart } from "@/data/store";
import { Link } from "react-router-dom";

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
    return (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-2 py-1 text-[12px] font-semibold">
          {fmt(product.price)}
        </span>
        {hasCompare && (
          <span className="text-[11px] text-muted-foreground line-through">
            {fmt(product.compareAtPrice as number)}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className={`overflow-hidden group h-full flex flex-col`}>
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
          <div className="flex items-center justify-center gap-1 py-2">
            {(product.colors || []).slice(0, 5).map((c, idx) => (
              <span
                key={idx}
                className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                style={{ background: c }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="ml-1 text-[10px] text-muted-foreground">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
      <CardContent
        className={`${compact ? "p-2" : "p-3 md:p-4"} flex flex-col gap-2 flex-1`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product.category && (
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {product.category}
              </div>
            )}
            <div className="text-[11px] text-muted-foreground">{product.id}</div>
            <Link to={`/product/${product.id}`} className="block min-w-0">
              <h3
                className={`${compact ? "text-[12px]" : "text-sm md:text-base"} font-medium leading-snug line-clamp-2`}
              >
                {product.name}
              </h3>
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              {product.colors && product.colors.length > 0 && (
                <span className="rounded bg-muted border px-1.5 py-0.5 text-[10px]">{product.colors.length}컬러</span>
              )}
              {typeof product.compareAtPrice === "number" && product.compareAtPrice! > product.price && (
                <span className="rounded bg-orange-100 text-orange-700 border border-orange-200 px-1.5 py-0.5 text-[10px]">특가</span>
              )}
              {product.badge && (
                <span className="rounded bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 text-[10px]">
                  {product.badge === "шинэ" ? "신상" : product.badge}
                </span>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <span className="rounded bg-muted border px-1.5 py-0.5 text-[10px]">{product.sizes.length}사이즈</span>
              )}
            </div>
          </div>
          {renderPrice()}
        </div>
      </CardContent>
    </Card>
  );
}
