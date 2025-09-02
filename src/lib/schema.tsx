// src/lib/schema.tsx
import React from "react";
import type { CountryMeta } from "./countries";

/**
 * App Router에서는 next/head 대신 script 태그를 직접 렌더하세요.
 * suppressHydrationWarning을 넣어야 CSR 시점의 미묘한 차이로 경고가 안 납니다.
 */

function JsonLd({ json }: { json: unknown }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function PackingFAQJsonLd({ country, month }: { country: CountryMeta; month: number }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "이달의 권장 복장은?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${country.nameKo} ${month}월 권장 복장은 페이지 상단 요약을 참고하세요.`,
        },
      },
      {
        "@type": "Question",
        name: "우산/방수는 필요한가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "소나기/강수 가능성이 있으면 방수 자켓·우산을 권장합니다.",
        },
      },
      {
        "@type": "Question",
        name: "전원/충전 팁은?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "멀티어댑터·보조배터리를 준비하고 플러그 타입을 확인하세요.",
        },
      },
    ],
  };
  return <JsonLd json={json} />;
}

export function ItemListJsonLd({
  country,
  month,
  items,
}: {
  country: CountryMeta;
  month: number;
  items: string[];
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
    })),
  };
  return <JsonLd json={json} />;
}

export function BreadcrumbsJsonLd({
  parts,
}: {
  parts: { name: string; href: string }[];
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: parts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      item: p.href,
    })),
  };
  return <JsonLd json={json} />;
}

// src/lib/schema.tsx (하단에 추가)
export function PowerPlugsFAQJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "해외에서 내 전자기기를 바로 사용할 수 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "전압(예: 110V/220–240V), 주파수(50/60Hz), 플러그 타입(A/C/G 등) 3가지를 확인해야 합니다. 기기의 어댑터가 '100–240V, 50/60Hz'로 표기된 프리볼트라면 변환 어댑터(모양만 바꾸는 플러그)만으로 사용할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "A, C, G 플러그 타입은 무엇이 다른가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A형(미국/일본)은 평평한 두 핀, C형(유럽 다수/한국)은 둥근 두 핀, G형(영국/홍콩/싱가포르)은 세모난 3핀 구조입니다. 국가별로 표준 타입이 다르므로 방문국가의 타입에 맞는 어댑터가 필요합니다."
        }
      },
      {
        "@type": "Question",
        "name": "주파수(50Hz/60Hz) 차이가 문제되나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "대부분의 IT 기기(노트북/휴대폰)는 프리볼트라 영향이 미미합니다. 다만 모터·시계 등은 동작 속도나 소음에 차이가 날 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "멀티 어댑터 하나면 전 세계에서 사용 가능한가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "대부분의 멀티 어댑터는 여러 타입을 커버하지만, 접지(B/F/G 등)나 고출력 드라이어류는 제한이 있을 수 있습니다. 프리볼트 여부와 정격 전류(A)도 함께 확인하세요."
        }
      },
      {
        "@type": "Question",
        "name": "드라이어·고데기는 어떻게 해야 하나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "이들 기기는 고출력·비프리볼트인 경우가 많아, 단순 어댑터로는 사용할 수 없습니다. 프리볼트 표기가 없다면 현지용을 사용하거나, 변압기(무겁고 발열)에 의존해야 합니다."
        }
      }
    ]
  };
  return <JsonLd json={json} />;
}
