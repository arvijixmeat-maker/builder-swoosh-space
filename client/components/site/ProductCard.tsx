import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  badge?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();

  const addToCart = () => {
    toast({ title: "Сагсанд нэмэгдлээ", description: product.name });
  };

  return (
    <Card className="overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <CardContent className="p-4 flex items-start justify-between gap-3">
        <Link to={`/product/${product.id}`} className="min-w-0">
          {product.badge && (
            <span className="inline-block mb-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <h3 className="text-sm font-medium leading-tight line-clamp-2">{product.name}</h3>
          <p className="mt-1 font-semibold">{new Intl.NumberFormat("mn-MN", { style: "currency", currency: "MNT", maximumFractionDigits: 0 }).format(product.price)}</p>
        </Link>
        <Button size="sm" onClick={addToCart}>Нэмэх</Button>
      </CardContent>
    </Card>
  );
}
