import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCart, setCart } from "@/data/store";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";

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

  const renderPrice = () => {
    const fmt = (n: number) => `${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n)}₩`;
    const hasCompare =
      typeof product.compareAtPrice === "number" &&
      product.compareAtPrice! > product.price;
    return (
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="text-sm md:text-base font-extrabold text-red-600">
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
          className={`block overflow-hidden bg-muted aspect-square`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {(typeof product.compareAtPrice === "number" && (product.compareAtPrice as number) > product.price) || product.badge ? (
          <div className="absolute top-2 left-2">
            <span className="rounded bg-red-600 text-white px-1.5 py-0.5 text-[10px]">
              {typeof product.compareAtPrice === "number" && (product.compareAtPrice as number) > product.price
                ? "특가"
                : product.badge === "шинэ" ? "신상" : product.badge}
            </span>
          </div>
        ) : null}
        {typeof product.compareAtPrice === "number" && product.compareAtPrice! > product.price && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center justify-center rounded-full bg-red-600 text-white h-7 w-12 text-[11px] font-bold">
              -{Math.max(0, Math.round((1 - product.price / (product.compareAtPrice as number)) * 100))}%
            </span>
          </div>
        )}
        <div className="md:hidden px-2 pt-2 flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Wishlist">
            <Heart className="h-4 w-4" />
          </Button>
          <Button onClick={addToCart} className="flex-1 rounded-full bg-black text-white hover:bg-black/90">
            Сагслах
          </Button>
        </div>
      </div>
      <CardContent
        className={`${compact ? "p-2" : "p-3 md:p-4"} flex flex-col gap-2 flex-1`}
      >
        <div className="min-w-0">
          <Link to={`/product/${product.id}`} className="block min-w-0">
            <h3
              className={`${compact ? "text-[12px]" : "text-sm md:text-base"} font-medium leading-snug line-clamp-2`}
            >
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="mt-1 md:hidden flex items-center gap-1 text-muted-foreground text-[12px]">
            <span>0</span>
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          </div>
          <div className="mt-1">
            {renderPrice()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
