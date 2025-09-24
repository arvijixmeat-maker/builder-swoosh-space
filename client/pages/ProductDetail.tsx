import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">Бүтээгдэхүүн олдсонгүй.</p>
        <Link to="/" className="text-primary underline underline-offset-4 mt-2 inline-block">Нүүр хуудас руу буцах</Link>
      </div>
    );
  }

  const addToCart = () => toast({ title: "Сагсанд нэмэгдлээ", description: `${product.name} × ${qty}` });
  const buyNow = () => toast({ title: "Худалдан авах", description: `${product.name} × ${qty}` });

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

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
            <img src={(product.images && product.images[imgIdx]) || product.image} alt={product.name} className="w-full h-auto object-cover" />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  className={`overflow-hidden rounded-md border ${i === imgIdx ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setImgIdx(i)}
                  aria-label={`Зураг ${i + 1}`}
                >
                  <img src={src} alt={`${product.name} ${i + 1}`} className="h-16 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
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
            Баталгаат чанар, хурдан хүргэлт. Энэхүү бүтээгдэхүүн нь манай борлуулалтын шилдгүүдийн нэг бөгөөд өдөр тутмын хэрэгцээнд төгс зохицно.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border bg-card">
              <button aria-label="Хасах" className="px-3 py-2 text-lg" onClick={dec}>−</button>
              <span className="min-w-10 text-center">{qty}</span>
              <button aria-label="Нэмэх" className="px-3 py-2 text-lg" onClick={inc}>+</button>
            </div>
            <Button className="px-6" onClick={addToCart}>Сагсанд нэмэх</Button>
            <Button variant="secondary" className="px-6" onClick={buyNow}>Одоо худалдаж авах</Button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Дэлгэрэнгүй тайлбар</AccordionTrigger>
            <AccordionContent>
              Энэхүү бүтээгдэхүүн ��ь өндөр чанарын материалаар хийгдсэн бөгөөд өдөр тутмын хэрэглээнд тохиромжтой. Баталгаат хугацаа, албан ёсны сервисийн дэмжлэгтэй.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs">
            <AccordionTrigger>Үзүүлэлт</AccordionTrigger>
            <AccordionContent>
              - М��териал: Пластик/Мета��л
              <br />- Баталгаат хугацаа: 12 сар
              <br />- Хүргэлт: УБ хот дотор 24–48 цаг
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Хүргэлт ба буцаалт</AccordionTrigger>
            <AccordionContent>
              Хүргэлтийн нөхцөл, буцаалтын бодлого хэрэглэгчийг хамгаалсан найдвартай журмаар хэрэгжинэ.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
