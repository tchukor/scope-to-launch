import React, { useMemo, useState } from "react";
import { useGrading } from "../context/GradingContext";
import { feeBalance, getContact, ops, smsSegments, useSchoolOps } from "../lib/schoolOps";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge } from "@/chokur/components/ui";
import { Input, Textarea, Select } from "@/chokur/components/ui";
import { DataTable, TableHeader, TableHead, TableRow, TableCell } from "@/chokur/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/chokur/components/ui";

const TEMPLATES: { name: string; text: string }[] = [
  {
    name: "Fee reminder",
    text: "Dear {parent}, {student} (Adm {adm}) has a fee balance of KES {balance}. Kindly clear before the end of term. Thank you.",
  },
  {
    name: "Results ready",
    text: "Dear {parent}, {student} scored a mean grade {grade} (rank {rank}) in {exam}. Log in to the Parent Portal for the full report.",
  },
  {
    name: "Meeting",
    text: "Dear {parent}, you are invited to a parents meeting on Friday 8am at {school}. Your attendance is highly appreciated.",
  },
  {
    name: "Closing day",
    text: "Dear {parent}, {school} closes on {closing}. Please ensure {student} is picked up with all fees cleared.",
  },
];

type Audience = "stream" | "all" | "defaulters";

export const BulkSmsView: React.FC = () => {
  const { students, filteredStudents, rankings, schoolConfig, activeStream, activeExam } =
    useGrading();
  const store = useSchoolOps();
  const [audience, setAudience] = useState<Audience>("stream");
  const [text, setText] = useState(TEMPLATES[0]?.text ?? "");
  const [result, setResult] = useState("");

  const pool = audience === "all" ? students : filteredStudents;
  const recipients = useMemo(
    () =>
      pool
        .filter((s) => s.status === "Active")
        .filter((s) => audience !== "defaulters" || feeBalance(store, s.id).balance > 0),
    [pool, audience, store],
  );

  const render = (s: (typeof students)[number]) => {
    const c = getContact(store, s);
    const r = rankings.find((x) => x.student.id === s.id);
    return text
      .replace(/{parent}/g, c.parentName)
      .replace(/{student}/g, s.name)
      .replace(/{adm}/g, s.admNo)
      .replace(/{balance}/g, feeBalance(store, s.id).balance.toLocaleString())
      .replace(/{grade}/g, r ? r.meanGrade : "—")
      .replace(/{rank}/g, r ? String(r.rank) : "—")
      .replace(/{exam}/g, activeExam)
      .replace(/{school}/g, schoolConfig.schoolName)
      .replace(/{closing}/g, schoolConfig.termClosingDate || "TBA");
  };

  const preview = recipients[0] ? render(recipients[0]) : "";
  const segs = smsSegments(preview);
  const label =
    audience === "all"
      ? "All students"
      : audience === "defaulters"
        ? `Fee defaulters · ${activeStream}`
        : activeStream;

  const send = () => {
    if (!recipients.length || !text.trim()) return;
    ops.logSms({
      audience: label,
      recipients: recipients.length,
      segments: segs * recipients.length,
      text,
      sample: getContact(store, recipients[0]!).phone,
    });
    setResult(`${recipients.length} message(s) queued (${segs * recipients.length} SMS units).`);
  };

  const copyNumbers = async () => {
    const nums = recipients.map((s) => getContact(store, s).phone).join(", ");
    try {
      await navigator.clipboard.writeText(nums);
      setResult("Phone numbers copied.");
    } catch {
      setResult(nums);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:px-8 font-body-md text-[var(--color-on-surface)]">
      <section className="pb-4 border-b border-[var(--color-hairline-border)]">
        <h1 className="font-headline-lg text-headline-lg tracking-tight">Bulk SMS</h1>
        <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)] mt-1">
          Message many parents with one click. Merge fields personalise each text.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 py-5">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["stream", activeStream],
                ["all", "Whole school"],
                ["defaulters", "Fee defaulters"],
              ] as [Audience, string][]
            ).map(([id, l]) => (
              <Button
                key={id}
                variant={audience === id ? "primary" : "outline"}
                size="sm"
                onClick={() => setAudience(id)}
                className="h-9 px-3 text-sm"
              >
                {l}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <Button
                key={t.name}
                variant="ghost"
                size="sm"
                onClick={() => setText(t.text)}
                className="h-8 px-3 rounded-full text-xs"
              >
                {t.name}
              </Button>
            ))}
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Enter your message with merge fields..."
            hint="Available fields: {parent} {student} {adm} {balance} {grade} {rank} {exam} {school} {closing}"
          />

          <Card variant="outlined" className="p-3">
            <div className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] text-xs uppercase tracking-wider mb-1">
              Preview · {recipients[0]?.name || "no recipients"}
            </div>
            <p className="text-sm text-[var(--color-on-surface)] mb-2">{preview || "—"}</p>
            <p className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)] text-xs">
              {preview.length} chars · {segs} SMS per recipient
            </p>
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={send}
              disabled={!recipients.length}
              size="sm"
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[15px]">send</span>}
            >
              Send to {recipients.length} parent{recipients.length === 1 ? "" : "s"}
            </Button>
            <Button variant="outline" size="sm" onClick={copyNumbers} className="min-h-[36px]">
              Copy numbers
            </Button>
            {result && (
              <Badge
                variant={result.includes("queued") ? "success" : "outline"}
                className="text-sm"
              >
                {result}
              </Badge>
            )}
          </div>
          <p className="font-caption text-caption text-[var(--color-on-surface-muted)]">
            Messages are logged here. No SMS gateway is connected yet, so nothing leaves the device
            until you plug in a provider (e.g. Africa&apos;s Talking).
          </p>
        </div>

        <aside className="space-y-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="font-headline-sm text-headline-sm">Sent Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {store.smsLog.length === 0 ? (
                <div className="p-4 text-center text-[var(--color-on-surface-muted)] text-sm">
                  Nothing sent yet.
                </div>
              ) : (
                <DataTable compact>
                  <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                    {store.smsLog.map((m) => (
                      <TableRow
                        key={m.id}
                        className="h-12 hover:bg-[var(--color-surface-container)]"
                      >
                        <TableCell className="px-4 py-2">
                          <div className="font-medium text-[var(--color-on-surface)]">
                            {m.audience} · {m.recipients} recipient{m.recipients === 1 ? "" : "s"}
                          </div>
                          <div className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)]">
                            {new Date(m.sentAt).toLocaleString()}
                          </div>
                          <div className="mt-1 line-clamp-2 text-[var(--color-on-surface)]">
                            {m.text}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
