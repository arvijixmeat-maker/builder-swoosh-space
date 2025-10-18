import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables missing:', {
    url: supabaseUrl ? 'present' : 'MISSING',
    key: supabaseAnonKey ? 'present' : 'MISSING',
    allEnv: import.meta.env
  });
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your deployment environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          compare_at_price: number | null;
          coupon_price: number | null;
          image: string;
          images: string[] | null;
          category: string | null;
          description: string | null;
          badge: string | null;
          colors: string[] | null;
          sizes: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          name: string;
          phone: string;
          address: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'is_admin'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          items: any;
          total: number;
          status: 'unpaid' | 'paid' | 'shipping' | 'delivered';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      banners: {
        Row: {
          id: string;
          image: string;
          title: string | null;
          subtitle: string | null;
          link: string | null;
          order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['banners']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['banners']['Insert']>;
      };
      settings: {
        Row: {
          id: string;
          shipping_fee: number;
          bank_accounts: any;
          product_details_text: string | null;
          product_specs_text: string | null;
          shipping_return_text: string | null;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['settings']['Row']>;
        Update: Partial<Database['public']['Tables']['settings']['Insert']>;
      };
    };
  };
};
