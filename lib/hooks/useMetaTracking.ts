'use client';

import { useCallback } from 'react';
import { HELLOASSO_URL } from '@/lib/constants';

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

export function isTicketUrl(url: string): boolean {
  return url.includes('helloasso.com') || 
         url.includes('billetterie') || 
         url === HELLOASSO_URL;
}

export function useMetaTracking() {
  const trackTicketClick = useCallback((url: string) => {
    if (isTicketUrl(url)) {
      trackInitiateCheckout(36);
    }
  }, []);

  const trackCustomEvent = useCallback((eventName: string, customData?: Record<string, unknown>) => {
    trackEvent(eventName, customData);
  }, []);

  return {
    trackTicketClick,
    trackCustomEvent,
    trackInitiateCheckout,
  };
}

export default useMetaTracking;
