import { supabase } from '@/lib/supabase';

export const PRODUCTS_KEY = 'admin_products';

export type Category = string;

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
  status: 'unpaid' | 'paid' | 'shipping' | 'delivered';
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
  gender?: 'male' | 'female' | 'other';
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  isAdmin?: boolean;
  createdAt: number;
}

const CART_KEY = 'cart_items';
const CURRENT_USER_KEY = 'current_user_id';

let categoriesCache: Category[] | null = null;
let productCache: any[] | null = null;
let settingsCache: Settings | null = null;
let bannersCache: Banner[] | null = null;

export const getCategories = (): Category[] => {
  if (categoriesCache) return categoriesCache;

  supabase
    .from('categories')
    .select('name')
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      categoriesCache = data?.map(c => c.name) || [];
    });

  return categoriesCache || [];
};

export const setCategories = (cats: Category[]) => {
  supabase
    .from('categories')
    .select('name')
    .then(async ({ data: existing }) => {
      const existingNames = new Set(existing?.map(c => c.name) || []);
      const toAdd = cats.filter(c => !existingNames.has(c));
      const toRemove = Array.from(existingNames).filter(c => !cats.includes(c));

      if (toAdd.length > 0) {
        await supabase.from('categories').insert(toAdd.map(name => ({ name })));
      }

      if (toRemove.length > 0) {
        await supabase.from('categories').delete().in('name', toRemove);
      }

      categoriesCache = cats;
      window.dispatchEvent(new Event('categories-updated'));
    });
};

export const getProductsLS = <T>(key: string): T[] => {
  if (productCache) return productCache as T[];

  supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      productCache = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
        couponPrice: p.coupon_price ? Number(p.coupon_price) : undefined,
        image: p.image,
        images: p.images || [],
        category: p.category || '',
        description: p.description || '',
        badge: p.badge || '',
        colors: p.colors || [],
        sizes: p.sizes || [],
      }));
    });

  return productCache as T[] || [];
};

export const setProductsLS = <T extends { id?: string }>(key: string, items: T[]) => {
  productCache = items as any[];

  Promise.all(
    items.map(async item => {
      if (!item.id) return;

      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('id', item.id)
        .maybeSingle();

      const payload: any = {
        name: (item as any).name,
        price: Number((item as any).price),
        compare_at_price: (item as any).compareAtPrice || null,
        coupon_price: (item as any).couponPrice || null,
        image: (item as any).image,
        images: (item as any).images || null,
        category: (item as any).category || null,
        description: (item as any).description || null,
        badge: (item as any).badge || null,
        colors: (item as any).colors || null,
        sizes: (item as any).sizes || null,
      };

      if (existing) {
        await supabase.from('products').update(payload).eq('id', item.id);
      } else {
        await supabase.from('products').insert({ ...payload, id: item.id });
      }
    })
  ).then(() => {
    window.dispatchEvent(new Event('products-updated'));
  });
};

export const getCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  } catch (e) {
    console.error('Error setting cart:', e);
  }
};

export const getSettings = (): Settings => {
  if (settingsCache) return settingsCache;

  const defaultSettings: Settings = {
    shippingFee: 0,
    bankAccounts: [],
    productDetailsText: '',
    productSpecsText: '',
    shippingReturnText: '',
  };

  supabase
    .from('settings')
    .select('*')
    .maybeSingle()
    .then(({ data }) => {
      if (data) {
        settingsCache = {
          shippingFee: Number(data.shipping_fee) || 0,
          bankAccounts: Array.isArray(data.bank_accounts) ? data.bank_accounts : [],
          productDetailsText: data.product_details_text || '',
          productSpecsText: data.product_specs_text || '',
          shippingReturnText: data.shipping_return_text || '',
        };
      }
    });

  return settingsCache || defaultSettings;
};

export const setSettings = (settings: Settings) => {
  settingsCache = settings;

  supabase
    .from('settings')
    .select('id')
    .maybeSingle()
    .then(async ({ data: existing }) => {
      const payload = {
        shipping_fee: Number(settings.shippingFee) || 0,
        bank_accounts: settings.bankAccounts || [],
        product_details_text: settings.productDetailsText || '',
        product_specs_text: settings.productSpecsText || '',
        shipping_return_text: settings.shippingReturnText || '',
      };

      if (existing) {
        await supabase.from('settings').update(payload).eq('id', existing.id);
      } else {
        await supabase.from('settings').insert(payload);
      }

      window.dispatchEvent(new Event('settings-updated'));
    });
};

