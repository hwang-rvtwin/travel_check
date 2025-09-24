'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

type SectionKey =
  | '상의'
  | '하의'
  | '겉옷'
  | '신발'
  | '액세서리'
  | '전자/전력'
  | '의약/위생'
  | '문서/금융'
  | '기타';

export type CheckItem = { label: string; checked?: boolean };
export type ChecklistData = Record<SectionKey, CheckItem[]>;

const SECTION_ORDER: SectionKey[] = [
  '상의',
  '하의',
  '겉옷',
  '신발',
  '액세서리',
  '전자/전력',
  '의약/위생',
  '문서/금융',
  '기타',
];

export default function EditableChecklist({
  initialData,
  storageKey,
}: {
  initialData: ChecklistData;
  storageKey: string;
}) {
  const [data, setData] = useState<ChecklistData>(initialData);
  const [editing, setEditing] = useState<{ section: SectionKey; index: number } | null>(null);
  const [draft, setDraft] = useState<string>('');
  const [newItemDraft, setNewItemDraft] = useState<Record<SectionKey, string>>(
    () => Object.fromEntries(SECTION_ORDER.map(s => [s, ''])) as Record<SectionKey, string>
  );

  // Load from localStorage (once)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ChecklistData;
        // 간단한 타입 검증
        if (parsed && typeof parsed === 'object') {
          setData(prev => {
            // 섹션 누락 방지: initialData 키를 기준으로 보정
            const merged = { ...prev };
            (Object.keys(prev) as SectionKey[]).forEach(k => {
              merged[k] = Array.isArray(parsed[k]) ? parsed[k] : prev[k];
            });
            return merged;
          });
        }
      }
    } catch {
      // 무시 (깨진 저장본)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // 저장 불가시 무시
    }
  }, [data, storageKey]);

  const addItem = (section: SectionKey) => {
    const label = newItemDraft[section]?.trim();
    if (!label) return;
    setData(prev => {
      const exists = prev[section].some(i => i.label.toLowerCase() === label.toLowerCase());
      if (exists) return prev;
      return {
        ...prev,
        [section]: [...prev[section], { label, checked: false }],
      };
    });
    setNewItemDraft(d => ({ ...d, [section]: '' }));
  };

  const startEdit = (section: SectionKey, index: number, current: string) => {
    setEditing({ section, index });
    setDraft(current);
  };

  const commitEdit = () => {
    if (!editing) return;
    const label = draft.trim();
    if (!label) return cancelEdit();
    setData(prev => {
      const sectionItems = [...prev[editing.section]];
      // 중복 체크(자기 자신 제외)
      const dup = sectionItems.some((v, i) => i !== editing.index && v.label.toLowerCase() === label.toLowerCase());
      if (dup) return prev;
      sectionItems[editing.index] = { ...sectionItems[editing.index], label };
      return { ...prev, [editing.section]: sectionItems };
    });
    setEditing(null);
    setDraft('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft('');
  };

  const removeItem = (section: SectionKey, index: number) => {
    setData(prev => {
      const sectionItems = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: sectionItems };
    });
  };

  const toggleCheck = (section: SectionKey, index: number) => {
    setData(prev => {
      const sectionItems = [...prev[section]];
      const it = sectionItems[index];
      sectionItems[index] = { ...it, checked: !it.checked };
      return { ...prev, [section]: sectionItems };
    });
  };

  const sectionKeys = useMemo(() => SECTION_ORDER.filter(k => k in data), [data]);

  return (
    <div className="space-y-6">
      {sectionKeys.map(section => (
        <section key={section} className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">{section}</h3>
            <div className="flex items-center gap-2">
              <input
                value={newItemDraft[section]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewItemDraft(d => ({ ...d, [section]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addItem(section);
                }}
                placeholder="항목 추가"
                className="h-8 w-40 rounded-md border border-slate-200 bg-white px-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-300"
                aria-label={`${section} 항목 추가 입력`}
              />
              <button
                onClick={() => addItem(section)}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-sky-600 px-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-700"
                aria-label={`${section} 항목 추가`}
              >
                <Icon name="plus" className="h-3.5 w-3.5 text-white" />
                추가
              </button>
            </div>
          </div>

          {/* 목록 */}
          <ul className="space-y-2">
            {data[section].map((item, idx) => {
              const isEditing = editing?.section === section && editing.index === idx;
              return (
                <li key={`${item.label}-${idx}`} className="group flex items-center justify-between rounded-md bg-white px-3 py-2 ring-1 ring-slate-200">
                  <div className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!item.checked}
                      onChange={() => toggleCheck(section, idx)}
                      className="h-4 w-4 accent-sky-600"
                      aria-label={`${section} ${item.label} 체크박스`}
                    />
                    {isEditing ? (
                      <input
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-sky-300"
                        aria-label={`${section} 항목 편집 입력`}
                      />
                    ) : (
                      <span
                        className={`min-w-0 truncate text-sm ${item.checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}
                        title={item.label}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>

                  <div className="ml-3 flex items-center gap-1.5">
                    {isEditing ? (
                      <>
                        <IconButton title="저장" onClick={commitEdit}>
                          <Icon name="check" className="h-4 w-4" />
                        </IconButton>
                        <IconButton title="취소" onClick={cancelEdit}>
                          <Icon name="x" className="h-4 w-4" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton title="수정" onClick={() => startEdit(section, idx, item.label)}>
                          <Icon name="edit" className="h-4 w-4" />
                        </IconButton>
                        <IconButton title="삭제" onClick={() => removeItem(section, idx)}>
                          <Icon name="trash" className="h-4 w-4" />
                        </IconButton>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
            {data[section].length === 0 && (
              <li className="rounded-md border border-dashed border-slate-200 p-3 text-center text-xs text-slate-500">
                항목이 없습니다. 위 입력창으로 추가하세요.
              </li>
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
      aria-label={title}
    >
      {children}
    </button>
  );
}

function Icon({ name, className }: { name: 'plus' | 'edit' | 'trash' | 'check' | 'x'; className?: string }) {
  switch (name) {
    case 'plus':
      return (
        <svg viewBox="0 0 20 20" className={className} aria-hidden>
          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'edit':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M14.06 6.19l3.75 3.75" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'trash':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 20 20" className={className} aria-hidden>
          <path d="M6 10l3 3 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 20 20" className={className} aria-hidden>
          <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}
