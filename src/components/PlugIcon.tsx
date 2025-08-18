// src/components/PlugIcon.tsx
import React from "react";

const base = "inline-block rounded border p-2 mr-2 mb-2";

export default function PlugIcon({ type }: { type: string }) {
  switch (type) {
    case "A": // 평평한 두 핀(미·일)
      return (
        <span className={base} title="Type A">
          <svg width="44" height="28" viewBox="0 0 44 28">
            <rect x="6" y="6" width="8" height="16" rx="2" fill="currentColor" />
            <rect x="30" y="6" width="8" height="16" rx="2" fill="currentColor" />
          </svg>
        </span>
      );
    case "B": // A + 접지원형
      return (
        <span className={base} title="Type B">
          <svg width="44" height="28" viewBox="0 0 44 28">
            <rect x="6" y="6" width="8" height="16" rx="2" fill="currentColor" />
            <rect x="30" y="6" width="8" height="16" rx="2" fill="currentColor" />
            <circle cx="22" cy="14" r="3" fill="currentColor" />
          </svg>
        </span>
      );
    case "C": // 원형 두 핀(유럽)
      return (
        <span className={base} title="Type C">
          <svg width="44" height="28" viewBox="0 0 44 28">
            <circle cx="14" cy="14" r="4" fill="currentColor" />
            <circle cx="30" cy="14" r="4" fill="currentColor" />
          </svg>
        </span>
      );
    case "F": // C 타입 + 사이드 접지
      return (
        <span className={base} title="Type F">
          <svg width="44" height="28" viewBox="0 0 44 28">
            <circle cx="14" cy="14" r="4" fill="currentColor" />
            <circle cx="30" cy="14" r="4" fill="currentColor" />
            <rect x="2" y="13" width="6" height="2" fill="currentColor" />
            <rect x="36" y="13" width="6" height="2" fill="currentColor" />
          </svg>
        </span>
      );
    case "G": // 영국 3핀
      return (
        <span className={base} title="Type G">
          <svg width="44" height="28" viewBox="0 0 44 28">
            <rect x="18" y="2" width="8" height="10" rx="1" fill="currentColor" />
            <rect x="6" y="16" width="8" height="10" rx="1" fill="currentColor" />
            <rect x="30" y="16" width="8" height="10" rx="1" fill="currentColor" />
          </svg>
        </span>
      );
    case "I": // 호주 2핀 V자 + 접지
      return (
        <span className={base} title="Type I">
          <svg width="44" height="28" viewBox="0 0 44 28">
            <rect x="10" y="6" width="6" height="14" transform="rotate(-20 10 6)" fill="currentColor" />
            <rect x="28" y="6" width="6" height="14" transform="rotate(20 28 6)" fill="currentColor" />
            <rect x="20" y="16" width="4" height="8" fill="currentColor" />
          </svg>
        </span>
      );
    case "E": // 프랑스(E)
      return (
        <span className={base} title="Type E">
          <svg width="44" height="28" viewBox="0 0 44 28">
            <circle cx="14" cy="14" r="4" fill="currentColor" />
            <circle cx="30" cy="14" r="4" fill="currentColor" />
            <circle cx="22" cy="8" r="2" fill="currentColor" />
          </svg>
        </span>
      );
    case "L": // 이탈리아
      return (
        <span className={base} title="Type L">
          <svg width="44" height="28" viewBox="0 0 44 28">
            <circle cx="12" cy="14" r="3" fill="currentColor" />
            <circle cx="22" cy="14" r="3" fill="currentColor" />
            <circle cx="32" cy="14" r="3" fill="currentColor" />
          </svg>
        </span>
      );
    default:
      return <span className={base}>{type}</span>;
  }
}
