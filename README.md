# Nostalgie · IDENT

Outil interne de reconnaissance d'artistes à partir d'une photo, pour Nostalgie CI (101.1 FM).
Fonctionne **entièrement dans le navigateur** (face-api.js) : aucune photo n'est envoyée sur un serveur, aucune clé API, aucun coût.

## Ouvrir dans VS Code

1. Télécharge ce dossier `nostalgie-ident/`.
2. Dans VS Code : **Fichier → Ouvrir le dossier…** → sélectionne `nostalgie-ident`.
3. Pour prévisualiser en local, le plus simple :
   - installe l'extension **Live Server** (Ritwick Dey),
   - clic droit sur `index.html` → **Open with Live Server**.
   - (Ouvrir le fichier en double-clic marche aussi, mais Live Server évite certains blocages de chargement des modèles.)

## Utilisation

- **Panneau A — Régie / Enrôlement** : saisis le nom d'un artiste, dépose une ou plusieurs photos nettes (visage de face). Plusieurs photos par artiste = reconnaissance plus fiable.
- **Panneau B — Identification** : dépose une photo. Chaque visage est encadré et comparé au roster. Le VU-mètre indique la force de la correspondance ; la lampe ON AIR s'allume si la correspondance est sûre.
- **Exporter / Importer la base** : sauvegarde ton roster dans un fichier JSON et recharge-le plus tard (c'est la persistance — les données ne sont pas stockées automatiquement).

Seuils de décision (distance euclidienne) : `< 0,45` sûr · `0,45–0,58` probable · au-delà, inconnu.

## Déployer sur Vercel

Site statique, aucune configuration nécessaire.

```bash
git init
git add .
git commit -m "Nostalgie IDENT — phase 1"
# crée un repo sur GitHub puis :
git remote add origin https://github.com/<toi>/nostalgie-ident.git
git push -u origin main
```

Sur vercel.com → **Add New → Project** → importe le repo. Vercel sert `index.html` à la racine automatiquement.
(Alternative sans GitHub : `npm i -g vercel` puis `vercel` dans le dossier.)

## Phase 2 — célébrités mondiales (à venir)

Les stars internationales absentes du roster ne peuvent pas être reconnues côté navigateur.
Le plan : une fonction serverless Vercel (`/api/celeb`) qui reçoit un visage « hors roster »
et appelle **Amazon Rekognition `RecognizeCelebrities`** (clé secrète côté serveur uniquement).
1 000 images/mois gratuites. Retour : nom + lien Wikidata/IMDB.
