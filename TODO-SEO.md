# TODO - Actions SEO restantes

## Image Open Graph

- [ ] Créer une image `public/images/og-image.jpg`
  - Format : **1200 x 630 pixels** (ratio 1.91:1)
  - Contenu suggéré : affiche du festival ou visuel avec logo + dates
  - Cette image apparaîtra lors des partages sur Facebook, LinkedIn, Twitter, etc.

## Réseaux sociaux

- [ ] Mettre à jour les URLs dans `components/JsonLd.tsx` :

```typescript
sameAs: [
  'https://www.facebook.com/VOTRE_PAGE',    // Remplacer par l'URL réelle
  'https://www.instagram.com/VOTRE_COMPTE', // Remplacer par l'URL réelle
],
```

## Vérifications après mise en production

- [ ] Tester le robots.txt : `https://barnrock-festival.fr/robots.txt`
- [ ] Tester le sitemap : `https://barnrock-festival.fr/sitemap.xml`
- [ ] Soumettre le sitemap à Google Search Console
- [ ] Tester les partages sociaux avec [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Tester les données structurées avec [Google Rich Results Test](https://search.google.com/test/rich-results)

## Optionnel

- [ ] Créer des icônes PWA optimisées (192x192 et 512x512) pour remplacer le logo actuel
- [ ] Ajouter un compte Twitter/X dans les métadonnées si applicable
