import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSettings, setSettings, type BankAccount, type Settings } from "@/data/store";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPanel() {
  const { toast } = useToast();
  const [shippingFee, setShippingFee] = useState<number>(getSettings().shippingFee);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [note, setNote] = useState("");
  const [accounts, setAccounts] = useState<BankAccount[]>(getSettings().bankAccounts);

  useEffect(() => {
    const reload = () => {
      const s = getSettings();
      setShippingFee(s.shippingFee);
      setAccounts(s.bankAccounts);
    };
    window.addEventListener("settings-updated", reload as EventListener);
    return () => window.removeEventListener("settings-updated", reload as EventListener);
  }, []);

  const saveShipping = () => {
    const s = getSettings();
    const next: Settings = { ...s, shippingFee: Math.max(0, Number(shippingFee) || 0) };
    setSettings(next);
    toast({ title: "Хүргэлтийн төлбөр шинэчлэгдлээ" });
  };

  const addAccount = () => {
    const a: BankAccount = {
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      holder: holder.trim(),
      note: note.trim() || undefined,
    };
    if (!a.bankName || !a.accountNumber || !a.holder) {
      toast({ title: "Талбар дутуу", description: "Банк, данс, эзэмшигч бөглөнө үү" });
      return;
    }
    const s = getSettings();
    const next: Settings = { ...s, bankAccounts: [a, ...s.bankAccounts] };
    setSettings(next);
    setBankName("");
    setAccountNumber("");
    setHolder("");
    setNote("");
    toast({ title: "계좌가 추가되었습니다" });
  };

  const removeAccount = (idx: number) => {
    const s = getSettings();
    const next: Settings = { ...s, bankAccounts: s.bankAccounts.filter((_, i) => i !== idx) };
    setSettings(next);
    toast({ title: "계좌가 삭제되었습니다" });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Хүргэлтийн төлбөр</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:max-w-sm">
          <Label htmlFor="shipFee">Төлбөр (MNT)</Label>
          <Input id="shipFee" type="number" value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value))} />
          <Button onClick={saveShipping}>Хадгалах</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>무통장입금 계좌 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-2">
            <div className="grid gap-1">
              <Label htmlFor="bank">은행</Label>
              <Input id="bank" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Kookmin" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="acc">계좌번호</Label>
              <Input id="acc" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="123-456-7890" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="holder">예금주</Label>
              <Input id="holder" value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Hong Gil-dong" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="note">비고(선택)</Label>
              <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="지점/메모" />
            </div>
          </div>
          <div className="mt-2">
            <Button onClick={addAccount}>계좌 추가</Button>
          </div>

          <div className="mt-4 grid gap-2">
            {accounts.map((a, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
                <div className="space-x-2 text-muted-foreground">
                  <span>{a.bankName}</span>
                  <span>{a.holder}</span>
                </div>
                <div className="font-mono">{a.accountNumber}</div>
                <div className="flex items-center gap-2">
                  {a.note ? <span className="text-xs text-muted-foreground">{a.note}</span> : null}
                  <Button variant="destructive" size="sm" onClick={() => removeAccount(idx)}>삭제</Button>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <div className="text-sm text-muted-foreground">등록된 계좌가 없습니다.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
