// src/types/gtag.d.ts
export {};

type GtagConsentState = "default" | "update";
type GtagConsentValue = "granted" | "denied" | string;

type GtagFn = {
  (command: "js", date: Date): void;
  (command: "config", targetId: string, config?: Record<string, unknown>): void;
  (command: "event", eventName: string, params?: Record<string, unknown>): void;
  (command: "consent", state: GtagConsentState, params: Record<string, GtagConsentValue>): void;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}
