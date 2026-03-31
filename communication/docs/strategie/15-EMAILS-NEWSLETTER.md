# 📧 Stratégie Emails Newsletter - Barb'n'Rock 2026

## Objectif

Convertir notre liste de diffusion en acheteurs de billets via une séquence de 4 emails stratégiques.

## Liste de diffusion

- **Source** : Anciens festivaliers, inscrits site web, formulaires bénévoles/partenaires
- **Taille estimée** : ~1500 contacts
- **Outil** : À définir (Brevo, Mailchimp, Sendinblue...)

---

## Séquence des 4 emails

### 📧 Email 1 : Save The Date (Février)
**Objet** : `🎸 Save The Date : Barb'n'Rock revient les 26-28 juin 2026`

**Objectif** : Réactiver la base, annoncer les dates, créer l'attente

**Contenu** :
- Dates confirmées : 26-27-28 juin 2026
- Teaser "Une affiche de folie se prépare"
- Rappel concept "2 jours de chaos, 1 jour de repos"
- CTA : "Inscris-toi pour être informé en premier"

**KPIs cibles** :
- Taux d'ouverture : > 35%
- Taux de clic : > 8%

---

### 📧 Email 2 : Ouverture Billetterie (Mars)
**Objet** : `🔥 C'est parti ! Les Early Bird sont ouverts`

**Objectif** : Convertir les plus motivés avec les tarifs préférentiels

**Contenu** :
- Annonce ouverture billetterie
- Tarifs Early Bird (36€ pass 3 jours, 13€ vendredi, 22€ samedi)
- Premiers noms annoncés (têtes d'affiche)
- Rappel : camping GRATUIT
- CTA : "Réserve ta place maintenant"

**KPIs cibles** :
- Taux d'ouverture : > 40%
- Taux de clic : > 15%
- Conversions directes : 50-100 billets

---

### 📧 Email 3 : Affiche Complète (Mai)
**Objet** : `🎤 L'affiche complète est là : 18 groupes sur 3 jours`

**Objectif** : Relancer les indécis avec l'affiche finale

**Contenu** :
- Programme complet jour par jour
- Mise en avant des têtes d'affiche (Loudblast, Shaârghot, Psykup...)
- Nouveautés village (food trucks, tattoo, barbers)
- Horaires d'ouverture
- CTA : "Dernières places Early Bird"

**KPIs cibles** :
- Taux d'ouverture : > 35%
- Taux de clic : > 12%

---

### 📧 Email 4 : Dernière Chance (J-7)
**Objet** : `⚠️ Plus qu'une semaine ! Dernières places disponibles`

**Objectif** : Urgence, convertir les derniers indécis

**Contenu** :
- Compte à rebours J-7
- Rappel que les places se vendent vite
- Infos pratiques (accès, parking, camping)
- Témoignages festivaliers 2025
- CTA : "Réserve maintenant - Dernières places"

**KPIs cibles** :
- Taux d'ouverture : > 45%
- Taux de clic : > 20%

---

## Bonnes pratiques

- **Expéditeur** : "Barb'n'Rock Festival" <contact@barbnrock-festival.fr>
- **Heure d'envoi** : Mardi ou Jeudi, 10h ou 19h
- **Préheader** : Toujours rempli, complémente l'objet
- **Mobile first** : 60%+ des ouvertures sur mobile
- **Désabonnement** : Lien visible et fonctionnel

---

## Templates MJML

Les templates sont disponibles dans `/communication/emails/` :
- `01-save-the-date.mjml`
- `02-ouverture-billetterie.mjml`
- `03-affiche-complete.mjml`
- `04-derniere-chance.mjml`
- `05-tremplin-preventes.mjml` (Journée tremplin + rappel préventes)

Pour compiler en HTML : `npx mjml input.mjml -o output.html`
