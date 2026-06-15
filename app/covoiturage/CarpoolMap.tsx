'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type MapOffer = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  type: 'DRIVER' | 'PASSENGER';
  seats: number | null;
  days: string[];
};

// Fix Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const passengerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const festivalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DAY_LABELS: Record<string, string> = {
  vendredi: 'Vendredi 26',
  samedi: 'Samedi 27',
  dimanche: 'Dimanche 28',
};

// Crèvecœur-le-Grand coordinates
const FESTIVAL_LAT = 49.6058;
const FESTIVAL_LNG = 2.0832;

function RecenterOnOffers({ offers }: { offers: MapOffer[] }) {
  const map = useMap();
  useEffect(() => {
    const points: [number, number][] = [
      [FESTIVAL_LAT, FESTIVAL_LNG],
      ...offers.filter(o => o.lat && o.lng).map(o => [o.lat, o.lng] as [number, number]),
    ];
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    }
  }, [map, offers]);
  return null;
}

export default function CarpoolMap({
  offers,
  onMarkerClick,
}: {
  offers: MapOffer[];
  onMarkerClick?: (id: string) => void;
}) {
  const geoOffers = offers.filter(o => o.lat != null && o.lng != null);

  return (
    <MapContainer
      center={[FESTIVAL_LAT, FESTIVAL_LNG]}
      zoom={8}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterOnOffers offers={geoOffers} />

      {/* Festival marker */}
      <Marker position={[FESTIVAL_LAT, FESTIVAL_LNG]} icon={festivalIcon}>
        <Popup>
          <strong>🤘 Barb&apos;n&apos;Rock 2026</strong><br />
          Crèvecœur-le-Grand<br />
          26-28 juin 2026
        </Popup>
      </Marker>

      {/* Offer markers */}
      {geoOffers.map(offer => (
        <Marker
          key={offer.id}
          position={[offer.lat, offer.lng]}
          icon={offer.type === 'DRIVER' ? driverIcon : passengerIcon}
          eventHandlers={{ click: () => onMarkerClick?.(offer.id) }}
        >
          <Popup>
            <strong>{offer.type === 'DRIVER' ? '🚗 Conducteur' : '🙋 Passager'}</strong><br />
            <strong>{offer.name}</strong> — {offer.city}<br />
            {offer.type === 'DRIVER' && offer.seats && (
              <span>{offer.seats} place{offer.seats > 1 ? 's' : ''}<br /></span>
            )}
            {offer.days.map(d => DAY_LABELS[d] ?? d).join(', ')}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
