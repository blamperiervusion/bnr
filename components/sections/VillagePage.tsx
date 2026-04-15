'use client';

import { motion } from 'framer-motion';
import { SectionTitle, Card } from '@/components/ui';

type StandCategory = 'FOOD' | 'BAR' | 'MERCHANDISING' | 'ARTISANAT' | 'TATTOO' | 'BARBIER' | 'ASSOCIATION' | 'DIVERS';

interface Stand {
  id: string;
  name: string;
  category: StandCategory;
  description: string | null;
  logo: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
}

interface VillagePageProps {
  stands?: Stand[];
}

const categoryConfig: Record<StandCategory, { label: string; emoji: string; description: string }> = {
  FOOD: { label: 'Food Trucks', emoji: '🍔', description: 'De quoi reprendre des forces entre deux concerts !' },
  BAR: { label: 'Bar', emoji: '🍺', description: 'Une sélection de bières belges. De quoi se rafraîchir avec style.' },
  MERCHANDISING: { label: 'Merchandising', emoji: '👕', description: 'T-shirts des groupes, patches, pins, posters, vinyles... Tout pour repartir avec des souvenirs.' },
  ARTISANAT: { label: 'Artisanat', emoji: '⚒️', description: 'Bijoux forgés, accessoires en cuir, créations uniques. Du fait-main par des artisans passionnés.' },
  TATTOO: { label: 'Tatouage & Piercing', emoji: '🖋️', description: 'Tattoo flash et piercing par des pros. Walk-in welcome, hygiène irréprochable.' },
  BARBIER: { label: 'Barbiers', emoji: '💈', description: 'Besoin d\'une coupe fresh ou d\'une barbe taillée au carré ? Nos barbiers sont là.' },
  ASSOCIATION: { label: 'Associations', emoji: '🤝', description: 'Associations locales, culturelles et caritatives. Viens découvrir et soutenir leurs actions.' },
  DIVERS: { label: 'Divers & Curiosités', emoji: '✨', description: 'Stands insolites et découvertes en tout genre. Laisse-toi surprendre !' },
};

const activities = [
  {
    id: 'act-1',
    name: 'Animations',
    description: 'Des animations variées rythmeront les trois jours du festival. Programme détaillé à venir !',
    time: 'Tout le week-end',
    emoji: '🎉',
  },
];

