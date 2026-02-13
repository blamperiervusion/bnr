'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { SectionTitle, Accordion, Button } from '@/components/ui';
import { faqItems, getAllCategories } from '@/lib/data/faq';
import { HELLOASSO_URL } from '@/lib/constants';

export default function FAQPage() {
  const categories = getAllCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredItems = activeCategory
    ? faqItems.filter(item => item.category === activeCategory)
    : faqItems;

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-cyan)]/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[var(--accent-cyan)] uppercase tracking-widest mb-4">
              Besoin d&apos;aide ?
            </p>
            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--foreground)]">
              FAQ
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-2xl mx-auto">
              Retrouve toutes les réponses à tes questions sur le festival, 
              la billetterie, le camping et bien plus encore.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filters */}
      <section className="py-8 px-4 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'bg-[var(--accent-red)] text-white'
                  : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent-red)]/20'
              }`}
            >
              Toutes les questions
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-[var(--accent-red)] text-white'
                    : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent-red)]/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeCategory || 'all'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeCategory && (
              <h2 className="font-display text-3xl text-[var(--foreground)] mb-8 text-center">
                {activeCategory}
              </h2>
            )}
            <Accordion items={filteredItems} />
          </motion.div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 px-4 bg-[var(--muted)]/20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-6xl mb-4 block">🤔</span>
            <h2 className="font-display text-3xl text-[var(--foreground)] mb-4">
              Tu n&apos;as pas trouvé ta réponse ?
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8">
              Pas de panique ! Notre équipe est là pour t&apos;aider. 
              Contacte-nous directement et on te répondra au plus vite.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="mailto:barbnrock.festival@gmail.com"
                variant="primary"
              >
                📧 Nous contacter
              </Button>
              <Button
                href="https://facebook.com/barbnrock"
                external
                variant="outline"
              >
                💬 Messenger
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Liens rapides">
            Ça peut t&apos;intéresser
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: 'Billetterie',
                description: 'Réserve tes places pour le festival',
                href: HELLOASSO_URL,
                emoji: '🎫',
                external: true,
              },
              {
                title: 'Programme',
                description: 'Découvre la programmation complète',
                href: '/programme/samedi',
                emoji: '🎸',
              },
              {
                title: 'Bénévolat',
                description: 'Rejoins l\'équipe du festival',
                href: '/benevoles',
                emoji: '🤝',
              },
            ].map((link, index) => (
              <motion.a
                key={link.title}
                href={link.href}
                target={'external' in link && link.external ? '_blank' : undefined}
                rel={'external' in link && link.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="block p-6 bg-[var(--muted)]/30 border border-[var(--border)] rounded-lg hover:border-[var(--accent-red)] transition-colors"
              >
                <span className="text-4xl block mb-4">{link.emoji}</span>
                <h3 className="font-bold text-[var(--foreground)] mb-2">{link.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{link.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
