// src/components/PackingChecklist.tsx
"use client";
import { useState } from "react";

export type ChecklistGroupKey = "상의"|"하의"|"겉옷"|"신발"|"액세서리"|"전자/전력"|"의약/위생"|"문서/금융"|"기타";
export interface ChecklistItem { label: string; qty?: number; }
export type ChecklistData = Record<ChecklistGroupKey, ChecklistItem[]>;

export default function PackingChecklist({ data }: { data: ChecklistData }) {
  const [open, setOpen] = useState<Record<ChecklistGroupKey, boolean>>({
    "상의": true,"하의": true,"겉옷": true,"신발": true,
    "액세서리": true,"전자/전력": true,"의약/위생": true,"문서/금융": true,"기타": true
  });
  const [items, setItems] = useState(data);

  return (
    <div className="space-y-4">
      {Object.entries(items).map(([group, list]) => {
        const g = group as ChecklistGroupKey;
        return (
          <div key={g} className="border rounded-xl p-3">
            <button className="w-full text-left font-semibold" onClick={()=>setOpen(o=>({...o,[g]:!o[g]}))}>
              {g}
            </button>
            {open[g] && (
              <ul className="mt-2 space-y-2">
                {list.map((it, idx)=>(
                  <li key={idx} className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-black" />
                      <span>{it.label}</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <button aria-label="decrease" className="px-2 border rounded"
                        onClick={()=>setItems(prev=>{
                          const copy = structuredClone(prev);
                          const v = Math.max(0,(copy[g][idx].qty ?? 1)-1);
                          copy[g][idx].qty = v; return copy;
                        })}>-</button>
                      <span className="w-6 text-center">{it.qty ?? 1}</span>
                      <button aria-label="increase" className="px-2 border rounded"
                        onClick={()=>setItems(prev=>{
                          const copy = structuredClone(prev);
                          const v = (copy[g][idx].qty ?? 1)+1;
                          copy[g][idx].qty = v; return copy;
                        })}>+</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
