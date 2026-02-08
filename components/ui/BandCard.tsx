'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface BandCardProps {
    name: string;
    time?: string;
    description: string;
    imageUrl?: string;
    videoUrl?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        instagram?: string;
        spotify?: string;
    };
    showTime?: boolean;
}

function getYouTubeEmbedUrl(url: string): string {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
}

export default function BandCard({
    name,
    time,
    description,
    imageUrl,
    videoUrl,
    socialLinks,
    showTime = false
}: BandCardProps) {
    const [showVideo, setShowVideo] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const videoModal = (
        <AnimatePresence>
            {showVideo && videoUrl && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/90"
                        onClick={() => setShowVideo(false)}
                    />

                    {/* Modal content */}
                    <motion.div
                        className="relative z-10 w-full max-w-4xl bg-[var(--background)] rounded-xl overflow-hidden border border-[var(--border)]"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center hover:bg-[var(--accent-red)] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Video embed */}
                        <div className="aspect-video">
                            <iframe
                                src={getYouTubeEmbedUrl(videoUrl)}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        {/* Band info */}
                        <div className="p-6">
                            <h3 className="font-display text-3xl uppercase tracking-wider text-[var(--accent-red)] mb-2">
                                {name}
                            </h3>
                            <p className="text-[var(--muted-foreground)] mb-4">
                                {description}
                            </p>
                            <div className="flex items-center gap-4 flex-wrap">
                                {time && (
                                    <span className="text-sm text-[var(--accent-cyan)]">
                                        {time}
                                    </span>
                                )}
                                {socialLinks?.spotify && (
                                    <a
                                        href={socialLinks.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                        </svg>
                                        Écouter sur Spotify
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {mounted && createPortal(videoModal, document.body)}
        <motion.div
            className="group relative bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* VHS/Glitch overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-red)]/10 via-transparent to-[var(--accent-pink)]/10" />
                <div className="scanlines absolute inset-0" />
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--accent-red)] to-[var(--accent-cyan)] flex items-center justify-center">
                            <span className="text-4xl font-display text-white/80">
                                {name.charAt(0)}
                            </span>
                        </div>
                    )}
                    {/* Time badge */}
                    {showTime && time && (
                        <div className="absolute top-2 left-2 bg-[var(--accent-red)] px-3 py-1 rounded">
                            <span className="text-sm font-bold text-white">{time}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                    <h3 className="text-2xl font-display uppercase tracking-wider text-[var(--foreground)] group-hover:text-[var(--accent-red)] transition-colors mb-3">
                        {name}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-3 mb-4">
                        {description}
                    </p>

                    {/* Social links and video */}
                    <div className="flex gap-3 items-center">
                        {videoUrl && (
                            <button
                                onClick={() => setShowVideo(true)}
                                className="flex items-center gap-2 bg-[var(--accent-red)] hover:bg-[var(--accent-red-dark)] text-white px-3 py-1.5 rounded text-sm font-bold transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Voir le clip
                            </button>
                        )}
                        {socialLinks?.website && (
                            <a
                                href={socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                                aria-label={`Site web de ${name}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </a>
                        )}
                        {socialLinks?.facebook && (
                            <a
                                href={socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                                aria-label={`Facebook de ${name}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        )}
                        {socialLinks?.instagram && (
                            <a
                                href={socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                                aria-label={`Instagram de ${name}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        )}
                        {socialLinks?.spotify && (
                            <a
                                href={socialLinks.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                                aria-label={`Spotify de ${name}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-red)] via-[var(--accent-cyan)] to-[var(--accent-red)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        </>
    );
}
