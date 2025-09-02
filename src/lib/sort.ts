// src/lib/sort.ts
export const koCollator = new Intl.Collator("ko-KR", {
  usage: "sort",
  sensitivity: "base",
  numeric: true,
});

export const sortKo =
  <T,>(picker: (x: T) => string | undefined | null) =>
  (a: T, b: T) => koCollator.compare(picker(a) ?? "", picker(b) ?? "");
