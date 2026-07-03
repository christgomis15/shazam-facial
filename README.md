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

Front-end statique + une fonction serverless (`api/celeb.js`). Aucune config manuelle nécessaire,
Vercel détecte et déploie les deux automatiquement.

```bash
git init
git add .
git commit -m "Nostalgie IDENT"
# crée un repo sur GitHub puis :
git remote add origin https://github.com/<toi>/<repo>.git
git push -u origin main
```

Sur vercel.com → **Add New → Project** → importe le repo. Vercel sert `index.html` à la racine
et déploie `api/celeb.js` comme fonction serverless.
(Alternative sans GitHub : `npm i -g vercel` puis `vercel` dans le dossier.)

Pour activer la Phase 2 (célébrités mondiales), configure les variables d'environnement AWS
décrites ci-dessous.

## Phase 2 — célébrités mondiales

Quand un visage identifié est **hors roster**, l'app interroge automatiquement une fonction
serverless Vercel (`api/celeb.js`) qui appelle **Amazon Rekognition `RecognizeCelebrities`**
(clé secrète côté serveur uniquement, jamais exposée au navigateur). 1 000 images/mois gratuites
sur le tier gratuit AWS. Retour : nom de la célébrité + lien (IMDB/Wikidata si disponible).

### Configuration AWS nécessaire

1. Crée un compte AWS si besoin (aws.amazon.com).
2. Dans **IAM → Users**, crée un utilisateur dédié (ex. `nostalgie-rekognition`) avec accès
   programmatique uniquement, et attache la permission `AmazonRekognitionReadOnlyAccess`
   (ou une policy custom limitée à `rekognition:RecognizeCelebrities`).
3. Récupère l'**Access Key ID** et la **Secret Access Key** générées (visibles une seule fois).
4. Dans Vercel → ton projet → **Settings → Environment Variables**, ajoute :
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (ex. `us-east-1` — vérifie que Rekognition y est disponible)
5. Redéploie le projet (un nouveau push suffit, ou **Redeploy** depuis le dashboard) pour que
   les variables soient prises en compte.

Sans ces variables, l'app fonctionne normalement pour le roster local ; la recherche de
célébrités affichera simplement un message d'indisponibilité.
