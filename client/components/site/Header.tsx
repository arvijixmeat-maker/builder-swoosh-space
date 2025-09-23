import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Search, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
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
            placeholder="Бүтээгдэхүүн хайх..."
            aria-label="Хайх"
          />
          <Button size="sm" className="shrink-0">Хайх</Button>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"}>Нүүр</NavLink>
          <NavLink to="/catalog" className={({ isActive }) => isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"}>Каталог</NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"}>Админ</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Сагс">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="md:hidden border-t">
        <div className="container mx-auto p-3">
          <div className="flex items-center gap-2 rounded-md border px-2 py-1.5 bg-card">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Бүтээгдэхүүн хайх..."
              aria-label="Хайх"
            />
            <Button size="sm" className="shrink-0">Хайх</Button>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"}>Нүүр</NavLink>
            <NavLink to="/catalog" className={({ isActive }) => isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"}>Каталог</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
