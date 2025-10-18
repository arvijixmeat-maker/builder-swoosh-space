import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCurrentUser,
  logoutUser,
  getCategories,
  getCart,
} from "@/data/supabase-store";

export default function Header() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const logout = () => {
    logoutUser();
    navigate("/");
  };
  const [cats, setCats] = useState<string[]>(getCategories());
  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      const items = getCart();
      return items.reduce((sum, it) => sum + (it.qty || 0), 0);
    } catch {
      return 0;
    }
  });
  useEffect(() => {
    const updateCats = () => setCats(getCategories());
    const updateCart = () => {
      try {
        const items = getCart();
        setCartCount(items.reduce((sum, it) => sum + (it.qty || 0), 0));
      } catch {
        setCartCount(0);
      }
    };
    window.addEventListener("storage", updateCats);
    window.addEventListener("categories-updated", updateCats as EventListener);
    window.addEventListener("storage", updateCart);
    window.addEventListener("cart-updated", updateCart as EventListener);
    return () => {
      window.removeEventListener("storage", updateCats);
      window.removeEventListener(
        "categories-updated",
        updateCats as EventListener,
      );
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cart-updated", updateCart as EventListener);
    };
  }, []);
  const fallback = ["Гоо сайхан", "Спорт", "Технологи", "Аялал", "+18"];
  const categories = cats.length ? cats : fallback;
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F20bb325d07124ff1b740216a070177ed%2F3f2bf1d38ff445bba2a5998b407ec614?format=webp&width=800"
            alt="Талын Маркет лого"
            className="h-8 w-auto"
            decoding="async"
          />
        </Link>

        <div className="hidden md:flex items-center gap-1 rounded-md border px-2 py-1.5 w-full max-w-xl bg-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Та юу хайж байна вэ?"
            aria-label="Хайх"
          />
          <Button size="sm" className="shrink-0">
            Хайх
          </Button>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "text-foreground/80 hover:text-foreground"
            }
          >
            Нүүр
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "text-foreground/80 hover:text-foreground"
            }
          >
            Ангилал
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Хэрэглэгч">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    {user.name.split(" ")[0]}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/mypage" className="w-full">
                      Миний хуудас
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Гарах</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="w-full">
                      Нэвтрэх
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="w-full">
                      Бүртгүүлэх
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="ghost" size="icon" aria-label="Сагс">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  aria-label={`Сагсанд ${cartCount} бүтээгдэхүүн байна`}
                  className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-primary px-1 text-[10px] leading-4 text-blue-600 text-center"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      <div className="md:hidden border-t">
        <div className="container mx-auto p-3">
          <div className="flex items-center gap-2 rounded-md border px-2 py-1.5 bg-card">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Та юу хайж байна вэ?"
              aria-label="Хайх"
            />
            <Button size="sm" className="shrink-0">
              Хайх
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              }
            >
              Нүүр
            </NavLink>
            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              }
            >
              Ангилал
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
