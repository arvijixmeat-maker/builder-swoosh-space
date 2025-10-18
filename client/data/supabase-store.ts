import { supabase } from "@/lib/supabase";
import type { Product } from "@/components/site/ProductCard";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  productId?: string;
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
  shippingFee: number;
  bankAccounts: BankAccount[];
  productDetailsText?: string;
  productSpecsText?: string;
  shippingReturnText?: string;
}

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone: string;
  avatar?: string;
  password: string;
  gender?: "male" | "female" | "other";
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  isAdmin?: boolean;
  createdAt: number;
}

let currentUserId: string | null = localStorage.getItem("current_user_id");

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (
    data?.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      compareAtPrice: p.compare_at_price
        ? Number(p.compare_at_price)
        : undefined,
      couponPrice: p.coupon_price ? Number(p.coupon_price) : undefined,
      image: p.image,
      images: p.images || [],
      category: p.category || "",
      description: p.description || "",
      badge: p.badge || "",
      colors: p.colors || [],
      sizes: p.sizes || [],
    })) || []
  );
}

export async function addProduct(product: Omit<Product, "id">): Promise<void> {
  const { error } = await supabase.from("products").insert({
    name: product.name,
    price: product.price,
    compare_at_price: product.compareAtPrice,
    coupon_price: product.couponPrice,
    image: product.image,
    images: product.images,
    category: product.category,
    description: product.description,
    badge: product.badge,
    colors: product.colors,
    sizes: product.sizes,
  });

  if (error) throw error;
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<void> {
  const updateData: any = {};
  if (product.name !== undefined) updateData.name = product.name;
  if (product.price !== undefined) updateData.price = product.price;
  if (product.compareAtPrice !== undefined)
    updateData.compare_at_price = product.compareAtPrice;
  if (product.couponPrice !== undefined)
    updateData.coupon_price = product.couponPrice;
  if (product.image !== undefined) updateData.image = product.image;
  if (product.images !== undefined) updateData.images = product.images;
  if (product.category !== undefined) updateData.category = product.category;
  if (product.description !== undefined)
    updateData.description = product.description;
  if (product.badge !== undefined) updateData.badge = product.badge;
  if (product.colors !== undefined) updateData.colors = product.colors;
  if (product.sizes !== undefined) updateData.sizes = product.sizes;

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data?.map((c) => c.name) || [];
}

export async function addCategory(name: string): Promise<void> {
  const { error } = await supabase.from("categories").insert({ name });
  if (error) throw error;
}

export async function updateCategory(
  oldName: string,
  newName: string
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .update({ name: newName })
    .eq("name", oldName);

  if (error) throw error;

  await supabase
    .from("products")
    .update({ category: newName })
    .eq("category", oldName);
}

export async function deleteCategory(name: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("name", name);

  if (error) throw error;

  await supabase.from("products").update({ category: "" }).eq("category", name);
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return (
    data?.map((u) => ({
      id: u.id,
      name: u.name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      password: u.password,
      gender: u.gender as "male" | "female" | "other" | undefined,
      birthYear: u.birth_year,
      birthMonth: u.birth_month,
      birthDay: u.birth_day,
      isAdmin: u.is_admin,
      createdAt: new Date(u.created_at).getTime(),
    })) || []
  );
}

export async function addUser(
  user: Omit<User, "id" | "createdAt">
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: user.name,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      password: user.password,
      gender: user.gender,
      birth_year: user.birthYear,
      birth_month: user.birthMonth,
      birth_day: user.birthDay,
      is_admin: user.isAdmin || false,
    })
    .select()
    .single();

  if (error) throw error;

  const newUser: User = {
    id: data.id,
    name: data.name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    password: data.password,
    gender: data.gender,
    birthYear: data.birth_year,
    birthMonth: data.birth_month,
    birthDay: data.birth_day,
    isAdmin: data.is_admin,
    createdAt: new Date(data.created_at).getTime(),
  };

  setCurrentUserId(newUser.id);
  return newUser;
}

export function getCurrentUserId(): string | null {
  return currentUserId;
}

export function setCurrentUserId(id: string | null) {
  currentUserId = id;
  if (id) localStorage.setItem("current_user_id", id);
  else localStorage.removeItem("current_user_id");
  window.dispatchEvent(new Event("user-updated"));
}

export async function getCurrentUser(): Promise<User | null> {
  if (!currentUserId) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", currentUserId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    password: data.password,
    gender: data.gender,
    birthYear: data.birth_year,
    birthMonth: data.birth_month,
    birthDay: data.birth_day,
    isAdmin: data.is_admin,
    createdAt: new Date(data.created_at).getTime(),
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .maybeSingle();

  if (error || !data) return null;

  const user: User = {
    id: data.id,
    name: data.name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    password: data.password,
    gender: data.gender,
    birthYear: data.birth_year,
    birthMonth: data.birth_month,
    birthDay: data.birth_day,
    isAdmin: data.is_admin,
    createdAt: new Date(data.created_at).getTime(),
  };

  setCurrentUserId(user.id);
  return user;
}

export function logoutUser() {
  setCurrentUserId(null);
}

