export default function Catalog() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Каталог</h1>
        <p className="text-muted-foreground mt-1">Бүх ангиллын бүтээгдэхүүнүүдийг эндээс хайж олоорой.</p>
      </div>
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Каталогийн дэлгэрэнгүй хуудас удахгүй бүрэн ажиллана. Та одоогоор нүүр хуудсан дээрх онцлох бүтээгдэхүүнээс танилцаарай.
      </div>
    </div>
  );
}
