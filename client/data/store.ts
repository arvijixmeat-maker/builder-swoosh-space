export const PRODUCTS_KEY = "admin_products";
export const CATEGORIES_KEY = "admin_categories";

export type Category = string;

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
};
