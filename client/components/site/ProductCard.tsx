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
  description?: string; // short description shown in cards
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

  const fmt = (n: number) =>
    `${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n)}₩`;

  const hasCompare =
    typeof product.compareAtPrice === "number" &&
    (product.compareAtPrice as number) > product.price;

  const renderPrice = () => {
    return (
      <div className={`flex ${compact ? "flex-col gap-0" : "items-baseline gap-2"} whitespace-nowrap`}>
        <span className={`${compact ? "text-[11px]" : "text-sm md:text-base"} font-extrabold text-red-600`}>
          {fmt(product.price)}
        </span>
        {hasCompare && (
          <span className={`${compact ? "text-[9px]" : "text-[11px]"} text-muted-foreground line-through`}>
            {fmt(product.compareAtPrice as number)}
          </span>
        )}
      </div>
    );
  };

  const badgeText = product.badge === "шинэ" ? "신상" : product.badge || "";

  return (
    <Card className={`overflow-hidden group h-full flex flex-col ${compact ? "rounded-lg" : ""}`}>
      <div className="relative">
        <Link
          to={`/product/${product.id}`}
          className={`block overflow-hidden bg-muted aspect-square`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Discount pill (left) */}
        {hasCompare && (
          <div className={`absolute ${compact ? "top-1 left-1" : "top-2 left-2"}`}>
            <span className={`inline-flex items-center justify-center rounded-full bg-red-600 text-white font-bold ${compact ? "h-5 px-1.5 text-[9px]" : "h-7 px-2 text-[11px]"}`}>
              -
              {Math.max(
                0,
                Math.round(
                  (1 - product.price / (product.compareAtPrice as number)) *
                    100,
                ),
              )}
              %
            </span>
          </div>
        )}

        {/* Optional badge (right) */}
        {badgeText && (
          <div className={`absolute ${compact ? "top-1 right-1" : "top-2 right-2"}`}>
            <span className={`rounded bg-black/80 text-white ${compact ? "px-1 py-0.5 text-[8px]" : "px-1.5 py-0.5 text-[10px]"}`}>
              {badgeText}
            </span>
          </div>
        )}
      </div>

      <CardContent
        className={`${compact ? "p-2 space-y-1" : "p-3 md:p-4"} flex flex-col gap-2 flex-1`}
      >
        <div className="min-w-0 flex-1">
          <Link to={`/product/${product.id}`} className="block min-w-0">
            <h3
              className={`${compact ? "text-[11px] leading-tight" : "text-sm md:text-base"} font-medium leading-snug line-clamp-2 min-h-[2em]`}
            >
              {product.name}
            </h3>
          </Link>
          {!compact && product.description && (
            <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          <div className={compact ? "mt-0.5" : "mt-1"}>{renderPrice()}</div>
        </div>

        {/* Mobile quick add to cart - Smaller button for compact mode */}
        <div className={`${compact ? "mt-0.5" : "mt-1"} md:hidden`}>
          <Button
            size={compact ? "sm" : "default"}
            className={`w-full ${compact ? "h-7 text-[10px] px-2" : ""}`}
            onClick={addToCart}
          >
            Сагслах
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
