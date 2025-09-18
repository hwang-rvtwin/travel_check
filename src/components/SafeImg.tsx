"use client";

import { useEffect, useMemo, useState } from "react";

type ImgProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "onError"
>;
type Props = ImgProps & {
  /** 시도할 이미지 경로들(상대경로, 예: /destinations/jp.webp) */
  srcs: string[];
};

export default function SafeImg({ srcs, ...imgProps }: Props) {
  // srcs가 바뀔 때만 새 배열을 만들어 참조 안정성 확보
  const keys = useMemo(() => srcs.filter(Boolean), [srcs]);
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [keys]);

  if (failed || keys.length === 0) return null;

  const handleError = () => {
    setIdx((i) => {
      const next = i + 1;
      if (next >= keys.length) {
        setFailed(true);
        return i;
      }
      return next;
    });
  };

  return <img {...imgProps} src={keys[idx]} onError={handleError} />;
}