export const getBanners = (): Banner[] => {
  if (bannersCache) return bannersCache;

  supabase
    .from('banners')
    .select('*')
    .order('order', { ascending: true })
    .then(({ data }) => {
      bannersCache = (data || []).map(b => ({
        id: b.id,
        image: b.image,
        title: b.title || undefined,
        subtitle: b.subtitle || undefined,
        link: b.link || undefined,
      }));
    });

  return bannersCache || [];
};

export const setBanners = (banners: Banner[]) => {
  bannersCache = banners;

  supabase
    .from('banners')
    .select('id')
    .then(async ({ data: existing }) => {
      const existingIds = new Set(existing?.map(b => b.id) || []);

      const toUpdate = banners.filter(b => existingIds.has(b.id));
      const toInsert = banners.filter(b => !existingIds.has(b.id));
      const toDelete = Array.from(existingIds).filter(id => !banners.find(b => b.id === id));

      for (let i = 0; i < toUpdate.length; i++) {
        const b = toUpdate[i];
        await supabase
          .from('banners')
          .update({
            image: b.image,
            title: b.title || null,
            subtitle: b.subtitle || null,
            link: b.link || null,
            order: i,
          })
          .eq('id', b.id);
      }

      if (toInsert.length > 0) {
        await supabase.from('banners').insert(
          toInsert.map((b, i) => ({
            id: b.id,
            image: b.image,
            title: b.title || null,
            subtitle: b.subtitle || null,
            link: b.link || null,
            order: toUpdate.length + i,
          }))
        );
      }

      if (toDelete.length > 0) {
        await supabase.from('banners').delete().in('id', toDelete);
      }

      window.dispatchEvent(new Event('banners-updated'));
    });
};

export const getOrders = (): Order[] => {
  const cache: Order[] = [];

  supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      cache.push(
        ...(data || []).map(o => ({
          id: o.id,
          createdAt: new Date(o.created_at).getTime(),
          items: o.items || [],
          total: Number(o.total),
          customer: {
            name: o.customer_name,
            phone: o.customer_phone,
            address: o.customer_address,
          },
          status: o.status as Order['status'],
          userId: o.user_id || undefined,
        }))
      );
    });

  return cache;
};

export const setOrders = (orders: Order[]) => {
  Promise.all(
    orders.map(async order => {
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('id', order.id)
        .maybeSingle();

      const payload = {
        id: order.id,
        user_id: order.userId || null,
        customer_name: order.customer.name,
        customer_phone: order.customer.phone,
        customer_address: order.customer.address,
        items: order.items,
        total: order.total,
        status: order.status,
      };

      if (existing) {
        await supabase.from('orders').update({ ...payload, id: undefined }).eq('id', order.id);
      } else {
        await supabase.from('orders').insert(payload);
      }
    })
  ).then(() => {
    window.dispatchEvent(new Event('orders-updated'));
  });
};

export const addOrder = (order: Order) => {
  const id = crypto.randomUUID();
  const payload = {
    id,
    user_id: order.userId || null,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_address: order.customer.address,
    items: order.items,
    total: order.total,
    status: order.status,
  };

  supabase.from('orders').insert(payload).then(() => {
    window.dispatchEvent(new Event('orders-updated'));
  });
};

export const getUsers = (): User[] => {
  const cache: User[] = [];

  supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      cache.push(
        ...(data || []).map(u => ({
          id: u.id,
          name: u.name,
          lastName: u.last_name || undefined,
          email: u.email,
          phone: u.phone,
          avatar: u.avatar || undefined,
          password: u.password,
          gender: u.gender as User['gender'],
          birthYear: u.birth_year || undefined,
          birthMonth: u.birth_month || undefined,
          birthDay: u.birth_day || undefined,
          isAdmin: u.is_admin || false,
          createdAt: new Date(u.created_at).getTime(),
        }))
      );
    });

  return cache;
};

export const setUsers = (users: User[]) => {
  Promise.all(
    users.map(async user => {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      const payload = {
        id: user.id,
        name: user.name,
        last_name: user.lastName || null,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar || null,
        password: user.password,
        gender: user.gender || null,
        birth_year: user.birthYear || null,
        birth_month: user.birthMonth || null,
        birth_day: user.birthDay || null,
        is_admin: user.isAdmin || false,
      };

      if (existing) {
        await supabase.from('users').update({ ...payload, id: undefined }).eq('id', user.id);
      } else {
        await supabase.from('users').insert(payload);
      }
    })
  ).then(() => {
    window.dispatchEvent(new Event('users-updated'));
  });
};

