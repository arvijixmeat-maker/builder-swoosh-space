import { Button } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import {
  getCart,
  setCart,
  getCurrentUser,
  getSettings,
  getProductsLS,
  PRODUCTS_KEY,
} from "@/data/store";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard, { type Product } from "@/components/site/ProductCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState<string | undefined>(() =>
    product?.colors && product.colors.length > 0
      ? product.colors[0]
      : undefined,
  );
  const [size, setSize] = useState<string | undefined>(() =>
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
  );
  const [settings, setSettingsState] = useState(getSettings());
  const allProducts = getProductsLS<Product>(PRODUCTS_KEY);
  const related = product?.category
    ? allProducts.filter(
        (p) => p.category === product.category && p.id !== product.id,
      )
    : [];

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">Бүтээгдэхүүн олдсонгүй.</p>
        <Link
          to="/"
          className="text-primary underline underline-offset-4 mt-2 inline-block"
        >
          Нүүр хуудас руу буцах
        </Link>
      </div>
    );
  }

  const ensureSelections = () => {
    if (product.colors && product.colors.length > 0 && !color) {
      toast({ title: "Өнгөө сонгоно уу" });
      return false;
    }
    if (product.sizes && product.sizes.length > 0 && !size) {
      toast({ title: "Хэмжээгээ сонгоно уу" });
      return false;
    }
    return true;
  };

  const lineId = (pid: string) =>
    `${pid}${color ? `-c:${color}` : ""}${size ? `-s:${size}` : ""}`;

  const addToCart = () => {
    if (!ensureSelections()) return;
    const cart = getCart();
    const idKey = lineId(product.id);
    const existing = cart.find((i) => i.id === idKey);
    let next;
    if (existing) {
      next = cart.map((i) =>
        i.id === idKey ? { ...i, qty: Math.min(99, i.qty + qty) } : i,
      );
    } else {
      next = [
        {
          id: idKey,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty,
          color,
          size,
        },
        ...cart,
      ];
    }
    setCart(next);
    const opt = [
      color ? `өнгө: ${color}` : null,
      size ? `хэмжээ: ${size}` : null,
    ]
      .filter(Boolean)
      .join(", ");
    toast({
      title: "Сагсанд нэмэгдлээ",
      description: `${product.name} × ${qty}${opt ? ` (${opt})` : ""}`,
    });
  };
  const buyNow = () => {
    if (!ensureSelections()) return;
    const user = getCurrentUser();
    if (!user) {
      toast({
        title: "Нэвтрэх шаардлагатай",
        description: "Захиалга хийхийн тулд нэвтэрнэ үү",
      });
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    const cart = getCart();
    const idKey = lineId(product.id);
    const existing = cart.find((i) => i.id === idKey);
    let next;
    if (existing) {
      next = cart.map((i) =>
        i.id === idKey ? { ...i, qty: Math.min(99, i.qty + qty) } : i,
      );
    } else {
      next = [
        {
          id: idKey,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty,
          color,
          size,
        },
        ...cart,
      ];
    }
    setCart(next);
    navigate("/checkout");
  };

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  useEffect(() => {
    const reload = () => setSettingsState(getSettings());
    window.addEventListener("settings-updated", reload as EventListener);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener("settings-updated", reload as EventListener);
      window.removeEventListener("storage", reload);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">
          Нүүр
        </Link>
        <span className="mx-2">/</span>
        <Link to="/catalog" className="hover:text-foreground">
          Ангилал
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="overflow-hidden rounded-lg border bg-muted">
            <img
              src={(product.images && product.images[imgIdx]) || product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
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
                  <img
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    className="h-16 w-full object-cover"
                  />
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
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-extrabold">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </p>
          <p className="mt-4 text-muted-foreground">
            Баталгаат чанар, хурдан хүргэлт. Энэхүү бүтээгдэхүүн нь манай
            борлуулалтын шилдгүүдийн нэг бөгөөд өдөр тутмын хэрэгцээнд төгс
            зохицно.
          </p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-sm font-medium">Өнгө</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    aria-label={`Өнгө ${c}`}
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border ${
                      color === c ? "ring-2 ring-primary" : ""
                    }`}
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-sm font-medium">Хэмжээ</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-8 min-w-8 rounded-md border bg-card px-2 text-xs ${
                      size === s ? "ring-2 ring-primary" : ""
                    }`}
                    aria-pressed={size === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border bg-card">
              <button
                aria-label="Хасах"
                className="px-3 py-2 text-lg"
                onClick={dec}
              >
                −
              </button>
              <span className="min-w-10 text-center">{qty}</span>
              <button
                aria-label="Нэмэх"
                className="px-3 py-2 text-lg"
                onClick={inc}
              >
                +
              </button>
            </div>
            <Button className="px-6" onClick={addToCart}>
              Сагсанд нэмэх
            </Button>
            <Button className="px-6" onClick={buyNow}>
              Одоо худалдаж авах
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Дэлгэрэнгүй тайлбар</AccordionTrigger>
            <AccordionContent>
              {settings.productDetailsText &&
              settings.productDetailsText.trim().length > 0 ? (
                <div className="whitespace-pre-line">
                  {settings.productDetailsText}
                </div>
              ) : (
                <>
                  Энэхүү бүтээгдэхүүн нь өндөр чанарын материалаар хийгдсэн
                  бөгөөд өдөр тутмын хэрэглээнд тохиромжтой. Баталгаат хугацаа,
                  албан ёсны сервисийн дэмжлэгтэй.
                </>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs">
            <AccordionTrigger>Үзүүлэлт</AccordionTrigger>
            <AccordionContent>
              {settings.productSpecsText &&
              settings.productSpecsText.trim().length > 0 ? (
                <div className="whitespace-pre-line">
                  {settings.productSpecsText}
                </div>
              ) : (
                <>
                  - Материал: Пластик/Металл
                  <br />- Баталгаат хугацаа: 12 сар
                  <br />- Хүргэлт: УБ хот дотор 24–48 цаг
                </>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Хүргэлт ба буцаалт</AccordionTrigger>
            <AccordionContent>
              {settings.shippingReturnText &&
              settings.shippingReturnText.trim().length > 0 ? (
                <div className="whitespace-pre-line">
                  {settings.shippingReturnText}
                </div>
              ) : (
                <>
                  Хүргэлтийн нөхцөл, буцаалтын бодлого хэрэглэгчийг хамгаалсан
                  найдвартай журмаар хэрэгжинэ.
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {product.category && (
        <section className="mt-12">
          <div className="mb-4 md:mb-6 flex items-end justify-between">
            <h2 className="text-xl md:text-2xl font-bold">
              {product.category}
            </h2>
            <Link
              to="/catalog"
              className="text-sm text-primary underline underline-offset-4"
            >
              Бүгдийг харах
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
            {related.slice(0, 10).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {related.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground">
                Тохирох бүтээгдэхүүн алга.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