export default function VillagePage({ stands = [] }: VillagePageProps) {
  const standsByCategory = stands.reduce((acc, stand) => {
    if (!acc[stand.category]) {
      acc[stand.category] = [];
    }
    acc[stand.category].push(stand);
    return acc;
  }, {} as Record<StandCategory, Stand[]>);

  const foodStands = standsByCategory.FOOD || [];
  const barStands = standsByCategory.BAR || [];
  const otherCategories: StandCategory[] = ['MERCHANDISING', 'ARTISANAT', 'TATTOO', 'BARBIER', 'ASSOCIATION', 'DIVERS'];
  
  const totalStands = stands.filter(s => !['FOOD', 'BAR'].includes(s.category)).length;
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Aggressive background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-red)]/30 via-[var(--background)] to-[var(--background)]" />
          {/* Diagonal stripes */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                var(--foreground) 0px,
                var(--foreground) 2px,
                transparent 2px,
                transparent 20px
              )`,
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.p 
              className="uppercase tracking-widest mb-4 font-bold"
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 0.1, repeat: Infinity }}
            >
              <span className="text-[var(--accent-cyan)]">⚡</span>
              <span className="text-[var(--accent-red)]"> Zone de chaos organisé </span>
              <span className="text-[var(--accent-cyan)]">⚡</span>
            </motion.p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight text-[var(--foreground)]">
              LE VILLAGE
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-3xl mx-auto">
              {foodStands.length > 0 ? `${foodStands.length} food truck${foodStands.length > 1 ? 's' : ''}` : 'Des food trucks'}, 
              {barStands.length > 0 ? ` ${barStands.length} bar${barStands.length > 1 ? 's' : ''}` : ' un bar'} avec une sélection de bières ultra quali
              {totalStands > 0 && `, et ${totalStands} stand${totalStands > 1 ? 's' : ''} pour flâner entre deux concerts`}.
              <span className="text-[var(--accent-red)]"> No bullshit, que du bon.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Food Trucks & Bar Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle={`${foodStands.length > 0 ? foodStands.length : 'Des'} food truck${foodStands.length !== 1 ? 's' : ''} + ${barStands.length > 0 ? barStands.length : 'un'} bar pour te sustenter`}>
            🔥 BOUFFE & BOISSONS
          </SectionTitle>

          {/* Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 mb-8"
          >
            <Card className="p-8 border-2 border-[var(--accent-orange)] bg-[var(--accent-orange)]/5">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <span className="text-7xl">🍺</span>
                <div className="flex-1">
                  <h3 className="font-display text-3xl text-[var(--foreground)] uppercase">
                    Le Bar du Festival
                  </h3>
                  <p className="text-[var(--accent-orange)] text-sm font-bold uppercase tracking-wider mb-2">
                    Bières belges
                  </p>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    Une sélection de bières belges. De quoi se rafraîchir avec style entre deux pits.
                  </p>
                  {barStands.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {barStands.map((stand) => (
                        <span key={stand.id} className="text-sm bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] px-3 py-1 rounded-full">
                          {stand.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Food trucks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-2 border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <span className="text-7xl">🍔</span>
                <div className="flex-1">
                  <h3 className="font-display text-3xl text-[var(--foreground)] uppercase">
                    Food Trucks
                  </h3>
                  <p className="text-[var(--accent-cyan)] text-sm font-bold uppercase tracking-wider mb-2">
                    Cuisine variée
                  </p>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {foodStands.length > 0 
                      ? `${foodStands.length} food truck${foodStands.length > 1 ? 's' : ''} pour reprendre des forces entre deux concerts !`
                      : 'Plusieurs food trucks seront présents pour vous proposer une cuisine variée.'
                    }
                  </p>
                  {foodStands.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      {foodStands.map((stand) => (
                        <motion.a
                          key={stand.id}
                          href={stand.website || stand.instagram || stand.facebook || undefined}
                          target={stand.website || stand.instagram || stand.facebook ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          className="bg-[var(--background)]/50 border border-[var(--border)] rounded-lg p-4 text-center hover:border-[var(--accent-cyan)] transition-colors"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={stand.logo || '/images/placeholder-stand.png'} 
                            alt={stand.name} 
                            className="w-full h-16 object-contain mb-2" 
                          />
                          <p className="font-bold text-white text-sm">{stand.name}</p>
                          {stand.description && (
                            <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">{stand.description}</p>
                          )}
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stands Section */}
      <section className="py-20 px-4 bg-[var(--muted)]/30">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle={totalStands > 0 ? `${totalStands} stand${totalStands > 1 ? 's' : ''} pour flâner et découvrir` : 'Des stands pour flâner et découvrir'}>
            💀 LES STANDS
          </SectionTitle>

          <div className="space-y-12 mt-12">
            {otherCategories.map((categoryKey, catIndex) => {
              const categoryStands = standsByCategory[categoryKey] || [];
              const config = categoryConfig[categoryKey];
              
              if (categoryStands.length === 0) return null;
              
              return (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{config.emoji}</span>
                    <div>
                      <h3 className="font-display text-2xl text-[var(--foreground)] uppercase">
                        {config.label}
                      </h3>
                      <p className="text-[var(--accent-cyan)] text-sm font-bold">
                        {categoryStands.length} stand{categoryStands.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryStands.map((stand, index) => (
                      <motion.a
                        key={stand.id}
                        href={stand.website || stand.instagram || stand.facebook || undefined}
                        target={stand.website || stand.instagram || stand.facebook ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg p-4 text-center hover:border-[var(--accent-cyan)] transition-all group cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={stand.logo || '/images/placeholder-stand.png'} 
                          alt={stand.name} 
                          className="w-full h-20 object-contain mb-3" 
                        />
                        <p className="font-bold text-white text-sm group-hover:text-[var(--accent-cyan)] transition-colors">
                          {stand.name}
                        </p>
                        {stand.description && (
                          <p className="text-xs text-[var(--muted-foreground)] mt-2 line-clamp-2">
                            {stand.description}
                          </p>
                        )}
                        {(stand.instagram || stand.facebook || stand.website) && (
                          <div className="flex justify-center gap-2 mt-3 text-gray-500">
                            {stand.website && <span title="Site web">🌐</span>}
                            {stand.instagram && <span title="Instagram">📷</span>}
                            {stand.facebook && <span title="Facebook">📘</span>}
                          </div>
                        )}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {totalStands === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <span className="text-6xl block mb-4">🏕️</span>
              <p className="text-[var(--muted-foreground)]">
                Liste complète des exposants disponible prochainement !
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Parce que le festival c'est pas que de la musique">
            🤘 ANIMATIONS
          </SectionTitle>

          <div className="mt-12 space-y-6">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="group"
              >
                <div className="flex items-center gap-6 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent-red)] transition-all">
                  <motion.span 
                    className="text-5xl"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {activity.emoji}
                  </motion.span>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl text-[var(--foreground)] uppercase group-hover:text-[var(--accent-red)] transition-colors">
                      {activity.name}
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-[var(--accent-red)] text-white px-4 py-2 rounded-full font-bold text-sm uppercase">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map / Location hint */}
      <section className="py-20 px-4 bg-gradient-to-b from-[var(--muted)]/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[var(--muted)]/50 border-2 border-dashed border-[var(--border)] rounded-2xl p-12"
          >
            <span className="text-6xl mb-6 block">🗺️</span>
            <h2 className="font-display text-3xl text-[var(--foreground)] mb-4">
              PLAN DU VILLAGE
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Le plan détaillé du village sera disponible à l&apos;entrée du festival. 
              En attendant, laisse-toi guider par l&apos;odeur des burgers et le son des amplis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-[var(--muted)] px-4 py-2 rounded-full">
                📍 Entrée principale → Food trucks
              </span>
              <span className="bg-[var(--muted)] px-4 py-2 rounded-full">
                📍 Côté scène → Stands artisans
              </span>
              <span className="bg-[var(--muted)] px-4 py-2 rounded-full">
                📍 Zone chill → Buvette & tattoo
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Engagements Section */}
      <section className="py-20 px-4 bg-[var(--muted)]/30">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Un festival responsable et solidaire">
            🌱 NOS ENGAGEMENTS
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full border-l-4 border-l-[var(--accent-cyan)]">
                <span className="text-4xl mb-4 block">♻️</span>
                <h3 className="font-display text-xl text-[var(--foreground)] uppercase mb-2">
                  Tri & Consigne
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                  Écocups, tri sélectif, et grâce au Fourgon, toutes nos boissons sont en verre consigné, 
                  livrées et reprises en véhicule électrique.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 h-full border-l-4 border-l-[var(--accent-orange)]">
                <span className="text-4xl mb-4 block">👜</span>
                <h3 className="font-display text-xl text-[var(--foreground)] uppercase mb-2">
                  Réutilisation
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                  Nos anciennes bâches sont transformées en merchandising par la maroquinière Raev. 
                  Rien ne se perd !
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full border-l-4 border-l-[var(--accent-red)]">
                <span className="text-4xl mb-4 block">💝</span>
                <h3 className="font-display text-xl text-[var(--foreground)] uppercase mb-2">
                  10% Solidaires
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                  Tous engagés ! Chaque année, les stands du village reversent 10% de leurs ventes 
                  à une association caritative.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 h-full border-l-4 border-l-[var(--accent-cyan)]">
                <span className="text-4xl mb-4 block">🎸</span>
                <h3 className="font-display text-xl text-[var(--foreground)] uppercase mb-2">
                  50% Hauts-de-France
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                  La moitié de notre programmation vient de la région. On soutient la scène locale !
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Warning / Rules */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 rounded-lg p-6 text-center"
          >
            <p className="text-[var(--foreground)] font-bold uppercase tracking-wider mb-2">
              ⚠️ Règles du Village
            </p>
            <p className="text-[var(--muted-foreground)] text-sm">
              Respecte les artisans et les bénévoles. Pas de comportement de merde. 
              L&apos;alcool c&apos;est cool mais avec modération. Et surtout : <span className="text-[var(--accent-red)]">ENJOY THE CHAOS.</span>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
