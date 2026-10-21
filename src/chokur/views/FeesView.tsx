import React, { useMemo, useState } from "react";
import { useGrading } from "../context/GradingContext";
import { feeBalance, ops, useSchoolOps } from "../lib/schoolOps";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge } from "@/chokur/components/ui";
import { Input, Select } from "@/chokur/components/ui";
import { DataTable, TableHeader, TableHead, TableRow, TableCell } from "@/chokur/components/ui";

const kes = (n: number) => `KES ${n.toLocaleString()}`;

export const FeesView: React.FC = () => {
  const { filteredStudents, activeStream, schoolConfig, setActiveView } = useGrading();
  const store = useSchoolOps();
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"M-Pesa" | "Bank" | "Cash" | "Cheque">("M-Pesa");
  const [ref, setRef] = useState("");
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      filteredStudents
        .filter(
          (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.admNo.includes(query),
        )
        .map((s) => ({ s, ...feeBalance(store, s.id) })),
    [filteredStudents, store, query],
  );
  const expected = filteredStudents.length * store.feePerTerm;
  const collected = filteredStudents.reduce((a, s) => a + feeBalance(store, s.id).paid, 0);
  const defaulters = filteredStudents.filter((s) => feeBalance(store, s.id).balance > 0).length;
  const pct = expected ? Math.round((collected / expected) * 100) : 0;

  const record = () => {
    const amt = Number(amount);
    if (!studentId || !(amt > 0)) return;
    ops.addPayment({
      studentId,
      amount: amt,
      date: new Date().toISOString().slice(0, 10),
      method,
      ref: ref.trim() || "—",
    });
    setAmount("");
    setRef("");
  };

  const recent = store.payments
    .filter((p) => filteredStudents.some((s) => s.id === p.studentId))
    .slice(0, 8);

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:px-8 font-body-md text-[var(--color-on-surface)]">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[var(--color-hairline-border)]">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Fees
          </h1>
          <p className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)] mt-1">
            {activeStream} · {schoolConfig.term} {schoolConfig.academicYear}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[var(--color-on-surface-muted)]">
              Fee per term (KES)
            </label>
            <Input
              type="number"
              min={0}
              value={store.feePerTerm}
              onChange={(e) => ops.setFeePerTerm(Number(e.target.value))}
              className="w-32"
            />
          </div>
          {defaulters > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveView("messaging")}
              className="min-h-[40px]"
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">sms</span>}
            >
              Remind {defaulters} parent{defaulters === 1 ? "" : "s"} by SMS
            </Button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-4">
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="text-[11px] font-label-caps text-label-caps uppercase tracking-wider text-[var(--color-on-surface-muted)]">
              Expected
            </div>
            <div className="text-xl font-bold text-[var(--color-on-surface)]">{kes(expected)}</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="text-[11px] font-label-caps text-label-caps uppercase tracking-wider text-[var(--color-on-surface-muted)]">
              Collected
            </div>
            <div className="text-xl font-bold text-[var(--color-success)]">{kes(collected)}</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="text-[11px] font-label-caps text-label-caps uppercase tracking-wider text-[var(--color-on-surface-muted)]">
              Collection Rate
            </div>
            <div className="text-xl font-bold text-[var(--color-on-surface)]">{pct}%</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="text-[11px] font-label-caps text-label-caps uppercase tracking-wider text-[var(--color-on-surface-muted)]">
              With Balance
            </div>
            <div className="text-xl font-bold text-[var(--color-error)]">{defaulters} students</div>
          </CardContent>
        </Card>
      </section>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or adm no."
            className="w-full sm:w-72 mb-3"
            icon={<span className="material-symbols-outlined text-[18px]">search</span>}
          />
          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-0">
              <DataTable hoverable compact>
                <TableHeader>
                  <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                    <TableHead scope="col" className="w-20 px-4">
                      ADM
                    </TableHead>
                    <TableHead scope="col" className="px-4">
                      STUDENT
                    </TableHead>
                    <TableHead scope="col" className="w-28 px-3 text-right">
                      PAID
                    </TableHead>
                    <TableHead scope="col" className="w-28 px-3 text-right">
                      BALANCE
                    </TableHead>
                  </tr>
                </TableHeader>
                <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                  {rows.map(({ s, paid, balance }) => (
                    <TableRow
                      key={s.id}
                      className="h-11 hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer"
                      onClick={() => setStudentId(s.id)}
                    >
                      <TableCell className="px-4 font-tabular-sm text-[11px] text-[var(--color-on-surface-muted)]">
                        {s.admNo}
                      </TableCell>
                      <TableCell className="px-4 font-medium text-[var(--color-on-surface)]">
                        {s.name}
                      </TableCell>
                      <TableCell className="px-3 text-right font-tabular-sm text-[var(--color-on-surface)]">
                        {paid.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-3 text-right font-tabular-sm font-semibold">
                        {balance > 0 ? (
                          <span className="text-[var(--color-error)]">
                            {balance.toLocaleString()}
                          </span>
                        ) : (
                          <Badge variant="success" size="sm">
                            Cleared
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </DataTable>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="font-headline-sm text-headline-sm">Record Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={studentId} onValueChange={setStudentId} placeholder="Select student…">
                <option value="">Select student…</option>
                {filteredStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.admNo})
                  </option>
                ))}
              </Select>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (KES)"
              />
              <div className="flex gap-2">
                <Select
                  value={method}
                  onValueChange={(value) => setMethod(value as typeof method)}
                  className="flex-1"
                >
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank">Bank</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </Select>
                <Input
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="Reference"
                />
              </div>
              <Button size="sm" onClick={record} className="w-full">
                Save Payment
              </Button>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="font-headline-sm text-headline-sm">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recent.length === 0 ? (
                <div className="p-4 text-center text-[var(--color-on-surface-muted)] text-sm">
                  None recorded.
                </div>
              ) : (
                <DataTable compact>
                  <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                    {recent.map((p) => {
                      const st = filteredStudents.find((s) => s.id === p.studentId);
                      return (
                        <TableRow
                          key={p.id}
                          className="h-10 hover:bg-[var(--color-surface-container)]"
                        >
                          <TableCell className="px-4 text-[var(--color-on-surface)]">
                            {st?.name} · {p.method} · {p.date}
                          </TableCell>
                          <TableCell className="px-4 text-right font-tabular-sm font-semibold flex items-center justify-end gap-2">
                            <span>{p.amount.toLocaleString()}</span>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              onClick={() => ops.removePayment(p.id)}
                              aria-label="Delete payment"
                            >
                              <span className="material-symbols-outlined text-[18px] text-[var(--color-on-surface-disabled)] hover:text-[var(--color-error)]">
                                close
                              </span>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </tbody>
                </DataTable>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};
