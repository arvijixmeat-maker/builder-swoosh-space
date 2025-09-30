export const PRODUCTS_KEY = "admin_products";
export const CATEGORIES_KEY = "admin_categories";
export const CART_KEY = "cart_items";
export const ORDERS_KEY = "orders";
export const USERS_KEY = "users";
export const CURRENT_USER_KEY = "current_user_id";
export const SETTINGS_KEY = "shop_settings";

export type Category = string;

export interface CartItem {
  id: string; // line id (can include variant key)
  name: string;
  price: number;
  image: string;
  qty: number;
  productId?: string; // original product id for reference
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  customer: { name: string; phone: string; address: string };
  status: "unpaid" | "paid" | "shipping" | "delivered";
  userId?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  holder: string;
  note?: string;
}
export interface Settings {
  shippingFee: number; // flat fee
  bankAccounts: BankAccount[];
}

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone: string;
  password: string;
  gender?: "male" | "female" | "other";
  birthYear?: number;
  birthMonth?: number; // 1-12
  birthDay?: number; // 1-31
  isAdmin?: boolean;
  createdAt: number;
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
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Support lightweight format [{id, qty}] as a fallback when full objects couldn't be saved
    if (parsed.length > 0 && parsed[0] && typeof parsed[0] === "object") {
      const first = parsed[0] as any;
      if (!("name" in first) && ("id" in first) && ("qty" in first)) {
        // Rehydrate from products list when possible
        const prods = getProductsLS<any>(PRODUCTS_KEY);
        return (parsed as Array<{ id: string; qty: number }>).map((p) => {
          const prod = prods.find((x) => x.id === p.id);
          return {
            id: p.id,
            name: prod?.name || "",
            price: prod?.price || 0,
            image: prod?.image || "",
            qty: p.qty,
          } as CartItem;
        });
      }
    }
    return parsed as CartItem[];
  } catch {
    return [];
  }
};

export const setCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  } catch (e) {
    // Quota exceeded or other storage errors. Try to persist a lightweight version without images/names.
    try {
      const light = items.map((i) => ({ id: i.id, qty: i.qty }));
      localStorage.setItem(CART_KEY, JSON.stringify(light));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      // Final fallback: clear the cart key to avoid persistent quota errors
      try {
        localStorage.removeItem(CART_KEY);
        window.dispatchEvent(new Event("cart-updated"));
      } catch {}
    }
  }
};

export const getSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { shippingFee: 0, bankAccounts: [] };
    const parsed = JSON.parse(raw);
    const fee = typeof parsed.shippingFee === "number" ? parsed.shippingFee : Number(parsed.shippingFee) || 0;
    const accounts = Array.isArray(parsed.bankAccounts) ? parsed.bankAccounts : [];
    return { shippingFee: Math.max(0, fee), bankAccounts: accounts } as Settings;
  } catch {
    return { shippingFee: 0, bankAccounts: [] };
  }
};
export const setSettings = (settings: Settings) => {
  try {
    const payload: Settings = {
      shippingFee: Math.max(0, Number(settings.shippingFee) || 0),
      bankAccounts: (settings.bankAccounts || []).map((a) => ({
        bankName: a.bankName?.trim() || "",
        accountNumber: a.accountNumber?.trim() || "",
        holder: a.holder?.trim() || "",
        note: a.note?.trim() || undefined,
      })),
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
  } finally {
    try { window.dispatchEvent(new Event("settings-updated")); } catch {}
  }
};

export const getBanners = (): Banner[] => {
  try {
    const raw = localStorage.getItem(BANNERS_KEY);
    return raw ? (JSON.parse(raw) as Banner[]) : [];
  } catch {
    return [];
  }
};
export const setBanners = (banners: Banner[]) => {
  localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
  try { window.dispatchEvent(new Event("banners-updated")); } catch {}
};

export const getOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Support lightweight orders format where items are [{id, qty}] to save space
    return (parsed as any[]).map((o) => {
      const toNewStatus = (s: any): Order["status"] => {
        switch (s) {
          case "unpaid":
          case "paid":
          case "shipping":
          case "delivered":
            return s;
          case "new":
            return "unpaid";
          case "processing":
            return "paid";
          case "shipped":
            return "shipping";
          default:
            return "unpaid";
        }
      };
      const base = {
        id: o.id,
        createdAt: o.createdAt,
        total: o.total,
        customer: o.customer,
        status: toNewStatus(o.status),
        userId: o.userId,
      } as Order;
      // if items are simple {id, qty}, rehydrate
      if (Array.isArray(o.items) && o.items.length > 0) {
        const first = o.items[0];
        if (first && typeof first === "object" && !("name" in first) && ("id" in first) && ("qty" in first)) {
          const prods = getProductsLS<any>(PRODUCTS_KEY);
          base.items = o.items.map((it: { id: string; qty: number }) => {
            const prod = prods.find((p) => p.id === it.id);
            return {
              id: it.id,
              name: prod?.name || "",
              price: prod?.price || 0,
              image: prod?.image || "",
              qty: it.qty,
            } as CartItem;
          });
        } else {
          base.items = o.items as CartItem[];
        }
      } else {
        base.items = [];
      }
      return base;
    });
  } catch {
    return [];
  }
};

