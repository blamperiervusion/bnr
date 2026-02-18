# 🎸 Configuration des Artistes - Guide de mise à jour

## Source unique de vérité

Pour éviter les incohérences entre le site et les supports de communication, toutes les données artistes sont centralisées dans :

### Fichier principal (TypeScript)
```
lib/data/artists-config.ts
```

### Fichier JSON pour les templates HTML
```
communication/artists-data.json
```

---

## 📝 Comment mettre à jour les infos d'un artiste

### 1. Modifier le fichier TypeScript
Édite `lib/data/artists-config.ts` :

```typescript
{
  id: 'shaarghot',
  name: 'Shaârghot',
  displayName: 'SHAÂRGHOT',
  genre: 'Cyber Metal',
  origin: 'Paris',
  day: 'samedi',
  dayDisplay: 'SAMEDI 27 JUIN',
  youtubeVideoId: 'yn4X-OtYOx0',  // <- ID de la vidéo YouTube
  youtubeStartTime: 20,           // <- Début de la vidéo en secondes
  // ...
}
```

### 2. Mettre à jour le JSON
Édite `communication/artists-data.json` avec les mêmes valeurs.

### 3. Mettre à jour le site
Le fichier `lib/data/programme.ts` utilise les mêmes données. Mets-le à jour si nécessaire.

### 4. Mettre à jour les templates vidéo
Édite `communication/templates/video-annonce-artiste.html` → section `presets` :

```javascript
const presets = {
  shaarghot: {
    name: 'SHAÂRGHOT',
    genre: 'Cyber Metal • Paris',
    day: 'SAMEDI 27 JUIN',
    youtube: 'yn4X-OtYOx0',  // <- Même ID
    start: 20
  },
  // ...
}
```

---

## 🎬 Liens YouTube actuels

| Artiste | Video ID | Lien complet |
|---------|----------|--------------|
| Psykup | `sLZQSPiuTfg` | https://youtube.com/watch?v=sLZQSPiuTfg |
| Cachemire | `oXr2HJpIVJU` | https://youtube.com/watch?v=oXr2HJpIVJU |
| Loudblast | `uc6khaqWNV4` | https://youtube.com/watch?v=uc6khaqWNV4 |
| Shaârghot | `yn4X-OtYOx0` | https://youtube.com/watch?v=yn4X-OtYOx0 |
| Akiavel | `nqZ_b2Rk8pE` | https://youtube.com/watch?v=nqZ_b2Rk8pE |
| Krav Boca | ❌ À ajouter | - |
| Dirty Fonzy | ❌ À ajouter | - |
| Breakout | `0iPry24IYuE` | https://youtube.com/watch?v=0iPry24IYuE |
| Mainkind | ❌ À ajouter | - |
| Kami No Ikari | `lNGYQ8-bDN8` | https://youtube.com/watch?v=lNGYQ8-bDN8 |
| Barabbas | ❌ À ajouter | - |
| Black Hazard | `52OamIrdesU` | https://youtube.com/watch?v=52OamIrdesU |

---

## 📋 Checklist quand tu ajoutes un lien YouTube

- [ ] `lib/data/artists-config.ts` - youtubeVideoId
- [ ] `lib/data/programme.ts` - videoUrl
- [ ] `communication/artists-data.json` - youtube
- [ ] `communication/templates/video-annonce-artiste.html` - presets

---

## 📞 Contacts festival

| Type | Valeur |
|------|--------|
| Email | barbnrock.festival@gmail.com |
| Téléphone partenaires | Luc Pouilly - 06 27 81 62 03 |
| Site web | barbnrock-festival.fr |
| Instagram | @barbnrock |

---

## 🔗 Réseaux sociaux des artistes

| Artiste | Facebook | Instagram | Spotify | Site |
|---------|----------|-----------|---------|------|
| Psykup | [Facebook](https://www.facebook.com/psykup) | [Instagram](https://www.instagram.com/psykupmusic/) | [Spotify](https://open.spotify.com/artist/2Z1p4Xmc2Mne50blMUd4cH) | [psykup.net](https://www.psykup.net/) |
| Cachemire | [Facebook](https://www.facebook.com/cachemiremusic/) | - | - | - |
| Kami No Ikari | [Facebook](https://www.facebook.com/kaminoikari.music) | [Instagram](https://www.instagram.com/kaminoikari_music/) | [Spotify](https://open.spotify.com/artist/50w6So1pU1erYm1J3cGxXY) | [kaminoikari.com](https://www.kaminoikari.com/) |
| Barabbas | [Facebook](https://www.facebook.com/BarabbasMusic/) | - | - | - |
| Black Hazard | [Facebook](https://www.facebook.com/BLACKHAZARDBAND/) | - | - | - |
| Shaârghot | [Facebook](https://www.facebook.com/shaarghot/) | [Instagram](https://www.instagram.com/shaarghot/) | [Spotify](https://open.spotify.com/artist/0wxpqCSmhtwnRXoWPoHAcj) | - |
| Loudblast | [Facebook](https://www.facebook.com/Loudblast.official/) | - | [Spotify](https://open.spotify.com/artist/1xK59OXxi2TReP0IGvm0K5) | [loudblast-music.com](https://loudblast-music.com/) |
| Krav Boca | [Facebook](https://www.facebook.com/kravboca) | [Instagram](https://www.instagram.com/kravboca) | [Spotify](https://open.spotify.com/artist/4xFUf1FHVy696Q1JQZMTRj) | [kravboca.com](https://kravboca.com/) |
| Akiavel | [Facebook](https://www.facebook.com/Akiavel) | [Instagram](https://www.instagram.com/akiavel/) | [Spotify](https://open.spotify.com/artist/14M2CyExjuwWrJlJGYvg6T) | [akiavel.com](https://www.akiavel.com/) |
| Dirty Fonzy | [Facebook](https://www.facebook.com/dirtyfonzy/) | [Instagram](https://www.instagram.com/dirty_fonzy/) | - | [Linktree](https://linktr.ee/DirtyFonzy) |
| Breakout | [Facebook](https://www.facebook.com/breakoutpunx/) | [Instagram](https://www.instagram.com/breakout_punk_band/) | - | - |
| Mainkind | ❌ À compléter | ❌ À compléter | - | - |

---

## 🎤 Artistes des éditions précédentes

- Dagoba
- Black Bomb A
- Sidilarsen
- Darcy
- Guerilla Poubelle
- Lofofora
- Les Garçons Bouchers
- Poezie Zero
