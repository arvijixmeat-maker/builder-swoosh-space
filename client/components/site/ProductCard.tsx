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
  price: number;
  image: string;
  images?: string[];
  category?: string;
  badge?: string;
  colors?: string[]; // color names or hex
  sizes?: string[];  // size labels like XS,S,M,L,XL
}

export default function ProductCard({ product }: { product: Product }) {
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
      const next = fav ? ids.filter((id) => id !== product.id) : [product.id, ...ids];
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

  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <div className="relative">
        <Link
          to={`/product/${product.id}`}
          className="block aspect-[4/5] md:aspect-square overflow-hidden bg-muted"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          aria-label="Таалагдсан"
          onClick={toggleFav}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur ring-1 ring-white/30"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-current text-primary" : ""}`} />
        </button>
      </div>
      <CardContent className="p-3 md:p-4 flex flex-col gap-2 text-center flex-1">
        <Link to={`/product/${product.id}`} className="min-w-0">
          {product.badge && (
            <span className="inline-block mb-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <h3 className="text-xs md:text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="mt-1 font-semibold text-sm md:text-base">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </p>
        </Link>
        <Button size="sm" className="mt-auto w-full md:w-auto mx-auto h-9" onClick={addToCart}>
          Нэмэх
        </Button>
      </CardContent>
    </Card>
  );
}
