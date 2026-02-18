import Link from 'next/link';

const pdfDocuments = [
  {
    id: 'dossier-presse',
    title: 'Dossier de Presse',
    description: 'Présentation complète du festival pour les médias',
    filename: 'presse/dossier-presse.pdf',
    icon: '📰',
    color: '#E85D04',
  },
  {
    id: 'dossier-partenaires',
    title: 'Dossier Partenaires',
    description: 'Offres de partenariat et avantages',
    filename: 'partenaires/dossier-partenaires.pdf',
    icon: '🤝',
    color: '#00E5CC',
  },
  {
    id: 'dossier-cse',
    title: 'Dossier CSE & Groupes',
    description: 'Offres spéciales pour les comités et groupes',
    filename: 'cse-groupes/dossier-cse-groupes.pdf',
    icon: '👥',
    color: '#38a169',
  },
  {
    id: 'bilan-2025',
    title: 'Bilan 2025',
    description: 'Rapport complet de l\'édition 2025',
    filename: 'bilan/bilan-2025.pdf',
    icon: '📊',
    color: '#e53e3e',
  },
];

const generators = [
  {
    id: 'posts',
    title: 'Générateur de Posts',
    description: '35+ posts prêts à l\'emploi avec captions',
    href: '/admin/ressources/posts',
    icon: '🎨',
    tags: ['Instagram', 'Facebook', 'TikTok'],
  },
  {
    id: 'videos',
    title: 'Générateur Vidéo',
    description: 'Vidéos animées pour Reels et TikTok',
    href: '/admin/ressources/videos',
    icon: '🎬',
    tags: ['Reels', 'TikTok', '9:16'],
  },
  {
    id: 'flyers',
    title: 'Générateur Flyers',
    description: 'Flyers A5 imprimables (Chaos & Famille)',
    href: '/admin/ressources/flyers',
    icon: '📄',
    tags: ['A5', 'Print'],
  },
  {
    id: 'carrousels',
    title: 'Carrousels Artistes',
    description: '5 slides par artiste pour présentation',
    href: '/admin/ressources/carrousels',
    icon: '📸',
    tags: ['Instagram', 'Carrousel', '1080×1350'],
  },
  {
    id: 'carrousels-thematiques',
    title: 'Carrousels Thématiques',
    description: 'Village, animations, accès, best-of',
    href: '/admin/ressources/carrousels-thematiques',
    icon: '🎪',
    tags: ['Instagram', 'Carrousel', 'Infos'],
  },
];

export default function RessourcesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Ressources</h1>
      <p className="text-gray-400 mb-8">
        Documents PDF et outils de génération de visuels
      </p>

      {/* PDF Documents */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>📁</span> Dossiers PDF
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pdfDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#333] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{doc.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                  </div>
                </div>
              </div>
              <a
                href={`/api/admin/resources/download?file=${encodeURIComponent(doc.filename)}`}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: `${doc.color}20`,
                  color: doc.color,
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Télécharger PDF
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Generators */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>🛠️</span> Générateurs de Visuels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {generators.map((gen) => (
            <Link
              key={gen.id}
              href={gen.href}
              className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#00E5CC] hover:shadow-lg hover:shadow-[#00E5CC]/10 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {gen.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {gen.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{gen.description}</p>
              <div className="flex flex-wrap gap-2">
                {gen.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-[#00E5CC]/10 text-[#00E5CC]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
