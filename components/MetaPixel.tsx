'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

async function sendServerEvent(eventName: string, eventId: string, customData?: Record<string, unknown>) {
  try {
    await fetch('/api/meta/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        customData,
      }),
    });
  } catch (error) {
    console.error('Error sending server event:', error);
  }
}

export function trackEvent(
  eventName: string,
  customData?: Record<string, unknown>,
  options?: { serverOnly?: boolean }
) {
  const eventId = generateEventId();

  if (!options?.serverOnly && typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, customData, { eventID: eventId });
  }

  sendServerEvent(eventName, eventId, customData);
}

export function trackInitiateCheckout(value?: number, currency = 'EUR') {
  trackEvent('InitiateCheckout', {
    value,
    currency,
    content_name: "Barb'n'Rock Festival 2026",
    content_category: 'Festival Ticket',
  });
}

function MetaPixelContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!PIXEL_ID) return;

    const eventId = generateEventId();
    
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView', undefined, { eventID: eventId });
    }
    
    sendServerEvent('PageView', eventId);
  }, [pathname, searchParams]);

  if (!PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

export default function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelContent />
    </Suspense>
  );
}
