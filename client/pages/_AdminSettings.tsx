import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getSettings,
  setSettings,
  type BankAccount,
  type Settings,
} from "@/data/supabase-store";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPanel() {
  const { toast } = useToast();
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [note, setNote] = useState("");
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [detailsText, setDetailsText] = useState<string>("");
  const [specsText, setSpecsText] = useState<string>("");
  const [shippingText, setShippingText] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await getSettings();
    setShippingFee(s.shippingFee);
    setAccounts(s.bankAccounts);
    setDetailsText(s.productDetailsText || "");
    setSpecsText(s.productSpecsText || "");
    setShippingText(s.shippingReturnText || "");
  };

  const saveShipping = async () => {
    const s = await getSettings();
    const next: Settings = {
      ...s,
      shippingFee: Math.max(0, Number(shippingFee) || 0),
    };
    await setSettings(next);
    toast({ title: "Хүргэлтийн төлбөр шинэчлэгдлээ" });
  };

  const saveTexts = async () => {
    const s = await getSettings();
    const next: Settings = {
      ...s,
      productDetailsText: detailsText,
      productSpecsText: specsText,
      shippingReturnText: shippingText,
    };
    await setSettings(next);
    toast({ title: "Бүтээгдэхүүний мэдээллийн текстүүд шинэчлэгдлээ" });
  };

  const addAccount = () => {
    const a: BankAccount = {
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      holder: holder.trim(),
      note: note.trim() || undefined,
    };
    if (!a.bankName || !a.accountNumber || !a.holder) {
      toast({
        title: "Талбар дутуу",
        description: "Банк, данс, эзэмшигч бөглөнө үү",
      });
      return;
    }
    const s = getSettings();
    const next: Settings = { ...s, bankAccounts: [a, ...s.bankAccounts] };
    setSettings(next);
    setBankName("");
    setAccountNumber("");
    setHolder("");
    setNote("");
    toast({ title: "Данс нэмэгдлээ" });
  };

  const removeAccount = (idx: number) => {
    const s = getSettings();
    const next: Settings = {
      ...s,
      bankAccounts: s.bankAccounts.filter((_, i) => i !== idx),
    };
    setSettings(next);
    toast({ title: "Данс устгагдлаа" });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Хүргэлтийн төлбөр</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:max-w-sm">
          <Label htmlFor="shipFee">Төлбөр (KRW)</Label>
          <Input
            id="shipFee"
            type="number"
            value={shippingFee}
            onChange={(e) => setShippingFee(Number(e.target.value))}
          />
          <Button onClick={saveShipping}>Хадгалах</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Бүтээгдэхүүний мэдээлэл (Accordion) текстүүд</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="detailsText">Дэлгэрэнгүй тайлбар</Label>
            <Textarea
              id="detailsText"
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
              placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..."
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="specsText">Үзүүлэлт</Label>
            <Textarea
              id="specsText"
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              placeholder="Үзүүлэлтүүд..."
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="shippingText">Хүргэлт ба буцаалт</Label>
            <Textarea
              id="shippingText"
              value={shippingText}
              onChange={(e) => setShippingText(e.target.value)}
              placeholder="Хүргэлт, буцаалтын нөхцөл..."
            />
          </div>
          <div>
            <Button onClick={saveTexts}>Текстүүд хадгалах</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Банк шилжүүлгийн данс удирдах</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-2">
            <div className="grid gap-1">
              <Label htmlFor="bank">Банк</Label>
              <Input
                id="bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="ж: Kookmin"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="acc">Дансны дугаар</Label>
              <Input
                id="acc"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="ж: 123-456-7890"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="holder">Эзэмшигч</Label>
              <Input
                id="holder"
                value={holder}
                onChange={(e) => setHolder(e.target.value)}
                placeholder="ж: Бат-Эрдэнэ"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="note">Тэмдэглэл (сонголттой)</Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ж: салбар/мемо"
              />
            </div>
          </div>
          <div className="mt-2">
            <Button onClick={addAccount}>Данс нэмэх</Button>
          </div>

          <div className="mt-4 grid gap-2">
            {accounts.map((a, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
              >
                <div className="space-x-2 text-muted-foreground">
                  <span>{a.bankName}</span>
                  <span>{a.holder}</span>
                </div>
                <div className="font-mono">{a.accountNumber}</div>
                <div className="flex items-center gap-2">
                  {a.note ? (
                    <span className="text-xs text-muted-foreground">
                      {a.note}
                    </span>
                  ) : null}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAccount(idx)}
                  >
                    Устгах
                  </Button>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Одоогоор бүртгэлтэй данс алга.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
