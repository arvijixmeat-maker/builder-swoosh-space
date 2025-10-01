import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Home, Search, ShoppingCart, User, Grid2x2 } from "lucide-react";
import { getCart, type CartItem, getCurrentUser } from "@/data/store";

export default function MobileBottomBar() {
  const [cartCount, setCartCount] = useState<number>(getCart().reduce((s, i) => s + i.qty, 0));
  const user = getCurrentUser();

  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((s, i) => s + i.qty, 0));
    window.addEventListener("storage", update);
    window.addEventListener("cart-updated", update as EventListener);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart-updated", update as EventListener);
    };
  }, []);

  const Item = ({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex flex-1 flex-col items-center justify-center gap-1 text-xs ${
          isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Доод навигаци"
    >
      <div className="mx-auto flex h-16 max-w-screen-sm items-stretch">
        <Item to="/" icon={<Home className="h-5 w-5" />} label="Нүүр" />
        <Item to="/catalog" icon={<Grid2x2 className="h-5 w-5" />} label="Ангилал" />
        <div className="relative flex flex-1 items-stretch justify-center">
          <Link
            to="/cart"
            className="relative flex flex-1 flex-col items-center justify-center gap-1 text-xs text-foreground/80 hover:text-foreground"
            aria-label="Сагс"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Сагс</span>
            {cartCount > 0 && (
              <span className="absolute left-1/2 top-1 -translate-x-1/2 min-w-4 h-4 rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-foreground text-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <Item to={user ? "/mypage" : "/login"} icon={<User className="h-5 w-5" />} label={user ? "Миний" : "Нэвтрэх"} />
      </div>
    </nav>
  );
}
