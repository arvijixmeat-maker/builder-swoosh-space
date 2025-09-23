import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">Бүтээгдэхүүн олдсонгүй.</p>
        <Link to="/" className="text-primary underline underline-offset-4 mt-2 inline-block">Нүүр хуудас руу буцах</Link>
      </div>
    );
  }

  const addToCart = () => toast({ title: "Сагсанд нэмэгдлээ", description: product.name });

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Нүүр</Link>
        <span className="mx-2">/</span>
        <Link to="/catalog" className="hover:text-foreground">Каталог</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="overflow-hidden rounded-lg border bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
          </div>
        </div>
        <div>
          {product.badge && (
            <span className="inline-block mb-3 rounded-full bg-accent/20 text-accent-foreground border border-accent/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
          <p className="mt-3 text-2xl font-extrabold">
            {new Intl.NumberFormat("mn-MN", { style: "currency", currency: "MNT", maximumFractionDigits: 0 }).format(product.price)}
          </p>
          <p className="mt-4 text-muted-foreground">
            Баталгаат чанар, хурдан хүргэлт. Энэхүү бүтээгдэхүүн нь манай борлуулалтын шилдгүүдийн нэг бөгөөд өдөр тутмын хэрэгцээнд төгс зохицоно.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button className="px-8" onClick={addToCart}>Сагсанд нэмэх</Button>
            <Link to="/catalog" className="text-sm underline underline-offset-4">Илүү ихийг харах</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
