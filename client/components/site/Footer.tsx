export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Талын Маркет — Монгол хэл дээрх онлайн дэлгүүр</p>
        <p className="text-xs">Дизайн ба хөгжүүлэлт • Builder.io Fusion Starter</p>
      </div>
    </footer>
  );
}