export const setOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("orders-updated"));
  } catch (e) {
    try {
      // save lightweight orders: keep order metadata and item ids+qty only
      const light = orders.map((o) => ({
        id: o.id,
        createdAt: o.createdAt,
        total: o.total,
        customer: o.customer,
        status: o.status,
        userId: o.userId,
        items: o.items.map((it) => ({ id: it.id, qty: it.qty })),
      }));
      localStorage.setItem(ORDERS_KEY, JSON.stringify(light));
      window.dispatchEvent(new Event("orders-updated"));
    } catch (err) {
      try {
        localStorage.removeItem(ORDERS_KEY);
        window.dispatchEvent(new Event("orders-updated"));
      } catch {}
    }
  }
};

export const addOrder = (order: Order) => {
  const current = getOrders();
  setOrders([order, ...current]);
};

export const getUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
};

export const setUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event("users-updated"));
};

export const addUser = (
  u: Omit<User, "id" | "createdAt"> & Partial<Pick<User, "id" | "createdAt">>,
) => {
  const users = getUsers();
  if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
    throw new Error("EMAIL_TAKEN");
  }
  const user: User = {
    id: u.id || crypto.randomUUID(),
    createdAt: u.createdAt || Date.now(),
    name: u.name,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    password: u.password,
    gender: u.gender,
    birthYear: u.birthYear,
    birthMonth: u.birthMonth,
    birthDay: u.birthDay,
    isAdmin: (u as any).isAdmin || false,
  };
  setUsers([user, ...users]);
  setCurrentUserId(user.id);
  return user;
};

export const getCurrentUserId = (): string | null =>
  localStorage.getItem(CURRENT_USER_KEY);
export const setCurrentUserId = (id: string | null) => {
  if (id) localStorage.setItem(CURRENT_USER_KEY, id);
  else localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event("user-updated"));
};
export const getCurrentUser = (): User | null => {
  const id = getCurrentUserId();
  if (!id) return null;
  return getUsers().find((u) => u.id === id) || null;
};
export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const u = users.find(
    (x) =>
      x.email.toLowerCase() === email.toLowerCase() && x.password === password,
  );
  if (u) {
    // auto-upgrade legacy admin user
    if (!u.isAdmin && u.email.toLowerCase() === "admin@local") {
      const next = users.map((x) =>
        x.id === u.id ? { ...x, isAdmin: true } : x,
      );
      setUsers(next);
      u.isAdmin = true;
    }
    setCurrentUserId(u.id);
  }
  return u || null;
};
export const logoutUser = () => setCurrentUserId(null);

export const updateCurrentUser = (patch: Partial<User>) => {
  const id = getCurrentUserId();
  if (!id) return;
  const users = getUsers();
  const next = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
  setUsers(next);
};

export const deleteCurrentUser = () => {
  const id = getCurrentUserId();
  if (!id) return;
  const users = getUsers();
  const next = users.filter((u) => u.id !== id);
  setUsers(next);
  setCurrentUserId(null);
};

export const updateOrderStatus = (id: string, status: Order["status"]) => {
  const orders = getOrders();
  const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
  setOrders(next);
};

export const seedDefaultAdmin = () => {
  try {
    const existing = getUsers();
    const idx = existing.findIndex(
      (u) => u.email?.toLowerCase?.() === "admin@local",
    );
    if (idx >= 0) {
      if (!existing[idx].isAdmin) {
        const next = existing.map((u, i) => (i === idx ? { ...u, isAdmin: true } : u));
        setUsers(next);
      }
      return;
    }
    if (existing.length > 0) return;
    const admin: User = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      name: "Admin",
      email: "admin@local",
      phone: "0000000000",
      password: "admin1234",
      isAdmin: true,
    };
    setUsers([admin, ...existing]);
  } catch {}
};
