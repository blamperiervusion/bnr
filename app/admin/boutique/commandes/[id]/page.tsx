import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import OrderActions from './OrderActions';

export const dynamic = 'force-dynamic';

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400' },
  PAID: { label: 'Payée', color: 'bg-green-500/20 text-green-400' },
  PROCESSING: { label: 'En traitement', color: 'bg-blue-500/20 text-blue-400' },
  SHIPPED: { label: 'Expédiée', color: 'bg-purple-500/20 text-purple-400' },
  DELIVERED: { label: 'Livrée', color: 'bg-gray-500/20 text-gray-400' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-500/20 text-red-400' },
  REFUNDED: { label: 'Remboursée', color: 'bg-orange-500/20 text-orange-400' },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true, variant: true } },
    },
  });

  if (!order) notFound();

  const shippingAddress = JSON.parse(order.shippingAddress);
  const s = statusConfig[order.status] ?? statusConfig.PENDING;
  const hasPrintifyItems = order.items.some((item) => item.product.type === 'PRINTIFY');

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Link href="/admin/boutique/commandes" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Commandes
        </Link>
        <span className="text-gray-600">/</span>
        <h1 className="text-2xl font-bold text-white font-mono">{order.orderNumber}</h1>
        <span className={`px-2 py-1 rounded text-xs font-medium ${s.color}`}>{s.label}</span>
        {order.printifyOrderId && (
          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
            Printify #{order.printifyOrderId}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: order items + actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Articles</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-[#1a1a1a] last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.productName}</p>
                    <p className="text-sm text-gray-400">{item.variantName}</p>
                    {item.product.type === 'PRINTIFY' && (
                      <span className="text-xs text-purple-400">Printify</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white">x{item.quantity}</p>
                    <p className="text-gray-400 text-sm">{Number(item.unitPrice).toFixed(2).replace('.', ',')} € / u.</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-white">
                      {(Number(item.unitPrice) * item.quantity).toFixed(2).replace('.', ',')} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#222] space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span>{Number(order.subtotal).toFixed(2).replace('.', ',')} €</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span>{Number(order.shippingCost).toFixed(2).replace('.', ',')} €</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-[#222]">
                <span>Total</span>
                <span>{Number(order.total).toFixed(2).replace('.', ',')} €</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <OrderActions
            orderId={order.id}
            currentStatus={order.status}
            hasPrintifyItems={hasPrintifyItems}
            alreadySentToPrintify={!!order.printifyOrderId}
          />
        </div>

        {/* Right: customer + shipping */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Client</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-white">{order.customerName}</p>
              <p className="text-gray-400">{order.customerEmail}</p>
              {order.customerPhone && <p className="text-gray-400">{order.customerPhone}</p>}
            </div>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Livraison</h2>
            <div className="text-sm text-gray-400 space-y-1">
              <p>{shippingAddress.line1}</p>
              {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
              <p>{shippingAddress.zip} {shippingAddress.city}</p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>

          {order.stripeSessionId && (
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Paiement</h2>
              <div className="text-sm space-y-1">
                <p className="text-gray-400">Session Stripe</p>
                <p className="font-mono text-xs text-gray-500 break-all">{order.stripeSessionId}</p>
                {order.stripePaymentId && (
                  <>
                    <p className="text-gray-400 mt-2">Payment Intent</p>
                    <p className="font-mono text-xs text-gray-500 break-all">{order.stripePaymentId}</p>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <p className="text-xs text-gray-600">
              Créée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} à {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <p className="text-xs text-gray-600 mt-1">
                Mise à jour le {new Date(order.updatedAt).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
