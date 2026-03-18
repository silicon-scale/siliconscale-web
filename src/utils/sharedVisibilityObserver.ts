type VisibilityCallback = (isVisible: boolean) => void;

type Entry = {
  cb: VisibilityCallback;
};

// One shared observer to avoid per-component instances.
// Threshold 0 is enough for pause/resume gating.
let sharedObserver: IntersectionObserver | null = null;
const entriesByElement = new Map<Element, Entry>();

function ensureObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const reg = entriesByElement.get(entry.target);
        if (!reg) continue;
        reg.cb(Boolean(entry.isIntersecting));
      }
    },
    { threshold: 0 },
  );
  return sharedObserver;
}

export function observeVisibility(el: Element, cb: VisibilityCallback): () => void {
  const obs = ensureObserver();
  entriesByElement.set(el, { cb });
  obs.observe(el);
  return () => {
    entriesByElement.delete(el);
    try {
      obs.unobserve(el);
    } catch {
      // no-op: element may already be gone
    }
    if (entriesByElement.size === 0) {
      obs.disconnect();
      sharedObserver = null;
    }
  };
}

