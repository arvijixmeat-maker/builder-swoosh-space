export const PRODUCTS_KEY = "admin_products";
export const CATEGORIES_KEY = "admin_categories";
export const CART_KEY = "cart_items";
export const ORDERS_KEY = "orders";

export type Category = string;

export interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  customer: { name: string; phone: string; address: string };
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
}

export const getCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : [];
  } catch {
    return [];
  }
};

export const setCategories = (cats: Category[]) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  window.dispatchEvent(new Event("categories-updated"));
};

export const getProductsLS = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

export const setProductsLS = <T>(key: string, items: T[]) => {
  localStorage.setItem(key, JSON.stringify(items));
  if (key === PRODUCTS_KEY) {
    window.dispatchEvent(new Event("products-updated"));
  }
};

export const getCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const setCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
};

export const getOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
};

export const setOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("orders-updated"));
};

export const addOrder = (order: Order) => {
  const current = getOrders();
  setOrders([order, ...current]);
};
