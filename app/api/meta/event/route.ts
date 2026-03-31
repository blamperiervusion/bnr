import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN;
const API_VERSION = 'v18.0';

interface EventData {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  customData?: Record<string, unknown>;
  userEmail?: string;
  userPhone?: string;
}

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return '0.0.0.0';
}

export async function POST(request: NextRequest) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Meta Pixel not configured' },
      { status: 200 }
    );
  }

  try {
    const body: EventData = await request.json();
    const { eventName, eventId, eventSourceUrl, customData, userEmail, userPhone } = body;

    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';
    const fbp = request.cookies.get('_fbp')?.value;
    const fbc = request.cookies.get('_fbc')?.value;

    const userData: Record<string, string> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };

    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;
    if (userEmail) userData.em = hashData(userEmail);
    if (userPhone) userData.ph = hashData(userPhone);
    userData.country = hashData('fr');

    const eventData: Record<string, unknown> = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: userData,
    };

    if (customData && Object.keys(customData).length > 0) {
      eventData.custom_data = customData;
    }

    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [eventData],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta Conversions API error:', result);
      return NextResponse.json(
        { error: 'Failed to send event', details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error sending Meta event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
