import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  TentTree,
  Heart,
  User,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logoutUser, getCategories } from "@/data/store";

export default function Header() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const logout = () => {
    logoutUser();
    navigate("/");
  };
  const [cats, setCats] = useState<string[]>(getCategories());
  useEffect(() => {
    const update = () => setCats(getCategories());
    window.addEventListener("storage", update);
    window.addEventListener("categories-updated", update as EventListener);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("categories-updated", update as EventListener);
    };
  }, []);
  const fallback = ["Гоо сайхан", "Спорт", "Технологи", "Аялал", "+18"];
  const categories = cats.length ? cats : fallback;
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <TentTree className="h-6 w-6 text-primary" />
          <span>Талын Маркет</span>
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
          {user && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              }
            >
              Админ
            </NavLink>
          )}
          <NavLink
            to="/mypage"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "text-foreground/80 hover:text-foreground"
            }
          >
            Миний хуудас
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/cart"
                className="hidden md:inline text-sm text-foreground/80 hover:text-foreground inline-flex items-center gap-1"
              >
                <ShoppingCart className="h-5 w-5" /> Сагс
              </Link>
              <Link
                to="/mypage"
                className="hidden md:inline text-sm text-foreground inline-flex items-center gap-1"
              >
                <User className="h-5 w-5" /> {user.name.split(" ")[0]}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Гарах
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/cart"
                className="hidden md:inline text-sm text-foreground/80 hover:text-foreground inline-flex items-center gap-1"
              >
                <ShoppingCart className="h-5 w-5" /> Сагс
              </Link>
              <Link
                to="/login"
                className="text-sm text-foreground/80 hover:text-foreground"
              >
                Нэвтрэх
              </Link>
              <Link to="/register" className="text-sm text-primary">
                Бүртгүүлэх
              </Link>
            </>
          )}
          <Button asChild variant="ghost" size="icon" aria-label="Сагс">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
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
            {user && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                }
              >
                Админ
              </NavLink>
            )}
            <NavLink
              to="/mypage"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              }
            >
              Миний хуудас
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              }
            >
              Сагс
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
