'use client';

interface FormattedDateProps {
  date: Date | string;
  format?: 'short' | 'long';
}

export default function FormattedDate({ date, format = 'short' }: FormattedDateProps) {
  const d = new Date(date);
  
  if (format === 'long') {
    return (
      <span suppressHydrationWarning>
        {d.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </span>
    );
  }
  
  return (
    <span suppressHydrationWarning>
      {d.toLocaleDateString('fr-FR')}
    </span>
  );
}
