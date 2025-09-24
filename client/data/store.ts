export const PRODUCTS_KEY = "admin_products";
export const CATEGORIES_KEY = "admin_categories";
export const CART_KEY = "cart_items";
export const ORDERS_KEY = "orders";
export const USERS_KEY = "users";
export const CURRENT_USER_KEY = "current_user_id";

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
  userId?: string;
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
  if (u) setCurrentUserId(u.id);
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
    if (existing.length > 0) return;
    const admin: User = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      name: "Admin",
      email: "admin@local",
      phone: "0000000000",
      password: "admin1234",
    };
    setUsers([admin, ...existing]);
  } catch {}
};
