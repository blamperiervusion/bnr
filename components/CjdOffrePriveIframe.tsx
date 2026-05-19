'use client';

import { useCallback, useRef } from 'react';

const IFRAME_SRC = '/offre-privee/cjd-mecene.html';

export default function CjdOffrePriveIframe() {
  const ref = useRef<HTMLIFrameElement>(null);

  const resize = useCallback(() => {
    const iframe = ref.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentWindow?.document;
      if (!doc?.documentElement) return;
      const h = Math.max(
        doc.documentElement.scrollHeight,
        doc.body?.scrollHeight ?? 0
      );
      if (h > 0) iframe.style.height = `${h + 24}px`;
    } catch {
      iframe.style.height = '5600px';
    }
  }, []);

  return (
    <iframe
      ref={ref}
      title="Offre mécène CJD Amiens — Barb'n'Rock Festival 2026"
      src={IFRAME_SRC}
      onLoad={resize}
      className="w-full max-w-[100vw] border-0 bg-white block"
      style={{ minHeight: '600px', height: '5600px' }}
    />
  );
}
