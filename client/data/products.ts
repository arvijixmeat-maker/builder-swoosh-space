import type { Product } from "@/components/site/ProductCard";
import { getProductsLS, PRODUCTS_KEY } from "@/data/store";

export const products: Product[] = [
  {
    id: "1",
    name: "Ухаалаг утас Galaxy A55 5G 128GB",
    price: 1299000,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    badge: "шинэ",
  },
  {
    id: "2",
    name: "Bluetooth чихэвч Noise Cancelling",
    price: 399000,
    image:
      "https://images.unsplash.com/photo-1518443819140-44d49d1f3b77?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Кофе будагч автомат машин",
    price: 899000,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a3?q=80&w=1200&auto=format&fit=crop",
    badge: "хямдрал",
  },
  {
    id: "4",
    name: "Спорт гутал өдөр тутмын өмсгөл",
    price: 259000,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Хоолны процессор 800W",
    price: 329000,
    image:
      "https://images.unsplash.com/photo-1586201375754-1421e0aa2fda?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Арьс арчилгааны иж бүрдэл",
    price: 189000,
    image:
      "https://images.unsplash.com/photo-1512203492609-8f6f2a1e0b1c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "7",
    name: "Хүүхдийн барилгын тоглоом 500 ширхэг",
    price: 149000,
    image:
      "https://images.unsplash.com/photo-1591025207163-8b0b9cdbd47f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "8",
    name: "Ноолууран цамц эр��гтэй",
    price: 219000,
    image:
      "https://images.unsplash.com/photo-1610030469983-a9c5f8f0f84d?q=80&w=1200&auto=format&fit=crop",
  },
];

export const getProduct = (id: string) => {
  const local = getProductsLS<Product>(PRODUCTS_KEY);
  return local.find((p) => p.id === id) || products.find((p) => p.id === id);
};