export async function updateCurrentUser(patch: Partial<User>): Promise<void> {
  if (!currentUserId) return;

  const updateData: any = {};
  if (patch.name !== undefined) updateData.name = patch.name;
  if (patch.lastName !== undefined) updateData.last_name = patch.lastName;
  if (patch.phone !== undefined) updateData.phone = patch.phone;
  if (patch.avatar !== undefined) updateData.avatar = patch.avatar;
  if (patch.gender !== undefined) updateData.gender = patch.gender;
  if (patch.birthYear !== undefined) updateData.birth_year = patch.birthYear;
  if (patch.birthMonth !== undefined) updateData.birth_month = patch.birthMonth;
  if (patch.birthDay !== undefined) updateData.birth_day = patch.birthDay;

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", currentUserId);

  if (error) throw error;
}

export async function deleteCurrentUser(): Promise<void> {
  if (!currentUserId) return;

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", currentUserId);

  if (error) throw error;
  setCurrentUserId(null);
}

export async function getCart(): Promise<CartItem[]> {
  if (!currentUserId) {
    const stored = localStorage.getItem("cart_items");
    return stored ? JSON.parse(stored) : [];
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", currentUserId);

  if (error) {
    console.error("Error fetching cart:", error);
    return [];
  }

  return (
    data?.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
      qty: item.qty,
      productId: item.product_id,
      color: item.color,
      size: item.size,
    })) || []
  );
}

export async function setCart(items: CartItem[]): Promise<void> {
  if (!currentUserId) {
    localStorage.setItem("cart_items", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
    return;
  }

  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", currentUserId);

  if (deleteError) throw deleteError;

  if (items.length > 0) {
    const { error: insertError } = await supabase.from("cart_items").insert(
      items.map((item) => ({
        user_id: currentUserId,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.qty,
        color: item.color,
        size: item.size,
      }))
    );

    if (insertError) throw insertError;
  }

  window.dispatchEvent(new Event("cart-updated"));
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return (
    data?.map((o) => ({
      id: o.id,
      createdAt: new Date(o.created_at).getTime(),
      items: o.items || [],
      total: Number(o.total),
      customer: {
        name: o.customer_name,
        phone: o.customer_phone,
        address: o.customer_address,
      },
      status: o.status as "unpaid" | "paid" | "shipping" | "delivered",
      userId: o.user_id,
    })) || []
  );
}

export async function addOrder(order: Omit<Order, "id">): Promise<void> {
  const { data: seqData } = await supabase
    .from("order_sequence")
    .select("current_value")
    .limit(1)
    .maybeSingle();

  const nextValue = (seqData?.current_value || 0) + 1;

  await supabase
    .from("order_sequence")
    .update({ current_value: nextValue })
    .eq("id", seqData?.id || "");

  const orderId = String(nextValue).padStart(6, "0");

  const { error } = await supabase.from("orders").insert({
    id: orderId,
    user_id: order.userId,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_address: order.customer.address,
    total: order.total,
    status: order.status,
    items: order.items,
  });

  if (error) throw error;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  window.dispatchEvent(new Event("orders-updated"));
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return {
      shippingFee: 0,
      bankAccounts: [],
      productDetailsText: "",
      productSpecsText: "",
      shippingReturnText: "",
    };
  }

  return {
    shippingFee: Number(data.shipping_fee),
    bankAccounts: data.bank_accounts || [],
    productDetailsText: data.product_details_text || "",
    productSpecsText: data.product_specs_text || "",
    shippingReturnText: data.shipping_return_text || "",
  };
}

export async function setSettings(settings: Settings): Promise<void> {
  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update({
        shipping_fee: settings.shippingFee,
        bank_accounts: settings.bankAccounts,
        product_details_text: settings.productDetailsText,
        product_specs_text: settings.productSpecsText,
        shipping_return_text: settings.shippingReturnText,
      })
      .eq("id", existing.id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("settings").insert({
      shipping_fee: settings.shippingFee,
      bank_accounts: settings.bankAccounts,
      product_details_text: settings.productDetailsText,
      product_specs_text: settings.productSpecsText,
      shipping_return_text: settings.shippingReturnText,
    });

    if (error) throw error;
  }

  window.dispatchEvent(new Event("settings-updated"));
}

export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }

  return (
    data?.map((b) => ({
      id: b.id,
      image: b.image,
      title: b.title,
      subtitle: b.subtitle,
      link: b.link,
    })) || []
  );
}

export async function setBanners(banners: Banner[]): Promise<void> {
  const { error: deleteError } = await supabase.from("banners").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) throw deleteError;

  if (banners.length > 0) {
    const { error: insertError } = await supabase.from("banners").insert(
      banners.map((b, index) => ({
        id: b.id,
        image: b.image,
        title: b.title,
        subtitle: b.subtitle,
        link: b.link,
        order: index,
      }))
    );

    if (insertError) throw insertError;
  }

  window.dispatchEvent(new Event("banners-updated"));
}

export async function seedDefaultAdmin(): Promise<void> {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", "admin")
    .maybeSingle();

  if (existing) return;

  await supabase.from("users").insert({
    name: "Admin",
    email: "admin",
    phone: "0000000000",
    password: "admin123",
    is_admin: true,
  });
}
