"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { formatCurrency, lineItemAmount } from "@/lib/calculations";
import { Currency, LineItem, makeEmptyItem } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  items: LineItem[];
  currency: Currency;
  showHsn: boolean;
  onChange: (items: LineItem[]) => void;
}

export function ItemsForm({ items, currency, showHsn, onChange }: Props) {
  const descRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const pendingFocusId = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingFocusId.current) return;
    const el = descRefs.current.get(pendingFocusId.current);
    if (el) {
      el.focus();
      pendingFocusId.current = null;
    }
  }, [items]);

  function update(id: string, patch: Partial<LineItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function add(focusNew = false) {
    const newItem = makeEmptyItem();
    if (focusNew) pendingFocusId.current = newItem.id;
    onChange([...items, newItem]);
  }

  const gridCols = showHsn
    ? "sm:grid-cols-[1fr_90px_64px_96px_100px_28px]"
    : "sm:grid-cols-[1fr_64px_96px_100px_28px]";

  return (
    <div className="flex flex-col gap-3">
      <div className={cn("hidden gap-2 px-1 text-[11px] font-medium text-text-tertiary sm:grid", gridCols)}>
        <span>Description</span>
        {showHsn && <span>HSN/SAC</span>}
        <span>Qty</span>
        <span>Rate</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      <div className="flex flex-col gap-3 sm:gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
          <div
            key={item.id}
            className={cn(
              "grid grid-cols-2 gap-2 rounded-lg border border-border-subtle p-3 sm:items-start sm:rounded-none sm:border-none sm:p-0",
              gridCols,
            )}
          >
            <div className="col-span-2 sm:col-span-1">
              <Textarea
                ref={(el) => {
                  if (el) descRefs.current.set(item.id, el);
                  else descRefs.current.delete(item.id);
                }}
                value={item.description}
                onChange={(e) => update(item.id, { description: e.target.value })}
                placeholder="Describe the work — press Enter for a new line"
                rows={1}
                className="[field-sizing:content] min-h-[38px] py-2"
              />
            </div>
            {showHsn && (
              <Input
                value={item.hsnSac}
                onChange={(e) => update(item.id, { hsnSac: e.target.value })}
                placeholder="SAC code, e.g. 998314"
                className="font-mono text-xs"
              />
            )}
            <Input
              type="number"
              min={0}
              value={item.quantity}
              onChange={(e) => update(item.id, { quantity: Number(e.target.value) })}
              aria-label="Quantity"
            />
            <Input
              type="number"
              min={0}
              value={item.rate}
              onChange={(e) => update(item.id, { rate: Number(e.target.value) })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isLast) {
                  e.preventDefault();
                  add(true);
                }
              }}
              aria-label="Rate"
            />
            <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:justify-end">
              <span className="text-xs text-text-tertiary sm:hidden">Amount</span>
              <span className="font-mono text-sm">
                {formatCurrency(lineItemAmount(item), currency)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => remove(item.id)}
              disabled={items.length === 1}
              className="col-span-2 flex h-8 items-center justify-center gap-1.5 rounded-md text-xs text-text-tertiary transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:pointer-events-none disabled:opacity-30 sm:col-span-1 sm:size-7 sm:justify-self-end"
              aria-label="Remove item"
            >
              <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                <path
                  d="M3 4h9M6 4V2.5h3V4M4.5 4l.5 8.5h5L11 4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sm:hidden">Remove</span>
            </button>
          </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => add(true)}
        className="self-start"
      >
        <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        Add line item
      </Button>
    </div>
  );
}
