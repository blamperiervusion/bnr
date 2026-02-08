'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return null;
  }

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Secondes', value: timeLeft.seconds },
  ];

  return (
    <div className={`flex justify-center gap-4 md:gap-8 ${className}`}>
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div
            className="relative"
            key={unit.value}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="
              w-16 h-16 md:w-24 md:h-24 
              bg-[var(--muted)] 
              border-2 border-[var(--accent-red)]
              rounded-lg
              flex items-center justify-center
              shadow-[0_0_20px_rgba(220,38,38,0.3)]
            ">
              <span className="text-2xl md:text-4xl font-display text-[var(--foreground)]">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            {/* Flame effect on top */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-t from-[var(--accent-red)] to-transparent opacity-50 blur-sm rounded-full" />
          </motion.div>
          <span className="text-xs md:text-sm text-[var(--muted-foreground)] uppercase tracking-wider mt-2 block">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
