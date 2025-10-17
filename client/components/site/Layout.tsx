import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getCart } from "@/data/store";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const cartCount = getCart().length;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {!getCurrentUser() && (
        <div className="hidden md:block fixed bottom-4 right-4 z-50">
          <Button asChild size="sm" variant="secondary" className="shadow-lg">
            <Link to="/login?redirect=/admin">АДМИН НЭВТРЭХ</Link>
          </Button>
        </div>
      )}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16">
          <Link
            to="/"
            onClick={scrollToTop}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === "/" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Нүүр</span>
          </Link>
          <Link
            to="/catalog"
            onClick={scrollToTop}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === "/catalog" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs mt-1">Ангилал</span>
          </Link>
          <Link
            to="/cart"
            onClick={scrollToTop}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
              location.pathname === "/cart" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-1/4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs mt-1">Сагс</span>
          </Link>
          <Link
            to="/mypage"
            onClick={scrollToTop}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === "/mypage" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Миний</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
