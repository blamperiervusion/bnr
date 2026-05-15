const PRINTIFY_API_BASE = 'https://api.printify.com/v1';

function getHeaders() {
  const apiKey = process.env.PRINTIFY_API_KEY;
  if (!apiKey) throw new Error('PRINTIFY_API_KEY is not set');
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

function getShopId() {
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!shopId) throw new Error('PRINTIFY_SHOP_ID is not set');
  return shopId;
}

export interface PrintifyLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
}

export interface PrintifyAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface PrintifyOrderPayload {
  external_id: string;
  label?: string;
  line_items: PrintifyLineItem[];
  shipping_method: number;
  address_to: PrintifyAddress;
}

export async function createPrintifyOrder(payload: PrintifyOrderPayload) {
  const res = await fetch(`${PRINTIFY_API_BASE}/shops/${getShopId()}/orders.json`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Printify createOrder failed: ${res.status} ${error}`);
  }
  return res.json();
}

export async function getPrintifyProducts() {
  const res = await fetch(`${PRINTIFY_API_BASE}/shops/${getShopId()}/products.json`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Printify getProducts failed: ${res.status} ${error}`);
  }
  return res.json();
}

export async function getPrintifyProduct(productId: string) {
  const res = await fetch(`${PRINTIFY_API_BASE}/shops/${getShopId()}/products/${productId}.json`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Printify getProduct failed: ${res.status} ${error}`);
  }
  return res.json();
}
