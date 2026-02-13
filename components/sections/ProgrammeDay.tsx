'use client';

import { BandCard, Button, SectionTitle } from '@/components/ui';
import { DayProgramme, programme } from '@/lib/data/programme';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HELLOASSO_URL } from '@/lib/constants';

interface ProgrammeDayProps {
    dayData: DayProgramme;
}

export default function ProgrammeDay({ dayData }: ProgrammeDayProps) {
    const currentIndex = programme.findIndex(d => d.slug === dayData.slug);
    const prevDay = currentIndex > 0 ? programme[currentIndex - 1] : null;
    const nextDay = currentIndex < programme.length - 1 ? programme[currentIndex + 1] : null;

    // Sort bands by order
    const sortedBands = [...dayData.bands].sort((a, b) => a.order - b.order);

    return (
        <div className="pt-24 pb-16">
            {/* Hero section */}
            <section className="relative py-20 px-4 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-red)]/10 via-transparent to-transparent" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <p className="text-[var(--accent-red)] uppercase tracking-widest mb-4">
                            Programme du festival
                        </p>
                        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight text-[var(--foreground)]">
                            {dayData.day.toUpperCase()}
                        </h1>
                        <p className="text-2xl md:text-3xl text-[var(--muted-foreground)] mt-4 font-display">
                            {dayData.date}
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-[var(--muted)] px-4 py-2 rounded-full">
                            <span className="w-2 h-2 bg-[var(--accent-red)] rounded-full animate-pulse" />
                            <span className="text-sm text-[var(--foreground)]">
                                Ouverture des portes : {dayData.openingTime}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Day navigation */}
            <section className="px-4 py-8 border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center gap-4 flex-wrap">
                        {programme.map((day) => (
                            <Link
                                key={day.slug}
                                href={`/programme/${day.slug}`}
                                className={`px-6 py-3 rounded-full font-display text-lg uppercase tracking-wider transition-all ${day.slug === dayData.slug
                                        ? 'bg-[var(--accent-red)] text-white'
                                        : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent-red)]/20'
                                    }`}
                            >
                                {day.day}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <SectionTitle align="left">
                        Line-up
                    </SectionTitle>

                    {/* Timeline visualization */}
                    <div className="relative mt-12">
                        {/* Vertical line */}
                        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-red)] via-[var(--accent-cyan)] to-[var(--accent-red)]" />

                        {/* Bands */}
                        <div className="space-y-8">
                            {sortedBands.map((band, index) => (
                                <motion.div
                                    key={band.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-12 md:pl-20"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-2 md:left-6 top-6 w-4 h-4 rounded-full bg-[var(--accent-red)] border-4 border-[var(--background)] z-10">
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-[var(--accent-red)]"
                                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                        />
                                    </div>

                                    <BandCard
                                        name={band.name}
                                        time={band.time}
                                        description={band.description}
                                        imageUrl={band.imageUrl}
                                        videoUrl={band.videoUrl}
                                        socialLinks={band.socialLinks}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation between days */}
            <section className="py-12 px-4 border-t border-[var(--border)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    {prevDay ? (
                        <Link
                            href={`/programme/${prevDay.slug}`}
                            className="group flex items-center gap-3 text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            <div>
                                <span className="text-sm block">Jour précédent</span>
                                <span className="font-display text-xl text-[var(--foreground)]">{prevDay.day}</span>
                            </div>
                        </Link>
                    ) : (
                        <div />
                    )}

                    <Button href={HELLOASSO_URL} external size="sm">
                        Réserver
                    </Button>

                    {nextDay ? (
                        <Link
                            href={`/programme/${nextDay.slug}`}
                            className="group flex items-center gap-3 text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors text-right"
                        >
                            <div>
                                <span className="text-sm block">Jour suivant</span>
                                <span className="font-display text-xl text-[var(--foreground)]">{nextDay.day}</span>
                            </div>
                            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4-4m4 4H3" />
                            </svg>
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </section>
        </div>
    );
}
