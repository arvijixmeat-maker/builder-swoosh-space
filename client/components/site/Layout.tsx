import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomBar from "./MobileBottomBar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/data/store";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomBar />
      {!getCurrentUser() && (
        <div className="hidden md:block fixed bottom-4 right-4 z-50">
          <Button asChild size="sm" variant="secondary" className="shadow-lg">
            <Link to="/login?redirect=/admin">АДМИН НЭВТРЭХ</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