export const addUser = (
  u: Omit<User, 'id' | 'createdAt'> & Partial<Pick<User, 'id' | 'createdAt'>>
): User => {
  const user: User = {
    id: u.id || crypto.randomUUID(),
    createdAt: u.createdAt || Date.now(),
    name: u.name,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    avatar: u.avatar,
    password: u.password,
    gender: u.gender,
    birthYear: u.birthYear,
    birthMonth: u.birthMonth,
    birthDay: u.birthDay,
    isAdmin: (u as any).isAdmin || false,
  };

  supabase
    .from('users')
    .select('email')
    .ilike('email', u.email)
    .maybeSingle()
    .then(({ data: existing }) => {
      if (existing) {
        throw new Error('EMAIL_TAKEN');
      }

      return supabase.from('users').insert({
        id: user.id,
        name: user.name,
        last_name: user.lastName || null,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar || null,
        password: user.password,
        gender: user.gender || null,
        birth_year: user.birthYear || null,
        birth_month: user.birthMonth || null,
        birth_day: user.birthDay || null,
        is_admin: user.isAdmin || false,
      });
    });

  setCurrentUserId(user.id);
  return user;
};

export const getCurrentUserId = (): string | null =>
  localStorage.getItem(CURRENT_USER_KEY);

export const setCurrentUserId = (id: string | null) => {
  if (id) localStorage.setItem(CURRENT_USER_KEY, id);
  else localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event('user-updated'));
};

export const getCurrentUser = (): User | null => {
  const id = getCurrentUserId();
  if (!id) return null;

  let user: User | null = null;

  supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle()
    .then(({ data }) => {
      if (data) {
        user = {
          id: data.id,
          name: data.name,
          lastName: data.last_name || undefined,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar || undefined,
          password: data.password,
          gender: data.gender as User['gender'],
          birthYear: data.birth_year || undefined,
          birthMonth: data.birth_month || undefined,
          birthDay: data.birth_day || undefined,
          isAdmin: data.is_admin || false,
          createdAt: new Date(data.created_at).getTime(),
        };
      }
    });

  return user;
};

export const loginUser = (email: string, password: string): User | null => {
  let user: User | null = null;

  supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .eq('password', password)
    .maybeSingle()
    .then(({ data }) => {
      if (data) {
        user = {
          id: data.id,
          name: data.name,
          lastName: data.last_name || undefined,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar || undefined,
          password: data.password,
          gender: data.gender as User['gender'],
          birthYear: data.birth_year || undefined,
          birthMonth: data.birth_month || undefined,
          birthDay: data.birth_day || undefined,
          isAdmin: data.is_admin || false,
          createdAt: new Date(data.created_at).getTime(),
        };

        setCurrentUserId(user.id);
      }
    });

  return user;
};

export const logoutUser = () => setCurrentUserId(null);

export const updateCurrentUser = (patch: Partial<User>) => {
  const id = getCurrentUserId();
  if (!id) return;

  const payload: any = {};
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.lastName !== undefined) payload.last_name = patch.lastName;
  if (patch.phone !== undefined) payload.phone = patch.phone;
  if (patch.avatar !== undefined) payload.avatar = patch.avatar;
  if (patch.gender !== undefined) payload.gender = patch.gender;
  if (patch.birthYear !== undefined) payload.birth_year = patch.birthYear;
  if (patch.birthMonth !== undefined) payload.birth_month = patch.birthMonth;
  if (patch.birthDay !== undefined) payload.birth_day = patch.birthDay;

  supabase.from('users').update(payload).eq('id', id).then(() => {
    window.dispatchEvent(new Event('user-updated'));
  });
};

export const deleteCurrentUser = () => {
  const id = getCurrentUserId();
  if (!id) return;

  supabase.from('users').delete().eq('id', id).then(() => {
    setCurrentUserId(null);
  });
};

export const updateOrderStatus = (id: string, status: Order['status']) => {
  supabase.from('orders').update({ status }).eq('id', id).then(() => {
    window.dispatchEvent(new Event('orders-updated'));
  });
};

export const seedDefaultAdmin = () => {
  supabase
    .from('users')
    .select('*')
    .ilike('email', 'admin')
    .maybeSingle()
    .then(async ({ data: existing }) => {
      if (existing) {
        if (!existing.is_admin) {
          await supabase.from('users').update({ is_admin: true }).eq('id', existing.id);
        }
        return;
      }

      const { data: users } = await supabase.from('users').select('id');
      if (users && users.length > 0) return;

      await supabase.from('users').insert({
        id: crypto.randomUUID(),
        name: 'Admin',
        email: 'admin',
        phone: '0000000000',
        password: 'admin123',
        is_admin: true,
      });
    });
};
