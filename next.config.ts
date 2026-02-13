import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  
  // Redirections depuis l'ancien site barbnrock-festival.fr
  async redirects() {
    return [
      // ========================================
      // ANCIEN SITE (sitemap.xml)
      // ========================================
      
      // Programme - anciennes URLs sans sous-dossiers
      { source: '/programme-vendredi', destination: '/programme/vendredi', permanent: true },
      { source: '/programme-samedi', destination: '/programme/samedi', permanent: true },
      { source: '/programme-dimanche', destination: '/programme/dimanche', permanent: true },
      
      // Village barbus → Village
      { source: '/village-barbus', destination: '/village', permanent: true },
      
      // Pages supprimées → Accueil
      { source: '/tremplin', destination: '/', permanent: true },
      { source: '/landing-2026', destination: '/', permanent: true },
      { source: '/a-propos', destination: '/', permanent: true },
      
      // ========================================
      // REDIRECTIONS GÉNÉRIQUES
      // ========================================
      
      // Pages avec extensions (.html, .php)
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/accueil', destination: '/', permanent: true },
      
      // Billetterie
      { source: '/billetterie.html', destination: '/billetterie', permanent: true },
      { source: '/tickets', destination: '/billetterie', permanent: true },
      { source: '/billets', destination: '/billetterie', permanent: true },
      { source: '/reservation', destination: '/billetterie', permanent: true },
      { source: '/reservations', destination: '/billetterie', permanent: true },
      
      // Programme / Lineup
      { source: '/programme', destination: '/programme/vendredi', permanent: true },
      { source: '/programme.html', destination: '/programme/vendredi', permanent: true },
      { source: '/programmation', destination: '/programme/vendredi', permanent: true },
      { source: '/lineup', destination: '/programme/vendredi', permanent: true },
      { source: '/line-up', destination: '/programme/vendredi', permanent: true },
      { source: '/artistes', destination: '/programme/vendredi', permanent: true },
      { source: '/artists', destination: '/programme/vendredi', permanent: true },
      
      // Village / Infos pratiques
      { source: '/village.html', destination: '/village', permanent: true },
      { source: '/infos-pratiques', destination: '/village', permanent: true },
      { source: '/infos', destination: '/village', permanent: true },
      { source: '/informations', destination: '/village', permanent: true },
      { source: '/plan', destination: '/village', permanent: true },
      { source: '/site', destination: '/village', permanent: true },
      
      // Boutique / Merch
      { source: '/boutique.html', destination: '/boutique', permanent: true },
      { source: '/shop', destination: '/boutique', permanent: true },
      { source: '/merch', destination: '/boutique', permanent: true },
      { source: '/merchandising', destination: '/boutique', permanent: true },
      
      // Partenaires
      { source: '/partenaires.html', destination: '/partenaires', permanent: true },
      { source: '/sponsors', destination: '/partenaires', permanent: true },
      { source: '/nos-partenaires', destination: '/partenaires', permanent: true },
      { source: '/partenariat', destination: '/devenir-partenaire', permanent: true },
      
      // Bénévoles
      { source: '/benevoles.html', destination: '/benevoles', permanent: true },
      { source: '/devenir-benevole', destination: '/benevoles', permanent: true },
      { source: '/benevolat', destination: '/benevoles', permanent: true },
      { source: '/volunteer', destination: '/benevoles', permanent: true },
      
      // FAQ / Contact
      { source: '/faq.html', destination: '/faq', permanent: true },
      { source: '/contact', destination: '/faq', permanent: true },
      { source: '/contact.html', destination: '/faq', permanent: true },
      { source: '/questions', destination: '/faq', permanent: true },
      
      // CSE
      { source: '/cse', destination: '/offre-cse', permanent: true },
      { source: '/entreprises', destination: '/offre-cse', permanent: true },
      
      // Jeu concours
      { source: '/concours', destination: '/jeu', permanent: true },
      { source: '/jeu-concours', destination: '/jeu', permanent: true },
    ];
  },
};

export default nextConfig;
