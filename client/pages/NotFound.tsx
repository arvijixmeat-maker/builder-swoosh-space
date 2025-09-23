import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-4">Таны хайсан хуудас олдсонгүй.</p>
        <a href="/" className="text-primary underline underline-offset-4">Нүүр хуудас руу буцах</a>
      </div>
    </div>
  );
};

export default NotFound;
