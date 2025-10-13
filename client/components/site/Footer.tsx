import { Link } from "react-router-dom";
import { BadgeCheck, Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F20bb325d07124ff1b740216a070177ed%2F3f2bf1d38ff445bba2a5998b407ec614?format=webp&width=300"
                alt="Талын Маркет"
                className="h-7 w-auto"
                decoding="async"
              />
            </div>
            <p className="text-muted-foreground">
              Талын Маркет нь албан ёсны брэндийн барааг шууд нийлүүлж,
              чанартай, хурдан хүргэлтээр танд хүргэнэ.
            </p>
            <button className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs shadow-sm">
              <BadgeCheck className="h-4 w-4 text-primary" /> Улсын бүртгэлээр
              баталгаажсан
            </button>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">
              МЭДЭЭЛЭЛ
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:underline">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Үйлчилгээний нөхцөл
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Хүргэлтийн нөхцөл
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Төлбөрийн нөхцөл
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">
              ТУСЛАМЖ
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:underline">
                  Холбоо барих
                </Link>
              </li>
              <li>
                <Link to="/mypage" className="hover:underline">
                  Миний бүртгэл
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:underline">
                  Сагс
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Салбарын мэдээлэл
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">
              СОШИАЛ ХОЛБООС
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> 77076688
              </li>
              <li className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@delgemelod.mn
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © {year} Талын Маркет | Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  );
}
