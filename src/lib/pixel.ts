/** Meta (Facebook) Pixel — loaded on every page from src/routes/__root.tsx. */
export const META_PIXEL_ID = "1151387774034954";

/** The standard base code, run once in <head>. Fires PageView on the first load. */
export const metaPixelScript = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;

type Fbq = (cmd: "track", event: string, params?: Record<string, unknown>) => void;

/** Send a standard Meta event (no-op on the server or if the pixel is blocked). */
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (fbq) fbq("track", event, params);
}

/** Like `track`, but only once per browser tab session for `key` (e.g. so a Purchase isn't counted twice). */
export function trackOnce(key: string, event: string, params?: Record<string, unknown>) {
  try {
    const k = `px-${key}`;
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, "1");
  } catch {
    /* storage unavailable — still track */
  }
  track(event, params);
}

/** Record a purchase, then move on — with a short pause so the event is sent before the page changes. */
export function purchaseThenGo(
  key: string,
  params: { value: number; content_name: string },
  nextPath: string,
) {
  trackOnce(key, "Purchase", { ...params, currency: "USD", content_type: "product" });
  setTimeout(() => (window.location.href = nextPath), 400);
}
